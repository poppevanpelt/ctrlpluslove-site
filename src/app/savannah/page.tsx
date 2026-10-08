"use client";

import { useEffect } from "react";

export default function SavannahPage() {
  useEffect(() => {
    window.dispatchEvent(new Event("savannah-open"));
  }, []);

  return (
    <main id="main-content" style={{minHeight:"100svh",background:"#f1eee6",color:"#141414",padding:"120px 8vw 80px",fontFamily:"Arial, Helvetica, sans-serif"}}>
      <p style={{fontSize:11,fontWeight:800,letterSpacing:".14em",textTransform:"uppercase",opacity:.55}}>ctrl+love / SavannahOS / employee #4</p>
      <h1 style={{maxWidth:1100,margin:"28px 0 0",fontFamily:"Georgia, Times New Roman, serif",fontSize:"clamp(64px,10vw,150px)",fontWeight:400,lineHeight:.84,letterSpacing:"-.06em"}}>Savannah knows the work.</h1>
      <p style={{maxWidth:760,margin:"34px 0 0",fontSize:"clamp(22px,2.4vw,36px)",lineHeight:1.08,letterSpacing:"-.025em"}}>Not just the website. Bring her the decision, the half-brief, the stuck bit, or the thing nobody quite wants to say in the room.</p>
      <button type="button" onClick={() => window.dispatchEvent(new Event("savannah-open"))} style={{marginTop:40,padding:"16px 24px",background:"#141414",color:"#fff",border:0,cursor:"pointer",fontSize:16}}>Open Savannah’s chat →</button>
    </main>
  );
}
