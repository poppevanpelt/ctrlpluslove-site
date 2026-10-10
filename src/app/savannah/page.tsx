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
  const [speechMotion, setSpeechMotion] = useState(0);
  const [audioBusy, setAudioBusy] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceMessage, setVoiceMessage] = useState("TAP TO HEAR SAVANNAH");
  const [started, setStarted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [listening, setListening] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const recorder = useRef<MediaRecorder | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const micChunks = useRef<Blob[]>([]);
  const voiceMonitor = useRef<(() => void) | null>(null);
  const [micStatus, setMicStatus] = useState("TAP TO TALK");
  const [needsPlayback, setNeedsPlayback] = useState(false);
  const [videoReady, setVideoReady] = useState(true);
  const [arrivalReady, setArrivalReady] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);
  const [deskAuthenticated,setDeskAuthenticated] = useState(false);
  const [deskConfigured,setDeskConfigured] = useState(false);
  const [deskItems, setDeskItems] = useState<Array<{id:string;type:"note"|"conversation"|"email"|"calendar";text:string;date:string}>>([]);
  const [deskType, setDeskType] = useState<"note"|"email"|"calendar">("note");
  const [deskDraft, setDeskDraft] = useState("");
  const [deskNotice, setDeskNotice] = useState("");
  const [inboxRecipient,setInboxRecipient] = useState("Chris / BridgeFund");
  const [inboxSignal,setInboxSignal] = useState("");
  const [inboxWhy,setInboxWhy] = useState("");
  const [inboxNext,setInboxNext] = useState("");
  const [inboxSurprise,setInboxSurprise] = useState("");
  const [inboxConsent,setInboxConsent] = useState(false);
  const [inboxEvidence,setInboxEvidence] = useState("");
  const [inboxEarned,setInboxEarned] = useState("");
  const [inboxNovelty,setInboxNovelty] = useState(false);
  const [inboxApproval,setInboxApproval] = useState(false);
  const [publishRecipient,setPublishRecipient] = useState("");
  const [publishBusy,setPublishBusy] = useState(false);
  async function publishToPrivateInbox(){
    if(!inboxApproval || !inboxConsent || !signalReady || !publishRecipient.trim() || publishBusy)return;
    setPublishBusy(true);
    try{
      const response=await fetch("/api/savannah/inbox",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({recipient:publishRecipient.trim(),headline:inboxSignal,reason:inboxWhy,surprise:inboxSurprise,next_move:inboxNext,evidence:inboxEvidence,earned_interruption:inboxEarned,consent:inboxConsent,novelty:inboxNovelty,approved:inboxApproval})
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||"Publishing failed.");
      setDeskNotice("Delivered to the authenticated private inbox only. No external notification sent.");
    }catch(error){setDeskNotice(error instanceof Error?error.message:"Could not publish.");}
    finally{setPublishBusy(false);}
  }

  const signalReady = Boolean(inboxRecipient.trim() && inboxSignal.trim() && inboxWhy.trim() && inboxNext.trim() && inboxEvidence.trim() && inboxEarned.trim().length>=30 && inboxNovelty);
  const inboxPreview = `${inboxRecipient.trim() || "Recipient"}, ${inboxSignal.trim() || "a new signal"}\\n\\n${inboxWhy.trim() || "Why it matters to you…"}${inboxSurprise.trim() ? `\\n\\nThe unexpected bit: ${inboxSurprise.trim()}` : ""}\\n\\nOne next move: ${inboxNext.trim() || "A decision or useful test…"}`;

  const composeInbox = () => {
    if(!deskAuthenticated || !signalReady) return;
    const message = `PERSONAL INBOX · DRAFT ONLY
Recipient: ${inboxRecipient.trim()}\nEvidence or source: ${inboxEvidence.trim()}\nWhy this interruption is earned: ${inboxEarned.trim()}\nNovelty checked: Yes\nEditorial approval: ${inboxApproval?"APPROVED FOR FUTURE DELIVERY — still unsent":"PENDING REVIEW"}
Permission to deliver: ${inboxConsent?"Recipient opt-in indicated; still requires explicit owner approval.":"NOT CONFIRMED — DO NOT DELIVER"}
Headline: ${inboxSignal.trim()}
Why this is for you: ${inboxWhy.trim()}
Unexpected angle: ${inboxSurprise.trim() || "None supplied — do not invent an insight."}
One useful next move: ${inboxNext.trim()}
Status: UNSENT · no delivery channel connected.`;
    saveDesk("email",message);
  };

  useEffect(() => {
    void fetch("/api/savannah/auth/status",{cache:"no-store"}).then(r=>r.json()).then(s=>{setDeskAuthenticated(s.authenticated===true);setDeskConfigured(s.configured===true);if(s.authenticated===true && new URLSearchParams(window.location.search).get("desk")==="open")setDeskOpen(true);}).catch(()=>setDeskAuthenticated(false));
  }, []);
  useEffect(() => {
    if(!deskAuthenticated) return;
    try {
      const stored = JSON.parse(window.localStorage.getItem("savannah-desk-local-v1") || "[]");
      if (Array.isArray(stored)) setDeskItems(stored.filter((item) => item && typeof item.text === "string").slice(0,60));
    } catch { setDeskNotice("Local notes could not be loaded."); }
  }, [deskAuthenticated]);
  const saveDesk = (type:"note"|"conversation"|"email"|"calendar",text:string) => {
    const clean = text.trim();
    if (!clean || !deskAuthenticated) return;
    const updated = [{id:String(Date.now()),type,text:clean,date:new Date().toLocaleString()},...deskItems].slice(0,60);
    try {
      window.localStorage.setItem("savannah-desk-local-v1",JSON.stringify(updated));
      setDeskItems(updated);
      setDeskDraft("");
      setDeskNotice("Saved on this device only.");
    } catch { setDeskNotice("Could not save. Copy the text before leaving."); }
  };
  const exportDesk = () => {
    const blob = new Blob([deskItems.map(item => `[${item.date}] ${item.type.toUpperCase()}\\n${item.text}`).join("\\n\\n")],{type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href=url; anchor.download="savannah-desk-notes.txt"; anchor.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  const bottom = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const lastReply = useRef(GREETING);
  const audioEnabledRef = useRef(true);
  const steelClickPlayed = useRef(false);
  // Steel balls: a single restrained click on first interaction, never during speech.
  function steelHello() {
    if (steelClickPlayed.current) return;
    steelClickPlayed.current = true;
    try {
      const context = new AudioContext();
      void context.resume();
      [0, 0.11].forEach((delay, i) => {
        const start = context.currentTime + delay;
        const tone = context.createOscillator();
        const gain = context.createGain();
        tone.type = "sine";
        tone.frequency.setValueAtTime(i ? 1450 : 1900, start);
        tone.frequency.exponentialRampToValueAtTime(i ? 730 : 1010, start + .09);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(.014, start + .006);
        gain.gain.exponentialRampToValueAtTime(.0001, start + .14);
        tone.connect(gain);
        gain.connect(context.destination);
        tone.start(start);
        tone.stop(start + .15);
      });
      window.setTimeout(() => void context.close(), 650);
    } catch { /* Audio is optional, conversation is not. */ }
  }


  useEffect(() => {
    const onAudioLevel = (event: Event) => {
      setSpeechMotion(Math.max(0, Math.min(1, Number((event as CustomEvent<number>).detail) || 0)));
    };
    window.addEventListener("savannah-audio-level", onAudioLevel);
    return () => window.removeEventListener("savannah-audio-level", onAudioLevel);
  }, []);

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
    steelHello();
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
        <div className="savannah-brand-right"><button type="button" className="savannah-desk-trigger" onClick={() => {if(deskAuthenticated)setDeskOpen(true);else if(deskConfigured)window.location.assign("/api/savannah/auth/login");else setDeskNotice("Google sign-in setup pending: the private Desk is locked.");}}>DESK {deskItems.length ? `(${deskItems.length})` : ""}</button><span className="savannah-dot" /> CTRL+LOVE / #4</div>
      </header>

      {deskNotice && !deskOpen && <div role="status" className="savannah-lock-notice" onClick={()=>setDeskNotice("")}>{deskNotice}</div>}
      {deskOpen && deskAuthenticated && <section className="savannah-desk" role="dialog" aria-modal="true" aria-label="Savannah's Desk">
        <div className="savannah-desk-top"><strong>SAVANNAH'S DESK</strong><button type="button" onClick={() => setDeskOpen(false)} aria-label="Close desk">CLOSE ×</button></div>
        <p className="savannah-desk-disclaimer">Google account verified. Entries are still stored locally, not synced or encrypted across devices. Private to this browser on this device. Not synced, encrypted, emailed or connected to your calendar. Avoid storing confidential client details here.</p>
        <div className="savannah-desk-actions">
          <button type="button" onClick={() => saveDesk("conversation",lines.map(line=>`${line.role==="assistant"?"SAVANNAH":"YOU"}: ${line.text}`).join("\\n"))}>SAVE CURRENT CONVERSATION</button>
          <button type="button" onClick={exportDesk} disabled={!deskItems.length}>EXPORT NOTES ↓</button>
        </div>
        <label className="savannah-desk-label">NEW ENTRY
          <select value={deskType} onChange={e=>setDeskType(e.target.value as "note"|"email"|"calendar")}>
            <option value="note">Note</option><option value="email">Email draft — not sent</option><option value="calendar">Calendar proposal — not scheduled</option>
          </select>
        </label>
        <textarea rows={4} value={deskDraft} onChange={e=>setDeskDraft(e.target.value)} placeholder={deskType==="email"?"To / subject / draft message…":deskType==="calendar"?"Proposed date, time, attendees and purpose…":"What should Savannah remember?"} />
        <button type="button" className="savannah-desk-save" disabled={!deskDraft.trim()} onClick={() => saveDesk(deskType,deskDraft)}>SAVE ON THIS DEVICE</button>
        {deskNotice && <p role="status" className="savannah-desk-notice">{deskNotice}</p>}
        <section className="savannah-inbox-studio" aria-label="Personal inbox notification studio">
          <div className="savannah-inbox-heading"><span>PERSONAL INBOX</span><small>01 / SIGNAL ENGINE</small></div>
          <p>Not a newsletter. One relevant observation, one unexpected angle, one worthwhile action. Relevance beats frequency.</p>
          <label>PERSON / WORKING ROOM<input value={inboxRecipient} onChange={e=>setInboxRecipient(e.target.value)} placeholder="Name / client room" /></label>
          <label>WHAT CHANGED?<input value={inboxSignal} onChange={e=>setInboxSignal(e.target.value)} placeholder="One specific, verifiable signal" /></label>
          <label>WHY SHOULD THIS PERSON CARE?<textarea rows={2} value={inboxWhy} onChange={e=>setInboxWhy(e.target.value)} placeholder="Explain the connection to their decision or project" /></label>
          <label>THE UNEXPECTED ANGLE (OPTIONAL)<input value={inboxSurprise} onChange={e=>setInboxSurprise(e.target.value)} placeholder="A useful twist, not clickbait" /></label>
          <label>ONE NEXT MOVE<input value={inboxNext} onChange={e=>setInboxNext(e.target.value)} placeholder="A question, test or decision worth making" /></label>
          <label>WHY INTERRUPT THEM NOW?<textarea rows={2} value={inboxEarned} onChange={e=>setInboxEarned(e.target.value)} placeholder="What makes this genuinely worth their attention today? (30+ characters)" /></label>
          <label>EVIDENCE / SOURCE<input value={inboxEvidence} onChange={e=>setInboxEvidence(e.target.value)} placeholder="Where can we verify this signal?" /></label>
          <label className="savannah-inbox-consent"><input type="checkbox" checked={inboxNovelty} onChange={e=>setInboxNovelty(e.target.checked)} /> Checked: genuinely new for this recipient, not routine noise</label>
          <div className="savannah-inbox-preview"><small>RECIPIENT PREVIEW · NOT DELIVERED</small><p>{inboxPreview}</p></div>
          <label className="savannah-inbox-consent"><input type="checkbox" checked={inboxApproval} onChange={e=>setInboxApproval(e.target.checked)} /> Owner reviewed wording and approves this draft for future delivery (does not send)</label>
          <label className="savannah-inbox-consent"><input type="checkbox" checked={inboxConsent} onChange={e=>setInboxConsent(e.target.checked)} /> Recipient has agreed to receive notifications</label>
          <button type="button" className="savannah-desk-save" disabled={!signalReady} onClick={composeInbox}>SAVE UNSENT INBOX DRAFT</button>
          <label>INVITED GOOGLE ACCOUNT<input value={publishRecipient} onChange={e=>setPublishRecipient(e.target.value)} placeholder="Verified client email (must be allowlisted)" /></label>
          <button type="button" className="savannah-desk-save" disabled={!signalReady || !inboxConsent || !inboxApproval || !publishRecipient.trim() || publishBusy} onClick={()=>void publishToPrivateInbox()}>{publishBusy?"SAVING…":"PUBLISH TO PRIVATE INBOX ONLY"}</button>
          <p className="savannah-inbox-footnote">No push, email or SMS is sent. Client-specific delivery will require identity verification, explicit subscription and approval controls.</p>
        </section>
        <div className="savannah-desk-list">{deskItems.length===0?<p>No saved entries yet.</p>:deskItems.map(item=><article key={item.id}><small>{item.type.toUpperCase()} · {item.date}</small><p>{item.text}</p><button type="button" onClick={() => {const keep=deskItems.filter(entry=>entry.id!==item.id);try{localStorage.setItem("savannah-desk-local-v1",JSON.stringify(keep));setDeskItems(keep)}catch{setDeskNotice("Could not remove entry.")}}}>DELETE</button></article>)}</div>
      </section>}
      <style>{`\n        .savannah-portrait > .savannah-speech-mouth { display:none !important; }\n      `}</style>
      <div className={"savannah-portrait" + (speaking ? " is-speaking" : listening ? " is-listening" : pending ? " is-thinking" : " is-waiting")}>
        <button type="button" className="savannah-face-tap" onClick={() => void tapSavannah()} aria-label={needsPlayback ? "Hear Savannah" : listening ? "Finish recording" : "Speak to Savannah"} />
        <img src="/savannah-avatar.jpg" alt="Savannah" />
        {speaking && (
          <img
            src="/savannah-avatar.jpg"
            alt=""
            aria-hidden="true"
            className="savannah-speech-mouth"
            style={{
              transform: `scaleY(${1 + speechMotion * 0.11}) translateY(${speechMotion * 0.8}px)`,
            }}
          />
        )}
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
      <div className="savannah-mic-hint" aria-live="polite"><button type="button" className="savannah-talk-direct" onClick={() => void tapSavannah()} disabled={pending || audioBusy}>{listening ? "DONE TALKING" : needsPlayback ? "HEAR SAVANNAH" : "TALK TO SAVANNAH"}</button><span>{micStatus}</span></div>
      {!showTranscript && error && <p className="savannah-error-compact" role="alert">{error}</p>}
      {showTyping && <form className="savannah-compose" onSubmit={send}>
        <label className="savannah-input-wrap">
          <span className="sr-only">Message Savannah</span>
          <input ref={input} autoComplete="off" aria-label="Message Savannah" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask Savannah anything…" />
        </label>
        <button type="submit" className="savannah-send" disabled={pending || !draft.trim()} aria-label="Send message">{pending ? "…" : "↑"}</button>
      </form>}
      <style jsx>{`
        .savannah-lock-notice { position:absolute; top:74px; left:10px; right:10px; z-index:30; padding:13px; background:#26221e; color:#fff; text-align:center; font-size:12px; cursor:pointer; }
        .savannah-inbox-studio { max-width:720px; border-top:2px solid #1a1917; margin-top:32px; padding:22px 0; }
        .savannah-inbox-heading { display:flex; align-items:baseline; justify-content:space-between; font:24px Georgia,serif; }
        .savannah-inbox-heading small { font:10px Arial,sans-serif; letter-spacing:.12em; color:#777; }
        .savannah-inbox-preview { margin:17px 0; background:#1d1c1a; color:#f3eddf; padding:18px; white-space:pre-wrap; font:16px/1.45 Georgia,serif; }\n        .savannah-inbox-preview small { font:10px Arial,sans-serif; color:#bcb3a6; letter-spacing:.1em; }\n        .savannah-inbox-studio label { display:block; margin:15px 0; font:10px Arial,sans-serif; letter-spacing:.08em; font-weight:700; }
        .savannah-inbox-studio input:not([type=checkbox]), .savannah-inbox-studio textarea { display:block; box-sizing:border-box; width:100%; margin-top:6px; padding:12px; border:1px solid #aca59a; background:#fffcf6; color:#191817; font:15px Arial,sans-serif; }
        .savannah-inbox-studio .savannah-inbox-consent { display:flex; align-items:center; gap:9px; line-height:1.35; }
        .savannah-inbox-footnote { color:#666057; font-size:12px; }
        .savannah-desk-trigger { background:transparent; border:1px solid #706b63; color:#eee8dc; font:inherit; font-size:10px; padding:8px 10px; cursor:pointer; }
        .savannah-desk { position:absolute; z-index:40; inset:0; overflow:auto; background:#f1ede4; color:#181715; padding:calc(18px + env(safe-area-inset-top)) clamp(18px,5vw,50px) 28px; font:14px/1.45 Arial,sans-serif; }
        .savannah-desk-top { display:flex; justify-content:space-between; gap:12px; align-items:center; font-size:20px; letter-spacing:-.03em; }
        .savannah-desk-top button,.savannah-desk-actions button,.savannah-desk-save,.savannah-desk-list button { background:#191817; color:#fffaf1; border:0; padding:11px 13px; cursor:pointer; font-size:10px; letter-spacing:.07em; }
        .savannah-desk-disclaimer { max-width:660px; padding:12px 0; border-bottom:1px solid #bcb6aa; color:#635e55; }
        .savannah-desk-actions { display:flex; flex-wrap:wrap; gap:9px; margin:14px 0 18px; }
        .savannah-desk-actions button:disabled { opacity:.45; cursor:default; }
        .savannah-desk-label { display:block; font-size:11px; letter-spacing:.09em; margin-bottom:8px; }
        .savannah-desk-label select { display:block; margin-top:7px; padding:10px; max-width:100%; }
        .savannah-desk textarea { display:block; box-sizing:border-box; width:100%; max-width:720px; padding:12px; border:1px solid #a8a198; background:#fffdfa; color:#181715; font:15px/1.5 Arial,sans-serif; margin-bottom:10px; }
        .savannah-desk-save:disabled { opacity:.5; }
        .savannah-desk-notice { font-size:12px; color:#5a5349; }
        .savannah-desk-list { max-width:720px; margin-top:20px; }
        .savannah-desk-list article { border-top:1px solid #bcb6aa; padding:16px 0; }
        .savannah-desk-list small { color:#777065; letter-spacing:.08em; }
        .savannah-desk-list p { white-space:pre-wrap; overflow-wrap:anywhere; }
                .savannah-talk-direct { display:flex; align-items:center; justify-content:center; min-height:46px; border:0; background:#191919; color:#f7f0e7; padding:0 16px; font-size:12px; font-weight:750; letter-spacing:.075em; cursor:pointer; }
        .savannah-talk-direct:disabled { opacity:.5; }
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
        .savannah-portrait img:not(.savannah-speech-mouth) { width:100%; height:100%; display:block; object-fit:contain; object-position:center center; filter:saturate(.88); animation:savannah-breathe 8.8s ease-in-out infinite; transform-origin:50% 42%; transition:filter 650ms ease; }
        /* Presence first: a settled listener, a tiny thinking glance, then a
           quieter face while speaking. No fake looping mouth animation. */
        .savannah-portrait.is-thinking img:not(.savannah-speech-mouth) { animation:savannah-consider 4.6s ease-in-out infinite; filter:saturate(.85) brightness(.98); }
        .savannah-portrait.is-speaking img:not(.savannah-speech-mouth) { animation:savannah-answer 7.4s ease-in-out infinite; filter:saturate(.92); }
        .savannah-portrait.is-listening img:not(.savannah-speech-mouth) { animation:savannah-attend 6.7s ease-in-out infinite; filter:saturate(.9); }\n        @keyframes savannah-attend { 0%,100% { transform:scale(1.01) translateY(0); } 45% { transform:scale(1.017) translateY(-.09%); } }\n        @keyframes savannah-consider {
          0%,22%,74%,100% { transform:scale(1.008) translate(0,0); }
          38%,56% { transform:scale(1.013) translate(-.28%,.06%); }
        }
        @keyframes savannah-answer {
          0%,13%,31%,51%,77%,100% { transform:scale(1.009) translateY(0); }
          19%,41%,65% { transform:scale(1.013) translateY(-.11%); }
        }
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
        .savannah-intro.is-ready { opacity:1; transform:translateY(0); }
        @media (prefers-reduced-motion:reduce) { .savannah-portrait img, .savannah-portrait.is-thinking img, .savannah-portrait.is-speaking img { animation:none; } }
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
