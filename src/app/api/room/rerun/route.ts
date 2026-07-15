import { NextRequest, NextResponse } from "next/server";
import { getRoomEnv } from "@/lib/env";
import { runRoom } from "@/lib/room/runRoom";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest, cronSecret: string): boolean {
  const auth = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");

  return auth === `Bearer ${cronSecret}` || headerSecret === cronSecret;
}

export async function POST(request: NextRequest) {
  try {
    const env = getRoomEnv();

    if (!isAuthorized(request, env.cronSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as { pageId?: unknown; force?: unknown } | null;

    if (!body || typeof body.pageId !== "string") {
      return NextResponse.json({ error: "Request body must include pageId." }, { status: 400 });
    }

    const outcome = await runRoom(env, {
      pageId: body.pageId,
      force: body.force === true,
    });

    return NextResponse.json(outcome, { status: outcome.status === "failed" ? 500 : 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Manual Re-run Room request failed." },
      { status: 500 },
    );
  }
}
