import type {
  BallCondition,
  BallConditionSource,
  BallLocation,
  BallOwner,
  SteelBallImpactInput,
  SteelBallBorrowInput,
  SteelBallConditionInput,
  SteelBallEvent,
  SteelBallReturnInput,
  SteelBallState,
} from "./types.ts";
import type { ImpactEnergyClass, ImpactEvent } from "./ballIntegrity.ts";

export const STEEL_BALL_STATE_EVENT = "ctrl-love-steel-ball-state";
export const STEEL_BALL_ACTIVITY_EVENT = "ctrl-love-steel-ball-activity";
export const STEEL_BALL_EVENT = "ctrl-love-steel-ball-event";

export type SteelBallActivity =
  | "borrowed"
  | "returned"
  | "condition-set"
  | "condition-cleared"
  | "gravity-started"
  | "gravity-settled"
  | "integrity-changed"
  | "maintenance-requested"
  | "maintenance-completed";

export type SteelBallActivityDetail = {
  activity: SteelBallActivity;
  actor?: string;
  note?: string;
  source?: BallConditionSource;
  event: SteelBallEvent;
  state: SteelBallState;
};

export type SteelBallBrowserApi = {
  borrowBall: (options?: SteelBallBorrowInput) => SteelBallState;
  returnBall: (options?: SteelBallReturnInput) => SteelBallState;
  setCondition: (input: SteelBallConditionInput) => SteelBallState;
  clearCondition: (options?: { actor?: string; note?: string }) => SteelBallState;
  addHistoryEvent: (event: SteelBallEvent) => SteelBallState;
  addImpact: (input: SteelBallImpactInput) => SteelBallState;
  borrow: (options?: SteelBallBorrowInput) => SteelBallState;
  return: (options?: SteelBallReturnInput) => SteelBallState;
  isBorrowed: () => boolean;
  getState: () => SteelBallState;
  subscribe: (listener: (state: SteelBallState) => void) => () => void;
  debug?: {
    setGravity: (vector: { x: number; y: number; confidence?: number }) => void;
    addImpact: (input?: SteelBallImpactInput) => SteelBallState;
    setWear: (value: number) => SteelBallState;
    setFatigue: (value: number) => SteelBallState;
  };
};

export type SteelBallEventInput =
  | {
      type: "ball.borrowed";
      by: BallOwner;
      destination: BallLocation;
      reason?: string;
      note?: string;
    }
  | {
      type: "ball.returned";
      from: BallLocation;
      condition?: BallCondition;
      intensity?: number;
      source?: BallConditionSource;
      note?: string;
    }
  | {
      type: "ball.condition.changed";
      condition: BallCondition;
      source?: BallConditionSource;
      intensity: number;
      note?: string;
    }
  | {
      type: "ball.condition.cleared";
      note?: string;
    }
  | {
      type: "ball.gravity.started";
      note?: string;
    }
  | {
      type: "ball.gravity.settled";
      edge?: "top" | "right" | "bottom" | "left";
      note?: string;
    }
  | {
      type: "ball.integrity.changed";
      impact: ImpactEvent;
      classification: ImpactEnergyClass;
      wear: number;
      fatigue: number;
      note?: string;
    }
  | {
      type: "ball.maintenance.requested";
      wear: number;
      fatigue: number;
      note?: string;
    }
  | {
      type: "ball.maintenance.completed";
      wear: number;
      fatigue: number;
      note?: string;
    };

declare global {
  interface Window {
    steelBall?: SteelBallBrowserApi;
  }
}
