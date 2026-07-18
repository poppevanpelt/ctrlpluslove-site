import assert from "node:assert/strict";
import test from "node:test";

import { SteelBallMemory } from "../src/lib/steelBall/ballMemory.ts";
import {
  createSteelBallTrace,
  getEffectiveSteelBallState,
} from "../src/lib/steelBall/ballState.ts";

test("Steel Ball memory stores one understated active condition", () => {
  const memory = new SteelBallMemory();
  const state = memory.setCondition({
    condition: "dusty",
    source: "tokyo",
    intensity: 0.08,
    timestamp: new Date().toISOString(),
    expiresAfter: 60_000,
  });

  assert.equal(state.trace?.condition, "dusty");
  assert.equal(state.trace?.source, "tokyo");
  assert.ok(Math.abs((state.trace?.intensity ?? 0) - 0.08) < 0.001);
});

test("Steel Ball memory gradually heals expired traces back to pristine", () => {
  const timestamp = Date.parse("2026-07-18T12:00:00.000Z");
  const trace = createSteelBallTrace({
    condition: "scratched",
    source: "pinball",
    intensity: 0.6,
    timestamp: new Date(timestamp).toISOString(),
    expiresAfter: 10_000,
  });

  const halfway = getEffectiveSteelBallState(
    { borrowed: false, trace },
    timestamp + 5_000,
  );
  const expired = getEffectiveSteelBallState(
    { borrowed: false, trace },
    timestamp + 10_001,
  );

  assert.equal(halfway.trace?.condition, "scratched");
  assert.ok((halfway.trace?.intensity ?? 0) < 0.6);
  assert.equal(expired.trace, null);
});

test("Steel Ball memory supports borrow and return with new evidence", () => {
  const memory = new SteelBallMemory();

  assert.equal(memory.isBorrowed(), false);
  memory.borrow({ actor: "Robert" });
  assert.equal(memory.isBorrowed(), true);

  const returned = memory.returnBall({
    actor: "Mira",
    condition: {
      condition: "polished",
      source: "office",
      intensity: 0.22,
      expiresAfter: 30_000,
    },
  });

  assert.equal(returned.borrowed, false);
  assert.equal(returned.trace?.condition, "polished");
  assert.equal(returned.trace?.source, "office");
});

test("Steel Ball browser API surface exposes future Office Game helpers", () => {
  const memory = new SteelBallMemory();
  const api = memory.asBrowserApi();
  const seen: string[] = [];
  const unsubscribe = api.subscribe((state) => {
    seen.push(state.trace?.condition ?? "pristine");
  });

  api.setCondition({ condition: "warm", source: "calibration" });
  api.clearCondition();
  unsubscribe();

  assert.equal(api.isBorrowed(), false);
  assert.deepEqual(seen, ["pristine", "warm", "pristine"]);
});
