import type { BallAttentionTarget } from "./ballAwareness.ts";
import type { SeededRandom } from "./ballIdle.ts";

export type AttentionPresenceState = {
  target: BallAttentionTarget | null;
  startedAt: number;
  duration: number;
  lastTargetLabel: string;
};

export function createAttentionState(): AttentionPresenceState {
  return {
    target: null,
    startedAt: 0,
    duration: 0,
    lastTargetLabel: "",
  };
}

export function findNearbyAttentionTarget(options: {
  x: number;
  y: number;
  targets: BallAttentionTarget[];
  random: SeededRandom;
}) {
  let best: { target: BallAttentionTarget; distance: number; dx: number; dy: number } | null = null;

  for (const target of options.targets) {
    const rect = target.element.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0 || rect.bottom < 0 || rect.top > window.innerHeight) {
      continue;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = centerX - options.x;
    const dy = centerY - options.y;
    const distance = Math.hypot(dx, dy);
    const radius = Math.max(92, Math.min(180, Math.max(rect.width, rect.height) * 0.42 + 84));

    if (distance > radius) {
      continue;
    }

    const score = distance / Math.max(0.1, target.weight) + options.random() * 18;

    if (!best || score < best.distance / Math.max(0.1, best.target.weight)) {
      best = { target, distance, dx, dy };
    }
  }

  return best;
}

export function stepAttentionPresence(options: {
  state: AttentionPresenceState;
  now: number;
  x: number;
  y: number;
  targets: BallAttentionTarget[];
  random: SeededRandom;
  probability: number;
  motionScale: number;
  quietFactor: number;
}) {
  const { state, now, random } = options;

  if (state.target) {
    const progress = Math.min(1, Math.max(0, (now - state.startedAt) / state.duration));
    const rect = state.target.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = centerX - options.x;
    const dy = centerY - options.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const interest = Math.sin(progress * Math.PI) * options.motionScale * options.quietFactor;
    const magnitude = Math.min(1.8, Math.max(0.25, 100 / distance)) * interest;
    const output = {
      x: (dx / distance) * magnitude,
      y: (dy / distance) * magnitude,
      rotation: (dx / distance) * 0.008 * interest,
      slowdown: 0.04 * interest,
      label: state.target.label,
      kind: state.target.kind,
      active: progress < 1,
    };

    if (progress >= 1) {
      state.lastTargetLabel = state.target.label;
      state.target = null;
    }

    return output;
  }

  const nearby = findNearbyAttentionTarget(options);

  if (!nearby || nearby.target.label === state.lastTargetLabel || random() > options.probability * nearby.target.weight) {
    return { x: 0, y: 0, rotation: 0, slowdown: 0, label: null, kind: null, active: false };
  }

  state.target = nearby.target;
  state.startedAt = now;
  state.duration = 300 + random() * 220;

  return { x: 0, y: 0, rotation: 0, slowdown: 0.02, label: nearby.target.label, kind: nearby.target.kind, active: true };
}
