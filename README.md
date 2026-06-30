# ctrl+love

ctrl+love is configured as a public static Next.js site for `ctrlpluslove.com`.

The landing page lives at `src/app/page.tsx`, global styling lives in `src/app/globals.css`, and the product/artifact routes live under `src/app/*`.

No environment variables are required for the public site.

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
npm run preview:static # build and create a self-contained static preview
```

## Important Notes

- This repo uses Next.js `16.2.1`.
- `.env`, `.env.local`, `.vercel`, `node_modules`, `.next`, and static preview output should not be committed.
- No environment variables are required for the landing page.

## Deploy on Vercel

The project can be deployed as a Next.js app on Vercel. Use your own Vercel account and link the repo:

```powershell
vercel login
vercel link
vercel env pull
vercel --prod
```

The app uses `output: "export"` and `trailingSlash: true`, so Vercel can serve it as a static export.
