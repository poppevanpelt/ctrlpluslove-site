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
