"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./decision-receipt.module.css";

type Inputs = {
  decision: string; move: string; control: string; owner: string;
  evidence: string; assumption: string; falsifier: string; test: string;
  delay: string; downside: string; weeks: string; confidence: number; reversibility: number;
};
const blank: Inputs = {
  decision:"", move:"", control:"", owner:"", evidence:"", assumption:"", falsifier:"", test:"",
  delay:"", downside:"", weeks:"4", confidence:3, reversibility:3,
};
const example: Inputs = {
  decision:"Should we replace the weekly leadership meeting with an asynchronous decision log?",
  move:"Run a four-week pilot with one team and a shared decision log.",
  control:"Keep the 90-minute weekly meeting for another quarter.",
  owner:"The team lead",
  evidence:"Last six meetings generated two decisions; 9 people attended each one.",
  assumption:"The team will make decisions without needing everyone in the room.",
  falsifier:"A decision gets blocked for more than 48 hours, or two people report losing essential context.",
  test:"Try the decision log with one team for four weeks; measure time spent and decision latency.",
  delay:"450", downside:"1800", weeks:"4", confidence:3, reversibility:5,
};
const money = (n:number) => new Intl.NumberFormat("en-NL",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
const amount = (v:string) => Math.max(0,Math.min(1_000_000_000,Number(v)||0));
const clean = (v:string, fallback:string) => v.trim() || fallback;
function analyze(v:Inputs) {
  const weekly=amount(v.delay), downside=amount(v.downside), weeks=Math.max(1,Math.min(52,Number(v.weeks)||4));
  const delayExposure=weekly*weeks;
  const missing=[!v.evidence.trim()?"evidence":null,!v.falsifier.trim()?"a falsification condition":null,!v.test.trim()?"a cheap test":null].filter(Boolean) as string[];
  const hasNumbers=weekly>0 && downside>0;
  const reversible=v.reversibility>=4;
  let verdict="TEST BEFORE COMMITTING";
  let explanation="The next move is to buy evidence, not certainty.";
  if(!v.decision.trim() || !v.move.trim()) {
    verdict="NOT YET A DECISION";
    explanation="Name the choice and the proposed move before issuing a verdict.";
  } else if(!v.evidence.trim() || !v.falsifier.trim() || v.confidence<=2) {
    verdict="TEST BEFORE COMMITTING";
    explanation="The claim has insufficient support or no clear way to be disproved.";
  } else if(hasNumbers && delayExposure < downside/3 && v.reversibility<=2) {
    verdict="HOLD / TEST SMALLER";
    explanation="Based on your estimates, waiting is cheaper than a hard-to-reverse mistake.";
  } else if(reversible && (v.confidence>=3 || (hasNumbers && delayExposure>=downside))) {
    verdict="MOVE, WITH A STOP RULE";
    explanation="The move appears reversible enough to learn in the real world. Keep the exit visible.";
  } else if(v.confidence>=4 && v.reversibility>=3) {
    verdict="MOVE, WITH A STOP RULE";
    explanation="The stated evidence supports a controlled move, not a permanent commitment.";
  }
  const status=missing.length?"OPEN / UNVERIFIED":"DOCUMENTED / NOT VERIFIED";
  return {weekly,downside,weeks,delayExposure,missing,verdict,explanation,status,hasNumbers};
}
function receiptText(v:Inputs, result:ReturnType<typeof analyze>, stamp:string, id:string) {
  return [
    "ctrl+love / DECISION RECEIPT™","--------------------------------",
    "ISSUED  "+stamp,"REF     "+id,
    "","THE DECISION",clean(v.decision,"[Decision not entered]"),
    "","PROPOSED MOVE",clean(v.move,"[Move not entered]"),
    "","DO-NOTHING CONTROL",clean(v.control,"[Status quo not entered]"),
    "","EVIDENCE (SUPPLIED, NOT VERIFIED)",clean(v.evidence,"[No evidence entered]"),
    "","THE ASSUMPTION",clean(v.assumption,"[Not entered]"),
    "","WHAT WOULD PROVE US WRONG?",clean(v.falsifier,"[Not entered]"),
    "","SMALLEST USEFUL TEST",clean(v.test,"[Not entered]"),
    "","COST OF WAITING / WEEK",money(result.weekly),
    "COST OVER "+result.weeks+" WEEKS",money(result.delayExposure),
    "DOWNSIDE IF WRONG",money(result.downside),
    "CONFIDENCE (SELF-RATED)",v.confidence+"/5",
    "REVERSIBILITY (SELF-RATED)",v.reversibility+"/5",
    "","VERDICT",result.verdict,
    result.explanation,
    "","EVIDENCE STATUS",result.status,
    ...(result.missing.length?["MISSING: "+result.missing.join(", ")]:[]),
    "","DECISION OWNER",clean(v.owner,"[Unassigned]"),
    "","--------------------------------",
    "This receipt is not proof you were right.",
    "It is a record of what you believed.",
    "ctrlpluslove.com/decision-receipt",
  ].join("\n");
}
function makeId() { return Math.random().toString(36).slice(2,8).toUpperCase(); }

export default function DecisionReceipt() {
  const [values,setValues]=useState<Inputs>(blank);
  const [issued,setIssued]=useState(false);
  const [stamp,setStamp]=useState("");
  const [receiptId,setReceiptId]=useState("");
  const [feedback,setFeedback]=useState("");
  const result=useMemo(()=>analyze(values),[values]);
  const set=<K extends keyof Inputs>(key:K,value:Inputs[K])=>{
    setValues(old=>({...old,[key]:value}));setIssued(false);setFeedback("");
  };
  const issue=()=>{
    if(!values.decision.trim() || !values.move.trim()){
      setFeedback("A receipt needs a decision and a proposed move.");
      document.getElementById("decision-field")?.focus();
      return;
    }
    setStamp(new Date().toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"}));
    setReceiptId(makeId());setIssued(true);setFeedback("");
    window.setTimeout(()=>document.getElementById("printed-receipt")?.scrollIntoView({behavior:"smooth",block:"start"}),70);
  };
  const text=receiptText(values,result,stamp,receiptId);
  const copy=async()=>{
    try { await navigator.clipboard.writeText(text);setFeedback("Receipt copied. Forward the doubt."); }
    catch { setFeedback("Clipboard unavailable here. Use Print / Save PDF instead."); }
  };
  const download=()=>{
    const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="ctrl-love-decision-"+receiptId.toLowerCase()+".txt";
    document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const reset=()=>{setValues(blank);setIssued(false);setFeedback("");window.scrollTo({top:0,behavior:"smooth"});};
  const loadExample=()=>{setValues(example);setIssued(false);setFeedback("");};
  return <main className={styles.page} id="main-content">
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>ctrl<span>+</span>love</Link>
      <span className={styles.headerCenter}>INSTRUMENT / 001</span>
      <Link href="/instruments/" className={styles.headerLink}>THE INSTRUMENT ROOM ↗</Link>
    </header>
    <section className={styles.intro}>
      <div className={styles.introText}>
        <div className={styles.eyebrow}><span className={styles.redDot}/> AN INSTRUMENT FOR HUMAN JUDGMENT</div>
        <h1>THE DECISION<br/><em>RECEIPT.</em></h1>
        <p>Every decision has a price. Most never get a receipt.</p>
        <div className={styles.introFoot}><span>NO ACCOUNT. NO MEETING. NO MAGIC.</span><span>ISSUE № 001</span></div>
      </div>
      <div className={styles.art} aria-hidden="true">
        <div className={styles.printer}>
          <div className={styles.printerSlot}/>
          <div className={styles.paperTease}>
            <span>CTRL+LOVE</span><i>DECISION / RECEIPT</i><b>?</b><span>KEEP THE DOUBT.</span>
          </div>
          <div className={styles.printerBody}><span>CTRL+LOVE / UNIT 001</span><span className={styles.light}/></div>
        </div>
        <div className={styles.artCaption}>THE MACHINE DOESN&apos;T DECIDE. YOU DO.</div>
      </div>
    </section>
    <section className={styles.workspace} id="run">
      <div className={styles.sectionTop}><span>01 / INPUT</span><span>THE MACHINE NEEDS YOUR JUDGMENT</span></div>
      <div className={styles.workGrid}>
        <div className={styles.formColumn}>
          <div className={styles.formIntro}>
            <h2>Put something<br/>on the line.</h2>
            <p>Bring a real decision. Not a mission statement.</p>
            <button className={styles.example} type="button" onClick={loadExample}>TRY A REALISTIC EXAMPLE ↗</button>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="decision-field"><span>01</span> What are we actually deciding? <b>*</b></label>
            <textarea id="decision-field" rows={3} maxLength={350} value={values.decision} onChange={e=>set("decision",e.target.value)} placeholder="Should we…?"/>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="move-field"><span>02</span> The proposed move <b>*</b></label>
            <textarea id="move-field" rows={2} maxLength={350} value={values.move} onChange={e=>set("move",e.target.value)} placeholder="What would we actually do?"/>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="control-field"><span>03</span> The do-nothing control</label>
            <textarea id="control-field" rows={2} maxLength={350} value={values.control} onChange={e=>set("control",e.target.value)} placeholder="What happens if we change absolutely nothing?"/>
          </div>
          <div className={styles.ruleTitle}><span>02 / PRESSURE</span><span>BE SPECIFIC OR BE SUSPICIOUS</span></div>
          <div className={styles.fieldGroup}>
            <label htmlFor="evidence-field"><span>04</span> Evidence, not enthusiasm</label>
            <textarea id="evidence-field" rows={2} maxLength={500} value={values.evidence} onChange={e=>set("evidence",e.target.value)} placeholder="What have we actually observed?"/>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="assumption-field"><span>05</span> The assumption doing the heavy lifting</label>
            <textarea id="assumption-field" rows={2} maxLength={350} value={values.assumption} onChange={e=>set("assumption",e.target.value)} placeholder="This only works if…"/>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="falsifier-field"><span>06</span> What would prove us wrong?</label>
            <textarea id="falsifier-field" rows={2} maxLength={350} value={values.falsifier} onChange={e=>set("falsifier",e.target.value)} placeholder="An observable signal. Not a feeling."/>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="test-field"><span>07</span> The smallest useful test</label>
            <textarea id="test-field" rows={2} maxLength={350} value={values.test} onChange={e=>set("test",e.target.value)} placeholder="What could we learn without betting the company?"/>
          </div>
          <div className={styles.ruleTitle}><span>03 / EXPOSURE</span><span>YOUR ESTIMATES, NOT FACTS</span></div>
          <div className={styles.numbers}>
            <div className={styles.fieldGroup}><label htmlFor="delay-field">Cost of waiting / week (€)</label><input id="delay-field" type="number" min="0" max="1000000000" inputMode="decimal" value={values.delay} onChange={e=>set("delay",e.target.value)} placeholder="0"/></div>
            <div className={styles.fieldGroup}><label htmlFor="downside-field">Cost if wrong (€)</label><input id="downside-field" type="number" min="0" max="1000000000" inputMode="decimal" value={values.downside} onChange={e=>set("downside",e.target.value)} placeholder="0"/></div>
            <div className={styles.fieldGroup}><label htmlFor="weeks-field">Decision horizon / weeks</label><input id="weeks-field" type="number" min="1" max="52" value={values.weeks} onChange={e=>set("weeks",e.target.value)}/></div>
          </div>
          <div className={styles.rangeGroup}><div><label htmlFor="confidence-field">Evidence confidence <strong>{values.confidence}/5</strong></label><small>Guessing <span>→</span> Documented</small></div><input id="confidence-field" type="range" min="1" max="5" step="1" value={values.confidence} onChange={e=>set("confidence",Number(e.target.value))}/></div>
          <div className={styles.rangeGroup}><div><label htmlFor="reversibility-field">How reversible is this? <strong>{values.reversibility}/5</strong></label><small>One-way door <span>→</span> Easy undo</small></div><input id="reversibility-field" type="range" min="1" max="5" step="1" value={values.reversibility} onChange={e=>set("reversibility",Number(e.target.value))}/></div>
          <div className={styles.fieldGroup}><label htmlFor="owner-field">Who owns the decision?</label><input id="owner-field" value={values.owner} maxLength={100} onChange={e=>set("owner",e.target.value)} placeholder="A human name or role"/></div>
          <button className={styles.issue} type="button" onClick={issue}>ISSUE THE RECEIPT <span>↗</span></button>
          <p className={styles.privacy}>No login. Inputs stay in this browser and aren&apos;t submitted to our server. Nothing is saved automatically.</p>
          <button className={styles.reset} type="button" onClick={reset}>CLEAR THE COUNTER ↺</button>
          {feedback && <p className={styles.feedback} role="status">{feedback}</p>}
        </div>
        <aside className={styles.previewColumn}>
          <div className={styles.previewHeading}><span>LIVE / COUNTER</span><span className={styles.counterLight}>● READY TO PRINT</span></div>
          <div className={styles.receipt} id="printed-receipt">
            <div className={styles.receiptTop}><span>ctrl+love</span><span>DECISION SYSTEMS</span></div>
            <div className={styles.receiptMeta}><span>RECEIPT № {issued?receiptId:"······"}</span><span>{issued?stamp:"AWAITING DECISION"}</span></div>
            <div className={styles.receiptDivider}>-----------------------------------</div>
            <div className={styles.receiptLabel}>THE DECISION</div>
            <div className={styles.receiptDecision}>{clean(values.decision,"A decision has not yet been entered.")}</div>
            <div className={styles.receiptLabel}>THE PROPOSED MOVE</div>
            <div className={styles.receiptBody}>{clean(values.move,"—")}</div>
            <div className={styles.receiptLabel}>DO-NOTHING CONTROL</div>
            <div className={styles.receiptBody}>{clean(values.control,"Not considered yet.")}</div>
            <div className={styles.receiptDivider}>-----------------------------------</div>
            <div className={styles.receiptLine}><span>WAITING / WEEK</span><b>{money(result.weekly)}</b></div>
            <div className={styles.receiptLine}><span>WAITING / {result.weeks} WEEKS</span><b>{money(result.delayExposure)}</b></div>
            <div className={styles.receiptLine}><span>IF WE&apos;RE WRONG</span><b>{money(result.downside)}</b></div>
            <div className={styles.receiptLine}><span>CONFIDENCE</span><b>{values.confidence}/5</b></div>
            <div className={styles.receiptLine}><span>REVERSIBILITY</span><b>{values.reversibility}/5</b></div>
            <div className={styles.receiptDivider}>-----------------------------------</div>
            <div className={styles.receiptLabel}>THE OPPOSITION SEAT</div>
            <div className={styles.receiptBody}>This fails if: {clean(values.assumption,"we have mistaken conviction for evidence.")}</div>
            <div className={styles.receiptLabel}>WHAT WOULD CHANGE OUR MIND</div>
            <div className={styles.receiptBody}>{clean(values.falsifier,"No falsifier supplied. That's a warning.")}</div>
            <div className={styles.receiptLabel}>SMALLEST USEFUL TEST</div>
            <div className={styles.receiptBody}>{clean(values.test,"Not specified.")}</div>
            <div className={styles.receiptDivider}>-----------------------------------</div>
            <div className={styles.receiptLabel}>RECEIPT VERDICT / RULE-BASED</div>
            <div className={styles.verdict}>{result.verdict}</div>
            <p className={styles.explanation}>{result.explanation}</p>
            <div className={styles.receiptLabel}>EVIDENCE STATUS</div>
            <div className={styles.receiptBody}>{result.status}</div>
            {result.missing.length>0 && <div className={styles.missing}>OPEN: {result.missing.join(" / ")}</div>}
            <div className={styles.receiptLabel}>OWNER</div>
            <div className={styles.receiptBody}>{clean(values.owner,"UNASSIGNED")}</div>
            <div className={styles.receiptDivider}>-----------------------------------</div>
            <div className={styles.barcode} aria-hidden="true"/>
            <div className={styles.receiptEnd}>THIS RECEIPT IS NOT PROOF<br/>YOU WERE RIGHT.<br/><br/>IT IS A RECORD OF<br/>WHAT YOU BELIEVED.</div>
            <div className={styles.receiptUrl}>CTRLPLUSLOVE.COM / DECISION-RECEIPT</div>
          </div>
          {issued ? <div className={styles.actions}><button type="button" onClick={()=>window.print()}>PRINT / SAVE PDF ↗</button><button type="button" onClick={copy}>COPY RECEIPT ↗</button><button type="button" onClick={download}>DOWNLOAD .TXT ↗</button></div> : <p className={styles.previewNote}>LIVE PREVIEW. ENTER A DECISION AND ISSUE IT TO PRINT OR SHARE.</p>}
          <div className={styles.disclaimer}><b>READ THE FINE PRINT.</b><p>This is a transparent rule-based prompt for better judgment, not an AI fact-checker, financial forecast or verified recommendation. Numbers and evidence are supplied by you. A receipt records the argument; it doesn&apos;t validate it.</p></div>
        </aside>
      </div>
    </section>
    <footer className={styles.footer}><span>CTRL+LOVE © 2026</span><span>WE BUILD INSTRUMENTS FOR HUMAN JUDGMENT.</span><Link href="/">BACK TO REALITY ↗</Link></footer>
  </main>;
}
