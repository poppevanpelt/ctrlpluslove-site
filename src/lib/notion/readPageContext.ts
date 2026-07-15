import type { RoomEnv } from "../env.ts";
import type { NotionPage, PageContext, PageSection } from "../room/types.ts";
import { collectPaginated, notionRequest } from "./client.ts";
import { getPageTitle, pagePropertiesToPlainObject, richTextToPlainText } from "./propertyHelpers.ts";
import { readComments } from "./readComments.ts";

type RawBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function blockText(block: RawBlock): string {
  const payload = block[block.type];

  if (!isRecord(payload)) {
    return "";
  }

  if (Array.isArray(payload.rich_text)) {
    return richTextToPlainText(payload.rich_text);
  }

  if (Array.isArray(payload.title)) {
    return richTextToPlainText(payload.title);
  }

  if (typeof payload.caption === "string") {
    return payload.caption;
  }

  return "";
}

async function readChildBlocks(env: RoomEnv, blockId: string, depth: number): Promise<PageSection[]> {
  const blocks = await collectPaginated<RawBlock>((startCursor) =>
    notionRequest(env, `/blocks/${blockId}/children?page_size=100${startCursor ? `&start_cursor=${startCursor}` : ""}`),
  );

  const sections: PageSection[] = [];

  for (const block of blocks) {
    const text = blockText(block);
    const children = block.has_children ? await readChildBlocks(env, block.id, depth + 1) : [];

    sections.push({
      id: block.id,
      type: block.type,
      depth,
      text,
      children,
    });
  }

  return sections;
}

function flattenBlocks(blocks: PageSection[]): PageSection[] {
  return blocks.flatMap((block) => [block, ...flattenBlocks(block.children)]);
}

function collectSectionText(blocks: PageSection[]): Record<string, string> {
  const wantedHeadings = new Set([
    "discussion",
    "synthesis",
    "recommendation",
    "confidence",
    "what changed",
    "latest room refresh",
    "room run history",
  ]);
  const flattened = flattenBlocks(blocks);
  const sections: Record<string, string> = {};

  for (let index = 0; index < flattened.length; index += 1) {
    const block = flattened[index];
    const heading = block.text.trim().toLowerCase();

    if (!block.type.startsWith("heading_") || !wantedHeadings.has(heading)) {
      continue;
    }

    const nextHeadingIndex = flattened.findIndex(
      (candidate, candidateIndex) =>
        candidateIndex > index && candidate.depth <= block.depth && candidate.type.startsWith("heading_"),
    );
    const end = nextHeadingIndex === -1 ? flattened.length : nextHeadingIndex;
    sections[heading] = flattened
      .slice(index + 1, end)
      .map((candidate) => candidate.text)
      .filter(Boolean)
      .join("\n");
  }

  return sections;
}

export async function readPageContext(env: RoomEnv, page: NotionPage): Promise<PageContext> {
  const blocks = await readChildBlocks(env, page.id, 0);
  const blockIds = [page.id, ...flattenBlocks(blocks).map((block) => block.id)];
  const comments = await readComments(env, blockIds);

  return {
    page,
    title: getPageTitle(page),
    properties: pagePropertiesToPlainObject(page),
    blocks,
    sectionText: collectSectionText(blocks),
    comments,
  };
}

export function pageTextFromBlocks(blocks: PageSection[]): string {
  return flattenBlocks(blocks)
    .map((block) => `${"  ".repeat(block.depth)}${block.type}: ${block.text}`.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join("\n");
}
