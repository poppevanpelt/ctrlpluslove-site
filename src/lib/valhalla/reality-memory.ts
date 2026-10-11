import "server-only";
import { database } from "./database";
import { digest } from "./receipt-store";
import { realityCheck } from "./reality-check";
import type { DecisionReceipt } from "./receipt";

type MemoryRow={id:string;item_type:string;content:unknown;created_at:string};
export function summarizeReality(original:DecisionReceipt, rows:MemoryRow[]){
 const score=Math.round(original.criteria.reduce((total,c,i)=>total+c.weight*original.entries[i].grade/5,0));
 return {original:{title:original.title,promise:original.promise,score,created_at:original.created_at,gates_passed:original.gates.filter(Boolean).length},
  observations:rows.map(row=>{
   const content=(row.content&&typeof row.content==="object"?row.content:{}) as Record<string,unknown>;
   // Legacy memory stores narrative, not numeric measurements. Never invent a number.
   return {id:row.id,kind:row.item_type,recorded_at:row.created_at,
    observed_at:typeof content.observedAt==="string"?content.observedAt:null,
    note:typeof content.note==="string"?content.note:"",
    comparison:realityCheck(null,null)};
  }),statement:"Observed narratives are self-reported. Original scores remain frozen. No predictive or causal inference."};
}
export async function realityMemoryForOrder(orderId:string,token:string){
 const result=await database().query<{assessment:DecisionReceipt}>(`
 SELECT d.assessment FROM valhalla.receipt_drafts d
 JOIN valhalla.orders o ON o.order_id=d.order_id
 WHERE d.order_id=$1 AND d.access_hash=$2 AND o.state='fulfilled'`,[orderId,digest(token)]);
 if(!result.rowCount)return null;
 const memory=await database().query<MemoryRow>(`
 SELECT m.id,m.item_type,m.content,m.created_at FROM valhalla.decision_memory m
 WHERE m.order_id=$1 ORDER BY m.created_at ASC LIMIT 100`,[orderId]);
 return summarizeReality(result.rows[0].assessment,memory.rows);
}
