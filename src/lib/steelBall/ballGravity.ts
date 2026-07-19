import type { BallGravityState, GravityVector } from "./types.ts";

export type OrientationInput = {
  beta?: number | null;
  gamma?: number | null;
  screenAngle?: number;
};

export type MotionInput = {
  x?: number | null;
  y?: number | null;
  screenAngle?: number;
};

export type GravityBounds = {
  width: number;
  height: number;
  radius: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  safeTop?: number;
  safeRight?: number;
  safeBottom?: number;
  safeLeft?: number;
};

const DEAD_ZONE = 0.075;
const SMOOTHING = 0.18;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function applyDeadZone(value: number) {
  const magnitude = Math.abs(value);

  if (magnitude < DEAD_ZONE) {
    return 0;
  }

  return Math.sign(value) * ((magnitude - DEAD_ZONE) / (1 - DEAD_ZONE));
}

export function normalizeGravityVector(vector: GravityVector): GravityVector {
  const x = applyDeadZone(clamp(vector.x, -1, 1));
  const y = applyDeadZone(clamp(vector.y, -1, 1));
  const confidence = Math.hypot(x, y) > 0 ? clamp(vector.confidence, 0, 1) : 0;

  return { x, y, confidence };
}

export function smoothGravityVector(previous: GravityVector, next: GravityVector): GravityVector {
  const normalized = normalizeGravityVector(next);
  const x = clamp(previous.x + (normalized.x - previous.x) * SMOOTHING, -1, 1);
  const y = clamp(previous.y + (normalized.y - previous.y) * SMOOTHING, -1, 1);
  const confidence = Math.hypot(x, y) > 0
    ? clamp(previous.confidence + (normalized.confidence - previous.confidence) * SMOOTHING, 0, 1)
    : 0;

  return { x, y, confidence };
}

export function normalizeDeviceOrientation({
  beta,
  gamma,
  screenAngle = 0,
}: OrientationInput): GravityVector {
  if (!Number.isFinite(beta) || !Number.isFinite(gamma)) {
    return { x: 0, y: 0, confidence: 0 };
  }

  const rawX = clamp((gamma ?? 0) / 38, -1, 1);
  const rawY = clamp((beta ?? 0) / 52, -1, 1);
  const angle = ((screenAngle % 360) + 360) % 360;
  let x = rawX;
  let y = rawY;

  if (angle === 90) {
    x = -rawY;
    y = rawX;
  } else if (angle === 180) {
    x = -rawX;
    y = -rawY;
  } else if (angle === 270) {
    x = rawY;
    y = -rawX;
  }

  return normalizeGravityVector({
    x,
    y,
    confidence: clamp((Math.abs(rawX) + Math.abs(rawY)) / 1.2, 0, 1),
  });
}

export function normalizeDeviceMotion({
  x,
  y,
  screenAngle = 0,
}: MotionInput): GravityVector {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { x: 0, y: 0, confidence: 0 };
  }

  const rawX = clamp((x ?? 0) / 6.5, -1, 1);
  const rawY = clamp(-(y ?? 0) / 6.5, -1, 1);
  const angle = ((screenAngle % 360) + 360) % 360;
  let mappedX = rawX;
  let mappedY = rawY;

  if (angle === 90) {
    mappedX = -rawY;
    mappedY = rawX;
  } else if (angle === 180) {
    mappedX = -rawX;
    mappedY = -rawY;
  } else if (angle === 270) {
    mappedX = rawY;
    mappedY = -rawX;
  }

  return normalizeGravityVector({
    x: mappedX,
    y: mappedY,
    confidence: clamp((Math.abs(rawX) + Math.abs(rawY)) / 1.2, 0, 1),
  });
}

export function createGravityState(
  position = { x: 0, y: 0 },
  gravity: GravityVector = { x: 0, y: 0, confidence: 0 },
): BallGravityState {
  return {
    position: { ...position },
    velocity: { x: 0, y: 0 },
    gravity: normalizeGravityVector(gravity),
    isSettled: true,
  };
}

export function stepGravitySimulation(
  state: BallGravityState,
  bounds: GravityBounds,
  deltaMs: number,
): BallGravityState {
  const dt = clamp(deltaMs / 1000, 0, 0.05);
  const gravity = normalizeGravityVector(state.gravity);
  const force = gravity.confidence;
  const acceleration = 420 * force;
  let vx = state.velocity.x + gravity.x * acceleration * dt;
  let vy = state.velocity.y + gravity.y * acceleration * dt;
  const damping = Math.pow(0.08, dt);

  vx *= damping;
  vy *= damping;

  const maxVelocity = 92;
  const speed = Math.hypot(vx, vy);

  if (speed > maxVelocity) {
    vx = (vx / speed) * maxVelocity;
    vy = (vy / speed) * maxVelocity;
  }

  let x = state.position.x + vx * dt;
  let y = state.position.y + vy * dt;
  const minX = bounds.minX ?? (bounds.safeLeft ?? 0) + bounds.radius;
  const maxX = bounds.maxX ?? bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
  const minY = bounds.minY ?? (bounds.safeTop ?? 0) + bounds.radius;
  const maxY = bounds.maxY ?? bounds.height - (bounds.safeBottom ?? 0) - bounds.radius;

  if (x < minX || x > maxX) {
    x = clamp(x, minX, maxX);
    vx *= -0.18;
  }

  if (y < minY || y > maxY) {
    y = clamp(y, minY, maxY);
    vy *= -0.18;
  }

  const settled = force === 0 && Math.hypot(vx, vy) < 3;

  return {
    position: { x, y },
    velocity: settled ? { x: 0, y: 0 } : { x: vx, y: vy },
    gravity,
    isSettled: settled,
  };
}

export function getSettledEdge(state: BallGravityState, bounds: GravityBounds) {
  const minX = bounds.minX ?? (bounds.safeLeft ?? 0) + bounds.radius;
  const maxX = bounds.maxX ?? bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
  const minY = bounds.minY ?? (bounds.safeTop ?? 0) + bounds.radius;
  const maxY = bounds.maxY ?? bounds.height - (bounds.safeBottom ?? 0) - bounds.radius;
  const left = Math.abs(state.position.x - minX);
  const right = Math.abs(state.position.x - maxX);
  const top = Math.abs(state.position.y - minY);
  const bottom = Math.abs(state.position.y - maxY);
  const closest = Math.min(left, right, top, bottom);

  if (closest > bounds.radius * 1.2) {
    return undefined;
  }

  if (closest === left) return "left";
  if (closest === right) return "right";
  if (closest === top) return "top";
  return "bottom";
}
