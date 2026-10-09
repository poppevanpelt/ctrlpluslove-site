"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { resumeSavannahAudio, speakSavannahNeurally, stopSavannahLocalVoice } from "../savannah-local-voice";

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
  const [showTranscript, setShowTranscript] = useState(false);
  const [listening, setListening] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const micChunks = useRef<Blob[]>([]);
  const voiceMonitor = useRef<(() => void) | null>(null);
  const [micStatus, setMicStatus] = useState("TAP TO TALK");
  const [needsPlayback, setNeedsPlayback] = useState(false);
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
  useEffect(() => () => { stopSavannahLocalVoice(); voiceMonitor.current?.(); recorder.current?.stop(); micStream.current?.getTracks().forEach(track => track.stop()); }, []);

  async function tapSavannah() {
    if (needsPlayback) { const played = await resumeSavannahAudio(); if (played) { setNeedsPlayback(false); setMicStatus("TAP TO TALK"); return; } }
    if (listening) { voiceMonitor.current?.(); voiceMonitor.current = null; recorder.current?.stop(); return; }
    if (pending || audioBusy) return;
    if (speaking) { stopSavannahLocalVoice(); setSpeaking(false); }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setShowTyping(true); setMicStatus("MIC UNAVAILABLE"); return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.current = stream;
      const preferred = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find(type => MediaRecorder.isTypeSupported(type));
      const capture = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      recorder.current = capture;
      micChunks.current = [];
      capture.ondataavailable = event => { if (event.data.size) micChunks.current.push(event.data); };
      capture.onstop = async () => {
        voiceMonitor.current?.(); voiceMonitor.current = null;
        stream.getTracks().forEach(track => track.stop());
        micStream.current = null;
        setListening(false);
        setMicStatus("UNDERSTANDING…");
        const blob = new Blob(micChunks.current, { type: capture.mimeType || "audio/mp4" });
        if (!blob.size) { setMicStatus("TAP TO TRY AGAIN"); return; }
        const data = new FormData();
        data.append("audio", blob, blob.type.includes("webm") ? "savannah.webm" : "savannah.m4a");
        try {
          const response = await fetch("/api/savannah-transcribe", { method: "POST", body: data });
          const result = await response.json();
          if (!response.ok || !result?.text) throw new Error(result?.error || "Could not hear you.");
          setMicStatus("TAP TO TALK");
          await ask(result.text);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "Microphone failed.");
          setMicStatus("TAP TO TRY AGAIN");
          setShowTyping(true);
        }
      };
      capture.start();
      // Light voice activity detection: only auto-send after speech was heard,
      // followed by a meaningful pause. Tapping again always sends immediately.
      try {
        const Context = window.AudioContext;
        if (Context) {
          const context = new Context();
          const source = context.createMediaStreamSource(stream);
          const analyser = context.createAnalyser();
          analyser.fftSize = 1024;
          source.connect(analyser);
          const samples = new Float32Array(analyser.fftSize);
          let heardSpeech = false;
          let speechFrames = 0;
          let silenceSince = 0;
          const startedAt = performance.now();
          let frame = 0;
          const sample = () => {
            if (capture.state !== "recording") return;
            analyser.getFloatTimeDomainData(samples);
            let power = 0;
            for (let i = 0; i < samples.length; i++) power += samples[i] * samples[i];
            const rms = Math.sqrt(power / samples.length);
            const now = performance.now();
            if (rms > 0.022) {
              speechFrames++;
              if (speechFrames >= 5) heardSpeech = true;
              silenceSince = 0;
            } else if (heardSpeech) {
              if (!silenceSince) silenceSince = now;
              if (now - silenceSince > 1500 && now - startedAt > 2200) {
                capture.stop(); return;
              }
            }
            if (now - startedAt > 25000) { capture.stop(); return; }
            frame = window.requestAnimationFrame(sample);
          };
          frame = window.requestAnimationFrame(sample);
          voiceMonitor.current = () => { window.cancelAnimationFrame(frame); source.disconnect(); void context.close(); };
        }
      } catch { /* Manual tap-to-send remains available. */ }
      setError("");
      setListening(true);
      setMicStatus("LISTENING");
    } catch {
      setError("Allow microphone access to speak with Savannah, or use the keyboard.");
      setMicStatus("MIC PERMISSION NEEDED");
      setShowTyping(true);
    }
  }
  useEffect(() => { const timer = window.setTimeout(() => setArrivalReady(true), 1450); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [lines, pending, error]);

  async function speak(text: string) {
    if (!audioEnabledRef.current) return;
    setAudioBusy(true);
    setNeedsPlayback(false);
    setMicStatus("SAVANNAH IS ANSWERING");
    setVoiceMessage("CONNECTING VOICE…");
    const ok = await speakSavannahNeurally(text, {
      onStart: () => { setSpeaking(true); setAudioBusy(false); setVoiceMessage("SAVANNAH IS SPEAKING"); setMicStatus("SAVANNAH IS SPEAKING"); },
      onEnd: () => { setSpeaking(false); setAudioBusy(false); setVoiceMessage("HEAR THAT AGAIN"); setMicStatus("TAP TO TALK"); },
    });
    if (!ok) {
      setSpeaking(false);
      setAudioBusy(false);
      setNeedsPlayback(true);
      setMicStatus("TAP TO HEAR SAVANNAH");
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
        <button type="button" className="savannah-face-tap" onClick={() => void tapSavannah()} aria-label={needsPlayback ? "Hear Savannah" : listening ? "Finish recording" : "Speak to Savannah"} />
        <img src="/savannah-avatar.jpg" alt="Savannah" />
        {/* Static portrait until muted video playback can coexist reliably with iOS voice output. */}
        <div className={"savannah-shade" + (speaking ? " is-speaking" : "")} />
        <div className={"savannah-presence" + (listening ? " is-listening" : speaking ? " is-speaking" : pending ? " is-thinking" : "")} aria-hidden="true"><span /><span /><span /></div>
        <div className={"savannah-intro" + (arrivalReady ? " is-ready" : "")} aria-hidden="true">
          <span className="savannah-eyebrow">SAVANNAH KNOWLES / CTRL+LOVE</span>
          <p>Oh. It’s you.</p>
        </div>
      </div>

      {false && <section className="savannah-controls" aria-label="Savannah voice controls">
        <button className="savannah-listen" type="button" onClick={replay} aria-label={speaking ? "Stop Savannah speaking" : "Hear Savannah"}>
          <span className="savannah-play">{speaking ? "■" : "▶"}</span>
          <span>{voiceMessage}</span>
        </button>
        <button className="savannah-sound" type="button" onClick={() => setAudioEnabled((current) => !current)} aria-label={audioEnabled ? "Mute automatic voice replies" : "Enable automatic voice replies"} aria-pressed={audioEnabled}>
          {audioEnabled ? "SOUND ON" : "SOUND OFF"}
        </button>
      </section>}

      {false && <div className="savannah-utility"><span>{pending ? "SAVANNAH IS THINKING" : speaking ? "SAVANNAH IS SPEAKING" : "SAVANNAH IS HERE"}</span><button type="button" onClick={() => setShowTranscript(current => !current)} aria-expanded={showTranscript}>{showTranscript ? "HIDE WORDS" : "SHOW WORDS"}</button></div>}
      {showTranscript && <section className="savannah-thread" aria-label="Conversation" aria-live="polite">
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
      </section>}
      {false && !showTranscript && !started && <div className="savannah-quick-start"><button type="button" disabled={pending} onClick={() => void ask("What is ctrl+love, and why should I care?")}>INTRODUCE YOURSELF</button><button type="button" disabled={pending} onClick={() => void ask("Challenge my business idea. First ask me what it is.")}>CHALLENGE ME</button></div>}
      <div className="savannah-mic-hint" aria-live="polite"><span className={listening ? "savannah-mic-live" : ""}>{micStatus}</span><button type="button" onClick={() => setShowTyping(value => !value)} aria-label="Toggle keyboard">⌨</button></div>
      {!showTranscript && error && <p className="savannah-error-compact" role="alert">{error}</p>}
      {showTyping && <form className="savannah-compose" onSubmit={send}>
        <label className="savannah-input-wrap">
          <span className="sr-only">Message Savannah</span>
          <input ref={input} autoComplete="off" aria-label="Message Savannah" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask Savannah anything…" />
        </label>
        <button type="submit" className="savannah-send" disabled={pending || !draft.trim()} aria-label="Send message">{pending ? "…" : "↑"}</button>
      </form>}
      <style jsx>{`
        .savannah-shell { position:fixed; inset:0; z-index:2147483000; display:flex; flex-direction:column; overflow:hidden; background:#eeeae1; color:#161616; font-family:Arial,Helvetica,sans-serif; }
        .savannah-topbar { padding:max(env(safe-area-inset-top),18px) 22px 14px; display:flex; flex-shrink:0; align-items:center; justify-content:space-between; background:#171717; color:#f1eee6; }
        .savannah-brand { font:normal 34px/1 Georgia,serif; letter-spacing:-.045em; }
        .savannah-brand span { color:#d7b49b; }
        .savannah-brand-right { display:flex; align-items:center; gap:8px; font-size:10px; font-weight:750; letter-spacing:.12em; color:#b8b6b1; }
        .savannah-dot { width:6px; height:6px; border-radius:50%; background:#9ab59c; }
        .savannah-mic-hint { display:flex; flex-shrink:0; justify-content:center; align-items:center; gap:12px; min-height:42px; font-size:10px; letter-spacing:.15em; font-weight:750; background:#191817; color:#f5eee3; }
        .savannah-mic-live::before { content:""; display:inline-block; width:6px; height:6px; margin-right:9px; border-radius:50%; background:#a7dfac; vertical-align:middle; }
        .savannah-mic-hint button { background:none; border:none; font-size:17px; color:#f5eee3; padding:8px; cursor:pointer; }
        .savannah-face-tap { position:absolute; inset:0; width:100%; height:100%; border:0; padding:0; background:transparent; z-index:2; cursor:pointer; touch-action:manipulation; }
        .savannah-face-tap:focus-visible { outline:3px solid #f8e3bb; outline-offset:-5px; }
        .savannah-portrait { flex:1 1 auto; min-height:0; height:auto; position:relative; background:#272421; overflow:hidden; }
        .savannah-portrait img { width:100%; height:100%; display:block; object-fit:cover; object-position:center 29%; filter:saturate(.88); animation:savannah-breathe 6.8s ease-in-out infinite; transform-origin:50% 42%; }
        .savannah-live { position:absolute; inset:0; height:100%; width:100%; object-fit:cover; object-position:center 29%; transform:scale(1); filter:saturate(.96); transition:transform 1100ms ease,filter 550ms ease; }
        .savannah-portrait.is-speaking .savannah-live { transform:scale(1.013); filter:saturate(1.03); }
        .savannah-portrait.is-thinking .savannah-live { filter:saturate(.85) brightness(.96); }
        .savannah-portrait.is-speaking .savannah-intro,.savannah-portrait.is-thinking .savannah-intro { opacity:0; }
        .savannah-shade { position:absolute; inset:0; background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.68)); pointer-events:none; transition:background 380ms ease; }
        .savannah-shade.is-speaking { background:linear-gradient(180deg,transparent 57%,rgba(0,0,0,.58)); }
        .savannah-presence { position:absolute; right:20px; bottom:23px; display:flex; align-items:center; gap:4px; height:15px; opacity:0; transition:opacity 200ms ease; pointer-events:none; }
        .savannah-presence.is-speaking,.savannah-presence.is-thinking,.savannah-presence.is-listening { opacity:.8; }
        .savannah-presence { z-index:3; }
        .savannah-presence.is-listening span { background:#b9e9c1; height:12px; }
        .savannah-presence span { width:2px; height:4px; background:#fff7e6; border-radius:2px; }
        .savannah-presence.is-speaking span { animation:savannah-voice-beat 820ms ease-in-out infinite alternate; }
        .savannah-presence.is-speaking span:nth-child(2) { animation-delay:190ms; }
        .savannah-presence.is-speaking span:nth-child(3) { animation-delay:390ms; }
        .savannah-presence.is-thinking span { opacity:.5; }
        @keyframes savannah-voice-beat { from { height:3px; } to { height:14px; } }
        .savannah-intro { position:absolute; bottom:20px; left:22px; right:22px; color:#f8f2e8; opacity:0; transform:translateY(8px); transition:opacity 750ms ease,transform 750ms ease; pointer-events:none; }
        .savannah-intro.is-ready { opacity:0; transform:translateY(0); }
        .savannah-eyebrow { font-size:10px; font-weight:700; letter-spacing:.18em; opacity:.74; }
        .savannah-intro p { font:italic 30px/1.2 Georgia,serif; margin:7px 0 0; }
        .savannah-controls { display:flex; flex-shrink:0; min-height:48px; background:#222; color:#f6f0e8; border-bottom:1px solid #55514b; }
        .savannah-listen { display:flex; align-items:center; gap:9px; flex:1; min-width:0; text-align:left; padding:8px 16px; border:0; background:none; color:inherit; font-size:11px; font-weight:800; letter-spacing:.12em; cursor:pointer; }
        .savannah-play { font-size:23px; min-width:20px; font-weight:400; }
        .savannah-sound { padding:12px 15px; flex-shrink:0; border:0; border-left:1px solid #484640; background:#222; color:#c8c1b5; font-size:9px; font-weight:800; letter-spacing:.08em; cursor:pointer; }
        .savannah-thread { flex:0 1 32svh; min-height:0; overflow-y:auto; overscroll-behavior:contain; padding:7px 22px 16px; }
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
        .savannah-compose { display:flex; gap:8px; flex-shrink:0; padding:7px 12px calc(8px + env(safe-area-inset-bottom)); border-top:1px solid #c9c2b9; background:#eeeae1; }
        .savannah-input-wrap { display:flex; flex:1; min-width:0; }
        .savannah-input-wrap input { width:100%; min-width:0; border:1px solid #bcb5ab; border-radius:4px; padding:11px 12px; font-size:16px; outline-offset:2px; background:#fcfaf6; color:#171717; }
        .savannah-send { width:57px; flex-shrink:0; border:0; border-radius:4px; background:#222; color:white; font-size:27px; cursor:pointer; }
        .savannah-send:disabled { opacity:.4; }
        .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        @keyframes savannah-breathe { 0%,100% { transform:scale(1.015) translateY(0); } 50% { transform:scale(1.032) translateY(2px); } }
        .savannah-utility { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-shrink:0; padding:7px 15px; background:#eeeae1; font-size:9px; letter-spacing:.12em; font-weight:700; color:#7c746a; }
        .savannah-utility button { border:0; background:transparent; font:inherit; letter-spacing:inherit; color:#292521; cursor:pointer; padding:5px; }
        .savannah-quick-start { display:flex; gap:8px; padding:0 12px 7px; background:#eeeae1; }
        .savannah-quick-start button { flex:1; padding:10px 7px; border:1px solid #c2b9ad; background:#f7f3ec; font-size:10px; letter-spacing:.07em; cursor:pointer; }
        .savannah-error-compact { padding:8px 15px; margin:0; font-size:12px; color:#963f34; }
        @media (max-width:767px) { .savannah-topbar { padding:calc(env(safe-area-inset-top) + 8px) 14px 9px; } .savannah-brand { font-size:24px; } .savannah-brand-right { font-size:9px; } .savannah-portrait { background:#231f1c; } .savannah-live,.savannah-portrait img { object-fit:contain; object-position:center center; } .savannah-shade { background:none!important; } .savannah-intro { display:none; } .savannah-controls { min-height:40px; } .savannah-listen { font-size:10px; } .savannah-sound { font-size:9px; padding:8px; } }
        @media (max-height:690px) { .savannah-portrait { min-height:0; } .savannah-intro p { font-size:25px; } .savannah-thread { padding-top:0; } }
        @media (prefers-reduced-motion:reduce) { * { scroll-behavior:auto!important; } .savannah-presence span { animation:none!important; } .savannah-live { transition:none!important; transform:none!important; } }
      `}</style>
    </main>
  );
}
