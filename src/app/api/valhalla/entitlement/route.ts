export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") || "";
  if (!/^cs_(test_|live_)[A-Za-z0-9]+$/.test(sessionId) || sessionId.length > 255) {
    return Response.json({ entitled: false }, { status: 400, headers });
  }
  const key = process.env.STRIPE_SECRET_KEY;
  const expectedPrice = process.env.STRIPE_PRICE_CONVICTION;
  if (!key || !expectedPrice) return Response.json({ entitled: false }, { status: 503, headers });
  const stripeHeaders = { Authorization: `Bearer ${key}` };
  const [sessionResponse, itemsResponse] = await Promise.all([
    fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, { headers: stripeHeaders, cache: "no-store" }),
    fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}/line_items?limit=10`, { headers: stripeHeaders, cache: "no-store" })
  ]);
  if (!sessionResponse.ok || !itemsResponse.ok) return Response.json({ entitled: false }, { status: 502, headers });
  const session = await sessionResponse.json();
  const items = await itemsResponse.json();
  const entitled = session.mode === "payment"
    && session.payment_status === "paid"
    && session.status === "complete"
    && session.metadata?.instrument === "conviction"
    && typeof session.metadata?.order_id === "string"
    && session.client_reference_id === session.metadata.order_id
    && Array.isArray(items.data)
    && items.data.length === 1
    && items.data[0]?.price?.id === expectedPrice
    && items.data[0]?.quantity === 1;
  return Response.json(entitled ? {
    entitled: true,
    instrument: "conviction",
    order_id: session.metadata.order_id
  } : { entitled: false }, { status: entitled ? 200 : 403, headers });
}
