import "server-only";
import { transaction } from "./database";
import { randomUUID } from "node:crypto";

// Exactly one persisted artifact ID per order, even after duplicate worker invocations.
// A later delivery channel can notify the purchaser using an outbox with its own idempotency key.
export async function fulfillOne() {
  return transaction(async db => {
    const claim = await db.query<{order_id:string}>(`
      SELECT d.order_id FROM valhalla.deliveries d
      JOIN valhalla.orders o ON o.order_id=d.order_id
      WHERE d.state IN ('queued','failed') AND o.state='paid' AND d.attempts < 5
      ORDER BY d.updated_at ASC FOR UPDATE OF d SKIP LOCKED LIMIT 1`);
    if (!claim.rowCount) return { processed: false };
    const id = claim.rows[0].order_id;
    await db.query("UPDATE valhalla.deliveries SET state='processing', attempts=attempts+1,updated_at=now() WHERE order_id=$1", [id]);
    // At this stage we only issue a durable placeholder artifact identity; no receipt content
    // or email is represented as delivered until those services exist.
    const artifactId = randomUUID();
    await db.query("UPDATE valhalla.deliveries SET state='complete',artifact_id=$2,updated_at=now() WHERE order_id=$1", [id, artifactId]);
    await db.query("UPDATE valhalla.orders SET state='fulfilled' WHERE order_id=$1 AND state='paid'", [id]);
    return { processed: true, order_id: id, artifact_id: artifactId, kind: "internal_placeholder_only" };
  });
}
