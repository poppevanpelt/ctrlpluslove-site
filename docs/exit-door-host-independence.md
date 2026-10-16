# EXIT DOOR — host independence runbook

Purpose: preserve ctrl+love and Savannah if any one hosting provider cannot accept deploys. This runbook records observed infrastructure on 2026-10-12. It is NOT a claim that every API, payment flow or media path has been end-to-end tested.

## Verified inventory (2026-10-12)
- Source of truth: GitHub `poppevanpelt/ctrlpluslove-site`, production branch `main`.
- Primary Vercel project: `ctrlpluslove-site` (project `prj_kSL43I98d8bow0fcHxgeSl7dzAoj`). Recent GitHub statuses reported deployment blocks. Existing Vercel production deployment remained READY.
- Independent Railway project: `ctrlpluslove-site` (`456f54d0-1f40-41e4-b2e3-3f4f231cea8b`), environment `production` (`fd5febc4-d8d5-47af-b49a-4ecadbdd47ab`), service `ctrlpluslove-site` (`2053a1b5-3ce9-40ef-8dba-8f271d19e2e1`).
- Railway service tracks the same GitHub repository, branch `main`; latest deployment was SUCCESS when inspected.
- Railway-generated hostname: `ctrlpluslove-site-production.up.railway.app`.
- Railway custom hostname: `www.ctrlpluslove.com`; Railway reported verified ownership, valid certificate and propagated CNAME to `8oal7ju0.up.railway.app`.
- Railway persistent volume `savannah-private-inbox` mounted at `/app/data`, 500 MB, in `sfo`. DO NOT destroy or replace it as part of a host switch.
- Repository includes a Node 22-based Dockerfile and standard `npm run build` / `npm start` scripts. Next.js is not inherently tied to Vercel.
- The exact traffic route for apex `ctrlpluslove.com`, all API secret configurations and full media/payment behavior remain to be verified.

## No-surprise principles
1. Keep production Savannah voice and audio playback working. Treat `/savannah/lip-sync` / Simli as a separate experiment.
2. Never repoint apex DNS, disable Vercel, delete a service, change payment webhooks, or move volumes as part of an unreviewed deploy.
3. Keep private keys in host secret stores. Compare **names/presence only**, never log secret values, copy .env into Git or paste credentials in reports.
4. Use the GitHub main branch/commit SHA to compare provider deployments. Do not assume both hosts run the same commit.
5. Don't confuse independent compute with independent services: voice, databases, persistent files, video CDN, domains, Stripe webhooks, and third-party APIs may remain dependencies.

## Verify the independent route
1. Inspect Railway deployment status, branch and SHA; check that its domain responds with the intended site (not merely HTTP 200 or a stale placeholder).
2. Exercise basic page navigation and a non-sensitive test instrument.
3. Confirm Savannah portrait/video loads, voice playback and microphone permissions on desktop Safari/Chrome and iPhone Safari.
4. Check protected routes, API auth, and intentional 401/403 behavior. Avoid real customer data or paid transactions in a test.
5. Verify media URLs, CORS/CSP and external provider redirects specifically on the Railway hostname and `www` origin.
6. Independently validate Stripe webhook URLs/signatures, idempotency and delivery paths using sandbox/test mode before any changes to production payments.
7. Back up and restore-test the `/app/data` content using an approved encrypted process; confirm ownership, retention, and permissions. A volume is not a backup.
8. Compare apex `ctrlpluslove.com` DNS with `www.ctrlpluslove.com`, HTTP redirects and canonical URLs. Do not switch DNS until rollback is documented and tests pass.
9. Confirm logs and alerting on the alternative host. Record evidence of successful tests and deployment SHAs below.

## Failover procedure — manual, gated
- Freeze changes; record Vercel and Railway deployment SHAs and current DNS/TTL.
- Verify Railway is healthy and that all required runtime secrets and persistent dependencies are available.
- Make and verify a backup of data before any stateful migration. Prefer continuity of the existing Railway volume to moving it.
- Route traffic only after an explicit production go/no-go. If switching apex, update DNS at its authoritative provider, retain previous records for rollback, and check resolution/HTTPS from multiple networks.
- Run smoke tests (homepage, navigation, Savannah voice, mic, protected API, instruments, payments in controlled mode), then observe errors and traffic.
- Roll back DNS or traffic to the last healthy provider if any critical path fails. Preserve volumes and audit logs; never wipe data during rollback.

## Evidence ledger
| Check | Status 2026-10-12 | Evidence |
| --- | --- | --- |
| Railway service exists and tracks GitHub main | VERIFIED | Railway describe-environment |
| Railway deployment success | VERIFIED (historical status) | Railway describe-environment |
| www DNS points to Railway | VERIFIED | Railway domain-status |
| www TLS valid | VERIFIED | Railway domain-status |
| Apex DNS and effective traffic target | NOT TESTED | Needs DNS / HTTP verification |
| Savannah live voice and lip sync on Railway | NOT TESTED | Requires real-device QA |
| Secrets and payment parity | NOT TESTED | Requires private environment review |
| Encrypted backup and restore of inbox volume | NOT TESTED | Requires backup validation |
| Full failover + rollback drill | NOT TESTED | Do not switch traffic yet |

## Next action
Turn this inventory into a repeatable health check and test matrix, then verify the alternative endpoint in a browser. Do not claim EXIT DOOR is production-ready until every critical path is independently checked.

## Repeatable read-only HTTP checks
Run `node scripts/exit-door-smoke.mjs` from any machine with external network/DNS access. Optional explicit HTTPS origins may be provided as positional arguments. This verifies basic page content and response codes on www and the Railway-generated host; it makes no state-changing requests and is not a substitute for browser voice/Stripe/backup tests. In the current execution environment, external DNS lookup was unavailable, so the script could not be executed against public hosts here. Railway's own recent HTTP logs independently show successful responses for both hostnames, including `GET /` on www and `GET /pricing/` on the Railway domain.

## Railway storage/auth audit — 2026-10-12
- The connected Railway production service was ONLINE with one healthy replica and no reported recent failures. Its attached 500 MB persistent volume is mounted at `/app/data`.
- The service variable inventory (names only; no values disclosed) includes `OPENAI_API_KEY` and `SAVANNAH_INBOX_DB` as app-specific settings. It does **not** list `SAVANNAH_SESSION_SECRET`, `SAVANNAH_OWNER_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or `SAVANNAH_INBOX_CLIENTS`.
- Source inspection: `src/app/api/savannah/inbox/shared.ts` requires the first four missing authentication settings plus `SAVANNAH_INBOX_DB` for `configured()` to return true. Consequently the mounted volume does not prove the private inbox endpoint is ready; this must be tested once settings are intentionally configured via Railway's secret store. Do not generate replacement credentials blindly: identity provider settings must match their existing OAuth callback configuration.
- Savannah neural voice route `src/app/api/savannah-voice/route.ts` uses `OPENAI_API_KEY` and OpenAI TTS. This suggests the Railway service can render speech, but voice playback and device permissions have not been tested end-to-end.
- Stripe/Vapi names are absent from this specific Railway service; other integrations may be hosted elsewhere. Payment completion and webhook parity remain unverified. Never test with a live charge.
- The last successful Railway deployment resolved to commit `ff4209f7ff675a8f6b601f8dbfcdad7a2c199034`, the same SHA used as the base of EXIT DOOR PR #161. The runbook changes do not deploy by themselves.
- An authenticated encrypted backup-and-restore procedure remains **NOT IMPLEMENTED / NOT EXECUTED**. Do not export or copy the SQLite file until an approved, encryption-protected recovery destination and a verified consistent snapshot method are available. An attached volume is not a backup.

## Offline encrypted recovery utility (2026-10-12)
- Implemented `scripts/exit-door-sqlite-backup.mjs` and `tests/exit-door-sqlite-backup.mjs` on this PR branch.
- Local synthetic SQLite test **PASSED**: WAL-backed data captured using `VACUUM INTO`, AES-256-GCM encrypted snapshot, valid restored row and integrity check, rejection of wrong passphrase. Node's SQLite support may show an experimental warning depending on runtime.
- Operator-only commands: `node scripts/exit-door-sqlite-backup.mjs backup /path/to/source.sqlite /secure/location/snapshot.enc` and `node scripts/exit-door-sqlite-backup.mjs restore /secure/location/snapshot.enc /new/location/restored.sqlite`. Provide `EXIT_DOOR_BACKUP_PASSPHRASE` (24+ characters) through an approved secret mechanism; never commit it or paste it into logs.
- Both output paths MUST be new; script refuses overwrite. Restores are deliberately never applied in place to production. Handle plaintext restored files carefully and delete them securely when no longer needed.
- **Not yet performed:** any snapshot or restoration of the actual `/app/data` volume, offsite backup, scheduling, secret escrow, retention policy, recovery time measurement, or production failover. These require separate operational approval and secure storage.

## Railway native volume backups — operator procedure
Railway documents native manual and scheduled volume backups for SQLite-containing volumes. This connected Railway integration does not expose backup/schedule creation or listing, so **no native backup was created or verified by the agent**.

1. Open Railway project `ctrlpluslove-site` → production service `ctrlpluslove-site` → **Backups** tab for attached `savannah-private-inbox` volume.
2. Review current snapshots and current used volume space before proceeding. Railway limits manual backups to 50% of volume total capacity.
3. Set **Daily** and **Weekly** schedules if available/appropriate, then trigger one **manual backup**. Note Railway documentation says daily retained 6 days and weekly 27 days; confirm UI before acceptance.
4. Record backup timestamp and successful completion. Do **not** press Restore on production as a test: restoring stages a replacement mount and deployment would redeploy the live service.
5. Treat a Railway snapshot as *same-provider disaster recovery only*. Railway states native backup restore is limited to the **same project and environment**, and wiping a volume deletes its backups. Keep the encrypted portable SQLite snapshot plan for genuine host independence.
6. Do not claim production backup coverage until a completed snapshot is visible and a safe restore verification has been performed.

Reference: https://docs.railway.com/volumes/backups


## Operational exit gate — 2026-10-16

**Decision: HOLD Vercel discontinuation.** The verified www service is independent compute; the complete service has not passed the exit gate. An October 17 payment retry is not a verified shutdown deadline. No payment, cancellation or DNS change is authorized by this record.

### Current evidence (supersedes the October 12 status where different)
- Main and the healthy primary Railway deployment both resolve to `9dc519c37d16aaeeb56c29a2a1078dc098a658c1`; one replica, no failures reported in the preceding 24 hours.
- `www.ctrlpluslove.com` has propagated CNAME `8oal7ju0.up.railway.app`, verified ownership and valid Railway TLS. Browser navigation and the Meeting Filter's three-answer result were exercised.
- WordPress is the authoritative DNS provider. Its apex ALIAS is `kzeegy3u.up.railway.app.` with TTL 300. That alias was not matched to a current connected Railway service. Browser reload left the apex URL unchanged and showed older copy; www showed newer copy. Do not infer that this is the current primary Railway deployment.
- Vercel retains an apex-to-www 308 domain setting, but that setting is not proof of the effective live route. Vercel's last inspected production artifact is `9a1e25f15c7a719fcdcaaa991e3b3ae4fd98531b`, older than Railway.
- The second successful check belongs to `brilliant-contentment`. Its service has only `SIMLI_API_KEY`, no live domains and no volume: it is not a verified standby for www.
- Railway HTTP logs on October 16 show 200 responses for chat, speech generation and transcription. This is backend evidence, not proof of audible playback, microphone/device permissions or Vapi call completion.
- Primary Railway variable names remain only `OPENAI_API_KEY` and `SAVANNAH_INBOX_DB`. Private inbox authentication is unconfigured. `NOTION_TOKEN` is absent, so Radar writes cannot be considered working. Room processing also needs `CRON_SECRET` and `NOTION_RUNS_DATA_SOURCE_ID` (or legacy `NOTION_PROJECT_DATABASE_ID`). No poller or cron service is present in this production environment.
- Vercel's name-only inventory includes `NOTION_TOKEN`, `RADAR_SIGNALS_DATA_SOURCE_ID` and `CRON_SECRET`; it does not establish a complete or working room configuration. Existing sensitive values cannot be assumed exportable; enter credentials directly into the approved host secret store.
- The inspected museum ordering path opens an email request and takes no payment. Stripe webhook targets, fulfillment and payment return URLs remain unverified.
- Vercel analytics and speed insights are conditional on `VERCEL === "1"`. The retired redeploy route returns 410. No new Vercel deployment bridge is needed.
- Volume backup completion, offsite recovery, actual data integrity, and rollback execution remain unverified. The presence of a rollback button or successful synthetic backup test is insufficient.

### Prepared domain change — explicit approval required before applying
1. Preserve this exact old apex record: ALIAS `ctrlpluslove.com.` → `kzeegy3u.up.railway.app.`, TTL 300. Preserve all mail, verification and unrelated DNS records.
2. Register apex `ctrlpluslove.com` on primary Railway service `2053a1b5-3ce9-40ef-8dba-8f271d19e2e1` in production. This registration can change routing; do not perform it before the production approval.
3. Read Railway's exact returned routing and verification requirements. Do not assume the apex uses the same target as www. If the hostname is owned by another service, investigate before removing or moving it.
4. Prepare the WordPress ALIAS update and any exact ownership TXT required by Railway; review before applying. Keep www CNAME unchanged.
5. Prefer a single public canonical origin, `https://www.ctrlpluslove.com`. This PR updates SEO metadata accordingly. Prepare an apex-to-www redirect preserving path/query and HTTP method, but do not enable a global redirect until payment/OAuth callbacks are reviewed. Redirects do not replace valid apex TLS.
6. Verify both origins from independent networks, exact deployed SHA, critical APIs, media, OAuth callbacks and sandbox payments. Watch errors after the change.
7. DNS rollback record is known, but the old alias is not a proven healthy recovery target. Verify the old destination before counting on it. Prefer the retained Railway deployment for code rollback; preserve the mounted volume. Never fall back to an unavailable Vercel account.

### Prepared application safeguards (not deployed)
- `GET /api/health`: lightweight liveness plus Railway git revision, no upstream calls or secret/configuration disclosure. It is not dependency readiness.
- `scripts/exit-door-release-smoke.mjs --revision=<DEPLOYED_SHA>`: only public GETs, validates content, www canonical, manifest JSON and release identity; checks each redirect hop and rejects an unapproved/Vercel origin, loops, stale releases and stalled response bodies.
- Existing basic smoke remains available for historical baseline checks. It does not enforce this release gate.
- Validation: Node 24 local run of health, release-smoke and existing synthetic SQLite recovery tests: **8 tests passed**. A full Next build and external smoke run were not performed in the restricted local network.
- Do not interpret this PR or its tests as a live health monitor. External uptime/alert delivery still requires configuration and validation.

### Configuration and recovery work still required
| Feature | Needed before go |
| --- | --- |
| Radar | Set NOTION_TOKEN securely on Railway; verify the intended data-source ID and submit one agreed non-sensitive test signal. |
| Room processing | Supply Notion data-source ID, CRON_SECRET and token; verify one dry run before enabling a separate scheduler. |
| Inbox | Configure Google OAuth client, secret, owner identity, session secret and approved client mapping. Register the www callback exactly; do not invent identities or allowlists. Verify DB path is beneath /app/data. |
| Payments | Confirm the relevant Stripe account, inspect enabled webhook URLs and return URLs, then test signatures/retries/idempotency in sandbox. No live charges. |
| Volume | Inspect Backups UI, verify a completed snapshot, then safe restore to an isolated destination; establish encrypted portable recovery, retention and key custody. Do not restore over production. |
| Voice/media | Check desktop Chrome/Safari and iPhone Safari; verify actual audio, microphone and call completion, plus portrait/video delivery. |
| Recovery | Rehearse code rollback using retained Railway artifacts without moving/wiping the volume; record RTO/RPO. |
| Monitoring | Configure independent HTTPS and integration checks plus verified alert delivery. A deploy healthcheck only gates rollout. |

**Exit acceptance:** resolve and prove apex routing; pass critical service tests; establish usable credentials outside Vercel; verify payment delivery and recoverable storage; prove rollback and alerting. Until then, www continuity is supported by evidence but full operational independence is not certified.

### Follow-through in this session
- Railway production now has a **pending, unapplied** patch setting deployment healthcheck path `/` and timeout 60 seconds. This works with the existing homepage and does not depend on the proposed health route. It is rollout gating, not continuous uptime monitoring. No deployment was triggered.
- The Railway Backups UI was inspected using the current signed-in session. It states **Upgrade to Pro for backups and PITR**; new backups, automated schedules and PITR cannot be configured on the current plan. No upgrade was purchased and no actual snapshot/restore was performed. A portable encrypted backup remains an alternative, but volume access, approved secure destination and key custody must first be established.


