import { createHash } from "crypto";
import type { PageContext, StateMarker } from "./types.ts";
import { pageTextFromBlocks } from "../notion/readPageContext.ts";

function normalizeText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim()
    .toLowerCase();
}

export function buildFingerprint(
  context: PageContext,
  runVersion: number,
  extras: Pick<StateMarker, "idempotencyKey" | "lastProcessedComment"> = {},
): StateMarker {
  const relevantProperties = Object.fromEntries(
    Object.entries(context.properties)
      .filter(([name]) => !["Room Status", "Room Error", "Last Room Summary", "Last Room Run"].includes(name))
      .sort(([a], [b]) => a.localeCompare(b)),
  );

  const commentMarkers = context.comments.map((comment) => ({
    id: comment.id,
    discussionId: comment.discussionId,
    parentId: comment.parentId,
    createdTime: comment.createdTime,
    lastEditedTime: comment.lastEditedTime,
    text: normalizeText(comment.plainText),
  }));

  const payload = JSON.stringify({
    title: normalizeText(context.title),
    properties: relevantProperties,
    text: normalizeText(pageTextFromBlocks(context.blocks)),
    sections: Object.fromEntries(
      Object.entries(context.sectionText)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, normalizeText(value)]),
    ),
    comments: commentMarkers,
    runVersion,
  });

  return {
    fingerprint: createHash("sha256").update(payload).digest("hex"),
    generatedAt: new Date().toISOString(),
    runVersion,
    ...extras,
    source: "ctrl-love-room-v1",
  };
}

export function serializeStateMarker(marker: StateMarker): string {
  return JSON.stringify(marker);
}

export function parseStateMarker(value: string): StateMarker | null {
  if (!value.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<StateMarker>;

    if (
      parsed.source === "ctrl-love-room-v1" &&
      typeof parsed.fingerprint === "string" &&
      typeof parsed.generatedAt === "string" &&
      typeof parsed.runVersion === "number"
    ) {
      return parsed as StateMarker;
    }
  } catch {
    return null;
  }

  return null;
}

export function normalizeForMeaning(value: string): string {
  return normalizeText(value).replace(/[^\p{L}\p{N}\s€$%.-]/gu, "").trim();
}
