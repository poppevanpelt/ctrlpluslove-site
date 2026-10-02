"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";
import { TED_BRIEFING } from "../ted-briefing";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";

type State = "idle" | "connecting" | "live" | "error";

type VapiMessage = {
  type?: string;
  role?: string;
  transcript?: string;
  transcriptType?: string;
  text?: string;
  turn?: number;
  source?: string;
};

export default function TedTestPage() {
  const vapiRef = useRef<Vapi | null>(null);
  const [state, setState] = useState<State>("idle");
  const [subtitle, setSubtitle] = useState("TED IS OFF DUTY.");
  const [heard, setHeard] = useState("");
  const [detail, setDetail] = useState("English downstairs. Doggish upstairs.");

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
      setDetail("Ted is listening.");
      try { vapi.setMuted(false); } catch {}
      try {
        vapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: TED_BRIEFING,
          },
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
        if (message.role === "assistant" && message.transcript) {
          setSubtitle(message.transcript);
        }
        if (message.role === "user" && message.transcript) {
          setHeard(message.transcript);
        }
      }
    });

    vapi.on("call-end", () => {
      setState("idle");
      setDetail("Ted went back under the desk.");
      setHeard("");
    });

    vapi.on("error", (error: unknown) => {
      console.error("Ted Vapi error", error);
      setState("error");
      setDetail("Ted lost the scent. Try again.");
    });

    return () => {
      try { vapi.stop(); } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const start = async () => {
    const vapi = vapiRef.current;
    if (!vapi || state === "connecting" || state === "live") return;

    setState("connecting");
    setSubtitle("…");
    setHeard("");
    setDetail("Opening Ted.");

    try {
      const voiceUrl = `${window.location.origin}/api/ted-voice`;

      await vapi.start(
        ASSISTANT_ID,
        {
          firstMessageMode: "assistant-waits-for-user",
          firstMessage: "",
          backgroundSound: "office",
          modelOutputInMessagesEnabled: true,
          clientMessages: [
            "assistant.speechStarted",
            "transcript",
            "speech-update",
            "status-update",
          ],
          voice: {
            provider: "custom-voice",
            server: {
              url: voiceUrl,
              timeoutSeconds: 10,
            },
            cachingEnabled: false,
          },
        } as any,
      );

      try { vapi.setMuted(false); } catch {}
    } catch (error) {
      console.error("Ted call start failed", error);
      setState("error");
      setDetail("Ted could not get through the dog door. Try again.");
    }
  };

  const stop = () => {
    try { vapiRef.current?.stop(); } catch {}
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#efe9dc",
        color: "#151515",
        padding: "28px 18px 72px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".18em", marginBottom: 28 }}>
          CTRL+LOVE / BRIDGEFUND TEST / TED
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(150px, 260px) 1fr",
            border: "1px solid #151515",
            background: "#f6f0e5",
          }}
        >
          <div
            aria-label="Ted static portrait placeholder"
            style={{
              minHeight: 330,
              borderRight: "1px solid #151515",
              display: "flex",
              alignItems: "flex-end",
              padding: 18,
              background:
                "radial-gradient(circle at 48% 34%, #d8d0c0 0 9%, transparent 9.5%), linear-gradient(145deg, #292929 0 48%, #1a1a1a 48% 100%)",
              color: "#f6f0e5",
            }}
          >
            <div>
              <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: "-.06em", lineHeight: .85 }}>TED.</div>
              <div style={{ marginTop: 10, fontSize: 9, fontWeight: 800, letterSpacing: ".14em", opacity: .7 }}>
                STATIC PORTRAIT SLOT
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", minHeight: 330 }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #151515" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <strong style={{ fontSize: 20 }}>Ted</strong>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".12em", opacity: .55 }}>
                  {state.toUpperCase()}
                </span>
              </div>
              <div style={{ marginTop: 7, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", opacity: .6 }}>
                {detail}
              </div>
            </div>

            <div style={{ flex: 1, padding: "24px 20px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".16em", opacity: .5, marginBottom: 10 }}>
                DOGGISH SUBTITLES
              </div>
              <div aria-live="polite" style={{ fontSize: "clamp(25px, 5vw, 46px)", lineHeight: 1.03, letterSpacing: "-.035em", fontWeight: 700 }}>
                {subtitle}
              </div>
              {heard ? (
                <div style={{ marginTop: 26, paddingTop: 14, borderTop: "1px solid rgba(21,21,21,.25)", fontSize: 12, lineHeight: 1.4, opacity: .65 }}>
                  YOU: {heard}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={state === "live" ? stop : start}
              disabled={state === "connecting"}
              style={{
                border: 0,
                borderTop: "1px solid #151515",
                minHeight: 54,
                padding: "0 18px",
                background: state === "live" ? "#f6f0e5" : "#151515",
                color: state === "live" ? "#151515" : "#f6f0e5",
                font: "inherit",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".13em",
                textTransform: "uppercase",
                textAlign: "left",
                cursor: state === "connecting" ? "default" : "pointer",
              }}
            >
              {state === "live" ? "Send Ted back under the desk" : state === "connecting" ? "Calling Ted…" : "Talk to Ted"}
            </button>
          </div>
        </section>

        <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 12, lineHeight: 1.45, opacity: .62 }}>
          Ted never speaks human. The model answer stays intact for the subtitles; Vapi sends the same text to a custom voice endpoint that returns raw Doggish audio.
        </p>
      </div>
    </main>
  );
}
