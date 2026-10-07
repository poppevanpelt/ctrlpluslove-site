# ctrl+love Release Checklist

## Before Release

- Run the **PURGE gate** in `PURGE.md`: every leftover experiment, route, asset, deployment, draft, prototype, script, and integration must be classified **KEEPER / ARCHIVE / TRASH**.
- **Not chosen = gone.** Remove TRASH before release; move ARCHIVE out of production; only KEEPERS may remain live.
- Confirm the intended release branch and latest commit.
- Confirm Git status is clean, or every dirty file is intentionally reviewed.
- Review changed files and make sure no unrelated experiments are shipping.
- Confirm required environment variable names are present in the production host; never print secret values.
- Run `npm run lint`.
- Run `npm run typecheck`; this command runs `next typegen` before TypeScript and should pass from a clean generated state.
- Run `npm test`.
- Run `npm run build`.
- Run `npm audit --audit-level=moderate`; the Phase 1 completion pass verified 0 vulnerabilities in an approved network environment.
- Inspect `/sitemap.xml` and confirm only public canonical routes are listed.
- Inspect `/robots.txt` and confirm API, duplicate, legacy tool, and private paths are excluded.
- Inspect page titles, descriptions, canonicals, Open Graph, and Twitter metadata on key public routes.
- Inspect security headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, and absence of `X-Powered-By`.
- Treat the current CSP as a hardened baseline, not strict CSP: `script-src` still allows `'unsafe-inline'` because production Next App Router HTML contains inline hydration/RSC scripts. Remove only after a maintainable nonce/hash strategy exists.
- Review public asset changes, especially portrait, pricing, museum, Steel Ball, and document images.
- Confirm active heavy image routes use appropriate optimized assets. Remaining large portrait/source/legacy assets require manual approval before release.
- Check critical links: homepage CTAs, pricing documents, Stress Test, Room, Museum, Steel Ball, ambassadors, constitution download, and mail links.
- Confirm the host-neutral scheduler for `/api/room-refresh` has the intended cadence, endpoint authentication, duplicate-run behavior, and Notion/OpenAI cost limits.
- Confirm external services required by the Room engine: Notion access, OpenAI API access, deploy hook, and cron secret.
- Theme bootstrap note: `/theme-init.js` unregisters service workers and deletes origin caches on load as a legacy cleanup measure. Keep only until stale service-worker risk is retired and `public/sw.js` is removed or otherwise resolved.

## Deployment

- Deploy the current GitHub `main` through the active production host using the standard Next.js build/start flow documented in `README.md`.
- Verify the production domain: `https://www.ctrlpluslove.com`.
- Review deployment logs for build warnings, missing environment variables, image issues, and cron warnings.
- Smoke-check key routes: `/`, `/stress-test/`, `/pricing/`, `/room/`, `/museum/`, `/steel-ball/`, `/ambassadors/`, one ambassador profile, `/sitemap.xml`, and `/robots.txt`.
- Verify API authentication failures behave correctly for protected Room endpoints.
- Confirm no secret values, internal payloads, or private route content are exposed in browser responses.

## After Deployment

- Check homepage on desktop and mobile.
- Check mobile navigation, layout, theme toggle, and first-screen image loading.
- Check Room-related routes and protected API failure responses.
- Check pricing overview and individual pricing documents.
- Check Decision Stress-Test interaction.
- Check Museum product flow and Steel Ball page.
- Check one ambassador profile and the ambassador grid.
- Recheck `/sitemap.xml` and `/robots.txt` on production.
- Recheck production security headers.
- Check image loading on homepage, pricing, Museum, Steel Ball, and ambassador routes.
- Watch deployment logs and automation logs for Room, Notion, OpenAI, cron, and redeploy errors.

## Rollback

- Redeploy the last known-good Git commit through the active production host.
- Roll back immediately if production shows broken routing, exposed secrets, failed protected endpoint behavior, missing critical assets, broken checkout/contact paths, repeated cron failures, or a material metadata/header regression.
- After rollback, disable or pause the external scheduler only if the issue is tied to `/api/room-refresh` or downstream Room automation.
