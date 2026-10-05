"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useMemo, useRef, useState } from "react";
import { SAVANNAH_BRIEFING } from "../../savannah-briefing";
import styles from "./room.module.css";
import { BRIDGEFUND_ROOM_BRIEF } from "./bridgefund-brief";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const VIDEO_SRC =
  "https://dnznrvs05pmza.cloudfront.net/kling-o3-pro/935632333061881948/Create_one_continuous_restrained_photoreal_transition_from_this_exact_approved_ctrl_love_office_stil.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWJmZDk1NjljNDQ5YTA4OSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTI2NDQ4OX0.AqSXIvZLlf5QDQ_JRecyUxtKQxSupPRjk1AoSV1aJI0";

type CallState = "idle" | "connecting" | "live" | "error";

type Props = {
  roomSlug: string;
  roomName: string;
};

function roomSystemPrompt(roomName: string, roomSlug: string) {
  const clientBrief = roomSlug.toLowerCase() === "bridgefund" ? BRIDGEFUND_ROOM_BRIEF : "";
  return `${SAVANNAH_BRIEFING}

You are now inside a Savannah Room for "${roomName}" (room id: ${roomSlug}).

ROOM RULES — THESE OVERRIDE BROADER CLIENT CONTEXT:
- Treat this conversation as room-scoped.
- Use only information explicitly introduced in this room, public ctrl+love information, and information the visitor gives you now.
- Do not reveal, infer, compare, hint at, or reuse private information about another ctrl+love client or project, even if broader system context contains it.
- If asked about another client's private work, say that it belongs to another room and you cannot bring it in here.
- Never claim you can see a file, inbox, calendar, recording, database, or previous room unless that access is actually present in this session.
- Before any outward action (sending, publishing, spending, booking, changing calendars, contacting people, or modifying external systems), ask for an explicit human yes unless the action has already been explicitly authorized in this conversation.
- Keep the tone quieter than the front-door Savannah: calm, concise, confident, not salesy.
- If the visitor asks what is private here, explain the room rule accurately: Savannah is instructed to keep the conversation room-scoped; hard client authentication/data partitioning is a separate security layer and should not be overstated.

${clientBrief}
`;
}

export default function SavannahClientRoom({ roomSlug, roomName }: Props) {
  const vapiRef = useRef<Vapi | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const micWakeTimersRef = useRef<number[]>([]);
  const [entered, setEntered] = useState(false);
  const [state, setState] = useState<CallState>("idle");
  const [message, setMessage] = useState("Door closed. Savannah is here when you need her.");
  const [speaking, setSpeaking] = useState(false);

  const prompt = useMemo(() => roomSystemPrompt(roomName, roomSlug), [roomName, roomSlug]);

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

  useEffect(() => {
    const globalWidget = document.querySelector<HTMLElement>('aside[aria-label="Savannah, ctrl+love employee #4"]');
    const previousDisplay = globalWidget?.style.display;
    if (globalWidget) globalWidget.style.display = "none";

    const vapi = new Vapi(
      PUBLIC_KEY,
      undefined,
      { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true },
      { startAudioOff: false },
    );
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setState("live");
      setMessage("I'm listening.");
      try {
        vapi.setMuted(false);
        vapi.send({
          type: "add-message",
          message: { role: "system", content: prompt },
        } as any);
      } catch {}
    });

    vapi.on("speech-start", () => setSpeaking(true));
    vapi.on("speech-end", () => setSpeaking(false));
    vapi.on("call-end", () => {
      clearMicWakeTimers();
      setSpeaking(false);
      setState("idle");
      setMessage("Room stays here. Call ended.");
    });
    vapi.on("error", (error: unknown) => {
      console.error("Savannah Room Vapi error", error);
      setSpeaking(false);
      setState("error");
      setMessage("The line did not open. Try once more.");
    });

    return () => {
      clearMicWakeTimers();
      try { vapi.stop(); } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
      if (globalWidget) globalWidget.style.display = previousDisplay ?? "";
    };
  }, [prompt]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => {
      try {
        video.currentTime = 1.35;
        void video.play();
      } catch {}
    };
    video.addEventListener("loadedmetadata", onLoaded, { once: true });
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  const enterRoom = () => {
    setEntered(true);
    setMessage("Door closed. Savannah is here when you need her.");
  };

  const toggleCall = () => {
    const vapi = vapiRef.current;
    if (!vapi || state === "connecting") return;

    if (state === "live") {
      clearMicWakeTimers();
      vapi.stop();
      return;
    }

    setState("connecting");
    setMessage("Opening the room line.");

    try {
      void vapi.start(
        ASSISTANT_ID,
        {
          firstMessage: `Hi. Savannah. You're in the ${roomName} room. What are we working on?`,
          voice: { provider: "vapi", voiceId: "Savannah", version: 2 },
          backgroundSound: "office",
        } as any,
      ).then(() => {
        forceMicOpen(vapi);
      }).catch((error: unknown) => {
        clearMicWakeTimers();
        console.error("Savannah Room start failed", error);
        setState("error");
        setMessage("The audio line did not open. Check microphone access, then try again.");
      });
      forceMicOpen(vapi);
    } catch (error) {
      clearMicWakeTimers();
      console.error("Savannah Room start failed", error);
      setState("error");
      setMessage("The audio line did not open. Check microphone access, then try again.");
    }
  };

  return (
    <main className={styles.root} id="main-content" data-room={roomSlug}>
      <div className={styles.videoLayer} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          playsInline
          preload="metadata"
          loop
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        <div className={styles.videoShade} />
      </div>

      <header className={styles.topbar}>
        <a className={styles.brand} href="/">ctrl+love</a>
        <span>SAVANNAH ROOM / {roomName}</span>
        <span className={styles.lock}>PRIVATE WORKING ROOM · NOINDEX</span>
      </header>

      <section className={`${styles.entry} ${entered ? styles.entryGone : ""}`}>
        <div className={styles.entryCopy}>
          <p className={styles.kicker}>One client. One room. One Savannah.</p>
          <h1>{roomName}</h1>
          <p className={styles.intro}>
            The front door is outside. In here, Savannah works with this room only.
          </p>
          <button type="button" className={styles.enterButton} onClick={enterRoom}>
            Enter room ↘
          </button>
        </div>
      </section>

      <section className={`${styles.room} ${entered ? styles.roomVisible : ""}`}>
        <div className={styles.roomHeader}>
          <div>
            <p className={styles.kicker}>Savannah / secluded client room</p>
            <h2>The door is closed.</h2>
          </div>
          <div className={styles.status}>
            <span className={speaking ? styles.liveDot : styles.dot} />
            {state === "live" ? "LIVE" : state === "connecting" ? "OPENING" : "ROOM READY"}
          </div>
        </div>

        <div className={styles.grid}>
          <article className={styles.savannahCard}>
            <div className={styles.portraitWrap}>
              <img src="/savannah-avatar.jpg?v=20261002-4" alt="Savannah" className={speaking ? styles.speaking : ""} />
            </div>
            <div className={styles.savannahCopy}>
              <span>EMPLOYEE #4 / ROOM MODE</span>
              <h3>Savannah</h3>
              <p>{message}</p>
              <button type="button" onClick={toggleCall} disabled={state === "connecting"}>
                {state === "live" ? "End room call" : state === "connecting" ? "Opening…" : "Talk to Savannah"}
              </button>
            </div>
          </article>

          <article className={styles.rules}>
            <span>ROOM RULES</span>
            <h3>What stays in here.</h3>
            <dl>
              <div>
                <dt>THIS ROOM</dt>
                <dd>The brief, approved material and conversation introduced here.</dd>
              </div>
              <div>
                <dt>OTHER CLIENTS</dt>
                <dd>Not imported, compared or disclosed. Another client belongs to another room.</dd>
              </div>
              <div>
                <dt>OUTWARD ACTIONS</dt>
                <dd>Sending, publishing, booking, spending or changing something requires a human yes.</dd>
              </div>
            </dl>
          </article>

          <article className={styles.note}>
            <span>IMPORTANT / SECURITY</span>
            <p>
              This prototype enforces room behaviour inside Savannah&apos;s runtime instructions.
              It is intentionally unlisted and noindexed. Hard authentication and storage-level
              client partitioning are the next security layer — this page does not pretend otherwise.
            </p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>ctrl+love / SavannahOS</span>
        <a href="/">Leave room ↑</a>
      </footer>
    </main>
  );
}
