import type { RoomStatus } from "./types.ts";

export type RunEligibilityInput = {
  status: RoomStatus | null;
  force?: boolean;
  refreshRequestedAt?: string | null;
  lastRoomRun?: string | null;
  now: string;
  minimumIntervalMinutes: number;
  staleRequestHours: number;
};

export type RunEligibility =
  | { allowed: true }
  | {
      allowed: false;
      reason:
        | "already_running"
        | "not_requested"
        | "stale_request"
        | "already_processed"
        | "minimum_interval";
      summary: string;
    };

function minutesBetween(olderIso: string, newerIso: string): number {
  return (new Date(newerIso).getTime() - new Date(olderIso).getTime()) / 60000;
}

function hoursBetween(olderIso: string, newerIso: string): number {
  return (new Date(newerIso).getTime() - new Date(olderIso).getTime()) / 3600000;
}

export function evaluateRunEligibility(input: RunEligibilityInput): RunEligibility {
  if (input.status === "Running") {
    return { allowed: false, reason: "already_running", summary: "Page is already running." };
  }

  if (!input.force && input.status !== "Refresh requested") {
    return {
      allowed: false,
      reason: "not_requested",
      summary: `Page status is ${input.status ?? "unknown"}, not Refresh requested.`,
    };
  }

  if (
    !input.force &&
    input.refreshRequestedAt &&
    hoursBetween(input.refreshRequestedAt, input.now) > input.staleRequestHours
  ) {
    return {
      allowed: false,
      reason: "stale_request",
      summary: "Refresh request is stale and was not processed automatically.",
    };
  }

  if (
    !input.force &&
    input.refreshRequestedAt &&
    input.lastRoomRun &&
    new Date(input.lastRoomRun).getTime() >= new Date(input.refreshRequestedAt).getTime()
  ) {
    return {
      allowed: false,
      reason: "already_processed",
      summary: "Latest refresh request was already processed.",
    };
  }

  if (
    !input.force &&
    input.lastRoomRun &&
    minutesBetween(input.lastRoomRun, input.now) < input.minimumIntervalMinutes
  ) {
    return {
      allowed: false,
      reason: "minimum_interval",
      summary: "Minimum run interval has not elapsed.",
    };
  }

  return { allowed: true };
}
