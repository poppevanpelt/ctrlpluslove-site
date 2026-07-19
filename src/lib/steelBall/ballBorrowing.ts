import { steelBall } from "./ballContinuity.ts";
import type { SteelBallBorrowInput, SteelBallConditionInput, SteelBallImpactInput, SteelBallReturnInput } from "./types.ts";

export function borrowBall(options: SteelBallBorrowInput = {}) {
  return steelBall.borrowBall(options);
}

export function returnBall(options: SteelBallReturnInput = {}) {
  return steelBall.returnBall(options);
}

export function setCondition(input: SteelBallConditionInput) {
  return steelBall.setCondition(input);
}

export function clearCondition(options: { actor?: string; note?: string } = {}) {
  return steelBall.clearCondition(options);
}

export function addImpact(input: SteelBallImpactInput) {
  return steelBall.addImpact(input);
}

export function isBorrowed() {
  return steelBall.isBorrowed();
}

export function getCurrentState() {
  return steelBall.getState();
}
