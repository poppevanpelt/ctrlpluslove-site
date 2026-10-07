import { NextRequest, NextResponse } from "next/server";

const LOCAL_RUNTIME = (process.env.SAVANNAH_LOCAL_RUNTIME_URL || "http://127.0.0.1:4517").replace(/\/$/, "");

async function relay(path: string, init?: RequestInit) {
  try {
    const response = await fetch(`${LOCAL_RUNTIME}${path}`, {
      ...init,
      cache: "no-store",
    });

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
      {
        error: error instanceof Error ? error.message : "Savannah Local is unreachable.",
      },
      { status: 503 },
    );
  }
}

export async function GET() {
  return relay("/health");
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  return relay("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
