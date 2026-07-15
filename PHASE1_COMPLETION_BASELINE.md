# ctrl+love Phase 1 Completion Baseline

Date: 2026-07-14  
Branch: `main` tracking `origin/main`  
Repository: `ctrlpluslove-site`

## Initial Worktree State For This Completion Pass

`git status --short --branch` was dirty before this completion pass began.

Staged files: none.

Unstaged tracked files included framework/config updates, many route/content files, public icons and portraits, `public/museum/steel-ball-packshot.png`, `tsconfig.json`, and `vercel.json`.

Untracked files included the Phase 1 audit/planning/review docs, route metadata files, Room automation API/lib/test files, `public/theme-init.js`, and many portrait asset variants.

Recent commits:

```text
ec573b0 Balance homepage case grid
1a2f711 Update anonymised homepage cases
6e7b8b2 Fix homepage perspective links and steel ball shadow
61df566 Clarify Decision Room homepage flow
f5bf879 Polish ctrl+love site content and navigation
```

No `AGENTS.md` file was present.

## Framework And Quality Gates

- Next.js: `16.2.10`
- Package manager: npm with `package-lock.json`
- Normal gates: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm audit --audit-level=moderate`
- `PHASE1_RESULTS.md`: not present at the start of this pass; this pass creates `PHASE1_COMPLETION_RESULTS.md`.

## Public Asset Footprint At Completion Start

- `public/` size: about 68 MB
- Image files: 87
- Type distribution: 46 PNG, 27 JPEG, 13 SVG, 1 ICO
- Largest active delivery PNGs included pricing documents, department/document pages, Museum products, AI-y-fier hero, Reality poster, Dear Rob/Marjan, and Unfinished Thoughts.

## Current Image Strategy

Completion target is a hybrid production strategy:

- Use Next/Vercel image optimization for `next/image` assets by removing global `images.unoptimized`.
- Use build-time WebP replacements for active large public PNGs, including plain `<img>` document-viewer assets.
- Keep ambiguous portrait/source/legacy variants in `public/` for manual review rather than deleting them silently.

## Current CSP Summary

Security headers are configured in `next.config.ts`. CSP allows `'unsafe-inline'` in `script-src` because the production App Router HTML includes inline Next hydration/RSC scripts such as `self.__next_f.push(...)` and the `beforeInteractive` bootstrap registration. The policy should not be described as strict until a nonce/hashing strategy is implemented.

## Current Cron Configuration

At the start of this pass, `vercel.json` scheduled `/api/room-refresh` every five minutes. The endpoint requires `Authorization: Bearer CRON_SECRET`. Vercel Cron invokes configured paths with GET requests and cron-specific headers, not this bearer token, so the configured cron would fail without an additional trust mechanism.

## Current Typecheck Behavior

The previous `npm run typecheck` depended on generated `.next/types`. Completion target is `next typegen && tsc --noEmit --incremental false`, which passes from a clean generated state without requiring a production build first.

## Current Audit Status

The sandboxed `npm audit --audit-level=moderate` cannot reach the npm registry. An approved network audit during this completion pass returned `found 0 vulnerabilities`.
