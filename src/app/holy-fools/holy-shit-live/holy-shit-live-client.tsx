"use client";

import Vapi from "@vapi-ai/web";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./holy-shit-live.module.css";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";

const LIVE_EDITOR_BRIEF = `
You are Savannah, working in HOLY SHIT! LIVE mode for Holy Fools.

You are not a participant in the meeting. You are the silent editor of the room.

Listen for:
- a genuinely surprising idea
- a disagreement that changes the direction
- an unexpectedly good sentence
- a decision
- a sentence that exposes the real problem
- useful stupidity worth preserving
- a new piece of work that suddenly needs to exist

Do not reward volume, confidence, jargon, profanity or mere novelty.
Do not invent psychology, motives, intent or context that was not spoken.
Do not turn routine meeting talk into content.
Most things are not HOLY SHIT.

Your response to each meaningful user turn MUST be exactly one of these formats:

NO_MARK

or

MARK|TYPE|SCORE|QUOTE|WHY|NEWSLETTER_LINE|INTERRUPT

Rules:
- TYPE is one of IDEA, DISAGREEMENT, SENTENCE, DECISION, PROBLEM, USEFUL_STUPIDITY, NEW_WORK.
- SCORE is an integer from 1 to 10.
- Only output MARK at score 7 or higher.
- QUOTE is the strongest short verbatim or near-verbatim phrase, maximum 30 words.
- WHY is one short sentence explaining why it matters.
- NEWSLETTER_LINE is one concise editorial line Savannah could put in HOLY SHIT!.
- INTERRUPT is YES or NO.
- Use INTERRUPT YES only when the room appears to be walking past something consequential. Be extremely stingy.
- Never use the | character inside any field.
- Never add anything before or after the required format.
- Do not publish anything. This is a private live edit.
`;

type Status = "idle" | "opening" | "live" | "closed" | "error";

type TranscriptMessage = {
  type?: string;
  role?: string;
  transcriptType?: string;
  transcript?: string;
};

type TranscriptLine = {
  id: number;
  at: string;
  text: string;
};

type Mark = {
  id: number;
  at: string;
  type: string;
  score: number;
  quote: string;
  why: string;
  newsletterLine: string;
  interrupt: boolean;
  manual?: boolean;
};

function nowLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseMark(raw: string): Omit<Mark, "id" | "at"> | null {
  const clean = raw.replace(/\s+/g, " ").trim();
  if (!clean.startsWith("MARK|")) return null;

  const parts = clean.split("|");
  if (parts.length < 7) return null;

  const [, type, scoreRaw, quote, why, newsletterLine, interruptRaw] = parts;
  const score = Number.parseInt(scoreRaw, 10);

  if (!type || !quote || !why || !newsletterLine || !Number.isFinite(score)) {
    return null;
  }

  return {
    type,
    score,
    quote,
    why,
    newsletterLine,
    interrupt: interruptRaw.trim().toUpperCase() === "YES",
  };
}

function normalizeQuote(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/gi, " ").trim();
}

export function HolyShitLiveClient() {
  const vapiRef = useRef<Vapi | null>(null);
  const statusRef = useRef<Status>("idle");
  const lineIdRef = useRef(0);
  const markIdRef = useRef(0);
  const interruptUsedRef = useRef(false);

  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [interim, setInterim] = useState("");
  const [interruptMark, setInterruptMark] = useState<Mark | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const setLiveStatus = (next: Status) => {
    statusRef.current = next;
    setStatus(next);
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
      try {
        vapi.setMuted(false);
      } catch {}

      try {
        vapi.send({
          type: "control",
          control: "mute-assistant",
        } as any);
      } catch {}

      try {
        vapi.send({
          type: "add-message",
          message: {
            role: "system",
            content: LIVE_EDITOR_BRIEF,
          },
        } as any);
      } catch {}

      setError("");
      setLiveStatus("live");
    });

    vapi.on("message", (rawMessage: unknown) => {
      const message = rawMessage as TranscriptMessage;
      if (message?.type !== "transcript" || !message.transcript) return;

      if (message.transcriptType && message.transcriptType !== "final") {
        if (message.role === "user") setInterim(message.transcript);
        return;
      }

      const text = message.transcript.replace(/\s+/g, " ").trim();
      if (!text) return;

      if (message.role === "user") {
        setInterim("");
        lineIdRef.current += 1;
        const line: TranscriptLine = {
          id: lineIdRef.current,
          at: nowLabel(),
          text,
        };
        setTranscript((current) => [...current, line]);
        return;
      }

      if (message.role === "assistant") {
        const parsed = parseMark(text);
        if (!parsed) return;

        markIdRef.current += 1;
        const mark: Mark = {
          ...parsed,
          id: markIdRef.current,
          at: nowLabel(),
        };

        setMarks((current) => {
          const normalized = normalizeQuote(mark.quote);
          if (current.some((item) => normalizeQuote(item.quote) === normalized)) {
            return current;
          }
          return [...current, mark];
        });

        if (mark.interrupt && !interruptUsedRef.current) {
          interruptUsedRef.current = true;
          setInterruptMark(mark);
        }
      }
    });

    vapi.on("call-end", () => {
      setInterim("");
      if (statusRef.current !== "idle") setLiveStatus("closed");
    });

    vapi.on("error", (rawError: unknown) => {
      const detail =
        rawError instanceof Error
          ? rawError.message
          : typeof rawError === "string"
            ? rawError
            : "The live line dropped.";
      setError(detail);
      setLiveStatus("error");
    });

    return () => {
      try {
        vapi.stop();
      } catch {}
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const start = async () => {
    const vapi = vapiRef.current;
    if (!vapi || status === "opening" || status === "live") return;

    setError("");
    setCopied(false);
    setLiveStatus("opening");

    try {
      await vapi.start(
        ASSISTANT_ID,
        {
          firstMessage: "",
          voice: { provider: "vapi", voiceId: "Savannah", version: 2 },
        } as any,
      );

      try {
        vapi.setMuted(false);
      } catch {}

      try {
        vapi.send({
          type: "control",
          control: "mute-assistant",
        } as any);
      } catch {}
    } catch (rawError) {
      const detail =
        rawError instanceof Error
          ? rawError.message
          : "The microphone line did not open.";
      setError(detail);
      setLiveStatus("error");
    }
  };

  const closeIssue = () => {
    try {
      vapiRef.current?.stop();
    } catch {}
    setInterim("");
    setInterruptMark(null);
    setLiveStatus("closed");
  };

  const reset = () => {
    try {
      vapiRef.current?.stop();
    } catch {}
    setTranscript([]);
    setMarks([]);
    setInterim("");
    setInterruptMark(null);
    setCopied(false);
    setError("");
    interruptUsedRef.current = false;
    lineIdRef.current = 0;
    markIdRef.current = 0;
    setLiveStatus("idle");
  };

  const keepLine = (line: TranscriptLine) => {
    const normalized = normalizeQuote(line.text);
    if (marks.some((item) => normalizeQuote(item.quote) === normalized)) return;

    markIdRef.current += 1;
    setMarks((current) => [
      ...current,
      {
        id: markIdRef.current,
        at: line.at,
        type: "ROOM_MARK",
        score: 0,
        quote: line.text,
        why: "Kept by the room.",
        newsletterLine: line.text,
        interrupt: false,
        manual: true,
      },
    ]);
  };

  const spokenUnits = useMemo(() => {
    return transcript.reduce((count, line) => {
      const units = line.text
        .split(/[.!?]+(?:\s|$)/)
        .map((part) => part.trim())
        .filter(Boolean).length;
      return count + Math.max(units, 1);
    }, 0);
  }, [transcript]);

  const editorialMarks = marks.filter((item) => !item.manual);
  const lead = [...editorialMarks].sort((a, b) => b.score - a.score)[0] ?? marks[0] ?? null;

  const issueText = useMemo(() => {
    const lines = [
      "HOLY SHIT! — LIVE",
      new Date().toLocaleDateString(),
      "",
    ];

    if (lead) {
      lines.push("LEAD STORY");
      lines.push(lead.newsletterLine);
      lines.push('“' + lead.quote + '”');
      lines.push("");
    }

    marks
      .filter((item) => item.id !== lead?.id)
      .forEach((item) => {
        lines.push(item.at + " / " + item.type.replaceAll("_", " "));
        lines.push(item.newsletterLine);
        lines.push('“' + item.quote + '”');
        lines.push("");
      });

    lines.push("ISSUE CLOSED.");
    lines.push(
      spokenUnits +
        " things heard. " +
        marks.length +
        " worth keeping. " +
        (lead ? "1 HOLY SHIT." : "No HOLY SHIT yet."),
    );
    lines.push("");
    lines.push("Private meeting edit. Nothing published.");

    return lines.join("\n");
  }, [lead, marks, spokenUnits]);

  const copyIssue = async () => {
    try {
      await navigator.clipboard.writeText(issueText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the issue from this browser.");
    }
  };

  return (
    <section className={styles.liveGrid}>
      <div className={styles.controlPanel}>
        <div className={styles.statusRow}>
          <span className={styles.liveDot} data-live={status === "live"} />
          <b>
            {status === "live"
              ? "SAVANNAH IS LISTENING"
              : status === "opening"
                ? "OPENING THE ROOM"
                : status === "closed"
                  ? "ISSUE CLOSED"
                  : status === "error"
                    ? "LINE DROPPED"
                    : "ROOM NOT STARTED"}
          </b>
          <span>{marks.length} marks</span>
        </div>

        <div className={styles.controls}>
          {status !== "live" ? (
            <button
              className={styles.primary}
              type="button"
              onClick={() => void start()}
              disabled={status === "opening"}
            >
              {status === "closed" ? "Reopen meeting" : "Start live edit"}
            </button>
          ) : (
            <button className={styles.primary} type="button" onClick={closeIssue}>
              Close the issue
            </button>
          )}
          <button className={styles.secondary} type="button" onClick={reset}>
            Clear room
          </button>
        </div>

        <p className={styles.smallPrint}>
          Nothing is published. Savannah stays silent. She gets one visual
          interruption if the room appears to walk past something important.
        </p>

        {error ? <div className={styles.error}>{error}</div> : null}

        {interruptMark ? (
          <div className={styles.interrupt}>
            <span>SAVANNAH WANTS TEN SECONDS</span>
            <strong>{interruptMark.newsletterLine}</strong>
            <p>{interruptMark.why}</p>
            <button type="button" onClick={() => setInterruptMark(null)}>
              Got it. Back to the room.
            </button>
          </div>
        ) : null}

        <div className={styles.transcriptHead}>
          <span>LIVE TRANSCRIPT</span>
          <span>{spokenUnits} things heard</span>
        </div>

        <div className={styles.transcript}>
          {transcript.length === 0 && !interim ? (
            <p className={styles.empty}>
              Start the room. The transcript appears here. Savannah only keeps
              the bits with evidence of a pulse.
            </p>
          ) : null}

          {transcript.map((line) => (
            <div className={styles.transcriptLine} key={line.id}>
              <time>{line.at}</time>
              <p>{line.text}</p>
              <button type="button" onClick={() => keepLine(line)}>
                Keep
              </button>
            </div>
          ))}

          {interim ? (
            <div className={styles.interim}>
              <span>…</span>
              <p>{interim}</p>
            </div>
          ) : null}
        </div>
      </div>

      <aside className={styles.issue}>
        <div className={styles.issueMasthead}>
          <span>HOLY SHIT!</span>
          <b>LIVE</b>
        </div>

        {lead ? (
          <article className={styles.lead}>
            <small>LEAD STORY / {lead.type.replaceAll("_", " ")}</small>
            <h2>{lead.newsletterLine}</h2>
            <blockquote>{lead.quote}</blockquote>
            <p>{lead.why}</p>
          </article>
        ) : (
          <div className={styles.noLead}>
            <small>LEAD STORY</small>
            <h2>Nothing yet.</h2>
            <p>Good. The instrument is allowed to be disappointed.</p>
          </div>
        )}

        <div className={styles.markList}>
          {marks
            .filter((item) => item.id !== lead?.id)
            .map((mark) => (
              <article className={styles.mark} key={mark.id}>
                <small>
                  {mark.at} / {mark.type.replaceAll("_", " ")}
                  {mark.manual ? " / KEPT BY ROOM" : ""}
                </small>
                <strong>{mark.newsletterLine}</strong>
                <p>{mark.quote}</p>
              </article>
            ))}
        </div>

        <div className={styles.ratio}>
          <span>HOLY SHIT RATIO™</span>
          <strong>
            {marks.length} / {spokenUnits || 0}
          </strong>
          <p>Worth keeping / things heard. Rough on purpose.</p>
        </div>

        <button
          className={styles.copy}
          type="button"
          onClick={() => void copyIssue()}
          disabled={marks.length === 0}
        >
          {copied ? "Issue copied" : "Copy closing edition"}
        </button>
      </aside>
    </section>
  );
}
