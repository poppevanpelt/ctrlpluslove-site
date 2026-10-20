import "server-only";
import { transaction } from "./database";
import { renderReceipt, validateReceipt } from "./receipt";

// Exactly-once database artifact creation. Does not claim email or external delivery.
// The private authenticated download endpoint must be operational before enabling this worker.
export async function fulfillOne() {
 if (process.env.VALHALLA_DELIVERY_ENABLED !== "true") {
  return { processed:false, reason:"delivery_disabled" };
 }
 return transaction(async db => {
  const queued=await db.query<{order_id:string;assessment:unknown}>(`
   SELECT d.order_id,r.assessment
   FROM valhalla.deliveries d
   JOIN valhalla.orders o ON o.order_id=d.order_id
   JOIN valhalla.receipt_drafts r ON r.order_id=d.order_id
   WHERE d.state='queued' AND o.state='paid'
   ORDER BY d.updated_at ASC
   FOR UPDATE OF d SKIP LOCKED LIMIT 1`);
  if (!queued.rowCount) return {processed:false};
  const {order_id,assessment}=queued.rows[0];
  const receipt=validateReceipt(assessment);
  if (!receipt) throw new Error("Invalid persisted assessment");
  const receiptText=renderReceipt(receipt);
  const saved=await db.query(
   "INSERT INTO valhalla.receipt_artifacts (order_id,receipt_text) VALUES ($1,$2) ON CONFLICT (order_id) DO NOTHING RETURNING order_id",
   [order_id,receiptText]
  );
  const exists=await db.query("SELECT order_id FROM valhalla.receipt_artifacts WHERE order_id=$1",[order_id]);
  if (!saved.rowCount && !exists.rowCount) throw new Error("Artifact not persisted");
  await db.query("UPDATE valhalla.deliveries SET state='complete',attempts=attempts+1,updated_at=now() WHERE order_id=$1 AND state='queued'",[order_id]);
  await db.query("UPDATE valhalla.orders SET state='fulfilled' WHERE order_id=$1 AND state='paid'",[order_id]);
  return {processed:true,order_id,delivery:"stored_for_secure_retrieval"};
 });
}
