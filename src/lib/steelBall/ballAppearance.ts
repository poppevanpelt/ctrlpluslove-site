import type { SteelBallSource, SteelBallTrace } from "./ballState.ts";

export type SteelBallAppearance = {
  condition: string;
  source: SteelBallSource;
  intensity: number;
  residueColor: string;
};

const sourceResidue: Record<SteelBallSource, string> = {
  office: "190 196 198",
  pinball: "176 179 172",
  calibration: "198 202 196",
  tokyo: "96 151 214",
  valencia: "224 135 68",
  unknown: "178 182 178",
};

export const pristineBallAppearance: SteelBallAppearance = {
  condition: "pristine",
  source: "unknown",
  intensity: 0,
  residueColor: sourceResidue.unknown,
};

export function getBallAppearance(trace: SteelBallTrace | null): SteelBallAppearance {
  if (!trace) {
    return pristineBallAppearance;
  }

  return {
    condition: trace.condition,
    source: trace.source,
    intensity: trace.intensity,
    residueColor: sourceResidue[trace.source],
  };
}

export function applyBallAppearance(
  element: HTMLElement,
  trace: SteelBallTrace | null,
) {
  const appearance = getBallAppearance(trace);
  element.dataset.ballCondition = appearance.condition;
  element.dataset.ballSource = appearance.source;
  element.style.setProperty("--steel-ball-memory-intensity", appearance.intensity.toFixed(3));
  element.style.setProperty("--steel-ball-residue-color", appearance.residueColor);
}

export function clearBallAppearance(element: HTMLElement) {
  delete element.dataset.ballCondition;
  delete element.dataset.ballSource;
  element.style.removeProperty("--steel-ball-memory-intensity");
  element.style.removeProperty("--steel-ball-residue-color");
}
