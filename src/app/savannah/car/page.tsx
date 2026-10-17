"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { primeSavannahAudio, speakSavannahNeurally, stopSavannahLocalVoice } from "../../savannah-local-voice";

type Turn = { role: "assistant" | "user"; text: string };
type Phase = "ready" | "opening" | "listening" | "transcribing" | "thinking" | "speaking" | "error";
const HELLO = "Car mode. Eyes on the road. I’ll keep this short.";
const MAX_RECORDING_MS = 25000;

export default function SavannahCarMode() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [status, setStatus] = useState("TAP WHEN PARKED OR USE A HANDS-FREE CONTROL");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [lastReply, setLastReply] = useState(HELLO);
  const [error, setError] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timeout = useRef<number | null>(null);
  const busy = useRef(false);
  const latestTurns = useRef<Turn[]>([]);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timeout.current !== null) clearTimeout(timeout.current);
      recorder.current?.state === "recording" && recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
      stopSavannahLocalVoice();
    };
  }, []);
  const setConversation = (next: Turn[]) => {
    latestTurns.current = next;
    if (alive.current) setTurns(next);
  };
  function cleanupMic() {
    if (timeout.current !== null) clearTimeout(timeout.current);
    timeout.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    recorder.current = null;
  }
  async function speak(text: string) {
    if (!alive.current) return;
    setPhase("speaking");
    setStatus("SAVANNAH IS SPEAKING");
    const ok = await speakSavannahNeurally(text, {
      onEnd: () => { if (alive.current) { setPhase("ready"); setStatus("TAP TO TALK AGAIN"); busy.current = false; } },
    });
    if (!ok && alive.current) {
      busy.current = false;
      setPhase("error");
      setError("Audio could not play. Stop somewhere safe and try again.");
      setStatus("VOICE NEEDS A RETRY");
    }
  }
  async function sendAudio(blob: Blob) {
    if (!alive.current) return;
    setPhase("transcribing");
    setStatus("UNDERSTANDING YOU");
    try {
      const form = new FormData();
      form.append("audio", blob, blob.type.includes("webm") ? "car.webm" : "car.m4a");
      const transcription = await fetch("/api/savannah-transcribe", { method: "POST", body: form, signal: AbortSignal.timeout(35000) });
      const transcriptionData = await transcription.json().catch(() => ({}));
      if (!transcription.ok || !transcriptionData.text) throw new Error(transcriptionData.error || "Could not hear that.");
      const userText = String(transcriptionData.text).trim();
      const next: Turn[] = [...latestTurns.current, { role: "user", text: userText }].slice(-16);
      setConversation(next);
      setPhase("thinking");
      setStatus("SAVANNAH IS THINKING");
      const response = await fetch("/api/savannah", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          context: "Car Mode: The visitor may be in a car. Give a short spoken answer, usually one or two sentences. Never invite screen interaction while driving. No note-taking promises, no sending messages or vehicle controls. If the request requires attention, advise waiting until safely parked.",
        }),
        signal: AbortSignal.timeout(35000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.text !== "string") throw new Error(data.error || "Savannah could not connect.");
      const answer = data.text.trim();
      setLastReply(answer);
      setConversation([...next, { role: "assistant", text: answer }]);
      await speak(answer);
    } catch (cause) {
      if (!alive.current) return;
      busy.current = false;
      setPhase("error");
      setStatus("CONNECTION INTERRUPTED");
      setError(cause instanceof Error ? cause.message : "Connection interrupted.");
    }
  }
  async function startRecording() {
    if (busy.current) return;
    busy.current = true;
    setError("");
    setPhase("opening");
    setStatus("OPENING MICROPHONE");
    primeSavannahAudio();
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") throw new Error("Microphone unsupported on this device.");
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      if (!alive.current) { microphone.getTracks().forEach(track => track.stop()); return; }
      stream.current = microphone;
      const mime = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find((kind) => MediaRecorder.isTypeSupported(kind));
      const recording = new MediaRecorder(microphone, mime ? { mimeType: mime } : undefined);
      recorder.current = recording;
      chunks.current = [];
      recording.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      recording.onerror = () => { cleanupMic(); busy.current = false; setPhase("error"); setError("Microphone disconnected."); };
      recording.onstop = () => {
        const recorded = new Blob(chunks.current, { type: recording.mimeType || "audio/mp4" });
        cleanupMic();
        if (recorded.size) void sendAudio(recorded);
        else { busy.current = false; setPhase("ready"); setStatus("TAP TO TRY AGAIN"); }
      };
      recording.start();
      setPhase("listening");
      setStatus("LISTENING — TAP TO FINISH");
      timeout.current = window.setTimeout(() => { if (recording.state === "recording") recording.stop(); }, MAX_RECORDING_MS);
    } catch (cause) {
      cleanupMic();
      busy.current = false;
      setPhase("error");
      setStatus("MICROPHONE UNAVAILABLE");
      setError(cause instanceof Error ? cause.message : "Allow microphone access first.");
    }
  }
  function primaryAction() {
    if (phase === "listening") {
      if (recorder.current?.state === "recording") recorder.current.stop();
      return;
    }
    if (busy.current) return;
    stopSavannahLocalVoice();
    void startRecording();
  }
  function replay() {
    if (busy.current || phase === "listening") return;
    busy.current = true;
    primeSavannahAudio();
    void speak(lastReply);
  }

  const working = phase === "opening" || phase === "transcribing" || phase === "thinking" || phase === "speaking";
  return <main style={{ minHeight: "100dvh", background: "#111315", color: "#f4f2ea", padding: "max(24px, env(safe-area-inset-top)) 22px max(30px, env(safe-area-inset-bottom))", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
    <header style={{ width: "100%", maxWidth: 560, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link href="/savannah/" style={{ color: "#cbc7bd", textDecoration: "none", fontSize: 13 }}>← SAVANNAH</Link>
      <span style={{ fontSize: 12, letterSpacing: "0.18em" }}>CTRL+LOVE / CAR MODE</span>
    </header>
    <div style={{ marginTop: "auto", textAlign: "center", maxWidth: 560 }}>
      <div style={{ fontSize: 14, letterSpacing: "0.25em", color: "#a7a5a0" }}>EMPLOYEE #4 · ON THE ROAD</div>
      <h1 style={{ fontSize: "clamp(44px, 11vw, 76px)", letterSpacing: "-0.06em", margin: "12px 0" }}>Savannah<span style={{ color: "#d9ad73" }}>.</span></h1>
      <p role="status" aria-live="polite" style={{ fontSize: 15, letterSpacing: "0.11em", lineHeight: 1.5, minHeight: 46 }}>{status}</p>
    </div>
    <button type="button" onClick={primaryAction} disabled={working} aria-label={phase === "listening" ? "Finish recording" : "Start talking to Savannah"} style={{ width: "min(68vw, 265px)", height: "min(68vw, 265px)", minWidth: 190, minHeight: 190, borderRadius: "50%", border: "2px solid #d2b58e", background: phase === "listening" ? "#d6b58b" : "#292b2c", color: phase === "listening" ? "#151515" : "#f4f2ea", fontSize: 22, fontWeight: 700, cursor: working ? "not-allowed" : "pointer", opacity: working ? 0.5 : 1, boxShadow: "0 0 0 10px rgba(210,181,142,.08)" }}>{phase === "listening" ? "FINISH" : working ? "ONE MOMENT" : "TALK"}</button>
    {error && <p role="alert" style={{ maxWidth: 420, textAlign: "center", color: "#f2c3a9" }}>{error}</p>}
    <button type="button" onClick={replay} disabled={busy.current || phase === "listening"} style={{ background: "transparent", border: "1px solid #686868", color: "#ede9e0", borderRadius: 30, padding: "13px 23px", fontSize: 13 }}>↻ HEAR SAVANNAH AGAIN</button>
    <section style={{ width: "100%", maxWidth: 560, marginTop: "auto" }}>
      <button type="button" onClick={() => setShowTranscript(!showTranscript)} style={{ background: "transparent", color: "#bdbab2", border: 0, padding: "14px 0", fontSize: 13 }}>{showTranscript ? "HIDE" : "SHOW"} CONVERSATION {turns.length ? `(${turns.length})` : ""}</button>
      {showTranscript && <div aria-label="Conversation transcript" style={{ maxHeight: 180, overflowY: "auto", lineHeight: 1.5, fontSize: 14 }}>{turns.map((turn, i) => <p key={i}><strong>{turn.role === "user" ? "YOU" : "SAVANNAH"}:</strong> {turn.text}</p>)}</div>}
      <p style={{ fontSize: 12, lineHeight: 1.6, color: "#a6a39b" }}>For passengers or while safely parked. Do not touch the phone while driving. This page does not control the car, place calls or save conversations across devices.</p>
    </section>
  </main>;
}
