"use client";
import { useMemo, useState } from "react";
import styles from "./conviction.module.css";

const criteria = [
  {name:"Problem urgency",weight:20,test:"Is this a verified problem for this buyer, and why now?",repair:"Prove the buyer-specific cost of waiting.",effort:2,gate:0},
  {name:"Commercial upside",weight:20,test:"Is the total pilot investment justified against doing nothing?",repair:"Document complete costs, assumptions, benefit range and break-even.",effort:2,gate:-1},
  {name:"Credibility",weight:20,test:"Can the central promise be independently checked?",repair:"Replace claims with a repeatable demonstration and verifiable results.",effort:3,gate:-1},
  {name:"Differentiation",weight:10,test:"Why this approach instead of the best real alternative?",repair:"Compare honestly with the strongest available alternative.",effort:2,gate:-1},
  {name:"Downside protection",weight:15,test:"Is the loss bounded and can the CEO safely stop?",repair:"Define capped spend, duration, dependencies, ownership and exit.",effort:1,gate:1},
  {name:"Decision readiness",weight:15,test:"Can the CEO approve a precise request today?",repair:"Set decision owner, price, success metric, failure threshold and deadline.",effort:1,gate:2}
] as const;
const grading=["Missing or contradicted","Assertion only","Plausible reasoning or explicit estimate","Repeatable demo or documented comparable case","Independent relevant validation","Verified buyer-specific evidence, with limitations"];
const gateNames=["Buyer-specific problem independently confirmed","Price, scope, owner and exit conditions explicit","Success and failure thresholds agreed"];
type Entry={grade:number;source:string;observation:string};
const initial=():Entry[]=>criteria.map(()=>({grade:0,source:"",observation:""}));

export default function ConvictionPage(){
 const [title,setTitle]=useState("");
 const [buyer,setBuyer]=useState("Skeptical founder / CEO");
 const [price,setPrice]=useState("");
 const [promise,setPromise]=useState("");
 const [alternative,setAlternative]=useState("Do nothing");
 const [entries,setEntries]=useState<Entry[]>(initial);
 const [gates,setGates]=useState([false,false,false]);
 const [active,setActive]=useState(0);
 const score=useMemo(()=>Math.round(criteria.reduce((a,c,i)=>a+c.weight*entries[i].grade/5,0)),[entries]);
 const blockers=gates.filter(x=>!x).length;
 const verdict=blockers?"NOT READY TO APPROVE":score>=85?"READY FOR A DECISION":score>=70?"REPAIRS REQUIRED":score>=50?"NOT YET FUNDABLE":"REBUILD THE CASE";
 const repairs=useMemo(()=>criteria.map((c,i)=>({...c,i,headroom:Math.round(c.weight*(5-entries[i].grade)/5),blocked:c.gate>=0&&!gates[c.gate],priority:c.weight*(5-entries[i].grade)/5/c.effort})).filter(r=>r.headroom>0).sort((a,b)=>Number(b.blocked)-Number(a.blocked)||b.priority-a.priority),[entries,gates]);
 function setEntry(i:number,patch:Partial<Entry>){setEntries(old=>old.map((v,j)=>j===i?{...v,...patch}:v));}
 function download(){
 const report=["CONVICTION™ — ctrl+love","Experimental diagnostic, NOT a validated purchase probability.","", "Proposal: "+(title||"Untitled"),"Buyer: "+buyer,"Pilot price: "+(price||"Unknown"),"Promise: "+(promise||"Unspecified"),"Real alternative: "+alternative,"", "SCORE "+score+"/100","VERDICT "+verdict,"Approval gates: "+gates.filter(Boolean).length+"/3","",...criteria.map((c,i)=>c.name+": "+entries[i].grade+"/5 ("+Math.round(c.weight*entries[i].grade/5)+"/"+c.weight+" points)\nEvidence: "+(entries[i].source||"MISSING")+"\nObservation: "+(entries[i].observation||"MISSING")),"","REPAIR ORDER",...repairs.map((r,i)=>(i+1)+". "+r.repair+" [maximum headroom "+r.headroom+" points; NOT forecast lift]"),"","KILL QUESTION: What evidence would make us advise keeping the money?"].join("\n");
 const url=URL.createObjectURL(new Blob([report],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="conviction-receipt.txt";a.click();URL.revokeObjectURL(url);
 }
 return <main className={styles.page} id="main-content">
 <nav className={styles.nav}><a href="/">ctrl+love</a><span>INSTRUMENT / CONVICTION™</span><a href="/#instruments">ALL INSTRUMENTS ↗</a></nav>
 <header className={styles.hero}><p className={styles.eyebrow}>OBSERVE / ANALYSE / ACCELERATE</p><h1>CONVICTION<span>™</span></h1><p className={styles.heroLine}>Would you put your own company's money behind this?</p><p>Evidence first. Opposition second. Repairs third. The number is a diagnostic rubric, not a predicted approval probability.</p></header>
 <section className={styles.details}>
 <label>PROPOSITION NAME<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Remote presence pilot"/></label>
 <label>BUYER<input value={buyer} onChange={e=>setBuyer(e.target.value)}/></label>
 <label>PILOT PRICE<input value={price} onChange={e=>setPrice(e.target.value)} placeholder="e.g. €15,000"/></label>
 <label>STRONGEST ALTERNATIVE<input value={alternative} onChange={e=>setAlternative(e.target.value)}/></label>
 <label className={styles.full}>OUTCOME THE CEO IS BEING ASKED TO PAY TO TEST<textarea rows={2} value={promise} onChange={e=>setPromise(e.target.value)} placeholder="What would actually change?"/></label>
 </section>
 <section className={styles.assessment}><div><p className={styles.eyebrow}>01 / EXAMINE</p><h2>What can we prove?</h2><p>Select a dimension. Score the evidence, and make the source inspectable.</p><div className={styles.dimensions}>{criteria.map((c,i)=><button type="button" key={c.name} className={active===i?styles.selected:""} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,"0")} / {c.name}</span><strong>{entries[i].grade}/5</strong></button>)}</div></div>
 <div className={styles.editor}><p className={styles.eyebrow}>{criteria[active].weight}% WEIGHT</p><h2>{criteria[active].name}</h2><p>{criteria[active].test}</p><label>GRADE<select value={entries[active].grade} onChange={e=>setEntry(active,{grade:Number(e.target.value)})}>{grading.map((g,i)=><option key={g} value={i}>{i} — {g}</option>)}</select></label><label>EVIDENCE SOURCE<input value={entries[active].source} onChange={e=>setEntry(active,{source:e.target.value})} placeholder="URL / dated document / person"/></label><label>OBSERVATION + LIMITATIONS<textarea rows={4} value={entries[active].observation} onChange={e=>setEntry(active,{observation:e.target.value})} placeholder="What was observed, not promised?"/></label>{entries[active].grade>0&&!entries[active].source.trim()&&<p className={styles.alert}>Source missing. This grade remains provisional.</p>}<button type="button" className={styles.primary} onClick={()=>setActive((active+1)%criteria.length)}>NEXT DIMENSION →</button></div></section>
 <section className={styles.verdict}><div><p className={styles.eyebrow}>02 / THE VERDICT</p><div className={styles.number}>{score}<span>/100</span></div><div className={styles.meter}><div style={{width:score+"%"}}/></div><h2>{verdict}</h2><p>Diagnostic score only; not a purchase probability.</p></div><div><p className={styles.eyebrow}>APPROVAL GATES</p><h2>{blockers?blockers+" unresolved":"All declared passed"}</h2>{gateNames.map((name,i)=><label key={name} className={styles.check}><input type="checkbox" checked={gates[i]} onChange={e=>setGates(old=>old.map((x,j)=>j===i?e.target.checked:x))}/>{name}</label>)}<p>Only mark a gate complete once verified. Passing all gates is necessary, not sufficient.</p></div></section>
 <section className={styles.repairSection}><p className={styles.eyebrow}>03 / THE CHEAPEST +10™</p><h2>Fix what changes the decision.</h2><p>Missing approval gates first. Then largest missing rubric potential per unit of indicative effort. Potential points are not guaranteed improvements.</p>{repairs.map((r,i)=><article key={r.name} className={styles.repair}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{r.name}</h3><p>{r.repair}</p>{r.blocked&&<b>APPROVAL GATE</b>}</div><strong>UP TO +{r.headroom}</strong></article>)}{repairs.length===0&&<p>All grades are maximal. Test against actual CEO decisions before claiming predictive validity.</p>}</section>
 <section className={styles.close}><div><p className={styles.eyebrow}>04 / RECEIPT</p><h2>Conviction is not confidence.</h2><p>Every claim should survive a real buyer, a real alternative and a real price.</p><button type="button" className={styles.primary} onClick={download}>DOWNLOAD RECEIPT ↓</button></div><aside><p>THE KILL QUESTION</p><h2>What evidence would make us recommend that the CEO keep the money?</h2><small>Experimental rubric v1. No scientific calibration or actual approval-rate prediction yet.</small></aside></section>
 </main>;
}
