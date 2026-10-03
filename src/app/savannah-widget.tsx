"use client";

import Vapi from "@vapi-ai/web";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SAVANNAH_BRIEFING } from "./savannah-briefing";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const SAVANNAH_AVATAR = "/savannah-avatar.jpg?v=20261002-4";
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
  const steelTimerRef = useRef<number | null>(null);
  const steelAudioRef = useRef<AudioContext | null>(null);
  const steelAliveRef = useRef(false);
  const micWakeTimersRef = useRef<number[]>([]);
  const [state, setState] = useState<State>("idle");
  const [compact, setCompact] = useState(false);
  const [mobileAutoCollapsed, setMobileAutoCollapsed] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [message, setMessage] = useState("Morning. What are we trying to decide?");

  const stopSteel = () => {
    steelAliveRef.current = false;
    if (steelTimerRef.current !== null) {
      window.clearTimeout(steelTimerRef.current);
      steelTimerRef.current = null;
    }
  };

  const tapSteel = () => {
    const ctx = steelAudioRef.current;
    if (!ctx || ctx.state !== "running" || !steelAliveRef.current) return;
    const now = ctx.currentTime;
    [0, 0.07, 0.18].forEach((offset, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2250 + index * 610, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.012 / (index + 1), now + offset + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  };

  const scheduleSteel = () => {
    if (!steelAliveRef.current) return;
    const delay = 18000 + Math.random() * 27000;
    steelTimerRef.current = window.setTimeout(() => {
      tapSteel();
      scheduleSteel();
    }, delay);
  };

  const clearMicWakeTimers = () => {
    micWakeTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    micWakeTimersRef.current = [];
  };

  const forceMicOpen = (vapi: Vapi) => {
    clearMicWakeTimers();
    const unmute = () => { try { vapi.setMuted(false); } catch {} };
    unmute();
    [350, 900, 1800].forEach((delay) => {
      micWakeTimersRef.current.push(window.setTimeout(unmute, delay));
    });
  };

  const startSteel = async () => {
    steelAliveRef.current = true;
    if (!steelAudioRef.current) {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextCtor) steelAudioRef.current = new AudioContextCtor();
    }
    try { await steelAudioRef.current?.resume(); } catch {}
    scheduleSteel();
  };

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 650px)").matches;
    if (!isMobile || mobileAutoCollapsed || manualOpen) return;

    const onScroll = () => {
      if (window.scrollY > 140) {
        setCompact(true);
        setMobileAutoCollapsed(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileAutoCollapsed, manualOpen]);

  useEffect(() => {
    const vapi = new Vapi(PUBLIC_KEY, undefined, { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true }, { startAudioOff: false });
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      // Safari/Daily can briefly re-mute while the call object settles.
      // Wake the mic more than once so Savannah keeps listening after her intro.
      forceMicOpen(vapi);
      setState("live");
      setMessage("I'm listening.");
      try {
        vapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: `${SAVANNAH_BRIEFING}\nVoice delivery: stay warm, relaxed and unhurried. Leave a little air between thoughts. Never sound eager, rushed or salesy.`,
          },
        } as any);
      } catch {}
    });
    vapi.on("speech-start", () => {
      setMessage("I'm listening.");
    });
    vapi.on("speech-end", () => {
      setMessage("Got it.");
    });
    vapi.on("call-end", () => {
      clearMicWakeTimers();
      stopSteel();
      setState("idle");
      setMessage("Morning. What are we trying to decide?");
    });
    vapi.on("error", (error: unknown) => {
      clearMicWakeTimers();
      stopSteel();
      console.error("Savannah Vapi error", error);
      setState("error");
      setMessage("The audio line did not open. Try me again.");
    });

    return () => {
      clearMicWakeTimers();
      stopSteel();
      try { steelAudioRef.current?.close(); } catch {}
      steelAudioRef.current = null;
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
      void startSteel();
      // Keep start non-blocking for iPhone Safari, but restore Savannah's
      // explicit Southern V2 voice instead of falling back to assistant defaults.
      void vapi.start(
        ASSISTANT_ID,
        {
          firstMessage: "Hi. Savannah at control love. What's up?",
          voice: { provider: "vapi", voiceId: "Savannah", version: 2 },
          backgroundSound: "office",
        } as any,
      ).then(() => {
        forceMicOpen(vapi);
      }).catch((error: unknown) => {
        clearMicWakeTimers();
        stopSteel();
        console.error("Savannah call start failed", error);
        setState("error");
        const detail = describeError(error);
        const lower = detail.toLowerCase();
        setMessage(
          lower.includes("permission") || lower.includes("denied") || lower.includes("notallowed")
            ? "I need the microphone. Allow it for this site, then try again."
            : "The audio line did not open. Try me again.",
        );
      });
      forceMicOpen(vapi);
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
    pathname === "/bridgefund-ted" ||
    pathname === "/bridgefund-ted/" ||
    pathname === "/ted-talks" ||
    pathname === "/ted-talks/" ||
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
    pathname === "/ambassadors/" ||
    pathname === "/holy-fools" ||
    pathname === "/holy-fools/" ||
    pathname.startsWith("/holy-fools/")
  ) {
    return null;
  }

  if (compact && state !== "live") {
    return (
      <button
        type="button"
        onClick={() => { setManualOpen(true); setCompact(false); }}
        aria-label="Open Savannah"
        style={{
          position: "fixed",
          right: 14,
          bottom: 24,
          zIndex: 2147483001,
          minHeight: 44,
          border: "1px solid rgba(21,21,21,.22)",
          padding: "0 14px",
          background: "#151515",
          color: "#f5f1e7",
          font: "inherit",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: ".11em",
          textTransform: "uppercase",
          boxShadow: "0 12px 30px rgba(0,0,0,.14)",
        }}
      >
        Talk to Savannah
      </button>
    );
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
        <div style={{ overflow: "hidden", borderRight: "1px solid rgba(21,21,21,.18)", background: '#e9e4d8 url("/home/savannah.jpg?v=20261002-4") center/cover no-repeat' }}>
          <img
            src={SAVANNAH_AVATAR}
            alt="Savannah"
            onError={(event) => {
              const img = event.currentTarget;
              if (!img.src.includes("/home/savannah.jpg")) img.src = "/home/savannah.jpg?v=20261002-fallback";
            }}
            width={176}
            height={224}
            style={{ width: "100%", height: "100%", minHeight: 112, objectFit: "cover", display: "block" }}
          />
        </div>

        <div style={{ display: "flex", minWidth: 0, flexDirection: "column", justifyContent: "space-between", padding: "13px 14px 12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>Savannah</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 8, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", opacity: 0.48, whiteSpace: "nowrap" }}>
                  employee #4
                </div>
                <button
                  type="button"
                  onClick={() => { setManualOpen(false); setCompact(true); }}
                  aria-label="Minimize Savannah"
                  style={{ border: 0, background: "transparent", color: "#151515", padding: 0, fontSize: 14, lineHeight: 1, cursor: "pointer", opacity: .45 }}
                >
                  ×
                </button>
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
        onPointerUp={(event) => event.currentTarget.blur()}
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
