import { NextRequest, NextResponse } from "next/server";
import { getRoomEnv } from "@/lib/env";
import { processRequestedRooms } from "@/lib/room/processRequestedRooms";
import { roomLog } from "@/lib/room/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasBearerSecret(request: NextRequest, cronSecret: string): boolean {
  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

async function handleRoomRefresh(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const env = getRoomEnv();

    if (!hasBearerSecret(request, env.cronSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await processRequestedRooms(env);
    return NextResponse.json(result);
  } catch (error) {
    roomLog("error", {
      stage: "room-refresh-endpoint-failed",
      errorCategory: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Room refresh endpoint failed.",
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Room refresh endpoint failed." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return handleRoomRefresh(request);
}

export async function GET(request: NextRequest) {
  return handleRoomRefresh(request);
}
