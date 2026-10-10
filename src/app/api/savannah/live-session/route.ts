import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const configured = () => Boolean(process.env.SIMLI_API_KEY && process.env.SIMLI_FACE_ID && (process.env.SAVANNAH_LIVE_TEST_KEY?.length || 0) >= 32);
let nextSessionAt = 0;

export async function GET() {
  return Response.json({ configured: configured() }, { headers });
}

export async function POST(request: Request) {
  if (!configured()) return Response.json({ error: "The live face test is awaiting setup." }, { status: 503, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Open this test on the site." }, { status: 403, headers });
  const expected = Buffer.from(process.env.SAVANNAH_LIVE_TEST_KEY!);
  const provided = Buffer.from((request.headers.get("authorization") || "").replace(/^Bearer /, ""));
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return Response.json({ error: "Test access required." }, { status: 401, headers });
  // One short test at a time in this process; provider also caps every session.
  if (Date.now() < nextSessionAt) return Response.json({ error: "Wait for the previous two-minute test to finish." }, { status: 429, headers });
  nextSessionAt = Date.now() + 120000;
  try {
    const response = await fetch("https://api.simli.ai/compose/token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-simli-api-key": process.env.SIMLI_API_KEY! },
      body: JSON.stringify({ faceId: process.env.SIMLI_FACE_ID, apiVersion: "v2", handleSilence: true, maxSessionLength: 120, maxIdleTime: 30, audioInputFormat: "pcm16" }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("session unavailable");
    const result = await response.json();
    if (typeof result.session_token !== "string" || !result.session_token) throw new Error("invalid session");
    return Response.json({ session_token: result.session_token }, { headers });
  } catch {
    nextSessionAt = 0;
    return Response.json({ error: "The live face could not connect. Try again shortly." }, { status: 502, headers });
  }
}
