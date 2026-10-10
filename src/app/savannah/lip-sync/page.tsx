"use client";

import { useEffect, useRef, useState } from "react";
import type { SimliClient } from "simli-client/dist/client";
import { voiceToPcm16 } from "../../savannah-live-pcm";

const TEST_LINE = "Boris. Before we begin… five minutes, maybe? Perfect. What would you like to make?";
type Line = { role: "user" | "assistant"; text: string };

export default function SavannahLipSyncTest() {
  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const client = useRef<SimliClient | null>(null);
  const abort = useRef<AbortController | null>(null);
  const epoch = useRef(0);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [access, setAccess] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Ready for a live face test.");
  const [question, setQuestion] = useState("");
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/savannah/live-session", { signal: controller.signal, cache: "no-store" }).then(r => r.json()).then(s => setConfigured(s.configured === true)).catch(() => setConfigured(false));
    return () => { controller.abort(); epoch.current++; abort.current?.abort(); if (finishTimer.current) clearTimeout(finishTimer.current); void client.current?.stop(); };
  }, []);

  function interrupt() {
    epoch.current++;
    abort.current?.abort();
    if (finishTimer.current) clearTimeout(finishTimer.current);
    client.current?.ClearBuffer();
    setBusy(false);
    setStatus("Listening.");
  }

  async function connect() {
    if (busy || client.current || !video.current || !audio.current) return;
    setBusy(true);
    setStatus("Connecting…");
    const currentEpoch = ++epoch.current;
    try {
      // Unlock the returning media audio in the user's tap gesture.
      void audio.current.play().catch(() => {});
      const response = await fetch("/api/savannah/live-session", { method: "POST", headers: { Authorization: `Bearer ${access}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not connect.");
      if (currentEpoch !== epoch.current) return;
      // v3.0.2's package entry has a case mismatch on Linux. Import the
      // published implementation directly; its types and runtime match.
      const { SimliClient, LogLevel } = await import("simli-client/dist/client");
      if (currentEpoch !== epoch.current || !video.current || !audio.current) return;
      const connection = new SimliClient(data.session_token, video.current, audio.current, null, LogLevel.ERROR, "livekit");
      client.current = connection;
      connection.on("start", () => { if (client.current === connection) { setReady(true); setBusy(false); setStatus("Listening."); } });
      connection.on("speaking", () => { if (client.current === connection) setStatus("Speaking."); });
      connection.on("silent", () => { if (client.current === connection) { if (finishTimer.current) clearTimeout(finishTimer.current); setBusy(false); setStatus("Listening."); } });
      const stopped = () => { if (client.current === connection) { epoch.current++; abort.current?.abort(); client.current = null; setReady(false); setBusy(false); setStatus("Session ended. Reconnect for another test."); } };
      connection.on("stop", stopped);
      connection.on("error", stopped);
      connection.on("startup_error", stopped);
      await connection.start();
      if (currentEpoch !== epoch.current) await connection.stop();
    } catch (error) {
      void client.current?.stop(); client.current = null;
      setReady(false); setBusy(false);
      setStatus(error instanceof Error ? error.message : "Could not connect.");
    }
  }

  async function voice(text: string, controller: AbortController, currentEpoch: number) {
    const response = await fetch("/api/savannah-voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }), signal: controller.signal });
    if (!response.ok) throw new Error("Savannah’s voice is unavailable.");
    const pcm = await voiceToPcm16(await response.arrayBuffer());
    if (currentEpoch !== epoch.current || !client.current) return;
    // Do not also play the MP3: the returned avatar stream owns both clocks.
    setStatus("Preparing her answer…");
    client.current.sendAudioData(pcm);
    finishTimer.current = setTimeout(() => { if (currentEpoch === epoch.current) { interrupt(); setStatus("Playback timed out. Try reconnecting."); } }, pcm.length / 32 + 15000);
  }

  async function run(questionText?: string) {
    if (!ready || busy) return;
    setBusy(true);
    const currentEpoch = ++epoch.current;
    const controller = new AbortController(); abort.current = controller;
    try {
      let text = TEST_LINE;
      if (questionText?.trim()) {
        setStatus("Thinking…");
        const messages: Line[] = [...lines, { role: "user", text: questionText.trim() }];
        const response = await fetch("/api/savannah", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }), signal: controller.signal });
        const data = await response.json();
        if (!response.ok || typeof data.text !== "string") throw new Error(data.error || "Could not answer.");
        if (currentEpoch !== epoch.current) return;
        text = data.text;
        setLines([...messages, { role: "assistant", text }]); setQuestion("");
      }
      await voice(text, controller, currentEpoch);
    } catch (error) {
      if (currentEpoch === epoch.current) { setBusy(false); setStatus(error instanceof Error ? error.message : "Could not speak."); }
    }
  }

  return <main style={{ minHeight: "100dvh", background: "#1b1917", color: "#f1eade", padding: 24, display: "grid", placeItems: "center" }}>
    <section style={{ width: "min(100%, 700px)" }}>
      <h1 style={{ fontSize: 24 }}>Savannah · live face test</h1>
      <div style={{ position: "relative", aspectRatio: "3 / 4", maxHeight: "65vh", background: "#272421", overflow: "hidden" }}>
        <video ref={video} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        {!ready && <p style={{ position: "absolute", inset: 20 }}>{configured === false ? "The live face connection is awaiting setup." : status}</p>}
      </div>
      <audio ref={audio} autoPlay />
      <p role="status" aria-live="polite">{status}</p>
      {!ready && <><label>Test access <input type="password" value={access} onChange={e => setAccess(e.target.value)} autoComplete="off" /></label> <button disabled={!configured || busy || !access} onClick={() => void connect()}>Connect</button></>}
      {ready && <>
        <button disabled={busy} onClick={() => void run()}>Try the sound test</button>{" "}
        <button onClick={interrupt}>Interrupt</button>{" "}
        <button onClick={() => { interrupt(); void client.current?.stop(); }}>End session</button>
        <form onSubmit={e => { e.preventDefault(); void run(question); }} style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <input aria-label="Ask Savannah" placeholder="Ask Savannah something" value={question} onChange={e => setQuestion(e.target.value)} maxLength={1000} style={{ flex: 1 }} />
          <button disabled={busy || !question.trim()}>Ask</button>
        </form>
      </>}
      <p style={{ opacity: 0.65, fontSize: 13 }}>Two-minute test. Her voice and face arrive together in one stream.</p>
      <a href="/savannah" style={{ color: "inherit" }}>Back to Savannah</a>
    </section>
  </main>;
}
