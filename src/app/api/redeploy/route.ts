import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.NOTION_REDEPLOY_SECRET;
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!expectedSecret || !deployHookUrl) {
    console.error("Missing NOTION_REDEPLOY_SECRET or VERCEL_DEPLOY_HOOK_URL");
    return NextResponse.json(
      { ok: false, error: "Server is not configured" },
      { status: 500 },
    );
  }

  const suppliedSecret = request.headers.get("x-redeploy-secret") ?? "";
  if (!safeEqual(suppliedSecret, expectedSecret)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const notionPayload = await request.json().catch(() => null);

    const response = await fetch(deployHookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "notion",
        requestedAt: new Date().toISOString(),
        notion: notionPayload,
      }),
      cache: "no-store",
    });

    const responseText = await response.text();
    let deployment: unknown = responseText;

    try {
      deployment = JSON.parse(responseText);
    } catch {
      // Keep non-JSON responses as text.
    }

    if (!response.ok) {
      console.error("Deploy hook failed", response.status, deployment);
      return NextResponse.json(
        {
          ok: false,
          error: "Deployment provider rejected the request",
          providerStatus: response.status,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Deployment triggered",
      deployment,
    });
  } catch (error) {
    console.error("Redeploy bridge error", error);
    return NextResponse.json(
      { ok: false, error: "Could not trigger deployment" },
      { status: 500 },
    );
  }
}
