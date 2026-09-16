"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";

type RecordItem = { id:string; decision:string; evidence:string; assumptions:string; owner:string; nextMove:string; reality:string; status:"FILED"|"CONFIRMED"|"BENT"|"WRONG"; };
const KEY="ctrl-love-decision-memory-v1";

export default function DecisionMemory(){
  const [records,setRecords]=useState<RecordItem[]>([]);
  const [open,setOpen]=useState<string|null>(null);
  useEffect(()=>{try{setRecords(JSON.parse(localStorage.getItem(KEY)||"[]"));}catch{}},[]);
  const persist=(next:RecordItem[])=>{setRecords(next);localStorage.setItem(KEY,JSON.stringify(next));};
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);const item:RecordItem={id:crypto.randomUUID(),decision:String(f.get("decision")||""),evidence:String(f.get("evidence")||""),assumptions:String(f.get("assumptions")||""),owner:String(f.get("owner")||""),nextMove:String(f.get("nextMove")||""),reality:"",status:"FILED"};persist([item,...records]);e.currentTarget.reset();};
  const reality=(id:string,text:string,status:RecordItem["status"])=>persist(records.map(r=>r.id===id?{...r,reality:text,status}:r));
  return <section className={styles.machine}>
    <form onSubmit={submit} className={styles.intake}>
      <div className={styles.slot}><label>01 · DECISION</label><textarea name="decision" required placeholder="What was decided?"/></div>
      <div className={styles.slot}><label>02 · EVIDENCE</label><textarea name="evidence" placeholder="What did we actually know?"/></div>
      <div className={styles.slot}><label>03 · ASSUMPTIONS</label><textarea name="assumptions" placeholder="What did we have to believe?"/></div>
      <div className={styles.row}><div className={styles.slot}><label>04 · HUMAN OWNER</label><input name="owner" required /></div><div className={styles.slot}><label>05 · SMALLEST NEXT MOVE</label><input name="nextMove" required /></div></div>
      <button>FILE DECISION</button>
    </form>
    <div className={styles.tray}><div className={styles.trayHead}><span>ARCHIVAL TRAY</span><b>{records.length.toString().padStart(2,"0")} RECORDS</b></div>{records.length===0&&<p className={styles.empty}>No decisions filed yet. Suspiciously peaceful.</p>}{records.map(r=><article key={r.id} className={styles.record}><button className={styles.recordFace} onClick={()=>setOpen(open===r.id?null:r.id)}><span>{r.status}</span><strong>{r.decision}</strong><small>{r.owner} · NEXT: {r.nextMove}</small></button>{open===r.id&&<div className={styles.reverse}><p><b>EVIDENCE</b>{r.evidence||"NONE RECORDED"}</p><p><b>ASSUMPTIONS</b>{r.assumptions||"NONE RECORDED"}</p><label>WHAT REALITY DID<textarea defaultValue={r.reality} id={`reality-${r.id}`} /></label><div className={styles.stamps}>{(["CONFIRMED","BENT","WRONG"] as const).map(s=><button key={s} onClick={()=>reality(r.id,(document.getElementById(`reality-${r.id}`) as HTMLTextAreaElement)?.value||"",s)}>{s}</button>)}</div></div>}</article>)}</div>
  </section>;
}
