import test from "node:test";
import assert from "node:assert/strict";
import { analyse, rank } from "../src/app/meeting-radar/engine.ts";

const conflict = [
  "Julian: We should start building now.",
  "Chris: We cannot start until the proposition is clear."
];
test("clear contradiction suggests intervention in balanced mode", () => {
  const items = rank(analyse(conflict), "balanced");
  assert.equal(items.find(x => x.kind === "CONTRADICTION")?.action, "SUGGEST INTERRUPTING");
});
test("follow-up experiment protects useful exploration", () => {
  const items = rank(analyse([...conflict, "Sikko: Let's test that assumption with customers."]), "balanced");
  assert.equal(items.find(x => x.kind === "CONTRADICTION")?.action, "STAY SILENT");
  assert.equal(items.find(x => x.kind === "PRODUCTIVE")?.action, "PROTECT DISCUSSION");
});
test("the same conflict stays actionable before the follow-up", () => {
  const before = rank(analyse(conflict), "balanced");
  assert.equal(before.find(x => x.kind === "CONTRADICTION")?.action, "SUGGEST INTERRUPTING");
});
test("repeated argument is noticed but quiet mode protects the room", () => {
  const line = "Chris: We need to make the proposition clearer before proceeding.";
  const flags = rank(analyse([line, line]), "quiet");
  assert.equal(flags.find(x => x.kind === "LOOP")?.action, "STAY SILENT");
});
test("unresolved decision ownership is interruptible in balanced mode", () => {
  assert.equal(rank(analyse(["Sikko: Who actually owns this decision?"]), "balanced")[0]?.action, "SUGGEST INTERRUPTING");
});
test("human dismissal takes precedence over interruption", () => {
  const flags = analyse(conflict);
  const id = flags.find(f => f.kind === "CONTRADICTION");
  assert.ok(id);
  assert.equal(rank(flags, "active", [id.kind + ":" + id.line]).find(x => x.kind === "CONTRADICTION")?.action, "DISMISSED");
});
test("ordinary positive conversation does not trigger an interruption", () => {
  const flags = rank(analyse(["Chris: Thank you for bringing the notes.", "Julian: You're welcome."]), "active");
  assert.equal(flags.length, 0);
});
test("discussion only becomes a contradiction when both opposing positions appear", () => {
  assert.equal(analyse(conflict.slice(0, 1)).some(f => f.kind === "CONTRADICTION"), false);
});

test("a productive idea before a later conflict does not erase the conflict", () => {
  const flags = rank(analyse(["Sikko: Let's test that assumption with customers.", ...conflict]), "balanced");
  assert.equal(flags.find(x => x.kind === "CONTRADICTION")?.action, "SUGGEST INTERRUPTING");
});
test("a distant unrelated experiment cannot silence an earlier contradiction", () => {
  const gap = Array.from({length: 6}, (_,i) => `Participant: We are discussing topic ${i} in more detail.`);
  const flags = rank(analyse([...conflict, ...gap, "Sikko: Let's test that assumption with customers."]), "balanced");
  assert.equal(flags.find(x => x.kind === "CONTRADICTION")?.action, "SUGGEST INTERRUPTING");
});
test("a productive proposal alone is protected, not treated as a contradiction", () => {
  const flags = rank(analyse(["Sikko: Let's test that assumption with customers."]), "active");
  assert.equal(flags.length, 1);
  assert.equal(flags[0].action, "PROTECT DISCUSSION");
});
test("silent signals remain visible for the human operator", () => {
  const line = "Chris: We need to make the proposition clearer before proceeding.";
  const flags = rank(analyse([line, line]), "balanced");
  assert.equal(flags.find(x => x.kind === "LOOP")?.action, "STAY SILENT");
});

test("later productive proposals are still detected after an earlier proposal", () => {
  const lines = [
    "Sam: Let's test that assumption with customers.",
    "Julian: We should start building now.",
    "Chris: We cannot start until the proposition is clear.",
    "Alex: Let's test that assumption with customers."
  ];
  const flags = rank(analyse(lines), "balanced");
  assert.equal(flags.filter(x => x.kind === "PRODUCTIVE").length, 2);
  assert.equal(flags.find(x => x.kind === "CONTRADICTION")?.action, "STAY SILENT");
});
test("a later experiment is not suppressed by an earlier unrelated experiment", () => {
  const lines = [
    "Sam: Let's test that assumption with customers.",
    "Julian: We should start building now.",
    "Chris: We cannot start until the proposition is clear."
  ];
  const flags = rank(analyse(lines), "balanced");
  assert.equal(flags.find(x => x.kind === "CONTRADICTION")?.action, "SUGGEST INTERRUPTING");
});
