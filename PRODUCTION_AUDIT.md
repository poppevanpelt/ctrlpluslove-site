# ctrl+love Production Readiness Audit

Audit date: 2026-07-14  
Repository: `ctrlpluslove-site`  
Audit posture: public launch readiness across product, UX, design, engineering, performance, accessibility, SEO, security, scalability, and brand.  
Scope note: no implementation changes were made. This report is the only repository file intentionally changed.

## Executive Summary

ctrl+love is a distinctive public Next.js/Vercel site with a memorable proposition, a strong editorial brand system, static marketing/product pages, a museum/artifact experience, ambassador pages, pricing pages, and server-side automation for the Re-run Room workflow. The core application is in good shape for a soft launch: lint, typecheck, tests, and production build all pass.

It is not yet ready for a fully hardened production launch. The primary launch risks are security dependency exposure, missing SEO infrastructure, heavy image delivery, incomplete security headers, a very large global stylesheet, modal/focus accessibility gaps, and operational risk from a dirty worktree plus newly added automation endpoints. These are fixable, but several should be handled before public launch traffic scales.

The brand is the strongest part of the product. The system has a clear memory hook: "Shortcut to reality", Decision Room, Steel Ball, museum artifacts, and named offers. The main production work is less about inventing more and more about making the sharpest path easier to understand, faster to load, safer to operate, and easier to convert.

## Overall Score (/100)

**71 / 100**

This is credible for a controlled beta or soft launch. It is below the bar for a broad production launch because the repo currently has a high-severity dependency advisory, no sitemap/robots routes, unoptimized media, partial security headers, and accessibility/performance work still to complete.

## Validation Snapshot

| Check | Result | Notes |
| --- | --- | --- |
| Framework | Next.js 16.2.1, React 19.2.4, App Router | Static public pages plus dynamic API routes. |
| Deployment | Vercel | `vercel.json` defines a 5-minute cron for `/api/room-refresh`. |
| `npm run lint` | Pass | ESLint completed without reported issues. |
| `npm run typecheck` | Pass | TypeScript completed successfully. |
| `npm test` | Pass | 17 Node tests passed. Node emitted a module-type warning because `package.json` has no `"type": "module"`. |
| `npm run build` | Pass | 33 app routes generated; API routes built as dynamic server routes. |
| `npm audit --audit-level=moderate --json` | Fail: advisories found | 5 vulnerabilities: 1 high, 3 moderate, 1 low. Direct `next` fix available at `16.2.10`. |
| Local production server | Partial | Started on port 3001 with elevated permission; homepage returned 200. |
| Runtime headers | Partial | Local production response lacks CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, and still exposes `X-Powered-By`. |
| `robots.txt` | Missing | Local `/robots.txt` returned 404. |
| `sitemap.xml` | Missing | Local `/sitemap.xml` returned 404. |
| Lighthouse | Not completed | Lighthouse is not installed. Network-installed Lighthouse was blocked for safety because it would fetch and execute third-party registry code. |
| Static footprint | Risk | `public/` is about 68 MB; ambassador portraits are about 35 MB; no WebP/AVIF files found. |
| CSS footprint | Risk | `src/app/globals.css` is 9,354 lines; compiled global CSS is about 149 KB. |
| Worktree | Risk | Many modified/untracked files were present before this audit, including assets, API routes, lib code, config, and the audit file. |

## Architecture And Deployment

The repository is a Next.js App Router application. Public routes live under `src/app`, shared room automation logic lives under `src/lib`, and tests live under `tests`. The public pages are mostly static, while `/api/room-refresh`, `/api/cron/rerun-room`, `/api/room/rerun`, and `/api/redeploy` run as dynamic Node.js API routes.

Vercel is the intended host. `vercel.json` schedules `/api/room-refresh` every five minutes and adds a content-disposition header for one downloadable zip. `next.config.ts` uses `trailingSlash: true`, `skipTrailingSlashRedirect: true`, and `images.unoptimized: true`.

## Product

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Primary proposition is memorable but still abstract for first-time visitors. | Medium | Some visitors may admire the language before understanding the service. | S | Add one concrete above-the-fold sentence explaining who brings what decision and what they get back. | Clear comprehension improves conversion without weakening the brand voice. |
| Conversion depends heavily on `mailto:` links and exploratory pages. | High | High-intent visitors may fail to convert if mail clients fail or the next step feels unclear. | M | Add a resilient primary inquiry path with a structured form, fallback email, and success state. | Production launch needs reliable demand capture, not only charming contact links. |
| The product suite is strong but spread across many routes. | Medium | Users may not know whether to choose Stress-Test, On-Call Room, Kill or Scale, or a general Room. | S | Add a simple offer chooser or stronger routing copy from the homepage and pricing page. | Reducing choice friction increases qualified leads. |
| Proof is present but mostly anonymized and qualitative. | Medium | Enterprise buyers may need more confidence before outreach. | M | Add safe quantified outcomes, decision timelines, or before/after examples where confidentiality allows. | Evidence turns an intriguing brand into a credible buying decision. |
| Museum/artifact experiences are memorable but commercially ambiguous. | Low | Visitors may treat artifacts as a side quest rather than brand proof or conversion path. | M | Decide whether museum flows are lead capture, commerce, brand theater, or all three, then align CTAs. | Signature weirdness is valuable when it helps the user understand and remember the offer. |

## UX

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| The homepage has many strong sections competing for attention. | Medium | Users can drift instead of progressing toward a decision-room action. | M | Tighten the homepage hierarchy around one primary path and one exploration path. | Richness works best when the next move is always obvious. |
| Modal/drawer flows lack full production-grade focus management. | High | Keyboard and screen-reader users can lose context in Stress Entry and Museum dialogs. | M | Add focus trap, initial focus, focus restoration, inert background behavior, and consistent Escape handling. | Dialogs must behave predictably for accessibility and trust. |
| Purchase/request flows use mailto-generated requests. | Medium | Flow can break on shared devices, locked-down browsers, or users without a configured mail client. | M | Replace or supplement mailto with a server-backed request endpoint or trusted form provider. | A production funnel should not depend on the user's local email configuration. |
| Interactive tools have limited error and fallback states. | Medium | Failures can feel accidental rather than designed. | M | Add explicit loading, empty, copy-failure, submission-failure, and recovery states. | Production polish is often felt most when something does not work perfectly. |
| Navigation depth is broad for a young product. | Low | Users may not discover the most valuable pages in the intended order. | S | Use clearer cross-links between homepage, pricing, stress test, room, ambassadors, and proof pages. | Internal wayfinding improves both user confidence and SEO. |

## Design

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Visual identity is strong and distinctive. | Low | Positive: this is a launch advantage. | S | Preserve the editorial, object-led system while hardening consistency. | Brand memory is one of the product's strongest assets. |
| Global styles are carrying too many route-specific decisions. | High | Design changes are harder to isolate and regression risk is high. | L | Extract route-specific CSS modules and shared primitives for CTAs, sections, cards, drawers, and modals. | A strong design system needs maintainable implementation. |
| Some repeated visual patterns are not componentized. | Medium | Future pages may drift visually and behaviorally. | M | Create small shared components for section headers, offer cards, proof cards, modal shell, and CTA groups. | Reuse protects quality as content expands. |
| Motion is part of the brand but needs a complete motion policy. | Medium | Motion-sensitive users may have a worse experience. | M | Audit all animation/ticker/glitch effects and centralize `prefers-reduced-motion` behavior. | Expressive motion should not reduce comfort or accessibility. |
| Large raster imagery is visually useful but technically expensive. | High | Image quality comes with unnecessary load cost today. | M | Keep the visual direction but convert, resize, and serve responsive modern formats. | The design can stay lush while the delivery gets much leaner. |

## Engineering

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Lint, typecheck, tests, and build pass. | Low | Positive: base technical health is solid. | S | Keep these checks required before deploy. | A passing baseline makes hardening safer. |
| Test coverage focuses on the room engine, not public UX or API route behavior. | Medium | Regressions in conversion, modals, metadata, and endpoint auth could ship unnoticed. | M | Add API route tests, metadata/SEO smoke tests, and a small browser test suite for core journeys. | Launch-critical behavior needs automated protection. |
| Worktree is dirty with many modified and untracked files. | High | Deployments can accidentally include unrelated or unfinished changes. | S | Cleanly branch, commit, or archive current changes before launch and require a clean deploy checklist. | Production confidence depends on knowing exactly what is shipping. |
| `package.json` lacks `"type": "module"` while tests use ESM syntax. | Low | Test runs emit a Node reparsing warning. | S | Add module type only after confirming Next/tooling compatibility, or adjust test module format. | Removing warnings makes CI output more actionable. |
| `next.config.ts` disables image optimization globally. | High | Next image benefits are unavailable even if components use Next image patterns. | M | Re-enable Vercel image optimization or introduce a build-time image pipeline. | The current setup leaves a major performance tool unused. |
| Inline root script complicates CSP and caching strategy. | Medium | A strict CSP will need hashes/nonces or refactoring. | M | Move theme/service-worker cleanup logic into a safer, minimal strategy compatible with CSP. | Security hardening is easier when inline scripts are minimized. |

## Performance

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| `public/` is about 68 MB. | High | Slower deploys, larger cache footprint, and poor mobile loading if large assets are referenced. | M | Remove unused files and convert active imagery to responsive WebP/AVIF variants. | Media weight is the biggest visible performance risk. |
| Ambassador portraits total about 35 MB across 47 files. | High | Profile/grid routes can become slow and expensive on mobile. | M | Keep one canonical source per portrait, generate responsive sizes, and remove duplicate dated variants from public delivery. | Portrait duplication creates avoidable load and maintenance cost. |
| No WebP or AVIF files were found. | High | Users receive heavier PNG/JPEG assets than needed. | M | Add an image build step or use Vercel image optimization. | Modern formats usually provide large savings with no design loss. |
| Compiled global CSS is about 149 KB. | Medium | Routes likely load styles they do not need. | L | Split `globals.css` into global tokens plus route/component-scoped styles. | Smaller CSS improves first render and maintainability. |
| Lighthouse was not completed. | Medium | No measured Core Web Vitals proxy exists in this audit. | S | Add Lighthouse CI or use Vercel Speed Insights thresholds after deployment. | Static analysis points to risks, but production needs measured budgets. |
| Homepage HTML response was about 83 KB locally. | Low | Acceptable, but should be watched as content expands. | S | Keep homepage payload under an agreed budget. | Payload budgets prevent slow creep. |

## Accessibility

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Semantic structure and focus styles are present in many areas. | Low | Positive: the app has a decent accessibility base. | S | Preserve skip link, landmarks, labels, and visible focus behavior. | Existing accessibility investments should remain protected. |
| Dialogs/drawers do not fully manage focus. | High | Keyboard users can tab behind overlays or lose their previous location. | M | Use a shared accessible dialog component. | Focus management is a common launch blocker for interactive pages. |
| Motion reduction appears partial rather than systematic. | Medium | Motion-sensitive users may still encounter ticker/glitch/transition effects. | M | Create a complete reduced-motion audit and automated visual checklist. | Reduced motion is an accessibility requirement, not a preference nicety. |
| Icon-only/symbol-heavy controls need ongoing label review. | Medium | Some symbols may be unclear or inconsistently announced. | S | Audit accessible names for museum, artifacts, carousel controls, and theme controls. | Expressive UI still needs clear assistive technology output. |
| No automated accessibility test tooling is configured. | Medium | Accessibility regressions can ship silently. | M | Add axe checks through Playwright or an equivalent browser test runner. | Automated checks catch common issues before manual review. |

## SEO

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| `/robots.txt` returns 404. | High | Search engines lack explicit crawl policy and sitemap location. | S | Add `src/app/robots.ts` or a static `public/robots.txt`. | Production sites should make crawl intent explicit. |
| `/sitemap.xml` returns 404. | High | Search engines lack a canonical inventory of public pages. | S | Add `src/app/sitemap.ts` covering all public routes and generated ambassador pages. | The site has many valuable pages that need discoverability. |
| Route metadata exists but is uneven. | Medium | Search snippets and social previews vary by page. | S | Ensure every public route has a title, description, canonical URL, OG image, and Twitter metadata. | Each route should be shareable and legible out of context. |
| Root canonical is configured globally as `/`. | Medium | Child pages may inherit or miss route-specific canonicals depending on metadata overrides. | S | Add route-specific canonical metadata for every major page. | Canonicals prevent duplicate or ambiguous indexing. |
| No structured data was found. | Medium | Search engines have less context for organization, offers, people, and products. | S | Add JSON-LD for Organization, WebSite, Person, Offer/Product, and profile pages. | Structured data improves machine understanding of the brand graph. |
| Public duplicate/legacy files exist under `public/`. | Low | Old or duplicate assets/pages can be indexed accidentally if linked. | S | Audit public files and add noindex/robots rules or remove obsolete assets. | Public folders are web-accessible and should be intentional. |

## Security

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| `npm audit` reports a high-severity direct Next.js advisory. | High | Known framework vulnerabilities can affect availability, auth bypass surfaces, cache behavior, or SSR/RSC behavior. | S | Upgrade `next` and matching Next packages to the patched semver-compatible version reported by audit, then rerun all checks. | Shipping with known high advisories is a launch blocker. |
| Security headers are incomplete. | High | Browser-level protections are weaker than expected for a production site. | S | Add CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame protections, and remove/disable `X-Powered-By`. | Headers reduce exposure to script, embedding, sniffing, and referrer leakage risks. |
| API endpoints are secret-gated but lack rate limiting. | Medium | Secrets reduce access, but brute force, accidental loops, or leaked tokens can still cause cost or disruption. | M | Add rate limits, request logging, and alerting for `/api/room-refresh`, `/api/room/rerun`, and `/api/redeploy`. | Automation endpoints touch external systems and can trigger cost/deploy actions. |
| `/api/room/rerun` accepts arbitrary string `pageId`. | Medium | Invalid or unexpected IDs can create noisy failures or external API calls. | S | Validate Notion page ID shape and reject oversized bodies. | Input bounds reduce abuse and operational noise. |
| Error messages may expose internal details. | Medium | Failed API responses can reveal missing env vars or backend behavior. | S | Return generic client errors and keep detailed errors in server logs. | Production APIs should not teach attackers how the system is wired. |
| Inline script blocks strict CSP adoption. | Medium | CSP may need unsafe-inline or hashes until refactored. | M | Refactor or hash inline scripts as part of CSP rollout. | CSP is much stronger when inline execution is tightly controlled. |

## Scalability

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Static pages scale well on Vercel. | Low | Positive: the public marketing surface is cache-friendly. | S | Keep high-traffic content static where possible. | Static delivery is reliable and inexpensive. |
| Cron runs every five minutes and README notes plan constraints. | Medium | Vercel plan mismatch could break automation at deploy time. | S | Confirm production plan supports the schedule or adjust schedule before launch. | Automation reliability should not depend on a surprise billing-plan detail. |
| Room engine has guardrails but needs production observability. | Medium | Silent Notion/OpenAI failures could erode trust. | M | Add structured logs, dashboards, alerts, and a manual recovery runbook. | External-system workflows need operational visibility. |
| OpenAI/Notion calls need cost and timeout budgets. | Medium | Launch traffic or bad loops can increase cost or latency. | M | Define per-run timeouts, retries, max pages, token budgets, and cost alerts. | Controlled automation protects both spend and reliability. |
| Redeploy endpoint can trigger production builds. | Medium | Accidental repeated calls could create deployment churn. | M | Add idempotency, cooldown, actor/source logging, and alerting. | Build triggers are operationally powerful and should be guarded. |

## Brand

| Finding | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Brand distinctiveness is excellent. | Low | Positive: name, language, and artifacts are ownable. | S | Preserve the editorial courage while tightening usability. | The brand already has memorability many launch sites lack. |
| "Shortcut to reality" is strong but should be operationalized. | Medium | Visitors need to understand what the shortcut produces. | S | Pair the line with a concrete proof sentence and primary action. | A great line becomes more commercial when users know what to do with it. |
| Ambassador network is a valuable trust asset. | Medium | It can feel like decoration unless connected to the offer. | M | Explain when and how human perspectives enter a room. | The network is a differentiator if buyers understand its role. |
| Signature pages need better share packaging. | Medium | Strong brand objects may not travel well on social/search. | M | Add custom OG images and concise metadata for Steel Ball, Museum, Stress Test, AI-y-fier, and Room. | Shareability turns brand moments into acquisition surfaces. |
| Tone is memorable but can outrun clarity in some flows. | Low | Some enterprise users may need reassurance earlier. | S | Keep the voice, but add proof, confidentiality, process, and next-step clarity near CTAs. | Trust lets the playful parts land as confidence, not obscurity. |

## Top 20 Improvements

| Rank | Improvement | Severity | Impact | Effort | Recommendation | Why it matters |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Upgrade vulnerable Next.js dependency. | High | Security | S | Move `next` and related Next packages to patched semver-compatible versions and rerun lint/typecheck/test/build/audit. | Known high advisories should not ship to production. |
| 2 | Add `robots.txt` and `sitemap.xml`. | High | SEO | S | Implement App Router metadata files covering all public routes. | Search discovery is currently missing core infrastructure. |
| 3 | Add security headers. | High | Security | S | Configure CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, frame policy, and powered-by removal. | Browser hardening is expected for production. |
| 4 | Optimize public images. | High | Performance | M | Convert and resize active assets to responsive WebP/AVIF; remove duplicates. | Media is the largest performance burden. |
| 5 | Revisit `images.unoptimized: true`. | High | Performance | M | Use Vercel image optimization or a build-time image pipeline. | The framework's image delivery advantage is disabled. |
| 6 | Clean and stabilize the worktree. | High | Release | S | Commit/branch/archive current changes and require clean deploys. | You need confidence in exactly what is shipping. |
| 7 | Build a reliable lead capture path. | High | Business | M | Add a structured inquiry form with success/failure states and email fallback. | Mailto-only conversion is fragile. |
| 8 | Harden modal accessibility. | High | Accessibility | M | Use a shared accessible dialog/drawer primitive. | Dialog flows are user-facing and currently incomplete. |
| 9 | Add route-specific metadata and canonicals. | Medium | SEO | S | Audit every public route's metadata. | Each page should sell and share itself. |
| 10 | Add structured data. | Medium | SEO | S | Add Organization, WebSite, Person, Offer/Product, and profile JSON-LD. | The site has rich entities that search engines should understand. |
| 11 | Split the global stylesheet. | High | Maintainability | L | Move route styles into modules and keep only tokens/base styles global. | 9,354 global CSS lines are a regression risk. |
| 12 | Add browser smoke tests. | Medium | Quality | M | Cover homepage CTA, pricing, stress-test modal, museum modal/cart, and API auth. | Current tests do not cover public UX. |
| 13 | Add automated accessibility checks. | Medium | Accessibility | M | Add axe-based tests through a browser runner. | Accessibility should not rely only on manual review. |
| 14 | Add rate limiting and payload validation to APIs. | Medium | Security | M | Validate page IDs, cap body size, throttle secrets, and log abuse. | Secret-gated endpoints still need abuse controls. |
| 15 | Add operational dashboards and alerts. | Medium | Scalability | M | Track cron success, Notion failures, OpenAI failures, redeploy triggers, and costs. | Automation needs production visibility. |
| 16 | Improve first-screen comprehension. | Medium | Product | S | Add one plain-language service explanation near the hero CTA. | Curiosity converts better when paired with clarity. |
| 17 | Move proof nearer to the first CTA. | Medium | Business | S | Surface credibility, outcomes, confidentiality, and network proof earlier. | Buyers need trust before inquiry. |
| 18 | Add Lighthouse CI or performance budgets. | Medium | Performance | M | Measure homepage and key routes in CI or deployment preview. | Performance should become a tracked number. |
| 19 | Create a complete reduced-motion policy. | Medium | Accessibility | M | Audit all motion and centralize reduced-motion behavior. | Motion should support the brand without excluding users. |
| 20 | Package signature pages for sharing. | Medium | Brand | M | Add OG images, concise metadata, and clear CTAs for the most memorable concepts. | The strongest brand objects should travel. |

## Quick Wins (<1 day)

| Quick win | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Upgrade Next.js to patched version and rerun audit. | High | Security | S | Apply the semver-compatible fix from `npm audit`. | Removes the clearest launch blocker. |
| Add `robots.ts` and `sitemap.ts`. | High | SEO | S | Include all static routes and generated ambassador slugs. | Immediate discoverability gain. |
| Add basic security headers. | High | Security | S | Start with conservative headers, then tighten CSP after inline-script work. | Fast risk reduction. |
| Disable `X-Powered-By`. | Medium | Security | S | Set `poweredByHeader: false` in Next config. | Small but standard production hardening. |
| Add route-specific descriptions to missing/weak pages. | Medium | SEO | S | Review all public route metadata. | Better search and social previews. |
| Add a plain-language hero support line. | Medium | Product | S | Make who/what/outcome immediately scannable. | Improves first-time comprehension. |
| Remove obvious duplicate public portrait files. | Medium | Performance | S | Keep canonical active images only. | Quick reduction in public footprint. |
| Document a release checklist. | Medium | Release | S | Include clean status, checks, build, audit, and Vercel env validation. | Prevents accidental launch mistakes. |
| Add API request body size checks. | Medium | Security | S | Reject oversized or malformed requests before external calls. | Cheap abuse reduction. |
| Add custom 404 metadata and crawl policy. | Low | SEO/UX | S | Ensure not-found pages are clear and not accidentally indexed. | Better polish on edge cases. |

## Launch Blockers

| Blocker | Severity | Impact | Effort | Recommendation | Why it matters |
| --- | --- | --- | --- | --- | --- |
| High-severity `next` dependency advisories. | High | Security | S | Upgrade to patched Next.js version and rerun checks. | Known high vulnerabilities are not acceptable for broad launch. |
| Missing sitemap and robots routes. | High | SEO | S | Add crawl infrastructure before public push. | Launch without this weakens discoverability from day one. |
| Incomplete production security headers. | High | Security | S/M | Add baseline headers now; tighten CSP after inline script strategy. | Public sites need browser-level protections. |
| Unoptimized multi-megabyte imagery. | High | Performance | M | Optimize active images and remove duplicates before broad launch. | Mobile users and Core Web Vitals will suffer otherwise. |
| Dirty worktree with many unrelated changes. | High | Release | S | Clean release state before production deploy. | You cannot safely launch what you cannot precisely identify. |

## 30-Day Roadmap

| Timeframe | Focus | Actions | Expected Outcome |
| --- | --- | --- | --- |
| Days 1-3 | Launch blockers | Upgrade Next.js, rerun audit, add robots/sitemap, add baseline headers, clean worktree. | Security/SEO/release risks reduced quickly. |
| Days 4-7 | Performance foundation | Remove duplicate public assets, convert core images, decide image optimization strategy, add performance budgets. | Faster pages and a measurable performance target. |
| Days 8-12 | Conversion clarity | Add structured lead capture, sharpen homepage explanation, connect pricing/offers/proof to CTAs. | More reliable inquiry flow and clearer buyer journey. |
| Days 13-17 | Accessibility hardening | Implement shared dialog/drawer primitive, complete reduced-motion pass, add automated a11y checks. | Interactive flows become production-safe for keyboard and assistive tech users. |
| Days 18-22 | SEO/share packaging | Complete metadata, canonicals, structured data, OG images, signature page previews. | Better search visibility and more shareable brand moments. |
| Days 23-26 | Automation operations | Add API validation/rate limits, alerting, runbooks, cost/time budgets, redeploy cooldown/idempotency. | Room engine becomes safer to operate in production. |
| Days 27-30 | Regression protection | Add browser smoke tests, release checklist, CI gates, and final Lighthouse/manual QA pass. | Launch process becomes repeatable and defensible. |

## Prioritized Action Plan Ranked By ROI

| ROI Rank | Action | Severity | Impact | Effort | Recommendation | Why it matters |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Upgrade Next.js and rerun `npm audit`. | High | Security | S | Patch the direct framework advisory first. | Highest risk reduction for the smallest effort. |
| 2 | Add robots/sitemap. | High | SEO | S | Ship crawl infrastructure immediately. | Fast, low-risk launch visibility improvement. |
| 3 | Add baseline security headers and hide powered-by. | High | Security | S | Add headers through Next/Vercel config. | Large security posture gain for small implementation cost. |
| 4 | Clean release state. | High | Release | S | Commit/branch/archive and deploy only from known state. | Prevents accidental production drift. |
| 5 | Remove duplicate public images and optimize the largest active assets. | High | Performance | M | Start with the top 20 heaviest files and all hero/portrait images. | Big mobile load savings without product redesign. |
| 6 | Add a reliable inquiry form. | High | Business | M | Keep mailto fallback but add a real conversion path. | Better capture of high-intent visitors. |
| 7 | Fix dialog focus management. | High | Accessibility | M | Create one reusable modal/drawer shell and migrate Stress/Museum flows. | Reduces accessibility risk across multiple pages. |
| 8 | Add route metadata/canonicals/structured data. | Medium | SEO | S | Make all key pages search/social-ready. | Strong return because the site has many distinct landing pages. |
| 9 | Add browser smoke and a11y tests. | Medium | Quality | M | Cover top journeys and axe checks. | Protects launch fixes from regressions. |
| 10 | Split global CSS by route/component. | High | Maintainability | L | Do after blockers, in careful phases. | High long-term value, but lower immediate ROI than security/SEO/performance fixes. |

## Final Readiness Recommendation

Do not treat the current repository state as global-production ready. It is fit for a controlled soft launch after the dependency upgrade, SEO files, security headers, and release-state cleanup are completed. For a broader public launch, complete the image optimization, conversion capture, accessibility modal work, and basic operational monitoring first.
