import { STEEL_BALL_ID } from "./ballIdentity.ts";
import type { SteelBallEventInput } from "./ballEvents.ts";
import type { BallCondition, SteelBallEvent } from "./types.ts";

export const MAX_STEEL_BALL_HISTORY = 25;

let fallbackEventSequence = 0;

function createEventId(type: SteelBallEvent["type"], timestamp: number) {
  fallbackEventSequence += 1;
  const suffix = `${fallbackEventSequence}`.padStart(4, "0");

  return `steel-ball:${STEEL_BALL_ID}:${type}:${timestamp}:${suffix}`;
}

export function createSteelBallEvent(input: SteelBallEventInput, now = Date.now()): SteelBallEvent {
  return {
    ...input,
    id: createEventId(input.type, now),
    ballId: STEEL_BALL_ID,
    timestamp: now,
  } as SteelBallEvent;
}

export function appendSteelBallHistory(
  history: SteelBallEvent[],
  event: SteelBallEvent,
) {
  return [...history, event].slice(-MAX_STEEL_BALL_HISTORY);
}

export function isEventBackedCondition(event: SteelBallEvent) {
  if (event.type === "ball.condition.changed") {
    return event.condition !== "baseline" && event.intensity > 0;
  }

  if (event.type === "ball.returned") {
    return Boolean(event.condition && event.condition !== "baseline" && (event.intensity ?? 0) > 0);
  }

  return false;
}

export function conditionFromEvent(event: SteelBallEvent): Exclude<BallCondition, "baseline"> | null {
  const condition =
    event.type === "ball.condition.changed"
      ? event.condition
      : event.type === "ball.returned"
        ? event.condition
        : undefined;

  return condition && condition !== "baseline" ? condition : null;
}
