import "server-only";
import { transaction } from "./database";
// Queue inspection only. Never mark fulfilled until an actual artifact is securely delivered.
export async function fulfillOne() {
 return transaction(async db => {
  const next=await db.query<{order_id:string}>(`SELECT d.order_id FROM valhalla.deliveries d JOIN valhalla.orders o ON o.order_id=d.order_id WHERE d.state='queued' AND o.state='paid' ORDER BY d.updated_at ASC FOR UPDATE OF d SKIP LOCKED LIMIT 1`);
  return next.rowCount ? {processed:false,queued_order_id:next.rows[0].order_id,reason:"fulfillment_not_configured"} : {processed:false};
 });
}
