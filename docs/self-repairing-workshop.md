# THE SELF-REPAIRING WORKSHOP - pilot 01

**Target:** Savannah in the existing ctrl+love GitHub + Railway production stack.

This is the first *observation layer*, not yet an autonomous coder or self-healing deployment. The workflow is deliberately read-only in production.

## What is running once merged into the default branch
- Every 15 minutes (GitHub Actions scheduling is best-effort, not guaranteed exact), request `/api/health` and `/savannah/` on `www.ctrlpluslove.com`.
- Report verified/unverified results with latencies and UTC timestamp. Store a JSON receipt for 14 days in GitHub Actions artifacts.
- On detection failure, open a GitHub issue (or comment on the existing open failure issue). Failed checks fail the run.
- Never send transcripts, identities, cookies, tokens, microphone audio, or customer information.
- Do not modify Railway, write application code, merge pull requests, or deploy automatically.

## Repair loop to add next
1. **Observe:** validate failure across repeated probes; differentiate outage from transient network errors.
2. **Diagnose:** collect sanitized build/runtime evidence, reproduce with a focused regression test.
3. **Propose:** create a repair branch and draft pull request, never edit `main` directly.
4. **Prove:** test the original failure separately from the coding agent, run lint/typecheck/build and browser checks.
5. **Authorize:** require human approval to merge/deploy until repair classes are explicitly whitelisted.
6. **Verify:** observe the running Railway release after deploy; rollback on genuine regression using existing Railway deployment history.
7. **Record:** keep the failure, hypothesis, change, independent result, uncertainty and human decision in a Repair Receipt.

## Important limits
- A successful HTTP check does *not* prove that Savannah's voice plays on iOS; iPhone Safari audio must be tested in an actual supported browser/device harness with permission/user gesture handling.
- No external speech request is made by this watchdog.
- A 200 response with an error page is not accepted as healthy unless it contains an HTML document.
- The workflow can miss short interruptions; its first failure may also be transient.
- Issue spam is limited to one *open* failure ticket, with ongoing failure comments; successful recoveries are visible in runs, not automatically posted as closing claims.

## Local command
`node scripts/workshop-watchdog.mjs`

## Operating principle
**An agent does not certify its own repair.** Independent checks and human-visible receipts are required. Do not silently rewrite Decision Memory or customer judgments.
