"use client";

import Vapi from "@vapi-ai/web";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SAVANNAH_BRIEFING } from "./savannah-briefing";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const SAVANNAH_AVATAR = "/savannah-avatar.jpg";
// Vercel redeploy trigger: Savannah voice lifecycle fix

type State = "idle" | "requesting" | "connecting" | "live" | "error";

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
    const vapi = new Vapi(PUBLIC_KEY, undefined, { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true }, { startAudioOff: false });
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setState("live");
      setMessage("I'm listening.");
      try {
        vapi.send({
          type: "add-message",
          message: { role: "system", content: SAVANNAH_BRIEFING },
        } as any);
      } catch {}
    });
    vapi.on("call-end", () => {
      setState("idle");
      setMessage("Morning. What are we trying to decide?");
    });
    vapi.on("error", (error: unknown) => {
      console.error("Savannah Vapi error", error);
      setState("error");
      setMessage("The audio line did not open. Try me again.");
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
      setState("connecting");
      setMessage("Opening the line.");
      vapi.start(ASSISTANT_ID);
      try { vapi.setMuted(false); } catch {}
    } catch (error) {
      console.error("Savannah call start failed", error);
      setState("error");
      const detail = describeError(error);
      const lower = detail.toLowerCase();
      setMessage(
        lower.includes("permission") || lower.includes("denied") || lower.includes("notallowed")
          ? "I need the microphone. Allow it for this site, then try again."
          : "The audio line did not open. Try me again.",
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

  if (
    pathname === "/savannah-test" ||
    pathname === "/savannah-test/" ||
    pathname === "/room" ||
    pathname === "/room/" ||
    pathname === "/decision-collider" ||
    pathname === "/decision-collider/" ||
    pathname === "/meeting-filter" ||
    pathname === "/meeting-filter/" ||
    pathname === "/stress-test" ||
    pathname === "/stress-test/" ||
    pathname === "/ai-y-fier" ||
    pathname === "/ai-y-fier/" ||
    pathname === "/prompt-shoppe" ||
    pathname === "/prompt-shoppe/" ||
    pathname === "/radar" ||
    pathname === "/radar/" ||
    pathname === "/decision-memory" ||
    pathname === "/decision-memory/" ||
    pathname === "/inside-ctrl-love" ||
    pathname === "/inside-ctrl-love/" ||
    pathname === "/artifacts" ||
    pathname === "/artifacts/" ||
    pathname === "/living-decision-review" ||
    pathname === "/living-decision-review/" ||
    pathname === "/ambassadors" ||
    pathname === "/ambassadors/"
  ) {
    return null;
  }

  return (
    <aside
      aria-label="Savannah, ctrl+love employee #4"
      style={{
        position: "fixed",
        right: 18,
        bottom: 64,
        zIndex: 2147483001,
        width: "min(360px, calc(100vw - 28px))",
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
        id="savannah-toggle"
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
