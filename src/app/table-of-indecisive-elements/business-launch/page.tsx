"use client";

import { useMemo, useState } from "react";

type Values = {
  curiosity: number;
  doubt: number;
  conviction: number;
  trust: number;
  fear: number;
  reliability: number;
};

const initial: Values = {
  curiosity: 65,
  doubt: 45,
  conviction: 60,
  trust: 60,
  fear: 45,
  reliability: 55,
};

const controls: { key: keyof Values; title: string; question: string }[] = [
  { key: "curiosity", title: "Curiosity", question: "How much could we learn by launching?" },
  { key: "doubt", title: "Doubt", question: "How much uncertainty remains?" },
  { key: "conviction", title: "Conviction", question: "How strongly do we believe in the product?" },
  { key: "trust", title: "Trust", question: "How much confidence do we have in the team and process?" },
  { key: "fear", title: "Fear", question: "How strongly do we anticipate the downside?" },
  { key: "reliability", title: "Evidence reliability", question: "How dependable is the evidence we have?" },
];

export default function BusinessLaunchCaseStudy() {
  const [values, setValues] = useState<Values>(initial);
  const [changed, setChanged] = useState<keyof Values | null>(null);

  const score = useMemo(() => Math.round(Math.max(0, Math.min(100,
    50
    + 0.25 * (values.curiosity - 50)
    + 0.30 * (values.conviction - 50)
    + 0.20 * (values.trust - 50)
    + 0.25 * (values.reliability - 50)
    - 0.20 * (values.doubt - 50)
    - 0.25 * (values.fear - 50)
  ))), [values]);

  const result = score >= 55
    ? { title: "Explore a small launch", label: "LEAN TOWARD LAUNCH", body: "In this illustrative setup, curiosity, conviction, trust and evidence outweigh the hesitation signals. A bounded pilot could be a useful next question, not an automatic green light." }
    : score <= 45
      ? { title: "Wait and investigate", label: "LEAN TOWARD WAIT", body: "In this illustrative setup, the hesitation signals outweigh the launch signals. Identify which uncertainty matters most before deciding what evidence to gather." }
      : { title: "The model is undecided", label: "GATHER MORE EVIDENCE", body: "The score sits in the middle band. Rather than forcing a binary answer, the experiment suggests asking what new information could meaningfully change the decision." };

  function update(key: keyof Values, value: number) {
    setValues((current) => ({ ...current, [key]: value }));
    setChanged(key);
  }

  function reset() {
    setValues(initial);
    setChanged(null);
  }

  return (
    <main className="case-page">
      <header className="topbar">
        <a className="wordmark" href="/">ctrl+love</a>
        <a className="back-link" href="/table-of-indecisive-elements/">← The Table of Indecisive Elements™</a>
      </header>

      <section className="hero">
        <p className="eyebrow">CASE STUDY 002 · BUSINESS DECISION</p>
        <h1>Do we launch,<br /><em>or do we wait?</em></h1>
        <p className="lede">A promising product. Encouraging early feedback. Incomplete evidence. Explore how competing forces could shape the decision, then challenge the assumptions that produced the result.</p>
        <div className="choice-row">
          <div className="choice"><span className="choice-symbol">↗</span><div><strong>Launch now</strong><small>Learn from real customers</small></div></div>
          <div className="choice"><span className="choice-symbol">◷</span><div><strong>Wait</strong><small>Gather more evidence first</small></div></div>
        </div>
      </section>

      <section className="experiment" aria-label="Interactive business launch experiment">
        <div className="controls-panel">
          <div className="section-head"><div><p className="eyebrow">CHANGE THE CONDITIONS</p><h2>The decision field</h2></div><button className="reset" onClick={reset}>↺ Reset</button></div>
          <p className="intro-copy">Move one element at a time. Watch the output change. These values are thought-experiment inputs, not measurements of a real company.</p>
          {controls.map((control) => (
            <label className={changed === control.key ? "control changed" : "control"} key={control.key}>
              <span className="control-top"><strong>{control.title}</strong><output>{values[control.key]}</output></span>
              <small>{control.question}</small>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={values[control.key]}
                onChange={(event) => update(control.key, Number(event.target.value))}
                aria-label={control.title}
              />
            </label>
          ))}
          <p className="micro-note">Evidence reliability is separate from trust. A team can trust its evidence source and still be wrong about how reliable that source is.</p>
        </div>

        <aside className="result-panel" aria-live="polite">
          <p className="eyebrow">MODEL OUTPUT · VERSION 0.1</p>
          <div className="score-ring" style={{ "--score": score } as React.CSSProperties}><div><strong>{score}</strong><span>illustrative score</span></div></div>
          <p className="result-label">{result.label}</p>
          <h2>{result.title}</h2>
          <p className="result-copy">{result.body}</p>
          <div className="score-track"><span style={{ width: score + "%" }} /></div>
          <div className="scale"><span>WAIT</span><span>UNCERTAIN</span><span>LAUNCH</span></div>
          <div className="assumptions">
            <strong>What moved the result?</strong>
            <p>{changed ? `You last changed ${controls.find((item) => item.key === changed)?.title}. The output reflects that change plus every other value and the chosen weights.` : "Change one element to see how the recommendation responds. Then reset and try a different starting point."}</p>
          </div>
          <p className="disclaimer">This is a transparent toy model. Its weights and thresholds are arbitrary, not fitted to business outcomes or validated psychological research. It cannot tell you whether to launch.</p>
        </aside>
      </section>

      <section className="method">
        <p className="eyebrow">THE ACTUAL EXPERIMENT</p>
        <h2>Don't just watch the answer.<br /><em>Interrogate the assumptions.</em></h2>
        <div className="steps">
          <article><span>01</span><h3>Set a starting point</h3><p>Write down why each element has its initial value. Don't adjust the numbers just to get the answer you want.</p></article>
          <article><span>02</span><h3>Find the tipping point</h3><p>Change one element at a time. Record where the recommendation changes, and how much movement it took.</p></article>
          <article><span>03</span><h3>Challenge the model</h3><p>Ask whether the direction and size of the change make sense. A surprising result may reveal a bad assumption, not a human truth.</p></article>
          <article><span>04</span><h3>Compare with reality</h3><p>Eventually compare predictions with real decisions and outcomes. Until then, this is an exploration, not evidence of predictive power.</p></article>
        </div>
      </section>

      <footer><span>ctrl+love · APPLIED AI FOR HUMAN JUDGMENT</span><a href="/table-of-indecisive-elements/">Return to the interactive table ↗</a></footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) { margin:0; background:#11100f; }
        .case-page { --gold:#d5a95e; min-height:100vh; padding:26px clamp(18px,4.5vw,70px) 24px; color:#f2eee8; background:radial-gradient(ellipse at 72% 25%,#3a3028 0%,#211c19 36%,#11100f 76%); font-family:Arial,Helvetica,sans-serif; }
        a { color:inherit; text-decoration:none; }
        .topbar { display:flex; align-items:center; justify-content:space-between; gap:20px; }
        .wordmark { font-size:19px; font-weight:650; letter-spacing:-.7px; }
        .back-link { color:#d7c9b8; font-size:12px; }
        .back-link:hover, footer a:hover { color:#f1c66d; }
        .hero { max-width:920px; margin:clamp(52px,9vh,100px) auto 48px; }
        .eyebrow { margin:0 0 13px; color:#c6a66f; letter-spacing:.18em; font-size:9px; }
        h1 { margin:0; font-size:clamp(44px,7vw,86px); line-height:.98; letter-spacing:-.06em; font-weight:400; }
        h1 em, .method h2 em { color:#e2bb62; font-style:normal; }
        .lede { max-width:680px; color:#d0c6bb; font-size:clamp(15px,1.6vw,18px); line-height:1.75; margin:24px 0 30px; }
        .choice-row { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; max-width:680px; }
        .choice { display:flex; align-items:center; gap:13px; padding:17px; border:1px solid rgba(255,255,255,.16); border-radius:8px; background:rgba(255,255,255,.035); }
        .choice-symbol { display:grid; place-items:center; width:37px; height:37px; border:1px solid rgba(213,169,94,.55); border-radius:50%; color:#e2bb62; font-size:20px; }
        .choice strong, .choice small { display:block; }
        .choice strong { font-size:13px; font-weight:500; }
        .choice small { margin-top:5px; color:#a99d8d; font-size:10px; }
        .experiment { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:minmax(0,1.05fr) minmax(300px,.8fr); gap:clamp(22px,4vw,55px); align-items:start; }
        .controls-panel, .result-panel { border:1px solid rgba(230,217,199,.23); border-radius:10px; background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.018)); padding:clamp(20px,3vw,34px); }
        .section-head { display:flex; justify-content:space-between; align-items:center; gap:14px; }
        .section-head .eyebrow { margin-bottom:8px; }
        h2 { margin:0; font-size:clamp(24px,3vw,35px); line-height:1.08; font-weight:400; letter-spacing:-.04em; }
        .reset { border:1px solid rgba(255,255,255,.2); border-radius:30px; padding:8px 12px; color:#e6d7c3; background:transparent; font-size:11px; cursor:pointer; white-space:nowrap; }
        .reset:hover { border-color:#d5a95e; }
        .intro-copy { color:#c8bfb5; font-size:12px; line-height:1.7; margin:15px 0 22px; }
        .control { display:block; padding:14px 12px; margin:0 -12px; border-radius:6px; border:1px solid transparent; transition:background .2s,border-color .2s; }
        .control.changed { border-color:rgba(213,169,94,.45); background:rgba(213,169,94,.06); }
        .control-top { display:flex; justify-content:space-between; gap:10px; align-items:center; }
        .control-top strong { font-size:12px; font-weight:500; }
        output { color:#e4bd69; font-size:12px; font-variant-numeric:tabular-nums; }
        .control small { display:block; margin-top:5px; color:#a99d8d; font-size:10px; line-height:1.5; }
        input[type=range] { width:100%; margin:12px 0 0; accent-color:#d5a95e; cursor:pointer; }
        .micro-note { border-top:1px solid rgba(255,255,255,.12); padding-top:14px; color:#988d80; font-size:10px; line-height:1.65; margin:16px 0 0; }
        .result-panel { position:sticky; top:20px; }
        .score-ring { width:150px; height:150px; margin:26px auto 22px; border-radius:50%; display:grid; place-items:center; background:conic-gradient(#d5a95e calc(var(--score)*1%),rgba(255,255,255,.09) 0); position:relative; }
        .score-ring:before { content:""; position:absolute; inset:8px; border-radius:50%; background:#211c19; border:1px solid rgba(255,255,255,.12); }
        .score-ring > div { z-index:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
        .score-ring strong { font-size:43px; font-weight:400; letter-spacing:-.06em; }
        .score-ring span { color:#a99d8d; font-size:9px; }
        .result-label { text-align:center; color:#e2bb62; font-size:8px; letter-spacing:.17em; margin:0 0 10px; }
        .result-panel h2 { text-align:center; font-size:clamp(26px,3vw,34px); }
        .result-copy { min-height:82px; color:#d0c6bb; font-size:12px; line-height:1.75; text-align:center; margin:14px 0 24px; }
        .score-track { height:5px; border-radius:10px; overflow:hidden; background:rgba(255,255,255,.12); }
        .score-track span { display:block; height:100%; background:#d5a95e; transition:width .2s; }
        .scale { display:flex; justify-content:space-between; gap:6px; margin-top:8px; color:#a99d8d; font-size:8px; letter-spacing:.1em; }
        .assumptions { margin-top:24px; padding:16px; border:1px solid rgba(255,255,255,.12); border-radius:7px; background:rgba(255,255,255,.025); }
        .assumptions strong { font-size:11px; font-weight:500; }
        .assumptions p { margin:8px 0 0; color:#c8bfb5; font-size:10px; line-height:1.65; }
        .disclaimer { color:#988d80; font-size:9px; line-height:1.7; margin:18px 0 0; }
        .method { max-width:1180px; margin:88px auto 70px; padding-top:30px; border-top:1px solid rgba(255,255,255,.16); }
        .method h2 { font-size:clamp(30px,4vw,48px); }
        .steps { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-top:30px; }
        .steps article { padding:19px; border:1px solid rgba(255,255,255,.13); border-radius:7px; background:rgba(255,255,255,.025); }
        .steps article > span { color:#d5a95e; font-size:10px; letter-spacing:.12em; }
        .steps h3 { font-size:14px; font-weight:500; margin:19px 0 9px; }
        .steps p { color:#c8bfb5; font-size:11px; line-height:1.7; margin:0; }
        footer { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; padding-top:18px; border-top:1px solid rgba(255,255,255,.13); color:#a99d8d; font-size:9px; letter-spacing:.1em; }
        footer a { color:#e2bb62; font-size:11px; letter-spacing:0; }
        @media(max-width:850px) { .experiment { grid-template-columns:1fr; } .result-panel { position:static; } .result-copy { min-height:0; } .steps { grid-template-columns:repeat(2,minmax(0,1fr)); } .hero { margin-top:55px; } }
        @media(max-width:520px) { .case-page { padding:19px 15px; } .topbar { align-items:flex-start; } .back-link { max-width:60%; text-align:right; line-height:1.5; } .hero { margin:50px auto 32px; } h1 { font-size:46px; } .choice-row { grid-template-columns:1fr; } .steps { grid-template-columns:1fr; } .controls-panel, .result-panel { padding:20px 16px; } .score-ring { width:130px; height:130px; } }
        @media(prefers-reduced-motion:reduce) { *,*:before,*:after { transition-duration:.01ms !important; } }
      `}</style>
    </main>
  );
}
