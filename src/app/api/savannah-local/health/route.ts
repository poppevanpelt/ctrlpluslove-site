import { NextResponse } from "next/server";

const LOCAL_RUNTIME = (process.env.SAVANNAH_LOCAL_RUNTIME_URL || "http://127.0.0.1:4517").replace(/\/$/, "");

export async function GET() {
  try {
    const response = await fetch(`${LOCAL_RUNTIME}/health`, { cache: "no-store" });
    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Savannah Local is unreachable." },
      { status: 503 },
    );
  }
}
