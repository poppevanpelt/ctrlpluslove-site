"use client";

import { useEffect, useState } from "react";

export default function IndecisiveElementsMotionStudy() {
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string[]>(["doubt", "curiosity"]);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timeout = window.setTimeout(() => setActive(false), 4600);
    return () => window.clearTimeout(timeout);
  }, [active]);

  const toggleElement = (element: string) => {
    setSelected((current) =>
      current.includes(element)
        ? current.filter((item) => item !== element)
        : [...current, element]
    );
    setActive(false);
  };

  const ready = selected.includes("doubt") && selected.includes("curiosity");
  const reactionTitle = ready
    ? "Investigation"
    : selected.includes("doubt") && selected.includes("conviction")
      ? "Test"
      : selected.includes("curiosity") && selected.includes("conviction")
        ? "Experiment"
        : selected.length > 1
          ? "A volatile balance"
          : "Choose an element";

  return (
    <main className={`study ${paused ? "is-paused" : ""} ${active ? "is-reacting" : ""}`}>
      <header className="topbar">
        <a className="wordmark" href="/">ctrl+love</a>
        <nav aria-label="Main navigation">
          <a href="/about">About</a>
          <a href="/playbook">Playbook</a>
          <a href="/foundation">ctrl+love Foundation</a>
        </nav>
      </header>

      <section className="intro">
        <p className="eyebrow">HUMAN CHEMISTRY · MOTION STUDY 001</p>
        <h1>The Table of<br />Indecisive Elements<span>™</span></h1>
        <p className="subhead">Mix. Explore. <em>Discover.</em></p>
      </section>

      <section className="workspace" aria-label="Interactive element experiment">
        <div className="element-rail" aria-label="Choose elements">
          <button
            className={`element-card doubt ${selected.includes("doubt") ? "chosen" : ""}`}
            onClick={() => toggleElement("doubt")}
            aria-pressed={selected.includes("doubt")}
          >
            <span className="card-top"><span>01</span><span className="card-mark">●</span></span>
            <span className="crystal crystal-doubt" aria-hidden="true"><i /></span>
            <span className="letter">D</span>
            <strong>DOUBT</strong>
            <small>Questions certainty.</small>
            <span className="select-note">{selected.includes("doubt") ? "SELECTED" : "SELECT"}</span>
          </button>

          <button
            className={`element-card curiosity ${selected.includes("curiosity") ? "chosen" : ""}`}
            onClick={() => toggleElement("curiosity")}
            aria-pressed={selected.includes("curiosity")}
          >
            <span className="card-top"><span>02</span><span className="card-mark">◎</span></span>
            <span className="crystal crystal-curiosity" aria-hidden="true"><i /><b /></span>
            <span className="letter">C</span>
            <strong>CURIOSITY</strong>
            <small>Opens possibilities.</small>
            <span className="select-note">{selected.includes("curiosity") ? "SELECTED" : "SELECT"}</span>
          </button>

          <button
            className={`element-card conviction ${selected.includes("conviction") ? "chosen" : ""}`}
            onClick={() => toggleElement("conviction")}
            aria-pressed={selected.includes("conviction")}
          >
            <span className="card-top"><span>03</span><span className="card-mark">ϟ</span></span>
            <span className="crystal crystal-conviction" aria-hidden="true"><i /></span>
            <span className="letter">V</span>
            <strong>CONVICTION</strong>
            <small>Creates momentum.</small>
            <span className="select-note">{selected.includes("conviction") ? "SELECTED" : "SELECT"}</span>
          </button>
        </div>

        <div className="instrument" aria-label="Animated human chemistry instrument">
          <div className="instrument-glow" />
          <div className="orbit orbit-outer"><span className="orbit-dot dot-gold" /></div>
          <div className="orbit orbit-middle"><span className="orbit-dot dot-silver" /></div>
          <div className="orbit orbit-inner"><span className="orbit-dot dot-amber" /></div>
          <div className="orbit orbit-tilt"><span className="orbit-dot dot-pink" /></div>
          <div className="core-halo" />
          <div className="core"><span /></div>
          <div className="reaction-flash" />
          <div className="reaction-caption">
            <span className="live-dot" />
            <span>{active ? "REACTION IN PROGRESS" : "HUMAN CHEMISTRY"}</span>
          </div>
          <div className="stage-floor" />
        </div>

        <aside className="reaction-panel">
          <div className="reaction-meta">
            <span><i /> REACTION 001</span>
            <span className={`status ${active ? "status-live" : ""}`}>{active ? "In motion" : ready ? "Unstable" : "Exploring"}</span>
          </div>
          <h2>{reactionTitle}</h2>
          <p className="reaction-copy">
            {ready
              ? <>Doubt questions.<br />Curiosity investigates.</>
              : selected.length > 1
                ? <>Different forces meet.<br />A new possibility emerges.</>
                : <>Select two or more elements<br />to explore their chemistry.</>}
          </p>
          <div className="mini-orbit" aria-hidden="true"><span /><i /><b /></div>
          <p className="reaction-note">
            {ready
              ? "A question becomes a direction."
              : "Human judgment stays in the loop."}
          </p>
          <button className="explore-button" onClick={() => setActive(true)} disabled={selected.length < 2}>
            Run the reaction <span aria-hidden="true">↗</span>
          </button>
        </aside>
      </section>

      <footer className="bottom-bar">
        <button className="info-button" onClick={() => setShowInfo((value) => !value)} aria-expanded={showInfo}>
          <span className="info-icon">i</span> {showInfo ? "Hide the idea" : "Discover the human chemistry"}
        </button>
        <div className="motion-controls">
          <span className="motion-label">MOTION STUDY 001</span>
          <button onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={() => { setSelected(["doubt", "curiosity"]); setActive(false); setPaused(false); }}>
            <span aria-hidden="true">↺</span> Reset
          </button>
        </div>
      </footer>
      {showInfo && (
        <div className="info-drawer">
          <strong>One question. Two forces.</strong>
          <p>Doubt alone can stop us. Curiosity alone can wander. Together, they can turn uncertainty into investigation. This is a motion study, not a verdict: the meaning stays human.</p>
        </div>
      )}

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { background: #11100f; }
        :global(body) { margin: 0; background: #11100f; }
        .study { --gold: #d5a95e; --muted: #aaa39b; min-height: 100svh; overflow: hidden; position: relative; padding: 26px clamp(20px, 4.2vw, 68px) 22px; color: #f2eee8; background: radial-gradient(ellipse at 48% 46%, #40342b 0%, #211c19 37%, #11100f 76%); font-family: Arial, Helvetica, sans-serif; }
        .study:before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .22; background: linear-gradient(115deg, transparent 25%, rgba(255,231,197,.08) 40%, transparent 58%), radial-gradient(ellipse at 15% 10%, rgba(255,255,255,.12), transparent 30%); }
        .topbar, .intro, .workspace, .bottom-bar, .info-drawer { position: relative; z-index: 1; }
        .topbar { display:flex; justify-content:space-between; align-items:center; gap:24px; }
        a { color:inherit; text-decoration:none; }
        .wordmark { font-size:19px; letter-spacing:-.7px; font-weight:650; }
        nav { display:flex; gap:clamp(16px,2.4vw,38px); color:#d3cbc2; font-size:12px; }
        nav a:hover { color:#fff; }
        .intro { margin-top: clamp(32px, 5vh, 56px); }
        .eyebrow { margin:0 0 14px; color:#c6a66f; letter-spacing:.19em; font-size:9px; }
        h1 { font-size:clamp(36px,4.4vw,64px); line-height:.99; letter-spacing:-.055em; font-weight:400; margin:0; max-width:750px; }
        h1 span { font-size:.24em; vertical-align:top; letter-spacing:0; margin-left:6px; }
        .subhead { font-size:clamp(17px,1.7vw,23px); color:#d2c8be; margin:17px 0 0; }
        .subhead em { font-style:normal; color:#e2bb62; }
        .workspace { display:grid; grid-template-columns:minmax(0,1.7fr) minmax(210px,.7fr); gap:clamp(24px,4vw,66px); align-items:center; max-width:1500px; margin: 26px auto 0; }
        .element-rail { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:clamp(10px,2vw,26px); align-self:start; }
        .element-card { position:relative; overflow:hidden; min-width:0; min-height:270px; border:1px solid rgba(255,255,255,.28); border-radius:8px; color:#f4f0ea; background:linear-gradient(155deg,rgba(255,255,255,.12),rgba(255,255,255,.025) 50%,rgba(0,0,0,.25)),rgba(28,26,25,.54); box-shadow:0 14px 36px rgba(0,0,0,.2), inset 0 0 20px rgba(255,255,255,.025); padding:14px 12px 12px; display:flex; align-items:center; flex-direction:column; cursor:pointer; transition:border-color .3s, transform .3s, box-shadow .3s; text-align:center; }
        .element-card:hover { transform:translateY(-4px); }
        .element-card.chosen { border-color:rgba(229,197,144,.85); box-shadow:0 0 0 1px rgba(218,178,105,.12),0 14px 36px rgba(0,0,0,.25),inset 0 0 24px rgba(255,255,255,.04); }
        .curiosity { background:linear-gradient(155deg,rgba(206,146,51,.28),rgba(255,255,255,.035) 48%,rgba(0,0,0,.3)),rgba(44,33,20,.6); }
        .conviction { background:linear-gradient(155deg,rgba(202,36,73,.22),rgba(255,255,255,.025) 48%,rgba(0,0,0,.3)),rgba(42,22,25,.6); }
        .card-top { width:100%; display:flex; justify-content:space-between; color:#e5ded5; font-size:12px; }
        .card-mark { color:#e9d9bd; font-size:17px; line-height:12px; }
        .crystal { width:84px; height:84px; margin:20px auto 7px; position:relative; display:block; transform:rotate(45deg); border:1px solid rgba(255,255,255,.7); clip-path:polygon(50% 0,100% 35%,78% 100%,22% 100%,0 35%); filter:drop-shadow(0 0 12px rgba(255,255,255,.18)); }
        .crystal:before { content:""; position:absolute; inset:0; background:linear-gradient(130deg,rgba(255,255,255,.88),rgba(255,255,255,.05) 24%,rgba(12,14,20,.75) 50%,rgba(255,255,255,.2)); }
        .crystal:after { content:""; position:absolute; inset:12px 12px 0 0; border:1px solid rgba(255,255,255,.35); transform:skew(-12deg,-8deg); }
        .crystal i { position:absolute; inset:0; background:linear-gradient(45deg,transparent 40%,rgba(255,255,255,.65),transparent 56%); opacity:.5; }
        .crystal-curiosity { border-radius:50%; clip-path:none; transform:rotate(30deg); border:7px double #f6c36b; background:linear-gradient(135deg,rgba(255,218,130,.95),rgba(157,92,20,.45) 38%,rgba(255,255,255,.5) 55%,rgba(126,68,18,.8)); box-shadow:inset 0 0 0 7px rgba(255,245,204,.3),0 0 20px rgba(230,164,57,.24); }
        .crystal-curiosity:before { inset:14px; border:3px solid rgba(255,239,197,.8); border-radius:50%; background:transparent; }
        .crystal-curiosity:after { inset:25px -9px; border:3px solid rgba(255,228,165,.8); border-radius:50%; transform:rotate(65deg); }
        .crystal-conviction { background:linear-gradient(135deg,#ffd2d9,#c81e42 36%,#500c20 62%,#ff4b6a); border-color:#ffb6c3; }
        .crystal-conviction:before { background:linear-gradient(135deg,rgba(255,255,255,.9),transparent 25%,rgba(255,36,79,.6) 50%,rgba(40,0,12,.8)); }
        .letter { font-size:28px; line-height:1; font-weight:300; margin:8px 0 5px; }
        .element-card strong { font-size:11px; letter-spacing:.02em; font-weight:600; }
        .element-card small { font-size:10px; margin-top:7px; color:#d2c9c0; }
        .select-note { font-size:8px; letter-spacing:.15em; margin-top:13px; color:#cba96c; opacity:.85; }
        .instrument { height:clamp(250px,33vw,420px); min-height:250px; width:100%; position:relative; grid-column:1; grid-row:2; margin-top:-8px; perspective:700px; }
        .instrument-glow { position:absolute; width:78%; height:58%; top:20%; left:11%; border-radius:50%; background:radial-gradient(ellipse,rgba(220,166,82,.14),rgba(203,121,63,.04) 45%,transparent 72%); filter:blur(8px); }
        .orbit { position:absolute; left:50%; top:47%; border:1px solid rgba(222,192,149,.5); border-radius:50%; transform-style:preserve-3d; box-shadow:0 0 12px rgba(255,217,162,.04); }
        .orbit-outer { width:86%; height:54%; transform:translate(-50%,-50%) rotate(-24deg); border-color:rgba(202,176,141,.58); }
        .orbit-middle { width:72%; height:70%; transform:translate(-50%,-50%) rotate(58deg); border-color:rgba(223,204,175,.65); }
        .orbit-inner { width:56%; height:91%; transform:translate(-50%,-50%) rotate(32deg); border-color:rgba(191,151,99,.6); }
        .orbit-tilt { width:79%; height:43%; transform:translate(-50%,-50%) rotate(13deg); border-color:rgba(255,229,189,.45); }
        .orbit-dot { position:absolute; width:15px; height:15px; border-radius:50%; top:0; left:50%; background:radial-gradient(circle at 30% 25%,#fff,#b9b4ab 24%,#37312c 70%); box-shadow:0 0 10px rgba(255,228,185,.3); }
        .dot-gold { top:18%; left:8%; background:radial-gradient(circle at 30% 25%,#fff4c7,#d9a74e 30%,#51351a 75%); }
        .dot-silver { top:75%; left:85%; }
        .dot-amber { top:48%; left:0%; }
        .dot-pink { top:85%; left:64%; background:radial-gradient(circle at 30% 25%,#ffe1e7,#d34b67 35%,#3b0c19 75%); }
        .core-halo { position:absolute; left:50%; top:47%; width:22%; aspect-ratio:1; transform:translate(-50%,-50%); border:1px solid rgba(230,197,151,.7); border-radius:50%; box-shadow:0 0 25px rgba(229,180,109,.13),inset 0 0 18px rgba(255,255,255,.09); }
        .core { position:absolute; left:50%; top:47%; width:17%; aspect-ratio:1; transform:translate(-50%,-50%); border-radius:50%; background:radial-gradient(circle at 32% 23%,#fff9ed 0%,#c9c0b3 7%,#5a5047 28%,#181615 63%,#050505 75%); box-shadow:inset -8px -10px 15px #050505, inset 4px 3px 9px rgba(255,255,255,.65),0 0 24px rgba(226,174,101,.18); }
        .core span { position:absolute; inset:7%; border-radius:50%; border:1px solid rgba(255,255,255,.14); }
        .stage-floor { position:absolute; left:8%; right:8%; bottom:7%; height:14%; border:1px solid rgba(207,169,117,.5); border-radius:50%; transform:rotateX(63deg); background:radial-gradient(ellipse,rgba(215,148,61,.17),rgba(20,16,13,.08) 50%,transparent 70%); box-shadow:0 13px 24px rgba(0,0,0,.32); }
        .reaction-caption { position:absolute; bottom:0; left:0; display:flex; gap:9px; align-items:center; color:#d7b56f; font-size:9px; letter-spacing:.14em; }
        .live-dot, .reaction-meta i { width:6px; height:6px; display:inline-block; border-radius:50%; background:#d9ad53; box-shadow:0 0 10px rgba(255,195,82,.6); }
        .reaction-panel { grid-column:2; grid-row:1 / span 2; align-self:center; padding:24px 21px; border:1px solid rgba(230,217,199,.36); border-radius:9px; background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.025)); box-shadow:0 18px 40px rgba(0,0,0,.18); backdrop-filter:blur(12px); }
        .reaction-meta { display:flex; align-items:center; justify-content:space-between; gap:8px; color:#e2b959; font-size:9px; letter-spacing:.08em; white-space:nowrap; }
        .reaction-meta span:first-child { display:flex; align-items:center; gap:7px; }
        .status { border:1px solid rgba(214,174,92,.75); border-radius:999px; padding:5px 8px; color:#e3c16d; letter-spacing:0; }
        .status-live { color:#f7e9c8; background:rgba(214,174,92,.16); }
        h2 { font-size:clamp(25px,2.3vw,34px); line-height:1.08; letter-spacing:-.04em; font-weight:400; margin:25px 0 16px; }
        .reaction-copy { color:#d9d0c6; line-height:1.8; font-size:13px; margin:0; }
        .mini-orbit { width:54px; height:36px; position:relative; margin:22px 0 14px; }
        .mini-orbit:before, .mini-orbit:after { content:""; position:absolute; width:27px; height:27px; border:1px solid #d5ad57; border-radius:50%; top:3px; left:4px; }
        .mini-orbit:after { left:20px; border-color:#e6d5b3; }
        .mini-orbit span { position:absolute; z-index:1; width:15px; height:15px; border:1px solid #d5ad57; border-radius:50%; top:9px; left:16px; background:#30271b; }
        .mini-orbit i, .mini-orbit b { position:absolute; width:6px; height:6px; border-radius:50%; background:#e2b959; top:0; left:16px; }
        .mini-orbit b { left:37px; top:24px; background:#e4d4b8; }
        .reaction-note { border-top:1px solid rgba(255,255,255,.17); padding-top:15px; color:#cfc4b8; font-size:11px; line-height:1.5; margin:0 0 18px; }
        .explore-button { width:100%; display:flex; justify-content:space-between; align-items:center; border:0; padding:0; background:none; color:#e6bd5e; font-size:12px; cursor:pointer; text-align:left; }
        .explore-button:disabled { opacity:.38; cursor:not-allowed; }
        .explore-button span { font-size:19px; transition:transform .2s; }
        .explore-button:not(:disabled):hover span { transform:translate(3px,-3px); }
        .bottom-bar { display:flex; justify-content:space-between; align-items:center; gap:18px; margin-top:4px; padding-top:16px; border-top:1px solid rgba(255,255,255,.1); color:#d2c9c0; }
        .info-button, .motion-controls button { background:none; color:inherit; border:0; cursor:pointer; display:flex; align-items:center; gap:10px; font-size:11px; padding:8px 0; }
        .info-icon { width:22px; height:22px; border:1px solid #a99d8d; border-radius:50%; display:grid; place-items:center; font-family:Georgia,serif; font-style:italic; }
        .motion-controls { display:flex; align-items:center; gap:clamp(12px,2.5vw,34px); }
        .motion-label { font-size:8px; letter-spacing:.14em; color:#92877c; }
        .motion-controls button:hover, .info-button:hover { color:#f0c867; }
        .info-drawer { margin:12px 0 0 auto; max-width:490px; padding:18px 20px; border:1px solid rgba(255,255,255,.16); border-radius:8px; background:rgba(20,18,16,.88); color:#e8dfd5; }
        .info-drawer strong { font-size:14px; font-weight:500; }
        .info-drawer p { font-size:12px; line-height:1.7; color:#c7bdb2; margin:8px 0 0; }
        .is-reacting .orbit-outer { animation:orbit-outer 4.5s cubic-bezier(.2,.6,.2,1) both; }
        .is-reacting .orbit-middle { animation:orbit-middle 4.5s cubic-bezier(.2,.6,.2,1) both; }
        .is-reacting .orbit-inner { animation:orbit-inner 4.5s cubic-bezier(.2,.6,.2,1) both; }
        .is-reacting .dot-gold { animation:hesitate 1.1s ease-in-out 3; }
        .is-reacting .dot-silver { animation:explore 2.4s ease-in-out 1; }
        .is-reacting .core-halo { animation:halo 2.2s ease-out 1; }
        .is-reacting .reaction-flash { position:absolute; left:50%; top:47%; width:28%; aspect-ratio:1; transform:translate(-50%,-50%); border-radius:50%; background:radial-gradient(circle,rgba(255,250,226,.42),rgba(223,180,103,.12) 24%,transparent 68%); animation:glint 1.8s ease-out both; pointer-events:none; }
        .is-reacting .instrument-glow { animation:glow 2.8s ease-in-out both; }
        .is-paused *, .is-paused *:before, .is-paused *:after { animation-play-state:paused !important; }
        @keyframes orbit-outer { 0%{transform:translate(-50%,-50%) rotate(-24deg)} 38%{transform:translate(-50%,-50%) rotate(4deg) scale(1.03)} 63%{transform:translate(-50%,-50%) rotate(-7deg) scale(.99)} 100%{transform:translate(-50%,-50%) rotate(-24deg)} }
        @keyframes orbit-middle { 0%{transform:translate(-50%,-50%) rotate(58deg)} 40%{transform:translate(-50%,-50%) rotate(86deg)} 72%{transform:translate(-50%,-50%) rotate(43deg)} 100%{transform:translate(-50%,-50%) rotate(58deg)} }
        @keyframes orbit-inner { 0%{transform:translate(-50%,-50%) rotate(32deg)} 30%{transform:translate(-50%,-50%) rotate(4deg)} 55%{transform:translate(-50%,-50%) rotate(22deg)} 100%{transform:translate(-50%,-50%) rotate(32deg)} }
        @keyframes hesitate { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-8px,5px)} 45%{transform:translate(5px,-3px)} 62%{transform:translate(-3px,-1px)} 80%{transform:translate(2px,2px)} }
        @keyframes explore { 0%{transform:translate(0,0)} 35%{transform:translate(-25px,-18px)} 65%{transform:translate(12px,13px)} 100%{transform:translate(0,0)} }
        @keyframes halo { 0%{box-shadow:0 0 25px rgba(229,180,109,.13)} 45%{box-shadow:0 0 50px rgba(255,225,163,.52),inset 0 0 26px rgba(255,255,255,.3)} 100%{box-shadow:0 0 25px rgba(229,180,109,.13)} }
        @keyframes glint { 0%{opacity:0;transform:translate(-50%,-50%) scale(.25)} 45%{opacity:1;transform:translate(-50%,-50%) scale(1.4)} 100%{opacity:0;transform:translate(-50%,-50%) scale(2.2)} }
        @keyframes glow { 0%,100%{opacity:1} 45%{opacity:1.7;filter:blur(12px)} }
        @media (min-width:1100px) { .workspace { grid-template-columns:minmax(0,1.7fr) minmax(220px,.7fr); } .element-rail { grid-column:1; grid-row:1; } .instrument { grid-column:1; grid-row:2; } }
        @media (max-width:900px) { .workspace { grid-template-columns:1fr; gap:16px; } .element-rail { grid-row:1; } .instrument { grid-row:2; margin:0; } .reaction-panel { grid-row:3; grid-column:1; max-width:none; } .intro { margin-top:34px; } .element-card { min-height:245px; } .instrument { height:330px; } }
        @media (max-width:560px) { .study { padding:20px 16px 18px; } .topbar { align-items:flex-start; } .wordmark { font-size:18px; } nav { gap:12px; font-size:10px; flex-wrap:wrap; justify-content:flex-end; max-width:64%; } .intro { margin-top:32px; } h1 { font-size:39px; } .subhead { margin-top:13px; } .workspace { margin-top:25px; } .element-rail { gap:8px; } .element-card { min-height:202px; padding:10px 5px 8px; border-radius:6px; } .crystal { width:56px; height:56px; margin:17px auto 5px; } .crystal-curiosity { border-width:5px; } .letter { font-size:24px; margin:5px 0 4px; } .element-card strong { font-size:9px; } .element-card small { font-size:8px; line-height:1.35; } .select-note { font-size:7px; margin-top:9px; } .instrument { height:260px; min-height:240px; } .reaction-panel { padding:19px 17px; } .bottom-bar { align-items:flex-start; flex-direction:column; margin-top:18px; } .motion-controls { width:100%; justify-content:space-between; gap:12px; } .motion-label { display:none; } .info-button { padding:0; } }
        @media (prefers-reduced-motion: reduce) { *, *:before, *:after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; transition-duration:.01ms !important; } }
      `}</style>
    </main>
  );
}
