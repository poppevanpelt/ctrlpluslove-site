import type { PageContext, ChangeDetectionResult, ChangeSignal, StateMarker } from "./types.ts";
import { buildFingerprint } from "./buildFingerprint.ts";
import { classifyChanges } from "./classifyChanges.ts";
import { pageTextFromBlocks } from "../notion/readPageContext.ts";

export function detectChanges(
  context: PageContext,
  previous: StateMarker | null,
  runVersion: number,
): ChangeDetectionResult {
  const marker = buildFingerprint(context, runVersion);

  if (previous?.fingerprint === marker.fingerprint) {
    return {
      previousFingerprint: previous.fingerprint,
      currentFingerprint: marker.fingerprint,
      changed: false,
      signals: [],
    };
  }

  const signals: ChangeSignal[] = [];
  const previousCommentMarker = previous?.lastProcessedComment ?? "";

  for (const comment of context.comments) {
    const commentMarker = comment.lastEditedTime ?? comment.createdTime ?? comment.id;

    if (previousCommentMarker && commentMarker <= previousCommentMarker) {
      continue;
    }

    signals.push({
      source: "comment",
      author: comment.author,
      summary: comment.plainText.slice(0, 240),
      text: comment.plainText,
      meaningful: false,
      reason: "",
    });
  }

  signals.push({
    source: "page_edit",
    summary: "The page content or tracked properties changed since the previous processed state.",
    text: pageTextFromBlocks(context.blocks).slice(0, 4000),
    meaningful: false,
    reason: "",
  });

  return {
    previousFingerprint: previous?.fingerprint,
    currentFingerprint: marker.fingerprint,
    changed: true,
    signals: classifyChanges(signals),
  };
}
