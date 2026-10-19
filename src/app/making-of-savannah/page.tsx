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

      <section aria-label="Actual production tests" style={{padding:"70px 0 35px",borderBottom:"1px solid #4b4945"}}>
        <p style={{fontSize:11,letterSpacing:".22em",color:"#a9a59b"}}>FOUND IN THE ARCHIVE / 01</p>
        <h2 style={{fontSize:"clamp(36px,7vw,72px)",fontWeight:500,letterSpacing:"-.06em",lineHeight:1,margin:"18px 0"}}>The rough stuff.</h2>
        <p style={{color:"#aaa69e",lineHeight:1.6,maxWidth:620,fontSize:15}}>Three genuine motion experiments from Savannah's development. Unretouched, in chronological order. These are working studies — not finished film scenes. Sound may be absent. Archival playback links can expire.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))",gap:18,marginTop:35}}>
          <figure style={{margin:0,background:"#1a1917",border:"1px solid #393834",padding:12}}>
            <video controls playsInline preload="metadata" style={{display:"block",width:"100%",aspectRatio:"4/5",objectFit:"contain",background:"#090909"}} src={"https://dnznrvs05pmza.cloudfront.net/seedance_2/cgt-20261005074458-xwnbt/Preserve_this_exact_woman_s_identity__face__long_wavy_brown_hair__caramel_toned_styling__age__wardro.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNTdkMTQxMmY4MzUwMGM2NyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MjU3OTUwM30.NB-E7thuAh1iOZGD67T4NkzqwwfwREKHY_Ho6fZBq78"} aria-label={"Early identity and motion"} />
            <figcaption style={{padding:"17px 4px 8px"}}>
              <p style={{fontSize:10,letterSpacing:".17em",color:"#aba59c",margin:"0 0 10px"}}>01 / 04 OCT 2026</p>
              <h3 style={{fontSize:19,fontWeight:500,letterSpacing:"-.025em",margin:"0 0 10px"}}>Early identity and motion</h3>
              <p style={{fontSize:13,color:"#aaa69e",lineHeight:1.5,margin:0}}>Early attempt to preserve Savannah's face, hair and proportions as she moves.</p>
            </figcaption>
          </figure>
<figure style={{margin:0,background:"#1a1917",border:"1px solid #393834",padding:12}}>
            <video controls playsInline preload="metadata" style={{display:"block",width:"100%",aspectRatio:"4/5",objectFit:"contain",background:"#090909"}} src={"https://dnznrvs05pmza.cloudfront.net/seedance_2_mini/cgt-20261010110908-p8m76/A_fixed_camera_cinematic_close_portrait_of_precisely_the_same_woman__clothing__face_and_neutral_back.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNzJiYTEwZDIyMjM0ZTBkOSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MjYwNDYyNn0.HEWTnPPNrYcPDqlOdA700FL_qafdr0jsHr66tcOTvdc"} aria-label={"The close-up experiment"} />
            <figcaption style={{padding:"17px 4px 8px"}}>
              <p style={{fontSize:10,letterSpacing:".17em",color:"#aba59c",margin:"0 0 10px"}}>02 / 10 OCT 2026</p>
              <h3 style={{fontSize:19,fontWeight:500,letterSpacing:"-.025em",margin:"0 0 10px"}}>The close-up experiment</h3>
              <p style={{fontSize:13,color:"#aaa69e",lineHeight:1.5,margin:0}}>A fixed-camera portrait test: a small movement can change everything.</p>
            </figcaption>
          </figure>
<figure style={{margin:0,background:"#1a1917",border:"1px solid #393834",padding:12}}>
            <video controls playsInline preload="metadata" style={{display:"block",width:"100%",aspectRatio:"4/5",objectFit:"contain",background:"#090909"}} src={"https://dnznrvs05pmza.cloudfront.net/kling-o3-pro/938228634135957573/Preserve_Savannah_exactly__same_face__hair__age__wardrobe__lighting_and_ctrl_love_office_world__Stat.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNThkNTQzMGFlOWMyYjhhYyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MjU5ODUzOH0.QctwhSaRiEUQW6gC88HuNzWkt7T3H1AKGemS34l7r_4"} aria-label={"Keeping Savannah Savannah"} />
            <figcaption style={{padding:"17px 4px 8px"}}>
              <p style={{fontSize:10,letterSpacing:".17em",color:"#aba59c",margin:"0 0 10px"}}>03 / 11 OCT 2026</p>
              <h3 style={{fontSize:19,fontWeight:500,letterSpacing:"-.025em",margin:"0 0 10px"}}>Keeping Savannah Savannah</h3>
              <p style={{fontSize:13,color:"#aaa69e",lineHeight:1.5,margin:0}}>Later identity-consistency test, trying to preserve her appearance throughout a shot.</p>
            </figcaption>
          </figure>
        </div>
        <p style={{fontSize:12,color:"#807b73",marginTop:18}}>These are archived generation outputs, not fabricated reconstructions. Exact original prompts and rejected stills are being recovered separately.</p>
      </section>
      <section aria-label="Expression contact sheet" style={{padding:"65px 0 15px"}}>
        <p style={{fontSize:11,letterSpacing:".22em",color:"#a9a59b"}}>PRODUCTION FRAMES / TODAY</p>
        <h2 style={{fontSize:"clamp(29px,5vw,55px)",letterSpacing:"-.045em",fontWeight:500,margin:"18px 0 20px"}}>One face. Six states.</h2>
        <p style={{fontSize:14,color:"#aaa69e",maxWidth:600,lineHeight:1.6}}>These are current working expression assets, not early casting roughs. They show the practical problem of making one synthetic person listen, think, react and wait.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8,marginTop:28}}>
          <figure style={{margin:0,background:"#23211f",padding:5}}><img src="/savannah-presence/waiting.webp" alt="Savannah production expression: waiting" loading="lazy" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block"}}/><figcaption style={{fontSize:10,letterSpacing:".1em",padding:"9px 3px",color:"#b2aea5"}}>01 / WAITING</figcaption></figure>
<figure style={{margin:0,background:"#23211f",padding:5}}><img src="/savannah-presence/listening.webp" alt="Savannah production expression: listening" loading="lazy" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block"}}/><figcaption style={{fontSize:10,letterSpacing:".1em",padding:"9px 3px",color:"#b2aea5"}}>02 / LISTENING</figcaption></figure>
<figure style={{margin:0,background:"#23211f",padding:5}}><img src="/savannah-presence/thinking-1.webp" alt="Savannah production expression: thinking-1" loading="lazy" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block"}}/><figcaption style={{fontSize:10,letterSpacing:".1em",padding:"9px 3px",color:"#b2aea5"}}>03 / THINKING-1</figcaption></figure>
<figure style={{margin:0,background:"#23211f",padding:5}}><img src="/savannah-presence/thinking-2.webp" alt="Savannah production expression: thinking-2" loading="lazy" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block"}}/><figcaption style={{fontSize:10,letterSpacing:".1em",padding:"9px 3px",color:"#b2aea5"}}>04 / THINKING-2</figcaption></figure>
<figure style={{margin:0,background:"#23211f",padding:5}}><img src="/savannah-presence/bridge.webp" alt="Savannah production expression: bridge" loading="lazy" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block"}}/><figcaption style={{fontSize:10,letterSpacing:".1em",padding:"9px 3px",color:"#b2aea5"}}>05 / BRIDGE</figcaption></figure>
<figure style={{margin:0,background:"#23211f",padding:5}}><img src="/savannah-presence/reaction.webp" alt="Savannah production expression: reaction" loading="lazy" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block"}}/><figcaption style={{fontSize:10,letterSpacing:".1em",padding:"9px 3px",color:"#b2aea5"}}>06 / REACTION</figcaption></figure>
        </div>
      </section>
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
