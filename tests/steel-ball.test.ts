import assert from "node:assert/strict";
import test from "node:test";

import { SteelBallMemory } from "../src/lib/steelBall/ballMemory.ts";
import {
  createGravityState,
  normalizeDeviceMotion,
  normalizeDeviceOrientation,
  normalizeGravityVector,
  smoothGravityVector,
  stepGravitySimulation,
} from "../src/lib/steelBall/ballGravity.ts";
import {
  createSteelBallTrace,
  getEffectiveSteelBallState,
  pristineSteelBallState,
} from "../src/lib/steelBall/ballState.ts";
import {
  hydrateSteelBallState,
  toPersistedSteelBallState,
} from "../src/lib/steelBall/ballPersistence.ts";
import {
  classifyImpactEnergy,
  decayIntegrityFatigue,
  getIntegrityAppearance,
  pristineBallIntegrity,
  registerIntegrityImpact,
} from "../src/lib/steelBall/ballIntegrity.ts";
import { getBallAppearance } from "../src/lib/steelBall/ballAppearance.ts";

test("Steel Ball continuity represents one office-owned SB-01 object", () => {
  const memory = new SteelBallMemory();
  const state = memory.getState();

  assert.equal(state.identity.id, "SB-01");
  assert.equal(state.identity.owner, "ctrl-love-office");
  assert.equal(state.condition, "baseline");
  assert.equal(state.borrowed, false);
});

test("Steel Ball conditions require event provenance and decay to baseline", () => {
  const memory = new SteelBallMemory();
  const now = Date.now();
  const state = memory.setCondition({
    condition: "dusty",
    source: "tokyo",
    intensity: 0.08,
    timestamp: now,
    durationMs: 60_000,
  });

  assert.equal(state.trace?.condition, "dusty");
  assert.equal(state.trace?.source, "tokyo");
  assert.ok(state.trace?.eventId.includes("ball.condition.changed"));
  assert.ok(Math.abs((state.trace?.intensity ?? 0) - 0.08) < 0.001);

  const trace = createSteelBallTrace({
    condition: "scratched",
    source: "pinball.round-finished",
    intensity: 0.18,
    timestamp: 10_000,
    durationMs: 10_000,
  }, "steel-ball:SB-01:test-event", 10_000);

  const halfway = getEffectiveSteelBallState(
    { ...pristineSteelBallState, trace },
    15_000,
  );
  const expired = getEffectiveSteelBallState(
    { ...pristineSteelBallState, trace },
    20_001,
  );

  assert.equal(halfway.trace?.condition, "scratched");
  assert.ok((halfway.trace?.intensity ?? 0) < 0.18);
  assert.equal(expired.trace, null);
  assert.equal(expired.condition, "baseline");
});

test("Steel Ball borrow is protected from re-entry and return can carry evidence", () => {
  const memory = new SteelBallMemory();

  const borrowed = memory.borrow({
    by: "robert",
    destination: "pinball-room",
    reason: "office-break",
  });
  const repeated = memory.borrow({
    by: "mira",
    destination: "embassy",
  });

  assert.equal(borrowed.borrowed, true);
  assert.equal(repeated.currentlyWith, "robert");
  assert.equal(repeated.location, "pinball-room");
  assert.equal(repeated.history.length, 1);

  const returned = memory.returnBall({
    from: "pinball-room",
    condition: {
      condition: "scratched",
      source: "pinball.round-finished",
      intensity: 0.12,
      durationMs: 180_000,
    },
  });

  assert.equal(returned.borrowed, false);
  assert.equal(returned.availability, "available");
  assert.equal(returned.location, "visitor");
  assert.equal(returned.trace?.condition, "scratched");
  assert.equal(returned.history.at(-1)?.type, "ball.returned");
});

test("Steel Ball persistence is versioned, bounded, and recovers from malformed records", () => {
  const memory = new SteelBallMemory();

  for (let index = 0; index < 35; index += 1) {
    memory.setCondition({
      condition: "warm",
      source: "calibration-range.completed",
      intensity: 0.05,
      timestamp: 1_000 + index,
      durationMs: 8_000,
    });
  }

  const state = memory.getState(1_100);
  const persisted = toPersistedSteelBallState(state, 1_100);
  const hydrated = hydrateSteelBallState(persisted, 1_100);
  const malformed = hydrateSteelBallState({ version: 999, state: { borrowed: "maybe" } }, 1_100);

  assert.equal(persisted.version, 2);
  assert.ok(hydrated.history.length <= 25);
  assert.equal(malformed.identity.id, "SB-01");
  assert.equal(malformed.borrowed, true);
  assert.equal(malformed.location, "office");
});

test("Steel Ball impact classification ignores noise and separates hard treatment", () => {
  assert.equal(classifyImpactEnergy(0.04), "tiny");
  assert.equal(classifyImpactEnergy(0.34), "normal");
  assert.equal(classifyImpactEnergy(0.82), "hard");
  assert.equal(classifyImpactEnergy(1.4), "violent");

  const tiny = registerIntegrityImpact(pristineBallIntegrity, {
    energy: 0.12,
    velocity: 120,
    surface: "hero-stage",
  }, 1_000);

  assert.equal(tiny.changed, false);
  assert.equal(tiny.integrity.wear, 0);
  assert.equal(tiny.integrity.recentImpacts.length, 0);
});

test("Steel Ball fatigue accumulates temporarily and decays naturally", () => {
  const first = registerIntegrityImpact(pristineBallIntegrity, {
    energy: 0.8,
    velocity: 1500,
    surface: "hero-stage",
  }, 1_000);
  const second = registerIntegrityImpact(first.integrity, {
    energy: 1.35,
    velocity: 2600,
    surface: "viewport-edge",
  }, 1_500);
  const decayed = decayIntegrityFatigue(second.integrity, 30_000);

  assert.equal(first.changed, true);
  assert.ok(second.integrity.fatigue > first.integrity.fatigue);
  assert.ok(second.integrity.wear > first.integrity.wear);
  assert.ok(decayed.fatigue < second.integrity.fatigue);
  assert.ok(decayed.wear === second.integrity.wear);
});

test("Steel Ball wear persists while session fatigue does not", () => {
  const memory = new SteelBallMemory();
  memory.addImpact({
    energy: 1.35,
    velocity: 2400,
    surface: "viewport-edge",
    location: { x: 12, y: 20 },
    timestamp: 2_000,
  });

  const state = memory.getState(2_000);
  const persisted = toPersistedSteelBallState(state, 2_000);
  const hydrated = hydrateSteelBallState(persisted, 2_000);

  assert.ok(state.integrity.fatigue > 0);
  assert.ok(hydrated.integrity.wear > 0);
  assert.equal(hydrated.integrity.fatigue, 0);
  assert.equal(hydrated.integrity.recentImpacts.length, 1);
});

test("Steel Ball maintenance is requested and completed through borrowing", () => {
  const memory = new SteelBallMemory();

  for (let index = 0; index < 5; index += 1) {
    memory.addImpact({
      energy: 1.7,
      velocity: 3200,
      surface: "viewport-edge",
      location: { x: index, y: index },
      timestamp: 10_000 + index,
    });
  }

  const requested = memory.getState(10_010);
  assert.ok(requested.integrity.maintenanceRequestedAt);
  assert.equal(requested.history.some((event) => event.type === "ball.maintenance.requested"), true);

  const borrowed = memory.borrow({ actor: "Robert" });
  assert.equal(borrowed.location, "maintenance");
  assert.equal(borrowed.status, "maintenance");

  const returned = memory.returnBall({ from: "maintenance", actor: "Robert" });
  assert.equal(returned.borrowed, false);
  assert.equal(returned.integrity.fatigue, 0);
  assert.equal(returned.integrity.maintenanceRequestedAt, undefined);
  assert.ok(returned.integrity.lastMaintenance);
  assert.equal(returned.history.at(-1)?.type, "ball.maintenance.completed");
});

test("Steel Ball appearance thresholds remain restrained", () => {
  const appearance = getIntegrityAppearance({
    ...pristineBallIntegrity,
    wear: 0.04,
    fatigue: 0.22,
  });
  const ballAppearance = getBallAppearance(null, {
    ...pristineBallIntegrity,
    wear: 0.04,
    fatigue: 0.22,
  });

  assert.ok(appearance.wearVisibility > 0);
  assert.ok(appearance.wearVisibility <= 0.16);
  assert.ok(appearance.fatigueInstability <= 0.18);
  assert.ok(appearance.fatigueDelayMs >= 50);
  assert.equal(ballAppearance.condition, "baseline");
  assert.equal(ballAppearance.shouldWobble, true);
});

test("Steel Ball browser API emits typed state changes", () => {
  const memory = new SteelBallMemory();
  const api = memory.asBrowserApi();
  const seen: string[] = [];
  const unsubscribe = api.subscribe((state) => {
    seen.push(state.condition);
  });

  api.setCondition({ condition: "warm", source: "calibration-range.completed" });
  api.clearCondition();
  unsubscribe();

  assert.equal(api.isBorrowed(), false);
  assert.deepEqual(seen, ["baseline", "warm", "baseline"]);
});

test("Steel Ball gravity normalizes orientation, dead zones, damping, and settling", () => {
  const dead = normalizeGravityVector({ x: 0.02, y: -0.03, confidence: 1 });
  const portrait = normalizeDeviceOrientation({ beta: 26, gamma: 19, screenAngle: 0 });
  const landscape = normalizeDeviceOrientation({ beta: 26, gamma: 19, screenAngle: 90 });
  const state = createGravityState({ x: 100, y: 100 }, { x: 0.4, y: 0.2, confidence: 0.8 });
  const next = stepGravitySimulation(state, { width: 320, height: 240, radius: 16 }, 16);
  const settled = stepGravitySimulation(
    { ...next, gravity: { x: 0, y: 0, confidence: 0 }, velocity: { x: 1, y: 1 } },
    { width: 320, height: 240, radius: 16 },
    16,
  );

  assert.deepEqual(dead, { x: 0, y: 0, confidence: 0 });
  assert.ok(portrait.x > 0);
  assert.ok(portrait.y > 0);
  assert.ok(landscape.x < 0);
  assert.ok(landscape.y > 0);
  assert.ok(next.position.x > 100);
  assert.ok(next.position.y > 100);
  assert.equal(settled.isSettled, true);
});

test("Steel Ball gravity smoothing preserves small sustained tilt", () => {
  let vector = { x: 0, y: 0, confidence: 0 };

  for (let index = 0; index < 8; index += 1) {
    vector = smoothGravityVector(vector, { x: 0.22, y: 0.16, confidence: 0.5 });
  }

  assert.ok(vector.x > 0.08);
  assert.ok(vector.y > 0.04);
  assert.ok(vector.confidence > 0.15);
});

test("Steel Ball gravity can use device motion fallback", () => {
  const motion = normalizeDeviceMotion({ x: 2.4, y: -1.8, screenAngle: 0 });

  assert.ok(motion.x > 0);
  assert.ok(motion.y > 0);
  assert.ok(motion.confidence > 0);
});

test("Steel Ball gravity bounds can be relative to the resting origin", () => {
  const state = createGravityState({ x: 0, y: 0 }, { x: -0.5, y: -0.35, confidence: 0.9 });
  const next = stepGravitySimulation(
    state,
    {
      width: 320,
      height: 240,
      radius: 16,
      minX: -100,
      maxX: 80,
      minY: -60,
      maxY: 70,
    },
    32,
  );

  assert.ok(next.position.x < 0);
  assert.ok(next.position.y < 0);
});
