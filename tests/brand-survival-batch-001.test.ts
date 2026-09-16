import assert from "node:assert/strict";
import test from "node:test";
import {
  aggregateBatch001,
  parseBatch001Observations,
  type BatchObservation,
} from "../src/app/brand-survival/batch-001.ts";

const recordedAt = "2026-09-17T00:00:00.000Z";

const rows: BatchObservation[] = [
  {
    id: "b1",
    participantId: "P001",
    specimenId: "S001",
    stage: "full",
    condition: "brand",
    sourceRecognised: true,
    categoryRecognised: true,
    confidence: 5,
    sourceGuess: "Brand A",
    recordedAt,
  },
  {
    id: "b2",
    participantId: "P002",
    specimenId: "S001",
    stage: "full",
    condition: "brand",
    sourceRecognised: false,
    categoryRecognised: true,
    confidence: 2,
    sourceGuess: "",
    recordedAt,
  },
  {
    id: "w1",
    participantId: "P001",
    specimenId: "S002",
    stage: "full",
    condition: "wallpaper",
    sourceRecognised: false,
    categoryRecognised: true,
    confidence: 4,
    sourceGuess: "",
    recordedAt,
  },
];

test("aggregateBatch001 computes observed rates and leaves missing stages blank", () => {
  const results = aggregateBatch001(rows);
  assert.equal(results[0].brand.n, 2);
  assert.equal(results[0].brand.rate, 50);
  assert.equal(results[0].wallpaper.n, 1);
  assert.equal(results[0].wallpaper.rate, 0);
  assert.equal(results[1].brand.rate, null);
  assert.equal(results[1].wallpaper.rate, null);
});

test("parseBatch001Observations rejects malformed evidence rows", () => {
  const parsed = parseBatch001Observations(JSON.stringify([
    rows[0],
    { ...rows[1], confidence: 9 },
    { broken: true },
  ]));

  assert.deepEqual(parsed, [rows[0]]);
  assert.deepEqual(parseBatch001Observations("not json"), []);
});
