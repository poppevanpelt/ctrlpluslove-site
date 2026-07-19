import {
  createSteelBallTrace,
  getEffectiveSteelBallState,
  clampIntensity,
  normalizeLocation,
  normalizeSteelBallState,
  type SteelBallConditionInput,
  type SteelBallState,
} from "./ballState.ts";
import {
  completeIntegrityMaintenance,
  decayIntegrityFatigue,
  getIntegrityAppearance,
  registerIntegrityImpact,
} from "./ballIntegrity.ts";
import {
  STEEL_BALL_ACTIVITY_EVENT,
  STEEL_BALL_EVENT,
  STEEL_BALL_STATE_EVENT,
  type SteelBallActivity,
  type SteelBallActivityDetail,
  type SteelBallBrowserApi,
} from "./ballEvents.ts";
import {
  appendSteelBallHistory,
  createSteelBallEvent,
  isEventBackedCondition,
} from "./ballHistory.ts";
import {
  readPersistedSteelBallState,
  writePersistedSteelBallState,
} from "./ballPersistence.ts";
import type {
  BallOwner,
  GravityVector,
  SteelBallBorrowInput,
  SteelBallEvent,
  SteelBallImpactInput,
  SteelBallReturnInput,
} from "./types.ts";

const HEALING_INTERVAL_MS = 1100;
const MAINTENANCE_RETURN_DELAY_MS = 14_000;
const HYDRATED_MAINTENANCE_RETURN_DELAY_MS = 2_400;
const HYDRATED_BORROWED_RETURN_DELAY_MS = 1_200;
const SINGLETON_KEY = Symbol.for("ctrl-love.steelBall.SB-01");

type Listener = (state: SteelBallState) => void;

function cloneState(state: SteelBallState): SteelBallState {
  return {
    ...state,
    identity: { ...state.identity },
    gravityOffset: { ...state.gravityOffset },
    history: state.history.map((event) => ({ ...event })),
    trace: state.trace ? { ...state.trace } : null,
    integrity: {
      ...state.integrity,
      recentImpacts: state.integrity.recentImpacts.map((impact) => ({
        ...impact,
        location: { ...impact.location },
      })),
    },
  };
}

function dispatchState(state: SteelBallState) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STEEL_BALL_STATE_EVENT, { detail: state }));
}

function dispatchEvent(event: SteelBallEvent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STEEL_BALL_EVENT, { detail: event }));
}

function dispatchActivity(detail: SteelBallActivityDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STEEL_BALL_ACTIVITY_EVENT, { detail }));
}

function ownerFromActor(actor: string | undefined, fallback: BallOwner): BallOwner {
  const normalized = actor?.toLowerCase();

  if (normalized === "mira") return "mira";
  if (normalized === "robert") return "robert";
  if (normalized === "ravi") return "ravi";
  if (normalized?.includes("visitor")) return "visitor";
  if (normalized?.includes("office")) return "ctrl-love-office";
  return fallback;
}

function activityForEvent(event: SteelBallEvent): SteelBallActivity {
  if (event.type === "ball.borrowed") return "borrowed";
  if (event.type === "ball.returned") return "returned";
  if (event.type === "ball.condition.cleared") return "condition-cleared";
  if (event.type === "ball.gravity.started") return "gravity-started";
  if (event.type === "ball.gravity.settled") return "gravity-settled";
  if (event.type === "ball.integrity.changed") return "integrity-changed";
  if (event.type === "ball.maintenance.requested") return "maintenance-requested";
  if (event.type === "ball.maintenance.completed") return "maintenance-completed";
  return "condition-set";
}

function traceInputFromReturn(options: SteelBallReturnInput): SteelBallConditionInput | null {
  if (!options.condition) {
    return null;
  }

  if (typeof options.condition === "string") {
    if (options.condition === "baseline") {
      return null;
    }

    return {
      condition: options.condition,
      intensity: options.intensity,
      source: options.source,
    };
  }

  return options.condition;
}

export class SteelBallContinuity {
  private state: SteelBallState;
  private listeners = new Set<Listener>();
  private healingInterval = 0;
  private maintenanceReturnTimeout = 0;
  private integrityTouchedAt = Date.now();
  private debugGravity: GravityVector = { x: 0, y: 0, confidence: 0 };

  constructor(initialState: SteelBallState = readPersistedSteelBallState()) {
    this.state = normalizeSteelBallState(initialState);
    this.startHealing();
    this.scheduleReturnForHydratedBorrow();
  }

  getState(now = Date.now()) {
    return cloneState(getEffectiveSteelBallState(this.getStateWithDecayedIntegrity(now), now));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  setCondition(input: SteelBallConditionInput) {
    const event = createSteelBallEvent({
      type: "ball.condition.changed",
      condition: input.condition,
      source: input.source ?? "manual",
      intensity: input.intensity ?? 0.18,
      note: `${input.condition} condition recorded.`,
    });
    const trace = isEventBackedCondition(event)
      ? createSteelBallTrace(input, event.id, event.timestamp)
      : null;

    return this.commit({
      ...this.state,
      condition: trace?.condition ?? "baseline",
      conditionIntensity: trace?.intensity ?? 0,
      conditionSource: trace?.source,
      conditionStartedAt: trace?.startedAt,
      conditionExpiresAt: trace?.expiresAt,
      history: appendSteelBallHistory(this.state.history, event),
      trace,
    }, event);
  }

  clearCondition(options: { actor?: string; note?: string } = {}) {
    const event = createSteelBallEvent({
      type: "ball.condition.cleared",
      note: options.note ?? "Steel Ball returned to its baseline surface.",
    });

    return this.commit({
      ...this.state,
      condition: "baseline",
      conditionIntensity: 0,
      conditionSource: undefined,
      conditionStartedAt: undefined,
      conditionExpiresAt: undefined,
      history: appendSteelBallHistory(this.state.history, event),
      trace: null,
    }, event, options.actor);
  }

  borrowBall(options: SteelBallBorrowInput = {}) {
    if (this.state.borrowed || this.state.availability === "returning") {
      return this.getState();
    }

    const maintenanceDue = Boolean(this.state.integrity.maintenanceRequestedAt);
    const by = maintenanceDue
      ? options.by ?? ownerFromActor(options.actor, "robert")
      : options.by ?? ownerFromActor(options.actor, "ctrl-love-office");
    const destination = maintenanceDue
      ? "maintenance"
      : normalizeLocation(options.destination ?? options.location ?? "office");
    const event = createSteelBallEvent({
      type: "ball.borrowed",
      by,
      destination,
      reason: maintenanceDue ? options.reason ?? "routine-inspection" : options.reason,
      note: options.note ?? (
        maintenanceDue
          ? "Robert borrowed Steel Ball SB-01 for routine inspection."
          : "The office borrowed Steel Ball SB-01."
      ),
    });

    const nextState = this.commit({
      ...this.state,
      location: destination,
      currentlyWith: by,
      availability: maintenanceDue ? "maintenance" : "borrowed",
      status: maintenanceDue ? "maintenance" : "borrowed",
      borrowed: true,
      isCustomCursorActive: false,
      isResting: false,
      lastKnownLocation: destination,
      history: appendSteelBallHistory(this.state.history, event),
    }, event, options.actor);

    if (maintenanceDue) {
      this.scheduleMaintenanceReturn();
    }

    return nextState;
  }

  borrow(options: SteelBallBorrowInput = {}) {
    return this.borrowBall(options);
  }

  returnBall(options: SteelBallReturnInput = {}) {
    const from = normalizeLocation(options.from ?? this.state.location ?? "office");
    const conditionInput = traceInputFromReturn(options);
    const condition = conditionInput?.condition ?? (typeof options.condition === "string" ? options.condition : undefined);
    const event = createSteelBallEvent({
      type: "ball.returned",
      from,
      condition,
      intensity: conditionInput?.intensity ?? options.intensity,
      source: conditionInput?.source ?? options.source,
      note: options.note ?? "Steel Ball SB-01 returned to the visitor.",
    });
    const trace = conditionInput && isEventBackedCondition(event)
      ? createSteelBallTrace({
        ...conditionInput,
        source: conditionInput.source ?? options.source ?? "office.returned",
      }, event.id, event.timestamp)
      : this.state.trace;

    const completedMaintenance = from === "maintenance" || this.state.location === "maintenance";
    const integrity = completedMaintenance
      ? completeIntegrityMaintenance(this.state.integrity, event.timestamp)
      : this.state.integrity;
    const maintenanceEvent = completedMaintenance
      ? createSteelBallEvent({
        type: "ball.maintenance.completed",
        wear: integrity.wear,
        fatigue: integrity.fatigue,
        note: "Routine inspection completed.",
      }, event.timestamp)
      : null;
    const history = maintenanceEvent
      ? appendSteelBallHistory(appendSteelBallHistory(this.state.history, event), maintenanceEvent)
      : appendSteelBallHistory(this.state.history, event);

    return this.commit({
      ...this.state,
      location: "visitor",
      currentlyWith: "visitor",
      availability: "available",
      status: "available",
      borrowed: false,
      isCustomCursorActive: true,
      isResting: false,
      lastKnownLocation: "visitor",
      condition: trace?.condition ?? "baseline",
      conditionIntensity: trace?.intensity ?? 0,
      conditionSource: trace?.source,
      conditionStartedAt: trace?.startedAt,
      conditionExpiresAt: trace?.expiresAt,
      history,
      trace,
      integrity,
    }, maintenanceEvent ?? event, options.actor);
  }

  addHistoryEvent(event: SteelBallEvent) {
    return this.commit({
      ...this.state,
      history: appendSteelBallHistory(this.state.history, event),
    }, event);
  }

  addImpact(input: SteelBallImpactInput) {
    const now = input.timestamp ?? Date.now();
    this.state = this.getStateWithDecayedIntegrity(now);
    const result = registerIntegrityImpact(this.state.integrity, input, now);

    if (!result.changed) {
      return this.getState(now);
    }

    const event = createSteelBallEvent({
      type: "ball.integrity.changed",
      impact: result.impact,
      classification: result.classification,
      wear: result.integrity.wear,
      fatigue: result.integrity.fatigue,
      note: "SB-01 surface stress recorded.",
    }, now);
    const requestEvent = result.maintenanceRequested
      ? createSteelBallEvent({
        type: "ball.maintenance.requested",
        wear: result.integrity.wear,
        fatigue: result.integrity.fatigue,
        note: "SB-01 marked for routine inspection.",
      }, now)
      : null;
    const history = requestEvent
      ? appendSteelBallHistory(appendSteelBallHistory(this.state.history, event), requestEvent)
      : appendSteelBallHistory(this.state.history, event);

    this.integrityTouchedAt = now;

    return this.commit({
      ...this.state,
      integrity: result.integrity,
      history,
    }, requestEvent ?? event);
  }

  markCursorState(input: { active?: boolean; resting?: boolean; gravityOffset?: { x: number; y: number } }) {
    this.state = normalizeSteelBallState({
      ...this.state,
      isCustomCursorActive: input.active ?? this.state.isCustomCursorActive,
      isResting: input.resting ?? this.state.isResting,
      gravityOffset: input.gravityOffset ?? this.state.gravityOffset,
    });
    writePersistedSteelBallState(this.state);
    const effective = this.getState();
    this.emit(effective);
    return effective;
  }

  recordGravityStarted() {
    const event = createSteelBallEvent({ type: "ball.gravity.started" });
    return this.commit({
      ...this.state,
      history: appendSteelBallHistory(this.state.history, event),
    }, event);
  }

  recordGravitySettled(edge?: "top" | "right" | "bottom" | "left") {
    const event = createSteelBallEvent({ type: "ball.gravity.settled", edge });
    return this.commit({
      ...this.state,
      history: appendSteelBallHistory(this.state.history, event),
    }, event);
  }

  isBorrowed() {
    return this.state.borrowed || this.state.availability === "borrowed";
  }

  asBrowserApi(): SteelBallBrowserApi {
    const api: SteelBallBrowserApi = {
      borrowBall: (options) => this.borrowBall(options),
      returnBall: (options) => this.returnBall(options),
      setCondition: (input) => this.setCondition(input),
      clearCondition: (options) => this.clearCondition(options),
      addHistoryEvent: (event) => this.addHistoryEvent(event),
      addImpact: (input) => this.addImpact(input),
      borrow: (options) => this.borrowBall(options),
      return: (options) => this.returnBall(options),
      isBorrowed: () => this.isBorrowed(),
      getState: () => this.getState(),
      subscribe: (listener) => this.subscribe(listener),
    };

    if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
      api.debug = {
        setGravity: (vector) => {
          this.debugGravity = {
            x: Math.min(1, Math.max(-1, vector.x)),
            y: Math.min(1, Math.max(-1, vector.y)),
            confidence: Math.min(1, Math.max(0, vector.confidence ?? Math.hypot(vector.x, vector.y))),
          };
          window.dispatchEvent(new CustomEvent("ctrl-love-steel-ball-debug-gravity", { detail: this.debugGravity }));
        },
        addImpact: (input = {}) => this.addImpact({
          energy: input.energy ?? 1.25,
          surface: input.surface ?? "unknown",
          velocity: input.velocity ?? 2200,
          location: input.location ?? { x: 0, y: 0 },
        }),
        setWear: (value) => this.setIntegrityDebug({ wear: value }),
        setFatigue: (value) => this.setIntegrityDebug({ fatigue: value }),
      };
    }

    return api;
  }

  getDebugGravity() {
    return this.debugGravity;
  }

  private setIntegrityDebug(input: { wear?: number; fatigue?: number }) {
    this.integrityTouchedAt = Date.now();
    return this.commit({
      ...this.state,
      integrity: {
        ...this.state.integrity,
        wear: clampIntensity(input.wear ?? this.state.integrity.wear),
        fatigue: clampIntensity(input.fatigue ?? this.state.integrity.fatigue),
      },
    }, createSteelBallEvent({
      type: "ball.integrity.changed",
      impact: {
        timestamp: this.integrityTouchedAt,
        energy: 0.58,
        surface: "unknown",
        velocity: 0,
        location: { x: 0, y: 0 },
      },
      classification: "hard",
      wear: clampIntensity(input.wear ?? this.state.integrity.wear),
      fatigue: clampIntensity(input.fatigue ?? this.state.integrity.fatigue),
      note: "SB-01 integrity adjusted in developer preview.",
    }, this.integrityTouchedAt));
  }

  private getStateWithDecayedIntegrity(now = Date.now()) {
    const integrity = decayIntegrityFatigue(
      this.state.integrity,
      Math.max(0, now - this.integrityTouchedAt),
    );

    return normalizeSteelBallState({
      ...this.state,
      integrity,
    }, now);
  }

  private scheduleMaintenanceReturn() {
    if (typeof window === "undefined") {
      return;
    }

    window.clearTimeout(this.maintenanceReturnTimeout);
    this.maintenanceReturnTimeout = window.setTimeout(() => {
      if (this.state.borrowed && this.state.location === "maintenance") {
        this.returnBall({
          from: "maintenance",
          actor: "Robert",
          note: "SB-01 returned from routine inspection.",
          condition: {
            condition: "polished",
            source: "maintenance.polished",
            intensity: 0.08,
            durationMs: 45_000,
          },
        });
      }
    }, MAINTENANCE_RETURN_DELAY_MS);
  }

  private scheduleReturnForHydratedBorrow() {
    if (typeof window === "undefined" || !this.state.borrowed) {
      return;
    }

    window.clearTimeout(this.maintenanceReturnTimeout);
    this.maintenanceReturnTimeout = window.setTimeout(() => {
      if (!this.state.borrowed) {
        return;
      }

      if (this.state.location === "maintenance" || this.state.status === "maintenance") {
        this.returnBall({
          from: "maintenance",
          actor: "Robert",
          note: "SB-01 returned from routine inspection.",
          condition: {
            condition: "polished",
            source: "maintenance.polished",
            intensity: 0.08,
            durationMs: 45_000,
          },
        });
        return;
      }

      this.returnBall({
        from: this.state.location,
        actor: "The office",
        note: "Steel Ball SB-01 returned to the visitor.",
      });
    }, this.state.location === "maintenance" ? HYDRATED_MAINTENANCE_RETURN_DELAY_MS : HYDRATED_BORROWED_RETURN_DELAY_MS);
  }

  private commit(nextState: SteelBallState, event: SteelBallEvent, actor?: string) {
    this.state = normalizeSteelBallState(nextState);
    const effectiveState = this.getState();
    writePersistedSteelBallState(this.state);
    this.emit(effectiveState);
    dispatchEvent(event);
    dispatchActivity({
      activity: activityForEvent(event),
      actor,
      event,
      note: event.note,
      source: "source" in event ? event.source : undefined,
      state: effectiveState,
    });
    this.startHealing();

    if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
      this.assertInvariants(effectiveState);
    }

    return effectiveState;
  }

  private emit(state: SteelBallState) {
    for (const listener of this.listeners) {
      listener(cloneState(state));
    }

    dispatchState(state);
  }

  private startHealing() {
    const hasFatigue = this.state.integrity.fatigue > 0;

    if (typeof window === "undefined" || this.healingInterval || (!this.state.trace && !hasFatigue)) {
      return;
    }

    this.healingInterval = window.setInterval(() => {
      if (document.visibilityState === "hidden") {
        return;
      }

      const effectiveState = this.getState();

      if (this.state.trace && !effectiveState.trace) {
        this.state = normalizeSteelBallState({
          ...this.state,
          condition: "baseline",
          conditionIntensity: 0,
          conditionSource: undefined,
          conditionStartedAt: undefined,
          conditionExpiresAt: undefined,
          trace: null,
        });
        writePersistedSteelBallState(this.state);
      }

      if (this.state.integrity.fatigue > 0) {
        this.state = normalizeSteelBallState({
          ...this.state,
          integrity: effectiveState.integrity,
        });
        this.integrityTouchedAt = Date.now();
        writePersistedSteelBallState(this.state);
      }

      this.emit(effectiveState);

      if (!this.state.trace && this.state.integrity.fatigue <= 0) {
        window.clearInterval(this.healingInterval);
        this.healingInterval = 0;
      }
    }, HEALING_INTERVAL_MS);
  }

  private assertInvariants(state: SteelBallState) {
    if (state.borrowed && state.availability === "available") {
      throw new Error("Steel Ball invariant failed: borrowed and available.");
    }

    if (state.availability === "returning" && state.location === "hero-stage") {
      throw new Error("Steel Ball invariant failed: returning while on hero stage.");
    }

    const appearance = getIntegrityAppearance(state.integrity);

    if (appearance.wearVisibility > 0.2 || appearance.fatigueInstability > 0.2) {
      throw new Error("Steel Ball invariant failed: integrity effects are too visible.");
    }
  }
}

export function getSteelBallContinuity() {
  const globalStore = globalThis as Record<symbol, SteelBallContinuity | undefined>;
  globalStore[SINGLETON_KEY] ??= new SteelBallContinuity();

  return globalStore[SINGLETON_KEY];
}

export const steelBall = getSteelBallContinuity();

export function installSteelBallBrowserApi() {
  const api = steelBall.asBrowserApi();

  if (typeof window !== "undefined") {
    window.steelBall = api;
    dispatchState(api.getState());
  }

  return api;
}
