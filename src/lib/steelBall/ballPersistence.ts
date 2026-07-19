import {
  normalizeSteelBallState,
  pristineSteelBallState,
  shouldPersistTrace,
  type SteelBallState,
} from "./ballState.ts";
import { toPersistedIntegrity } from "./ballIntegrity.ts";

export const STEEL_BALL_STORAGE_KEY = "ctrl-love-steel-ball-continuity";
export const LEGACY_STEEL_BALL_STORAGE_KEY = "ctrl-love-steel-ball-memory";
export const STEEL_BALL_STORAGE_VERSION = 2;

type StoredSteelBallState = {
  version: number;
  state: Partial<SteelBallState>;
};

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function toPersistedSteelBallState(state: SteelBallState, now = Date.now()): StoredSteelBallState {
  return {
    version: STEEL_BALL_STORAGE_VERSION,
    state: {
      location: state.location,
      currentlyWith: state.currentlyWith,
      availability: state.availability,
      condition: state.condition,
      conditionIntensity: state.conditionIntensity,
      conditionSource: state.conditionSource,
      conditionStartedAt: state.conditionStartedAt,
      conditionExpiresAt: state.conditionExpiresAt,
      history: state.history.slice(-25),
      integrity: toPersistedIntegrity(state.integrity),
      lastKnownLocation: state.lastKnownLocation,
      borrowed: state.borrowed,
      status: state.status,
      trace: shouldPersistTrace(state.trace, now) ? state.trace : null,
    },
  };
}

export function hydrateSteelBallState(value: unknown, now = Date.now()): SteelBallState {
  if (!value || typeof value !== "object") {
    return pristineSteelBallState;
  }

  const maybeRecord = value as Partial<StoredSteelBallState> & Partial<SteelBallState>;
  const rawState = typeof maybeRecord.version === "number" && "state" in maybeRecord
    ? maybeRecord.state
    : maybeRecord;

  return normalizeSteelBallState({
    ...rawState,
    integrity: rawState?.integrity ? toPersistedIntegrity(rawState.integrity) : undefined,
    trace: shouldPersistTrace(rawState?.trace ?? null, now) ? rawState?.trace ?? null : null,
  });
}

export function readPersistedSteelBallState(now = Date.now()): SteelBallState {
  if (!canUseBrowserStorage()) {
    return pristineSteelBallState;
  }

  try {
    const stored = window.localStorage.getItem(STEEL_BALL_STORAGE_KEY);
    const legacy = window.localStorage.getItem(LEGACY_STEEL_BALL_STORAGE_KEY);
    return hydrateSteelBallState(JSON.parse(stored ?? legacy ?? "null"), now);
  } catch {
    return pristineSteelBallState;
  }
}

export function writePersistedSteelBallState(state: SteelBallState, now = Date.now()) {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STEEL_BALL_STORAGE_KEY,
      JSON.stringify(toPersistedSteelBallState(state, now)),
    );
  } catch {}
}
