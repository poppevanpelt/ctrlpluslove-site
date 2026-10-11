import { realityCheck } from "./reality-check";
import type { DecisionReceipt } from "./receipt";
export type MemoryRow={id:string;item_type:string;content:unknown;created_at:string};
export function summarizeReality(original:DecisionReceipt,rows:MemoryRow[]){
 const score=Math.round(original.criteria.reduce((total,c,i)=>total+c.weight*original.entries[i].grade/5,0));
 return {original:{title:original.title,promise:original.promise,score,created_at:original.created_at,gates_passed:original.gates.filter(Boolean).length},
 observations:rows.map(row=>{
  const value=(row.content&&typeof row.content==="object"?row.content:{}) as Record<string,unknown>;
  return {id:row.id,kind:row.item_type,recorded_at:row.created_at,observed_at:typeof value.observedAt==="string"?value.observedAt:null,
   note:typeof value.note==="string"?value.note:"",comparison:realityCheck(null,null)};
 }),statement:"Self-reported narratives. Original scores remain frozen. No causal or predictive inference."};
}
