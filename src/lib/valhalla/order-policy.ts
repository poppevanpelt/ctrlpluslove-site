export type DeliveryState = "queued" | "processing" | "complete" | "failed";
export type CheckoutEvidence = {
  id: string; mode: string; status: string; payment_status: string;
  client_reference_id: string | null; metadata?: Record<string,string>;
  currency: string | null; amount_total: number | null;
};
export type StripeLineItem = { price?: { id?: string }; quantity?: number };
export function validatedOrder(s: CheckoutEvidence, items: StripeLineItem[], expectedPrice: string) {
  const id = s.metadata?.order_id || "";
  if (s.mode !== "payment" || s.status !== "complete" || s.payment_status !== "paid") return null;
  if (s.metadata?.instrument !== "conviction" || s.client_reference_id !== id) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return null;
  if (!s.id.startsWith("cs_") || items.length !== 1 || items[0].price?.id !== expectedPrice || items[0].quantity !== 1) return null;
  if (!s.currency || !Number.isSafeInteger(s.amount_total) || s.amount_total! < 0) return null;
  return { order_id:id, stripe_session_id:s.id, instrument:"conviction" as const, state:"paid" as const, currency:s.currency, amount_total:s.amount_total! };
}
export function deliveryTransition(current: DeliveryState, next: DeliveryState): boolean {
  const allowed: Record<DeliveryState, DeliveryState[]> = {
    queued:["processing"], processing:["complete","failed"], failed:["processing"], complete:[]
  };
  return allowed[current].includes(next);
}
