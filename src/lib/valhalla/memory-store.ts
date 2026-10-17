import "server-only";
import { database } from "./database";
import { digest } from "./receipt-store";
import { parseMemoryInput } from "./memory-policy";

// Prototype-scoped bearer access. Not a customer identity provider.
export async function memoryForOrder(orderId:string,token:string) {
 const result=await database().query<{id:string;item_type:string;content:unknown;created_at:string}>(`
 SELECT m.id,m.item_type,m.content,m.created_at FROM valhalla.decision_memory m
 JOIN valhalla.receipt_drafts r ON r.order_id=m.order_id
 JOIN valhalla.orders o ON o.order_id=m.order_id
 WHERE m.order_id=$1 AND r.access_hash=$2 AND o.state='fulfilled'
 ORDER BY m.created_at ASC LIMIT 100`,[orderId,digest(token)]);
 return result.rows;
}
export async function addMemory(orderId:string,token:string,input:unknown) {
 const entry=parseMemoryInput(input);
 if(!entry)return false;
 const result=await database().query(`
 INSERT INTO valhalla.decision_memory (order_id,actor_id,item_type,content,consent_recorded_at)
 SELECT o.order_id,'order-token-holder',$3,jsonb_build_object('note',$4::text,'observedAt',$5::text),now()
 FROM valhalla.orders o JOIN valhalla.receipt_drafts r ON r.order_id=o.order_id
 WHERE o.order_id=$1 AND r.access_hash=$2 AND o.state='fulfilled' RETURNING id`,
 [orderId,digest(token),entry.kind,entry.note,entry.observedAt]);
 return Boolean(result.rowCount);
}
