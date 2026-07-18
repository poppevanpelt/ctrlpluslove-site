# ctrl+love Public Asset Audit

Date: 2026-07-14  
Scope: deployable files under `public/` after removing `public/.DS_Store`.  
Method: filesystem inventory, image dimensions via `sips`, and repository reference search across `src`, `public`, `README.md`, `next.config.ts`, and `vercel.json`.

## Completion Update

Completion date: 2026-07-14

- Before completion pass: `public/` was about 68 MB.
- After completion pass: `public/` is about 44 MB.
- Image count after completion: 87 files.
- Image type distribution after completion: 31 PNG, 27 JPEG, 15 WebP, 13 SVG, 1 ICO.
- Image strategy: hybrid production strategy. Next/Vercel image optimization is enabled for `next/image`, and active heavy PNG delivery files were replaced with WebP assets for both `next/image` and plain document-viewer `<img>` routes.
- Replaced and removed PNG delivery files: `public/ai-y-fier-hero-inflation-engine.png`, `public/dear-marjan.png`, `public/dear-rob.png`, `public/department-consequential-belief.png`, `public/department-essential-things.png`, `public/department-irreversible-decisions.png`, `public/department-necessary-elimination.png`, `public/museum/happiness-delay-mug.png`, `public/museum/ignored-fax-machine.png`, `public/museum/really-big-mistakes-eraser.png`, `public/pricing/decision-stress-test.png`, `public/pricing/kill-or-scale.png`, `public/pricing/on-call-room.png`, `public/reality-poster.png`, `public/unfinished-thoughts.png`.
- Added WebP replacements with the same base filenames.
- Preserved uncertain portrait/source/legacy files for manual release-scope review instead of deleting them silently.

Representative size changes:

| Asset | PNG size | WebP size |
| --- | ---: | ---: |
| `ai-y-fier-hero-inflation-engine` | 1.29 MB | 48 KB |
| `dear-marjan` | 1.40 MB | 148 KB |
| `dear-rob` | 1.97 MB | 180 KB |
| `department-consequential-belief` | 1.94 MB | 168 KB |
| `department-essential-things` | 1.75 MB | 148 KB |
| `department-irreversible-decisions` | 1.60 MB | 116 KB |
| `department-necessary-elimination` | 1.62 MB | 96 KB |
| `museum/happiness-delay-mug` | 1.60 MB | 28 KB |
| `museum/ignored-fax-machine` | 2.01 MB | 128 KB |
| `museum/really-big-mistakes-eraser` | 1.83 MB | 68 KB |
| `pricing/decision-stress-test` | 1.21 MB | 88 KB |
| `pricing/kill-or-scale` | 1.73 MB | 144 KB |
| `pricing/on-call-room` | 1.67 MB | 164 KB |
| `reality-poster` | 2.67 MB | 280 KB |
| `unfinished-thoughts` | 2.34 MB | 156 KB |

Remaining large files over 1 MB are mostly manual-review assets: unreferenced portrait/source variants, `public/DEARMARJAN.png`, `public/tools/ai-y-fier/assets/hero-dashboard.png`, `public/ai-y-fier-hero.png`, and `public/rob/raincoat.png`.

## Summary

- Original Phase 1 removed `public/.DS_Store`; the completion pass then replaced the highest-impact active PNG delivery files with WebP and removed the replaced PNGs from `public/`.
- No uncertain portrait, source, museum, legacy tool, or historical public assets were deleted because several appear to be source variants, historical public files, or manually sensitive assets.
- Completed active optimization candidates include the pricing PNGs, document-viewer PNGs, three Museum product PNGs, `reality-poster.png`, `unfinished-thoughts.png`, and `ai-y-fier-hero-inflation-engine.png`.
- Image-delivery decision: use Next/Vercel image optimization for `next/image` assets and WebP delivery files for the active large PNGs.

## Removed Assets

| Path | Reason | Verification |
| --- | --- | --- |
| `public/.DS_Store` | OS metadata, not a deployable site asset. | Listed in `.gitignore`; removed and rechecked with `find public -name '.DS_Store'`. |

## active - keep

| Path | Type | Dimensions | Size | Likely usage | Recommended action |
| --- | --- | --- | ---: | --- | --- |
| `public/apple-icon.png` | png | 180x180 | 36 KB | 2 reference hit(s) | Referenced public asset. |
| `public/ctrl-love-logo-gradient-master.png` | png | 1548x366 | 429 KB | 2 reference hit(s) | Referenced public asset. |
| `public/downloads/ctrl_love_constitution_governance_export.zip` | zip | - | 16 KB | 5 reference hit(s) | Referenced public asset. |
| `public/favicon.ico` | ico | 32x32 | 3 KB | 4 reference hit(s) | Referenced public asset. |
| `public/favicon.png` | png | 32x32 | 3 KB | 4 reference hit(s) | Referenced public asset. |
| `public/museum/flip-flops-pair-packshot.png` | png | 986x738 | 492 KB | 2 reference hit(s) | Referenced public asset. |
| `public/museum/steel-ball-packshot.png` | png | 430x414 | 100 KB | 8 reference hit(s) | Referenced public asset. |
| `public/theme-init.js` | js | - | 3 KB | 2 reference hit(s) | Root theme and service-worker cleanup bootstrap, moved out of inline script for CSP. |
| `public/tools/ai-y-fier/index.html` | html | - | 2 KB | no direct reference hit | Redirects legacy tool path to the App Router page. |

## active - optimize

| Path | Type | Dimensions | Size | Likely usage | Recommended action |
| --- | --- | --- | ---: | --- | --- |
| `public/ai-y-fier-hero-inflation-engine.png` | png | 1672x941 | 1.29 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/ambassadors/portraits/001-poppe-van-pelt-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 213 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/002-nadia-al-mardini-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 110 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/003-shun-iwai-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 101 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/004-sung-wook-tayl-chung-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 156 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/005-mats-utberg-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 93 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/006-jorge-virgos-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 218 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/007-jose-ricardo-monteiro-jr-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 74 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/008-christophe-pernaudet-portrait-clean-20260712.jpeg` | jpeg | 900x1125 | 208 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/008-christophe-pernaudet-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 105 KB | no direct reference hit | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/009-umberto-bartolini-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 169 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/ambassadors/portraits/010-flip-portrait-live-20260712.jpeg` | jpeg | 900x1125 | 146 KB | 2 reference hit(s) | Referenced by ambassador data or kept as current portrait variant; optimize later. |
| `public/dear-marjan.png` | png | 1024x1536 | 1.40 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/dear-rob.png` | png | 1024x1536 | 1.97 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/department-consequential-belief.png` | png | 1149x1369 | 1.94 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/department-essential-things.png` | png | 1140x1380 | 1.75 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/department-irreversible-decisions.png` | png | 1158x1359 | 1.60 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/department-necessary-elimination.png` | png | 1024x1536 | 1.62 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/museum/happiness-delay-mug.png` | png | 1536x1024 | 1.60 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/museum/ignored-fax-machine.png` | png | 1536x1024 | 2.01 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/museum/really-big-mistakes-eraser.png` | png | 1536x1024 | 1.83 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/pricing/decision-stress-test.png` | png | 1536x1024 | 1.21 MB | 4 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/pricing/kill-or-scale.png` | png | 1536x1024 | 1.73 MB | 4 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/pricing/on-call-room.png` | png | 1536x1024 | 1.67 MB | 4 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/reality-poster.png` | png | 1672x941 | 2.67 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |
| `public/unfinished-thoughts.png` | png | 1536x1024 | 2.34 MB | 2 reference hit(s) | Referenced raster asset over 500 KB; optimize in image pipeline. |

## duplicate - candidate for removal

| Path | Type | Dimensions | Size | Likely usage | Recommended action |
| --- | --- | --- | ---: | --- | --- |
| `public/DEARMARJAN.png` | png | 1024x1536 | 1.69 MB | no direct reference hit | Likely older duplicate of dear-marjan.png; no reference found. |

## unreferenced - candidate for removal

| Path | Type | Dimensions | Size | Likely usage | Recommended action |
| --- | --- | --- | ---: | --- | --- |
| `public/file.svg` | svg | - | 1 KB | no direct reference hit | Starter SVG asset; no reference found. |
| `public/globe.svg` | svg | - | 2 KB | no direct reference hit | Starter SVG asset; no reference found. |
| `public/next.svg` | svg | - | 2 KB | no direct reference hit | Starter SVG asset; no reference found. |
| `public/src/app/artifacts/page.tsx` | tsx | - | 2 KB | 1 reference hit(s) | Source file copied into public; no runtime reference found. |
| `public/sw.js` | js | - | 1 KB | no direct reference hit | Existing root script unregisters service workers; no registration found. |
| `public/vercel.svg` | svg | - | 1 KB | no direct reference hit | Starter SVG asset; no reference found. |
| `public/window.svg` | svg | - | 1 KB | no direct reference hit | Starter SVG asset; no reference found. |

## uncertain - preserve and review manually

| Path | Type | Dimensions | Size | Likely usage | Recommended action |
| --- | --- | --- | ---: | --- | --- |
| `public/ai-y-fier-hero.png` | png | 1672x941 | 1.29 MB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/christophe.svg` | svg | - | 1 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/jorge.svg` | svg | - | 1 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/jose-ricardo-monteiro.svg` | svg | - | 1 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/mats.svg` | svg | - | 1 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/nadia.svg` | svg | - | 2 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/poppe-van-pelt.svg` | svg | - | 1 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/portraits/001-poppe-van-pelt-20260712.jpeg` | jpeg | 2316x3088 | 1.53 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/001-poppe-van-pelt-portrait-20260712.jpeg` | jpeg | 900x1125 | 213 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/001-poppe-van-pelt.jpeg` | jpeg | 2316x3088 | 1.53 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/001-poppe-van-pelt.png` | png | 282x377 | 148 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/002-nadia-al-mardini-20260712.png` | png | 1402x1122 | 1.63 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/002-nadia-al-mardini-portrait-20260712.jpeg` | jpeg | 900x1125 | 110 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/002-nadia-al-mardini.png` | png | 1402x1122 | 1.63 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/003-shun-iwai-20260712.png` | png | 1402x1122 | 1.78 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/003-shun-iwai-portrait-20260712.jpeg` | jpeg | 900x1125 | 101 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/003-shun-iwai.png` | png | 1402x1122 | 1.78 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/004-sung-wook-tay-chung.png` | png | 287x377 | 145 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/004-sung-wook-tayl-chung-20260712.png` | png | 1536x1024 | 2.25 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/004-sung-wook-tayl-chung-portrait-20260712.jpeg` | jpeg | 900x1125 | 156 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/004-sung-wook-tayl-chung.png` | png | 1536x1024 | 2.25 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/005-mats-utberg-20260712.png` | png | 1402x1122 | 1.75 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/005-mats-utberg-portrait-20260712.jpeg` | jpeg | 900x1125 | 93 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/005-mats-utberg.png` | png | 1402x1122 | 1.75 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/006-jorge-virgos-20260712.jpeg` | jpeg | 1200x1600 | 670 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/006-jorge-virgos-portrait-20260712.jpeg` | jpeg | 900x1125 | 218 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/006-jorge-virgos.jpeg` | jpeg | 1200x1600 | 670 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/006-jorge-virgos.png` | png | 337x330 | 171 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/007-jose-ricardo-monteiro-jr-20260712.png` | png | 1322x1144 | 1.27 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/007-jose-ricardo-monteiro-jr-portrait-20260712-v2.jpeg` | jpeg | 900x1125 | 74 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/007-jose-ricardo-monteiro-jr-portrait-20260712.jpeg` | jpeg | 900x1125 | 73 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/007-jose-ricardo-monteiro-jr.png` | png | 1322x1144 | 1.27 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/008-christophe-color.png` | png | 900x833 | 1014 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/008-christophe-pernaudet-20260712.png` | png | 1382x1110 | 1.33 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/008-christophe-pernaudet-portrait-20260712.jpeg` | jpeg | 900x1125 | 105 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/008-christophe-pernaudet.png` | png | 1382x1110 | 1.33 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/008-christophe.png` | png | 356x330 | 176 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/009-umberto-bartolini-20260712.png` | png | 1402x1122 | 2.16 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/009-umberto-bartolini-portrait-20260712.jpeg` | jpeg | 900x1125 | 169 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/009-umberto-bartolini.png` | png | 1402x1122 | 2.16 MB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/portraits/010-flip-portrait-20260712.jpeg` | jpeg | 900x1125 | 146 KB | no direct reference hit | Portrait variant not directly referenced; likely duplicate candidate, but preserve until ambassador asset decisions are confirmed. |
| `public/ambassadors/shun.svg` | svg | - | 1 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/ambassadors/tayl.svg` | svg | - | 1 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/apple-touch-icon.png` | png | 180x180 | 36 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/living-decision-simulator-episode-002.html` | html | - | 30 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/museum/flip-flops-packshot.png` | png | 400x264 | 39 KB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/rob/raincoat.png` | png | 754x766 | 1.00 MB | no direct reference hit | No direct reference found; preserve until manual route/history review confirms removal. |
| `public/tools/ai-y-fier/app.js` | js | - | 11 KB | no direct reference hit | Legacy tool asset/version; public and probably superseded, but linked history should be reviewed before removal. |
| `public/tools/ai-y-fier/assets/hero-dashboard.png` | png | 1672x941 | 1.29 MB | no direct reference hit | Legacy tool asset/version; public and probably superseded, but linked history should be reviewed before removal. |
| `public/tools/ai-y-fier/index-v11.html` | html | - | 2 KB | no direct reference hit | Legacy tool asset/version; public and probably superseded, but linked history should be reviewed before removal. |
| `public/tools/ai-y-fier/index-v12.html` | html | - | 2 KB | no direct reference hit | Legacy tool asset/version; public and probably superseded, but linked history should be reviewed before removal. |
| `public/tools/ai-y-fier/index-v13.html` | html | - | 2 KB | no direct reference hit | Legacy tool asset/version; public and probably superseded, but linked history should be reviewed before removal. |
| `public/tools/ai-y-fier/index-v14.html` | html | - | 2 KB | no direct reference hit | Legacy tool asset/version; public and probably superseded, but linked history should be reviewed before removal. |
| `public/tools/ai-y-fier/styles.css` | css | - | 10 KB | no direct reference hit | Legacy tool asset/version; public and probably superseded, but linked history should be reviewed before removal. |

## Image Optimization Notes

The completion pass converted the active large PNG delivery files listed above and updated app references to WebP. `images.unoptimized: true` was removed from `next.config.ts`, and local per-image ambassador opt-outs were removed so Vercel/Next can optimize responsive portrait delivery.

The remaining public footprint is now dominated by uncertain source, dated, portrait, and legacy tool assets. Those files were preserved for human release approval instead of being deleted as part of this Phase 1 completion pass.
