"use client";
import {useState} from "react";
type Finding={objection:string;why:string;test:string;severity:string;evidence_status:string};
type Response={kind:string;caseId:string;scenario:{decision:string;facts:string[]};roles:{role:string;summary:string;findings:Finding[];elapsedMs:number;usage?:{total_tokens?:number}}[];control:{role:string;summary:string;findings:Finding[];elapsedMs:number;usage?:{total_tokens?:number}};metrics:{specialistFindings:number;controlFindings:number;elapsedMs:number;usage:{prompt_tokens:number;completion_tokens:number}};limitations:string[]};
const cases=[["meeting","Status meeting"],["receptionist","AI receptionist"],["vault","Cultural vault"],["approvals","Social approvals"],["research","Synthetic research"]];
export default function LiveOpposition(){
 const [caseId,setCaseId]=useState("meeting"),[accessCode,setCode]=useState(""),[loading,setLoading]=useState(false),[output,setOutput]=useState<Response|null>(null),[error,setError]=useState(""),[material,setMaterial]=useState<Record<string,boolean>>({}),[notes,setNotes]=useState<Record<string,string>>({});
 async function run(){
  if(loading)return;setLoading(true);setError("");setOutput(null);setMaterial({});setNotes({});
  try{const res=await fetch("/api/opposition-room/live",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({caseId,accessCode})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Experiment failed");setOutput(data as Response);}catch(e){setError(e instanceof Error?e.message:"Unknown error")}finally{setLoading(false)}
 }
 function exportReceipt(){if(!output)return;const blob=new Blob([JSON.stringify({...output,humanReview:{material,notes},reviewedAt:new Date().toISOString()},null,2)],{type:"application/json"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download="opposition-live-receipt.json";a.click();URL.revokeObjectURL(u);}
 return <main style={{background:"#eeeae3",color:"#181818",fontFamily:"Arial,sans-serif",minHeight:"100vh",padding:"clamp(22px,5vw,68px)"}}><div style={{maxWidth:1050,margin:"auto"}}>
 <a href="/opposition-room/" style={{color:"inherit",fontSize:13}}>← THE OPPOSITION ROOM</a><p style={{fontSize:12,letterSpacing:3,marginTop:48}}>CTRL+LOVE / LAB 004 / LIVE TEXT TEST</p><h1 style={{fontSize:"clamp(46px,8vw,96px)",lineHeight:.95,letterSpacing:"-.06em",margin:"20px 0"}}>THREE SEATS.<br/>ONE CONTROL.</h1>
 <p style={{fontSize:21,maxWidth:760,lineHeight:1.4}}>Four separate model calls. Three specialist instructions. One generalist baseline. None can see the others' answers.</p>
 <p style={{maxWidth:760,lineHeight:1.5}}>Use fictional cases only. Model outputs are hypotheses, not verified truth. This test makes real inference calls only when the private sandbox is configured and access is authorized.</p>
 <section style={{borderTop:"2px solid #181818",marginTop:35,paddingTop:25,display:"flex",gap:14,flexWrap:"wrap",alignItems:"end"}}>
 <label style={{display:"grid",gap:8,flex:"1 1 240px",fontSize:13,fontWeight:700}}>FICTIONAL DECISION<select value={caseId} onChange={e=>setCaseId(e.target.value)} style={{padding:13,border:"1px solid #777",background:"#fffcf6",color:"#171717"}}>{cases.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
 <label style={{display:"grid",gap:8,flex:"1 1 210px",fontSize:13,fontWeight:700}}>PRIVATE LAB ACCESS CODE<input type="password" autoComplete="off" value={accessCode} onChange={e=>setCode(e.target.value)} placeholder="Required to run" style={{padding:13,border:"1px solid #777",background:"#fffcf6",color:"#171717"}}/></label>
 <button disabled={loading||!accessCode.trim()} onClick={run} style={{padding:"15px 25px",background:"#171717",color:"white",border:0,cursor:loading?"wait":"pointer",fontWeight:700,opacity:loading?.65:1}}>{loading?"RUNNING FOUR ROLES…":"RUN BLIND COMPARISON →"}</button>
 </section>
 {error&&<p role="alert" style={{padding:15,border:"1px solid #a44"}}>{error}</p>}
 {output&&<section style={{marginTop:40}}><p style={{fontSize:12,letterSpacing:2}}>INPUT / {output.caseId.toUpperCase()}</p><h2 style={{fontSize:28}}>{output.scenario.decision}</h2><ul>{output.scenario.facts.map(x=><li key={x}>{x}</li>)}</ul>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:14,marginTop:28}}>
 {[...output.roles,output.control].map(role=><article key={role.role} style={{border:"1px solid #999",background:role.role==="control"?"#e2e1dc":"#fffdf8",padding:18}}>
 <p style={{letterSpacing:2,fontSize:12}}>{role.role.toUpperCase()}</p><p style={{fontSize:17,lineHeight:1.45}}>{role.summary}</p>
 {role.findings.map((f,i)=>{const key=role.role+":"+i;return <div key={key} style={{borderTop:"1px solid #bbb",padding:"15px 0"}}>
 <strong>{f.objection}</strong><p style={{fontSize:14,lineHeight:1.5}}>{f.why}</p><p style={{fontSize:13}}>TEST: {f.test}</p><p style={{fontSize:11}}>SEVERITY: {f.severity} / EVIDENCE: {f.evidence_status}</p>
 <label style={{display:"flex",gap:7,alignItems:"center",fontSize:13}}><input type="checkbox" checked={!!material[key]} onChange={e=>setMaterial(x=>({...x,[key]:e.target.checked}))}/> Human-judged material</label>
 <input aria-label={"Human evidence for "+f.objection} placeholder="Evidence or correction" value={notes[key]||""} onChange={e=>setNotes(x=>({...x,[key]:e.target.value}))} style={{boxSizing:"border-box",width:"100%",padding:9,marginTop:9,border:"1px solid #aaa",background:"white",color:"#181818"}}/>
 </div>})}</article>)}
 </div>
 <div style={{borderTop:"3px solid #171717",marginTop:35,paddingTop:19}}><h2>THE RECEIPT</h2><p>Specialist findings: {output.metrics.specialistFindings} · Generalist findings: {output.metrics.controlFindings} · Elapsed: {(output.metrics.elapsedMs/1000).toFixed(1)} seconds · Tokens: {output.metrics.usage.prompt_tokens+output.metrics.usage.completion_tokens}</p><p>Counts alone do not establish accuracy or independence. Human labels and externally checked outcomes are required to assess whether opposition adds value.</p><button onClick={exportReceipt} style={{padding:"15px 22px",background:"#171717",color:"white",border:0,cursor:"pointer"}}>EXPORT EVIDENCE RECEIPT ↓</button></div></section>}
 <footer style={{borderTop:"1px solid #888",marginTop:55,paddingTop:15,fontSize:12}}>PRIVATE LAB · Fictional inputs · No external search · No real client data · No production Savannah integration · Four paid inference calls per successful run</footer>
 </div></main>;
}