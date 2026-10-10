import { test } from "node:test";
import assert from "node:assert/strict";
import { samplesToPcm16 } from "../src/app/savannah-live-pcm.ts";

test("encodes signed little-endian PCM with clipping and silence for invalid samples", () => {
  const bytes = samplesToPcm16(new Float32Array([-2, -1, -0.5, 0, 0.5, 1, 2, NaN]));
  const view = new DataView(bytes.buffer);
  assert.deepEqual(Array.from({ length: 8 }, (_, i) => view.getInt16(i * 2, true)), [-32768, -32768, -16384, 0, 16384, 32767, 32767, 0]);
});
