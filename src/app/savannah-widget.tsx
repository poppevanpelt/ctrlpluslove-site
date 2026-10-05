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
type Mode = "voice" | "type";
type TextState = "idle" | "connecting" | "live" | "error";
type ConversationRole = "user" | "assistant";
type ConversationLine = { id: number; role: ConversationRole; text: string };

type TranscriptMessage = {
  type?: string;
  role?: string;
  status?: string;
  transcriptType?: string;
  transcript?: string;
};

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
  const textVapiRef = useRef<Vapi | null>(null);
  const conversationRef = useRef<Array<{ role: ConversationRole; text: string }>>([
    { role: "assistant", text: "Hi. Savannah at control love. What's up?" },
  ]);
  const lineIdRef = useRef(0);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const queuedTextRef = useRef<string | null>(null);
  const modeRef = useRef<Mode>("voice");
  const steelTimerRef = useRef<number | null>(null);
  const steelAudioRef = useRef<AudioContext | null>(null);
  const steelAliveRef = useRef(false);
  const micWakeTimersRef = useRef<number[]>([]);
  const [state, setState] = useState<State>("idle");
  const [compact, setCompact] = useState(false);
  const [mobileAutoCollapsed, setMobileAutoCollapsed] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [message, setMessage] = useState("Morning. What are we trying to decide?");
  const [mode, setMode] = useState<Mode>("voice");
  const [textState, setTextState] = useState<TextState>("idle");
  const [draft, setDraft] = useState("");
  const [textPending, setTextPending] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [chatLines, setChatLines] = useState<ConversationLine[]>([
    { id: 0, role: "assistant", text: "Hi. Savannah at control love. What's up?" },
  ]);

  const appendConversation = (role: ConversationRole, rawText: string, surface = true) => {
    const text = rawText.replace(/\s+/g, " ").trim();
    if (!text) return;

    const last = conversationRef.current[conversationRef.current.length - 1];
    if (last?.role === role && last.text === text) return;

    conversationRef.current = [...conversationRef.current.slice(-23), { role, text }];

    if (surface) {
      lineIdRef.current += 1;
      const id = lineIdRef.current;
      setChatLines((previous) => [...previous.slice(-23), { id, role, text }]);
    }
  };

  const recentConversationContext = () => {
    const history = conversationRef.current.slice(-16);
    if (!history.length) return "";
    const transcript = history
      .map((line) => `${line.role === "assistant" ? "SAVANNAH" : "VISITOR"}: ${line.text}`)
      .join("\n");
    return `\nConversation carried over from the other mode. Continue naturally without repeating it:\n${transcript}`;
  };

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
    if (pathname.startsWith("/savannah-room/")) return;

    const vapi = new Vapi(PUBLIC_KEY, undefined, { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true }, { startAudioOff: false });
    const textVapi = new Vapi(PUBLIC_KEY, undefined, { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true }, { startAudioOff: true });
    vapiRef.current = vapi;
    textVapiRef.current = textVapi;

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
    vapi.on("message", (rawMessage: unknown) => {
      const incoming = rawMessage as TranscriptMessage;

      // Vapi's speech-update includes the speaker role. Drive the portrait only
      // from assistant audio so Savannah never "lip-syncs" to the visitor.
      if (incoming?.type === "speech-update" && incoming.role === "assistant") {
        setAssistantSpeaking(incoming.status === "started");
      }

      if (
        incoming?.type === "transcript" &&
        incoming.transcript &&
        (!incoming.transcriptType || incoming.transcriptType === "final") &&
        (incoming.role === "user" || incoming.role === "assistant")
      ) {
        appendConversation(incoming.role, incoming.transcript, true);
      }
    });
    vapi.on("call-end", () => {
      clearMicWakeTimers();
      stopSteel();
      setAssistantSpeaking(false);
      setState("idle");
      if (modeRef.current === "voice") {
        setMessage("Morning. What are we trying to decide?");
      }
    });
    vapi.on("error", (error: unknown) => {
      clearMicWakeTimers();
      stopSteel();
      setAssistantSpeaking(false);
      console.error("Savannah Vapi error", error);
      setState("error");
      setMessage("The audio line did not open. Try me again.");
    });

    textVapi.on("call-start", () => {
      try { textVapi.setMuted(true); } catch {}
      try {
        textVapi.send({
          type: "control",
          control: "mute-assistant",
        } as any);
      } catch {}
      setTextState("live");
      setMessage("Type away. I'm here.");
      try {
        textVapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: `${SAVANNAH_BRIEFING}
Text delivery: this visitor is typing. Reply as Savannah in short, natural written turns. Do not mention that this is a separate mode or transport. Keep the same personality, judgment and knowledge as voice Savannah.${recentConversationContext()}`,
          },
        } as any);
      } catch {}

      const queued = queuedTextRef.current;
      if (queued) {
        queuedTextRef.current = null;
        try {
          textVapi.send({
            type: "add-message",
            message: { role: "user", content: queued },
            triggerResponseEnabled: true,
          } as any);
        } catch {
          setTextPending(false);
          setMessage("That did not get through. Try it once more.");
        }
      } else {
        setTextPending(false);
      }
    });

    textVapi.on("message", (rawMessage: unknown) => {
      const incoming = rawMessage as TranscriptMessage;
      if (
        incoming?.type === "transcript" &&
        incoming.transcript &&
        (!incoming.transcriptType || incoming.transcriptType === "final") &&
        incoming.role === "assistant"
      ) {
        appendConversation("assistant", incoming.transcript, true);
        setTextPending(false);
      }
    });

    textVapi.on("call-end", () => {
      setTextState("idle");
      setTextPending(false);
      if (modeRef.current === "type") {
        setMessage("Quiet line closed. Tap Type to reopen it.");
      }
    });

    textVapi.on("error", (error: unknown) => {
      console.error("Savannah text Vapi error", error);
      setTextState("error");
      setTextPending(false);
      if (modeRef.current === "type") {
        setMessage("The quiet line dropped. Try me again.");
      }
    });

    return () => {
      clearMicWakeTimers();
      stopSteel();
      try { steelAudioRef.current?.close(); } catch {}
      steelAudioRef.current = null;
      try { vapi.stop(); } catch {}
      try { textVapi.stop(); } catch {}
      vapi.removeAllListeners();
      textVapi.removeAllListeners();
      vapiRef.current = null;
      textVapiRef.current = null;
    };
  }, []);

  useEffect(() => {
    const openSavannah = () => {
      setManualOpen(true);
      setCompact(false);
    };
    window.addEventListener("savannah-open", openSavannah);
    return () => window.removeEventListener("savannah-open", openSavannah);
  }, []);

  useEffect(() => {
    if (mode !== "type") return;
    const frame = window.requestAnimationFrame(() => {
      const viewport = chatScrollRef.current;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
      textInputRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [chatLines, mode, textPending]);

  const startText = async () => {
    const textVapi = textVapiRef.current;
    if (!textVapi || textState === "connecting" || textState === "live") return;

    setTextState("connecting");
    setTextPending(false);
    setMessage("Opening the quiet line.");

    try {
      await textVapi.start(
        ASSISTANT_ID,
        {
          firstMessage: "",
          voice: { provider: "vapi", voiceId: "Savannah", version: 2 },
        } as any,
      );
    } catch (error) {
      console.error("Savannah text start failed", error);
      setTextState("error");
      setMessage("The quiet line did not open. Try me again.");
    }
  };

  const chooseMode = (nextMode: Mode) => {
    modeRef.current = nextMode;
    setMode(nextMode);
    setManualOpen(true);
    setCompact(false);

    if (nextMode === "type") {
      if (state === "live" || state === "connecting") {
        try { vapiRef.current?.stop(); } catch {}
      }
      void startText();
      return;
    }

    if (textState === "live" || textState === "connecting") {
      try { textVapiRef.current?.stop(); } catch {}
    }
    setTextPending(false);
    setMessage(
      conversationRef.current.length
        ? "Same conversation. Tap talk when you can."
        : "Morning. What are we trying to decide?",
    );
  };

  const sendText = () => {
    const textVapi = textVapiRef.current;
    const text = draft.trim();
    if (!textVapi || !text || textPending) return;

    appendConversation("user", text, true);
    setDraft("");
    setTextPending(true);

    if (textState !== "live") {
      queuedTextRef.current = text;
      setMessage("Opening the quiet line.");
      void startText();
      return;
    }

    try {
      textVapi.send({
        type: "add-message",
        message: { role: "user", content: text },
        triggerResponseEnabled: true,
      } as any);
    } catch (error) {
      console.error("Savannah text send failed", error);
      setTextPending(false);
      setMessage("That did not get through. Try it once more.");
    }
  };

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
        const carried = recentConversationContext();
        if (carried) {
          try {
            vapi.send({
              type: "add-message",
              message: {
                role: "system",
                content: carried,
              },
            } as any);
          } catch {}
        }
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
    pathname.startsWith("/savannah-room/") ||
    pathname === "/savannah-test" ||
    pathname === "/savannah-test/" ||
    pathname === "/bridgefund-ted" ||
    pathname === "/bridgefund-ted/" ||
    pathname === "/morning-chris" ||
    pathname === "/morning-chris/" ||
    pathname === "/ted-talks" ||
    pathname === "/ted-talks/" ||
    pathname === "/room" ||
    pathname === "/room/" ||
    pathname === "/decision-collider" ||
    pathname === "/decision-collider/" ||
    pathname === "/decision-accelerator" ||
    pathname === "/decision-accelerator/" ||
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
    pathname.startsWith("/holy-fools/") ||
    pathname === "/laatjenietnaaien" ||
    pathname === "/laatjenietnaaien/"
  ) {
    return null;
  }

  if (compact && state !== "live" && textState !== "live") {
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
        Savannah · Talk / Type
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
      <style>{`
        @keyframes savannahIdle {
          0% { transform: scale(1.01) translate3d(0, 0, 0); }
          100% { transform: scale(1.017) translate3d(0, -0.45px, 0); }
        }
        @keyframes savannahSpeak {
          0% { transform: scale(1.018) translate3d(0, 0, 0); }
          35% { transform: scale(1.022) translate3d(0.15px, -0.35px, 0); }
          70% { transform: scale(1.019) translate3d(-0.12px, 0.18px, 0); }
          100% { transform: scale(1.023) translate3d(0, -0.22px, 0); }
        }
        @keyframes savannahLowerFace {
          0% { transform: scaleY(0.995) translateY(0); }
          33% { transform: scaleY(1.018) translateY(0.2px); }
          66% { transform: scaleY(1.006) translateY(-0.15px); }
          100% { transform: scaleY(1.024) translateY(0.1px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .savannah-live-face,
          .savannah-live-mouth { animation: none !important; transform: none !important; }
        }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", minHeight: 112 }}>
        <div
          aria-label={assistantSpeaking ? "Savannah is speaking" : "Savannah"}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRight: "1px solid rgba(21,21,21,.18)",
            background: '#e9e4d8 url("/home/savannah.jpg?v=20261002-4") center/cover no-repeat',
          }}
        >
          <img
            className="savannah-live-face"
            src={SAVANNAH_AVATAR}
            alt="Savannah"
            onError={(event) => {
              const img = event.currentTarget;
              if (!img.src.includes("/home/savannah.jpg")) img.src = "/home/savannah.jpg?v=20261002-fallback";
            }}
            width={176}
            height={224}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 112,
              objectFit: "cover",
              display: "block",
              transformOrigin: "50% 62%",
              animation: assistantSpeaking
                ? "savannahSpeak 260ms ease-in-out infinite alternate"
                : "savannahIdle 5.6s ease-in-out infinite alternate",
              willChange: "transform",
            }}
          />

          {assistantSpeaking ? (
            <>
              <img
                className="savannah-live-mouth"
                src={SAVANNAH_AVATAR}
                alt=""
                aria-hidden="true"
                width={176}
                height={224}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  minHeight: 112,
                  objectFit: "cover",
                  display: "block",
                  clipPath: "inset(47% 20% 12% 20%)",
                  transformOrigin: "50% 64%",
                  animation: "savannahLowerFace 120ms ease-in-out infinite alternate",
                  willChange: "transform",
                  pointerEvents: "none",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: 7,
                  bottom: 7,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ff5a2a",
                  boxShadow: "0 0 0 3px rgba(245,241,231,.55)",
                }}
              />
            </>
          ) : null}
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

      <div
        role="tablist"
        aria-label="Choose how to speak with Savannah"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid rgba(21,21,21,.22)",
        }}
      >
        {(["voice", "type"] as const).map((option) => {
          const active = mode === option;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => chooseMode(option)}
              style={{
                minHeight: 40,
                border: 0,
                borderRight: option === "voice" ? "1px solid rgba(21,21,21,.22)" : 0,
                background: active ? "#151515" : "#f5f1e7",
                color: active ? "#f5f1e7" : "#151515",
                font: "inherit",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".11em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {option === "voice" ? "Talk" : "Type"}
            </button>
          );
        })}
      </div>

      {mode === "voice" ? (
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
      ) : (
        <div style={{ borderTop: "1px solid rgba(21,21,21,.22)" }}>
          <div
            ref={chatScrollRef}
            aria-live="polite"
            style={{
              maxHeight: 260,
              minHeight: 138,
              overflowY: "auto",
              padding: "4px 14px",
              background: "rgba(255,255,255,.16)",
            }}
          >
            {chatLines.map((line) => (
              <div
                key={line.id}
                style={{
                  padding: "11px 0 12px",
                  borderBottom: "1px solid rgba(21,21,21,.12)",
                }}
              >
                <div
                  style={{
                    marginBottom: 5,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: ".13em",
                    textTransform: "uppercase",
                    opacity: .45,
                  }}
                >
                  {line.role === "assistant" ? "Savannah" : "You"}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.38, fontWeight: line.role === "assistant" ? 500 : 650 }}>
                  {line.text}
                </div>
              </div>
            ))}
            {textPending ? (
              <div
                style={{
                  padding: "11px 0 12px",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  opacity: .48,
                }}
              >
                Savannah is thinking…
              </div>
            ) : null}
          </div>

          {textState === "error" || textState === "idle" ? (
            <button
              type="button"
              onClick={() => void startText()}
              style={{
                width: "100%",
                minHeight: 38,
                border: 0,
                borderBottom: "1px solid rgba(21,21,21,.18)",
                background: "#f5f1e7",
                color: "#151515",
                font: "inherit",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {textState === "error" ? "Try quiet line again" : "Open quiet line"}
            </button>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendText();
            }}
            style={{ display: "grid", gridTemplateColumns: "1fr auto" }}
          >
            <input
              ref={textInputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Type to Savannah"
              placeholder={textState === "connecting" ? "Type while I open the line…" : "Type to Savannah…"}
              autoComplete="off"
              style={{
                minWidth: 0,
                minHeight: 48,
                border: 0,
                borderRadius: 0,
                padding: "0 14px",
                background: "#f5f1e7",
                color: "#151515",
                outline: "none",
                font: "inherit",
                fontSize: 14,
              }}
            />
            <button
              type="submit"
              disabled={textPending || !draft.trim()}
              style={{
                minWidth: 72,
                border: 0,
                borderLeft: "1px solid rgba(245,241,231,.28)",
                borderRadius: 0,
                padding: "0 14px",
                background: "#151515",
                color: "#f5f1e7",
                font: "inherit",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                cursor: !textPending && draft.trim() ? "pointer" : "default",
                opacity: !textPending && draft.trim() ? 1 : .52,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
