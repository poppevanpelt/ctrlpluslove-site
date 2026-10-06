"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";
import styles from "./room.module.css";
import { SAVANNAH_ROOM_VAPI } from "./vapi-config";
import { roomBrief } from "./room-briefs";

const VIDEO_SRC =
  "https://dnznrvs05pmza.cloudfront.net/kling-o3-pro/935632333061881948/Create_one_continuous_restrained_photoreal_transition_from_this_exact_approved_ctrl_love_office_stil.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWJmZDk1NjljNDQ5YTA4OSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTI2NDQ4OX0.AqSXIvZLlf5QDQ_JRecyUxtKQxSupPRjk1AoSV1aJI0";

type CallState = "idle" | "connecting" | "live" | "error";
type TranscriptRole = "user" | "assistant";
type TranscriptLine = { id: number; role: TranscriptRole; text: string };
type TranscriptMessage = { type?: string; role?: string; transcriptType?: string; transcript?: string; status?: string };

type Props = {
  roomSlug: string;
  roomName: string;
};

export default function SavannahClientRoom({ roomSlug, roomName }: Props) {
  const vapiRef = useRef<Vapi | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [state, setState] = useState<CallState>("idle");
  const [message, setMessage] = useState("Door closed. Savannah is here when you need her.");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const transcriptIdRef = useRef(0);

  useEffect(() => {
    const vapi = new Vapi(SAVANNAH_ROOM_VAPI.publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      const brief = roomBrief(roomSlug);
      if (brief) {
        vapi.send({ type: "add-message", message: { role: "system", content: brief } });
      }
      setState("live");
      setMessage("I'm listening.");
    });

    vapi.on("message", (rawMessage: unknown) => {
      const incoming = rawMessage as TranscriptMessage;
      if (
        incoming?.type === "transcript" &&
        incoming.transcript &&
        (!incoming.transcriptType || incoming.transcriptType === "final") &&
        (incoming.role === "user" || incoming.role === "assistant")
      ) {
        const text = incoming.transcript.replace(/\s+/g, " ").trim();
        if (!text) return;
        transcriptIdRef.current += 1;
        setTranscript((previous) => {
          const last = previous[previous.length - 1];
          if (last?.role === incoming.role && last.text === text) return previous;
          return [...previous.slice(-39), { id: transcriptIdRef.current, role: incoming.role as TranscriptRole, text }];
        });
      }
    });

    vapi.on("call-end", () => {
      setState("idle");
      setMessage("Room stays here. Call ended.");
    });

    vapi.on("error", (error: unknown) => {
      console.error("Savannah Room Vapi error", error);
      setState("error");
      setMessage("Vapi did not open the line.");
    });

    return () => {
      try { vapi.stop(); } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, [roomSlug]);

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
      vapi.stop();
      return;
    }

    setState("connecting");
    setMessage("Opening the room line.");

    void vapi.start(SAVANNAH_ROOM_VAPI.assistantId).catch((error: unknown) => {
      console.error("Savannah Room start failed", error);
      setState("error");
      setMessage("Vapi start failed.");
    });
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
            <span className={state === "live" ? styles.liveDot : styles.dot} />
            {state === "live" ? "LIVE" : state === "connecting" ? "OPENING" : state === "error" ? "ERROR" : "ROOM READY"}
          </div>
        </div>

        <div className={styles.grid}>
          <article className={styles.savannahCard}>
            <div className={styles.portraitWrap}>
              <img src="/savannah-avatar.jpg?v=20261002-4" alt="Savannah"  />
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

          <article className={styles.transcriptPanel}>
            <span>ROOM TRANSCRIPT / LIVE CHECK</span>
            <div className={styles.transcriptBody} aria-live="polite">
              {transcript.length ? transcript.map((line) => (
                <p key={line.id}><strong>{line.role === "assistant" ? "SAVANNAH" : "VISITOR"}</strong>{line.text}</p>
              )) : <p className={styles.transcriptEmpty}>No words captured yet.</p>}
            </div>
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
