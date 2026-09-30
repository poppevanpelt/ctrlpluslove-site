"use client";

import Script from "next/script";
import { createElement, useState } from "react";

const SAVANNAH_ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const VAPI_PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const SAVANNAH_AVATAR = "/savannah-avatar.jpg";

type MicState = "idle" | "requesting" | "ready" | "denied" | "unsupported";

export function SavannahWidget() {
  const [micState, setMicState] = useState<MicState>("idle");

  const enableMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState("unsupported");
      return;
    }

    setMicState("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicState("ready");
    } catch {
      setMicState("denied");
    }
  };

  const micLabel =
    micState === "requesting"
      ? "Opening microphone…"
      : micState === "denied"
        ? "Allow microphone"
        : micState === "unsupported"
          ? "Microphone unavailable"
          : "Talk to Savannah";

  return (
    <>
      <Script
        src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
        strategy="afterInteractive"
      />

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          right: 18,
          bottom: 92,
          zIndex: 2147482999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid rgba(20,20,20,.18)",
            background: "#f5f1e7",
            boxShadow: "0 8px 28px rgba(0,0,0,.12)",
            flex: "0 0 auto",
          }}
        >
          <img
            src={SAVANNAH_AVATAR}
            alt=""
            width={76}
            height={76}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div
          style={{
            maxWidth: 210,
            padding: "9px 11px 10px",
            border: "1px solid rgba(20,20,20,.16)",
            background: "rgba(245,241,231,.96)",
            color: "#151515",
            boxShadow: "0 8px 28px rgba(0,0,0,.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>Savannah</div>
          <div
            style={{
              marginTop: 4,
              fontSize: 10,
              lineHeight: 1.25,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              opacity: 0.66,
            }}
          >
            employee #4 · intelligent front door
          </div>
        </div>
      </div>

      {micState !== "ready" ? (
        <div
          style={{
            position: "fixed",
            right: 18,
            bottom: 18,
            zIndex: 2147483001,
            display: "grid",
            justifyItems: "end",
            gap: 8,
            fontFamily: "inherit",
          }}
        >
          {(micState === "denied" || micState === "unsupported") && (
            <div
              role="status"
              style={{
                maxWidth: 250,
                padding: "8px 10px",
                borderRadius: 8,
                background: "rgba(20,20,20,.92)",
                color: "#fff",
                fontSize: 12,
                lineHeight: 1.3,
                boxShadow: "0 8px 24px rgba(0,0,0,.16)",
              }}
            >
              {micState === "denied"
                ? "Savannah needs microphone access. Allow it for ctrlpluslove.com, then try again."
                : "This browser is not exposing a microphone to the site."}
            </div>
          )}

          <button
            type="button"
            onClick={enableMicrophone}
            disabled={micState === "requesting" || micState === "unsupported"}
            style={{
              appearance: "none",
              border: 0,
              borderRadius: 999,
              padding: "13px 18px",
              background: "#151515",
              color: "#fff",
              font: "inherit",
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1,
              cursor:
                micState === "requesting" || micState === "unsupported" ? "default" : "pointer",
              opacity: micState === "requesting" || micState === "unsupported" ? 0.7 : 1,
              boxShadow: "0 8px 28px rgba(0,0,0,.18)",
            }}
          >
            {micLabel}
          </button>
        </div>
      ) : null}

      {createElement("vapi-widget", {
        "public-key": VAPI_PUBLIC_KEY,
        "assistant-id": SAVANNAH_ASSISTANT_ID,
        mode: "voice",
        theme: "dark",
        position: "bottom-right",
        size: "compact",
        "main-label": "Talk to Savannah",
        "start-button-text": "Talk to Savannah",
        "end-button-text": "End call",
        "empty-voice-message": "Savannah is listening.",
        style: {
          visibility: micState === "ready" ? "visible" : "hidden",
          pointerEvents: micState === "ready" ? "auto" : "none",
        },
      })}
    </>
  );
}
