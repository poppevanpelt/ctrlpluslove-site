import assert from "node:assert/strict";
import test from "node:test";
import {
  buildActionPrompt,
  buildMemoryPrompt,
  deriveRoomMemory,
  detectSilentNudge,
  parseStoredRoomMemory,
} from "../src/app/savannah-room/[room]/savannah-os.ts";

const line = (role: "user" | "assistant", text: string, at: number) => ({ role, text, at });

test("Savannah cannot promote her own words into a room decision", () => {
  const memory = deriveRoomMemory("bridgefund", [
    line("assistant", "Great, we decided to launch Tuesday.", 1),
    line("user", "I disagree with that conclusion.", 2),
  ]);
  assert.deepEqual(memory.decisions, []);
});

test("human decisions owners tests and questions become room continuity", () => {
  const memory = deriveRoomMemory("bridgefund", [
    line("user", "We decided to test the new room with Chris.", 1),
    line("user", "Job will take the video edit.", 2),
    line("user", "What still blocks the security review?", 3),
  ]);
  assert.equal(memory.decisions.length, 1);
  assert.equal(memory.owners.length, 1);
  assert.equal(memory.nextTests.length, 1);
  assert.equal(memory.openQuestions.length, 1);
});

test("memory prompt labels evidence provenance", () => {
  const memory = deriveRoomMemory("luther", [line("user", "We decided to prototype it.", 1)]);
  const prompt = buildMemoryPrompt(memory);
  assert.match(prompt, /Treat HUMAN lines as evidence/);
  assert.match(prompt, /We decided to prototype it/);
});

test("silent observer catches unowned decision", () => {
  const memory = deriveRoomMemory("bonkers", [
    line("user", "We decided to run the upstream test.", 1),
    line("user", "That is the move.", 2),
    line("user", "Let's continue.", 3),
  ]);
  assert.equal(detectSilentNudge(memory), "A decision is forming. Nobody owns it yet.");
});

test("stored memory cannot leak into another room", () => {
  const memory = deriveRoomMemory("bridgefund", [line("user", "We decided to test it.", 1)]);
  assert.equal(parseStoredRoomMemory(JSON.stringify(memory), "luther"), null);
});

test("action desk prompts preserve explicit human approval", () => {
  const memory = deriveRoomMemory("bridgefund", [line("user", "We decided to test it.", 1)]);
  const prompt = buildActionPrompt("follow-up", "BridgeFund", memory);
  assert.match(prompt, /human will explicitly approve/i);
  assert.match(prompt, /Never invent names, dates, owners/);
});
