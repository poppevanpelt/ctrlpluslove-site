"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { speakSavannahNeurally, stopSavannahLocalVoice } from "../savannah-local-voice";

type Line = { role: "assistant" | "user"; text: string };
const GREETING = "Morning. It's Savannah. I had a thought.";
const welcome: Line = { role: "assistant", text: GREETING };

export default function SavannahPage() {
  const [lines, setLines] = useState<Line[]>([welcome]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("HEAR SAVANNAH");
  const [openingLoaded, setOpeningLoaded] = useState(false);

  async function speak(text: string) {
    setVoiceMessage("OPENING THE LINE…");
    const ok = await speakSavannahNeurally(text, {
      onStart: () => { setSpeaking(true); setVoiceMessage("SAVANNAH IS SPEAKING"); },
      onEnd: () => { setSpeaking(false); setVoiceMessage("HEAR THAT AGAIN"); },
    });
    if (!ok) setVoiceMessage("AUDIO UNAVAILABLE — TRY AGAIN");
  }
  useEffect(() => () => { stopSavannahLocalVoice(); }, []);
  async function openSavannah() {
    void speak(GREETING);
    if (openingLoaded) return;
    setOpeningLoaded(true);
    try {
      const response = await fetch("/api/savannah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ messages: [{
          role: "user",
          text: "Give one short, concrete observation about the ctrl+love Meeting Filter instrument and what makes a meeting worth having. Use only approved working knowledge. Do not claim to have seen live activity, and do not invent updates or confidential client details. One or two sentences, in Savannah's dry and thoughtful style."
        }] }),
      });
      const result = await response.json().catch(() => null);
      if (response.ok && typeof result?.text === "string" && result.text.trim()) {
        setLines((previous) => [...previous, { role: "assistant", text: result.text.trim() }]);
      }
    } catch {
      // The greeting works even when contextual insight is unavailable.
    }
  }
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [lines, pending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || pending) return;
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
      if (!response.ok || typeof result?.text !== "string") {
        throw new Error(result?.error || `Chat endpoint HTTP ${response.status}`);
      }
      setLines((previous) => [...previous, { role: "assistant", text: result.text }]);
      void speak(result.text);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connection failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main id="main-content" style={{ position: "fixed", inset: 0, zIndex: 2147483000, display: "flex", flexDirection: "column", background: "#f1eee6", color: "#151515", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden" }}>
      <header style={{ flexShrink: 0, padding: "max(env(safe-area-inset-top), 12px) 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1b1b1b", color: "#f1eee6" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26 }}>Savannah.</div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", opacity: .6 }}>CTRL+LOVE / #4</div>
      </header>
      <div style={{ position: "relative", flexShrink: 0, height: "min(42svh, 390px)", minHeight: 190, overflow: "hidden", background: "#242322" }}>
        <img src="/savannah-avatar.jpg" alt="Savannah, waiting for you" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", filter: "saturate(.92)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 63%, rgba(0,0,0,.7))", pointerEvents: "none" }} />
        <p style={{ position: "absolute", bottom: 10, left: 20, right: 20, margin: 0, fontFamily: "Georgia, serif", fontSize: 24, fontStyle: "italic", color: "#f5f0e7" }}>Well, there you are.</p>
      </div>
      <button type="button" onClick={() => void openSavannah()} aria-label="Hear Savannah greet you" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, border: 0, borderBottom: "1px solid #bcb7ae", background: "#252525", color: "#f4efe6", textAlign: "left", padding: "17px 20px", cursor: "pointer" }}><span aria-hidden="true" style={{ fontSize: 23 }}>{speaking ? "◉" : "▶"}</span><span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".13em" }}>{voiceMessage}</span></button>
      <section aria-label="Conversation" aria-live="polite" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "14px 18px" }}>
        {lines.map((line, index) => (
          <div key={index} style={{ padding: "14px 0", borderBottom: "1px solid #d0cbc2", overflowWrap: "anywhere" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", opacity: .55, marginBottom: 7 }}>{line.role === "assistant" ? "SAVANNAH" : "YOU"}</div>
            <div style={{ fontSize: 19, lineHeight: 1.36, fontWeight: line.role === "user" ? 700 : 400 }}>{line.text}</div>
          </div>
        ))}
        {pending && <p>Thinking…</p>}
        {error && <p role="alert" style={{ fontSize: 14, color: "#9b3024" }}>Connection problem: {error}</p>}
        <div ref={bottom} />
      </section>
      <form onSubmit={send} style={{ display: "flex", gap: 8, padding: "12px 14px calc(12px + env(safe-area-inset-bottom))", borderTop: "1px solid #bcb7ae", flexShrink: 0 }}>
        <input aria-label="Message Savannah" autoComplete="off" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type to Savannah…" style={{ fontSize: 16, minWidth: 0, width: 0, flex: 1, border: "1px solid #aba69d", padding: "13px 11px", background: "#fff", color: "#151515" }} />
        <button type="submit" disabled={pending || !draft.trim()} style={{ flexShrink: 0, border: 0, background: "#151515", color: "#fff", padding: "0 17px", fontSize: 12, fontWeight: 800, opacity: pending || !draft.trim() ? .5 : 1 }}>SEND</button>
      </form>
    </main>
  );
}
