"use client";
import { useState } from "react";
import Link from "next/link";

export default function SavannahMotionPreview() {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  return <main style={{minHeight:"100dvh",background:"#201d1a",color:"#efe9df",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:24}}>
    <div style={{position:"relative",width:"min(100%,440px)",aspectRatio:"3 / 4",overflow:"hidden",background:"#302b25"}}>
      <img alt="Savannah" src="/savannah-presence/waiting.webp" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}}/>
      {!failed && <video src="/savannah-presence/listening.mp4" autoPlay muted playsInline loop preload="metadata" aria-hidden="true" onPlaying={()=>setPlaying(true)} onError={()=>{setFailed(true);setPlaying(false)}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",opacity:playing?1:0,transition:"opacity 400ms"}}/>}
    </div>
    <p style={{font:"18px Georgia,serif",textAlign:"center",marginTop:22}}>{playing?"Savannah. Present.":"Savannah. Waiting for her first moving portrait."}</p>
    <p style={{maxWidth:440,textAlign:"center",font:"12px/1.5 system-ui",opacity:.7}}>Silent motion preview. The working voice and conversation remain unchanged.</p>
    <Link href="/savannah" style={{font:"13px system-ui",color:"#efe9df",marginTop:12}}>Return to Savannah</Link>
  </main>;
}
