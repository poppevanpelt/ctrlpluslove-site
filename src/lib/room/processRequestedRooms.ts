import type { RoomEnv } from "../env.ts";
import { findRequestedPages } from "../notion/findRequestedPages.ts";
import { roomLog } from "./logger.ts";
import { runRoom } from "./runRoom.ts";

export async function processRequestedRooms(env: RoomEnv) {
  const startedAt = Date.now();
  const limit = Math.min(env.roomMaxRunsPerCycle, 3);
  const pages = await findRequestedPages(env, limit);
  const results = [];

  for (const page of pages) {
    results.push(await runRoom(env, { pageId: page.id, force: false }));
  }

  roomLog("info", {
    stage: "room-refresh-batch-complete",
    result: `processed ${results.length}`,
    durationMs: Date.now() - startedAt,
  });

  return {
    scanned: pages.length,
    processed: results.length,
    dryRun: env.dryRun,
    results,
    durationMs: Date.now() - startedAt,
  };
}
