"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";

const SAVANNAH_ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const VAPI_PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const SAVANNAH_AVATAR = "/savannah-avatar.jpg";

type CallState = "idle" | "connecting" | "live" | "error";

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
      setErrorText("Savannah couldn't open the audio line. Tap to try again.");
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

  const toggleCall = async () => {
    const vapi = vapiRef.current;
    if (!vapi || callState === "connecting") return;

    if (callState === "live") {
      vapi.stop();
      return;
    }

    setCallState("connecting");
    setErrorText("");

    try {
      await vapi.start(SAVANNAH_ASSISTANT_ID, {
        customerJoinTimeoutSeconds: 45,
      });
    } catch (error) {
      console.error("Savannah call start failed", error);
      setCallState("error");
      setErrorText("Savannah couldn't open the audio line. Tap to try again.");
    }
  };

  const buttonLabel =
    callState === "connecting"
      ? "Connecting…"
      : callState === "live"
        ? "End call"
        : callState === "error"
          ? "Try Savannah again"
          : "Talk to Savannah";

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 18,
          bottom: 84,
          zIndex: 2147482999,
          display: "flex",
          alignItems: "center",
          gap: 10,
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
            alt="Savannah"
            width={76}
            height={76}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div
          style={{
            maxWidth: 220,
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
          {errorText ? (
            <div style={{ marginTop: 6, fontSize: 10, lineHeight: 1.3, opacity: 0.72 }}>
              {errorText}
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={toggleCall}
        disabled={callState === "connecting"}
        aria-label={buttonLabel}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 2147483001,
          appearance: "none",
          border: 0,
          borderRadius: 999,
          padding: "13px 18px",
          background: callState === "live" ? "#f5f1e7" : "#151515",
          color: callState === "live" ? "#151515" : "#fff",
          font: "inherit",
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          cursor: callState === "connecting" ? "default" : "pointer",
          opacity: callState === "connecting" ? 0.72 : 1,
          boxShadow: "0 8px 28px rgba(0,0,0,.18)",
        }}
      >
        {buttonLabel}
      </button>
    </>
  );
}
