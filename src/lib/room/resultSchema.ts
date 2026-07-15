import type { RoomRefreshResult } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}

function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || (typeof value === "number" && Number.isFinite(value));
}

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

export function parseRoomResult(raw: unknown): RoomRefreshResult {
  if (!isRecord(raw)) {
    throw new Error("Model output must be a JSON object.");
  }

  if (typeof raw.meaningfulChange !== "boolean") {
    throw new Error("Model output is missing boolean meaningfulChange.");
  }

  if (
    !isString(raw.discussionMarkdown) ||
    !isString(raw.synthesisMarkdown) ||
    !isString(raw.recommendationMarkdown) ||
    !isString(raw.changeLogMarkdown)
  ) {
    throw new Error("Model output is missing required markdown fields.");
  }

  if (
    typeof raw.recommendationChanged !== "boolean" ||
    !Array.isArray(raw.triggeringComments) ||
    !Array.isArray(raw.voicesReactivated) ||
    !Array.isArray(raw.changedPositions)
  ) {
    throw new Error("Model output has invalid collection fields.");
  }

  const triggeringComments = raw.triggeringComments.map((comment) => {
    if (!isRecord(comment)) throw new Error("Invalid triggering comment.");
    if (!isString(comment.author) || !isString(comment.text) || !isOptionalString(comment.createdAt)) {
      throw new Error("Invalid triggering comment shape.");
    }
    return withoutUndefined({ author: comment.author, text: comment.text, createdAt: comment.createdAt });
  });

  if (!raw.voicesReactivated.every(isString)) {
    throw new Error("Invalid voicesReactivated shape.");
  }

  const changedPositions = raw.changedPositions.map((position) => {
    if (
      !isRecord(position) ||
      !isString(position.voice) ||
      !isOptionalString(position.before) ||
      !isString(position.after) ||
      !isString(position.reason)
    ) {
      throw new Error("Invalid changed position shape.");
    }
    return withoutUndefined({
      voice: position.voice,
      before: position.before,
      after: position.after,
      reason: position.reason,
    });
  });

  if (
    !isOptionalNumber(raw.confidenceBefore) ||
    typeof raw.confidenceAfter !== "number" ||
    !Number.isFinite(raw.confidenceAfter)
  ) {
    throw new Error("Model output has invalid confidence fields.");
  }

  return {
    meaningfulChange: raw.meaningfulChange,
    triggeringComments,
    voicesReactivated: raw.voicesReactivated,
    discussionMarkdown: raw.discussionMarkdown,
    changedPositions,
    synthesisMarkdown: raw.synthesisMarkdown,
    recommendationMarkdown: raw.recommendationMarkdown,
    recommendationChanged: raw.recommendationChanged,
    confidenceBefore: raw.confidenceBefore,
    confidenceAfter: raw.confidenceAfter,
    changeLogMarkdown: raw.changeLogMarkdown,
  };
}
