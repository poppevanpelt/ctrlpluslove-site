import test from "node:test";
import assert from "node:assert/strict";
import { realityCheck } from "../src/lib/valhalla/reality-check.ts";

test("reports difference without calling it success", () => {
  assert.deepEqual(realityCheck(10, 7), { difference: -3, status: "self-reported" });
});
test("missing observations remain unknown", () => {
  assert.deepEqual(realityCheck(null, 7), { difference: null, status: "unknown" });
});
test("invalid numbers are rejected", () => {
  assert.deepEqual(realityCheck(Infinity, 7), { difference: null, status: "invalid" });
});
