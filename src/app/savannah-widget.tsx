"use client";

import Vapi from "@vapi-ai/web";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";

type State = "idle" | "connecting" | "live" | "error";

function describeError(error: unknown) {
  if (error instanceof Error) return error.message || error.name;
  if (typeof error === "string") return error;
  try {
    const raw = JSON.stringify(error);
    return raw && raw !== "{}" ? raw : "Unknown Vapi error";
  } catch {
    return "Unknown Vapi error";
  }
}

export function SavannahWidget() {
  const pathname = usePathname();
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

    // A failed start is authoritative. Generic Vapi/Daily error events can be
    // recoverable on mobile Safari, so they are logged instead of killing the UI.
    (vapi as any).on("call-start-failed", (event: unknown) => {
      console.error("Savannah call-start-failed", event);
      setState("error");
      setMessage("The call could not open. Try me again.");
    });

    vapi.on("error", (error: unknown) => {
      console.error("Savannah Vapi error", error);
    });

    return () => {
      try {
        vapi.stop();
      } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const toggle = async () => {
    const vapi = vapiRef.current;
    if (!vapi || state === "connecting") return;

    if (state === "live") {
      try {
        vapi.stop();
      } catch (error) {
        console.error("Savannah stop failed", error);
        setState("idle");
        setMessage("Morning. What are we trying to decide?");
      }
      return;
    }

    try {
      setState("connecting");
      setMessage("Opening Savannah.");

      // Let the Vapi/Daily browser SDK own microphone permission and audio setup.
      // Pre-acquiring getUserMedia here can leave iOS Safari in a silent join.
      await vapi.start(ASSISTANT_ID);
    } catch (error) {
      console.error("Savannah call start failed", error);
      setState("error");

      const detail = describeError(error);
      const name =
        error && typeof error === "object" && "name" in error
          ? String((error as { name?: unknown }).name || "")
          : "";
      const lower = detail.toLowerCase();

      setMessage(
        name === "NotAllowedError" ||
          lower.includes("permission") ||
          lower.includes("denied")
          ? "I need the microphone. Allow it for ctrlpluslove.com, then try again."
          : "The call could not open. Try me again.",
      );
    }
  };

  const label =
    state === "connecting"
      ? "Opening the line…"
      : state === "live"
        ? "End call"
        : state === "error"
          ? "Try again"
          : "Talk to Savannah";

  const hiddenPaths = new Set([
    "/room",
    "/decision-collider",
    "/meeting-filter",
    "/stress-test",
    "/ai-y-fier",
    "/prompt-shoppe",
    "/radar",
    "/decision-memory",
    "/inside-ctrl-love",
    "/artifacts",
    "/living-decision-review",
    "/ambassadors",
    "/savannah-test",
  ]);

  if (hiddenPaths.has(pathname.replace(/\/$/, "") || "/")) {
    return null;
  }

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
          <Image
            src="/savannah-avatar.jpg"
            alt="Savannah"
            width={176}
            height={224}
            priority={false}
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
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
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
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
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
            {message}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={state === "connecting"}
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
          cursor: state === "connecting" ? "default" : "pointer",
          opacity: state === "connecting" ? 0.68 : 1,
        }}
      >
        <span>{label}</span>
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
