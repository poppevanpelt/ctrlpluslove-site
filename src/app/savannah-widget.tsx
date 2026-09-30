"use client";

import { useEffect, useRef, useState } from "react";

const SAVANNAH_ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const VAPI_PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const SAVANNAH_AVATAR = "/savannah-avatar.jpg?v=0060d14c";

type CallState = "idle" | "connecting" | "live" | "error";

type VapiInstance = {
  start: (assistantId: string, overrides?: Record<string, unknown>) => Promise<unknown>;
  stop: () => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeAllListeners: () => void;
};

type SavannahWindow = Window & {
  __SavannahVapiCtor?: new (publicKey: string) => VapiInstance;
};

export function SavannahWidget() {
  const vapiRef = useRef<VapiInstance | null>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [errorText, setErrorText] = useState("");
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    let active = true;

    const attachVapi = () => {
      if (!active || vapiRef.current) return;

      const VapiCtor = (window as SavannahWindow).__SavannahVapiCtor;
      if (!VapiCtor) return;

      const vapi = new VapiCtor(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;
      setSdkReady(true);

      vapi.on("call-start", () => {
        setCallState("live");
        setErrorText("");
      });

      vapi.on("call-end", () => {
        setCallState("idle");
      });

      vapi.on("error", (error: unknown) => {
        console.error("Savannah Vapi error", error);
        setCallState("error");
        setErrorText("The line dropped. Try me again.");
      });
    };

    const onReady = () => attachVapi();
    const onLoaderError = (event: Event) => {
      console.error("Savannah Vapi loader error", event);
      if (!active) return;
      setCallState("error");
      setErrorText("Savannah's audio line didn't load. Try again.");
    };

    window.addEventListener("savannah-vapi-ready", onReady);
    window.addEventListener("savannah-vapi-error", onLoaderError);

    attachVapi();

    if (!(window as SavannahWindow).__SavannahVapiCtor) {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-savannah-vapi-loader="true"]',
      );

      if (!existing) {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "/savannah-vapi-loader.js";
        script.dataset.savannahVapiLoader = "true";
        script.onerror = onLoaderError;
        document.head.appendChild(script);
      }
    }

    return () => {
      active = false;
      window.removeEventListener("savannah-vapi-ready", onReady);
      window.removeEventListener("savannah-vapi-error", onLoaderError);

      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch {}
        vapiRef.current.removeAllListeners();
        vapiRef.current = null;
      }
    };
  }, []);

  const toggleCall = async () => {
    const vapi = vapiRef.current;
    if (!vapi || !sdkReady || callState === "connecting") return;

    if (callState === "live") {
      vapi.stop();
      return;
    }

    setErrorText("");
    setCallState("connecting");

    try {
      await vapi.start(SAVANNAH_ASSISTANT_ID, {
        customerJoinTimeoutSeconds: 45,
      });
    } catch (error) {
      console.error("Savannah call start failed", error);
      setCallState("error");
      setErrorText("The line dropped. Try me again.");
    }
  };

  const buttonLabel =
    !sdkReady
      ? "Loading Savannah…"
      : callState === "connecting"
        ? "Opening the line…"
        : callState === "live"
          ? "End call"
          : callState === "error"
            ? "Try again"
            : "Talk to Savannah";

  const presenceLine =
    !sdkReady
      ? "One second."
      : callState === "connecting"
        ? "One second."
        : callState === "live"
          ? "I'm listening."
          : callState === "error"
            ? errorText
            : "Morning. What are we trying to decide?";

  const busy = callState === "connecting" || !sdkReady;

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
