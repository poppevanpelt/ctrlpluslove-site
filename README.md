# ctrl+love

ctrl+love is now configured as a public landing-page-only Next.js site for `ctrlpluslove.com`.

The landing page lives at `src/app/page.tsx`, with global styling in `src/app/globals.css`.

The private chat/admin prototype from the hand-off has been moved out of the deployed app tree and ignored from git.

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
npm run db:push   # sync Prisma schema to local DB
npm run db:seed   # seed admin user, personas, rules, protocols, indexes
npm run db:studio # inspect local DB
```

## Important Notes

- This repo uses Next.js `16.2.1`.
- `.env`, `.env.local`, `.vercel`, database files, `node_modules`, `.next`, and `private-prototype` should not be committed.
- No environment variables are required for the landing page.

## Deploy on Vercel

The project can be deployed as a Next.js app on Vercel. Use your own Vercel account and link the repo:

```powershell
vercel login
vercel link
vercel env pull
vercel --prod
```

See `CODEX_HANDOFF.md` for the transfer checklist, GitHub/Vercel connection notes, and production caveats.
