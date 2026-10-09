# Production deployment status — October 9, 2026

## Intended path

GitHub `poppevanpelt/ctrlpluslove-site`, branch `main` → Railway project `456f54d0-1f40-41e4-b2e3-3f4f231cea8b`, environment `fd5febc4-d8d5-47af-b49a-4ecadbdd47ab`, service `2053a1b5-3ce9-40ef-8dba-8f271d19e2e1`.

Railway uses the repository Dockerfile (Node 22, `npm ci`, `npm run build`, `npm start`). The platform config reports RAILPACK, but build logs confirm Dockerfile detection. It follows `main`, has one sfo replica, and does not wait for GitHub check suites. There are no staged changes or Railway project notification webhooks. Preserve volume `savannah-private-inbox` mounted at `/app/data`.

## Observed state before this cleanup

Railway deployment `26fef567-28b0-4d3e-9267-2b33e397a789` is SUCCESS on `90c06269c0009f2455f3663331f19f3abd5be1d6`, created 19:04 UTC. Its generated hostname is `ctrlpluslove-site-production.up.railway.app`.

Builds for `d66dfdb` and `80d4a73` genuinely failed. The latter log reports `Selector "h1" is not pure` in `src/app/readiness/readiness.module.css`. The fix `d3f1467` and subsequent builds have been replaced by newer deployments. `a36faaf` is REMOVED, not the current production deployment; its current GitHub Railway status is failure. Inspect current Railway deployment state rather than treating historical status as an outage.

HTTP logs include successful homepage, instruments, pricing and other page requests. Savannah transcription, chat and voice POSTs returned 200 at 18:58 UTC on the previous deployment. This is evidence of server requests, not proof of microphone/audio/lip-sync quality on the latest deployment. The latest deployment served homepage and media at 19:48 UTC. Cloud-browser testing was stopped by Railway's repeated browser-verification page.

## Domains: cutover NOT complete

ChatGPT Sites project `appgprj_6aa819e66fc081918d6f561b38564f5b` (Instrument Cabinet) reports ACTIVE custom domains and SSL for both `ctrlpluslove.com` and `www.ctrlpluslove.com`. Public fetches return differing site content. Preserve this live Sites project and all existing DNS until cutover verification is complete.

Initially Railway reported an unverified `www` binding with certificate VALIDATING_OWNERSHIP. A subsequent read during this session showed that binding absent; no Railway domain mutation was performed in this cleanup. Current Railway service configuration lists only its generated hostname. Reattach and retrieve fresh domain requirements before preparing a cutover; do not reuse the earlier binding's verification values.

WordPress confirms the domain uses WordPress.com nameservers and this user can manage its records. The domain listing labels its status `transfer_completed` (warning), paid through May 31, 2028, with no listed action required. Its actual DNS zone shows:

| Record | Current routing | Action |
| --- | --- | --- |
| www CNAME, TTL 300 | custom-domains.chatgpt.site. | Preserve until Railway binding/TLS and interactive verification pass. |
| apex ALIAS, TTL 300 | kzeegy3u.up.railway.app. | Existing target is not identified in current service inventory; preserve until resolved. |
| live and move CNAME | custom-domains.chatgpt.site. | Preserve these separate live services. |

The Sites domain bindings are active, but that alone does not establish DNS routing to Sites. Public apex/www fetches differ. There is an apex `_railway-verify` TXT in the zone, but no `_railway-verify.www`; do not overwrite verification records without checking the current target service. The other Railway project, vigilant-clarity, has no services. No DNS records were changed.

The apex is not attached to Railway. Add and verify it before migrating the apex, or configure a verified apex-to-www redirect at the DNS/hosting provider. Preserve MX, email TXT, live.ctrlpluslove.com, move.ctrlpluslove.com, and other services. Do not remove Sites domain bindings before Railway TLS and traffic are verified. Record rollback DNS values before the switch.

## Vercel inventory and cleanup

Five status contexts point to Vercel's account-deployment-blocked help page, independent of Railway builds:

| Project | ID | Disposition |
| --- | --- | --- |
| ctrlpluslove-site | prj_kSL43I98d8bow0fcHxgeSl7dzAoj | Preserve deployments and aliases; has apex/www bindings and a READY historical production deployment. |
| app | prj_heuRUIzzb4cHQEdFPkNV8MWlguXc | Duplicate build/check candidate, with historical READY deployment and Vercel aliases; preserve until usage/dependencies are checked. |
| app-jd3j | prj_ZpRuE0yz6UjQR8d1MEb2ZbP5Sma7 | Duplicate build/check candidate, with historical READY deployment and aliases; preserve pending usage review. |
| ctrlpluslove-site-public | prj_juYwPC0g3xiyVLfJAvuQ5GME9h5X | Duplicate build/check candidate, with historical READY deployment and aliases; preserve pending usage review. |
| ctrllove-handoff | prj_HG2UjX7uV9g1pRpbdaZQuUSOHmFD | Duplicate build/check candidate; no listed domains but a historical READY deployment exists. Preserve pending dependency review. |

Vercel metadata reports live=false for these projects; this does not prove zero traffic. No project, deployment, domain or account integration is deleted. `sakura-radar` and `ctrlpluslove-schema-check` are outside this cleanup. `vercel.json` now disables automatic Git deployments using the documented `git.deploymentEnabled=false`; this does not disconnect the Vercel GitHub App or erase historical checks. The cleanup push was checked: all five account-blocked Vercel failure contexts still appear despite the repository setting. This setting did not silence account-level status noise. Dashboard Git disconnection is still required per project after checking dependencies. The browser sign-in attempt via Google ended at a gateway connection error; a fresh Vercel settings visit still shows login, so no dashboard integration was disconnected.

The old `/api/redeploy` Vercel deploy-hook bridge returns 410 and performs no outbound requests, even if stale environment variables remain. Existing Notion button/webhook configuration was not accessible or modified. Disconnect any caller of this endpoint. Railway had neither VERCEL_DEPLOY_HOOK_URL nor NOTION_REDEPLOY_SECRET configured, so the bridge was already unusable there.

Vercel Analytics and Speed Insights now render only when VERCEL=1, avoiding observed /_vercel/* script 404s on Railway. Existing Vercel builds retain their telemetry. No scheduled room jobs were changed.

## Remaining acceptance checks

- Inspect Render service/domain/auto-deploy state before disabling it. No Render connector is available in this session; lack of render.yaml does not prove no service exists.
- Cleanup commit `298feff9000a8e94be93ad2f6b1776fb49be9eae` automatically deployed as `90bbfca7-4b60-4f7b-ba63-3b7cf07075e1`: SUCCESS at 19:59 UTC, with GitHub Railway status success. Runtime logs confirm Next.js ready on port 8080 and the volume mounted. The only startup warning observed was Node SQLite experimental status. The retired route was locally checked for HTTP 410/no outbound requests and syntax; full build was verified by Railway. Documentation follow-up is tracked separately by commit.
- Run homepage, instrument cabinet, /readiness/, /savannah/ and room-access checks on the latest Railway build; test both slash forms where used by links.
- Test Savannah typed response, microphone transcription, voice playback and speech motion in a real browser. The cloud-browser challenge blocks current interactive verification.
- Configure private Desk Google OAuth/session settings securely. Railway currently lists only OPENAI_API_KEY and SAVANNAH_INBOX_DB; GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SAVANNAH_SESSION_SECRET and SAVANNAH_OWNER_EMAIL are absent. Client inbox invitations also need SAVANNAH_INBOX_CLIENTS. Do not weaken authentication to compensate.
- After Railway custom-domain ownership/TLS and endpoint checks pass, switch DNS with a rollback record and verify apex/www reach the same intended deployment.

PR #124 is an old, conflicted draft for Sites/Vinext replacement hosting, not a completed Railway migration. It was not merged or repurposed.
