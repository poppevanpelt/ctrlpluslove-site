"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";
import { TED_BRIEFING } from "./ted-briefing";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const TED_BARK_URL = "https://commons.wikimedia.org/wiki/Special:Redirect/file/George_vuf_1996.ogg";

type TedSound = "HUFF" | "BARK" | "DOUBLE" | "RUMBLE" | "SIGH";
type State = "idle" | "connecting" | "live" | "error";
type Variant = "bridgefund" | "talks";

type VapiMessage = {
  type?: string;
  role?: string;
  transcript?: string;
  transcriptType?: string;
  text?: string;
};

function parseTedResponse(raw: string) {
  const match = raw.match(/^\s*\[\[TED:(HUFF|BARK|DOUBLE|RUMBLE|SIGH)\]\]\s*/i);
  const sound = (match?.[1]?.toUpperCase() as TedSound | undefined) ?? "HUFF";
  const subtitle = raw.replace(/^\s*\[\[TED:(HUFF|BARK|DOUBLE|RUMBLE|SIGH)\]\]\s*/i, "").trim();
  return { sound, subtitle: subtitle || "…" };
}

export function TedExperience({ variant }: { variant: Variant }) {
  const vapiRef = useRef<Vapi | null>(null);
  const dogAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastAssistantRawRef = useRef("");
  const [state, setState] = useState<State>("idle");
  const [subtitle, setSubtitle] = useState(
    variant === "bridgefund"
      ? "Vertel. Wat ruikt hier naar gedoe?"
      : "Ask the dog."
  );
  const [heard, setHeard] = useState("");

  const playOne = (rate: number, volume: number, delay = 0) => {
    window.setTimeout(() => {
      try {
        const audio = new Audio(TED_BARK_URL);
        audio.preload = "auto";
        audio.playbackRate = rate;
        audio.volume = volume;
        dogAudioRef.current = audio;
        void audio.play().catch(() => {});
      } catch {}
    }, delay);
  };

  const playTedSound = (sound: TedSound) => {
    try { dogAudioRef.current?.pause(); } catch {}
    if (sound === "DOUBLE") {
      playOne(1, 0.82);
      playOne(0.96, 0.76, 330);
      return;
    }
    if (sound === "RUMBLE") return playOne(0.52, 0.52);
    if (sound === "SIGH") return playOne(0.42, 0.34);
    if (sound === "HUFF") return playOne(0.72, 0.48);
    playOne(1, 0.82);
  };

  const handleAssistantText = (raw: string) => {
    if (!raw || raw === lastAssistantRawRef.current) return;
    lastAssistantRawRef.current = raw;
    const parsed = parseTedResponse(raw);
    setSubtitle(parsed.subtitle);
    playTedSound(parsed.sound);
  };

  useEffect(() => {
    const vapi = new Vapi(
      PUBLIC_KEY,
      undefined,
      { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true },
      { startAudioOff: false },
    );
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setState("live");
      try { vapi.setMuted(false); } catch {}
      try {
        vapi.send({
          type: "add-message",
          message: { role: "system", content: TED_BRIEFING },
        } as any);
      } catch {}
    });

    vapi.on("message", (raw: unknown) => {
      const message = raw as VapiMessage;
      if (message.type === "assistant.speechStarted" && message.text) {
        setSubtitle(message.text);
        return;
      }
      if (message.type === "transcript") {
        if (message.role === "assistant" && message.transcript) setSubtitle(message.transcript);
        if (message.role === "user" && message.transcript) setHeard(message.transcript);
      }
    });

    vapi.on("call-end", () => {
      try { dogAudioRef.current?.pause(); } catch {}
      dogAudioRef.current = null;
      lastAssistantRawRef.current = "";
      setState("idle");
      setHeard("");
    });

    vapi.on("error", (error: unknown) => {
      console.error("Ted Vapi error", error);
      setState("error");
      setSubtitle("Ted lost the scent. Try again.");
    });

    return () => {
      try { dogAudioRef.current?.pause(); } catch {}
      dogAudioRef.current = null;
      try { vapi.stop(); } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const start = async () => {
    const vapi = vapiRef.current;
    if (!vapi || state === "connecting" || state === "live") return;
    setState("connecting");
    setHeard("");
    setSubtitle("…");

    try {
      await vapi.start(
        ASSISTANT_ID,
        {
          firstMessageMode: "assistant-waits-for-user",
          firstMessage: "",
          backgroundSound: "office",
          modelOutputInMessagesEnabled: true,
          clientMessages: ["assistant.speechStarted", "transcript", "speech-update", "status-update"],
          voice: {
            provider: "custom-voice",
            server: { url: `${window.location.origin}/api/ted-voice`, timeoutSeconds: 10 },
            cachingEnabled: false,
          },
        } as any,
      );
      try { vapi.setMuted(false); } catch {}
    } catch (error) {
      console.error("Ted call start failed", error);
      setState("error");
      setSubtitle("Ted could not get through the dog door. Try again.");
    }
  };

  const stop = () => {
    try { dogAudioRef.current?.pause(); } catch {}
    try { vapiRef.current?.stop(); } catch {}
  };

  const live = state === "live";
  const buttonText = live ? "End conversation" : state === "connecting" ? "Opening mic…" : "Talk to Ted";

  if (variant === "talks") {
    return (
      <main style={{ minHeight: "100vh", background: "#070707", color: "white", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden" }}>
        <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "40px 20px 0", background: "radial-gradient(circle at 50% 32%, rgba(255,255,255,.13), transparent 28%), linear-gradient(180deg,#121212 0%,#050505 72%)" }}>
          <div aria-hidden style={{ position: "absolute", inset: "0 0 auto", height: 12, background: "#e62b1e", boxShadow: "0 0 55px rgba(230,43,30,.55)" }} />
          <div style={{ position: "absolute", left: "5vw", top: "10vh", fontSize: "clamp(70px,14vw,190px)", fontWeight: 900, letterSpacing: "-.08em", color: "#e62b1e", lineHeight: .75 }}>TED</div>
          <div style={{ position: "absolute", left: "5.5vw", top: "calc(10vh + clamp(70px,14vw,190px))", fontSize: 13, letterSpacing: ".23em", fontWeight: 800, opacity: .72 }}>TALKS</div>

          <section style={{ width: "min(760px, 92vw)", position: "relative", zIndex: 2, textAlign: "center" }}>
            <div style={{ width: "min(400px,66vw)", aspectRatio: "4/5", margin: "0 auto -18px", position: "relative" }}>
              <img src="/ted/ted-portrait.webp" alt="Ted, Chief Sniffing Officer" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", borderRadius: "50% 50% 8px 8px", filter: "contrast(1.03) saturate(.88)", boxShadow: "0 0 110px rgba(255,255,255,.13)" }} />
              <div style={{ position: "absolute", inset: "auto 50% -28px auto", transform: "translateX(50%)", width: 230, height: 70, borderRadius: "50%", background: "#e62b1e", zIndex: -1 }} />
            </div>

            <div aria-live="polite" style={{ margin: "0 auto", maxWidth: 720, background: "rgba(0,0,0,.86)", border: "1px solid rgba(255,255,255,.2)", padding: "18px 22px", fontSize: "clamp(22px,3.7vw,38px)", lineHeight: 1.08, fontWeight: 650, letterSpacing: "-.025em", boxShadow: "0 16px 60px rgba(0,0,0,.45)" }}>
              [{subtitle}]
            </div>

            {heard ? <div style={{ marginTop: 10, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", opacity: .46 }}>You: {heard}</div> : null}

            <button onClick={live ? stop : start} disabled={state === "connecting"} style={{ margin: "22px 0 36px", minHeight: 52, border: 0, padding: "0 26px", background: live ? "#fff" : "#e62b1e", color: live ? "#111" : "#fff", font: "inherit", fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>
              {buttonText}
            </button>
          </section>

          <div aria-hidden style={{ position: "absolute", bottom: -15, left: -30, right: -30, height: 65, background: "radial-gradient(ellipse at center, #191919 0 35%, #050505 72%)", opacity: .95 }} />
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f0e8", color: "#171717", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header style={{ height: 82, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(22px,5vw,72px)", borderBottom: "1px solid rgba(0,0,0,.13)", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 900, letterSpacing: "-.04em" }}>
          <span style={{ width: 28, height: 18, display: "inline-block", borderRadius: "18px 18px 2px 2px", border: "6px solid #171717", borderBottom: 0 }} />
          BridgeFund
        </div>
        <nav style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 13, fontWeight: 650 }}>
          <span>Financiering</span><span>Beleggen</span><span>Kennis & tips</span>
          <button style={{ border: 0, background: "#171717", color: "#fff", padding: "13px 18px", fontWeight: 800 }}>Check je mogelijkheden</button>
        </nav>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(340px,.9fr)", minHeight: "calc(100vh - 82px)" }}>
        <div style={{ padding: "clamp(54px,8vw,110px) clamp(26px,7vw,110px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: ".18em", textTransform: "uppercase", opacity: .5, marginBottom: 22 }}>BridgeFund × ctrl+love / live test</div>
          <h1 style={{ margin: 0, maxWidth: 700, fontSize: "clamp(62px,9vw,132px)", lineHeight: .83, letterSpacing: "-.075em" }}>Wie houdt je tegen</h1>
          <p style={{ margin: "28px 0 0", maxWidth: 520, fontSize: "clamp(20px,2.3vw,30px)", lineHeight: 1.13, fontWeight: 650 }}>Zakelijke financiering zonder gedoe.</p>
          <p style={{ maxWidth: 520, fontSize: 16, lineHeight: 1.55, opacity: .62 }}>En als er tóch gedoe is, heeft Ted er meestal eerder lucht van dan het formulier.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <button onClick={live ? stop : start} disabled={state === "connecting"} style={{ minHeight: 54, border: 0, padding: "0 24px", background: "#171717", color: "#fff", font: "inherit", fontWeight: 900, cursor: "pointer" }}>{buttonText}</button>
            <button style={{ minHeight: 54, border: "1px solid #171717", padding: "0 24px", background: "transparent", font: "inherit", fontWeight: 800 }}>Check je mogelijkheden</button>
          </div>
        </div>

        <div style={{ position: "relative", minHeight: 620, overflow: "hidden", background: "#d9d0c2" }}>
          <img src="/ted/ted-portrait.webp" alt="Ted, BridgeFund Chief Sniffing Officer" style={{ width: "100%", height: "100%", position: "absolute", inset: 0, objectFit: "cover", objectPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 35%,rgba(0,0,0,.1) 58%,rgba(0,0,0,.52) 100%)" }} />
          <div style={{ position: "absolute", left: 22, top: 22, padding: "9px 12px", background: "rgba(255,255,255,.9)", fontSize: 10, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase" }}>Ted / Chief Sniffing Officer</div>
          <div aria-live="polite" style={{ position: "absolute", left: 22, right: 22, bottom: 34, background: "rgba(0,0,0,.86)", color: "#fff", padding: "18px 20px", fontSize: "clamp(20px,2.5vw,34px)", lineHeight: 1.08, fontWeight: 650, letterSpacing: "-.025em" }}>
            [{subtitle}]
          </div>
          {heard ? <div style={{ position: "absolute", right: 24, bottom: 12, color: "#fff", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", opacity: .62 }}>You: {heard}</div> : null}
        </div>
      </section>
    </main>
  );
}
