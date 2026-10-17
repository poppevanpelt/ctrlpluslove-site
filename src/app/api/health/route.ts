import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Lightweight readiness probe: handled by the running Next.js application,
// independent of homepage data, images, or external AI integrations.
export function GET() {
  return NextResponse.json({ status: "ready" }, {
    status: 200,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
