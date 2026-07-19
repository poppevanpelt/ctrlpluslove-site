import type { SteelBallIdentity } from "./ballIdentity.ts";
import type {
  BallIntegrity,
  ImpactEnergyClass,
  ImpactEvent,
  ImpactSurface,
} from "./ballIntegrity.ts";

export type BallLocation =
  | "hero-stage"
  | "visitor"
  | "office"
  | "pinball-room"
  | "calibration-range"
  | "embassy"
  | "maintenance"
  | "unknown";

export type BallOwner =
  | "ctrl-love-office"
  | "visitor"
  | "mira"
  | "robert"
  | "ravi"
  | "unknown";

export type BallAvailability =
  | "available"
  | "borrowed"
  | "returning"
  | "maintenance";

export type BallCondition =
  | "baseline"
  | "scratched"
  | "polished"
  | "dusty"
  | "warm";

export type BallConditionSource =
  | BallLocation
  | "tokyo"
  | "valencia"
  | "office.borrowed"
  | "office.returned"
  | "pinball.round-finished"
  | "calibration-range.completed"
  | "embassy.delivery-completed"
  | "maintenance.polished"
  | "manual"
  | "unknown";

export type GravityVector = {
  x: number;
  y: number;
  confidence: number;
};

export type BallGravityState = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  gravity: GravityVector;
  isSettled: boolean;
};

export type SteelBallBaseEvent = {
  id: string;
  ballId: SteelBallIdentity["id"];
  timestamp: number;
  note?: string;
};

export type SteelBallEvent =
  | (SteelBallBaseEvent & {
      type: "ball.borrowed";
      by: BallOwner;
      destination: BallLocation;
      reason?: string;
    })
  | (SteelBallBaseEvent & {
      type: "ball.returned";
      from: BallLocation;
      condition?: BallCondition;
      intensity?: number;
      source?: BallConditionSource;
    })
  | (SteelBallBaseEvent & {
      type: "ball.condition.changed";
      condition: BallCondition;
      source?: BallConditionSource;
      intensity: number;
    })
  | (SteelBallBaseEvent & {
      type: "ball.condition.cleared";
    })
  | (SteelBallBaseEvent & {
      type: "ball.gravity.started";
    })
  | (SteelBallBaseEvent & {
      type: "ball.gravity.settled";
      edge?: "top" | "right" | "bottom" | "left";
    })
  | (SteelBallBaseEvent & {
      type: "ball.integrity.changed";
      impact: ImpactEvent;
      classification: ImpactEnergyClass;
      wear: number;
      fatigue: number;
    })
  | (SteelBallBaseEvent & {
      type: "ball.maintenance.requested";
      wear: number;
      fatigue: number;
    })
  | (SteelBallBaseEvent & {
      type: "ball.maintenance.completed";
      wear: number;
      fatigue: number;
    });

export type SteelBallConditionTrace = {
  condition: Exclude<BallCondition, "baseline">;
  source: BallConditionSource;
  intensity: number;
  startedAt: number;
  expiresAt?: number;
  eventId: string;
};

export type SteelBallState = {
  identity: SteelBallIdentity;
  location: BallLocation;
  currentlyWith: BallOwner;
  availability: BallAvailability;
  condition: BallCondition;
  conditionIntensity: number;
  conditionSource?: BallConditionSource;
  conditionStartedAt?: number;
  conditionExpiresAt?: number;
  isCustomCursorActive: boolean;
  isResting: boolean;
  gravityOffset: { x: number; y: number };
  history: SteelBallEvent[];
  trace: SteelBallConditionTrace | null;
  integrity: BallIntegrity;
  lastKnownLocation: BallLocation;
  borrowed: boolean;
  status: BallAvailability;
};

export type SteelBallConditionInput = {
  condition: Exclude<BallCondition, "baseline">;
  intensity?: number;
  source?: BallConditionSource;
  durationMs?: number;
  expiresAfter?: number;
  timestamp?: number | string;
};

export type SteelBallBorrowInput = {
  by?: BallOwner;
  actor?: string;
  destination?: BallLocation;
  location?: BallLocation;
  reason?: string;
  note?: string;
};

export type SteelBallReturnInput = {
  from?: BallLocation;
  actor?: string;
  note?: string;
  condition?: BallCondition | SteelBallConditionInput;
  intensity?: number;
  source?: BallConditionSource;
};

export type SteelBallImpactInput = {
  timestamp?: number;
  energy?: number;
  surface?: ImpactSurface;
  velocity?: number;
  location?: { x: number; y: number };
};
