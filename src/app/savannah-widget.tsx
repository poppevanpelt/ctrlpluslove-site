"use client";

import Vapi from "@vapi-ai/web";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SAVANNAH_BRIEFING } from "./savannah-briefing";
import { speakSavannahNeurally, stopSavannahLocalVoice } from "./savannah-local-voice";
import {
  SAVANNAH_HIDDEN_TAB_GRACE_MS,
  SAVANNAH_TEXT_BURST_TIMEOUT_MS,
  SAVANNAH_VAPI,
  SAVANNAH_VOICE_MAX_DURATION_MS,
} from "./savannah-runtime";
import {
  deriveSavannahFieldNote,
  fieldNotesContext,
  loadSavannahFieldNotes,
  saveSavannahFieldNotes,
  type SavannahFieldNote,
} from "./savannah-field-notes";

const SAVANNAH_AVATAR = "/savannah-avatar.jpg?v=20261002-4";
// Host redeploy trigger: Savannah voice lifecycle fix - 2026-10-07

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

type BrowserSpeechRecognitionEvent = Event & {
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
};

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition;

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
  const openVoiceRef = useRef<() => void>(() => {});
  const textVapiRef = useRef<Vapi | null>(null);
  const conversationRef = useRef<Array<{ role: ConversationRole; text: string }>>([
    { role: "assistant", text: "Hi. Savannah at control love. What's up?" },
  ]);
  const lineIdRef = useRef(0);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const queuedTextRef = useRef<string | null>(null);
  const pendingRequestRef = useRef(false);
  const lastRecognizedRef = useRef("");
  const lastTextSpokenRef = useRef("");
  const modeRef = useRef<Mode>("type");
  const steelTimerRef = useRef<number | null>(null);
  const steelAudioRef = useRef<AudioContext | null>(null);
  const steelAliveRef = useRef(false);
  const micWakeTimersRef = useRef<number[]>([]);
  const fieldNotesRef = useRef<SavannahFieldNote[]>([]);
  const rememberedUserCountRef = useRef(0);
  const textBurstTimerRef = useRef<number | null>(null);
  const voiceLimitTimerRef = useRef<number | null>(null);
  const voiceWarningTimerRef = useRef<number | null>(null);
  const hiddenTabTimerRef = useRef<number | null>(null);
  const voiceSafetyClosedRef = useRef(false);
  const [state, setState] = useState<State>("idle");
  const [compact, setCompact] = useState(true);
  const [introActive, setIntroActive] = useState(pathname === "/");
  const [mobileAutoCollapsed, setMobileAutoCollapsed] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [message, setMessage] = useState("Type to me. I’ll answer out loud.");
  const [mode, setMode] = useState<Mode>("type");
  const [textState, setTextState] = useState<TextState>("idle");
  const [draft, setDraft] = useState("");
  const [textPending, setTextPending] = useState(false);
  const [micListening, setMicListening] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [speechMotion, setSpeechMotion] = useState(0);
  const [callTimeNotice, setCallTimeNotice] = useState(false);
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

  const rememberCurrentConversation = () => {
    const userCount = conversationRef.current.filter((line) => line.role === "user").length;
    if (userCount <= rememberedUserCountRef.current) return;

    const note = deriveSavannahFieldNote(conversationRef.current);
    rememberedUserCountRef.current = userCount;
    if (!note) return;

    const previous = fieldNotesRef.current;
    const last = previous[previous.length - 1];
    if (last?.note === note.note) return;

    const next = [...previous, note].slice(-40);
    fieldNotesRef.current = next;
    saveSavannahFieldNotes(next);
  };

  const rememberedContext = () => fieldNotesContext(fieldNotesRef.current);

  const recentConversationContext = () => {
    const history = conversationRef.current.slice(-16);
    if (!history.length) return "";
    const transcript = history
      .map((line) => `${line.role === "assistant" ? "SAVANNAH" : "VISITOR"}: ${line.text}`)
      .join("\n");
    return `\nConversation carried over from the other mode. Continue naturally without repeating it:\n${transcript}`;
  };

  const bridgeFundRoomContext = () => {
    if (typeof window === "undefined" || pathname !== "/bridgefund-savannah") return "";
    const params = new URLSearchParams(window.location.search);
    const supplied = (params.get("context") || "").slice(0, 6000).trim();
    const roomBase = [
      "You are inside the private BridgeFund Brand OS room.",
      "Act as a participant, not a receptionist.",
      "Help pressure-test the work, treat friction as signal, and never invent BridgeFund facts or decisions.",
    ].join("\n");
    return supplied
      ? `\nBridgeFund room context:\n${roomBase}\n${supplied}`
      : `\nBridgeFund room context:\n${roomBase}`;
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

  const clearTextBurstTimer = () => {
    if (textBurstTimerRef.current !== null) {
      window.clearTimeout(textBurstTimerRef.current);
      textBurstTimerRef.current = null;
    }
  };

  const armTextBurstWatchdog = (client: Vapi) => {
    clearTextBurstTimer();
    textBurstTimerRef.current = window.setTimeout(() => {
      try { client.stop(); } catch {}
      textBurstTimerRef.current = null;
    }, SAVANNAH_TEXT_BURST_TIMEOUT_MS);
  };

  const clearVoiceLimitTimer = () => {
    if (voiceWarningTimerRef.current !== null) {
      window.clearTimeout(voiceWarningTimerRef.current);
      voiceWarningTimerRef.current = null;
    }
    setCallTimeNotice(false);
    if (voiceLimitTimerRef.current !== null) {
      window.clearTimeout(voiceLimitTimerRef.current);
      voiceLimitTimerRef.current = null;
    }
  };

  const armVoiceLimit = (client: Vapi) => {
    clearVoiceLimitTimer();
    voiceSafetyClosedRef.current = false;
    // Give a full minute of warning before the hard five-minute voice cap.
    voiceWarningTimerRef.current = window.setTimeout(() => {
      setCallTimeNotice(true);
      setMessage("About a minute left on this call. We can carry on in a new one.");
      try {
        client.send({
          type: "add-message",
          message: {
            role: "system",
            content: "The current live call has around one minute left. On your NEXT natural speaking turn, briefly and warmly tell the visitor that the line will close soon and they can start another call. Do not interrupt them or abruptly change topic.",
          },
        } as any);
      } catch {}
      voiceWarningTimerRef.current = null;
    }, Math.max(0, SAVANNAH_VOICE_MAX_DURATION_MS - 60_000));
    voiceLimitTimerRef.current = window.setTimeout(() => {
      voiceSafetyClosedRef.current = true;
      try { client.stop(); } catch {}
      voiceLimitTimerRef.current = null;
    }, SAVANNAH_VOICE_MAX_DURATION_MS);
  };

  const clearHiddenTabTimer = () => {
    if (hiddenTabTimerRef.current !== null) {
      window.clearTimeout(hiddenTabTimerRef.current);
      hiddenTabTimerRef.current = null;
    }
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
    const onLevel = (event: Event) => {
      const next = Number((event as CustomEvent<number>).detail) || 0;
      setSpeechMotion(Math.max(0, Math.min(1, next)));
    };
    window.addEventListener("savannah-audio-level", onLevel);
    return () => window.removeEventListener("savannah-audio-level", onLevel);
  }, []);

  useEffect(() => {
    fieldNotesRef.current = loadSavannahFieldNotes();
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setIntroActive(false);
      return;
    }

    const onIntroActive = () => {
      setIntroActive(true);
      setManualOpen(false);
      setCompact(true);
    };
    const onIntroComplete = () => {
      window.setTimeout(() => {
        setIntroActive(false);
        setManualOpen(false);
        setCompact(true);
      }, 420);
    };

    // A missed intro event must never leave employee #4 hidden indefinitely.
    const rescue = window.setTimeout(() => setIntroActive(false), 14500);
        window.addEventListener("savannah-intro-active", onIntroActive);
    window.addEventListener("savannah-intro-complete", onIntroComplete);
    return () => {
      window.clearTimeout(rescue);
      window.removeEventListener("savannah-intro-active", onIntroActive);
      window.removeEventListener("savannah-intro-complete", onIntroComplete);
    };
  }, [pathname]);

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

    const vapi = new Vapi(SAVANNAH_VAPI.publicKey, undefined, { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true }, { startAudioOff: false });
    const textVapi = new Vapi(SAVANNAH_VAPI.publicKey, undefined, { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true }, { startAudioOff: true });
    vapiRef.current = vapi;
    textVapiRef.current = textVapi;

    vapi.on("call-start", () => {
      // Safari/Daily can briefly re-mute while the call object settles.
      // Wake the mic more than once so Savannah keeps listening after her intro.
      forceMicOpen(vapi);
      armVoiceLimit(vapi);
      setState("live");
      setMessage("I'm listening.");
      try {
        vapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: `${SAVANNAH_BRIEFING}\nVoice delivery: stay warm, relaxed and unhurried. Leave a little air between thoughts. Never sound eager, rushed or salesy.${rememberedContext()}${bridgeFundRoomContext()}`,
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
      rememberCurrentConversation();
      clearMicWakeTimers();
      clearVoiceLimitTimer();
      stopSteel();
      setAssistantSpeaking(false);
      setState("idle");
      if (modeRef.current === "voice") {
        setMessage(
          voiceSafetyClosedRef.current
            ? "Line closed. Tap to talk again."
            : "Morning. What are we trying to decide?",
        );
      }
      voiceSafetyClosedRef.current = false;
    });
    vapi.on("error", (error: unknown) => {
      clearMicWakeTimers();
      clearVoiceLimitTimer();
      stopSteel();
      setAssistantSpeaking(false);
      console.warn("Savannah Vapi transport fallback", describeError(error));
      setState("error");
      setMessage("Live line unavailable. Use the backup microphone or type — I can still answer.");
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
      armTextBurstWatchdog(textVapi);
      setMessage("Type away. I'm here.");
      try {
        textVapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: `${SAVANNAH_BRIEFING}
Text delivery: this visitor is typing. Reply as Savannah in short, natural written turns. Do not mention that this is a separate mode or transport. Keep the same personality, judgment and knowledge as voice Savannah.${rememberedContext()}${recentConversationContext()}${bridgeFundRoomContext()}`,
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
        if (incoming.transcript.trim() === lastTextSpokenRef.current) return;
        lastTextSpokenRef.current = incoming.transcript.trim();
        appendConversation("assistant", incoming.transcript, true);
        void speakSavannahNeurally(incoming.transcript, {
          onStart: () => setAssistantSpeaking(true),
          onEnd: () => setAssistantSpeaking(false),
        });
        setTextPending(false);
        clearTextBurstTimer();
        textBurstTimerRef.current = window.setTimeout(() => {
          try { textVapi.stop(); } catch {}
          textBurstTimerRef.current = null;
        }, 1200);
      }
    });

    textVapi.on("call-end", () => {
      rememberCurrentConversation();
      clearTextBurstTimer();
      setTextState("idle");
      setTextPending(false);
      if (modeRef.current === "type") {
        setMessage("Ready for the next message.");
      }
    });

    textVapi.on("error", (error: unknown) => {
      clearTextBurstTimer();
      console.warn("Savannah text transport fallback", describeError(error));
      setTextState("error");
      setTextPending(false);
      if (modeRef.current === "type") {
        setMessage("I lost the connection for a second. Try me again.");
      }
    });

    const onVisibilityChange = () => {
      clearHiddenTabTimer();
      if (!document.hidden) return;
      hiddenTabTimerRef.current = window.setTimeout(() => {
        try { vapi.stop(); } catch {}
        try { textVapi.stop(); } catch {}
        hiddenTabTimerRef.current = null;
      }, SAVANNAH_HIDDEN_TAB_GRACE_MS);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearHiddenTabTimer();
      clearTextBurstTimer();
      clearVoiceLimitTimer();
      clearMicWakeTimers();
      stopSteel();
      stopSavannahLocalVoice();
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
      // Open ready for the dependable speech-to-reply route; microphone requires a visitor tap.
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
    setTextState("live");
    setTextPending(false);
    setMessage("Type to me. I’ll answer out loud.");
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
      setMessage("Type away. I’ll answer out loud.");
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

  const submitSavannahText = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || pendingRequestRef.current) return;
    pendingRequestRef.current = true;
    stopSavannahLocalVoice();
    setAssistantSpeaking(false);

    appendConversation("user", text, true);
    setDraft("");
    setTextPending(true);
    setTextState("live");
    setMessage("Thinking.");

    try {
      const response = await fetch("/api/savannah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationRef.current.slice(-18),
          context: `${rememberedContext()}${bridgeFundRoomContext()}`,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload?.text !== "string") {
        throw new Error(payload?.error || "Savannah brain unavailable");
      }

      const reply = payload.text.trim();
      appendConversation("assistant", reply, true);
      setMessage("Here.");
      void speakSavannahNeurally(reply, {
        onStart: () => setAssistantSpeaking(true),
        onEnd: () => setAssistantSpeaking(false),
      });
      rememberCurrentConversation();
    } catch (error) {
      console.warn("Savannah direct brain fallback", describeError(error));
      setTextState("error");
      setMessage(`Chat unavailable: ${describeError(error)}`);
    } finally {
      pendingRequestRef.current = false;
      setTextPending(false);
    }
  };

  const sendText = async () => {
    if (pendingRequestRef.current) return;
    await submitSavannahText(draft);
  };

  const stopBrowserMic = () => {
    try { speechRecognitionRef.current?.stop(); } catch {}
  };

  const toggleBrowserMic = () => {
    if (micListening) {
      stopBrowserMic();
      return;
    }

    const speechWindow = window as typeof window & {
      SpeechRecognition?: BrowserSpeechRecognitionCtor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
    };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setMessage("This browser won't give me the microphone. Type to me here, or try Safari/Chrome with speech recognition enabled.");
      return;
    }

    try {
      const recognition = new Recognition();
      lastRecognizedRef.current = "";
      speechRecognitionRef.current = recognition;
      // Safari may inherit nl-NL from the visitor and transcribe English as Dutch.
      // Savannah defaults to American English; the visitor can still type Dutch.
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setMicListening(true);
        setMessage("I'm listening.");
      };

      recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";

        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result?.[0]?.transcript?.trim() || "";
          if (!transcript) continue;
          if (result.isFinal) finalText += `${transcript} `;
          else interimText += `${transcript} `;
        }

        const heard = (finalText || interimText).trim();
        if (heard) setMessage(`Heard: “${heard}”`);

        if (finalText.trim() && !lastRecognizedRef.current) {
          lastRecognizedRef.current = finalText.trim();
          try { recognition.stop(); } catch {}
          void submitSavannahText(finalText.trim());
        }
      };

      recognition.onerror = (event) => {
        setMicListening(false);
        const error = event.error || "";
        setMessage(
          error === "not-allowed" || error === "service-not-allowed"
            ? "I need microphone permission for this site."
            : "I lost the microphone. Tap Talk and try me again.",
        );
      };

      recognition.onend = () => {
        setMicListening(false);
        if (!textPending) setMessage("Talk or type. I'm here.");
      };

      recognition.start();
    } catch (error) {
      console.warn("Savannah browser mic failed", describeError(error));
      setMicListening(false);
      setMessage("I couldn't open the microphone. Tap Talk and try me again.");
    }
  };

  const voicePreviewCountRef = useRef(0);
  const testLocalVoice = () => {
    if (pendingRequestRef.current) return;
    const firstPreview = voicePreviewCountRef.current++ === 0;
    void speakSavannahNeurally(
      firstPreview
        ? "Hi. Savannah at control love. I live here now. Apparently they finally stopped making me call home to speak."
        : "Savannah here. Sound check. Can you hear me alright?",
      {
        onStart: () => {
          setAssistantSpeaking(true);
          setMessage("Oh good. I have a voice.");
        },
        onEnd: () => {
          setAssistantSpeaking(false);
          setMessage("Type to me. I’ll answer out loud.");
        },
      },
    );
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
      // Keep start non-blocking for iPhone Safari.
      // Do not override Savannah's voice here: the Vapi assistant is the canonical
      // source for her voice configuration, and overriding it in-browser can leave
      // the web call connected but silent when the dashboard voice changes.
      // The dashboard assistant owns Savannah's actual voice; don't replace it here.
      void vapi.start(SAVANNAH_VAPI.assistantId).then(() => {
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
        console.warn("Savannah call start fallback", describeError(error));
        setState("error");
        // Do not speak over a failed audio session; retain the independent reply path.
        const detail = describeError(error);
        const lower = detail.toLowerCase();
        setMessage(
          lower.includes("permission") || lower.includes("denied") || lower.includes("notallowed")
            ? "I need the microphone. Allow it for this site, then try again."
            : "Live line unavailable. Use the backup microphone or type.",
        );
      });
      forceMicOpen(vapi);
    } catch (error) {
      console.warn("Savannah call start fallback", describeError(error));
      setState("error");
      const detail = describeError(error);
      const lower = detail.toLowerCase();
      setMessage(
        lower.includes("permission") || lower.includes("denied") || lower.includes("notallowed")
          ? "I need the microphone. Allow it for this site, then try again."
          : "Live line unavailable. Use the backup microphone or type.",
      );
    }
  };

  openVoiceRef.current = () => {
    modeRef.current = "voice";
    setMode("voice");
    if (state !== "live" && state !== "connecting" && state !== "requesting") void toggle();
  };

  const label =
    state === "requesting" ? "Allow microphone…"
    : state === "connecting" ? "Opening the line…"
    : state === "live" ? "End call"
    : state === "error" ? "Talk with backup microphone"
    : "Talk to Savannah";

  const busy = state === "requesting" || state === "connecting";

  if (introActive) return null;

  // The secluded /savannah-room/* surfaces render their own full-room Savannah.
  // Everywhere else inherits this single canonical Savannah widget, so her voice,
  // brain and conversation behaviour do not drift between instruments or documents.
  if (pathname === "/savannah" || pathname === "/savannah/") return null;

  if (pathname.startsWith("/savannah-room/")) {
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
          right: 12,
          bottom: 16,
          zIndex: 2147483001,
          minHeight: 38,
          border: "1px solid rgba(21,21,21,.22)",
          padding: "0 12px",
          background: "#151515",
          color: "#f5f1e7",
          font: "inherit",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: ".09em",
          textTransform: "uppercase",
          boxShadow: "0 12px 30px rgba(0,0,0,.14)",
        }}
      >
        <img src="/home/savannah.jpg" alt="" style={{width:28,height:28,objectFit:"cover",borderRadius:"50%",verticalAlign:"middle",marginRight:9}} />
        Savannah · Talk / Type
      </button>
    );
  }

  return (
    <aside
      className="savannah-panel"
      aria-label="Savannah, ctrl+love employee #4"
      style={{
        position: "fixed",
        zIndex: 2147483001,
        width: "min(510px, calc(100vw - 24px))",
        maxWidth: "calc(100vw - 24px)",
        maxHeight: "calc(100dvh - 24px)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        left: pathname === "/savannah" ? 12 : "auto",
        right: 12,
        bottom: 12,
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
        @media (max-width: 650px) {
          .savannah-panel { left: 8px !important; right: 8px !important; bottom: max(8px, env(safe-area-inset-bottom)) !important; width: auto !important; max-width: none !important; max-height: calc(100dvh - 16px - env(safe-area-inset-bottom)) !important; }
          .savannah-chat-scroll { min-height: 100px !important; max-height: min(37dvh, 330px) !important; }
          .savannah-message-input { font-size: 16px !important; }
        }
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
        @keyframes savannahBlink {
          0%, 47%, 49%, 100% { transform: scaleY(1); }
          48% { transform: scaleY(.93); }
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

      <div style={{ display: "grid", gridTemplateColumns: "88px minmax(0, 1fr)", minHeight: 112 }}>
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
                  animation: speechMotion > 0 ? "none" : "savannahLowerFace 280ms ease-in-out infinite alternate",
                  transform: speechMotion > 0 ? `scaleY(${1 + speechMotion * .025}) translateY(${speechMotion * .4}px)` : undefined,
                  transition: "transform 90ms ease-out",
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
                  style={{ border: 0, background: "transparent", color: "#151515", minWidth: 44, minHeight: 44, padding: 10, fontSize: 20, lineHeight: 1, cursor: "pointer", opacity: .65, touchAction: "manipulation" }}
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

      {callTimeNotice && state === "live" ? (
        <div role="status" style={{ padding: "10px 14px", background: "#e9dfcd", borderTop: "1px solid rgba(21,21,21,.2)", fontSize: 12, fontWeight: 650, lineHeight: 1.4 }}>
          About a minute left. Start another call to continue.
        </div>
      ) : null}

      <div
        style={{
          borderTop: "1px solid rgba(21,21,21,.22)",
          padding: "10px 14px",
          background: "#151515",
          color: "#f5f1e7",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: ".1em",
          textTransform: "uppercase",
        }}
      >
        Talk or type to Savannah · she answers out loud
      </div>

      {false ? (
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
            className="savannah-chat-scroll"
            aria-live="polite"
            style={{
              maxHeight: "min(43dvh, 400px)",
              minHeight: 160,
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: "4px 18px",
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



          <button
            type="button"
            onClick={toggleBrowserMic}
            disabled={textPending}
            aria-label={micListening ? "Finish speaking to Savannah" : "Talk to Savannah"}
            style={{
              width: "100%", minHeight: 58, touchAction: "manipulation",
              border: 0, borderBottom: "1px solid rgba(21,21,21,.18)",
              background: state === "live" ? "#e9dfcd" : "#151515",
              color: state === "live" ? "#151515" : "#f5f1e7",
              font: "inherit", fontSize: 11, fontWeight: 800,
              letterSpacing: ".08em", textTransform: "uppercase",
              cursor: busy ? "default" : "pointer", opacity: busy ? .55 : 1,
            }}
          >{micListening ? "Listening… tap to finish" : textPending ? "Savannah is thinking…" : "Talk to Savannah"}</button>


          <button
            type="button"
            onClick={testLocalVoice}
            aria-label="Hear a sample of Savannah’s voice"
            style={{
              width: "100%",
              minHeight: 54,
              touchAction: "manipulation",
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
            Hear Savannah
          </button>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendText();
            }}
            style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", minWidth: 0, width: "100%" }}
          >
            <input
              ref={textInputRef}
              className="savannah-message-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Type to Savannah"
              placeholder="Type to Savannah…"
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
                fontSize: 16,
              }}
            />
            <button
              type="submit"
              disabled={textPending || !draft.trim()}
              style={{
                minWidth: 84,
                minHeight: 52,
                touchAction: "manipulation",
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
