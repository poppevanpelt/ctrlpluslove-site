"use client";
import { useEffect,useState } from "react";
type Message={id:string;room:string;headline:string;reason:string;surprise:string;next_move:string;evidence:string;created_at:string;read_at:string|null};
export default function ClientInbox(){
  const [messages,setMessages]=useState<Message[]>([]);
  const [status,setStatus]=useState<"loading"|"unauthorized"|"unavailable"|"ready">("loading");
  const [email,setEmail]=useState("");
  const [active,setActive]=useState("");
  async function refresh(){
    try{
      const res=await fetch("/api/savannah/inbox",{cache:"no-store"});
      if(res.status===401){setStatus("unauthorized");return;}
      if(!res.ok){setStatus("unavailable");return;}
      const data=await res.json();
      setMessages(data.messages||[]);setEmail(data.email||"");setStatus("ready");
    }catch{setStatus("unavailable");}
  }
  useEffect(()=>{void refresh();},[]);
  async function read(id:string){
    setActive(id);
    await fetch("/api/savannah/inbox",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}).catch(()=>{});
    setMessages(old=>old.map(m=>m.id===id?{...m,read_at:m.read_at||new Date().toISOString()}:m));
  }
  return <main className="client-inbox">
    <header><a href="/savannah/">Savannah<span>.</span></a><span>THE PERSONAL INBOX / CTRL+LOVE</span></header>
    <div className="client-body"><p className="eyebrow">PRIVATE. RELEVANT. OCCASIONALLY UNEXPECTED.</p>
      <h1>Something worth<br/><em>your attention.</em></h1>
      {status==="loading"&&<p>Checking your invitation…</p>}
      {status==="unavailable"&&<section className="client-note"><h2>The door isn't open yet.</h2><p>Private inbox setup is underway. Nothing has been shared publicly.</p></section>}
      {status==="unauthorized"&&<section className="client-note"><h2>Just you, please.</h2><p>Use the Google account invited to your private client inbox. No invitation? Ask Savannah.</p><a className="signin" href="/api/savannah/auth/client-login">SIGN IN WITH GOOGLE ↗</a></section>}
      {status==="ready"&&<><div className="client-meta"><span>{email}</span><a href="/api/savannah/auth/client-logout">SIGN OUT ↗</a></div>
        {!messages.length&&<section className="client-note"><h2>No noise. That's intentional.</h2><p>Nothing has passed Savannah's relevance test for you yet.</p></section>}
        {messages.map(m=><article key={m.id} className={m.read_at?"is-read":""}><div className="meta"><span>{m.room.toUpperCase()} / PERSONAL SIGNAL</span><span>{new Date(m.created_at).toLocaleDateString()}</span></div><h2>{m.headline}</h2><p>{m.reason}</p>{m.surprise&&<p className="surprise">{m.surprise}</p>}<div className="next"><small>ONE NEXT MOVE</small><p>{m.next_move}</p></div><details><summary>WHY WE THINK THIS IS REAL</summary><p>{m.evidence}</p></details><button type="button" onClick={()=>void read(m.id)} disabled={Boolean(m.read_at)}>{m.read_at?"READ ✓":active===m.id?"MARKED READ":"MARK AS READ"}</button></article>)}
      </>}
      <footer>Good judgment deserves better interruptions. <strong>ctrl+love</strong></footer>
    </div>
    <style jsx>{`
      .client-inbox{min-height:100dvh;background:#eeeae2;color:#201d1b;font:16px/1.5 Arial,Helvetica,sans-serif}
      header{display:flex;justify-content:space-between;align-items:center;background:#1e1d1c;color:#eeeae2;padding:22px clamp(24px,5vw,70px);gap:16px}
      header a{color:inherit;text-decoration:none;font:36px Georgia,serif;letter-spacing:-.06em}header a span{color:#b68e75}header>span{font-size:10px;letter-spacing:.12em}
      .client-body{max-width:800px;margin:auto;padding:60px 26px 70px}.eyebrow{font-size:10px;letter-spacing:.18em;color:#766b60}
      h1{font:clamp(48px,9vw,86px)/1.02 Georgia,serif;letter-spacing:-.055em;margin:12px 0 50px}h1 em{font-weight:normal}
      .client-note,article{border-top:1px solid #8d857c;padding:25px 0 42px}.client-note h2,article h2{font:36px/1.1 Georgia,serif;letter-spacing:-.035em;margin:13px 0 20px}
      .client-meta,.meta{display:flex;justify-content:space-between;gap:15px;color:#736b62;font-size:11px;letter-spacing:.08em;margin-bottom:14px}
      .client-meta a{color:inherit}.signin,article button{display:inline-block;background:#222;color:#fff;border:0;padding:14px 20px;margin-top:15px;text-decoration:none;font:11px Arial,sans-serif;letter-spacing:.1em;cursor:pointer}
      article p{max-width:640px}.surprise{font:italic 21px/1.4 Georgia,serif;margin:26px 0}.next{border-left:2px solid #a48571;padding:3px 0 3px 18px;margin:25px 0}.next small{font-size:10px;letter-spacing:.12em}
      details{font-size:12px;color:#635c53;margin:20px 0}summary{cursor:pointer;letter-spacing:.08em}article button:disabled{background:#c3bcb2;color:#514941;cursor:default}
      .is-read{opacity:.82}footer{margin-top:50px;font-size:12px;color:#726b64}footer strong{color:#25211d}
    `}</style>
  </main>;
}