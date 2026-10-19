import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Making of Savannah — ctrl+love",
  description: "An honest, 45-second production diary of ctrl+love's synthetic employee #4.",
};

const scenes = [
  { time: "00–04", title: "The brief", copy: "WE NEEDED AN EMPLOYEE.", note: "The original brief. Not another chatbot.", mark: "01 / BRIEF" },
  { time: "04–11", title: "The studies", copy: "SOMEONE WHO COULD DISAGREE.", note: "Real early portrait explorations and rejected takes.", mark: "02 / STUDIES" },
  { time: "11–18", title: "The voice", copy: "A LITTLE MORE TEXAS.", note: "Actual auditions only; original voice files pending.", mark: "03 / VOICE" },
  { time: "18–27", title: "The silence", copy: "SAVANNAH IS TAKING A WHILE TO RESPOND.", note: "The real glitches, silence and stubborn iPhone.", mark: "04 / REALITY" },
  { time: "27–35", title: "The work", copy: "THEN SHE STARTED BEING USEFUL.", note: "Working Savannah: a live question and a real response.", mark: "05 / EMPLOYEE #4" },
  { time: "35–40", title: "The interruption", copy: "YOU KNOW I CAN HEAR YOU, RIGHT?", note: "Present-day scripted performance; not an archival quote.", mark: "06 / INTERRUPTION" },
  { time: "40–45", title: "The result", copy: "100% SYNTHETIC.\n100% EMPLOYED.", note: "ctrl+love — We build instruments for human judgement.", mark: "07 / END CARD" },
];

export default function MakingOfSavannah() {
  return <main style={{ minHeight:"100vh",background:"#10100f",color:"#f0eee8",fontFamily:"Arial, Helvetica, sans-serif" }}>
    <div style={{maxWidth:960,margin:"0 auto",padding:"56px 24px 110px"}}>
      <nav style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",fontSize:12,letterSpacing:".12em",textTransform:"uppercase"}}>
        <a href="/" style={{color:"inherit",textDecoration:"none",fontWeight:800}}>ctrl+love</a>
        <a href="/savannah/" style={{color:"#c6c2ba",textDecoration:"none"}}>Meet Savannah ↗</a>
      </nav>
      <header style={{padding:"96px 0 70px",borderBottom:"1px solid #4b4945"}}>
        <p style={{fontSize:11,letterSpacing:".22em",color:"#a9a59b"}}>AN ORIGINAL PRODUCTION DIARY · CUT 01 · 45 SECONDS</p>
        <h1 style={{fontSize:"clamp(48px, 11vw, 118px)",fontWeight:600,letterSpacing:"-.075em",lineHeight:.94,margin:"25px 0 34px"}}>THE MAKING<br/>OF SAVANNAH<span style={{color:"#99948a"}}>™</span></h1>
        <p style={{fontSize:"clamp(22px, 4vw, 40px)",letterSpacing:"-.035em",lineHeight:1.15,maxWidth:720}}>100% synthetic.<br/><span style={{color:"#9e9b92"}}>Surprisingly hard to make.</span></p>
        <div style={{marginTop:40,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{border:"1px solid #615e57",borderRadius:30,padding:"10px 15px",fontSize:12}}>PRODUCTION CUT / STORYBOARD</span>
          <span style={{fontSize:12,color:"#a9a59b"}}>Authentic archive in assembly — not yet a finished film</span>
        </div>
      </header>
      <section aria-label="Production cut" style={{paddingTop:44}}>
        {scenes.map((scene,i)=><article key={scene.mark} style={{display:"grid",gridTemplateColumns:"minmax(62px,100px) 1fr",gap:24,padding:"28px 0",borderBottom:"1px solid #393834"}}>
          <div style={{fontSize:12,color:"#b3afa6",fontVariantNumeric:"tabular-nums"}}>{scene.time}<span style={{display:"block",color:"#77736c",marginTop:5}}>SEC</span></div>
          <div><p style={{fontSize:11,letterSpacing:".18em",color:"#a9a59b",margin:0}}>{scene.mark}</p>
            <h2 style={{fontWeight:500,fontSize:"clamp(27px,5vw,52px)",letterSpacing:"-.05em",whiteSpace:"pre-line",lineHeight:1.05,margin:"15px 0"}}>{scene.copy}</h2>
            <p style={{fontSize:14,color:"#aaa69e",lineHeight:1.6,margin:0}}>{scene.note}</p>
          </div>
        </article>)}
      </section>
      <footer style={{paddingTop:75}}>
        <p style={{fontSize:"clamp(23px,4vw,38px)",letterSpacing:"-.04em",lineHeight:1.2,maxWidth:720}}>What you see is what you get.</p>
        <p style={{fontSize:13,color:"#a9a59b",maxWidth:620,lineHeight:1.65}}>Original development tests, real mistakes and the actual working employee. No invented behind-the-scenes footage. The source edit is being assembled; this page shows the locked 45-second structure, not a completed video.</p>
        <a href="/savannah/" style={{display:"inline-block",color:"#eeeae1",fontSize:14,marginTop:22}}>Talk to employee #4 ↗</a>
      </footer>
    </div>
  </main>;
}
