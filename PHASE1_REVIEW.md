# Phase 1 Review

Date: 2026-07-14  
Reviewer stance: lead PR reviewer  
Scope: Phase 1 hardening work, compared against `PHASE1_BASELINE.md` and the current dirty worktree. Existing pre-Phase-1 changes are noted where they affect release risk, but not treated as newly introduced unless Phase 1 touched the behavior.

## Overall Quality Score

**7.4 / 10**

Phase 1 meaningfully improves the launch surface: Next was upgraded to the patched 16.2.10 line, production security headers are now emitted, `X-Powered-By` is disabled, route metadata is much more complete, and `robots.txt` / `sitemap.xml` work locally. The implementation is mostly conservative and verified by lint, tests, typecheck, build, and local HTTP inspection.

The main reasons the score is not higher are:

- The release still depends on an ambiguous dirty worktree, including many pre-existing image and content changes.
- The image/performance portion of Phase 1 is mostly documented rather than completed.
- The CSP is a good baseline, but still depends on `'unsafe-inline'`, which leaves a notable security gap.
- `npm audit` could not be re-run in this environment, so the vulnerability exit criterion is not independently verified here.
- A few operational choices, especially the five-minute Vercel cron, need confirmation before production.

## Required Fixes

### 1. Confirm `npm audit` outside this sandbox before release

Files: `package.json`, `package-lock.json`

`next`, `eslint-config-next`, and `@next/swc-wasm-nodejs` were upgraded to `16.2.10`, and the local lockfile reflects that dependency line. However, I could not complete `npm audit --audit-level=moderate` because the sandbox cannot access the npm registry, and the escalation was rejected because it would send dependency metadata externally.

Required before release:

- Run `npm audit --audit-level=moderate` in the approved release environment.
- Confirm the direct high-severity Next.js advisory from the baseline is gone.
- Record any remaining moderate/high advisories and whether they are accepted, patched, or blocked by upstream packages.

### 2. Do not ship until the release scope is cleanly checkpointed

Files: worktree-wide, `PHASE1_BASELINE.md`

The baseline correctly recorded a dirty worktree before Phase 1. The current tree is still dirty and now includes Phase 1 changes mixed with pre-existing image, content, API, and Room automation changes. This directly conflicts with the Phase 1 goal of making the release state easy to identify.

Required before release:

- Separate pre-existing work from Phase 1 hardening, or explicitly approve the whole dirty tree as launch scope.
- Review all changed binary assets intentionally, especially portraits, favicon files, Apple icons, and `public/museum/steel-ball-packshot.png`.
- Commit or otherwise checkpoint the exact release candidate.

### 3. Resolve the image/performance Phase 1 gap

Files: `PUBLIC_ASSET_AUDIT.md`, `next.config.ts`, `public/**`

`PUBLIC_ASSET_AUDIT.md` is useful, but Phase 1 did not substantially reduce the public asset footprint. It removed only `public/.DS_Store`, while many active PNGs remain over 500 KB and `images.unoptimized: true` remains in `next.config.ts`.

Required before calling Phase 1 complete:

- Either complete the active image optimization pass for the large homepage, pricing, museum, department, ambassador, and document images, or explicitly move that work out of Phase 1.
- Decide whether `images.unoptimized: true` is an intentional production strategy or only a temporary stability choice.
- Add a short note to the release checklist about the chosen image strategy so this does not stay ambiguous.

### 4. Tighten or explicitly accept the CSP tradeoff

File: `next.config.ts:8`

The new CSP is present in local responses and is a good baseline. However, `script-src` still allows `'unsafe-inline'`, which materially weakens XSS protection. Moving the theme bootstrap from inline script to `/theme-init.js` is a useful step, but the policy has not yet taken advantage of that move.

Required before release:

- Decide whether `'unsafe-inline'` is still required by Next/Vercel runtime scripts in this app.
- If it is required, document the accepted risk in the release checklist.
- If it is not required, replace it with a stricter script policy using hashes/nonces or external scripts only.

### 5. Confirm Vercel cron plan, cadence, and endpoint compatibility

File: `vercel.json:2`

Phase 1 adds a `*/5 * * * *` cron for `/api/room-refresh`. This is operationally significant: it changes production behavior by invoking the Room refresh endpoint every five minutes.

Required before release:

- Confirm the Vercel plan supports this cron cadence.
- Confirm `/api/room-refresh` has the expected authentication behavior for Vercel Cron.
- Confirm the Notion/OpenAI downstream cost and rate implications of a five-minute schedule.
- Confirm this cron addition is part of Phase 1 launch scope, not an unrelated automation change.

### 6. Make the standalone `typecheck` command reliable from a clean checkout

Files: `package.json:13`, `tsconfig.json:30`

`npm run typecheck` failed before a fresh build because `tsconfig.json` includes generated `.next/types/**/*.ts` files that were referenced but missing. After `npm run build`, `npm run typecheck` passed. This means the new `typecheck` script can fail in a clean checkout unless the build has already generated `.next/types`.

Required before release:

- Adjust the workflow so `npm run typecheck` is always run after a type-generating Next step, or update the script/config so it passes from a clean checkout.
- Reflect the required order in `RELEASE_CHECKLIST.md` if the chosen solution is procedural.

## Optional Improvements

### 1. Remove `Host` from `robots.txt` unless there is a specific search-engine reason

File: `src/app/robots.ts:19`

The generated `robots.txt` includes `Host: https://www.ctrlpluslove.com`. This is not harmful for most crawlers, but it is not part of the broadly used Google robots directive set and can be omitted for simplicity. The sitemap URL is enough for canonical discovery.

### 2. Add route coverage checks for metadata routes

Files: `src/app/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`

The new `publicRoutes` array is now a second route inventory. It is small enough to manage manually today, but it can drift as pages are added. A lightweight test could assert that intended public App Router pages are present in `publicRoutes`, and that no `noindex`/legacy routes leak into the sitemap.

### 3. Prefer absolute OG image URLs in metadata helpers

File: `src/app/seo.ts:60`

Local rendering resolved the default OG image to `https://www.ctrlpluslove.com/ctrl-love-logo-gradient-master.png`, so the current behavior works. Still, `createPageMetadata` accepts relative image paths and passes them directly into Open Graph/Twitter metadata. Using `absoluteUrl(image)` for local images would make the helper more explicit and less dependent on metadata inheritance.

### 4. Document the broad service-worker/cache cleanup behavior

File: `public/theme-init.js:4`

The theme bootstrap unregisters all service workers and deletes all caches for the origin. This behavior existed before Phase 1 as an inline script, so it is not a new regression, but moving it into a public script makes it a good moment to document why it still belongs in the bootstrap path and when it can be removed.

### 5. Replace the test runner warning with an explicit module decision

File: `package.json:14`

`npm test` passes, but Node warns that the package does not specify `"type": "module"` while tests use ESM syntax. This is not release-blocking, but it adds noise to the quality gate and should be cleaned up when convenient.

## Positive Findings

- Local `npm run lint` passes.
- Local `npm test` passes: 17 tests passed.
- Local `npm run build` passes on Next `16.2.10`.
- Local `npm run typecheck` passes after a fresh build regenerates `.next/types`.
- Local HTTP inspection confirms the security headers are present on `/` and static `/theme-init.js`.
- Local HTTP inspection confirms `X-Powered-By` is absent.
- `/robots.txt` returns 200 and excludes API, duplicate, legacy tool, and source-copy paths.
- `/sitemap.xml` returns 200 and includes the intended public canonical routes plus generated ambassador profiles.
- Duplicate public pages checked locally:
  - `/pricing-documents/` has `noindex, follow` and canonical `/pricing/`.
  - `/living-decision-simulator-episode-002/` has `noindex, follow` and canonical `/living-decision-review/`.
- Moving the theme bootstrap out of inline JSX reduces CSP friction and makes the bootstrap easier to review.
- `RELEASE_CHECKLIST.md` covers the right categories: clean status, env vars, quality gates, metadata, headers, assets, links, cron, and rollback.

## Verification Performed

Commands/checks run locally:

- `npm run lint` - pass.
- `npm test` - pass, with existing module-type warning.
- `npm run build` - pass.
- `npm run typecheck` - initially failed before build because `.next/types` files were missing; passed after build.
- `npm audit --audit-level=moderate` - not completed due network/policy limitation.
- Local server on port 3001:
  - `GET /` returned 200 with CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options`.
  - `GET /theme-init.js` returned 200 with the same security headers.
  - `GET /robots.txt` returned the expected allow/disallow rules and sitemap.
  - `GET /sitemap.xml` returned the expected XML route inventory.
  - Rendered metadata spot-checks passed for `/`, `/pricing-documents/`, and `/living-decision-simulator-episode-002/`.

## Release Recommendation

**Do not ship Phase 1 as complete yet.** The code direction is solid, but the release should wait for audit verification, clean-scope checkpointing, an explicit image strategy, CSP risk acceptance or tightening, cron confirmation, and a reliable clean-checkout typecheck story.

Once those are resolved, this is close to a good launch-hardening pass.
