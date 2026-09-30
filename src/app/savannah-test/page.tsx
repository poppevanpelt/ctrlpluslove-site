"use client";

import Script from "next/script";
import { createElement, useState } from "react";

const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_OVERRIDES = JSON.stringify({ customerJoinTimeoutSeconds: 45 });

type TestState = "idle" | "running" | "pass" | "fail";

export default function SavannahTestPage() {
  const [micState, setMicState] = useState<TestState>("idle");
  const [micDetail, setMicDetail] = useState("Not tested");

  const testMicrophone = async () => {
    setMicState("running");
    setMicDetail("Requesting microphone permission…");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is unavailable in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = stream.getAudioTracks();
      const label = tracks[0]?.label || "Microphone available";

      setMicState("pass");
      setMicDetail(`PASS — ${tracks.length} audio track(s). ${label}`);

      window.setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
      }, 1500);
    } catch (error) {
      const e = error as Error & { name?: string };
      setMicState("fail");
      setMicDetail(`FAIL — ${e?.name || "Error"}: ${e?.message || String(error)}`);
    }
  };

  const badge =
    micState === "pass"
      ? "PASS"
      : micState === "fail"
        ? "FAIL"
        : micState === "running"
          ? "RUNNING"
          : "NOT TESTED";

  return (
    <>
      <Script
        src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
        strategy="afterInteractive"
      />

      <main
        style={{
          minHeight: "100vh",
          background: "#f5f1e7",
          color: "#151515",
          padding: "32px 20px 120px",
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

          <h1 style={{ fontSize: "clamp(34px, 8vw, 68px)", lineHeight: 0.95, margin: "0 0 18px" }}>
            FIND THE<br />BROKEN LAYER.
          </h1>

          <p style={{ maxWidth: 560, fontSize: 17, lineHeight: 1.4, marginBottom: 34 }}>
            First test the iPhone microphone. Then use the Savannah voice widget below.
          </p>

          <section style={{ borderTop: "1px solid #151515", padding: "20px 0 28px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", marginBottom: 8 }}>
              01 / MICROPHONE
            </div>
            <div style={{ fontSize: 12, opacity: 0.55, marginBottom: 16 }}>{badge}</div>

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
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, maxWidth: 520 }}>
              If microphone is PASS, tap the Savannah widget. If that still hangs on Connecting, the fault is in the Vapi/WebRTC join rather than Safari microphone access.
            </p>
          </section>
        </div>
      </main>

      {createElement("vapi-widget", {
        "public-key": PUBLIC_KEY,
        "assistant-id": ASSISTANT_ID,
        "assistant-overrides": ASSISTANT_OVERRIDES,
        mode: "voice",
        theme: "dark",
        position: "bottom-right",
        size: "compact",
        "main-label": "Savannah test",
        "start-button-text": "Test Vapi",
        "end-button-text": "End call",
        "empty-voice-message": "Tap the microphone to start.",
        "show-transcript": "true",
      })}
    </>
  );
}
