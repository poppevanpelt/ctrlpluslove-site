"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";

const SAVANNAH_ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const VAPI_PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const SAVANNAH_AVATAR = "/savannah-avatar.jpg?v=0060d14c";

type CallState = "idle" | "requesting-mic" | "connecting" | "live" | "error";

export function SavannahWidget() {
  const vapiRef = useRef<Vapi | null>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    const onCallStart = () => {
      setCallState("live");
      setErrorText("");
    };

    const onCallEnd = () => {
      setCallState("idle");
    };

    const onError = (error: unknown) => {
      console.error("Savannah Vapi error", error);
      setCallState("error");
      setErrorText("The line dropped. Try me again.");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("error", onError);

    return () => {
      try {
        vapi.stop();
      } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const requestMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("MIC_UNSUPPORTED");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      throw new Error("MIC_DENIED");
    }
  };

  const toggleCall = async () => {
    const vapi = vapiRef.current;
    if (!vapi || callState === "connecting" || callState === "requesting-mic") return;

    if (callState === "live") {
      vapi.stop();
      return;
    }

    setErrorText("");

    try {
      setCallState("requesting-mic");
      await requestMicrophone();

      setCallState("connecting");
      await vapi.start(
        SAVANNAH_ASSISTANT_ID,
        {
          customerJoinTimeoutSeconds: 45,
        } as any,
      );
    } catch (error) {
      console.error("Savannah call start failed", error);
      setCallState("error");

      const message = error instanceof Error ? error.message : "";
      if (message === "MIC_DENIED") {
        setErrorText("I need the microphone. Allow it for ctrlpluslove.com, then try again.");
      } else if (message === "MIC_UNSUPPORTED") {
        setErrorText("This browser isn't giving me a microphone.");
      } else {
        setErrorText("The line dropped. Try me again.");
      }
    }
  };

  const buttonLabel =
    callState === "requesting-mic"
      ? "Allow microphone…"
      : callState === "connecting"
        ? "Opening the line…"
        : callState === "live"
          ? "End call"
          : callState === "error"
            ? "Try again"
            : "Talk to Savannah";

  const presenceLine =
    callState === "requesting-mic"
      ? "I need your microphone first."
      : callState === "connecting"
        ? "One second."
        : callState === "live"
          ? "I'm listening."
          : callState === "error"
            ? errorText
            : "Morning. What are we trying to decide?";

  const busy = callState === "connecting" || callState === "requesting-mic";

  return (
    <aside
      aria-label="Savannah, ctrl+love employee #4"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 2147483001,
        width: "min(360px, calc(100vw - 36px))",
        border: "1px solid rgba(21,21,21,.22)",
        background: "rgba(245,241,231,.97)",
        color: "#151515",
        boxShadow: "0 16px 44px rgba(0,0,0,.14)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "88px 1fr",
          minHeight: 112,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            borderRight: "1px solid rgba(21,21,21,.18)",
            background: "#e9e4d8",
          }}
        >
          <img
            src={SAVANNAH_AVATAR}
            alt="Savannah"
            width={176}
            height={224}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 112,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            minWidth: 0,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "13px 14px 12px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
                Savannah
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  opacity: 0.48,
                  whiteSpace: "nowrap",
                }}
              >
                employee #4
              </div>
            </div>

            <div
              style={{
                marginTop: 6,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 9,
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                opacity: 0.58,
              }}
            >
              intelligent front door
            </div>
          </div>

          <p
            aria-live="polite"
            style={{
              margin: "14px 0 0",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.28,
              letterSpacing: "-.01em",
            }}
          >
            {presenceLine}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleCall}
        disabled={busy}
        aria-label={buttonLabel}
        style={{
          display: "flex",
          width: "100%",
          minHeight: 46,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          appearance: "none",
          border: 0,
          borderTop: "1px solid rgba(21,21,21,.22)",
          borderRadius: 0,
          padding: "0 14px",
          background: callState === "live" ? "#f5f1e7" : "#151515",
          color: callState === "live" ? "#151515" : "#f5f1e7",
          font: "inherit",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".11em",
          lineHeight: 1,
          textTransform: "uppercase",
          cursor: busy ? "default" : "pointer",
          opacity: busy ? 0.68 : 1,
        }}
      >
        <span>{buttonLabel}</span>
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            flex: "0 0 auto",
            background: "#ff5a2a",
          }}
        />
      </button>
    </aside>
  );
}
