export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Liveness only. Upstream services and persistent storage need separate checks.
// Never publish environment values or credential-presence diagnostics here.
export async function GET() {
  return Response.json(
    {
      status: "ok",
      service: "ctrlpluslove-site",
      revision: process.env.RAILWAY_GIT_COMMIT_SHA || null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
