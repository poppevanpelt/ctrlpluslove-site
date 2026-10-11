import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifiedSignature(raw: string, header: string, secret: string) {
  const parts = header.split(",").map(p => p.trim().split("="));
  const timestamp = parts.find(([k]) => k === "t")?.[1] || "";
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!/^\d{10,}$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(timestamp + "." + raw).digest("hex");
  return signatures.some(signature => {
    if (!/^[a-f0-9]{64}$/.test(signature)) return false;
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "Not configured" }, { status: 503 });
  const raw = await request.text();
  if (raw.length > 100000) return Response.json({ error: "Payload too large" }, { status: 413 });
  if (!verifiedSignature(raw, request.headers.get("stripe-signature") || "", secret)) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }
  let event: { id?: string; type?: string; data?: { object?: { id?: string } } };
  try { event = JSON.parse(raw); } catch { return Response.json({ error: "Malformed payload" }, { status: 400 }); }
  if (!event.id || !event.type) return Response.json({ error: "Malformed event" }, { status: 400 });
  // Signature verification only. Do not acknowledge fulfillment here until a durable,
  // idempotent store and transactional delivery queue are wired. Entitlement checks
  // independently re-read Stripe's paid status rather than trusting a browser redirect.
  return Response.json({ received: true });
}
