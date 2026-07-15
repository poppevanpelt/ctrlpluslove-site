import type { RoomEnv } from "../env.ts";
import { buildRoomPrompt, ROOM_SYSTEM_PROMPT } from "./buildRoomPrompt.ts";
import { createJsonChatCompletion } from "./openaiClient.ts";
import { parseRoomResult } from "./resultSchema.ts";
import type { ChangeSignal, PageContext, RoomRefreshResult } from "./types.ts";

export async function runRoomEngine(
  env: RoomEnv,
  context: PageContext,
  meaningfulSignals: ChangeSignal[],
): Promise<RoomRefreshResult> {
  const prompt = buildRoomPrompt(context, meaningfulSignals);
  const first = await createJsonChatCompletion(env, [
    { role: "system", content: ROOM_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);

  try {
    return parseRoomResult(JSON.parse(first));
  } catch (error) {
    const repaired = await createJsonChatCompletion(env, [
      { role: "system", content: `${ROOM_SYSTEM_PROMPT}\nRepair the supplied invalid JSON to the required shape.` },
      {
        role: "user",
        content: JSON.stringify({
          validationError: error instanceof Error ? error.message : "Invalid model output",
          invalidOutput: first,
        }),
      },
    ]);

    return parseRoomResult(JSON.parse(repaired));
  }
}
