import "server-only";
import { database } from "./database";
import { digest } from "./receipt-store";
import { summarizeReality } from "./reality-summary";
import type { DecisionReceipt } from "./receipt";
import type { MemoryRow } from "./reality-summary";
export async function realityMemoryForOrder(orderId:string,token:string){
 const result=await database().query<{assessment:DecisionReceipt}>(`
 SELECT d.assessment FROM valhalla.receipt_drafts d JOIN valhalla.orders o ON o.order_id=d.order_id
 WHERE d.order_id=$1 AND d.access_hash=$2 AND o.state='fulfilled'`,[orderId,digest(token)]);
 if(!result.rowCount)return null;
 const memory=await database().query<MemoryRow>(`SELECT m.id,m.item_type,m.content,m.created_at
 FROM valhalla.decision_memory m WHERE m.order_id=$1 ORDER BY m.created_at ASC LIMIT 100`,[orderId]);
 return summarizeReality(result.rows[0].assessment,memory.rows);
}
