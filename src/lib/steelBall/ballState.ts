import { steelBallIdentity } from "./ballIdentity.ts";
import {
  normalizeBallIntegrity,
  pristineBallIntegrity,
} from "./ballIntegrity.ts";
import type {
  BallAvailability,
  BallCondition,
  BallConditionSource,
  BallLocation,
  BallOwner,
  SteelBallConditionInput,
  SteelBallConditionTrace,
  SteelBallState,
} from "./types.ts";

export type {
  BallAvailability as SteelBallStatus,
  BallCondition as SteelBallCondition,
  BallConditionSource as SteelBallSource,
  BallLocation as SteelBallLocation,
  BallOwner as SteelBallOwner,
  SteelBallConditionInput,
  SteelBallConditionTrace,
  SteelBallState,
} from "./types.ts";

const DEFAULT_DURATION_MS: Record<Exclude<BallCondition, "baseline">, number> = {
  scratched: 180_000,
  polished: 150_000,
  dusty: 180_000,
  warm: 8_000,
};

export const pristineSteelBallState: SteelBallState = {
  identity: steelBallIdentity,
  location: "hero-stage",
  currentlyWith: "visitor",
  availability: "available",
  condition: "baseline",
  conditionIntensity: 0,
  isCustomCursorActive: false,
  isResting: true,
  gravityOffset: { x: 0, y: 0 },
  history: [],
  trace: null,
  integrity: pristineBallIntegrity,
  lastKnownLocation: "hero-stage",
  borrowed: false,
  status: "available",
};

export const baselineSteelBallState = pristineSteelBallState;

export function clampIntensity(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function parseTimestamp(value: number | string | undefined, fallback = Date.now()) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function createSteelBallTrace(
  input: SteelBallConditionInput,
  eventId: string,
  now = Date.now(),
): SteelBallConditionTrace {
  const startedAt = parseTimestamp(input.timestamp, now);
  const duration = input.durationMs ?? input.expiresAfter ?? DEFAULT_DURATION_MS[input.condition];

  return {
    condition: input.condition,
    source: input.source ?? "unknown",
    intensity: clampIntensity(input.intensity ?? 0.18),
    startedAt,
    expiresAt: duration > 0 ? startedAt + duration : undefined,
    eventId,
  };
}

export function getTraceAge(trace: SteelBallConditionTrace, now = Date.now()) {
  return Math.max(0, now - trace.startedAt);
}

export function getEffectiveTrace(
  trace: SteelBallConditionTrace | null,
  now = Date.now(),
): SteelBallConditionTrace | null {
  if (!trace || trace.intensity <= 0) {
    return null;
  }

  if (!trace.expiresAt) {
    return trace;
  }

  const duration = Math.max(1, trace.expiresAt - trace.startedAt);
  const progress = Math.min(1, Math.max(0, (now - trace.startedAt) / duration));
  const intensity = clampIntensity(trace.intensity * Math.pow(1 - progress, 1.7));

  if (intensity < 0.015) {
    return null;
  }

  return {
    ...trace,
    intensity,
  };
}

export function getEffectiveSteelBallState(
  state: SteelBallState,
  now = Date.now(),
): SteelBallState {
  const trace = getEffectiveTrace(state.trace, now);
  const condition = trace?.condition ?? "baseline";

  return normalizeSteelBallState({
    ...state,
    condition,
    conditionIntensity: trace?.intensity ?? 0,
    conditionSource: trace?.source,
    conditionStartedAt: trace?.startedAt,
    conditionExpiresAt: trace?.expiresAt,
    trace,
  }, now);
}

export function shouldPersistTrace(trace: SteelBallConditionTrace | null, now = Date.now()) {
  return Boolean(getEffectiveTrace(trace, now));
}

export function normalizeOwner(value: unknown): BallOwner {
  const allowed: BallOwner[] = ["ctrl-love-office", "visitor", "mira", "robert", "ravi", "unknown"];
  return allowed.includes(value as BallOwner) ? value as BallOwner : "unknown";
}

export function normalizeLocation(value: unknown): BallLocation {
  const legacy: Record<string, BallLocation> = {
    calibration: "calibration-range",
    pinball: "pinball-room",
  };
  const allowed: BallLocation[] = [
    "hero-stage",
    "visitor",
    "office",
    "pinball-room",
    "calibration-range",
    "embassy",
    "maintenance",
    "unknown",
  ];
  const candidate = typeof value === "string" ? legacy[value] ?? value : "unknown";

  return allowed.includes(candidate as BallLocation) ? candidate as BallLocation : "unknown";
}

export function normalizeCondition(value: unknown): BallCondition {
  if (value === "pristine") {
    return "baseline";
  }

  const allowed: BallCondition[] = ["baseline", "scratched", "polished", "dusty", "warm"];
  return allowed.includes(value as BallCondition) ? value as BallCondition : "baseline";
}

export function normalizeAvailability(value: unknown): BallAvailability {
  const allowed: BallAvailability[] = ["available", "borrowed", "returning", "maintenance"];
  return allowed.includes(value as BallAvailability) ? value as BallAvailability : "available";
}

function normalizeSource(value: unknown): BallConditionSource | undefined {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  return value as BallConditionSource;
}

export function normalizeSteelBallState(value: Partial<SteelBallState> | null | undefined, now = Date.now()): SteelBallState {
  const base = pristineSteelBallState;
  const requestedAvailability = normalizeAvailability(value?.availability ?? value?.status);
  const borrowed = Boolean(
    value?.borrowed ??
    (requestedAvailability === "borrowed" || requestedAvailability === "maintenance"),
  );
  const availability = requestedAvailability === "maintenance"
    ? "maintenance"
    : borrowed
      ? "borrowed"
      : requestedAvailability;
  const location = normalizeLocation(value?.location ?? (borrowed ? "office" : base.location));
  const trace = shouldPersistTrace(value?.trace ?? null, now) ? value?.trace ?? null : null;
  const condition = trace?.condition ?? normalizeCondition(value?.condition);

  return {
    ...base,
    ...value,
    identity: steelBallIdentity,
    location,
    currentlyWith: borrowed ? normalizeOwner(value?.currentlyWith ?? "ctrl-love-office") : normalizeOwner(value?.currentlyWith ?? "visitor"),
    availability,
    condition,
    conditionIntensity: clampIntensity(trace?.intensity ?? value?.conditionIntensity ?? 0),
    conditionSource: trace?.source ?? normalizeSource(value?.conditionSource),
    conditionStartedAt: trace?.startedAt ?? value?.conditionStartedAt,
    conditionExpiresAt: trace?.expiresAt ?? value?.conditionExpiresAt,
    history: Array.isArray(value?.history) ? value.history.slice(-25) : [],
    trace,
    integrity: normalizeBallIntegrity(value?.integrity),
    lastKnownLocation: normalizeLocation(value?.lastKnownLocation ?? location),
    borrowed,
    status: availability,
    gravityOffset: {
      x: Number.isFinite(value?.gravityOffset?.x) ? value?.gravityOffset?.x ?? 0 : 0,
      y: Number.isFinite(value?.gravityOffset?.y) ? value?.gravityOffset?.y ?? 0 : 0,
    },
    isCustomCursorActive: Boolean(value?.isCustomCursorActive),
    isResting: Boolean(value?.isResting ?? true),
  };
}
