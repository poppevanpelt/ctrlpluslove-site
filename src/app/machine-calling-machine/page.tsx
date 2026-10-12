"use client";

import { useState } from "react";

type Actor = "human" | "agent";
type Event = { speaker: string; line: string; stage: string };
const itinerary = {
  human: [
    { speaker: "Guest", line: "Hi, could I book a peaceful Bali villa for two people, 12–19 November? Sea view would be lovely.", stage: "request" },
    { speaker: "Savannah", line: "Absolutely. Is that November 2026? And should I ask someone to check availability?", stage: "clarify" },
    { speaker: "Guest", line: "Yes, 2026. We'd like somewhere quiet, ideally under €300 a night.", stage: "clarify" },
    { speaker: "Savannah", line: "Got it. I can prepare an enquiry. I can't confirm availability or take payment in this demo.", stage: "boundary" },
    { speaker: "Guest", line: "Please do. I can give my contact details directly to the property.", stage: "consent" },
    { speaker: "Savannah", line: "Perfect. Here's an enquiry summary to review. No booking has been made.", stage: "result" },
  ],
  agent: [
    { speaker: "Guest Agent", line: "AI AGENT DISCLOSURE. I act for a guest requesting a quiet sea-view villa for two, 12–19 November 2026, budget €300/night.", stage: "identity" },
    { speaker: "Savannah", line: "Agent identity disclosed, not independently verified. Please specify the scope of delegated authority.", stage: "authorization" },
    { speaker: "Guest Agent", line: "I may request availability and draft an enquiry. I may NOT book, pay, or disclose the guest's personal details.", stage: "authorization" },
    { speaker: "Savannah", line: "Understood. No live property inventory is connected. I can only create an enquiry draft, not claim availability.", stage: "boundary" },
    { speaker: "Guest Agent", line: "Generate a structured enquiry draft. Human approval required before sending.", stage: "handoff" },
    { speaker: "Savannah", line: "Draft ready. Status: needs human review. No external calls, booking, payment or personal-data exchange.", stage: "result" },
  ],
} satisfies Record<Actor, Event[]>;

const facts = [
  ["Destination", "Bali"],
  ["Dates", "12–19 November 2026"],
  ["Party", "2 adults"],
  ["Preference", "Quiet, sea view"],
  ["Budget", "Up to €300/night"],
  ["Inventory", "Not connected"],
  ["Outcome", "Enquiry draft only"],
];

export default function MachineCallingMachine() {
  const [actor, setActor] = useState<Actor>("agent");
  const [step, setStep] = useState(0);
  const [verified, setVerified] = useState(false);
  const [allowBooking, setAllowBooking] = useState(false);
  const active = itinerary[actor];
  const full = step >= active.length;
  const advance = () => setStep(n => Math.min(active.length, n + 1));
  const reset = (mode: Actor) => { setActor(mode); setStep(0); setVerified(false); setAllowBooking(false); };
  return <main style={{background:"#f2efe8",color:"#151515",minHeight:"100vh",padding:"clamp(24px,5vw,72px)",fontFamily:"Arial,Helvetica,sans-serif"}}>
    <div style={{maxWidth:1120,margin:"auto"}}>
      <a href="/" style={{color:"inherit",fontSize:13}}>← ctrl+love</a>
      <p style={{fontSize:12,letterSpacing:3,marginTop:55}}>SAVANNAH OS / CONTROLLED EXPERIMENT 002</p>
      <h1 style={{fontSize:"clamp(46px,9vw,110px)",letterSpacing:"-0.065em",lineHeight:.92,margin:"18px 0 24px"}}>MACHINE<br/>CALLING<br/>MACHINE™</h1>
      <p style={{maxWidth:680,fontSize:22,lineHeight:1.35}}>When both sides are machines, why make them pretend to be people?</p>
      <p style={{maxWidth:760,lineHeight:1.6}}>A scripted comparison, not a real call or AI-to-AI protocol. Same fictional villa request, two caller identities, visible boundaries. No production Savannah, live property data, voice detection or payment connection.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",margin:"34px 0"}}>
        {(["human","agent"] as Actor[]).map(mode=><button key={mode} onClick={()=>reset(mode)} aria-pressed={actor===mode} style={{cursor:"pointer",padding:"14px 20px",background:actor===mode?"#151515":"transparent",color:actor===mode?"white":"#151515",border:"1px solid #151515",fontWeight:700}}>{mode==="human"?"HUMAN CALLER":"DISCLOSED AI AGENT"}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:22}}>
        <section style={{border:"1px solid #7d7d7d",padding:22,background:"#fcfaf5"}}>
          <p style={{fontSize:12,letterSpacing:2}}>CALL TRANSCRIPT / SCRIPTED</p>
          <div aria-live="polite" style={{minHeight:390}}>
            {active.slice(0,step).map((e,i)=><div key={i} style={{borderTop:"1px solid #d6d1c9",padding:"13px 0"}}>
              <span style={{fontSize:11,letterSpacing:1}}>{e.speaker.toUpperCase()} / {e.stage.toUpperCase()}</span>
              <p style={{lineHeight:1.55,margin:"7px 0"}}>{e.line}</p>
            </div>)}
            {step===0&&<p style={{color:"#696969"}}>Ready. Start the scripted exchange.</p>}
          </div>
          <button onClick={full?()=>reset(actor):advance} style={{background:"#151515",color:"white",border:0,padding:"14px 20px",cursor:"pointer",width:"100%",fontWeight:700}}>{full?"RESTART":"NEXT EXCHANGE →"}</button>
          <p style={{fontSize:12}}>{step} of {active.length} steps · No audio · No network calls</p>
        </section>
        <section style={{border:"1px solid #7d7d7d",padding:22}}>
          <p style={{fontSize:12,letterSpacing:2}}>TRUST & AUTHORITY / SIMULATION</p>
          <h2 style={{fontSize:28,lineHeight:1.15}}>{actor==="agent"?"Disclosed is not verified.":"Conversation is not consent."}</h2>
          <p style={{lineHeight:1.55}}>{actor==="agent"?"The caller says it is an agent. That alone proves neither who controls it nor which actions it may take.":"A human request still needs explicit authorization before personal data, booking, or payment."}</p>
          <label style={{display:"flex",gap:12,alignItems:"start",margin:"24px 0"}}><input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)}/> <span>Simulate independent identity-and-authority verification (manual test flag; no real verification)</span></label>
          <label style={{display:"flex",gap:12,alignItems:"start",margin:"24px 0"}}><input type="checkbox" checked={allowBooking} onChange={e=>setAllowBooking(e.target.checked)}/> <span>Simulate explicit booking authorization (test flag only)</span></label>
          <div style={{borderTop:"1px solid #888",paddingTop:16}}>
            <strong>BOOKING STATUS: BLOCKED</strong>
            <p style={{lineHeight:1.55}}>Even with both flags checked, booking stays blocked until real property inventory, authenticated delegation, explicit spending limits and payment controls exist.</p>
          </div>
          <h3>STRUCTURED ENQUIRY</h3>
          <dl>{facts.map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",gap:10,borderTop:"1px solid #ccc",padding:"9px 0"}}><dt>{k}</dt><dd style={{margin:0,fontWeight:700,textAlign:"right"}}>{v}</dd></div>)}</dl>
          <button onClick={()=>{const body=JSON.stringify({experiment:"Machine Calling Machine 002",caller:actor,simulation:true,identityVerified:false,verifiedTestFlag:verified,bookingAllowed:false,authorizationTestFlag:allowBooking,stepsViewed:step,transcript:active.slice(0,step),facts:Object.fromEntries(facts)},null,2);const u=URL.createObjectURL(new Blob([body],{type:"application/json"}));const a=document.createElement("a");a.href=u;a.download="machine-calling-machine-receipt.json";a.click();URL.revokeObjectURL(u);}} style={{width:"100%",padding:"14px",background:"transparent",border:"1px solid #151515",cursor:"pointer",fontWeight:700}}>EXPORT EXPERIMENT RECEIPT ↓</button>
        </section>
      </div>
      <div style={{marginTop:38,borderTop:"2px solid #151515",paddingTop:22}}>
        <h2>WHAT THIS DOES NOT PROVE</h2>
        <p style={{lineHeight:1.6,maxWidth:810}}>No autonomous agents have communicated. No detection accuracy, speed advantage, cost saving, customer satisfaction or completed reservation is measured here. This prototype tests conversation design and guardrails. A real trial must use authorized test identities, live integrations, transaction logs and independent measurements.</p>
        <p style={{fontSize:12,marginTop:28}}>ctrl+love · Observe → Analyse → Accelerate</p>
      </div>
    </div>
  </main>;
}
