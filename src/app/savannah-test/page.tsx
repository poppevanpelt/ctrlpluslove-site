"use client";

import Vapi from "@vapi-ai/web";
import { useRef, useState } from "react";

const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";

type TestState = "idle" | "running" | "pass" | "fail";

export default function SavannahTestPage() {
  const vapiRef = useRef<Vapi | null>(null);
  const [micState, setMicState] = useState<TestState>("idle");
  const [micDetail, setMicDetail] = useState("Not tested");
  const [vapiState, setVapiState] = useState<TestState>("idle");
  const [vapiDetail, setVapiDetail] = useState("Not tested");
  const [events, setEvents] = useState<string[]>([]);

  const log = (message: string) => {
    setEvents((prev) => [...prev.slice(-11), `${new Date().toLocaleTimeString()}  ${message}`]);
  };

  const testMicrophone = async () => {
    setMicState("running");
    setMicDetail("Requesting microphone permission…");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("navigator.mediaDevices.getUserMedia is unavailable");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = stream.getAudioTracks();
      const settings = tracks[0]?.getSettings?.() ?? {};

      setMicState("pass");
      setMicDetail(
        `PASS — ${tracks.length} audio track(s). ${tracks[0]?.label || "Microphone available"}. ${JSON.stringify(settings)}`,
      );
      log("MIC PASS");

      window.setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
      }, 1500);
    } catch (error) {
      const e = error as Error & { name?: string };
      setMicState("fail");
      setMicDetail(`FAIL — ${e?.name || "Error"}: ${e?.message || String(error)}`);
      log(`MIC FAIL: ${e?.name || "Error"}`);
    }
  };

  const testVapi = async () => {
    setVapiState("running");
    setVapiDetail("Starting Vapi web call…");
    setEvents([]);

    try {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch {}
        vapiRef.current.removeAllListeners();
      }

      const vapi = new Vapi(PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setVapiState("pass");
        setVapiDetail("PASS — Vapi call-start fired. Audio transport joined.");
        log("VAPI CALL START");
      });

      vapi.on("call-end", () => {
        log("VAPI CALL END");
      });

      vapi.on("message", (message: unknown) => {
        const m = message as { type?: string };
        log(`MESSAGE: ${m?.type || "unknown"}`);
      });

      vapi.on("error", (error: unknown) => {
        const text =
          error instanceof Error
            ? `${error.name}: ${error.message}`
            : (() => {
                try {
                  return JSON.stringify(error);
                } catch {
                  return String(error);
                }
              })();

        setVapiState("fail");
        setVapiDetail(`FAIL — ${text}`);
        log(`VAPI ERROR: ${text}`);
      });

      log("Calling vapi.start");
      await vapi.start(
        ASSISTANT_ID,
        { customerJoinTimeoutSeconds: 45 } as any,
      );
      log("vapi.start resolved");
    } catch (error) {
      const text = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      setVapiState("fail");
      setVapiDetail(`FAIL — ${text}`);
      log(`START FAILED: ${text}`);
    }
  };

  const stopVapi = () => {
    try {
      vapiRef.current?.stop();
      log("STOP REQUESTED");
    } catch {}
  };

  const badge = (state: TestState) =>
    state === "pass" ? "PASS" : state === "fail" ? "FAIL" : state === "running" ? "RUNNING" : "NOT TESTED";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f1e7",
        color: "#151515",
        padding: "32px 20px 60px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: ".14em",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          ctrl+love / Savannah diagnostic
        </div>
        <h1 style={{ fontSize: "clamp(34px, 8vw, 68px)", lineHeight: .95, margin: "0 0 18px" }}>
          FIND THE<br />BROKEN LAYER.
        </h1>
        <p style={{ maxWidth: 560, fontSize: 17, lineHeight: 1.4, marginBottom: 34 }}>
          This page changes nothing. It only checks the iPhone microphone first, then the Vapi voice transport.
        </p>

        <section style={{ borderTop: "1px solid #151515", padding: "20px 0 28px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", marginBottom: 8 }}>
            01 / MICROPHONE
          </div>
          <div style={{ fontSize: 12, opacity: .55, marginBottom: 16 }}>{badge(micState)}</div>
          <button
            onClick={testMicrophone}
            style={{
              border: 0,
              background: "#151515",
              color: "#f5f1e7",
              padding: "14px 18px",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            TEST MICROPHONE
          </button>
          <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.4, wordBreak: "break-word" }}>
            {micDetail}
          </div>
        </section>

        <section style={{ borderTop: "1px solid #151515", padding: "20px 0 28px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", marginBottom: 8 }}>
            02 / VAPI TRANSPORT
          </div>
          <div style={{ fontSize: 12, opacity: .55, marginBottom: 16 }}>{badge(vapiState)}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={testVapi}
              style={{
                border: 0,
                background: "#151515",
                color: "#f5f1e7",
                padding: "14px 18px",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              TEST VAPI
            </button>
            <button
              onClick={stopVapi}
              style={{
                border: "1px solid #151515",
                background: "transparent",
                color: "#151515",
                padding: "13px 18px",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              STOP
            </button>
          </div>
          <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.4, wordBreak: "break-word" }}>
            {vapiDetail}
          </div>
        </section>

        <section style={{ borderTop: "1px solid #151515", paddingTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", marginBottom: 12 }}>
            EVENT LOG
          </div>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
              fontSize: 12,
              lineHeight: 1.55,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            {events.length ? events.join("\n") : "No events yet."}
          </pre>
        </section>
      </div>
    </main>
  );
}
