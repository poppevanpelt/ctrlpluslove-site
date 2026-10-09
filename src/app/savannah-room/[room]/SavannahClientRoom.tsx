"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./room.module.css";
import { roomBrief } from "./room-briefs";
import { BONKERS_TOOLS } from "../../bonkers/tools";
import { speakSavannahNeurally, stopSavannahLocalVoice } from "../../savannah-local-voice";

const VIDEO_SRC = "https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4";

type CallState = "idle" | "listening" | "thinking" | "speaking" | "error";
type TranscriptRole = "user" | "assistant";
type TranscriptLine = { id: number; role: TranscriptRole; text: string };

type BrowserSpeechRecognitionEvent = Event & {
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
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

type Props = {
  roomSlug: string;
  roomName: string;
};

export default function SavannahClientRoom({ roomSlug, roomName }: Props) {
  const isBonkers = roomSlug.toLowerCase() === "bonkers";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const conversationRef = useRef<Array<{ role: TranscriptRole; text: string }>>([]);
  const [entered, setEntered] = useState(false);
  const [state, setState] = useState<CallState>("idle");
  const [message, setMessage] = useState(isBonkers ? "I know the ten tools. Bring me the live job." : "Room ready. Savannah is here when you need her.");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [draft, setDraft] = useState("");
  const transcriptIdRef = useRef(0);

  const appendLine = (role: TranscriptRole, rawText: string) => {
    const text = rawText.replace(/\s+/g, " ").trim();
    if (!text) return;
    const last = conversationRef.current[conversationRef.current.length - 1];
    if (last?.role === role && last.text === text) return;
    conversationRef.current = [...conversationRef.current.slice(-39), { role, text }];
    transcriptIdRef.current += 1;
    setTranscript((previous) => [...previous.slice(-39), {
      id: transcriptIdRef.current,
      role,
      text,
    }]);
  };

  const roomContext = () => [
    "ROOM MODE: you are inside a secluded client working room. The room-specific brief narrows your context; it does not replace your Savannah personality, ctrl+love knowledge or privacy boundaries.",
    roomBrief(roomSlug),
  ].filter(Boolean).join("\n\n");

  const submitToSavannah = async (rawText: string) => {
    const text = rawText.replace(/\s+/g, " ").trim();
    if (!text || state === "thinking") return;

    appendLine("user", text);
    setDraft("");
    setState("thinking");
    setMessage("Thinking.");

    try {
      const response = await fetch("/api/savannah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationRef.current.slice(-18),
          context: roomContext(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload?.text !== "string") {
        throw new Error(payload?.error || "Savannah brain unavailable");
      }

      const reply = payload.text.trim();
      appendLine("assistant", reply);
      setState("speaking");
      setMessage("Here.");
      // Audio is a separate delivery step: a text response is not proof of audible playback.
      void speakSavannahNeurally(reply, {
        onStart: () => {
          setState("speaking");
          setMessage("Savannah is answering.");
        },
        onEnd: () => {
          setState("idle");
          setMessage("Room ready. Talk or type.");
        },
      }).then((played) => {
        if (!played) {
          setState("error");
          setMessage("Her reply is in the transcript, but audio did not start. Tap Talk to try again.");
        }
      });
    } catch (error) {
      console.error("Savannah room brain failed", error);
      setState("error");
      setMessage("I lost my train of thought. Try that once more.");
    }
  };

  const stopListening = () => {
    try { speechRecognitionRef.current?.stop(); } catch {}
  };

  const toggleCall = () => {
    if (state === "listening") {
      stopListening();
      return;
    }
    if (state === "thinking" || state === "speaking") return;

    const speechWindow = window as typeof window & {
      SpeechRecognition?: BrowserSpeechRecognitionCtor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
    };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setState("error");
      setMessage("This browser won't give me speech recognition. Type here instead, or use Safari/Chrome with microphone access.");
      return;
    }

    try {
      const recognition = new Recognition();
      speechRecognitionRef.current = recognition;
      recognition.lang = navigator.language || "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setState("listening");
        setMessage("I'm listening.");
      };

      recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";
        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          const heard = result?.[0]?.transcript?.trim() || "";
          if (!heard) continue;
          if (result.isFinal) finalText += `${heard} `;
          else interimText += `${heard} `;
        }
        const heard = (finalText || interimText).trim();
        if (heard) setMessage(`Heard: “${heard}”`);
        if (finalText.trim()) {
          try { recognition.stop(); } catch {}
          void submitToSavannah(finalText.trim());
        }
      };

      recognition.onerror = (event) => {
        const error = event.error || "";
        setState("error");
        setMessage(
          error === "not-allowed" || error === "service-not-allowed"
            ? "I need microphone permission for this room."
            : "I lost the microphone. Tap Talk and try me again.",
        );
      };

      recognition.onend = () => {
        setState((current) => current === "listening" ? "idle" : current);
        setMessage((current) => current === "I'm listening." ? "Room ready. Talk or type." : current);
      };

      recognition.start();
    } catch (error) {
      console.error("Savannah room microphone failed", error);
      setState("error");
      setMessage("I couldn't open the microphone. Tap Talk and try me again.");
    }
  };

  useEffect(() => {
    return () => {
      try { speechRecognitionRef.current?.abort(); } catch {}
      stopSavannahLocalVoice();
    };
  }, []);


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
    setMessage(isBonkers ? "I know the ten tools. Bring me the live job." : "Room ready. Talk or type.");
  };

  const sendTypedMessage = () => {
    void submitToSavannah(draft);
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
            <span className={state === "listening" || state === "thinking" || state === "speaking" ? styles.liveDot : styles.dot} />
            {state === "listening" ? "LISTENING" : state === "thinking" ? "THINKING" : state === "speaking" ? "SPEAKING" : state === "error" ? "ERROR" : "ROOM READY"}
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
              <button type="button" onClick={toggleCall} disabled={state === "thinking" || state === "speaking"}>
                {state === "listening" ? "Stop listening" : state === "thinking" ? "Thinking…" : state === "speaking" ? "Savannah is talking…" : "Talk to Savannah"}
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
              <button type="submit" disabled={!draft.trim() || state === "thinking" || state === "speaking"}>
                Send
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
