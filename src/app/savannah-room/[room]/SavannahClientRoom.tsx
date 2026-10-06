"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";
import styles from "./room.module.css";
import { SAVANNAH_ROOM_VAPI } from "./vapi-config";
import { roomBrief } from "./room-briefs";
import { BONKERS_TOOLS } from "../../bonkers/tools";

const VIDEO_SRC = "https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4";

type CallState = "idle" | "connecting" | "live" | "error";
type TranscriptRole = "user" | "assistant";
type TranscriptLine = { id: number; role: TranscriptRole; text: string };
type TranscriptMessage = { type?: string; role?: string; transcriptType?: string; transcript?: string; status?: string };

type Props = {
  roomSlug: string;
  roomName: string;
};

export default function SavannahClientRoom({ roomSlug, roomName }: Props) {
  const isBonkers = roomSlug.toLowerCase() === "bonkers";
  const vapiRef = useRef<Vapi | null>(null);
  const queuedTextRef = useRef<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [state, setState] = useState<CallState>("idle");
  const [message, setMessage] = useState(isBonkers ? "I know the ten tools. Bring me the live job." : "Door closed. Savannah is here when you need her.");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [draft, setDraft] = useState("");
  const transcriptIdRef = useRef(0);

  useEffect(() => {
    const vapi = new Vapi(SAVANNAH_ROOM_VAPI.publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      const brief = roomBrief(roomSlug);
      if (brief) {
        vapi.send({ type: "add-message", message: { role: "system", content: brief } });
      }
      const queued = queuedTextRef.current;
      if (queued) {
        vapi.send({ type: "add-message", message: { role: "user", content: queued } });
        queuedTextRef.current = null;
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
    setMessage(isBonkers ? "I know the ten tools. Bring me the live job." : "Door closed. Savannah is here when you need her.");
  };

  const appendVisitorLine = (text: string) => {
    transcriptIdRef.current += 1;
    setTranscript((previous) => [...previous.slice(-39), {
      id: transcriptIdRef.current,
      role: "user" as const,
      text,
    }]);
  };

  const sendTypedMessage = () => {
    const text = draft.replace(/\s+/g, " ").trim();
    const vapi = vapiRef.current;
    if (!text || !vapi || state === "connecting") return;

    appendVisitorLine(text);
    setDraft("");

    if (state === "live") {
      vapi.send({ type: "add-message", message: { role: "user", content: text } });
      return;
    }

    queuedTextRef.current = text;
    setState("connecting");
    setMessage("Opening the room line.");

    void vapi.start(SAVANNAH_ROOM_VAPI.assistantId).catch((error: unknown) => {
      console.error("Savannah Room typed start failed", error);
      queuedTextRef.current = null;
      setState("error");
      setMessage("Vapi start failed.");
    });
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
          <p className={styles.kicker}>{isBonkers ? "Bonkers × ctrl+love / secluded working room" : "One client. One room. One Savannah."}</p>
          <h1>{roomName}</h1>
          <p className={styles.intro}>
            {isBonkers
              ? "Producer instinct, ten working instruments and Savannah in one room. Bring a live job."
              : "The front door is outside. In here, Savannah works with this room only."}
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
            <h2>{isBonkers ? "The producer gets here first." : "The door is closed."}</h2>
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

          {isBonkers ? (
            <article className={styles.bonkersDesk}>
              <div className={styles.bonkersIntro}>
                <span>BONKERS / FIELD KIT</span>
                <h3>Ten tools. One live job.</h3>
                <p>
                  Bonkers already works like a bespoke hive. The point here is not to become broader.
                  It is to get producer intelligence into the room early enough to change the work.
                </p>
                <div className={styles.bonkersPremise}>
                  <b>FIRST USE</b>
                  <p>Take one live job. Run the UPSTREAM TEST. Then choose the one instrument that changes what happens next.</p>
                </div>
                <a className={styles.fullKitLink} href="/bonkers">Open full tool room →</a>
              </div>
              <div className={styles.toolGrid}>
                {BONKERS_TOOLS.map((tool) => (
                  <a key={tool.slug} className={styles.toolLink} href={"/bonkers/" + tool.slug}>
                    <span>{tool.index}</span>
                    <strong>{tool.title}</strong>
                    <small>{tool.kicker}</small>
                  </a>
                ))}
              </div>
            </article>
          ) : null}

          <article className={styles.transcriptPanel}>
            <span>ROOM TRANSCRIPT / LIVE CHECK</span>
            <div className={styles.transcriptBody} aria-live="polite">
              {transcript.length ? transcript.map((line) => (
                <p key={line.id}><strong>{line.role === "assistant" ? "SAVANNAH" : "VISITOR"}</strong>{line.text}</p>
              )) : <p className={styles.transcriptEmpty}>No words captured yet.</p>}
            </div>
            <form
              className={styles.keyboard}
              onSubmit={(event) => {
                event.preventDefault();
                sendTypedMessage();
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={isBonkers ? "Type the live problem to Savannah…" : "Type to Savannah…"}
                aria-label="Type to Savannah"
              />
              <button type="submit" disabled={!draft.trim() || state === "connecting"}>
                {state === "live" ? "Send" : "Send + open line"}
              </button>
            </form>
          </article>

          <article className={styles.note}>
            <span>IMPORTANT / SECURITY</span>
            <p>
              Personal invite access gates this room before its content loads, and the page is unlisted
              and noindexed. Savannah also receives client-specific room instructions. This remains a
              working prototype; enterprise storage-level partitioning is not implied.
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
