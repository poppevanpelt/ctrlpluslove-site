# ctrl+love

ctrl+love is configured as a public Next.js site for `ctrlpluslove.com`.

The landing page lives at `src/app/page.tsx`, global styling lives in `src/app/globals.css`, and the product/artifact routes live under `src/app/*`.

No environment variables are required for the public pages. The Re-run Room backend described below needs server-only environment variables.

## Getting Started

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```powershell
npm run dev       # local development
npm run build     # production build check
npm run lint      # lint check
npm run typecheck # TypeScript check
npm run test      # automation unit tests
npm run preview:static # build and create a self-contained static preview
```

## Important Notes

- This repo uses Next.js `16.2.1`.
- `.env`, `.env.local`, `.vercel`, `node_modules`, `.next`, and static preview output should not be committed.
- No environment variables are required for the landing page.
- The production app includes server routes for the Re-run Room automation, so `next.config.ts` does not use full static export.

## Deploy on Vercel

The project can be deployed as a Next.js app on Vercel. Use your own Vercel account and link the repo:

```powershell
vercel login
vercel link
vercel env pull
vercel --prod
```

The public pages are still static where possible, while Vercel runs the automation endpoints as serverless functions.

## Re-run Room Automation

The Re-run Room automation lets a Notion project page request a controlled ctrl+love Engine refresh. The MVP uses Vercel Cron polling every five minutes. Notion webhooks may replace polling later, but webhook support is not required for this version.

### Required Notion Properties

Create these properties on the ctrl+love project database/data source:

- `Room Status`: Status with values `Idle`, `Refresh requested`, `Running`, `Updated`, `Failed`
- `Refresh Requested At`: Date
- `Last Room Run`: Date
- `Run Version`: Number
- `Last Processed Comment`: Rich text
- `Room Error`: Rich text
- `Last Room Summary`: Rich text
- `Triggered By`: Rich text, optional when available

### Notion Button

Button label:

```text
🔄 Re-run Room
```

Button actions:

- Edit property: `Room Status` -> `Refresh requested`
- Edit property: `Refresh Requested At` -> `Now`
- Edit property: `Room Error` -> empty, if Notion supports clearing it

The button does not call the site API directly. It only changes page properties; Vercel Cron detects the request.

### Publish Website Button

After 30 years in advertising, Poppe has finally reached the pinnacle of his career: a Notion button.

Admittedly, a rather important one.

The Publish website button sends the latest approved Notion content to the live website by triggering a fresh Vercel production build.

Please click it only after the content is ready to publish. One click is enough; repeated clicks create unnecessary deployments.

### Environment Variables

Set these server-side variables in Vercel:

```text
NOTION_TOKEN=
NOTION_RUNS_DATA_SOURCE_ID=
OPENAI_API_KEY=
CRON_SECRET=
```

Optional:

```text
ROOM_MODEL=gpt-4.1-mini
ROOM_MAX_RUNS_PER_CYCLE=3
ROOM_MINIMUM_INTERVAL_MINUTES=5
ROOM_STALE_REQUEST_HOURS=72
DRY_RUN=false
```

Never expose these values to the client. The automation route handlers read them only at runtime.

### Status Flow

Expected transitions:

```text
Refresh requested -> Running -> Updated
Refresh requested -> Running -> Failed
```

The runner skips pages that are already `Running`, already processed, too recent, or stale beyond `ROOM_STALE_REQUEST_HOURS` unless manually forced.

### Cron

`vercel.json` schedules:

```text
GET /api/room-refresh
*/5 * * * *
```

This 5-minute schedule requires a Vercel plan that supports sub-daily cron jobs. Vercel Hobby projects reject this schedule at deploy time; upgrade the project plan or deliberately change the MVP schedule before deploying.

The cron route:

- requires `Authorization: Bearer $CRON_SECRET`
- finds data source pages where `Room Status = Refresh requested`
- processes up to `ROOM_MAX_RUNS_PER_CYCLE`
- processes each page independently
- returns a compact JSON summary

Vercel Cron invokes the path as `GET /api/room-refresh`. In production, set `CRON_SECRET` in Vercel so the platform includes the bearer authorization header. Manual and external invocations should use `POST /api/room-refresh` with the same header.

### Manual Test Endpoint

Endpoint:

```text
POST https://www.ctrlpluslove.com/api/room-refresh
```

Example request:

```bash
curl -X POST https://www.ctrlpluslove.com/api/room-refresh \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json"
```

The canonical endpoint processes up to three requested Notion pages per invocation. For a single-page manual recovery/test, `POST /api/room/rerun` still accepts `{ "pageId": "...", "force": false }` with the same bearer secret.

Set `DRY_RUN=true` in Vercel to read, classify, and generate a proposed update without writing Room output or status changes back to Notion.

### What The Runner Reads

The backend reads:

- page title and supported scalar properties
- all child blocks recursively
- headings, paragraphs, lists, quotes, toggles, callouts, and other rich-text block text where the Notion API exposes it
- recognized sections such as Discussion, Synthesis, Recommendation, Confidence, What changed, Latest Room Refresh, and Room Run History
- page comments and block comments available through Notion's public `comments` endpoint

### Known Notion API Limitations

The implementation is honest about Notion API limits:

- It can retrieve comments exposed by `GET /v1/comments?block_id=...` for the page and known blocks.
- Inline discussion coverage depends on what Notion exposes for the integration and block IDs.
- Resolved state and rich author details may not be available for every comment.
- The runner does not resolve, delete, or mutate human comments.
- If the integration cannot access comments for a block, the runner continues with available page content and logs the limitation.

### Engine Behavior

The Engine receives the current brief, page structure, existing discussion, synthesis, recommendation, confidence, and only the detected meaningful changes. It must return strict JSON. Invalid model output is repaired once; unvalidated output is never written to Notion.

Non-material inputs such as emoji-only comments, simple acknowledgements, whitespace edits, and administrative comments are filtered before any model call.

### Write-Back

The automation does not overwrite the whole page. Before writing a successful result, it archives only recognized Engine-owned sections from the existing page, then appends fresh controlled sections:

- Discussion
- Changed positions
- Synthesis
- Recommendation
- Confidence
- What changed

The original brief, human-authored sections, comments, attachments, and unrelated blocks are left untouched. If a page has no controlled sections yet, the new controlled output is appended without archiving anything.

After success it increments `Run Version`, sets `Last Room Run`, stores a compact processed comment/state marker in `Last Processed Comment`, clears `Room Error`, writes `Last Room Summary`, and sets `Room Status` to `Updated`.

On failure it sets `Room Status` to `Failed`, writes a readable `Room Error`, and preserves the previous valid room output.

### Rollback

To pause the automation:

1. Remove or disable the Vercel cron entry in `vercel.json`.
2. Redeploy.
3. Set any stuck Notion pages from `Running` to `Idle` or `Refresh requested` after checking `Room Error`.

To fully remove it, revert the API routes and `src/lib/room` / `src/lib/notion` additions, then redeploy.

### Deployment

Before deploying:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Then deploy:

```bash
vercel --prod
```
