"use client";

import { useMemo, useState } from "react";

type Situation = { id: string; guest: string; line: string; sub: string; best: "listen" | "ask" | "help"; reasoning: string; response: string; caution: string };
type Move = "listen" | "ask" | "help";
const scenarios: Situation[] = [
  { id:"exhausted", guest:"THE EXHAUSTED REGULAR", line:"Long day. I don't really want to talk about it.", sub:"The guest sits quietly, shoulders lowered.", best:"listen", reasoning:"The boundary is already there. Respecting it is the intelligence.", response:"Of course. I'll be right here if you need anything.", caution:"Questions and fixes would turn their quiet into another task." },
  { id:"uncertain", guest:"THE HESITANT STRANGER", line:"I promised I'd go to a party. I don't know. Maybe I should.", sub:"They linger after speaking, looking for a response.", best:"ask", reasoning:"They've opened a question without asking for a solution. One invitation is enough.", response:"Sounds like two parts of you want different things. Want to tell me about it?", caution:"An immediate solution would outrun the person." },
  { id:"practical", guest:"THE PERSON WITH A PROBLEM", line:"My train is cancelled. I need to get home. Can you help me find another route?", sub:"They check their phone, waiting.", best:"help", reasoning:"The request is explicit and practical. This is the moment to help.", response:"Yes. Let's look at the alternatives. What's your destination?", caution:"Listening alone would be frustrating when concrete help was requested." },
  { id:"celebrating", guest:"THE PERSON WITH GOOD NEWS", line:"I got the job! I just wanted to tell someone.", sub:"They're grinning.", best:"listen", reasoning:"They're sharing joy, not assigning a task. Join the celebration.", response:"Well, look at you. That's fantastic. Tell me everything.", caution:"Don't turn someone's joy into a career-planning workshop." },
  { id:"frustrated", guest:"THE DISAPPOINTED CLIENT", line:"Everybody loved my idea. Then the meeting ended, and nothing happened.", sub:"They laugh a little, without smiling.", best:"ask", reasoning:"Acknowledge the sting and invite a story before opening a toolkit.", response:"Ouch. What happened after everyone agreed?", caution:"A pitch for another instrument would repeat the very problem." },
];
const options: { id:Move; title:string; note:string }[] = [
  {id:"listen",title:"LISTEN",note:"Stay with the person. No fixing."},
  {id:"ask",title:"ASK",note:"One thoughtful question. Then wait."},
  {id:"help",title:"HELP",note:"Take practical action, if invited."}
];
export default function DrinkDecisionCollider() {
  const [index,setIndex]=useState(0);
  const [choice,setChoice]=useState<Move|null>(null);
  const [history,setHistory]=useState<{guest:string;choice:Move;best:Move;correct:boolean}[]>([]);
  const [copied,setCopied]=useState(false);
  const current=scenarios[index];
  const result=useMemo(()=>history.filter(h=>h.correct).length,[history]);
  const answered=choice!==null;
  const decide=(move:Move)=>{if(answered)return;setChoice(move);setHistory(prev=>[...prev,{guest:current.guest,choice:move,best:current.best,correct:move===current.best}]);setCopied(false);};
  const next=()=>{setChoice(null);setIndex(i=>(i+1)%scenarios.length);setCopied(false);};
  const restart=()=>{setHistory([]);setIndex(0);setChoice(null);setCopied(false);};
  const receipt=`THE DRINK DECISION COLLIDER™ — BAR RECEIPT\nGuests: ${history.length}\nGood calls: ${result}/${history.length}\n${history.map((h,i)=>`${i+1}. ${h.guest}: ${h.choice.toUpperCase()} — ${h.correct?"GOOD CALL":"BETTER: "+h.best.toUpperCase()}`).join("\n")}\n\nNot everyone who walks in wants something fixed.\nctrl+love — instruments for human judgement`;
  const copy=async()=>{try{await navigator.clipboard.writeText(receipt);setCopied(true);}catch{setCopied(false);}};
  return <main className="ddc">
    <div className="grain" aria-hidden="true"/>
    <header className="top"><a href="/" className="brand">ctrl+love</a><span>INSTRUMENT NO. 08 / SOCIAL JUDGEMENT</span></header>
    <div className="layout">
      <section className="intro"><div className="eyebrow">SAVANNAH'S BAR · EXPERIMENTAL</div><h1>THE DRINK<br/>DECISION<br/><em>COLLIDER.</em></h1><p className="thesis">Not everyone who walks in wants something fixed.</p><p className="lead">Five guests. Three possible moves. One surprisingly difficult question: <strong>When should you stop trying to be useful?</strong></p><p className="fine">No alcohol required. No AI inference is performed here: this is a playable, rule-based prototype of social judgement.</p></section>
      <section className="bar" aria-live="polite">
        <div className="barTop"><span>THE BAR / OPEN</span><span>{String(index+1).padStart(2,"0")} / {String(scenarios.length).padStart(2,"0")}</span></div>
        <div className="orb" aria-hidden="true"><div className="shine"/></div>
        <p className="guest">{current.guest}</p>
        <blockquote>“{current.line}”</blockquote>
        <p className="sub">{current.sub}</p>
        <div className="divider"/>
        <p className="prompt">{answered?"SAVANNAH'S VERDICT":"WHAT SHOULD SAVANNAH DO?"}</p>
        {!answered ? <div className="choices">{options.map(o=><button type="button" key={o.id} onClick={()=>decide(o.id)}><b>{o.title}</b><small>{o.note}</small><span aria-hidden="true">↗</span></button>)}</div> :
          <div className="verdict"><div className={"status "+(choice===current.best?"correct":"miss")}>{choice===current.best?"GOOD INSTINCT":"NOT QUITE THE MOMENT"}</div><p className="answer">“{current.response}”</p><p>{current.reasoning}</p>{choice!==current.best&&<p className="correction">Better move: <b>{current.best.toUpperCase()}</b>. {current.caution}</p>}<button className="next" type="button" onClick={next}>{history.length>=scenarios.length?"ANOTHER ROUND":"NEXT GUEST"} <span>→</span></button></div>}
      </section>
    </div>
    <footer><div><span className="footerLabel">THE RECEIPT</span><strong>{result} / {history.length}</strong><span>good calls</span></div><p>Sometimes the smartest thing at a bar is to leave the toolkit behind.</p><div className="actions"><button type="button" disabled={!history.length} onClick={copy}>{copied?"COPIED ✓":"COPY RECEIPT"}</button><button type="button" onClick={restart}>RESET ↺</button></div></footer>
    <style jsx>{`
      .ddc{position:relative;min-height:100svh;background:#151716;color:#f1ede3;font-family:Arial,Helvetica,sans-serif;overflow:hidden}.grain{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent 0 3px,#ffffff05 4px 5px);opacity:.32}.top{position:relative;display:flex;align-items:center;justify-content:space-between;padding:25px clamp(20px,5vw,76px);border-bottom:1px solid #474944;gap:20px}.top span,.eyebrow,.barTop,.prompt,.guest,.footerLabel{font-size:10px;font-weight:700;letter-spacing:.16em}.top span{color:#a7aca6}.brand{color:#f1ede3;text-decoration:none;font-size:22px;font-weight:700;letter-spacing:-.06em}.layout{position:relative;display:grid;grid-template-columns:1fr 1fr;max-width:1500px;margin:auto;min-height:660px}.intro{padding:clamp(35px,6vw,90px) clamp(20px,5vw,76px)}.eyebrow{color:#c4a67b;margin-bottom:40px}.intro h1{font-size:clamp(52px,6vw,102px);line-height:.91;letter-spacing:-.075em;margin:0 0 33px;font-weight:700}.intro h1 em{font-family:Georgia,serif;font-weight:400;color:#d3ad7f}.thesis{font:italic clamp(22px,2.3vw,35px)/1.2 Georgia,serif;max-width:510px}.lead{font-size:16px;line-height:1.65;color:#b8bdb7;max-width:460px}.lead strong{color:#f1ede3}.fine{font-size:12px;line-height:1.5;color:#838b85;margin-top:30px;max-width:440px}.bar{background:#e9e2d5;color:#171917;min-height:650px;padding:clamp(25px,4vw,58px);display:flex;flex-direction:column}.barTop{display:flex;justify-content:space-between;color:#66665d}.orb{width:112px;height:112px;border-radius:50%;align-self:center;margin:33px 0 34px;background:radial-gradient(circle at 32% 22%,#f2f2eb 0%,#aeb2ad 18%,#555c5a 38%,#0f1716 60%,#919a95 78%,#343b39 100%);box-shadow:12px 15px 35px #2224,inset -12px -8px 18px #070c0c99}.guest{color:#7c6d57}.bar blockquote{margin:18px 0 16px;font:clamp(28px,3vw,46px)/1.13 Georgia,serif;letter-spacing:-.025em}.sub{color:#686e66;font:italic 16px Georgia,serif}.divider{height:1px;background:#b4ae9f;margin:24px 0}.prompt{color:#85735a}.choices{display:grid;gap:9px}.choices button{font:inherit;text-align:left;padding:16px 18px;border:1px solid #b8b0a3;background:#f4f0e8;color:#171917;display:grid;grid-template-columns:1fr auto;cursor:pointer;transition:background .2s}.choices button:hover,.choices button:focus-visible{background:#d3b58a;outline:2px solid transparent}.choices b{letter-spacing:.1em;font-size:14px}.choices small{grid-column:1;color:#656963;padding-top:7px;font-size:12px}.choices span{grid-column:2;grid-row:1 / 3}.verdict{font-size:15px;line-height:1.5}.status{font-size:11px;letter-spacing:.14em;font-weight:700}.correct{color:#266247}.miss{color:#a34b30}.answer{font:italic 27px/1.22 Georgia,serif;margin:14px 0}.correction{border-left:2px solid #a34b30;padding-left:12px}.next{margin-top:12px;width:100%;padding:17px 20px;background:#1c211e;color:#fff;border:0;text-align:left;display:flex;justify-content:space-between;font-weight:700;letter-spacing:.1em;cursor:pointer}footer{position:relative;display:flex;align-items:center;gap:30px;justify-content:space-between;border-top:1px solid #474944;padding:22px clamp(20px,5vw,76px)}footer>div:first-child{display:flex;align-items:baseline;gap:12px}footer strong{font-size:26px}footer p{max-width:370px;color:#aeb4ac;font:italic 16px Georgia,serif}.actions{display:flex;gap:8px}.actions button{cursor:pointer;background:transparent;border:1px solid #747c72;padding:12px 15px;color:#f1ede3;font-size:11px;font-weight:700;letter-spacing:.07em}.actions button:disabled{opacity:.3;cursor:not-allowed}@media(max-width:850px){.layout{grid-template-columns:1fr}.intro{padding-bottom:35px}.bar{min-height:580px}.intro h1{font-size:clamp(53px,12vw,94px)}.eyebrow{margin-bottom:26px}footer{flex-wrap:wrap}.top span{font-size:8px}.orb{margin:22px 0 15px;width:85px;height:85px}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}
    `}</style>
  </main>;
}
