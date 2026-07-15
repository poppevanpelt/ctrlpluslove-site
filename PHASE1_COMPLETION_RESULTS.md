# ctrl+love Phase 1 Completion Results

Date: 2026-07-14  
Branch: `main`

## Required Fixes Closed

1. Dependency audit verified: approved `npm audit --audit-level=moderate` returned `found 0 vulnerabilities`.
2. Release scope made explicit: `RELEASE_SCOPE.md` classifies Phase 1 hardening, pre-existing launch content, automation, and uncertain assets.
3. Image/performance gap reduced: active large PNG delivery files were converted to WebP, references were updated, global `images.unoptimized` was removed, and per-image ambassador opt-outs were removed.
4. CSP tradeoff documented: `script-src 'unsafe-inline'` remains because production App Router HTML contains inline Next hydration/RSC scripts. The policy is a hardened baseline, not strict CSP.
5. Vercel cron corrected: the five-minute cron was removed from `vercel.json` pending operational approval because the endpoint expects a bearer secret and plan support cannot be assumed.
6. Clean-checkout typecheck fixed: `npm run typecheck` now runs `next typegen` before `tsc`.

## Image Results

- `public/` size: about 68 MB before this pass; about 44 MB after.
- Image files: 87 after this pass.
- Type distribution after: 31 PNG, 27 JPEG, 15 WebP, 13 SVG, 1 ICO.
- Active PNGs replaced with WebP: AI-y-fier hero, Dear Marjan, Dear Rob, four department documents, three Museum product images, three pricing documents, Reality poster, Unfinished Thoughts.
- Replaced PNG originals were removed from `public/`; uncertain legacy/source variants were preserved.
- Remaining files over 1 MB are mostly unreferenced/uncertain portrait/source variants, `public/DEARMARJAN.png`, `public/tools/ai-y-fier/assets/hero-dashboard.png`, `public/ai-y-fier-hero.png`, and `public/rob/raincoat.png`.

## CSP Decision

The theme bootstrap is externalized as `/theme-init.js`, but production HTML still includes inline Next scripts such as `self.__next_f.push(...)`. Removing `'unsafe-inline'` from `script-src` without a correct nonce or hash strategy would break hydration. A nonce system was not added in Phase 1 because it would make this static-heavy site more dynamic and would be fragile without a fuller architecture pass.

Future hardening item: implement a maintainable Next nonce/CSP strategy, then remove `script-src 'unsafe-inline'`.

## Theme And Cache Cleanup Decision

`public/theme-init.js` still unregisters all service workers and deletes all origin caches. This appears to be a legacy cleanup path for previous public service-worker/cache behavior (`public/sw.js` still exists and no active registration was found). It is operationally relevant because it can erase origin caches on every page load.

Phase 1 leaves the behavior in place to avoid reintroducing stale-service-worker issues during launch. Future hardening item: remove `public/sw.js`, confirm no production clients depend on it, then narrow or remove the repeated cache cleanup.

## Cron Decision

The `/api/room-refresh` route requires `Authorization: Bearer CRON_SECRET`. Vercel Cron sends GET requests and cron-specific headers, including `x-vercel-cron-schedule`, but it does not provide the configured bearer secret from `vercel.json`. Vercel docs also state Hobby cron is limited to daily runs, while Pro/Enterprise support per-minute scheduling.

The five-minute cron was disabled by removing it from `vercel.json`. Re-enable only after confirming:

- production Vercel plan,
- approved cadence,
- endpoint authentication mechanism,
- Notion/OpenAI cost budget,
- duplicate-run and failure monitoring.

## Verification

- `npm run typecheck` from a clean generated state: pass.
- `npm run lint`: pass.
- `npm test`: pass, with the existing Node module-type warning.
- `npm run build`: pass.
- Approved `npm audit --audit-level=moderate`: pass, 0 vulnerabilities.
- Local production HTTP checks on port 3001:
  - `/`: 200.
  - `/robots.txt`: 200.
  - `/sitemap.xml`: 200.
  - `/theme-init.js`: 200.
  - `/pricing/decision-stress-test.webp`: 200.
  - `/pricing/decision-stress-test.png`: 404 after replacement.
  - Security headers present.
  - `X-Powered-By` absent.

## Remaining Manual Release Decisions

- Approve or separate pre-existing content and design changes.
- Approve portrait, favicon, Apple icon, Museum, and Steel Ball asset changes.
- Decide whether Room automation API/lib/test changes belong in this release.
- Decide the permanent storage policy for source-quality and legacy public assets.
