import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  clearSavannahPageLock,
  SAVANNAH_HIDDEN_TAB_GRACE_MS,
  SAVANNAH_PAGE_LOCK_CLASSES,
  SAVANNAH_TEXT_BURST_TIMEOUT_MS,
  SAVANNAH_VAPI,
  SAVANNAH_VOICE_MAX_DURATION_MS,
} from "../src/app/savannah-runtime.ts";

const activeRuntimeFiles = [
  "src/app/savannah-widget.tsx",
  "src/app/savannah-room/[room]/vapi-config.ts",
  "src/app/savannah-room/[room]/SavannahClientRoom.tsx",
  "public/savannah-standalone.html",
];

const legacyIds = [
  "d7cabfb0-5382-4566-924c-74eb0b0a4c08",
  "5f548981-f4bc-4618-a93f-e6f2bc976d70",
];

test("Savannah runtime keeps the canonical paid Vapi pair", () => {
  assert.equal(SAVANNAH_VAPI.publicKey, "12382a58-9f0f-41fe-ba94-257368be07cb");
  assert.equal(SAVANNAH_VAPI.assistantId, "4289b114-3dca-4052-9684-13c3435bd0a4");

  const standalone = readFileSync("public/savannah-standalone.html", "utf8");
  assert.match(standalone, new RegExp(SAVANNAH_VAPI.publicKey));
  assert.match(standalone, new RegExp(SAVANNAH_VAPI.assistantId));

  const roomConfig = readFileSync("src/app/savannah-room/[room]/vapi-config.ts", "utf8");
  assert.match(roomConfig, /SAVANNAH_VAPI/);

  const widget = readFileSync("src/app/savannah-widget.tsx", "utf8");
  assert.match(widget, /SAVANNAH_VAPI\.publicKey/);
  assert.match(widget, /SAVANNAH_VAPI\.assistantId/);
});

test("legacy Savannah Vapi IDs never return to active runtime files", () => {
  for (const path of activeRuntimeFiles) {
    const source = readFileSync(path, "utf8");
    for (const legacyId of legacyIds) {
      assert.equal(source.includes(legacyId), false, `${legacyId} returned in ${path}`);
    }
  }
});

test("Savannah page lock cleanup removes every global lock class", () => {
  const removed: string[] = [];
  clearSavannahPageLock((...classes) => removed.push(...classes));
  assert.deepEqual(removed, [...SAVANNAH_PAGE_LOCK_CLASSES]);
});

test("Savannah credit guards stay deliberately short", () => {
  assert.equal(SAVANNAH_TEXT_BURST_TIMEOUT_MS, 45_000);
  assert.equal(SAVANNAH_VOICE_MAX_DURATION_MS, 300_000);
  assert.equal(SAVANNAH_HIDDEN_TAB_GRACE_MS, 30_000);
  assert.ok(SAVANNAH_TEXT_BURST_TIMEOUT_MS < SAVANNAH_VOICE_MAX_DURATION_MS);
});
