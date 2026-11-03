# Savannah Follow-Through Engine

## Purpose

Keep delegated objectives moving toward a verified outcome, even when the human stops paying attention. The engine is not a generic “agent” wrapper: it is a durable objective, evidence, judgment, authority and closure loop.

## Current slice

- Pure, deterministic decision core in `src/app/savannah-follow-through.ts`.
- Case model tracks objective, observable success criteria, attempts, response signals, deadline/review point, outcome evidence, granted authority and integration health.
- Decisions include investigate, follow up, escalate, wait, verify, close, or request human judgment.
- Tests cover generic acknowledgements, evidence-driven escalation, repeated no-progress, unverified resolution, waiting, authority limits and incomplete objectives.
- No external messages are sent by this module.

## Decision principles

1. **Own the objective, not the task list.** Track success criteria to closure.
2. **Escalate on evidence.** Explicit denial/dead end or repeated no-progress can justify escalation. A generic acknowledgement or elapsed time alone cannot.
3. **Use the smallest effective next move.** Investigate before escalating when evidence is insufficient.
4. **No pretend completion.** Resolution requires outcome evidence.
5. **Authority is explicit and scoped.** Read, draft and routine support messaging are distinct levels. High-impact commitments always require a separate approval path.
6. **Persist and resume.** The next implementation step is durable case storage and a scheduled runner that re-evaluates cases without depending on an open chat.
7. **Verify every external action.** Adapters must record the attempt, idempotency key, returned result and evidence of effect.
8. **Interrupt only for genuine blockers.** Keep a case moving autonomously within authority; request human judgment only when authority, identity, ambiguous evidence, legal/financial commitment or a material risk makes it necessary.

## Next implementation steps

- Add a durable case store and append-only event history using the project's supported database configuration.
- Add a protected case API and a read-only case timeline UI.
- Add a scheduler/worker that resumes due cases, applies bounded retries and stops on completion or policy limits.
- Connect one real integration only after checking its permissions and available actions. Start with the Vercel support case as a dry-run fixture; do not send messages automatically until explicit per-case authority and integration health are verified.
- Add tests for duplicate prevention, retries, expiry, conflicting evidence, and safe stop conditions.

## Test case: Vercel refund request

The generic “self-service may help / response time 1–2 weeks” acknowledgement is not, by itself, proof of a dead end. Savannah should investigate the actual refund route and case context. It should only escalate when the route is demonstrably inadequate, explicit denial/dead-end evidence appears, or repeated attempts make no progress. The user's current lack of enthusiasm is not permission to abandon the objective, nor is it permission to send messages through an unconfigured channel.
