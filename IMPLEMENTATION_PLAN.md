# ctrl+love Implementation Plan

Created: 2026-07-14  
Source: `PRODUCTION_AUDIT.md`  
Scope: planning only. Do not implement from this document without an explicit implementation request.

## Planning Principles

This plan clusters the audit recommendations into three execution phases:

- **Phase 1 (Highest ROI):** remove launch blockers, reduce security/release risk, restore basic SEO discoverability, and handle the largest performance risks.
- **Phase 2 (Important):** improve conversion, accessibility, operational confidence, and regression protection.
- **Phase 3 (Nice to Have):** strengthen long-term maintainability, brand packaging, and growth polish.

The safest order is: stabilize the release state, patch known vulnerabilities, add crawl/security basics, optimize the heaviest assets, then improve user-facing flows. Larger refactors come later, after the launch surface is safer.

## Phase 1 (Highest ROI)

| Order | Task | Estimate | Dependencies | Risk-Minimizing Notes |
| ---: | --- | --- | --- | --- |
| 1 | Create a clean release branch/checkpoint and decide what existing dirty-worktree changes belong in launch scope. | 0.5 day | None | Do this first so every later change has a known base and accidental deploy drift is avoided. |
| 2 | Upgrade `next` and related Next packages to the patched semver-compatible version from `npm audit`, then rerun lint, typecheck, tests, build, and audit. | 0.5 day | Task 1 | Patch security before touching behavior. Keep this as a small isolated change. |
| 3 | Add `robots.txt` and `sitemap.xml` route support for all public pages and generated ambassador pages. | 0.5 day | Task 1 | Low-risk SEO win; verify locally that both routes return 200. |
| 4 | Add baseline production security headers and disable `X-Powered-By`. | 0.5-1 day | Task 2 | Start with conservative headers. Use a less strict CSP first if inline scripts still require it. |
| 5 | Review the root inline theme/service-worker script for CSP compatibility and decide whether to hash, nonce, or refactor it later. | 0.5 day | Task 4 | This prevents a security-header rollout from breaking theme behavior. |
| 6 | Remove obvious duplicate public assets, especially unused portrait variants and legacy public files. | 0.5-1 day | Task 1 | Do this before image conversion so only active assets get optimized. Verify no referenced filenames break. |
| 7 | Optimize the heaviest active images and establish a WebP/AVIF or Vercel image optimization strategy. | 1.5-2.5 days | Task 6 | Start with hero, pricing, museum, and ambassador portraits. Keep visual diffs tight. |
| 8 | Revisit `images.unoptimized: true` and either re-enable framework image optimization or document a build-time image pipeline. | 0.5-1 day | Task 7 | Avoid changing image delivery twice; choose the strategy after asset cleanup. |
| 9 | Add route-specific metadata, descriptions, and canonical URLs for key public pages. | 0.5-1 day | Task 3 | Do after sitemap route inventory so metadata and route coverage match. |
| 10 | Add a short release checklist covering clean status, env vars, lint, typecheck, tests, build, audit, sitemap/robots, and Vercel cron plan support. | 0.5 day | Tasks 1-4 | Turns the first hardening pass into a repeatable launch process. |

**Phase 1 target duration:** 5-8 working days.

**Phase 1 exit criteria:**

- `npm audit` no longer reports the high-severity direct Next.js advisory.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass.
- `/robots.txt` and `/sitemap.xml` return 200.
- Baseline security headers are present in production-like responses.
- Public asset footprint is reduced and active large images have an optimization path.
- Release state is clean enough to identify exactly what will ship.

## Phase 2 (Important)

| Order | Task | Estimate | Dependencies | Risk-Minimizing Notes |
| ---: | --- | --- | --- | --- |
| 1 | Build a reliable primary inquiry path with structured form fields, success/failure states, and mailto fallback. | 1.5-3 days | Phase 1 release checkpoint | Conversion changes should happen after release safety basics are done. |
| 2 | Clarify homepage first-screen copy: who it is for, what decision they bring, and what they receive. | 0.5 day | Phase 1 metadata work | Keep this small and measurable; avoid broad homepage redesign. |
| 3 | Move proof, confidentiality, outcomes, and offer cues closer to the first CTA. | 0.5-1 day | Task 2 | Supports conversion without changing the whole information architecture. |
| 4 | Add a simple offer chooser or stronger routing between Stress-Test, On-Call Room, Kill or Scale, and general Room. | 1 day | Tasks 1-3 | Reduces choice friction after the inquiry path is reliable. |
| 5 | Implement a shared accessible dialog/drawer primitive and migrate Stress Entry and Museum overlays. | 1.5-2.5 days | Phase 1 headers/CSP decisions | Centralize focus trap, initial focus, restoration, Escape handling, and inert background behavior. |
| 6 | Complete a reduced-motion pass for tickers, glitch effects, transitions, and page-specific animations. | 1-1.5 days | Task 5 | Do after modal work so motion/focus behavior can be checked together. |
| 7 | Add explicit error, empty, loading, copy-failure, and recovery states for interactive tools. | 1-2 days | Tasks 1 and 5 | Prioritize inquiry form, museum requests, AI-y-fier copy actions, and room API interactions. |
| 8 | Add API input validation, request-size bounds, generic client errors, and Notion page ID validation. | 1 day | Phase 1 security patch | Lowers operational risk before adding rate limits or observability. |
| 9 | Add rate limiting or abuse controls to `/api/room-refresh`, `/api/room/rerun`, and `/api/redeploy`. | 1-2 days | Task 8 | Validate first, throttle second. Avoid masking malformed-request problems. |
| 10 | Add operational logging, alerts, and runbook notes for cron runs, Notion failures, OpenAI failures, redeploy triggers, and costs. | 1.5-3 days | Tasks 8-9 | Observability becomes more useful after endpoints are bounded. |
| 11 | Add browser smoke tests for homepage CTA, pricing, stress-test modal, museum drawer/request flow, metadata routes, and API auth failures. | 1.5-3 days | Tasks 1, 5, 8 | Test the stabilized flows, not the pre-refactor versions. |
| 12 | Add automated accessibility checks with axe or equivalent browser tooling. | 1-2 days | Task 11 | Layer accessibility checks into the same browser-test setup. |
| 13 | Add structured data for Organization, WebSite, Person, Offer/Product, and profile pages. | 1 day | Phase 1 metadata work | Do after metadata/canonicals are stable so schemas match final route intent. |
| 14 | Add custom social share metadata/OG images for Steel Ball, Museum, Stress Test, AI-y-fier, Room, and ambassador profiles. | 1.5-2.5 days | Task 13 and image strategy | Share assets should use the optimized image pipeline from Phase 1. |
| 15 | Run a measured performance pass with Lighthouse CI, Vercel Speed Insights thresholds, or another approved tool. | 1 day | Phase 1 asset work and Task 11 | Measure after the major image and test setup work, otherwise scores will be noisy. |

**Phase 2 target duration:** 14-25 working days.

**Phase 2 exit criteria:**

- Primary conversion no longer depends only on `mailto:`.
- Stress Entry and Museum overlays meet baseline keyboard and screen-reader expectations.
- API endpoints validate inputs, bound payloads, avoid detailed client errors, and have abuse controls.
- Core user journeys have browser smoke tests.
- Accessibility checks are automated for the most important pages.
- Structured data and share metadata are in place for core commercial and brand routes.
- Performance is measured with repeatable tooling or deployment thresholds.

## Phase 3 (Nice to Have)

| Order | Task | Estimate | Dependencies | Risk-Minimizing Notes |
| ---: | --- | --- | --- | --- |
| 1 | Split `src/app/globals.css` into global tokens/base styles plus route or component-scoped CSS modules. | 4-7 days | Phase 1 and Phase 2 visual stabilization | Do this in small route-by-route slices with screenshots or visual checks after each slice. |
| 2 | Create shared component primitives for section headers, CTA groups, proof cards, offer cards, modal shells, and repeated link patterns. | 3-5 days | Task 1 | Extract only stable patterns; avoid redesigning while refactoring. |
| 3 | Add design-token documentation for typography, spacing, colors, focus states, motion, cards, and buttons. | 1-2 days | Tasks 1-2 | Keeps future pages from re-growing global CSS. |
| 4 | Add a mid-intent capture mechanism such as newsletter, Room notes, or artifact updates. | 1-2 days | Phase 2 inquiry path | Secondary capture should not compete with the main inquiry flow. |
| 5 | Create an ambassador onboarding or nomination path. | 1-2 days | Phase 2 conversion and metadata work | Treat this as controlled intake, not an open-ended public form without review. |
| 6 | Add richer anonymized case studies with quantified outcomes where confidentiality allows. | 2-4 days | Phase 2 proof placement | This is content-heavy; collect evidence before design work. |
| 7 | Refine museum/artifact commercial role and align CTAs accordingly. | 1.5-3 days | Phase 2 inquiry path and analytics | Decide whether the museum is commerce, lead capture, brand theater, or a blend. |
| 8 | Add stronger internal linking and content clusters around decision-making, room offers, ambassadors, and artifacts. | 1-2 days | Phase 1 sitemap and Phase 2 metadata | Improve discovery without creating thin pages. |
| 9 | Improve custom 404/not-found experience and crawl behavior for obsolete public assets. | 0.5-1 day | Phase 1 SEO routes | Nice polish once the main crawl surface is correct. |
| 10 | Formalize long-term CI gates for lint, typecheck, tests, build, audit, performance budgets, and accessibility checks. | 1-2 days | Phase 2 test/performance tooling | Convert manual checks into release protection once tooling is stable. |

**Phase 3 target duration:** 17-31 working days.

**Phase 3 exit criteria:**

- Styling is easier to maintain without changing the visual character.
- Shared primitives reduce repeated implementation patterns.
- Brand moments are more shareable, measurable, and connected to conversion.
- Longer-term quality gates are part of the normal release process.

## Key Dependencies

| Dependency | Blocks | Notes |
| --- | --- | --- |
| Clean release state | Dependency patching, asset cleanup, all later launch work | Without this, it is hard to know what ships. |
| Next.js security upgrade | Security headers, tests, performance measurement | Upgrade first so later debugging is not mixed with framework changes. |
| SEO route inventory | Sitemap, metadata, canonicals, structured data | Build one source of truth for public routes. |
| Image strategy | Asset optimization, OG images, performance measurement | Choose Vercel optimization or build-time processing before generating share assets. |
| CSP/inline script decision | Security headers, dialog/tool scripts, analytics behavior | Strict CSP may require hashes, nonces, or script refactoring. |
| Inquiry path decision | Homepage CTA, pricing CTAs, museum/artifact CTAs, secondary capture | Conversion copy and CTAs should point to the same reliable destination. |
| Accessible dialog primitive | Stress Entry, Museum drawer/modal, future overlays | One primitive reduces duplicated accessibility fixes. |
| Browser test tooling | Smoke tests, axe checks, Lighthouse CI | Pick tooling once and reuse it for quality, accessibility, and performance. |
| API validation | Rate limiting, observability, runbooks | Bounded inputs make logs and alerts cleaner. |
| Analytics/monitoring decision | Conversion tracking, Speed Insights thresholds, operational alerts | Measurement needs agreed tools and owners. |

## Recommended Low-Risk Execution Order

1. Freeze the launch scope and create a clean checkpoint.
2. Patch the direct Next.js security advisory.
3. Rerun lint, typecheck, tests, build, and audit.
4. Add robots and sitemap routes.
5. Add baseline security headers and disable powered-by disclosure.
6. Decide the CSP approach for the inline root script.
7. Remove unused/duplicate public assets.
8. Optimize active large images and settle the image delivery strategy.
9. Complete route metadata and canonical URLs.
10. Add the release checklist.
11. Build the reliable inquiry path.
12. Tighten homepage/offer/proof routing around that inquiry path.
13. Implement the accessible dialog primitive and migrate overlays.
14. Add reduced-motion and interactive failure states.
15. Harden API validation, rate limiting, and operational logging.
16. Add browser smoke tests and automated accessibility checks.
17. Add structured data and share metadata/OG assets.
18. Run measured performance checks and set budgets.
19. Refactor global CSS and shared components in small slices.
20. Add growth/brand refinements such as mid-intent capture, ambassador intake, richer case studies, and museum CTA alignment.

## Risk Notes

- Do not combine the Next.js upgrade with broad UI changes. Patch, verify, then move on.
- Do not optimize or delete images before confirming which filenames are actively referenced.
- Do not tighten CSP all at once if inline scripts, analytics, or Vercel tooling still need accommodation.
- Do not introduce a new form/backend flow without spam protection, error states, and privacy expectations.
- Do not split the global stylesheet until launch blockers and core UX flows are stable.
- Do not add Lighthouse CI by fetching and executing registry tooling in an unsafe context; install tooling through the normal dependency-review path.

## Suggested Milestones

| Milestone | Target | Included Work |
| --- | --- | --- |
| Launch Safety | End of Phase 1 | Security patch, SEO basics, headers, clean release state, first asset optimization. |
| Conversion And Access | Mid Phase 2 | Reliable inquiry path, clearer homepage/proof flow, accessible dialogs. |
| Operational Confidence | End Phase 2 | API hardening, logging, smoke tests, accessibility checks, performance measurement. |
| Maintainable Growth | End Phase 3 | CSS/component refactor, brand/share packaging, secondary capture, stronger content system. |

## Estimated Total Effort

- **Phase 1:** 5-8 working days.
- **Phase 2:** 14-25 working days.
- **Phase 3:** 17-31 working days.

Total estimated effort is **36-64 working days**, depending on how much image processing, form backend work, observability setup, and CSS refactoring is handled manually versus with existing tooling.
