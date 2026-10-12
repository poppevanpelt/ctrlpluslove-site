"use client";

import { useMemo, useState } from "react";

type Verdict = "automate" | "redesign" | "protect";
const sample = [
  "MON 09:00 | Copied meeting notes into the project tracker",
  "MON 11:15 | Chased approval for the same client deck",
  "TUE 09:00 | Copied meeting notes into the project tracker",
  "TUE 15:10 | Rebuilt status report from three spreadsheets",
  "WED 10:00 | Chased approval for the same client deck",
  "WED 11:00 | Copied meeting notes into the project tracker",
  "THU 08:50 | Rebuilt status report from three spreadsheets",
  "THU 14:00 | Chased approval for the same client deck",
  "FRI 10:00 | Copied meeting notes into the project tracker",
].join("\n");
function normalize(line: string) {
  return line.trim().replace(/^(?:mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+\d{1,2}:\d{2}\s*\|\s*/i, "").trim();
}
export default function FrictionMiner() {
  const [input, setInput] = useState(sample);
  const [decisions, setDecisions] = useState<Record<string, Verdict>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const candidates = useMemo(() => {
    const m = new Map<string, { label: string; evidence: string[] }>();
    for (const line of input.split(/\r?\n/)) {
      const cleaned = normalize(line);
      if (!cleaned) continue;
      const key = cleaned.toLocaleLowerCase("en");
      const current = m.get(key) ?? { label: cleaned, evidence: [] };
      current.evidence.push(line.trim());
      m.set(key, current);
    }
    return [...m.entries()].filter(([, item]) => item.evidence.length > 1)
      .sort((a, b) => b[1].evidence.length - a[1].evidence.length)
      .slice(0, 5);
  }, [input]);
  return <main style={{minHeight:"100vh",background:"#f2eee6",color:"#181818",padding:"clamp(24px,5vw,80px)",fontFamily:"Arial, sans-serif"}}>
    <div style={{maxWidth:1000,margin:"0 auto"}}>
      <a href="/" style={{color:"inherit",fontSize:13}}>← ctrl+love</a>
      <p style={{marginTop:56,fontSize:12,letterSpacing:3}}>OBSERVE / ANALYSE / ACCELERATE · PILOT 001</p>
      <h1 style={{fontSize:"clamp(52px,10vw,112px)",lineHeight:.94,letterSpacing:-5,margin:"20px 0"}}>FRICTION<br/>MINER™</h1>
      <p style={{fontSize:22,maxWidth:640,lineHeight:1.35}}>The work nobody questions anymore.</p>
      <p style={{maxWidth:680,lineHeight:1.55}}>Paste anonymized activity notes, one event per line. The pilot groups <strong>exactly repeated descriptions</strong>, shows their original evidence and asks a human what to do. It does not read your email, connect to accounts, or send your notes to a server.</p>
      <label htmlFor="events" style={{display:"block",fontWeight:700,marginTop:32,marginBottom:10}}>ACTIVITY RECORDS</label>
      <textarea id="events" value={input} onChange={e=>setInput(e.target.value)} spellCheck={false} style={{width:"100%",minHeight:260,boxSizing:"border-box",background:"#fffdf8",color:"#181818",border:"1px solid #999",borderRadius:4,padding:18,fontSize:15,lineHeight:1.7}}/>
      <p style={{fontSize:13}}>Try the fictional example, or replace it with anonymized records. Never paste secrets or personal data. Dates can precede descriptions as “MON 09:00 | Task”.</p>
      <div style={{borderTop:"2px solid #181818",marginTop:44,paddingTop:16,display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <h2 style={{fontSize:30,margin:0}}>REPEATED FRICTION</h2><span>{candidates.length} candidates</span>
      </div>
      {candidates.length===0 && <p>No exact repeats detected. Different wording for the same activity will not be grouped in this first pilot.</p>}
      {candidates.map(([key, item], i) => <section key={key} style={{padding:"28px 0",borderBottom:"1px solid #aaa"}}>
        <div style={{fontSize:12,letterSpacing:2}}>CANDIDATE {String(i+1).padStart(2,"0")} / {item.evidence.length} OCCURRENCES</div>
        <h3 style={{fontSize:24,margin:"12px 0"}}>{item.label}</h3>
        <details><summary style={{cursor:"pointer"}}>View source evidence</summary><ol>{item.evidence.map((line,j)=><li key={j} style={{padding:5,overflowWrap:"anywhere"}}>{line}</li>)}</ol></details>
        <p style={{fontSize:13}}>Human judgment required. Repetition alone is not proof of waste.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
          {(["automate","redesign","protect"] as Verdict[]).map(v=><button type="button" key={v} onClick={()=>setDecisions(d=>({...d,[key]:v}))} aria-pressed={decisions[key]===v} style={{padding:"12px 16px",cursor:"pointer",border:"1px solid #181818",background:decisions[key]===v?"#181818":"transparent",color:decisions[key]===v?"white":"#181818",textTransform:"uppercase",letterSpacing:1}}>{v==="protect"?"Leave it alone":v}</button>)}
        </div>
        <input aria-label={"Reason for "+item.label} placeholder="Why? What evidence would change your mind?" value={notes[key]??""} onChange={e=>setNotes(n=>({...n,[key]:e.target.value}))} style={{boxSizing:"border-box",width:"100%",marginTop:12,padding:12,border:"1px solid #aaa",background:"#fffdf8",color:"#181818"}}/>
      </section>)}
      <button type="button" onClick={()=>{
        const report=candidates.map(([key,item])=>({activity:item.label,occurrences:item.evidence.length,evidence:item.evidence,verdict:decisions[key]??"unreviewed",reason:notes[key]??""}));
        const blob=new Blob([JSON.stringify({instrument:"FRICTION MINER pilot",method:"exact normalized repeats, client-side only",report},null,2)],{type:"application/json"});
        const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="friction-miner-review.json";a.click();URL.revokeObjectURL(url);
      }} style={{marginTop:30,padding:"16px 22px",fontWeight:700,cursor:"pointer",background:"#181818",color:"#fff",border:0}}>EXPORT EVIDENCE + VERDICTS ↓</button>
      <footer style={{marginTop:65,paddingTop:20,borderTop:"1px solid #aaa",fontSize:12}}>Pilot only · Exact-match detection · No AI inference · No account integration · No production Savannah changes</footer>
    </div>
  </main>;
}
