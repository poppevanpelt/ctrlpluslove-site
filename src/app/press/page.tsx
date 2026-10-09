import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press — ctrl+love",
  description: "Press information, founder biography, images and story enquiries for ctrl+love, an applied-AI practice for human judgment.",
};

const stories = [
  { no: "01", type: "THE PRACTICE", title: "What happens when we stop asking AI for more answers?", copy: "ctrl+love builds instruments that put assumptions, evidence and human judgment under pressure before decisions become expensive." },
  { no: "02", type: "THE PERSON", title: "From 30 years in advertising and eight at Apple to a shortcut to reality.", copy: "Founder Poppe van Pelt on craft, curiosity, and why another meeting is rarely the answer." },
  { no: "03", type: "THE EXPERIMENT", title: "Meet Savannah. Receptionist, character, and an evolving operating system.", copy: "A working experiment in giving a small independent practice a voice, a face and a way to make things happen." },
];
const email = "mailto:poppevanpelt@gmail.com?subject=PRESS%20%2F%20ctrl%2Blove";
const ink = "#1c1b19";
const muted = "#66645f";

export default function PressPage() {
  return <main style={{background:"#f1eee7",color:ink,minHeight:"100vh",fontFamily:"Arial, Helvetica, sans-serif"}}>
    <header style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"center",padding:"23px clamp(22px,5vw,76px)",borderBottom:"1px solid #c8c3b9"}}>
      <a href="/" style={{fontSize:23,fontWeight:900,letterSpacing:"-.07em",color:ink,textDecoration:"none"}}>ctrl+love</a>
      <a href="/" style={{fontSize:12,textTransform:"uppercase",letterSpacing:".14em",color:ink,textDecoration:"none"}}>← Back to the machine</a>
    </header>
    <div style={{maxWidth:1370,margin:"0 auto",padding:"clamp(45px,8vw,120px) clamp(22px,5vw,76px) 100px"}}>
      <p style={{fontSize:12,letterSpacing:".18em",fontWeight:700}}>CTRL+LOVE / PRESS OFFICE / 001</p>
      <h1 style={{fontSize:"clamp(74px,15vw,205px)",letterSpacing:"-.095em",lineHeight:".86",margin:"40px 0 35px",fontWeight:850}}>PRESS<span style={{color:"#cf4e35"}}>.</span></h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:40,borderTop:"2px solid",paddingTop:26,marginBottom:90}}>
        <p style={{fontSize:"clamp(22px,3vw,36px)",lineHeight:1.15,letterSpacing:"-.04em",margin:0}}>We build instruments for human judgment.</p>
        <div><p style={{fontSize:17,lineHeight:1.6,margin:"0 0 22px"}}>A small applied-AI practice. Rather more interested in useful evidence than impressive claims.</p><a href={email} style={{color:ink,textDecoration:"underline",textUnderlineOffset:5,fontWeight:700}}>Press enquiries ↗</a></div>
      </div>
      <section style={{borderTop:"1px solid #b8b2a7",paddingTop:20,marginBottom:95}}>
        <p style={{fontSize:12,letterSpacing:".16em",fontWeight:700,marginBottom:30}}>01 / COVERAGE</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:35,alignItems:"end"}}>
          <h2 style={{fontSize:"clamp(36px,5vw,65px)",letterSpacing:"-.06em",lineHeight:1,margin:0}}>Only what<br/>actually happened.</h2>
          <p style={{fontSize:17,lineHeight:1.55,color:muted,margin:0}}>Published interviews, articles and independent mentions will appear here once verified. No borrowed credibility. No imaginary headlines.</p>
        </div>
      </section>
      <section style={{borderTop:"1px solid #b8b2a7",paddingTop:20,marginBottom:95}}>
        <p style={{fontSize:12,letterSpacing:".16em",fontWeight:700,marginBottom:30}}>02 / STORIES AVAILABLE FOR EDITORIAL ENQUIRIES</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:15}}>
          {stories.map(story=><article key={story.no} style={{background:"#e4dfd5",padding:"28px 24px 36px",minHeight:305,display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:".13em"}}>{story.no} / {story.type}</span>
            <h3 style={{fontSize:"clamp(25px,2.3vw,36px)",lineHeight:1.07,letterSpacing:"-.05em",margin:"35px 0 16px"}}>{story.title}</h3>
            <p style={{fontSize:15,lineHeight:1.55,color:"#55514b",margin:"auto 0 0"}}>{story.copy}</p>
          </article>)}
        </div>
        <p style={{fontSize:13,color:muted,marginTop:16}}>These are possible angles, not press coverage or commissioned stories.</p>
      </section>
      <section style={{borderTop:"1px solid #b8b2a7",paddingTop:20,marginBottom:90}}>
        <p style={{fontSize:12,letterSpacing:".16em",fontWeight:700,marginBottom:30}}>03 / PRESS MATERIALS</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:36}}>
          <div><img src="/home/poppe-panda-portrait.jpeg" alt="Portrait of founder Poppe van Pelt" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",maxHeight:460}}/><p style={{fontSize:13,color:muted}}>Poppe van Pelt / Founder</p></div>
          <div><h2 style={{fontSize:"clamp(32px,4vw,55px)",lineHeight:1.05,letterSpacing:"-.06em",margin:"0 0 25px"}}>The short version.</h2>
          <p style={{fontSize:17,lineHeight:1.6}}>Poppe van Pelt is the founder of ctrl+love, an independent practice building applied-AI instruments for human judgment. After three decades in advertising, including eight years at Apple, he started ctrl+love to help people challenge assumptions, test decisions and turn useful intelligence into working things.</p>
          <p style={{fontSize:15,lineHeight:1.6,color:muted}}>For publication, image licensing, fact checks, interviews or a longer biography, please contact us directly.</p>
          <a href={email} style={{display:"inline-block",marginTop:12,border:"1px solid",padding:"14px 20px",fontWeight:700,textDecoration:"none",color:ink}}>Request press materials ↗</a></div>
        </div>
      </section>
      <footer style={{borderTop:"2px solid",paddingTop:22,display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
        <strong style={{fontSize:15}}>ctrl+love / shortcut to reality</strong>
        <a href={email} style={{fontWeight:700,color:ink}}>PRESS ENQUIRIES ↗</a>
      </footer>
    </div>
  </main>;
}
