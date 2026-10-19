"use client";
import {useMemo,useState} from "react";

type Case = {id:number;title:string;context:string;reference:boolean;estimate:number;human:number};
const scenarios:Case[] = [
 {id:1,title:"Kill the weekly status meeting?",context:"Six participants; notes duplicated in an existing dashboard; no decisions recorded for six weeks.",reference:true,estimate:88,human:60},
 {id:2,title:"Launch the untested checkout?",context:"Payments failed in 4 of 10 test attempts; the campaign date is tomorrow.",reference:false,estimate:81,human:30},
 {id:3,title:"Automate the client complaint review?",context:"Low volume, sensitive exceptions, significant reputational exposure.",reference:false,estimate:72,human:35},
 {id:4,title:"Pilot the internal approval bot?",context:"A reversible 20-person trial; reviewers can override; audit logs are available.",reference:true,estimate:76,human:80},
 {id:5,title:"Replace interviews with synthetic personas?",context:"No real customer interviews; major product repositioning at stake.",reference:false,estimate:90,human:25},
 {id:6,title:"Retire the unused monthly report?",context:"No recorded readers for nine months; finance confirms no statutory requirement.",reference:true,estimate:83,human:75},
 {id:7,title:"Publish the AI-generated case study?",context:"Named client hasn't approved publication; results are unverified.",reference:false,estimate:84,human:15},
 {id:8,title:"Run the low-cost landing page test?",context:"Reversible, consent-safe experiment; defined success criteria and €300 budget.",reference:true,estimate:66,human:82}
];
export default function DecisionCalibrator(){
 const [cases,setCases]=useState<Case[]>(scenarios);
 const [active,setActive]=useState(0);
 const [revealed,setRevealed]=useState(false);
 const [reason,setReason]=useState<Record<number,string>>({});
 const current=cases[active];
 const stats=useMemo(()=> {
  const brier=(side:"human"|"estimate")=>cases.reduce((s,c)=>s+Math.pow(c[side]/100-(c.reference?1:0),2),0)/cases.length;
  return {human:brier("human"),model:brier("estimate"),disagree:cases.filter(c=>Math.abs(c.human-c.estimate)>=30).length};
 },[cases]);
 const exportReceipt=()=>{
  const blob=new Blob([JSON.stringify({instrument:"DECISION CALIBRATOR",version:"synthetic pilot",disclaimer:"Probabilities are fictional illustrative inputs, not Perplexity API responses. Reference labels are constructed for demonstration, not empirical truth.",cases:cases.map(c=>({...c,rationale:reason[c.id]||""})),metrics:{brierHuman:stats.human,brierIllustrativeModel:stats.model,disagreements:stats.disagree}},null,2)],{type:"application/json"});
  const u=URL.createObjectURL(blob); const a=document.createElement("a");a.href=u;a.download="decision-calibrator-receipt.json";a.click();URL.revokeObjectURL(u);
 };
 return <main style={{background:"#eeeae2",color:"#181818",minHeight:"100vh",padding:"clamp(24px,5vw,70px)",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:1100,margin:"auto"}}>
 <a href="/" style={{color:"inherit",fontSize:13}}>← ctrl+love</a>
 <p style={{letterSpacing:3,fontSize:12,marginTop:48}}>OBSERVE / ANALYSE / ACCELERATE · LAB 003</p>
 <h1 style={{fontSize:"clamp(48px,9vw,112px)",letterSpacing:"-.065em",lineHeight:.95,margin:"20px 0"}}>DECISION<br/>CALIBRATOR™</h1>
 <p style={{fontSize:22,maxWidth:680,lineHeight:1.4}}>When a machine is confidently wrong, does anybody notice?</p>
 <p style={{maxWidth:750,lineHeight:1.6}}>An eight-case laboratory with fictional examples and illustrative model probabilities. Make your judgment, reveal the constructed reference outcome, and inspect disagreements. No model API, uploads, or production systems are involved.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:24,marginTop:36}}>
 <section style={{border:"1px solid #888",background:"#fbf9f3",padding:25}}>
 <p style={{fontSize:12,letterSpacing:2}}>CASE {active+1} / {cases.length}</p>
 <h2 style={{fontSize:30,lineHeight:1.12}}>{current.title}</h2>
 <p style={{lineHeight:1.6,minHeight:92}}>{current.context}</p>
 <label htmlFor="estimate" style={{display:"block",fontWeight:700,marginBottom:15}}>YOUR ESTIMATE · YES {current.human}%</label>
 <input id="estimate" type="range" min="0" max="100" value={current.human} onChange={e=>setCases(old=>old.map(c=>c.id===current.id?{...c,human:Number(e.target.value)}:c))} style={{width:"100%"}}/>
 <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span>NO 100%</span><span>YES 100%</span></div>
 <label htmlFor="rationale" style={{display:"block",marginTop:24,fontWeight:700}}>WHY?</label>
 <textarea id="rationale" value={reason[current.id]||""} onChange={e=>setReason(o=>({...o,[current.id]:e.target.value}))} placeholder="What would change your mind?" style={{boxSizing:"border-box",width:"100%",minHeight:100,padding:14,marginTop:8,background:"white",border:"1px solid #999",color:"#181818"}}/>
 <button onClick={()=>setRevealed(v=>!v)} style={{marginTop:18,background:"#181818",color:"white",border:0,padding:"14px 18px",fontWeight:700,cursor:"pointer"}}>{revealed?"HIDE REFERENCE":"REVEAL REFERENCE + MODEL ESTIMATE"}</button>
 {revealed&&<div style={{borderTop:"2px solid #181818",marginTop:20,paddingTop:16}}>
 <p><strong>Constructed reference:</strong> {current.reference?"YES":"NO"}</p>
 <p><strong>Illustrative model YES probability:</strong> {current.estimate}%</p>
 <p><strong>Human–model gap:</strong> {Math.abs(current.human-current.estimate)} percentage points</p>
 <p style={{fontSize:13}}>Reference is an editorial judgment constructed for the demo. It is not an observed real-world outcome.</p>
 </div>}
 <div style={{display:"flex",justifyContent:"space-between",marginTop:24,gap:12}}>
 <button onClick={()=>{setActive(Math.max(0,active-1));setRevealed(false)}} disabled={active===0} style={{padding:12,cursor:"pointer"}}>← PREVIOUS</button>
 <button onClick={()=>{setActive(Math.min(cases.length-1,active+1));setRevealed(false)}} disabled={active===cases.length-1} style={{padding:12,cursor:"pointer"}}>NEXT →</button>
 </div>
 </section>
 <section style={{border:"1px solid #888",padding:25}}>
 <p style={{fontSize:12,letterSpacing:2}}>JUDGMENT SURFACE</p>
 <h2 style={{fontSize:30}}>Where judgments diverge.</h2>
 <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,margin:"24px 0"}}>
 {cases.map((c,i)=><button key={c.id} onClick={()=>{setActive(i);setRevealed(false)}} style={{padding:"18px 3px",background:active===i?"#171717":"#ddd6c9",color:active===i?"white":"#171717",border:0,cursor:"pointer"}}>{String(c.id).padStart(2,"0")}</button>)}
 </div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
 <div style={{borderTop:"2px solid",paddingTop:12}}><span style={{fontSize:12}}>ILLUSTRATIVE MODEL BRIER</span><p style={{fontSize:40,margin:"8px 0"}}>{stats.model.toFixed(3)}</p></div>
 <div style={{borderTop:"2px solid",paddingTop:12}}><span style={{fontSize:12}}>YOUR BRIER</span><p style={{fontSize:40,margin:"8px 0"}}>{stats.human.toFixed(3)}</p></div>
 </div>
 <p style={{fontSize:13,lineHeight:1.5}}>Brier score: average squared difference between YES probability and binary constructed reference. Lower is better. Scores use all cases, including unreviewed defaults: not a fair human-vs-model evaluation until you adjust every estimate.</p>
 <div style={{borderTop:"1px solid #888",marginTop:22,paddingTop:16}}>
 <p><strong>{stats.disagree} of {cases.length}</strong> cases have a human–model gap of at least 30 percentage points.</p>
 <p>High model confidence is not verification, and disagreement is not proof that either side is right.</p>
 </div>
 <button onClick={exportReceipt} style={{border:"1px solid #181818",background:"transparent",padding:"14px 18px",cursor:"pointer",fontWeight:700,width:"100%",marginTop:22}}>EXPORT THE RECEIPT ↓</button>
 </section>
 </div>
 <footer style={{marginTop:50,borderTop:"1px solid #999",paddingTop:18,fontSize:13,lineHeight:1.5}}>PILOT LIMITS · 8 synthetic cases · illustrative probabilities only · no external decisions API · not evidence of forecasting accuracy · no connection to Savannah</footer>
 </div></main>;
}
