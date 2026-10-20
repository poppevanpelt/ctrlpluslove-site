import "server-only";
import { transaction } from "./database";
import type { validatedOrder } from "./order-policy";

type PaidOrder = NonNullable<ReturnType<typeof validatedOrder>>;
export async function recordPaidOrder(eventId: string, eventType: string, order: PaidOrder) {
  return transaction(async db => {
    const event = await db.query(
      "INSERT INTO valhalla.payment_events (stripe_event_id,event_type,stripe_session_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING stripe_event_id",
      [eventId,eventType,order.stripe_session_id]
    );
    if (!event.rowCount) return { duplicate: true };
    await db.query(
      `INSERT INTO valhalla.orders (order_id,stripe_session_id,instrument,state,currency,amount_total)
       VALUES ($1,$2,$3,'paid',$4,$5)
       ON CONFLICT (order_id) DO NOTHING`,
      [order.order_id,order.stripe_session_id,order.instrument,order.currency,order.amount_total]
    );
    const match = await db.query(
      "SELECT order_id FROM valhalla.orders WHERE order_id=$1 AND stripe_session_id=$2 AND instrument=$3 AND amount_total=$4 AND currency=$5",
      [order.order_id,order.stripe_session_id,order.instrument,order.amount_total,order.currency]
    );
    if (!match.rowCount) throw new Error("Conflicting order identity");
    await db.query(
      "INSERT INTO valhalla.deliveries (order_id,state) VALUES ($1,'queued') ON CONFLICT (order_id) DO NOTHING",
      [order.order_id]
    );
    return { duplicate: false };
  });
}
