"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./conviction.module.css";
import LearningLab from "./LearningLab";

type Intent = "decide" | "persuade" | "account" | "inspire" | "explain" | "custom";
const INTENTS: Record<Intent,{name:string;test:string;signals:RegExp}> = {
 decide:{name:"Get a decision",test:"Is there a clear choice and a consequence?",signals:/\\b(choose|decide|approve|reject|stop|instead|option|risk|owner)\\b/gi},
 persuade:{name:"Change a mind",test:"Is the claim backed by a reason someone could challenge?",signals:/\\b(because|proof|evidence|why|instead|therefore|example|tested|compared)\\b/gi},
 account:{name:"Own the results",test:"What happened, what missed, and what will change?",signals:/\\b(missed|below|above|target|versus|because|responsible|fix|by|result)\\b/gi},
 inspire:{name:"Move an audience",test:"Is there a memorable, concrete human stake?",signals:/\\b(you|we|imagine|today|remember|never|stand|together|refuse)\\b/gi},
 explain:{name:"Make it understandable",test:"Can someone follow the reason and the consequence?",signals:/\\b(means|because|for example|therefore|if|then|first|next|result)\\b/gi},
 custom:{name:"Something else",test:"Does the text deliver the outcome you described?",signals:/\\b(because|will|if|then|for example|evidence|choose|decide)\\b/gi}
};
type HistoryItem = { id: number; time: string; score: number; text: string; note: string };
type Observation = { label: string; detail: string; count: number; kind: "risk" | "good" };
const HEDGES = /\b(may|might|could|perhaps|potentially|possibly|explore|consider|opportunity|alignment|somewhat|hopefully|aim to|seek to|we believe|subject to|in due course|going forward|leverage|synergies)\b/gi;
const ACTIONS = /\b(will|must|commit|decide|decided|stop|abandon|launch|ship|test|remove|deliver|publish|reject|choose|by (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)|before \w+|owner|responsible|deadline)\b/gi;
const EVIDENCE = /\b(because|evidence|measured|observed|tested|customers?|interviews?|sample|baseline|compared|data|results?|assumption|falsif(?:y|iable)|if .* then)\b/gi;
const EXAMPLES = {
  soft: "We believe there may be an opportunity to explore a more differentiated positioning, subject to further alignment. We could potentially consider testing some directions in due course.",
  strong: "We will stop using the existing proposition. Maya owns a test with 20 customers by November 15. We chose this because 14 of 20 interviews could not explain the current offer. If fewer than 12 people understand the new version, we will reject it.",
  retreat: "We will launch the new offer by November 15. Maya owns the rollout because the customer interviews show a clear need."
};
const count = (text: string, pattern: RegExp) => (text.match(pattern) || []).length;
const sentences = (text: string) => text.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean);
function evaluate(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const hedges = count(text,HEDGES), actions = count(text,ACTIONS), evidence = count(text,EVIDENCE);
  const dates = count(text,/\b(?:by|before|on)\s+(?:\w+\s+)?\d{1,2}(?:st|nd|rd|th)?\b|\b\d{4}-\d{2}-\d{2}\b|\b(?:by|before)\s+(?:monday|tuesday|wednesday|thursday|friday|november|december)\b/gi);
  const numbers = count(text,/\b\d+\b/g);
  const decision = actions > 0;
  const score = !words ? 0 : Math.max(0,Math.min(100,Math.round(35 + Math.min(actions,7)*8 + Math.min(evidence,5)*5 + Math.min(dates,2)*6 + Math.min(numbers,4)*2 - Math.min(hedges,10)*10 - (words > 35 && !decision ? 10 : 0))));
  const observations: Observation[] = [
    {label:"Hedging",detail:"Potential retreats and qualification language",count:hedges,kind:"risk"},
    {label:"Decisive language",detail:"Verbs that indicate an actual choice",count:actions,kind:"good"},
    {label:"Evidence cues",detail:"References to reasons, testing or observations",count:evidence,kind:"good"},
    {label:"Time anchors",detail:"Explicit deadlines or dates",count:dates,kind:"good"}
  ];
  return {score,hedges,actions,evidence,dates,words,observations};
}
function highlight(text: string) {
  const regex = new RegExp("(" + HEDGES.source + "|" + ACTIONS.source + "|" + EVIDENCE.source + ")","gi");
  return text.split(regex).map((part,i) => {
    if(new RegExp("^(?:" + HEDGES.source + ")$","i").test(part)) return <mark className={styles.hedge} key={i}>{part}</mark>;
    if(new RegExp("^(?:" + ACTIONS.source + ")$","i").test(part)) return <mark className={styles.action} key={i}>{part}</mark>;
    if(new RegExp("^(?:" + EVIDENCE.source + ")$","i").test(part)) return <mark className={styles.evidence} key={i}>{part}</mark>;
    return <span key={i}>{part}</span>;
  });
}
export default function ConvictionSensor() {
  const [draft,setDraft] = useState(EXAMPLES.soft);
  const [intent,setIntent] = useState<Intent>("decide");
  const [purpose,setPurpose] = useState("");
  const [history,setHistory] = useState<HistoryItem[]>([]);
  const [showHistory,setShowHistory] = useState(true);
  const nextId = useRef(1);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    try { const value = window.localStorage.getItem("ctrl-love-conviction-v1"); if(value){const saved=JSON.parse(value);if(typeof saved.draft==="string")setDraft(saved.draft);if(Array.isArray(saved.history))setHistory(saved.history.slice(-30));} } catch {}
    setReady(true);
  },[]);
  useEffect(() => {if(ready){try{window.localStorage.setItem("ctrl-love-conviction-v1",JSON.stringify({draft,history}));}catch{}}},[draft,history,ready]);
  const baseline = useMemo(() => evaluate(draft),[draft]);
  const intentCues = count(draft,INTENTS[intent].signals);
  const purposeTerms = purpose.toLowerCase().match(/\\b[a-z]{5,}\\b/g)?.filter(x=>!["should","would","could","therefore","people","something"].includes(x)).slice(0,12) || [];
  const goalHits = purposeTerms.filter(term=>draft.toLowerCase().includes(term)).length;
  const contextualScore = !baseline.words ? 0 : Math.max(0,Math.min(100,baseline.score + Math.min(intentCues,5)*3 + Math.min(goalHits,3)*2 - (intentCues===0?12:0)));
  const analysis = {...baseline,score:contextualScore};
  const last = history.length ? history[history.length-1] : null;
  const delta = last ? analysis.score-last.score : 0;
  const weakest = useMemo(()=>sentences(draft).map(s=>({text:s,score:evaluate(s).score + Math.min(count(s,INTENTS[intent].signals),3)*3})).sort((a,b)=>a.score-b.score)[0],[draft,intent]);
  function capture() {
    const score = analysis.score;
    const previous = history[history.length-1];
    if(previous?.text===draft) return;
    const shift = previous ? score-previous.score : 0;
    const note = !previous ? "First recorded draft" : shift < -5 ? "COURAGE LEAK: language became less committed" : shift > 5 ? "Conviction increased" : "Small or neutral change";
    setHistory(old=>[...old,{id:nextId.current++,time:new Date().toLocaleTimeString(),score,text:draft,note}].slice(-30));
  }
  function loadExample(which: keyof typeof EXAMPLES) { setDraft(EXAMPLES[which]); }
  function reset() {setHistory([]);setDraft("");try{window.localStorage.removeItem("ctrl-love-conviction-v1");}catch{}}
  function exportReceipt() {
    const report = ["THE CONVICTION SENSOR — EDITORIAL RECEIPT","ctrl+love · prototype, heuristic not fact","", "Context: "+INTENTS[intent].name+" | Intended outcome: "+purpose,"Contextual language score: "+analysis.score+"/100","Hedges: "+analysis.hedges+" | decisive cues: "+analysis.actions+" | evidence cues: "+analysis.evidence,"","EDIT HISTORY",...history.map(h=>h.time+" | "+h.score+"/100 | "+h.note),"","DOCUMENT",draft].join("\n");
    const blob=new Blob([report],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="conviction-receipt.txt";a.click();URL.revokeObjectURL(url);
  }
  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.brand}>ctrl<span>+</span>love</a><span className={styles.eyebrow}>THE DEPARTMENT OF EDITORIAL COURAGE · 001</span><span className={styles.live}><i/> LIVE / LOCAL</span></header>
    <section className={styles.intro}><div><p className={styles.kicker}>INSTRUMENT 001 / OBSERVE</p><h1>THE CONVICTION<br/><em>SENSOR™</em></h1><p className={styles.subtitle}>Find the sentence where a good idea started dying.</p></div><div className={styles.note}>This sensor measures <strong>language</strong>, not beliefs, integrity, or the quality of a decision. A confident mistake is still a mistake.</div></section>
    <section className={styles.context}>
      <div className={styles.panelhead}><span>00 / DEFINE THE ASSIGNMENT</span><span>CONTEXT BEFORE CONVICTION</span></div>
      <div className={styles.contextInner}>
        <label htmlFor="intent">WHAT MUST THIS DOCUMENT DO?</label>
        <select id="intent" value={intent} onChange={e=>setIntent(e.target.value as Intent)}>{(Object.keys(INTENTS) as Intent[]).map(k=><option key={k} value={k}>{INTENTS[k].name}</option>)}</select>
        <label htmlFor="purpose">WHAT WOULD SUCCESS LOOK LIKE? (YOUR WORDS)</label>
        <input id="purpose" value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder="e.g. Help the board decide whether to stop Project X" />
        <p><strong>THE TEST:</strong> {INTENTS[intent].test} <span>Signals are illustrative; this prototype cannot verify whether the intended outcome actually happened.</span></p>
      </div>
    </section>
    <section className={styles.workspace}>
      <div className={styles.editor}>
        <div className={styles.panelhead}><span>01 / LIVING DOCUMENT</span><span>{analysis.words} WORDS</span></div>
        <div className={styles.samples}><span>LOAD EXAMPLE ↗</span><button onClick={()=>loadExample("soft")}>Committee fog</button><button onClick={()=>loadExample("strong")}>Real commitment</button><button onClick={()=>loadExample("retreat")}>Before the retreat</button></div>
        <label htmlFor="editor" className={styles.sr}>Edit the working document</label><textarea id="editor" className={styles.textarea} spellCheck value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write something that matters. Or paste the paragraph that survived seventeen meetings."/>
        <div className={styles.panelhead}><span>LIVE LANGUAGE MARKUP</span><span className={styles.key}><b className={styles.redDot}/>HEDGE <b className={styles.greenDot}/>ACTION <b className={styles.blueDot}/>EVIDENCE</span></div>
        <div className={styles.preview}>{draft ? highlight(draft) : <span className={styles.muted}>Your highlighted language will appear here.</span>}</div>
        <div className={styles.controls}><button className={styles.primary} onClick={capture}>RECORD THIS VERSION ↗</button><button onClick={exportReceipt}>EXPORT RECEIPT ↓</button><button onClick={reset}>CLEAR</button></div>
      </div>
      <aside className={styles.sensor}>
        <div className={styles.panelhead}><span>02 / CONVICTION ANALYSIS</span><span className={styles.pulse}>● LIVE</span></div>
        <div className={styles.meterLabel}>CONTEXTUAL LANGUAGE SIGNAL / HEURISTIC</div><div className={styles.score}>{analysis.score}<small>/100</small></div>
        <div className={styles.track}><div style={{width:analysis.score+"%",background:analysis.score<40?"#e96b54":analysis.score<70?"#d8ab5d":"#9ebea5"}}/></div>
        <p className={styles.verdict}>{analysis.score<40?"A lot of language. Not much at stake.":analysis.score<70?"Some movement. Who is actually committing?":"The language takes a position. Now test whether it is right."}</p>
        <div className={styles.observations}>{analysis.observations.map(o=><div key={o.label} className={styles.observation}><span>{o.label}<small>{o.detail}</small></span><strong>{o.count}</strong></div>)}</div>
        <div className={styles.weak}><span className={styles.kicker}>SENTENCE UNDER SCRUTINY</span><p>{weakest?.text || "Nothing to examine yet."}</p><small>Lowest-scoring sentence in this draft. Heuristic only.</small></div>
        <div className={styles.change}><span className={styles.kicker}>SINCE LAST RECORDED VERSION</span><strong className={delta< -5?styles.warning:""}>{last?(delta>0?"+":"")+delta+" POINTS":"NO BASELINE YET"}</strong><p>{last?(delta< -5?"⚠ POSSIBLE COURAGE LEAK":delta>5?"More decisive language":"No significant language shift"):"Record a version, edit it, then compare."}</p></div>
      </aside>
    </section>
    <section className={styles.timeline}><button className={styles.timelineHead} onClick={()=>setShowHistory(!showHistory)}><span>03 / THE COURAGE LEAK™ · EDIT HISTORY</span><span>{history.length} SNAPSHOTS {showHistory?"−":"+"}</span></button>{showHistory&&<div className={styles.events}>{history.length===0?<p className={styles.muted}>Record two versions to reveal the first editorial retreat. Edits are never attributed to people.</p>:history.slice().reverse().map(h=><button key={h.id} className={styles.event} onClick={()=>setDraft(h.text)}><time>{h.time}</time><strong>{h.score}/100</strong><span>{h.note}</span><span>RESTORE ↗</span></button>)}</div>}</section>
    <LearningLab history={history} draft={draft} currentScore={analysis.score}/>
    <footer>ctrl+love · We build instruments for human judgement. <span>LOCAL BROWSER STORAGE · NO AI CALLS · NO UPLOADS</span></footer>
  </main>;
}
