"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./learning.module.css";

type Snapshot = { id: number; time: string; score: number; text: string; note: string };
type Judgment = "learning" | "dilution" | "unclear";
type Review = { key: string; judgment: Judgment; why: string; recordedAt: string };
type Props = { history: Snapshot[]; draft: string; currentScore: number };

const hedge = /\b(may|might|could|perhaps|potentially|possibly|explore|consider|opportunity|alignment|subject to|in due course|we believe)\b/gi;
const evidence = /\b(because|tested|measured|observed|evidence|data|interviews?|customers?|compared|baseline|results?|if|assumption)\b/gi;
const action = /\b(will|must|commit|decide|decided|stop|abandon|launch|ship|test|deliver|reject|choose|owner|deadline|by)\b/gi;
const count = (s: string, r: RegExp) => (s.match(r) || []).length;
const pieces = (s: string) => s.split(/(?<=[.!?])\s+|\n+/).map(x => x.trim()).filter(Boolean);
function difference(before: string, after: string) {
  const a = pieces(before), b = pieces(after);
  const added = b.filter(x => !a.includes(x));
  const removed = a.filter(x => !b.includes(x));
  const evidenceDelta = count(after,evidence)-count(before,evidence);
  const hedgeDelta = count(after,hedge)-count(before,hedge);
  const actionDelta = count(after,action)-count(before,action);
  const verdict = evidenceDelta>0 && hedgeDelta<=0 ? "Possible substantive learning" : hedgeDelta>0 && actionDelta<0 && evidenceDelta<=0 ? "Possible dilution" : "Interpretation required";
  const alternative = verdict==="Possible dilution" ? "The revision might be a legitimate correction to overconfidence." : verdict==="Possible substantive learning" ? "Evidence-related words may have been added without real supporting evidence." : "A smaller change may improve accuracy, clarity or fairness without shifting these signals.";
  return {added,removed,evidenceDelta,hedgeDelta,actionDelta,verdict,alternative};
}
const labels: Record<Judgment,string>={learning:"Genuine learning",dilution:"Unnecessary dilution",unclear:"Not enough information"};

export default function LearningLab({history,draft,currentScore}: Props) {
  const [selected,setSelected]=useState<string>("latest");
  const [reviews,setReviews]=useState<Review[]>([]);
  const [reason,setReason]=useState("");
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{try {const raw=window.localStorage.getItem("ctrl-love-learning-reviews-v1"); if(raw){const data=JSON.parse(raw);if(Array.isArray(data))setReviews(data.filter(x=>x && typeof x.key==="string" && ["learning","dilution","unclear"].includes(x.judgment)).slice(-100));}}catch{}setLoaded(true);},[]);
  useEffect(()=>{if(loaded){try{window.localStorage.setItem("ctrl-love-learning-reviews-v1",JSON.stringify(reviews));}catch{}}},[reviews,loaded]);
  const pairs=useMemo(()=>history.map((h,i)=>({key:String(h.id),from:h,to:i+1<history.length?history[i+1]:{id:-1,text:draft,time:"Current working draft",score:currentScore}})).filter(pair=>pair.from.text!==pair.to.text),[history,draft,currentScore]);
  const pair = pairs.find(x=>x.key===selected) || pairs[pairs.length-1];
  const comparison = pair ? difference(pair.from.text,pair.to.text) : null;
  const reviewKey = pair?pair.from.text+"\u2192"+pair.to.text:"";
  const existing=reviews.find(x=>x.key===reviewKey);
  const totals = {learning:reviews.filter(r=>r.judgment==="learning").length,dilution:reviews.filter(r=>r.judgment==="dilution").length,unclear:reviews.filter(r=>r.judgment==="unclear").length};
  function review(judgment:Judgment) {
    if(!pair)return;
    setReviews(old=>[...old.filter(x=>x.key!==reviewKey),{key:reviewKey,judgment,why:reason.trim(),recordedAt:new Date().toISOString()}].slice(-100));
    setReason("");
  }
  return <section className={styles.lab} aria-label="Collective learning laboratory">
    <div className={styles.heading}><span>04 / THE LEARNING LOOP™</span><span>HUMAN JUDGMENT REQUIRED</span></div>
    <div className={styles.intro}><div><h2>Did we get smarter?<br/><em>Or just more agreeable?</em></h2><p>Compare revisions. Judge what actually improved. Build a memory of corrections instead of rewarding confidence for its own sake.</p></div><div className={styles.stats}><strong>{reviews.length}</strong><span>HUMAN-REVIEWED CHANGES<br/>ONLY ON THIS DEVICE</span></div></div>
    {pair && comparison ? <>
      <div className={styles.topline}><label htmlFor="revision">COMPARE REVISION</label><select id="revision" value={pair.key} onChange={e=>{setSelected(e.target.value);setReason("");}}>{pairs.map((p,i)=><option key={p.key} value={p.key}>Change {i+1}: {p.from.time} → {p.to.time}</option>)}</select></div>
      <div className={styles.columns}><div><span className={styles.mini}>REMOVED / REPLACED</span>{comparison.removed.length?comparison.removed.map((t,i)=><p key={i} className={styles.removed}>{t}</p>):<p className={styles.empty}>No complete sentences removed.</p>}</div><div><span className={styles.mini}>ADDED / REVISED</span>{comparison.added.length?comparison.added.map((t,i)=><p key={i} className={styles.added}>{t}</p>):<p className={styles.empty}>No new complete sentences added.</p>}</div></div>
      <div className={styles.reading}><div><span className={styles.mini}>SENSOR HYPOTHESIS — NOT A VERDICT</span><h3>{comparison.verdict}</h3><p>Evidence cues {comparison.evidenceDelta>=0?"+":""}{comparison.evidenceDelta} · Hedging {comparison.hedgeDelta>=0?"+":""}{comparison.hedgeDelta} · Action cues {comparison.actionDelta>=0?"+":""}{comparison.actionDelta}</p></div><div><span className={styles.mini}>THE OPPOSITION SEAT</span><p>{comparison.alternative}</p></div></div>
      <div className={styles.vote}><span className={styles.mini}>WHAT DID THIS REVISION ACTUALLY DO?</span><div className={styles.buttons}>{(["learning","dilution","unclear"] as Judgment[]).map(j=><button key={j} className={existing?.judgment===j?styles.chosen:""} onClick={()=>review(j)}>{labels[j]}{existing?.judgment===j?" ✓":""}</button>)}</div><label htmlFor="why" className={styles.mini}>WHY? (OPTIONAL — THE ANECDOTE MATTERS)</label><textarea id="why" placeholder="e.g. We removed a bold claim because our sample was only three customers." value={reason} onChange={e=>setReason(e.target.value)} rows={2}/><p className={styles.hint}>Select a judgment to save it locally. Add your reason first if you want it attached. {existing? "Recorded verdict: "+labels[existing.judgment]+(existing.why?" — "+existing.why:""):""}</p></div>
    </>:<div className={styles.emptyState}>Record one version, edit the text, and record another version. The learning loop will compare what actually changed.</div>}
    <div className={styles.bottom}><div><span className={styles.mini}>LOCAL LEARNING MEMORY</span><p>{totals.learning} improvements · {totals.dilution} dilutions · {totals.unclear} unresolved.</p></div><button onClick={()=>{setReviews([]);setReason("");}}>RESET HUMAN REVIEWS</button></div>
    <p className={styles.disclaimer}>This version learns in the modest sense of accumulating human-reviewed examples; it does not retrain a model, infer intent, share data between people or learn across documents. Cross-team learning requires explicit permission, access controls and validation.</p>
  </section>;
}
