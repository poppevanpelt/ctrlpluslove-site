import test from "node:test";
import assert from "node:assert/strict";
import { authorizeAction, decideNextMove, type FollowThroughCase } from "../src/app/savannah-follow-through.ts";

const base: FollowThroughCase = {
  id: "vercel-refund-001",
  objective: "Resolve the Vercel refund request",
  successCriteria: ["Written decision on refund", "Refund issued or reasoned final decision"],
  status: "active",
  createdAt: "2026-11-03T10:00:00.000Z",
  updatedAt: "2026-11-03T10:00:00.000Z",
  authority: "send_routine_support_message",
  integrationReady: true,
  attempts: [],
};

test("does not escalate from a generic acknowledgement alone", () => {
  const result = decideNextMove({
    ...base,
    latestResponse: {
      receivedAt: "2026-11-03T12:00:00.000Z",
      summary: "Refund requests can be self-served; support replies in 1–2 weeks.",
      answersRequest: false,
      offersActionableRoute: false,
      explicitDenial: false,
      statesDeadEnd: false,
    },
  }, "2026-11-03T13:00:00.000Z");
  assert.equal(result.action, "investigate");
  assert.equal(result.reason, "response_did_not_answer_request");
});

test("escalates after explicit dead-end evidence when routine messaging is authorised", () => {
  const result = decideNextMove({
    ...base,
    latestResponse: {
      receivedAt: "2026-11-03T12:00:00.000Z",
      summary: "Support confirms the current route cannot proceed.",
      answersRequest: false,
      offersActionableRoute: false,
      explicitDenial: false,
      statesDeadEnd: true,
    },
  }, "2026-11-03T13:00:00.000Z");
  assert.equal(result.action, "escalate");
  assert.equal(result.reason, "explicit_dead_end_or_denial");
});

test("escalates after repeated no-progress attempts", () => {
  const result = decideNextMove({
    ...base,
    attempts: [
      { at: "2026-11-01T10:00:00Z", channel: "support", kind: "message", summary: "Asked for status", outcome: "no_progress" },
      { at: "2026-11-02T10:00:00Z", channel: "support", kind: "message", summary: "Repeated with evidence", outcome: "blocked" },
    ],
  }, "2026-11-03T13:00:00.000Z");
  assert.equal(result.action, "escalate");
  assert.equal(result.reason, "repeated_no_progress");
});

test("does not call a case resolved without outcome evidence", () => {
  const result = decideNextMove({ ...base, status: "resolved", outcomeEvidence: [] });
  assert.equal(result.action, "verify_outcome");
});

test("waits for the review point instead of interrupting", () => {
  const result = decideNextMove({
    ...base,
    status: "waiting",
    nextReviewAt: "2026-11-04T10:00:00.000Z",
  }, "2026-11-03T13:00:00.000Z");
  assert.equal(result.action, "wait");
});

test("prevents an action that exceeds granted authority", () => {
  assert.equal(authorizeAction("send_routine_support_message", "draft").allowed, false);
  assert.equal(authorizeAction("draft", "send_routine_support_message").allowed, true);
  assert.equal(authorizeAction("external_commitment", "external_commitment").allowed, false);
});

test("requires a real objective and observable success criteria", () => {
  const result = decideNextMove({ ...base, successCriteria: [] });
  assert.equal(result.action, "request_human_judgment");
  assert.equal(result.reason, "objective_incomplete");
});
