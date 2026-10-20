import { digest } from "../../../../lib/valhalla/receipt-store";
import { database } from "../../../../lib/valhalla/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };
const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://ctrlpluslove.com";

export async function POST(request: Request) {
  if (process.env.VALHALLA_PAYMENTS_ENABLED !== "true") {
    return Response.json({ error: "Checkout is not enabled." }, { status: 503, headers });
  }
  const key = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_CONVICTION;
  if (!key || !price) return Response.json({ error: "Checkout is not configured." }, { status: 503, headers });
  const body = await request.json().catch(() => null);
  if (body?.instrument !== "conviction") return Response.json({ error: "Unknown instrument." }, { status: 400, headers });
  // Do not accept amount, price ID, discount, fulfillment status or return URL from the caller.
  if (typeof body?.orderId !== "string" || typeof body?.privateToken !== "string") {
    return Response.json({ error: "Assessment reference required." }, { status: 400, headers });
  }
  const id = body.orderId;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[a-f0-9]{64}$/.test(body.privateToken)) {
    return Response.json({ error: "Invalid assessment reference." }, { status: 400, headers });
  }
  try {
    const draft = await database().query(
      "SELECT order_id FROM valhalla.receipt_drafts WHERE order_id=$1 AND access_hash=$2",
      [id, digest(body.privateToken)]
    );
    if (!draft.rowCount) return Response.json({ error: "Assessment not found." }, { status: 404, headers });
  } catch {
    return Response.json({ error: "Assessment storage unavailable." }, { status: 503, headers });
  }
  const params = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    "metadata[instrument]": "conviction",
    "metadata[order_id]": id,
    "client_reference_id": id,
    success_url: new URL("/valhalla/delivery?session_id={CHECKOUT_SESSION_ID}", origin).toString(),
    cancel_url: new URL("/conviction?checkout=cancelled", origin).toString()
  });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": id },
    body: params.toString(),
    cache: "no-store"
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || typeof result.url !== "string") {
    return Response.json({ error: "Checkout could not be created." }, { status: 502, headers });
  }
  return Response.json({ url: result.url }, { headers });
}
