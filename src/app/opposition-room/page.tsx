"use client";
import {useMemo,useState} from "react";
type Role="Advocate"|"Opposition"|"Auditor"|"Single-agent control";
type Finding={role:Role;claim:string;kind:"strength"|"risk"|"evidence";weight:number};
type Case={name:string;decision:string;facts:string[];findings:Finding[]};
const cases:Case[]=[
{name:"Cancel the status meeting",decision:"Remove the weekly six-person status meeting.",facts:["Six participants, 45 minutes each week","Dashboard covers status","No decisions recorded in six weeks"],findings:[
{role:"Advocate",claim:"Reclaim 4.5 person-hours weekly without losing recorded decisions.",kind:"strength",weight:3},{role:"Opposition",claim:"Unrecorded coordination may still take place; check how exceptions are resolved.",kind:"risk",weight:3},{role:"Auditor",claim:"Dashboard readership and informal decisions are not measured.",kind:"evidence",weight:3},{role:"Single-agent control",claim:"Replace the meeting with an asynchronous update and review after a month.",kind:"risk",weight:1}]},
{name:"Launch the AI receptionist",decision:"Turn on autonomous client intake tomorrow.",facts:["Speech transcription works in demo","No consent process confirmed","Escalation was tested only internally"],findings:[
{role:"Advocate",claim:"Round-the-clock intake could reduce missed enquiries.",kind:"strength",weight:2},{role:"Opposition",claim:"A live conversation might promise unavailable services or mishandle sensitive data.",kind:"risk",weight:3},{role:"Auditor",claim:"No external test of consent, escalation accuracy or failure recovery.",kind:"evidence",weight:3},{role:"Single-agent control",claim:"Launch to a small beta audience with monitoring.",kind:"risk",weight:1}]},
{name:"Sell the client vault",decision:"Sell the cultural vault before ingestion and permissions are verified.",facts:["Prototype index exists","Client material mixes owned and third-party assets","No deletion exercise has been run"],findings:[
{role:"Advocate",claim:"A narrow pilot can demonstrate retrieval value.",kind:"strength",weight:2},{role:"Opposition",claim:"Permission and deletion failures could outweigh the commercial upside.",kind:"risk",weight:3},{role:"Auditor",claim:"Asset rights, access controls and deletion logs are unverified.",kind:"evidence",weight:3},{role:"Single-agent control",claim:"Offer a restricted pilot with a controlled sample.",kind:"risk",weight:1}]},
{name:"Fire the approval chain",decision:"Let a model approve all social posts automatically.",facts:["Four approval layers currently exist","Two past posts needed legal changes","Turnaround is slow"],findings:[
{role:"Advocate",claim:"Low-risk posts could move faster with clearer thresholds.",kind:"strength",weight:2},{role:"Opposition",claim:"Full autonomy removes accountability for consequential exceptions.",kind:"risk",weight:3},{role:"Auditor",claim:"The rate and severity of corrections by risk category are missing.",kind:"evidence",weight:3},{role:"Single-agent control",claim:"Automate routine checks but retain human approval for legal risk.",kind:"risk",weight:1}]},
{name:"Replace customer research",decision:"Use synthetic personas instead of interviewing customers.",facts:["Interview recruitment is costly","No matched human validation cohort","Product repositioning is high stakes"],findings:[
{role:"Advocate",claim:"Synthetic respondents could help generate early hypotheses.",kind:"strength",weight:2},{role:"Opposition",claim:"Confident simulations could conceal unobserved customer behaviour.",kind:"risk",weight:3},{role:"Auditor",claim:"No agreement study against actual customers is available.",kind:"evidence",weight:3},{role:"Single-agent control",claim:"Use synthetic personas for exploration, not replacement.",kind:"risk",weight:1}]}
];
const roles:Role[]=["Advocate","Opposition","Auditor","Single-agent control"];
const roleDescriptions:Record<Role,string>={"Advocate":"Build the strongest defensible case.","Opposition":"Find what would break the decision.","Auditor":"Separate observations from assumptions.","Single-agent control":"One generalist answer as baseline."};
const colors:Record<string,string>={strength:"#dbe6d8",risk:"#e9ded1",evidence:"#dce3e7"};
export default function OppositionRoom(){
 const [index,setIndex]=useState(0),[selected,setSelected]=useState<Role[]>(roles),[flags,setFlags]=useState<Record<string,boolean>>({}),[notes,setNotes]=useState<Record<string,string>>({});
 const current=cases[index];
 const visible=current.findings.filter(f=>selected.includes(f.role));
 const judged=useMemo(()=>cases.flatMap((c,i)=>c.findings.filter(f=>flags[i+":"+f.role]).map(f=>({case:c.name,role:f.role,claim:f.claim,reason:notes[i+":"+f.role]||""}))),[flags,notes]);
 function receipt(){
  const json=JSON.stringify({instrument:"THE OPPOSITION ROOM",version:"scripted-control-001",method:"Editorially constructed independent role prompts, NOT live autonomous agents",cases:cases.map((c,i)=>({name:c.name,decision:c.decision,facts:c.facts,findings:c.findings.map(f=>({...f,flagged:!!flags[i+":"+f.role],humanNote:notes[i+":"+f.role]||""}))})),reviewed:judged},null,2);
  const url=URL.createObjectURL(new Blob([json],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="opposition-room-receipt.json";a.click();URL.revokeObjectURL(url);
 }
 return <main style={{fontFamily:"Arial,Helvetica,sans-serif",background:"#f0ede6",color:"#171717",minHeight:"100vh",padding:"clamp(20px,5vw,72px)"}}>
 <div style={{maxWidth:1100,margin:"auto"}}>
 <a href="/" style={{color:"inherit",fontSize:13}}>← ctrl+love</a><p style={{fontSize:12,letterSpacing:3,marginTop:55}}>OBSERVE / ANALYSE / ACCELERATE · LAB 004</p>
 <h1 style={{fontSize:"clamp(44px,9vw,110px)",lineHeight:.93,letterSpacing:"-.065em",margin:"18px 0"}}>THE<br/>OPPOSITION<br/>ROOM™</h1>
 <p style={{fontSize:23,maxWidth:750,lineHeight:1.35}}>Three seats. One decision. No obligation to agree.</p>
 <p style={{maxWidth:780,lineHeight:1.5}}>An evidence-first interactive pilot. All findings are authored examples, not AI-generated results. The experiment makes the opposition method tangible before integrating independently running agents.</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"36px 0 24px"}}>{cases.map((c,i)=><button key={c.name} onClick={()=>setIndex(i)} aria-pressed={index===i} style={{border:"1px solid #171717",background:index===i?"#171717":"transparent",color:index===i?"white":"#171717",padding:"11px 13px",cursor:"pointer",fontWeight:700}}>0{i+1}</button>)}</div>
 <section style={{borderTop:"3px solid #171717",paddingTop:18}}><p style={{fontSize:12,letterSpacing:2}}>THE PROPOSED MOVE / CASE 0{index+1}</p><h2 style={{fontSize:"clamp(26px,4vw,42px)",maxWidth:800,margin:"12px 0"}}>{current.decision}</h2>
 <details open><summary style={{cursor:"pointer",fontWeight:700}}>Known facts in this fictional case</summary><ul>{current.facts.map(f=><li key={f} style={{padding:4}}>{f}</li>)}</ul></details></section>
 <p style={{marginTop:35,fontWeight:700,fontSize:13}}>VISIBLE SEATS — SELECT TO COMPARE</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>{roles.map(role=><button key={role} onClick={()=>setSelected(s=>s.includes(role)?s.filter(x=>x!==role):[...s,role])} aria-pressed={selected.includes(role)} style={{background:selected.includes(role)?"#171717":"transparent",color:selected.includes(role)?"#fff":"#171717",textAlign:"left",padding:16,border:"1px solid #171717",cursor:"pointer"}}><strong style={{display:"block",marginBottom:8}}>{role.toUpperCase()}</strong><span style={{fontSize:13,lineHeight:1.4}}>{roleDescriptions[role]}</span></button>)}</div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14,marginTop:18}}>{visible.map(f=><article key={f.role} style={{background:colors[f.kind],border:"1px solid #999",padding:20}}>
 <p style={{fontSize:12,letterSpacing:1}}>{f.role.toUpperCase()} / {f.kind.toUpperCase()}</p><p style={{fontSize:20,lineHeight:1.38,minHeight:135}}>{f.claim}</p>
 <label style={{display:"flex",gap:10,fontSize:13,alignItems:"center"}}><input type="checkbox" checked={!!flags[index+":"+f.role]} onChange={e=>setFlags(v=>({...v,[index+":"+f.role]:e.target.checked}))}/>Mark as material</label>
 <textarea aria-label={"Evidence note for "+f.role} placeholder="Evidence, contradiction, or next test?" value={notes[index+":"+f.role]||""} onChange={e=>setNotes(n=>({...n,[index+":"+f.role]:e.target.value}))} style={{marginTop:12,boxSizing:"border-box",width:"100%",minHeight:85,padding:10,background:"#fffdfa",color:"#171717",border:"1px solid #777"}}/>
 </article>)}</div>
 <section style={{marginTop:40,padding:"20px 0",borderTop:"3px solid #171717"}}>
 <h2 style={{fontSize:30,margin:"0 0 10px"}}>THE DISAGREEMENT RECEIPT</h2>
 <p style={{lineHeight:1.6,maxWidth:790}}>You marked <strong>{judged.length}</strong> findings as material across five scenarios. This is a qualitative review, not a validated score of agent independence, accuracy or coverage. The single-agent control is deliberately included to expose questions for a future blind test.</p>
 <button onClick={receipt} style={{background:"#171717",color:"#fff",padding:"15px 20px",border:0,cursor:"pointer",fontWeight:700}}>EXPORT RECEIPT ↓</button>
 </section><footer style={{borderTop:"1px solid #888",paddingTop:20,fontSize:12,lineHeight:1.5}}>SCRIPTED PROTOTYPE · No model calls · No claimed independence · No external data · No production Savannah changes. Next phase: blinded live multi-agent vs single-agent comparison with measured false positives, missed material objections, latency and cost.</footer>
 </div></main>;
}
