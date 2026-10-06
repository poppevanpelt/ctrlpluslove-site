"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";
import styles from "./room.module.css";
import osStyles from "./savannah-os.module.css";
import { SAVANNAH_ROOM_VAPI } from "./vapi-config";
import { roomBrief } from "./room-briefs";
import { BONKERS_TOOLS } from "../../bonkers/tools";
import { actionLabel, buildActionPrompt, buildMemoryPrompt, deriveRoomMemory, detectSilentNudge, memoryStorageKey, parseStoredRoomMemory, type ActionKind, type RoomMemory } from "./savannah-os";

const VIDEO_SRC = "https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4";

type CallState = "idle" | "connecting" | "live" | "error";
type TranscriptRole = "user" | "assistant";
type TranscriptLine = { id: number; role: TranscriptRole; text: string; at: number };
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
  const memoryRef = useRef<RoomMemory>(deriveRoomMemory(roomSlug, []));
  const sessionStartIndexRef = useRef(0);
  const pendingActionRef = useRef<ActionKind | null>(null);
  const actionCaptureTimerRef = useRef<number | null>(null);
  const [memoryHydrated, setMemoryHydrated] = useState(false);
  const [silentMode, setSilentMode] = useState(true);
  const [actionPending, setActionPending] = useState(false);
  const [lastActionKind, setLastActionKind] = useState<ActionKind | null>(null);
  const [actionOutput, setActionOutput] = useState("");

  const memory = deriveRoomMemory(roomSlug, transcript.map((line) => ({ role: line.role, text: line.text, at: line.at })));
  const sessionMemory = deriveRoomMemory(roomSlug, transcript.slice(sessionStartIndexRef.current).map((line) => ({ role: line.role, text: line.text, at: line.at })));
  const silentNudge = silentMode ? detectSilentNudge(sessionMemory) : null;

  useEffect(() => {
    const stored = parseStoredRoomMemory(window.localStorage.getItem(memoryStorageKey(roomSlug)), roomSlug);
    if (stored) {
      const restored = stored.transcript.map((line, index) => ({ id: index + 1, role: line.role, text: line.text, at: line.at }));
      transcriptIdRef.current = restored.length;
      sessionStartIndexRef.current = restored.length;
      setTranscript(restored);
      memoryRef.current = stored;
    } else {
      transcriptIdRef.current = 0;
      sessionStartIndexRef.current = 0;
      setTranscript([]);
      memoryRef.current = deriveRoomMemory(roomSlug, []);
    }
    setMemoryHydrated(true);
  }, [roomSlug]);

  useEffect(() => {
    memoryRef.current = memory;
    if (!memoryHydrated) return;
    try { window.localStorage.setItem(memoryStorageKey(roomSlug), JSON.stringify(memory)); } catch {}
  }, [memoryHydrated, roomSlug, transcript]);

  useEffect(() => {
    const vapi = new Vapi(SAVANNAH_ROOM_VAPI.publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      const brief = roomBrief(roomSlug);
      const continuity = buildMemoryPrompt(memoryRef.current);
      const systemMessage = [brief, continuity].filter(Boolean).join("\n\n");
      if (systemMessage) vapi.send({ type: "add-message", message: { role: "system", content: systemMessage } });
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
          const next = [...previous.slice(-119), { id: transcriptIdRef.current, role: incoming.role as TranscriptRole, text, at: Date.now() }];
          return next;
        });
        if (incoming.role === "assistant" && pendingActionRef.current) {
          setActionOutput((previous) => previous ? `${previous}\n${text}` : text);
          if (actionCaptureTimerRef.current) window.clearTimeout(actionCaptureTimerRef.current);
          actionCaptureTimerRef.current = window.setTimeout(() => { pendingActionRef.current = null; setActionPending(false); }, 1600);
        });
      }
    });

    vapi.on("call-end", () => {
      setState("idle");
      setMessage("Room stays here. Call ended.");
      pendingActionRef.current = null;
      setActionPending(false);
    });

    vapi.on("error", (error: unknown) => {
      console.error("Savannah Room Vapi error", error);
      setState("error");
      setMessage("Vapi did not open the line.");
      pendingActionRef.current = null;
      setActionPending(false);
    });

    return () => {
      try { vapi.stop(); } catch {}
      vapi.removeAllListeners();
      if (actionCaptureTimerRef.current) window.clearTimeout(actionCaptureTimerRef.current);
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
      at: Date.now(),
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

  const requestAction = (kind: ActionKind) => {
    const vapi = vapiRef.current;
    if (!vapi || state === "connecting" || actionPending || !memory.transcript.length) return;
    const prompt = buildActionPrompt(kind, roomName, memory);
    pendingActionRef.current = kind;
    setLastActionKind(kind);
    setActionOutput("");
    setActionPending(true);
    setMessage(`Drafting ${actionLabel(kind).toLowerCase()}. Nothing leaves the room.`);
    if (state === "live") {
      vapi.send({ type: "add-message", message: { role: "user", content: prompt } });
    } else {
      queuedTextRef.current = prompt;
      setState("connecting");
      setMessage("Opening the room line.");
      void vapi.start(SAVANNAH_ROOM_VAPI.assistantId).catch((error: unknown) => {
        console.error("Savannah Room action start failed", error);
        pendingActionRef.current = null;
        setActionPending(false);
        setState("error");
        setMessage("Vapi start failed.");
      });
    }
  };

  const approveCopy = async () => {
    if (!actionOutput) return;
    try {
      await navigator.clipboard.writeText(actionOutput);
      setMessage("Approved draft copied. Still nothing sent.");
    } catch {
      setMessage("Clipboard permission was blocked. The draft is still here.");
    }
  };

  const approveEmailDraft = () => {
    if (!actionOutput) return;
    window.location.href = `mailto:?subject=${encodeURIComponent(`${roomName} / follow-up`)}&body=${encodeURIComponent(actionOutput)}`;
  };

  const forgetLocalMemory = () => {
    try { window.localStorage.removeItem(memoryStorageKey(roomSlug)); } catch {}
    setTranscript([]);
    transcriptIdRef.current = 0;
    sessionStartIndexRef.current = 0;
    memoryRef.current = deriveRoomMemory(roomSlug, []);
    setActionOutput("");
    setLastActionKind(null);
    setMessage("Local room memory cleared on this browser.");
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

          <article className={osStyles.memoryDesk}>
            <div className={osStyles.panelHead}><span>ROOM MEMORY / THIS BROWSER</span><b>{memory.transcript.length ? "REMEMBERING" : "EMPTY"}</b></div>
            <h3>She comes back knowing.</h3>
            <p className={osStyles.panelIntro}>Conversation survives reloads on this browser. Human wording counts as evidence; Savannah's own wording does not become a decision by repetition.</p>
            <div className={osStyles.memoryStats}>
              <div><b>{memory.decisions.length}</b><span>Decisions</span></div>
              <div><b>{memory.owners.length}</b><span>Owners</span></div>
              <div><b>{memory.openQuestions.length}</b><span>Questions</span></div>
              <div><b>{memory.nextTests.length}</b><span>Tests</span></div>
            </div>
            <div className={osStyles.memoryPeek}><span>LAST EXPLICIT SIGNAL</span><p>{memory.decisions.at(-1) ?? memory.openQuestions.at(-1) ?? memory.preferences.at(-1) ?? "Nothing explicit yet."}</p></div>
            <button type="button" className={osStyles.quietButton} onClick={forgetLocalMemory} disabled={!memory.transcript.length}>Forget local memory</button>
          </article>

          <article className={osStyles.observerDesk}>
            <div className={osStyles.panelHead}><span>SILENT OBSERVER</span><button type="button" className={osStyles.modeToggle} onClick={() => setSilentMode((value) => !value)}>{silentMode ? "ON" : "OFF"}</button></div>
            <h3>She does not have to speak.</h3>
            <p className={osStyles.panelIntro}>Watches the room for unowned decisions, missing tests and live opposition. Nudges stay on your screen; they are not spoken into the meeting.</p>
            <div className={`${osStyles.nudge} ${silentNudge ? osStyles.nudgeLive : ""}`}><span>PRIVATE NUDGE / NOT SENT TO ROOM</span><p>{silentMode ? (silentNudge ?? "Watching. Nothing worth interrupting you for yet.") : "Observer is off."}</p></div>
          </article>

          <article className={osStyles.actionDesk}>
            <div className={osStyles.panelHead}><span>ACTION DESK / APPROVAL REQUIRED</span><b>{actionPending ? "DRAFTING" : actionOutput ? "READY FOR YOU" : "IDLE"}</b></div>
            <div className={osStyles.actionGrid}>
              <div>
                <h3>Conversation → object.</h3>
                <p className={osStyles.panelIntro}>Savannah can turn the room into a follow-up, decision note or next-room primer. She prepares it. You decide whether anything leaves the room.</p>
                <div className={osStyles.actionButtons}>
                  {(["follow-up", "decision-note", "next-primer"] as ActionKind[]).map((kind) => <button key={kind} type="button" onClick={() => requestAction(kind)} disabled={actionPending || state === "connecting" || !memory.transcript.length}>{actionLabel(kind)}</button>)}
                </div>
              </div>
              <div className={osStyles.actionOutput}>
                <span>{lastActionKind ? `LATEST / ${actionLabel(lastActionKind).toUpperCase()}` : "LATEST DRAFT"}</span>
                <p>{actionOutput || (actionPending ? "Savannah is drafting from the room evidence…" : "Nothing drafted yet.")}</p>
                {actionOutput ? <div className={osStyles.approvalButtons}><button type="button" onClick={() => void approveCopy()}>Approve + copy</button>{lastActionKind === "follow-up" ? <button type="button" onClick={approveEmailDraft}>Approve + open email</button> : null}</div> : null}
              </div>
            </div>
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
              {transcript.length ? transcript.slice(-40).map((line) => (
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
              and noindexed. Savannah also receives client-specific room instructions. Local continuity is stored only in this browser in this version; cross-device shared memory is not implied.
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
