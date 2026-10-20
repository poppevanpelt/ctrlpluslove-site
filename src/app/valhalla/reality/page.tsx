"use client";
import { useState } from "react";

type Entry = { id:string;kind:string;note:string;observed_at:string|null };
type Review = { original:{title:string;promise:string;score:number;gates_passed:number};observations:Entry[];statement:string };
export default function RealityPage() {
 const [orderId,setOrderId]=useState("");
 const [privateToken,setPrivateToken]=useState("");
 const [review,setReview]=useState<Review|null>(null);
 const [error,setError]=useState("");
 async function openReview() {
  setError("");
  try {
   const response=await fetch("/api/valhalla/reality",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId,privateToken}),cache:"no-store"});
   if(!response.ok)throw new Error("Review unavailable or access not verified.");
   setReview(await response.json() as Review);
   setPrivateToken("");
  } catch(e) {setError(e instanceof Error?e.message:"Unavailable");}
 }
 return <main id="main-content" style={{maxWidth:880,margin:"auto",padding:48}}>
 <nav><a href="/">ctrl+love</a> / VALHALLA</nav>
 <h1 style={{fontSize:64,letterSpacing:"-.06em"}}>REALITY CHECK™</h1>
 <p>What we believed. What happened. What we learned.</p>
 {!review?<form onSubmit={e=>{e.preventDefault();void openReview();}} style={{display:"grid",gap:16,maxWidth:480}}>
  <label>Order reference<input required value={orderId} onChange={e=>setOrderId(e.target.value)} style={{display:"block",width:"100%",padding:12}}/></label>
  <label>Private access token<input type="password" autoComplete="off" required value={privateToken} onChange={e=>setPrivateToken(e.target.value)} style={{display:"block",width:"100%",padding:12}}/></label>
  <button type="submit" style={{padding:14}}>OPEN DECISION →</button>
  {error&&<p role="alert">{error}</p>}
  <small>Private-token prototype. Customer login and security review are required before launch.</small>
 </form>:<section>
  <h2>What we believed</h2>
  <strong style={{fontSize:72}}>{review.original.score}/100</strong>
  <p>{review.original.title}: {review.original.promise}</p>
  <p>{review.original.gates_passed}/3 approval gates declared passed</p>
  <h2>What happened</h2>
  {review.observations.length===0?<p>No observations yet.</p>:<ol>{review.observations.map(entry=><li key={entry.id}><strong>{entry.kind}</strong><p>{entry.note}</p><small>{entry.observed_at||"Date not specified"} · Self-reported</small></li>)}</ol>}
  <h2>What we learned</h2><p>{review.statement}</p>
  <button onClick={()=>setReview(null)}>CLOSE REVIEW</button>
 </section>}
 </main>;
}
