"use client";

import Script from "next/script";
import { createElement, useEffect, useState } from "react";

const SAVANNAH_ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const VAPI_PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
type WidgetState = "loading" | "ready" | "live" | "error";

export function SavannahWidget() {
  const [state, setState] = useState<WidgetState>("loading");

  useEffect(() => {
    const handleStart = () => setState("live");
    const handleEnd = () => setState("ready");
    const handleError = () => setState("error");

    const attach = () => {
      const widget = document.querySelector("vapi-widget");
      if (!widget) return false;

      widget.addEventListener("call-start", handleStart);
      widget.addEventListener("call-end", handleEnd);
      widget.addEventListener("error", handleError);
      setState("ready");
      return true;
    };

    if (attach()) {
      return () => {
        const widget = document.querySelector("vapi-widget");
        widget?.removeEventListener("call-start", handleStart);
        widget?.removeEventListener("call-end", handleEnd);
        widget?.removeEventListener("error", handleError);
      };
    }

    const timer = window.setInterval(() => {
      if (attach()) window.clearInterval(timer);
    }, 250);

    const timeout = window.setTimeout(() => {
      window.clearInterval(timer);
      setState((current) => (current === "loading" ? "error" : current));
    }, 8000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(timeout);
      const widget = document.querySelector("vapi-widget");
      widget?.removeEventListener("call-start", handleStart);
      widget?.removeEventListener("call-end", handleEnd);
      widget?.removeEventListener("error", handleError);
    };
  }, []);

  const status =
    state === "loading"
      ? "Opening the front door."
      : state === "live"
        ? "I'm listening."
        : state === "error"
          ? "The audio line did not open. Try again."
          : "Morning. What are we trying to decide?";

  return (
    <>
      <Script
        src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
        strategy="afterInteractive"
      />

      <div
        style={{
          position: "fixed",
          right: 18,
          bottom: 92,
          zIndex: 2147482999,
          width: "min(290px, calc(100vw - 36px))",
          padding: "12px 14px",
          border: "1px solid rgba(21,21,21,.20)",
          background: "rgba(245,241,231,.97)",
          color: "#151515",
          boxShadow: "0 12px 32px rgba(0,0,0,.10)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          fontFamily: "inherit",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>Savannah</div>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              opacity: 0.48,
            }}
          >
            employee #4
          </div>
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            opacity: 0.58,
          }}
        >
          intelligent front door
        </div>
        <div
          aria-live="polite"
          style={{
            marginTop: 12,
            fontSize: 13,
            lineHeight: 1.3,
            fontWeight: 500,
          }}
        >
          {status}
        </div>
      </div>

      {createElement("vapi-widget", {
        "public-key": VAPI_PUBLIC_KEY,
        "assistant-id": SAVANNAH_ASSISTANT_ID,
        mode: "voice",
        theme: "dark",
        position: "bottom-right",
        size: "compact",
        radius: "none",
        "main-label": "Savannah",
        "start-button-text": "Talk to Savannah",
        "end-button-text": "End call",
        "empty-voice-message": "Morning. What are we trying to decide?",
        "show-transcript": "false",
        "button-base-color": "#151515",
        "button-accent-color": "#F5F1E7",
        "accent-color": "#FF5A2A",
      })}
    </>
  );
}
