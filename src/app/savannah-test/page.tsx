"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";
import { SAVANNAH_BRIEFING } from "../savannah-briefing";

const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";

type LogLine = { at: string; label: string; detail?: string };

function stamp() {
  return new Date().toLocaleTimeString([], { hour12: false });
}

function stringify(value: unknown) {
  try {
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export default function SavannahTestPage() {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState("idle");
  const [micLevel, setMicLevel] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([
    { at: stamp(), label: "READY", detail: "Tap START TEST." },
  ]);

  const add = (label: string, detail?: unknown) => {
    setLogs((prev) => [
      ...prev.slice(-24),
      { at: stamp(), label, detail: detail === undefined ? undefined : stringify(detail).slice(0, 500) },
    ]);
  };

  useEffect(() => {
    const vapi = new Vapi(PUBLIC_KEY, undefined, { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true }, { startAudioOff: false });
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setStatus("live");
      try { vapi.setMuted(false); } catch {}
      add("CALL START", { muted: vapi.isMuted() });
    });

    vapi.on("local-volume-level", (level: number) => {
      setMicLevel(level);
    });

    vapi.on("call-end", () => {
      setStatus("ended");
      add("CALL END");
    });

    vapi.on("message", (message: unknown) => {
      const m = message as { type?: string; status?: string; endedReason?: string; transcript?: string };
      if (m?.type === "status-update") {
        add("STATUS UPDATE", { status: m.status, endedReason: m.endedReason });
      } else if (m?.type === "transcript") {
        add("TRANSCRIPT", m.transcript);
      } else {
        add("MESSAGE", message);
      }
    });

    vapi.on("error", (error: unknown) => {
      setStatus("error");
      add("ERROR", error);
    });

    const anyVapi = vapi as unknown as { on: (event: string, cb: (payload: unknown) => void) => void };
    anyVapi.on("call-start-progress", (event: unknown) => add("START PROGRESS", event));
    anyVapi.on("call-start-failed", (event: unknown) => {
      setStatus("failed");
      add("START FAILED", event);
    });

    return () => {
      try { vapi.stop(); } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const start = async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;
    setLogs([{ at: stamp(), label: "START REQUESTED" }]);
    setStatus("starting");
    try {
      await vapi.start(
        ASSISTANT_ID,
        {
          firstMessage: "Hi, Savannah at control love. What's up?",
          voice: { provider: "vapi", voiceId: "Savannah", version: 2 },
        } as any,
      );
      const mutedBefore = vapi.isMuted();
      add("START PROMISE RESOLVED", { mutedBefore });
      try { vapi.setMuted(false); } catch (error) { add("UNMUTE ERROR", error); }
      vapi.send({
        type: "add-message",
        message: { role: "system", content: SAVANNAH_BRIEFING },
      } as any);
      add("BRIEFING INJECTED");
      setStatus("live");
      add("MIC FORCED ON", { mutedAfter: vapi.isMuted() });
    } catch (error) {
      setStatus("failed");
      add("START REJECTED", error);
    }
  };

  const stop = () => {
    try {
      vapiRef.current?.stop();
      add("STOP REQUESTED");
    } catch (error) {
      add("STOP ERROR", error);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f5f1e7", color: "#151515", padding: "28px 18px 80px", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", marginBottom: 18 }}>
          CTRL+LOVE / SAVANNAH TRANSPORT DIAGNOSTIC
        </div>

        <h1 style={{ fontSize: "clamp(38px, 10vw, 72px)", lineHeight: .92, margin: "0 0 18px", letterSpacing: "-.045em" }}>
          FIND THE<br />DROP.
        </h1>

        <p style={{ maxWidth: 580, fontSize: 16, lineHeight: 1.45, margin: "0 0 24px" }}>
          This page uses the same pinned Vapi web SDK as Savannah, but nothing else.
          It records each connection stage and the reason a call ends.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <button onClick={start} disabled={status === "starting" || status === "live"} style={{ border: 0, padding: "14px 18px", background: "#151515", color: "#f5f1e7", fontWeight: 700, fontSize: 14 }}>
            START TEST
          </button>
          <button onClick={stop} style={{ border: "1px solid #151515", padding: "14px 18px", background: "transparent", color: "#151515", fontWeight: 700, fontSize: 14 }}>
            STOP
          </button>
        </div>

        <div style={{ borderTop: "1px solid #151515", borderBottom: "1px solid #151515", padding: "14px 0", marginBottom: 18, fontSize: 12, letterSpacing: ".12em", fontWeight: 700 }}>
          STATE / {status.toUpperCase()} &nbsp; · &nbsp; MIC LEVEL / {micLevel.toFixed(4)}
        </div>

        <div style={{ background: "#111", color: "#f5f1e7", padding: 16, minHeight: 360, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, lineHeight: 1.5, overflowWrap: "anywhere" }}>
          {logs.map((log, i) => (
            <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
              <div style={{ opacity: .55, marginBottom: 4 }}>{log.at} / {log.label}</div>
              {log.detail ? <div>{log.detail}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
