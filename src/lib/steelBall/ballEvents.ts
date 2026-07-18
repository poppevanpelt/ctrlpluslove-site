import type {
  SteelBallConditionInput,
  SteelBallSource,
  SteelBallState,
} from "./ballState.ts";

export const STEEL_BALL_STATE_EVENT = "ctrl-love-steel-ball-state";
export const STEEL_BALL_ACTIVITY_EVENT = "ctrl-love-steel-ball-activity";

export type SteelBallActivity =
  | "borrowed"
  | "returned"
  | "condition-set"
  | "condition-cleared";

export type SteelBallActivityDetail = {
  activity: SteelBallActivity;
  actor?: string;
  note?: string;
  source?: SteelBallSource;
  state: SteelBallState;
};

export type SteelBallBrowserApi = {
  setCondition: (input: SteelBallConditionInput) => SteelBallState;
  clearCondition: (options?: { actor?: string; note?: string }) => SteelBallState;
  borrow: (options?: { actor?: string; note?: string }) => SteelBallState;
  return: (options?: {
    actor?: string;
    note?: string;
    condition?: SteelBallConditionInput;
  }) => SteelBallState;
  isBorrowed: () => boolean;
  getState: () => SteelBallState;
  subscribe: (listener: (state: SteelBallState) => void) => () => void;
};

declare global {
  interface Window {
    steelBall?: SteelBallBrowserApi;
  }
}
