import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Retired Vercel build bridge. Never forward webhook payloads or trigger builds.
// Publishing follows GitHub main -> Railway instead.
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "This deployment hook is retired. Publish through GitHub main and Railway." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
