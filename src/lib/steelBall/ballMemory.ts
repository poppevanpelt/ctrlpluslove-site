import {
  createSteelBallTrace,
  getEffectiveSteelBallState,
  pristineSteelBallState,
  shouldPersistTrace,
  type SteelBallConditionInput,
  type SteelBallState,
} from "./ballState.ts";
import {
  STEEL_BALL_ACTIVITY_EVENT,
  STEEL_BALL_STATE_EVENT,
  type SteelBallActivity,
  type SteelBallActivityDetail,
  type SteelBallBrowserApi,
} from "./ballEvents.ts";

const STORAGE_KEY = "ctrl-love-steel-ball-memory";
const HEALING_INTERVAL_MS = 1100;

type Listener = (state: SteelBallState) => void;

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStoredState(): SteelBallState {
  if (!canUseBrowserStorage()) {
    return pristineSteelBallState;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as
      | SteelBallState
      | null;

    if (!parsed || typeof parsed.borrowed !== "boolean") {
      return pristineSteelBallState;
    }

    return {
      borrowed: parsed.borrowed,
      trace: shouldPersistTrace(parsed.trace) ? parsed.trace : null,
    };
  } catch {
    return pristineSteelBallState;
  }
}

function writeStoredState(state: SteelBallState) {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function dispatchState(state: SteelBallState) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(STEEL_BALL_STATE_EVENT, { detail: state }));
}

function dispatchActivity(detail: SteelBallActivityDetail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(STEEL_BALL_ACTIVITY_EVENT, { detail }));
}

function cloneState(state: SteelBallState): SteelBallState {
  return {
    borrowed: state.borrowed,
    trace: state.trace ? { ...state.trace } : null,
  };
}

export class SteelBallMemory {
  private state: SteelBallState;
  private listeners = new Set<Listener>();
  private healingInterval = 0;

  constructor(initialState: SteelBallState = readStoredState()) {
    this.state = cloneState(initialState);
    this.startHealing();
  }

  getState(now = Date.now()) {
    return cloneState(getEffectiveSteelBallState(this.state, now));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  setCondition(input: SteelBallConditionInput) {
    const nextState = {
      ...this.state,
      trace: createSteelBallTrace(input),
    };

    return this.commit(nextState, "condition-set", {
      source: input.source,
      note: input.condition,
    });
  }

  clearCondition(options: { actor?: string; note?: string } = {}) {
    return this.commit(
      {
        ...this.state,
        trace: null,
      },
      "condition-cleared",
      options,
    );
  }

  borrow(options: { actor?: string; note?: string } = {}) {
    return this.commit(
      {
        ...this.state,
        borrowed: true,
      },
      "borrowed",
      options,
    );
  }

  returnBall(options: {
    actor?: string;
    note?: string;
    condition?: SteelBallConditionInput;
  } = {}) {
    return this.commit(
      {
        borrowed: false,
        trace: options.condition ? createSteelBallTrace(options.condition) : this.state.trace,
      },
      "returned",
      {
        actor: options.actor,
        note: options.note,
        source: options.condition?.source,
      },
    );
  }

  isBorrowed() {
    return this.state.borrowed;
  }

  private commit(
    nextState: SteelBallState,
    activity: SteelBallActivity,
    options: { actor?: string; note?: string; source?: SteelBallActivityDetail["source"] } = {},
  ) {
    this.state = cloneState(nextState);
    const effectiveState = this.getState();
    writeStoredState(this.state);
    this.emit(effectiveState);
    dispatchActivity({
      activity,
      actor: options.actor,
      note: options.note,
      source: options.source,
      state: effectiveState,
    });
    this.startHealing();

    return effectiveState;
  }

  private emit(state: SteelBallState) {
    for (const listener of this.listeners) {
      listener(cloneState(state));
    }

    dispatchState(state);
  }

  private startHealing() {
    if (typeof window === "undefined" || this.healingInterval) {
      return;
    }

    this.healingInterval = window.setInterval(() => {
      const effectiveState = this.getState();

      if (this.state.trace && !effectiveState.trace) {
        this.state = {
          ...this.state,
          trace: null,
        };
        writeStoredState(this.state);
      }

      this.emit(effectiveState);

      if (!this.state.trace) {
        window.clearInterval(this.healingInterval);
        this.healingInterval = 0;
      }
    }, HEALING_INTERVAL_MS);
  }

  asBrowserApi(): SteelBallBrowserApi {
    return {
      setCondition: (input) => this.setCondition(input),
      clearCondition: (options) => this.clearCondition(options),
      borrow: (options) => this.borrow(options),
      return: (options) => this.returnBall(options),
      isBorrowed: () => this.isBorrowed(),
      getState: () => this.getState(),
      subscribe: (listener) => this.subscribe(listener),
    };
  }
}

export const steelBall = new SteelBallMemory();

export function installSteelBallBrowserApi() {
  if (typeof window === "undefined") {
    return steelBall.asBrowserApi();
  }

  const api = steelBall.asBrowserApi();
  window.steelBall = api;
  dispatchState(api.getState());

  return api;
}
