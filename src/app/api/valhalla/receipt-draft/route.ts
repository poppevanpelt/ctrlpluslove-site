import { saveAssessment } from "../../../../lib/valhalla/receipt-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (process.env.VALHALLA_PAYMENTS_ENABLED !== "true") {
    return Response.json({ error: "Unavailable" }, { status: 503 });
  }
  const text = await request.text();
  if (text.length > 25000) return Response.json({ error: "Assessment too large" }, { status: 413 });
  let payload: unknown;
  try { payload = JSON.parse(text); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  try {
    const saved = await saveAssessment(payload);
    if (!saved) return Response.json({ error: "Invalid assessment" }, { status: 400 });
    return Response.json(saved, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Storage unavailable" }, { status: 503 });
  }
}
