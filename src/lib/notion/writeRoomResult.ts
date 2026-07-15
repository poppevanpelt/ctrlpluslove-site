import type { RoomEnv } from "../env.ts";
import type { PageSection, RoomRefreshResult } from "../room/types.ts";
import { notionRequest } from "./client.ts";

type NotionBlock = Record<string, unknown>;

const CONTROLLED_ROOM_HEADINGS = new Set([
  "discussion",
  "changed positions",
  "synthesis",
  "recommendation",
  "confidence",
  "what changed",
  "latest room refresh",
  "room run history",
]);

function richText(content: string) {
  return [{ type: "text", text: { content: content.slice(0, 1900) } }];
}

function paragraph(content: string): NotionBlock {
  return { object: "block", type: "paragraph", paragraph: { rich_text: richText(content) } };
}

function heading(level: 2 | 3, content: string): NotionBlock {
  const type = `heading_${level}`;
  return { object: "block", type, [type]: { rich_text: richText(content) } };
}

function bulleted(content: string): NotionBlock {
  return { object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: richText(content) } };
}

function blocksForResult(result: RoomRefreshResult, runVersion: number, timestamp: string): NotionBlock[] {
  const blocks: NotionBlock[] = [
    heading(2, "Discussion"),
    paragraph(result.discussionMarkdown),
    heading(2, "Changed positions"),
    ...(result.changedPositions.length > 0
      ? result.changedPositions.map((position) =>
          bulleted(`${position.voice}: ${position.before ? `${position.before} -> ` : ""}${position.after}. Reason: ${position.reason}`),
        )
      : [paragraph("No explicit position changes.")]),
    heading(2, "Synthesis"),
    paragraph(result.synthesisMarkdown),
    heading(2, "Recommendation"),
    paragraph(result.recommendationMarkdown),
    heading(2, "Confidence"),
    paragraph(
      [result.confidenceBefore !== undefined ? `Before: ${result.confidenceBefore}` : null,
        result.confidenceAfter !== undefined ? `After: ${result.confidenceAfter}` : null,
        `Recommendation changed: ${result.recommendationChanged ? "yes" : "no"}`]
        .filter(Boolean)
        .join(" / "),
    ),
    heading(2, "What changed"),
    paragraph(result.changeLogMarkdown),
    heading(3, `Run v${runVersion} - ${timestamp}`),
    ...result.triggeringComments.map((comment) =>
      bulleted(`${comment.author}${comment.createdAt ? ` (${comment.createdAt})` : ""}: ${comment.text}`),
    ),
  ];

  return blocks;
}

function isHeading(block: PageSection): boolean {
  return block.type.startsWith("heading_");
}

function isControlledHeading(block: PageSection): boolean {
  return isHeading(block) && CONTROLLED_ROOM_HEADINGS.has(block.text.trim().toLowerCase());
}

export function controlledBlockIdsForArchive(blocks: PageSection[]): string[] {
  const ids = new Set<string>();

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (!isControlledHeading(block)) {
      continue;
    }

    ids.add(block.id);

    for (let nextIndex = index + 1; nextIndex < blocks.length; nextIndex += 1) {
      const candidate = blocks[nextIndex];

      if (isHeading(candidate)) {
        break;
      }

      ids.add(candidate.id);
    }
  }

  return [...ids];
}

async function archiveBlocks(env: RoomEnv, blockIds: string[]) {
  for (const blockId of blockIds) {
    await notionRequest(env, `/blocks/${blockId}`, {
      method: "PATCH",
      body: { archived: true },
    });
  }
}

export async function writeRoomResult(
  env: RoomEnv,
  pageId: string,
  result: RoomRefreshResult,
  runVersion: number,
  timestamp: string,
  existingBlocks: PageSection[],
) {
  const controlledBlockIds = controlledBlockIdsForArchive(existingBlocks);

  await archiveBlocks(env, controlledBlockIds);

  await notionRequest(env, `/blocks/${pageId}/children`, {
    method: "PATCH",
    body: {
      children: blocksForResult(result, runVersion, timestamp),
    },
  });
}
