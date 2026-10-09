"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { speakSavannahNeurally, stopSavannahLocalVoice } from "../savannah-local-voice";

type Line = { role: "assistant" | "user"; text: string };
const GREETING = "Oh. It’s you. I was just getting comfortable. What are we breaking today?";
const INITIAL: Line[] = [{ role: "assistant", text: GREETING }];

export default function SavannahPage() {
  const [lines, setLines] = useState<Line[]>(INITIAL);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [audioBusy, setAudioBusy] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceMessage, setVoiceMessage] = useState("TAP TO HEAR SAVANNAH");
  const [started, setStarted] = useState(false);
  const [videoReady, setVideoReady] = useState(true);
  const [arrivalReady, setArrivalReady] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const lastReply = useRef(GREETING);
  const audioEnabledRef = useRef(true);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
    if (!audioEnabled) {
      stopSavannahLocalVoice();
      setSpeaking(false);
      setAudioBusy(false);
    }
  }, [audioEnabled]);
  useEffect(() => () => stopSavannahLocalVoice(), []);
  useEffect(() => { const timer = window.setTimeout(() => setArrivalReady(true), 1450); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [lines, pending, error]);

  async function speak(text: string) {
    if (!audioEnabledRef.current) return;
    setAudioBusy(true);
    setVoiceMessage("CONNECTING VOICE…");
    const ok = await speakSavannahNeurally(text, {
      onStart: () => { setSpeaking(true); setAudioBusy(false); setVoiceMessage("SAVANNAH IS SPEAKING"); },
      onEnd: () => { setSpeaking(false); setAudioBusy(false); setVoiceMessage("HEAR THAT AGAIN"); },
    });
    if (!ok) {
      setSpeaking(false);
      setAudioBusy(false);
      setVoiceMessage("AUDIO UNAVAILABLE — RETRY");
    }
  }

  function replay() {
    if (speaking || audioBusy) {
      stopSavannahLocalVoice();
      setSpeaking(false);
      setAudioBusy(false);
      setVoiceMessage("HEAR THAT AGAIN");
    } else {
      setAudioEnabled(true);
      audioEnabledRef.current = true;
      void speak(lastReply.current);
    }
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await ask(draft);
  }

  async function ask(question: string) {
    const value = question.trim();
    if (!value || pending) return;
    setStarted(true);
    const next: Line[] = [...lines, { role: "user", text: value }];
    setLines(next);
    setDraft("");
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/savannah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ messages: next.slice(-18) }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.text !== "string" || !result.text.trim()) {
        throw new Error(result?.error || "Savannah could not connect. Try again.");
      }
      const reply = result.text.trim();
      lastReply.current = reply;
      setLines((previous) => [...previous, { role: "assistant", text: reply }]);
      if (audioEnabledRef.current) void speak(reply);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connection failed. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main id="main-content" className="savannah-shell">
      <header className="savannah-topbar">
        <div className="savannah-brand">Savannah<span>.</span></div>
        <div className="savannah-brand-right"><span className="savannah-dot" /> CTRL+LOVE / #4</div>
      </header>

      <div className={"savannah-portrait" + (speaking ? " is-speaking" : pending ? " is-thinking" : "")}>
        <img src="/savannah-avatar.jpg" alt="Savannah" />
        {videoReady && <video className="savannah-live" src="/savannah-idle.mp4" poster="/savannah-avatar.jpg" autoPlay muted playsInline loop preload="auto" aria-label="Savannah quietly looking toward you" onError={() => setVideoReady(false)} />}
        <div className={"savannah-shade" + (speaking ? " is-speaking" : "")} />
        <div className={"savannah-presence" + (speaking ? " is-speaking" : pending ? " is-thinking" : "")} aria-hidden="true"><span /><span /><span /></div>
        <div className={"savannah-intro" + (arrivalReady ? " is-ready" : "")}>
          <span className="savannah-eyebrow">SAVANNAH KNOWLES / CTRL+LOVE</span>
          <p>Oh. It’s you.</p>
        </div>
      </div>

      <section className="savannah-controls" aria-label="Savannah voice controls">
        <button className="savannah-listen" type="button" onClick={replay} aria-label={speaking ? "Stop Savannah speaking" : "Hear Savannah"}>
          <span className="savannah-play">{speaking ? "■" : "▶"}</span>
          <span>{voiceMessage}</span>
        </button>
        <button className="savannah-sound" type="button" onClick={() => setAudioEnabled((current) => !current)} aria-label={audioEnabled ? "Mute automatic voice replies" : "Enable automatic voice replies"} aria-pressed={audioEnabled}>
          {audioEnabled ? "SOUND ON" : "SOUND OFF"}
        </button>
      </section>

      <section className="savannah-thread" aria-label="Conversation" aria-live="polite">
        {!started && <div className="savannah-first-contact"><p className="savannah-hint">She&apos;s here. Ask her something worthwhile.</p><div className="savannah-starters"><button type="button" onClick={() => void ask("What is ctrl+love, and why should I care?")} disabled={pending}>What is ctrl+love?</button><button type="button" onClick={() => void ask("Challenge a business idea with me. Start by asking for the idea.")} disabled={pending}>Challenge my idea</button><button type="button" onClick={() => void ask("What can you actually help me do right now?")} disabled={pending}>What can you do?</button></div></div>}
        {lines.map((line, index) => (
          <div className={"savannah-line " + (line.role === "user" ? "savannah-user" : "")} key={index}>
            <span className="savannah-line-label">{line.role === "assistant" ? "SAVANNAH" : "YOU"}</span>
            <p>{line.text}</p>
          </div>
        ))}
        {pending && <p className="savannah-pending">Let me think about that…</p>}
        {error && <div role="alert" className="savannah-error">{error}<button type="button" onClick={() => setError("")}>DISMISS</button></div>}
        <div ref={bottom} />
      </section>

      <form className="savannah-compose" onSubmit={send}>
        <label className="savannah-input-wrap">
          <span className="sr-only">Message Savannah</span>
          <input ref={input} autoComplete="off" aria-label="Message Savannah" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask Savannah anything…" />
        </label>
        <button type="submit" className="savannah-send" disabled={pending || !draft.trim()} aria-label="Send message">{pending ? "…" : "↑"}</button>
      </form>
      <style jsx>{`
        .savannah-shell { position:fixed; inset:0; z-index:2147483000; display:flex; flex-direction:column; overflow:hidden; background:#eeeae1; color:#161616; font-family:Arial,Helvetica,sans-serif; }
        .savannah-topbar { padding:max(env(safe-area-inset-top),18px) 22px 14px; display:flex; flex-shrink:0; align-items:center; justify-content:space-between; background:#171717; color:#f1eee6; }
        .savannah-brand { font:normal 34px/1 Georgia,serif; letter-spacing:-.045em; }
        .savannah-brand span { color:#d7b49b; }
        .savannah-brand-right { display:flex; align-items:center; gap:8px; font-size:10px; font-weight:750; letter-spacing:.12em; color:#b8b6b1; }
        .savannah-dot { width:6px; height:6px; border-radius:50%; background:#9ab59c; }
        .savannah-portrait { height:clamp(300px,58svh,680px); position:relative; flex-shrink:0; background:#272421; overflow:hidden; }
        .savannah-portrait img { width:100%; height:100%; display:block; object-fit:cover; object-position:center 29%; filter:saturate(.88); animation:savannah-breathe 6.8s ease-in-out infinite; transform-origin:50% 42%; }
        .savannah-live { position:absolute; inset:0; height:100%; width:100%; object-fit:cover; object-position:center 29%; transform:scale(1); filter:saturate(.96); transition:transform 1100ms ease,filter 550ms ease; }
        .savannah-portrait.is-speaking .savannah-live { transform:scale(1.013); filter:saturate(1.03); }
        .savannah-portrait.is-thinking .savannah-live { filter:saturate(.85) brightness(.96); }
        .savannah-portrait.is-speaking .savannah-intro,.savannah-portrait.is-thinking .savannah-intro { opacity:0; }
        .savannah-shade { position:absolute; inset:0; background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.68)); pointer-events:none; transition:background 380ms ease; }
        .savannah-shade.is-speaking { background:linear-gradient(180deg,transparent 57%,rgba(0,0,0,.58)); }
        .savannah-presence { position:absolute; right:20px; bottom:23px; display:flex; align-items:center; gap:4px; height:15px; opacity:0; transition:opacity 200ms ease; pointer-events:none; }
        .savannah-presence.is-speaking,.savannah-presence.is-thinking { opacity:.8; }
        .savannah-presence span { width:2px; height:4px; background:#fff7e6; border-radius:2px; }
        .savannah-presence.is-speaking span { animation:savannah-voice-beat 820ms ease-in-out infinite alternate; }
        .savannah-presence.is-speaking span:nth-child(2) { animation-delay:190ms; }
        .savannah-presence.is-speaking span:nth-child(3) { animation-delay:390ms; }
        .savannah-presence.is-thinking span { opacity:.5; }
        @keyframes savannah-voice-beat { from { height:3px; } to { height:14px; } }
        .savannah-intro { position:absolute; bottom:20px; left:22px; right:22px; color:#f8f2e8; opacity:0; transform:translateY(8px); transition:opacity 750ms ease,transform 750ms ease; pointer-events:none; }
        .savannah-intro.is-ready { opacity:1; transform:translateY(0); }
        .savannah-eyebrow { font-size:10px; font-weight:700; letter-spacing:.18em; opacity:.74; }
        .savannah-intro p { font:italic 30px/1.2 Georgia,serif; margin:7px 0 0; }
        .savannah-controls { display:flex; flex-shrink:0; min-height:63px; background:#222; color:#f6f0e8; border-bottom:1px solid #55514b; }
        .savannah-listen { display:flex; align-items:center; gap:14px; flex:1; min-width:0; text-align:left; padding:12px 21px; border:0; background:none; color:inherit; font-size:11px; font-weight:800; letter-spacing:.12em; cursor:pointer; }
        .savannah-play { font-size:23px; min-width:20px; font-weight:400; }
        .savannah-sound { padding:12px 15px; flex-shrink:0; border:0; border-left:1px solid #484640; background:#222; color:#c8c1b5; font-size:9px; font-weight:800; letter-spacing:.08em; cursor:pointer; }
        .savannah-thread { flex:1; min-height:0; overflow-y:auto; overscroll-behavior:contain; padding:7px 22px 16px; }
        .savannah-hint { margin:18px 0 12px; font:italic 16px Georgia,serif; color:#746f68; }
        .savannah-starters { display:flex; gap:7px; flex-wrap:wrap; margin-bottom:6px; }
        .savannah-starters button { border:1px solid #aaa297; background:#f9f6ef; color:#292521; border-radius:999px; padding:10px 12px; font-size:12px; cursor:pointer; text-align:left; }
        .savannah-starters button:hover,.savannah-starters button:focus-visible { background:#e1d9cd; }
        .savannah-starters button:disabled { opacity:.45; }
        .savannah-line { border-bottom:1px solid #cac4bb; padding:18px 0; overflow-wrap:anywhere; }
        .savannah-line-label { font-size:10px; font-weight:800; letter-spacing:.16em; color:#817970; }
        .savannah-line p { font-size:19px; line-height:1.42; margin:10px 0 0; }
        .savannah-user p { font-weight:700; }
        .savannah-pending { font:italic 16px Georgia,serif; color:#807b74; }
        .savannah-error { display:flex; flex-direction:column; gap:10px; padding:14px 0; color:#963f34; font-size:14px; }
        .savannah-error button { align-self:start; padding:8px 0; border:0; background:none; color:inherit; font-size:10px; font-weight:700; letter-spacing:.1em; }
        .savannah-compose { display:flex; gap:8px; flex-shrink:0; padding:12px 16px calc(12px + env(safe-area-inset-bottom)); border-top:1px solid #c9c2b9; background:#eeeae1; }
        .savannah-input-wrap { display:flex; flex:1; min-width:0; }
        .savannah-input-wrap input { width:100%; min-width:0; border:1px solid #bcb5ab; border-radius:4px; padding:16px 14px; font-size:16px; outline-offset:2px; background:#fcfaf6; color:#171717; }
        .savannah-send { width:57px; flex-shrink:0; border:0; border-radius:4px; background:#222; color:white; font-size:27px; cursor:pointer; }
        .savannah-send:disabled { opacity:.4; }
        .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        @keyframes savannah-breathe { 0%,100% { transform:scale(1.015) translateY(0); } 50% { transform:scale(1.032) translateY(2px); } }
        @media (max-height:690px) { .savannah-portrait { height:34svh; min-height:170px; } .savannah-intro p { font-size:25px; } .savannah-thread { padding-top:0; } }
        @media (prefers-reduced-motion:reduce) { * { scroll-behavior:auto!important; } .savannah-presence span { animation:none!important; } .savannah-live { transition:none!important; transform:none!important; } }
      `}</style>
    </main>
  );
}
