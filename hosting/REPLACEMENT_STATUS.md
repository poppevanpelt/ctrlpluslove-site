# Vercel-independent replacement — 7 October 2026

Source: poppevanpelt/ctrlpluslove-site, commit 16905a33a958d716317d803e9a65160230dcd1fe.

The complete site was copied into a separate Sites/Vinext checkout. The Cloudflare Worker production build succeeded with all existing routes, Vapi 2.6.1, media assets, API handlers and the Savannah widget. The existing Instrument Cabinet was separately restored, and a copy was prepared under /cabinet/ without changing its live publication.

Registration of a new replacement Site failed: the account has reached its Site Hosting usage limit. No replacement was deployed. No DNS changes were made. No existing Site was overwritten or deleted. Vercel lists no registered domains for the connected team; this does not establish which registrar manages ctrlpluslove.com.

Validation: 50 of 51 existing tests passed. The remaining persona portrait assertion also fails on the unchanged source, because its expected assets differ from current assets. Browser/audio interaction and production domain checks remain pending. The supervised preview started, but the available test shell could not reach it. No audible call has been verified on the replacement host.

Server-side Notion/OpenAI credentials have not been migrated or verified. Existing API handlers retain their configuration checks; a build success does not prove those live integrations are ready.

Next action: choose an available hosting target. One option is expanding the existing ctrl+love Instrument Cabinet Site, preserving the cabinet at /cabinet/ and mapping ctrlpluslove.com to the main website. That changes an existing Site and its audience, so it has not been done without the user's explicit choice. Alternatively enable capacity for a new Site or connect another host supporting the complete Worker/Next runtime. Do not substitute a static export that silently loses API handlers or protected-room checks.

Reproduce the validated migration with scripts/prepare-sites-replacement.mjs. It requires an absolute Sites plugin root and a separate empty destination. The original production source stays unchanged. Register/persist the final project identity, migrate runtime configuration, publish and verify before changing DNS. Use the Sites hosting skill's source workflow; never commit credentials.
