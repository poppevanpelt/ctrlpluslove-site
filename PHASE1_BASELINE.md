# ctrl+love Phase 1 Baseline

Date: 2026-07-14  
Branch: `main` tracking `origin/main`  
Repository: `ctrlpluslove-site`

## Initial Git State

`git status --short --branch` reported a dirty worktree before Phase 1 implementation started:

```text
## main...origin/main
 M package.json
 M public/ambassadors/portraits/002-nadia-al-mardini.png
 M public/ambassadors/portraits/003-shun-iwai.png
 M public/ambassadors/portraits/005-mats-utberg.png
 M public/ambassadors/portraits/007-jose-ricardo-monteiro-jr.png
 M public/ambassadors/portraits/009-umberto-bartolini.png
 M public/apple-icon.png
 M public/apple-touch-icon.png
 M public/favicon.ico
 M public/favicon.png
 M public/museum/steel-ball-packshot.png
 M src/app/ambassador-profiles-data.ts
 M src/app/ambassadors-data.ts
 M src/app/globals.css
 M src/app/home-hero.tsx
 M src/app/icon.svg
 M src/app/layout.tsx
 M src/app/page.tsx
 M tsconfig.json
 M vercel.json
?? IMPLEMENTATION_PLAN.md
?? PRODUCTION_AUDIT.md
?? public/ambassadors/portraits/001-poppe-van-pelt-20260712.jpeg
?? public/ambassadors/portraits/001-poppe-van-pelt-portrait-20260712.jpeg
?? public/ambassadors/portraits/001-poppe-van-pelt.jpeg
?? public/ambassadors/portraits/002-nadia-al-mardini-20260712.png
?? public/ambassadors/portraits/002-nadia-al-mardini-portrait-20260712.jpeg
?? public/ambassadors/portraits/003-shun-iwai-20260712.png
?? public/ambassadors/portraits/003-shun-iwai-portrait-20260712.jpeg
?? public/ambassadors/portraits/004-sung-wook-tayl-chung-20260712.png
?? public/ambassadors/portraits/004-sung-wook-tayl-chung-portrait-20260712.jpeg
?? public/ambassadors/portraits/004-sung-wook-tayl-chung.png
?? public/ambassadors/portraits/005-mats-utberg-20260712.png
?? public/ambassadors/portraits/005-mats-utberg-portrait-20260712.jpeg
?? public/ambassadors/portraits/006-jorge-virgos-20260712.jpeg
?? public/ambassadors/portraits/006-jorge-virgos-portrait-20260712.jpeg
?? public/ambassadors/portraits/006-jorge-virgos.jpeg
?? public/ambassadors/portraits/007-jose-ricardo-monteiro-jr-20260712.png
?? public/ambassadors/portraits/007-jose-ricardo-monteiro-jr-portrait-20260712-v2.jpeg
?? public/ambassadors/portraits/007-jose-ricardo-monteiro-jr-portrait-20260712.jpeg
?? public/ambassadors/portraits/008-christophe-pernaudet-20260712.png
?? public/ambassadors/portraits/008-christophe-pernaudet-portrait-20260712.jpeg
?? public/ambassadors/portraits/008-christophe-pernaudet-portrait-live-20260712.jpeg
?? public/ambassadors/portraits/008-christophe-pernaudet.png
?? public/ambassadors/portraits/008-christophe.png
?? public/ambassadors/portraits/009-umberto-bartolini-20260712.png
?? public/ambassadors/portraits/009-umberto-bartolini-portrait-20260712.jpeg
?? public/ambassadors/portraits/010-flip-portrait-20260712.jpeg
?? public/ambassadors/portraits/010-lysbeth-portrait-20260712.jpeg
?? public/ambassadors/portraits/010-lysbeth.png
?? src/app/api/cron/
?? src/app/api/room-refresh/
?? src/app/api/room/
?? src/lib/
?? tests/
```

No destructive Git operations were run. Existing modifications and untracked files are treated as pre-existing user work.

Recent commits:

```text
ec573b0 Balance homepage case grid
1a2f711 Update anonymised homepage cases
6e7b8b2 Fix homepage perspective links and steel ball shadow
61df566 Clarify Decision Room homepage flow
f5bf879 Polish ctrl+love site content and navigation
```

## Framework And Package Manager

- Framework: Next.js App Router
- Package manager: npm with `package-lock.json` lockfile version 3
- Install command: `npm install`
- Lint command: `npm run lint`
- Typecheck command: `npm run typecheck`
- Test command: `npm test`
- Build command: `npm run build`
- Security audit command: `npm audit --audit-level=moderate`

## Relevant Dependency Versions

Initial direct versions:

- `next`: `16.2.1`
- `react`: `19.2.4`
- `react-dom`: `19.2.4`
- `eslint-config-next`: `16.2.1`
- `@next/swc-wasm-nodejs`: `16.2.1`

`npm view` confirmed `next@16.2.10`, `eslint-config-next@16.2.10`, and `@next/swc-wasm-nodejs@16.2.10` are available. `next@16.2.10` keeps React peer support compatible with React 19.

## Environment Variable Documentation

README states that public pages require no environment variables. Server-side Re-run Room automation uses server-only variables:

- `NOTION_TOKEN`
- `NOTION_RUNS_DATA_SOURCE_ID`
- legacy fallback `NOTION_PROJECT_DATABASE_ID`
- `OPENAI_API_KEY`
- `CRON_SECRET`
- optional `ROOM_MODEL`
- optional `ROOM_MAX_RUNS_PER_CYCLE`
- optional `ROOM_MINIMUM_INTERVAL_MINUTES`
- optional `ROOM_STALE_REQUEST_HOURS`
- `NOTION_REDEPLOY_SECRET`
- `VERCEL_DEPLOY_HOOK_URL`

No secret values were inspected or recorded.

## Baseline Check Results

| Check | Result | Notes |
| --- | --- | --- |
| `npm run lint` | Pass | ESLint completed without reported issues. |
| `npm run typecheck` | Pass | TypeScript completed successfully. |
| `npm test` | Pass | 17 Node tests passed. Existing warning: package has no `"type": "module"` while tests use ESM syntax. |
| `npm run build` | Pass | Next.js 16.2.1 production build completed successfully; 33 app routes generated. |
| `npm audit --audit-level=moderate` | Fail | Network access was required. Audit reported 5 vulnerabilities: 1 high, 3 moderate, 1 low. Direct `next` fix target: `16.2.10`. |

## Existing Warnings And Findings

- The worktree was already dirty before this task.
- `public/` size was about 68 MB.
- `public/.DS_Store` exists even though `.DS_Store` is listed in `.gitignore`.
- `images.unoptimized: true` is set in `next.config.ts`.
- `robots.txt` and `sitemap.xml` were absent before Phase 1.
- `vercel.json` already had headers for the constitution download and a cron for `/api/room-refresh`.

## Execution Environment Limitations

- Network access is restricted by default; npm registry operations require explicit approval.
- Lighthouse is not installed and was not part of the baseline command set.
- Local checks were run on the current dirty worktree, so baseline results include pre-existing uncommitted user work.
