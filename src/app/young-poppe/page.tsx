"use client";
import {useRef,useState} from "react";
import type {ChangeEvent,FormEvent} from "react";
import styles from "./young-poppe.module.css";
type Line={role:"user"|"assistant";text:string};
export default function YoungPoppe(){
 const [pin,setPin]=useState("");
 const [image,setImage]=useState<string|null>(null);
 const [lines,setLines]=useState<Line[]>([]);
 const [draft,setDraft]=useState("");
 const [status,setStatus]=useState("");
 const [busy,setBusy]=useState(false);
 const [voice,setVoice]=useState<"ash"|"verse">("ash");
 const audio=useRef<HTMLAudioElement|null>(null);
 const loadImage=(e:ChangeEvent<HTMLInputElement>)=>{
  const file=e.target.files?.[0]; if(!file)return;
  if(!file.type.startsWith("image/")||file.size>9000000){setStatus("Kies een foto kleiner dan 9 MB.");return;}
  const reader=new FileReader();reader.onload=()=>setImage(String(reader.result));reader.readAsDataURL(file);
 };
 const speak=async(text:string)=>{
  if(!pin)return;
  setStatus("Even luisteren...");
  try{
   const response=await fetch("/api/young-poppe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:pin,action:"speech",text,voice})});
   if(!response.ok)throw new Error(response.status===503?"Spraak is nog niet aangesloten.":"Stem is niet beschikbaar.");
   const blob=await response.blob();const url=URL.createObjectURL(blob);
   if(audio.current){audio.current.pause();audio.current.src="";}
   const player=new Audio(url);audio.current=player;player.onended=()=>URL.revokeObjectURL(url);
   await player.play();setStatus("");
  }catch(error){setStatus(error instanceof Error?error.message:"Geluid is niet beschikbaar.");}
 };
 const submit=async(e:FormEvent)=>{
  e.preventDefault();const text=draft.trim();if(!text||busy||!pin)return;
  const next=[...lines,{role:"user" as const,text}].slice(-18);setLines(next);setDraft("");setBusy(true);setStatus("Even denken...");
  try{
   const res=await fetch("/api/young-poppe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:pin,action:"chat",messages:next})});
   const data=await res.json();if(!res.ok)throw new Error(data.error||"Even niet, pap.");
   const answer=String(data.text||"");setLines([...next,{role:"assistant",text:answer}]);setBusy(false);setStatus("");void speak(answer);
  }catch(error){setStatus(error instanceof Error?error.message:"Er ging iets mis.");setBusy(false);}
 };
 return <main className={styles.page} id="main-content"><div className={styles.wrap}>
  <div className={styles.top}><span>PROJECT SNOTJOCH / 001</span><a href="/">ctrl+love</a></div>
  <div className={styles.portrait}>{image?<img src={image} alt="Jonge Poppe" />:<div className={styles.placeholder}><span>POPPE</span><small>9 jaar</small></div>}</div>
  <label className={styles.upload}>Foto kiezen (alleen op dit apparaat)<input type="file" accept="image/*" onChange={loadImage}/></label>
  <h1>Hé, pap.</h1><p className={styles.sub}>Een kleine, nogal onwaarschijnlijke ontmoeting.</p>
  <div className={styles.setup}><label>Privé toegangscode<input type="password" autoComplete="off" value={pin} onChange={e=>setPin(e.target.value)} placeholder="Toegangscode"/></label>
  <label>Stem<select value={voice} onChange={e=>setVoice(e.target.value as "ash"|"verse")}><option value="ash">Ash — eerste proef</option><option value="verse">Verse — tweede proef</option></select></label></div>
  <div className={styles.chat} aria-live="polite">{lines.length===0?<div className={styles.empty}>Hij wacht rustig tot je iets zegt.</div>:lines.map((line,i)=><div className={line.role==="assistant"?styles.boy:styles.person} key={i}><small>{line.role==="assistant"?"JONGE POPPE":"JIJ"}</small><p>{line.text}</p>{line.role==="assistant"&&<button onClick={()=>void speak(line.text)}>▶ Beluister</button>}</div>)}</div>
  <form onSubmit={submit} className={styles.form}><input aria-label="Typ een bericht" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Zeg iets tegen hem..." maxLength={2000}/><button disabled={!pin||!draft.trim()||busy}>Verstuur ↗</button></form>
  <div className={styles.test}><button disabled={!pin} onClick={()=>void speak("Hé, pap. Raar hè?")}>▶ Eerste stemproef</button>{busy&&<span>Denkt na...</span>}</div>
  <p className={styles.status} role="status">{status}</p>
  <footer>Een AI-interpretatie, geen authentieke opname. Familieherinneringen blijven hier niet opgeslagen. Deel deze pagina niet publiek.</footer>
 </div></main>;
}
