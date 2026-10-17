import "server-only";
import { validatedOrder } from "./order-policy";

export async function fetchVerifiedCheckout(sessionId: string) {
  if (!/^cs_(test_|live_)[a-zA-Z0-9]+$/.test(sessionId) || sessionId.length > 255) throw new Error("Invalid checkout session");
  const key = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_CONVICTION;
  if (!key || !price) throw new Error("Stripe not configured");
  const headers = { Authorization: `Bearer ${key}` };
  const base = `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`;
  const [sessionResult, itemsResult] = await Promise.all([
    fetch(base, { headers, cache: "no-store" }),
    fetch(base + "/line_items?limit=10", { headers, cache: "no-store" })
  ]);
  if (!sessionResult.ok || !itemsResult.ok) throw new Error("Stripe lookup failed");
  const session = await sessionResult.json();
  const lines = await itemsResult.json();
  const order = validatedOrder(session, lines.data || [], price);
  if (!order) throw new Error("Checkout not eligible");
  return order;
}
