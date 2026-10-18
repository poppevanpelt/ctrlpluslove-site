"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type Turn = { speaker: "Advocate" | "Opposition" | "Savannah"; text: string };
type Result = { scenario: string; turns: Turn[]; receipt: string; methodology: string };
const cases = [
  { name: "Savannah autonomy", text: "A company wants to let its AI receptionist speak independently with customers, but never make purchases, promises, bookings or external changes without human approval." },
  { name: "The expensive meeting", text: "A leadership team wants to host a two-day strategy workshop to decide whether to launch a product, despite having no external customer interviews." },
  { name: "The perfect campaign", text: "An advertising agency says a new campaign is guaranteed to improve sales because the entire internal team loves the concept." }
];
const shell: CSSProperties = { background: "#141411", color: "#f1eee6", minHeight: "100vh", padding: "min(8vw, 70px) max(18px, calc((100vw - 960px)/2)) 100px", fontFamily: "Arial, Helvetica, sans-serif", lineHeight: 1.5 };
const button: CSSProperties = { background: "#dcd6c7", color: "#151512", border: 0, borderRadius: 5, padding: "13px 18px", fontWeight: 700, cursor: "pointer", fontSize: 14 };
const panel: CSSProperties = { border: "1px solid #514e47", borderRadius: 9, padding: "22px", background: "#201f1b" };
export default function BotWhispererPage() {
  const [scenario, setScenario] = useState(cases[0].text);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function run() {
    if (pending) return;
    setPending(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/savannah/bot-whisperer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scenario }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The room failed.");
      setResult(data as Result);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not run the room."); }
    finally { setPending(false); }
  }
  function exportReceipt() {
    if (!result) return;
    const content = "THE BOT WHISPERER(TM) | LAB 001\n\nCASE\n" + result.scenario + "\n\nTRANSCRIPT\n" + result.turns.map(t => t.speaker.toUpperCase() + "\n" + t.text).join("\n\n") + "\n\nDECISION RECEIPT\n" + result.receipt + "\n\nMETHOD\n" + result.methodology;
    const url = URL.createObjectURL(new Blob([content], {type:"text/plain;charset=utf-8"}));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "bot-whisperer-decision-receipt.txt"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main id="main-content" style={shell}>
    <a href="/savannah" style={{ color: "#bcb5a8", textDecoration: "none", fontSize: 12 }}>← SAVANNAH OS</a>
    <p style={{ letterSpacing: 3, fontSize: 12, marginTop: 42, color: "#a5a092" }}>CTRL+LOVE / INSTRUMENT 001</p>
    <h1 style={{ fontSize: "clamp(42px, 9vw, 94px)", letterSpacing: "-.065em", lineHeight: .95, margin: "14px 0 22px" }}>THE BOT<br/>WHISPERER<span style={{color:"#ada89b"}}>™</span></h1>
    <p style={{ fontSize: "clamp(18px, 3vw, 25px)", maxWidth: 650, color: "#cbc4b7" }}>Three machines. One decision. No human interruption until the receipt.</p>
    <p style={{ fontSize: 13, color: "#aaa394", maxWidth: 700, marginBottom: 36 }}>Savannah chairs two differently instructed AI assistants. They challenge a fictional decision; she challenges them—and herself. Lab results are hypotheses, not verified facts.</p>
    <section style={panel} aria-label="Lab configuration">
      <label htmlFor="case" style={{ display: "block", fontSize: 12, letterSpacing: 2, marginBottom: 14 }}>THE DECISION UNDER EXAMINATION</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        {cases.map(c => <button key={c.name} onClick={() => {setScenario(c.text);setResult(null);}} style={{...button,background:scenario===c.text?"#dcd6c7":"#34322d",color:scenario===c.text?"#141411":"#eae5da",padding:"8px 11px",fontSize:12}}>{c.name}</button>)}
      </div>
      <textarea id="case" value={scenario} onChange={e=>setScenario(e.target.value.slice(0,1400))} maxLength={1400} rows={5} style={{width:"100%",boxSizing:"border-box",background:"#141411",color:"#f1eee6",border:"1px solid #625d54",borderRadius:5,padding:14,fontFamily:"inherit",fontSize:16,resize:"vertical"}}/>
      <p style={{fontSize:12,color:"#aaa394"}}>Fictional cases only. No client-confidential information. No purchases, outbound messages, account access or other external actions.</p>
      <button onClick={run} disabled={pending || scenario.trim().length < 20} style={{...button,opacity:pending || scenario.trim().length < 20 ? 0.5 : 1,marginTop:8}}>{pending?"THE ROOM IS DEBATING…":"CONVENE THE ROOM →"}</button>
      {pending && <p role="status" style={{fontSize:13,color:"#c4bbaa"}}>Four bounded model calls, one after another. Each participant has a different job.</p>}
      {error && <p role="alert" style={{color:"#ffb0a0"}}>{error}</p>}
    </section>
    {result && <section style={{marginTop:32}} aria-live="polite">
      <p style={{fontSize:12,letterSpacing:2,color:"#a5a092"}}>THE DISCUSSION / COMPLETE</p>
      <div style={{display:"grid",gap:12}}>
        {result.turns.map((t,i)=><article key={i} style={{...panel,borderLeft:"4px solid "+(t.speaker==="Savannah"?"#e76c49":t.speaker==="Opposition"?"#86a6c2":"#b4a68b")}}>
          <p style={{fontSize:12,letterSpacing:2,color:"#bcb6a8",margin:"0 0 9px"}}>{String(i+1).padStart(2,"0")} / {t.speaker.toUpperCase()}</p>
          <p style={{whiteSpace:"pre-wrap",margin:0,fontSize:16}}>{t.text}</p>
        </article>)}
      </div>
      <article style={{...panel,marginTop:24,background:"#e4ded1",color:"#1b1a17",borderColor:"#e4ded1"}}>
        <p style={{fontSize:12,letterSpacing:2,fontWeight:700}}>THE DECISION RECEIPT™</p>
        <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",font:"inherit",fontSize:16}}>{result.receipt}</pre>
        <button onClick={exportReceipt} style={{...button,background:"#1b1a17",color:"#f1eee6"}}>GET RECEIPT ↓</button>
      </article>
      <p style={{fontSize:12,color:"#aaa394"}}>{result.methodology}</p>
    </section>}
    <footer style={{borderTop:"1px solid #4b4840",marginTop:62,paddingTop:18,fontSize:12,color:"#aaa394"}}>CTRL+LOVE · WE BUILD INSTRUMENTS FOR HUMAN JUDGMENT.</footer>
  </main>;
}
