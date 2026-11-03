/**
 * Savannah Follow-Through Engine — decision core.
 *
 * Pure policy logic only: it recommends the next move but never performs
 * external side effects. Integrations must enforce credentials, idempotency,
 * per-channel rate limits, and the authority policy before acting.
 */

export type CaseStatus =
  | "active"
  | "waiting"
  | "blocked"
  | "resolved"
  | "closed";

export type ActionKind =
  | "verify_outcome"
  | "investigate"
  | "follow_up"
  | "escalate"
  | "wait"
  | "request_human_judgment"
  | "close";

export type ActionAuthority =
  | "read_only"
  | "draft"
  | "send_routine_support_message"
  | "external_commitment";

export interface FollowThroughAttempt {
  at: string;
  channel: string;
  kind: "research" | "message" | "escalation" | "verification";
  summary: string;
  outcome?: "progress" | "no_progress" | "blocked" | "unknown";
}

export interface FollowThroughCase {
  id: string;
  objective: string;
  successCriteria: string[];
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  nextReviewAt?: string;
  deadlineAt?: string;
  outcomeEvidence?: string[];
  attempts: FollowThroughAttempt[];
  /** Facts extracted from the latest external response, not model sentiment. */
  latestResponse?: {
    receivedAt: string;
    summary: string;
    answersRequest: boolean;
    offersActionableRoute: boolean;
    explicitDenial: boolean;
    statesDeadEnd: boolean;
  };
  /** Authority actually granted to Savannah for this case. */
  authority: ActionAuthority;
  /** Whether the relevant account integration is connected and healthy. */
  integrationReady: boolean;
}

export interface Decision {
  action: ActionKind;
  reason: string;
  rationale: string[];
  requiresHuman: boolean;
  suggestedAuthority: ActionAuthority;
  nextReviewAt?: string;
}

const ROUTINE_AUTHORITY: ActionAuthority = "send_routine_support_message";
const HUMAN_AUTHORITY: ActionAuthority = "external_commitment";

function validDate(value?: string): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function decision(
  action: ActionKind,
  reason: string,
  rationale: string[],
  options: Partial<Decision> = {},
): Decision {
  return {
    action,
    reason,
    rationale,
    requiresHuman: options.requiresHuman ?? false,
    suggestedAuthority: options.suggestedAuthority ?? "read_only",
    ...(options.nextReviewAt ? { nextReviewAt: options.nextReviewAt } : {}),
  };
}

/**
 * Select the next useful move from evidence and state.
 *
 * Escalation is evidence-driven: repeated lack of progress, an explicit
 * dead-end, or a denial can justify it. A generic acknowledgement alone
 * does not. Elapsed time can trigger a review, but never automatically proves
 * that escalation is warranted.
 */
export function decideNextMove(
  item: FollowThroughCase,
  now: string = new Date().toISOString(),
): Decision {
  const nowMs = validDate(now);
  if (nowMs === null) {
    return decision("request_human_judgment", "invalid_clock", [
      "The supplied current time is not a valid timestamp.",
    ], { requiresHuman: true });
  }

  if (!item.id.trim() || !item.objective.trim() || item.successCriteria.length === 0) {
    return decision("request_human_judgment", "objective_incomplete", [
      "A trackable objective and at least one observable success criterion are required.",
    ], { requiresHuman: true });
  }

  if (item.status === "resolved" || item.status === "closed") {
    if (item.outcomeEvidence?.some((e) => e.trim().length > 0)) {
      return decision("close", "outcome_verified", [
        "Evidence has been recorded for the stated outcome.",
      ]);
    }
    return decision("verify_outcome", "resolution_unverified", [
      "The case is marked resolved, but no outcome evidence is recorded.",
      "Do not report success until the success criteria are verified.",
    ]);
  }

  if (!item.integrationReady && item.authority !== "read_only") {
    return decision("request_human_judgment", "integration_unavailable", [
      "The connected action route is unavailable.",
      "Do not claim an external action was completed or silently switch to an unapproved channel.",
    ], { requiresHuman: true });
  }

  const deadlineMs = validDate(item.deadlineAt);
  const deadlinePassed = deadlineMs !== null && nowMs > deadlineMs;
  const attempts = item.attempts;
  const noProgressCount = attempts.filter((a) => a.outcome === "no_progress" || a.outcome === "blocked").length;
  const latest = item.latestResponse;
  const latestIsUnanswered = Boolean(latest && !latest.answersRequest);
  const explicitEscalationSignal = Boolean(latest && (latest.explicitDenial || latest.statesDeadEnd));
  const repeatedStall = noProgressCount >= 2;
  const actionableRoute = Boolean(latest?.offersActionableRoute);

  if (explicitEscalationSignal || repeatedStall) {
    if (item.authority === "send_routine_support_message" && item.integrationReady) {
      return decision("escalate", explicitEscalationSignal ? "explicit_dead_end_or_denial" : "repeated_no_progress", [
        explicitEscalationSignal
          ? "The latest response explicitly denies the request or says the current route is a dead end."
          : "At least two recorded attempts made no progress or were blocked.",
        "Choose a legitimate higher-level or alternative route and carry forward the evidence.",
      ], { suggestedAuthority: ROUTINE_AUTHORITY });
    }
    return decision("request_human_judgment", "escalation_needs_authority", [
      "The evidence supports escalation, but Savannah lacks authority to send the next message.",
      "Prepare the escalation and identify the required permission; do not stop tracking the objective.",
    ], { requiresHuman: true, suggestedAuthority: ROUTINE_AUTHORITY });
  }

  if (deadlinePassed) {
    if (item.authority === "send_routine_support_message" && item.integrationReady) {
      return decision("follow_up", "deadline_passed", [
        "The stated deadline has passed without verified resolution.",
        "Send a concise follow-up asking for status and a concrete next step.",
        "Escalate only if the response or accumulated evidence warrants it.",
      ], { suggestedAuthority: ROUTINE_AUTHORITY });
    }
    return decision("request_human_judgment", "deadline_passed_without_send_authority", [
      "The deadline has passed, but Savannah cannot send a routine follow-up with the current authority.",
    ], { requiresHuman: true, suggestedAuthority: ROUTINE_AUTHORITY });
  }

  if (latest && actionableRoute) {
    return decision("follow_up", "actionable_route_offered", [
      "The response offers a concrete route that may advance the objective.",
      "Evaluate that route against the success criteria before trying it.",
    ], { suggestedAuthority: item.authority === "read_only" ? "draft" : ROUTINE_AUTHORITY });
  }

  if (latest && latestIsUnanswered && attempts.length > 0) {
    return decision("investigate", "response_did_not_answer_request", [
      "The latest response did not answer the request and offers no actionable route.",
      "Check policy, evidence and alternative legitimate contact paths before replying.",
    ]);
  }

  if (item.status === "waiting" && item.nextReviewAt) {
    const reviewMs = validDate(item.nextReviewAt);
    if (reviewMs !== null && reviewMs > nowMs) {
      return decision("wait", "review_not_due", [
        "The next review point has not arrived.",
        "Keep the case active and resume at the scheduled review rather than interrupting the human.",
      ], { nextReviewAt: item.nextReviewAt });
    }
  }

  if (item.authority === "read_only") {
    return decision("investigate", "read_only_authority", [
      "Gather evidence and identify a useful next step without external side effects.",
      "If an action is warranted, prepare it and check the case's authority policy.",
    ], { suggestedAuthority: "draft" });
  }

  return decision("investigate", "insufficient_evidence_to_escalate", [
    "There is not yet enough evidence to justify escalation.",
    "Investigate the policy and available routes; elapsed time alone is not proof of a dead end.",
  ]);
}

/** Guardrail for adapters before carrying out a proposed action. */
export function authorizeAction(
  requested: ActionAuthority,
  granted: ActionAuthority,
): { allowed: boolean; reason: string } {
  const rank: Record<ActionAuthority, number> = {
    read_only: 0,
    draft: 1,
    send_routine_support_message: 2,
    external_commitment: 3,
  };
  if (requested === "external_commitment") {
    return {
      allowed: false,
      reason: "High-impact external commitments require a separately defined approval flow.",
    };
  }
  if (rank[requested] > rank[granted]) {
    return { allowed: false, reason: "Requested action exceeds the authority granted for this case." };
  }
  return { allowed: true, reason: "Action is within the case authority." };
}
