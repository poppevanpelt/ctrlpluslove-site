# ctrl+love Release Scope

Date: 2026-07-14  
Branch: `main`

This file classifies the dirty worktree into release groups. It does not approve uncertain content; it makes the decision points visible.

## Intended Release Candidate

Phase 1 hardening files are intended for the current release once final human review signs off on the dirty worktree. Pre-existing launch content can ship only if the product owner confirms it belongs in the same launch. Experimental or uncertain files should not ship without manual approval.

## Phase 1 Hardening

| Path or group | Intended for current release | Reason | Risk notes | Recommended action |
| --- | --- | --- | --- | --- |
| `package.json`, `package-lock.json` | Yes | Next.js security patch and reliable `typecheck` script. | `npm run typecheck` now runs `next typegen`; no broad dependency upgrade. | Commit with Phase 1 hardening. |
| `next.config.ts` | Yes | Security headers, powered-by removal, Next/Vercel image optimization. | CSP still accepts `script-src 'unsafe-inline'` for Next inline hydration scripts. | Commit with documented CSP tradeoff. |
| `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/seo.ts` | Yes | Crawl policy, sitemap, canonical metadata source. | Route inventory can drift as pages are added. | Commit; add route coverage tests in Phase 2. |
| `src/app/layout.tsx`, `public/theme-init.js` | Yes | Externalizes theme bootstrap from inline JSX for CSP maintainability. | Still unregisters all service workers and deletes all origin caches on load. | Commit with documented temporary cleanup behavior. |
| Active WebP replacements and references | Yes | Replaces heavy active PNG delivery files with WebP and re-enables image optimization. | Old PNG paths intentionally return 404; verify no external content links depend on them. | Commit with Phase 1 performance scope. |
| Deleted active PNG delivery files | Yes | Replaced by WebP equivalents. | Deletion is limited to files no longer referenced by app code. | Commit with matching WebP additions. |
| `RELEASE_CHECKLIST.md`, `PUBLIC_ASSET_AUDIT.md`, `PHASE1_COMPLETION_BASELINE.md`, `PHASE1_COMPLETION_RESULTS.md`, `RELEASE_SCOPE.md` | Yes | Makes release state and verification explicit. | Generated docs should be reviewed for operational accuracy. | Commit with Phase 1 docs. |

## Pre-Existing Launch Content

| Path or group | Intended for current release | Reason | Risk notes | Recommended action |
| --- | --- | --- | --- | --- |
| Modified public content routes under `src/app/*/page.tsx` not directly listed above | Manual decision | Present before this completion pass; likely launch content. | Could include copy/content changes outside Phase 1 hardening. | Review page-by-page before release approval. |
| `src/app/globals.css`, `src/app/home-hero.tsx`, `src/app/page.tsx`, `src/app/icon.svg` | Manual decision | Present before this completion pass; appears launch/design content. | Large stylesheet and visual changes can affect many routes. | Product/design review before release. |
| `src/app/ambassadors-data.ts`, `src/app/ambassador-profiles-data.ts`, ambassador routes | Manual decision | Present before this completion pass; content and profile data. | May expose intended names, links, or portrait choices. | Human content/privacy review. |
| Modified favicons and Apple icons | Manual decision | Present before this completion pass. | Browser/device cache behavior can obscure mistakes. | Visual check in production preview. |
| `public/museum/steel-ball-packshot.png` | Manual decision | Present before this completion pass and called out by review. | Product image is active and brand-sensitive. | Human visual approval. |

## Automation And Operational Work

| Path or group | Intended for current release | Reason | Risk notes | Recommended action |
| --- | --- | --- | --- | --- |
| `src/app/api/room-refresh/`, `src/app/api/cron/rerun-room/`, `src/app/api/room/`, `src/lib/room/`, `src/lib/notion/`, `src/lib/env.ts`, `tests/room.test.ts` | Manual decision | Present before this completion pass; Room automation may be launch-relevant but is operationally significant. | Touches Notion, OpenAI, deployment hooks, cron secrets, cost, and failure handling. | Require owner approval and env validation before release. |
| `vercel.json` cron removal | Yes | Disables incompatible five-minute scheduled invocation pending operational approval. | Manual endpoint calls still work with bearer secret. | Commit with Phase 1 hardening. |

## Uncertain Or Manual Review Assets

| Path or group | Intended for current release | Reason | Risk notes | Recommended action |
| --- | --- | --- | --- | --- |
| `public/ambassadors/portraits/*` variants not currently referenced | Manual decision | Many source/dated/live portrait variants were present before this pass. | Large footprint and privacy/likeness sensitivity. | Do not silently delete; decide canonical source/storage policy. |
| Modified tracked portrait PNGs | Manual decision | Present before this completion pass. | Large, mostly not app-referenced after live JPEG portrait strategy. | Human visual/privacy review. |
| Legacy or unreferenced public files: `public/tools/ai-y-fier/*`, `public/ai-y-fier-hero.png`, `public/DEARMARJAN.png`, `public/rob/raincoat.png`, starter SVGs, `public/src/app/artifacts/page.tsx`, `public/sw.js` | No until reviewed | Not directly referenced by current app code. | Publicly accessible and can be indexed if linked elsewhere. | Move out of public or delete in a separate approved cleanup. |
| `src/app/living-decision-review/layout.tsx` and related living decision review changes | Manual decision | Present before this completion pass. | Content/product surface may be unrelated to Phase 1 hardening. | Review with launch owner. |

## Recommended Commit Groups

1. Phase 1 dependency and quality gates: `package.json`, `package-lock.json`, generated `next-env.d.ts` if changed by Next, `tsconfig.json` if retained from prior Phase 1.
2. Phase 1 SEO/security: `next.config.ts`, `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/seo.ts`, `public/theme-init.js`.
3. Phase 1 image performance: WebP additions, replaced PNG deletions, route reference updates, image optimization config.
4. Phase 1 release docs: audit, checklist, baseline, review, completion baseline/results, release scope.
5. Manual launch content: all product copy, route, icon, portrait, Museum, and Room automation changes after human approval.
