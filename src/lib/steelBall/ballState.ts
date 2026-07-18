export type SteelBallCondition =
  | "pristine"
  | "scratched"
  | "polished"
  | "dusty"
  | "warm";

export type SteelBallSource =
  | "office"
  | "pinball"
  | "calibration"
  | "tokyo"
  | "valencia"
  | "unknown";

export type SteelBallTrace = {
  condition: SteelBallCondition;
  source: SteelBallSource;
  intensity: number;
  timestamp: string;
  expiresAfter: number;
};

export type SteelBallState = {
  borrowed: boolean;
  trace: SteelBallTrace | null;
};

export type SteelBallConditionInput = {
  condition: Exclude<SteelBallCondition, "pristine">;
  source?: SteelBallSource;
  intensity?: number;
  timestamp?: string;
  expiresAfter?: number;
};

const DEFAULT_EXPIRES_AFTER: Record<Exclude<SteelBallCondition, "pristine">, number> = {
  scratched: 8 * 60 * 1000,
  polished: 5 * 60 * 1000,
  dusty: 6 * 60 * 1000,
  warm: 9 * 1000,
};

export const pristineSteelBallState: SteelBallState = {
  borrowed: false,
  trace: null,
};

export function clampIntensity(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function createSteelBallTrace(input: SteelBallConditionInput): SteelBallTrace {
  return {
    condition: input.condition,
    source: input.source ?? "unknown",
    intensity: clampIntensity(input.intensity ?? 0.38),
    timestamp: input.timestamp ?? new Date().toISOString(),
    expiresAfter: Math.max(0, input.expiresAfter ?? DEFAULT_EXPIRES_AFTER[input.condition]),
  };
}

export function getTraceAge(trace: SteelBallTrace, now = Date.now()) {
  const timestamp = Date.parse(trace.timestamp);

  if (!Number.isFinite(timestamp)) {
    return 0;
  }

  return Math.max(0, now - timestamp);
}

export function getEffectiveTrace(
  trace: SteelBallTrace | null,
  now = Date.now(),
): SteelBallTrace | null {
  if (!trace || trace.condition === "pristine" || trace.intensity <= 0 || trace.expiresAfter <= 0) {
    return null;
  }

  const progress = Math.min(1, getTraceAge(trace, now) / trace.expiresAfter);
  const remaining = Math.pow(1 - progress, 1.7);
  const intensity = clampIntensity(trace.intensity * remaining);

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
  return {
    borrowed: state.borrowed,
    trace: getEffectiveTrace(state.trace, now),
  };
}

export function shouldPersistTrace(trace: SteelBallTrace | null, now = Date.now()) {
  return Boolean(getEffectiveTrace(trace, now));
}
