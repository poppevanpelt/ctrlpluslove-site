import type { RoomEnv } from "../env.ts";
import { readPageContext } from "../notion/readPageContext.ts";
import { retrievePage, safeUpdateRunStatus } from "../notion/updateRunStatus.ts";
import { writeRoomResult } from "../notion/writeRoomResult.ts";
import {
  assertRoomStatus,
  getDateProperty,
  getNumberProperty,
  getSelectProperty,
} from "../notion/propertyHelpers.ts";
import { buildFingerprint, parseStateMarker, serializeStateMarker } from "./buildFingerprint.ts";
import { detectChanges } from "./detectChanges.ts";
import { roomLog } from "./logger.ts";
import { rerunRoomEngine } from "../engine/rerun-room.ts";
import { evaluateRunEligibility } from "./runGuards.ts";
import type { RunRoomOptions, RunRoomOutcome } from "./types.ts";

function shortError(error: unknown): string {
  if (error instanceof Error) {
    return error.message.slice(0, 1800);
  }

  return "Unknown Re-run Room failure.";
}

export async function runRoom(env: RoomEnv, options: RunRoomOptions): Promise<RunRoomOutcome> {
  const startedAt = Date.now();
  const now = new Date().toISOString();
  let runVersion = 0;
  let lockedPageForFailure: Awaited<ReturnType<typeof retrievePage>> | null = null;

  try {
    roomLog("info", { pageId: options.pageId, stage: "start" });
    const initialPage = await retrievePage(env, options.pageId);
    const status = assertRoomStatus(getSelectProperty(initialPage, "Room Status"));
    runVersion = getNumberProperty(initialPage, "Run Version");
    const refreshRequestedAt = getDateProperty(initialPage, "Refresh Requested At");
    const lastRoomRun = getDateProperty(initialPage, "Last Room Run");
    const runId = `${options.pageId}:${refreshRequestedAt ?? "manual"}`;
    const eligibility = evaluateRunEligibility({
      status,
      force: options.force,
      refreshRequestedAt,
      lastRoomRun,
      now,
      minimumIntervalMinutes: env.roomMinimumIntervalMinutes,
      staleRequestHours: env.roomStaleRequestHours,
    });

    if (!eligibility.allowed && eligibility.reason === "already_processed") {
      if (!env.dryRun) {
        await safeUpdateRunStatus(env, initialPage, "Updated", {
          summary: eligibility.summary,
          error: "",
        });
      }
      return {
        pageId: options.pageId,
        status: "skipped",
        runId,
        runVersion,
        summary: eligibility.summary,
      };
    }

    if (!eligibility.allowed) {
      return {
        pageId: options.pageId,
        status: "skipped",
        runId,
        runVersion,
        summary: eligibility.summary,
      };
    }

    if (!env.dryRun) {
      await safeUpdateRunStatus(env, initialPage, "Running", { error: "" });
    }
    roomLog("info", {
      pageId: options.pageId,
      runVersion,
      stage: env.dryRun ? "dry-run-lock-skip" : "lock",
      result: env.dryRun ? "dry-run" : "running",
      message: runId,
    });

    const lockedPage = env.dryRun ? initialPage : await retrievePage(env, options.pageId);
    lockedPageForFailure = lockedPage;
    const lockedStatus = assertRoomStatus(getSelectProperty(lockedPage, "Room Status"));

    if (!env.dryRun && lockedStatus !== "Running") {
      return {
        pageId: options.pageId,
        status: "skipped",
        runId,
        runVersion,
        summary: "Duplicate-run guard stopped processing after lock verification.",
      };
    }

    const context = await readPageContext(env, lockedPage);
    const previousMarker = parseStateMarker(String(context.properties["Last Processed Comment"] ?? ""));
    const detection = detectChanges(context, previousMarker, runVersion);
    const meaningfulSignals = detection.signals.filter((signal) => signal.meaningful);
    const nextVersion = runVersion + 1;
    const lastProcessedComment =
      context.comments
        .map((comment) => comment.lastEditedTime ?? comment.createdTime ?? comment.id)
        .sort()
        .at(-1) ?? previousMarker?.lastProcessedComment ?? "";

    roomLog("info", {
      pageId: options.pageId,
      runVersion,
      stage: "classify",
      result: `${meaningfulSignals.length} meaningful`,
      message: `${context.comments.length} comments read`,
    });

    if (!options.force && (!detection.changed || meaningfulSignals.length === 0)) {
      const marker = buildFingerprint(context, runVersion, { idempotencyKey: runId, lastProcessedComment });
      if (!env.dryRun) {
        await safeUpdateRunStatus(env, lockedPage, "Updated", {
          lastRoomRun: now,
          lastProcessedComment: serializeStateMarker(marker),
          summary: "No material change detected",
          error: "",
        });
      }

      return {
        pageId: options.pageId,
        status: "updated",
        runId,
        runVersion,
        summary: "No material change detected",
        meaningfulChange: false,
        dryRun: env.dryRun,
      };
    }

    const preModelPage = env.dryRun ? lockedPage : await retrievePage(env, options.pageId);
    const preModelStatus = assertRoomStatus(getSelectProperty(preModelPage, "Room Status"));

    if (!env.dryRun && preModelStatus !== "Running") {
      return {
        pageId: options.pageId,
        status: "skipped",
        runId,
        runVersion,
        summary: "Duplicate-run guard stopped processing before model call.",
      };
    }

    const modelStartedAt = Date.now();
    const result = await rerunRoomEngine(env, context, meaningfulSignals);
    roomLog("info", {
      pageId: options.pageId,
      runVersion,
      stage: "model",
      durationMs: Date.now() - modelStartedAt,
      result: result.meaningfulChange ? "meaningful" : "no-change",
    });

    const marker = buildFingerprint(context, nextVersion, { idempotencyKey: runId, lastProcessedComment });

    if (env.dryRun) {
      return {
        pageId: options.pageId,
        status: "updated",
        runId,
        runVersion,
        summary: result.changeLogMarkdown,
        meaningfulChange: result.meaningfulChange,
        dryRun: true,
        result,
      };
    }

    await writeRoomResult(env, options.pageId, result, nextVersion, now, context.blocks);
    await safeUpdateRunStatus(env, lockedPage, "Updated", {
      lastRoomRun: now,
      lastProcessedComment: serializeStateMarker(marker),
      summary: result.changeLogMarkdown,
      error: "",
      runVersion: nextVersion,
    });

    roomLog("info", {
      pageId: options.pageId,
      runVersion: nextVersion,
      stage: "complete",
      result: "updated",
      durationMs: Date.now() - startedAt,
    });

    return {
      pageId: options.pageId,
      status: "updated",
      runId,
      runVersion: nextVersion,
      summary: result.changeLogMarkdown,
      meaningfulChange: result.meaningfulChange,
      dryRun: false,
    };
  } catch (error) {
    const message = shortError(error);
    roomLog("error", {
      pageId: options.pageId,
      runVersion,
      stage: "failed",
      result: "failed",
      durationMs: Date.now() - startedAt,
      errorCategory: error instanceof Error ? error.name : "UnknownError",
      message,
    });

    try {
      if (env.dryRun) {
        return {
          pageId: options.pageId,
          status: "failed",
          runVersion,
          summary: "Dry-run Re-run Room failed.",
          error: message,
          dryRun: true,
        };
      }

      const failurePage = lockedPageForFailure ?? (await retrievePage(env, options.pageId));
      await safeUpdateRunStatus(env, failurePage, "Failed", { error: message });
    } catch (statusError) {
      roomLog("error", {
        pageId: options.pageId,
        runVersion,
        stage: "failed-status-write",
        errorCategory: statusError instanceof Error ? statusError.name : "UnknownError",
        message: shortError(statusError),
      });
    }

    return {
      pageId: options.pageId,
      status: "failed",
      runVersion,
      summary: "Re-run Room failed.",
      error: message,
    };
  }
}
