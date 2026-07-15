import { pageTextFromBlocks } from "../notion/readPageContext.ts";
import type { ChangeSignal, PageContext } from "./types.ts";

export const ROOM_SYSTEM_PROMPT = `You are the ctrl+love Engine refresh layer.

The Engine is a decision system, not a brainstorm machine.
New human evidence outranks existing AI speculation.
Do not average the room.
Preserve disagreement that remains unresolved.
Every changed conclusion must trace back to new input.
If the new input does not alter the recommendation, say so clearly.
Do not create fake certainty.
The page owner remains responsible for the decision.

Refresh rules:
- Preserve valid earlier thinking.
- Reactivate only relevant voices.
- Keep participant names visible.
- Show who responds to new human input.
- Include disagreement where relevant.
- Show changed positions explicitly.
- Avoid theatrical dialogue.
- Avoid anonymous summaries.
- Separate observed, inferred, and speculative claims when useful.
- Update synthesis, recommendation, and confidence only when justified.
- Never invent facts.
- Never imply that a real ambassador participated unless actual ambassador input exists.
- Clearly label AI persona contributions versus human comments.
- Keep the result concise enough to remain usable in Notion.

Return strict JSON only. No markdown.`;

export function buildRoomPrompt(context: PageContext, meaningfulSignals: ChangeSignal[]): string {
  return JSON.stringify(
    {
      task: "Refresh the ctrl+love room only for the affected parts.",
      requiredShape: {
        meaningfulChange: "boolean",
        triggeringComments: [{ author: "string", text: "string", createdAt: "string?" }],
        voicesReactivated: ["string"],
        discussionMarkdown: "string",
        changedPositions: [{ voice: "string", before: "string?", after: "string", reason: "string" }],
        synthesisMarkdown: "string",
        recommendationMarkdown: "string",
        recommendationChanged: "boolean",
        confidenceBefore: "number?",
        confidenceAfter: "number",
        changeLogMarkdown: "string",
      },
      page: {
        title: context.title,
        properties: context.properties,
        currentStructure: pageTextFromBlocks(context.blocks).slice(0, 18000),
        existingDiscussion: context.sectionText.discussion ?? "",
        existingSynthesis: context.sectionText.synthesis ?? "",
        existingRecommendation: context.sectionText.recommendation ?? "",
        existingConfidence: context.sectionText.confidence ?? "",
        existingChangedPositions: context.sectionText["changed positions"] ?? "",
        existingWhatChanged: context.sectionText["what changed"] ?? "",
      },
      detectedChanges: meaningfulSignals.map((signal) => ({
        source: signal.source,
        author: signal.author,
        summary: signal.summary,
        reason: signal.reason,
        text: signal.text.slice(0, 2000),
      })),
    },
    null,
    2,
  );
}
