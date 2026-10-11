export type EvidenceEntry={grade:number;source:string;observation:string};
export type DecisionReceipt={
 version:1; title:string;buyer:string;price:string;promise:string;alternative:string;
 criteria:{name:string;weight:number;repair:string}[];
 entries:EvidenceEntry[];gates:boolean[];created_at:string;
};
const clean=(v:unknown,max=2000)=>typeof v==="string"?v.trim().slice(0,max):"";
export function validateReceipt(input:unknown):DecisionReceipt|null {
 if(!input||typeof input!=="object")return null;
 const x=input as Record<string,unknown>;
 if(!Array.isArray(x.entries)||x.entries.length!==6||!Array.isArray(x.gates)||x.gates.length!==3)return null;
 const entries:EvidenceEntry[]=[];
 for(const e of x.entries){if(!e||typeof e!=="object")return null;const r=e as Record<string,unknown>;
  if(!Number.isInteger(r.grade)||Number(r.grade)<0||Number(r.grade)>5)return null;
  entries.push({grade:Number(r.grade),source:clean(r.source,1000),observation:clean(r.observation)});
 }
 if(!x.gates.every(g=>typeof g==="boolean"))return null;
 const criteria=[
  {name:"Problem urgency",weight:20,repair:"Prove the buyer-specific cost of waiting."},
  {name:"Commercial upside",weight:20,repair:"Document costs, assumptions and break-even."},
  {name:"Credibility",weight:20,repair:"Replace claims with a repeatable, verifiable demonstration."},
  {name:"Differentiation",weight:10,repair:"Compare with the strongest real alternative."},
  {name:"Downside protection",weight:15,repair:"Define spending cap, dependencies and exit."},
  {name:"Decision readiness",weight:15,repair:"Specify owner, success threshold and deadline."}
 ];
 return {version:1,title:clean(x.title,160),buyer:clean(x.buyer,160),price:clean(x.price,120),promise:clean(x.promise),alternative:clean(x.alternative,500),criteria,entries,gates:x.gates as boolean[],created_at:new Date().toISOString()};
}
export function renderReceipt(receipt:DecisionReceipt) {
 const score=Math.round(receipt.criteria.reduce((sum,c,i)=>sum+c.weight*receipt.entries[i].grade/5,0));
 const missing=receipt.gates.filter(g=>!g).length;
 const verdict=missing?"NOT READY TO APPROVE":score>=85?"READY FOR A DECISION":score>=70?"REPAIRS REQUIRED":score>=50?"NOT YET FUNDABLE":"REBUILD THE CASE";
 const repairs=receipt.criteria.map((c,i)=>({name:c.name,repair:c.repair,headroom:Math.round(c.weight*(5-receipt.entries[i].grade)/5)})).filter(r=>r.headroom>0).sort((a,b)=>b.headroom-a.headroom);
 return ["CONVICTION™ / ctrl+love","Experimental rubric, NOT a prediction of purchase probability.","",
  "Proposal: "+receipt.title,"Buyer: "+receipt.buyer,"Price: "+receipt.price,"Promise: "+receipt.promise,
  "Alternative: "+receipt.alternative,"Created: "+receipt.created_at,"",
  "SCORE "+score+"/100","VERDICT "+verdict,"GATES "+receipt.gates.filter(Boolean).length+"/3","",
  ...receipt.criteria.flatMap((c,i)=>[c.name+": "+receipt.entries[i].grade+"/5","Evidence: "+(receipt.entries[i].source||"MISSING"),"Observation: "+(receipt.entries[i].observation||"MISSING")]),
  "","REPAIRS",...repairs.map((r,i)=>(i+1)+". "+r.repair+" [potential "+r.headroom+" rubric points; not forecast improvement]"),
  "","KILL QUESTION: What evidence would make us advise keeping the money?"].join("\n");
}
