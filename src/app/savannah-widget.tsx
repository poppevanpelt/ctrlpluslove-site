"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const SAVANNAH_AVATAR = "data:image/jpeg;base64,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";

type State = "idle" | "requesting" | "connecting" | "live" | "error";

export function SavannahWidget() {
  const vapiRef = useRef<Vapi | null>(null);
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("Morning. What are we trying to decide?");

  useEffect(() => {
    const vapi = new Vapi(PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setState("live");
      setMessage("I'm listening.");
    });
    vapi.on("call-end", () => {
      setState("idle");
      setMessage("Morning. What are we trying to decide?");
    });
    vapi.on("error", (error: unknown) => {
      console.error("Savannah Vapi error", error);
      setState("error");
      setMessage("The line dropped. Try me again.");
    });

    return () => {
      try { vapi.stop(); } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const toggle = async () => {
    const vapi = vapiRef.current;
    if (!vapi || state === "requesting" || state === "connecting") return;

    if (state === "live") {
      vapi.stop();
      return;
    }

    try {
      setState("requesting");
      setMessage("I need your microphone first.");

      if (!navigator.mediaDevices?.getUserMedia) {
        setState("error");
        setMessage("This browser isn't giving me a microphone.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      setState("connecting");
      setMessage("One second.");
      await vapi.start(ASSISTANT_ID, { customerJoinTimeoutSeconds: 45 } as any);
    } catch (error) {
      console.error("Savannah call start failed", error);
      setState("error");
      const text = error instanceof Error ? error.message.toLowerCase() : "";
      setMessage(
        text.includes("permission") || text.includes("denied")
          ? "I need the microphone. Allow it for ctrlpluslove.com, then try again."
          : "The line dropped. Try me again.",
      );
    }
  };

  const label =
    state === "requesting" ? "Allow microphone…"
    : state === "connecting" ? "Opening the line…"
    : state === "live" ? "End call"
    : state === "error" ? "Try again"
    : "Talk to Savannah";

  const busy = state === "requesting" || state === "connecting";

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
        background: "rgba(245,241,231,.98)",
        color: "#151515",
        boxShadow: "0 16px 44px rgba(0,0,0,.16)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", minHeight: 112 }}>
        <div style={{ overflow: "hidden", borderRight: "1px solid rgba(21,21,21,.18)", background: "#e9e4d8" }}>
          <img
            src={SAVANNAH_AVATAR}
            alt="Savannah"
            width={176}
            height={224}
            style={{ width: "100%", height: "100%", minHeight: 112, objectFit: "cover", display: "block" }}
          />
        </div>

        <div style={{ display: "flex", minWidth: 0, flexDirection: "column", justifyContent: "space-between", padding: "13px 14px 12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>Savannah</div>
              <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 8, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", opacity: 0.48, whiteSpace: "nowrap" }}>
                employee #4
              </div>
            </div>
            <div style={{ marginTop: 6, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 9, fontWeight: 600, lineHeight: 1.25, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.58 }}>
              intelligent front door
            </div>
          </div>

          <p aria-live="polite" style={{ margin: "14px 0 0", fontSize: 14, fontWeight: 500, lineHeight: 1.28, letterSpacing: "-.01em" }}>
            {message}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={label}
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
          background: state === "live" ? "#f5f1e7" : "#151515",
          color: state === "live" ? "#151515" : "#f5f1e7",
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
        <span>{label}</span>
        <span aria-hidden="true" style={{ width: 7, height: 7, flex: "0 0 auto", background: "#ff5a2a" }} />
      </button>
    </aside>
  );
}
