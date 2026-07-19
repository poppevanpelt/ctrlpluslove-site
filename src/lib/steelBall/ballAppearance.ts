import type { BallConditionSource, SteelBallConditionTrace } from "./types.ts";
import {
  getIntegrityAppearance,
  pristineBallIntegrity,
  type BallIntegrity,
} from "./ballIntegrity.ts";

export type SteelBallAppearance = {
  condition: string;
  source: BallConditionSource;
  intensity: number;
  residueColor: string;
  fatigueInstability: number;
  wearVisibility: number;
  fatigueDelayMs: number;
  shouldTick: boolean;
  shouldWobble: boolean;
};

const sourceResidue: Record<string, string> = {
  "hero-stage": "178 182 178",
  visitor: "178 182 178",
  office: "190 196 198",
  "pinball-room": "176 179 172",
  "calibration-range": "198 202 196",
  embassy: "142 166 188",
  maintenance: "202 204 202",
  tokyo: "96 151 214",
  valencia: "224 135 68",
  "office.borrowed": "190 196 198",
  "office.returned": "190 196 198",
  "pinball.round-finished": "176 179 172",
  "calibration-range.completed": "198 202 196",
  "embassy.delivery-completed": "142 166 188",
  "maintenance.polished": "202 204 202",
  manual: "178 182 178",
  unknown: "178 182 178",
};

export const baselineBallAppearance: SteelBallAppearance = {
  condition: "baseline",
  source: "unknown",
  intensity: 0,
  residueColor: sourceResidue.unknown,
  fatigueInstability: 0,
  wearVisibility: 0,
  fatigueDelayMs: 0,
  shouldTick: false,
  shouldWobble: false,
};

export const pristineBallAppearance = baselineBallAppearance;

export function getBallAppearance(
  trace: SteelBallConditionTrace | null,
  integrity: BallIntegrity = pristineBallIntegrity,
): SteelBallAppearance {
  const integrityAppearance = getIntegrityAppearance(integrity);

  if (!trace) {
    return {
      ...baselineBallAppearance,
      ...integrityAppearance,
    };
  }

  return {
    condition: trace.condition,
    source: trace.source,
    intensity: trace.intensity,
    residueColor: sourceResidue[trace.source] ?? sourceResidue.unknown,
    ...integrityAppearance,
  };
}

export function applyBallAppearance(
  element: HTMLElement,
  trace: SteelBallConditionTrace | null,
  integrity: BallIntegrity = pristineBallIntegrity,
) {
  const appearance = getBallAppearance(trace, integrity);
  element.dataset.ballCondition = appearance.condition;
  element.dataset.ballSource = appearance.source;
  element.style.setProperty("--steel-ball-memory-intensity", appearance.intensity.toFixed(3));
  element.style.setProperty("--steel-ball-residue-color", appearance.residueColor);
  element.style.setProperty("--steel-ball-wear-visibility", appearance.wearVisibility.toFixed(3));
  element.style.setProperty("--steel-ball-fatigue-instability", appearance.fatigueInstability.toFixed(3));
  element.style.setProperty("--steel-ball-fatigue-delay", `${appearance.fatigueDelayMs}ms`);
  element.toggleAttribute("data-ball-fatigue-wobble", appearance.shouldWobble);
  element.toggleAttribute("data-ball-fatigue-tick", appearance.shouldTick);
}

export function clearBallAppearance(element: HTMLElement) {
  delete element.dataset.ballCondition;
  delete element.dataset.ballSource;
  element.style.removeProperty("--steel-ball-memory-intensity");
  element.style.removeProperty("--steel-ball-residue-color");
  element.style.removeProperty("--steel-ball-wear-visibility");
  element.style.removeProperty("--steel-ball-fatigue-instability");
  element.style.removeProperty("--steel-ball-fatigue-delay");
  element.removeAttribute("data-ball-fatigue-wobble");
  element.removeAttribute("data-ball-fatigue-tick");
}
