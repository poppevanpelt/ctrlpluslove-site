"use client";

import { useState } from "react";
import styles from "../xray-follow-through.module.css";

const fields = [
  ["name","Machine / version","Which tool and version does this passport describe?"],
  ["purpose","Job and limits","What it does, who uses it, and what it should not be relied on for."],
  ["owner","Owner and rights","Who owns the code, accounts and data? What rights are transferred?"],
  ["hosting","Where it runs","Live address, hosting provider and account holder. Never enter passwords or keys."],
  ["costs","Running costs and payer","Hosting, model/API usage, licences, spending limits and who pays each bill."],
  ["dependencies","Dependencies","Services, models, libraries and licences needed to keep it working."],
  ["data","Data and access","What is stored, where, who can access it, retention and how to export or delete it."],
  ["repair","Repair route and support terms","Who fixes it, how to reach them, what support is included and when it ends."],
  ["shutdown","Stop, export and restart","How to stop operation and billing, preserve required data and restart safely."],
  ["handover","Handover evidence","Source and account transfer, documentation, acceptance check and agreed date."],
] as const;
type Key=typeof fields[number][0];
type Values=Record<Key,string>;
const blank:Values={name:"",purpose:"",owner:"",hosting:"",costs:"",dependencies:"",data:"",repair:"",shutdown:"",handover:""};
const example:Values={...blank,name:"THE ROOM KEY™ / public prototype",purpose:"Three questions suggest a ctrl+love offer. Mixed answers prompt a conversation. This is guidance, not a binding proposal or automated purchase.",hosting:"https://ctrl-love-room-key.lovable.app/ · hosted on Lovable. Client account ownership and any transfer remain to agree.",costs:"No AI/model call is required for the selector. Hosting and platform plan costs, payer and future support are not specified here: confirm them before client handover.",dependencies:"Browser JavaScript, the Lovable hosting platform, Google Fonts and the linked ctrl+love offer pages. Mail links require a configured mail app.",data:"Selector answers stay in the browser tab. Opt-in pilot records are stored on that device in browser storage and can be exported as CSV or JSON. Those exports need their own retention decision.",shutdown:"Close the tab to stop using it. Export pilot records before clearing browser storage. Taking the site offline or ending hosting billing requires the account holder to act in Lovable; exact account steps still need documenting."};

export default function MachinePassport(){
  const [values,setValues]=useState<Values>(blank);
  const [message,setMessage]=useState("");
  const [saved,setSaved]=useState(false);
  const missing=fields.filter(([key])=>!values[key].trim()).map(([,label])=>label);
  const receipt=["ctrl+love / THE MACHINE PASSPORT™","WORKING DRAFT — confirm all terms with the people responsible.",...fields.flatMap(([key,label])=>["",label.toUpperCase(),values[key].trim()||"TO AGREE"]),"","Unfilled fields remain unresolved. Filled fields are notes, not proof of agreement."].join("\n");
  function save(){try{localStorage.setItem("ctrl-love-machine-passport",JSON.stringify(values));setSaved(true);setMessage("Draft saved on this device. Nothing was submitted.");}catch{setMessage("Browser storage is unavailable. Use Download JSON to keep the draft.");}}
  function load(){try{const raw=localStorage.getItem("ctrl-love-machine-passport");if(!raw){setMessage("No saved draft on this device.");return;}const parsed=JSON.parse(raw);const next={...blank};for(const [key] of fields)if(typeof parsed?.[key]==="string")next[key]=parsed[key];setValues(next);setSaved(true);setMessage("Saved draft loaded.");}catch{setMessage("Could not read the saved draft. Your current notes remain.");}}
  function download(){const url=URL.createObjectURL(new Blob([JSON.stringify({schema:1,status:"draft",fields:values},null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="machine-passport-draft.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage("Draft downloaded as JSON.");}
  async function copy(){try{await navigator.clipboard.writeText(receipt);setMessage("Passport copied.");}catch{setMessage("Copy is unavailable. Select the passport text below, or download JSON.");}}
  function clear(){if(!window.confirm("Clear this draft and its saved copy on this device? Download it first if you need it."))return;try{localStorage.removeItem("ctrl-love-machine-passport");}catch{}setValues({...blank});setSaved(false);setMessage("Local draft cleared.");}
  return <main className={styles.page} id="main-content">
    <nav className={styles.navigation}><a href="/">ctrl+love</a> / <a href="/2go/">ctrl+2go</a></nav>
    <p className={styles.label}>HANDOVER / OWNERSHIP / UPKEEP</p><h1>THE MACHINE PASSPORT™</h1>
    <p>A machine that stays behind needs clear responsibilities. Record them before purchase and confirm them at handover.</p>
    <div className={styles.editor}>
      <p className={styles.status}>Working draft. These are your notes, not agreed contract terms. Do not enter credentials or confidential client details. No automatic saving or submission.</p>
      <div className={styles.actions}><button className={styles.action} type="button" onClick={()=>{if(Object.values(values).some(Boolean)&&!window.confirm("Replace your current notes with the public Room Key example?"))return;setValues({...example});setMessage("Public example loaded. Unconfirmed responsibilities remain to agree.");}}>Load Room Key example</button><button className={styles.action} type="button" onClick={load}>Load saved draft</button></div>
      <section className={styles.panel} aria-label="Passport fields"><div className={styles.grid}>{fields.map(([key,label,hint])=><label className={styles.field} key={key} htmlFor={`passport-${key}`}><span>{label}</span><small>{hint}</small><textarea id={`passport-${key}`} rows={key==="name"?2:4} value={values[key]} placeholder="To agree" onChange={e=>setValues({...values,[key]:e.target.value})}/></label>)}</div></section>
      <p className={styles.status}>{missing.length?`${missing.length} fields still need an answer: ${missing.join(", ")}.`:"All fields have notes. Confirm them with the responsible people before handover."}</p>
    </div>
    <div className={styles.actions}><button className={styles.action} type="button" onClick={save}>{saved?"Save draft again":"Save on this device"}</button><button className={styles.action} type="button" onClick={download}>Download JSON</button><button className={styles.action} type="button" onClick={copy}>Copy passport</button><button className={styles.action} type="button" onClick={()=>window.print()}>Print passport</button><button className={styles.action} type="button" onClick={clear}>Clear local draft</button></div>
    <p role="status" aria-live="polite">{message}</p>
    <section className={styles.panel} aria-labelledby="passport-preview"><h2 id="passport-preview">Your handover draft</h2><pre className={styles.receipt}>{receipt}</pre></section>
  </main>;
}
