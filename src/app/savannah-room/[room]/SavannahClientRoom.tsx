"use client";

import Vapi from "@vapi-ai/web";
import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./room.module.css";
import { SAVANNAH_ROOM_VAPI } from "./vapi-config";

const VIDEO_SRC = "https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4";

type CallState = "idle" | "connecting" | "live" | "error";
type TranscriptRole = "user" | "assistant";
type TranscriptLine = { id: number; role: TranscriptRole; text: string };
type TranscriptMessage = {
  type?: string;
  role?: string;
  transcriptType?: string;
  transcript?: string;
  status?: string;
};

type Props = {
  roomSlug: string;
  roomName: string;
  brief: string;
};

export default function SavannahClientRoom({ roomSlug, roomName, brief }: Props) {
  const vapiRef = useRef<Vapi | null>(null);
  const textVapiRef = useRef<Vapi | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [state, setState] = useState<CallState>("idle");
  const [textState, setTextState] = useState<CallState>("idle");
  const [message, setMessage] = useState("Door closed. Savannah is here when you need her.");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [draft, setDraft] = useState("");
  const [textPending, setTextPending] = useState(false);
  const transcriptIdRef = useRef(0);
  const queuedTextRef = useRef<string | null>(null);

  const appendTranscript = (role: TranscriptRole, rawText: string) => {
    const text = rawText.replace(/\s+/g, " ").trim();
    if (!text) return;

    transcriptIdRef.current += 1;
    setTranscript((previous) => {
      const last = previous[previous.length - 1];
      if (last?.role === role && last.text === text) return previous;
      return [...previous.slice(-39), { id: transcriptIdRef.current, role, text }];
    });
  };

  useEffect(() => {
    const vapi = new Vapi(
      SAVANNAH_ROOM_VAPI.publicKey,
      undefined,
      { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true },
      { startAudioOff: false },
    );
    const textVapi = new Vapi(
      SAVANNAH_ROOM_VAPI.publicKey,
      undefined,
      { avoidEval: true, alwaysIncludeMicInPermissionPrompt: true },
      { startAudioOff: true },
    );

    vapiRef.current = vapi;
    textVapiRef.current = textVapi;

    vapi.on("call-start", () => {
      if (brief) {
        vapi.send({ type: "add-message", message: { role: "system", content: brief } } as any);
      }
      try { vapi.setMuted(false); } catch {}
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
        appendTranscript(incoming.role, incoming.transcript);
      }
    });

    vapi.on("call-end", () => {
      setState("idle");
      setMessage("Room stays here. Call ended.");
    });

    vapi.on("error", (error: unknown) => {
      console.error("Savannah Room Vapi error", error);
      setState("error");
      setMessage("The audio line did not open. Type to me instead, or try again.");
    });

    textVapi.on("call-start", () => {
      try { textVapi.setMuted(true); } catch {}
      try {
        textVapi.send({ type: "control", control: "mute-assistant" } as any);
      } catch {}
      if (brief) {
        try {
          textVapi.send({
            type: "add-message",
            message: {
              role: "system",
              content: `${brief}\nText delivery: the visitor is typing. Reply as Savannah in short natural written turns. Keep this room's boundaries intact.`,
            },
          } as any);
        } catch {}
      }
      setTextState("live");
      setMessage("Quiet line open. Type away.");

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
        appendTranscript("assistant", incoming.transcript);
        setTextPending(false);
      }
    });

    textVapi.on("call-end", () => {
      setTextState("idle");
      setTextPending(false);
    });

    textVapi.on("error", (error: unknown) => {
      console.error("Savannah Room text error", error);
      setTextState("error");
      setTextPending(false);
      setMessage("The quiet line dropped. Try again.");
    });

    return () => {
      try { vapi.stop(); } catch {}
      try { textVapi.stop(); } catch {}
      vapi.removeAllListeners();
      textVapi.removeAllListeners();
      vapiRef.current = null;
      textVapiRef.current = null;
    };
  }, [brief]);

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

    if (textState === "live" || textState === "connecting") {
      try { textVapiRef.current?.stop(); } catch {}
    }

    setState("connecting");
    setMessage("Opening the room line.");

    void vapi.start(SAVANNAH_ROOM_VAPI.assistantId).catch((error: unknown) => {
      console.error("Savannah Room start failed", error);
      setState("error");
      setMessage("The audio line did not open. Type to me instead, or try again.");
    });
  };

  const startText = async () => {
    const textVapi = textVapiRef.current;
    if (!textVapi || textState === "connecting" || textState === "live") return;

    if (state === "live" || state === "connecting") {
      try { vapiRef.current?.stop(); } catch {}
    }

    setTextState("connecting");
    setMessage("Opening the quiet line.");

    try {
      await textVapi.start(
        SAVANNAH_ROOM_VAPI.assistantId,
        {
          firstMessage: "",
          voice: { provider: "vapi", voiceId: "Savannah", version: 2 },
        } as any,
      );
    } catch (error) {
      console.error("Savannah Room text start failed", error);
      setTextState("error");
      setMessage("The quiet line did not open. Try again.");
    }
  };

  const sendText = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    const textVapi = textVapiRef.current;
    if (!text || !textVapi || textPending) return;

    appendTranscript("user", text);
    setDraft("");
    setTextPending(true);

    if (textState !== "live") {
      queuedTextRef.current = text;
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
      console.error("Savannah Room text send failed", error);
      setTextPending(false);
      setMessage("That did not get through. Try it once more.");
    }
  };

  const active =
    state === "live" || state === "connecting" ||
    textState === "live" || textState === "connecting";

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
        <span className={styles.lock}>PRIVATE WORKING ROOM · INVITE ONLY</span>
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
            <span className={active ? styles.liveDot : styles.dot} />
            {state === "live" ? "VOICE LIVE" :
             textState === "live" ? "TYPE LIVE" :
             state === "connecting" || textState === "connecting" ? "OPENING" :
             state === "error" || textState === "error" ? "ERROR" : "ROOM READY"}
          </div>
        </div>

        <div className={styles.grid}>
          <article className={styles.savannahCard}>
            <div className={styles.portraitWrap}>
              <img src="/savannah-avatar.jpg?v=20261002-4" alt="Savannah" />
            </div>
            <div className={styles.savannahCopy}>
              <span>EMPLOYEE #4 / ROOM MODE</span>
              <h3>Savannah</h3>
              <p>{message}</p>
              <div className={styles.roomControls}>
                <button type="button" onClick={toggleCall} disabled={state === "connecting"}>
                  {state === "live" ? "End voice" : state === "connecting" ? "Opening…" : "Talk"}
                </button>
                <button type="button" onClick={() => void startText()} disabled={textState === "connecting"}>
                  {textState === "live" ? "Type line open" : textState === "connecting" ? "Opening…" : "Type"}
                </button>
              </div>
              <form className={styles.typeForm} onSubmit={sendText}>
                <input
                  className={styles.typeInput}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  aria-label="Type to Savannah"
                  placeholder="Type to Savannah…"
                  autoComplete="off"
                />
                <button className={styles.typeSend} type="submit" disabled={textPending || !draft.trim()}>
                  Send
                </button>
              </form>
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
                <p key={line.id}>
                  <strong>{line.role === "assistant" ? "SAVANNAH" : "VISITOR"}</strong>
                  {line.text}
                </p>
              )) : <p className={styles.transcriptEmpty}>No words captured yet.</p>}
            </div>
          </article>

          <article className={styles.note}>
            <span>IMPORTANT / SECURITY</span>
            <p>
              Personal invite access and noindex are active. Each client room receives only
              its own working brief. Sending, publishing, booking, spending or changing
              something still requires a human yes.
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
