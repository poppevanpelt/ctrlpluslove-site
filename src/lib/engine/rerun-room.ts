import type { RoomEnv } from "../env.ts";
import type { ChangeSignal, PageContext, RoomRefreshResult } from "../room/types.ts";
import { runRoomEngine } from "../room/runEngine.ts";

export type { RoomRefreshResult } from "../room/types.ts";

export async function rerunRoomEngine(
  env: RoomEnv,
  context: PageContext,
  meaningfulSignals: ChangeSignal[],
): Promise<RoomRefreshResult> {
  return runRoomEngine(env, context, meaningfulSignals);
}
