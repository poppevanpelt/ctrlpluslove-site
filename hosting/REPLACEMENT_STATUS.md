# Vercel-independent replacement — 7 October 2026

The complete website is published on the existing Instrument Cabinet Site:
https://ctrl-love-instruments.ctrl-love-4138.chatgpt.site

The homepage includes the visual Instrument Cabinet entrance. The complete cabinet is available at /cabinet/. The cabinet host is now public as the replacement for the public main website; private-room route protections remain in the Worker.

Published Site: appgprj_6aa819e66fc081918d6f561b38564f5b
Saved version: 4
Source commit: 8f84062619c1c3f19d0bed45610fc80549e1ec23
Deployment: appgdep_6ac5d2b814488191bbb27155a6d477f4 (succeeded)

The Site source repository contains the complete migrated source. GitHub main separately contains the homepage Cabinet change at 94fae53e3579494f95b89b84637d8dd8201665e2. The migration retains the original application routes, API handlers and Vapi client.

WordPress.com DNS was updated successfully: apex A records now target 162.159.143.30 and 172.66.3.26; www CNAME now targets custom-domains.chatgpt.site. Four host-validation TXT records were added. Mail, other TXT records and other subdomains were preserved. Previous routing: apex A 76.76.21.21; www CNAME 13513a7930c49d40.vercel-dns-017.com. Both had TTL 300. The connected WordPress domain status is transfer_completed, with registration paid through May 2028 and DNS management enabled.

Custom domain certificate validation and resolver propagation remain pending at this checkpoint. This is not evidence that all visitors already use the replacement. Use Sites custom-domain status before marking the address ready.

Verification: Worker build passed. Headless Worker requests return 200 for the homepage and /cabinet/, with the new Cabinet entrance. Anonymous requests to /bonkers and protected Savannah rooms render Door closed. The published replacement homepage returns HTTP 200 and contains both Pressure, not prompts. and Ideas enter. Evidence leaves. Original test suite: 50/51 pass; the portrait expectation failure also occurs on unchanged original source.

The original 43 MiB soundtrack WAV exceeded the Worker asset limit. The replacement uses an AAC M4A encoded at 128 kbit/s (3.7 MiB); source choices were reduced to the existing compatible M4A. Original audio remains in the original repository.

Server-side Notion/OpenAI credentials have not been migrated or verified. Existing API handlers retain configuration checks. No audible Vapi call has been verified. Build and HTTP success do not establish those integrations are ready.

New Site registration was rate-limited, so the existing Cabinet Site was reused. Do not retry creating another Site. Follow Sites source workflow for future updates; never commit credentials.
