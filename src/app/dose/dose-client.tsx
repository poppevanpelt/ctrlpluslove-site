"use client";

import { useMemo, useState } from "react";
import styles from "./dose.module.css";

type ParsedMessage = {
  at: Date | null;
  sender: string;
  text: string;
};

type Profile = {
  name: string;
  messages: number;
  averageWords: number;
  medianWords: number;
  shortReplyShare: number;
  questionShare: number;
  mediaShare: number;
  burstTolerance: number;
  responseStyle: "LOW" | "MEDIUM" | "HIGH";
  recommendedDose: number;
  preferredFormat: string;
  warning: string;
};

function parseWhatsApp(raw: string): ParsedMessage[] {
  const lines = raw.replace(/\r/g, "").split("\n");
  const out: ParsedMessage[] = [];
  const start =
    /^(?:\[)?(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*[AP]M)?(?:\])?\s*[-–]\s*([^:]+):\s*(.*)$/i;

  for (const line of lines) {
    const match = line.match(start);
    if (match) {
      const [, d, m, y, hh, mm, ss, sender, text] = match;
      const year = Number(y) < 100 ? 2000 + Number(y) : Number(y);
      out.push({
        at: new Date(year, Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss || 0)),
        sender: sender.trim(),
        text: text.trim(),
      });
    } else if (out.length && line.trim()) {
      out[out.length - 1].text += "\n" + line.trim();
    }
  }

  return out;
}

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function makeProfile(name: string, messages: ParsedMessage[]): Profile | null {
  const mine = messages.filter((m) => m.sender.toLowerCase() === name.toLowerCase());
  if (!mine.length) return null;

  const lengths = mine.map((m) => words(m.text));
  const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const med = median(lengths);
  const shortReplyShare = mine.filter((m) => words(m.text) <= 7).length / mine.length;
  const questionShare = mine.filter((m) => /\?/.test(m.text)).length / mine.length;
  const mediaShare = mine.filter((m) => /<media omitted>|image omitted|video omitted|sticker omitted/i.test(m.text)).length / mine.length;

  let consecutive = 1;
  let maxConsecutive = 1;
  for (let i = 1; i < messages.length; i += 1) {
    if (messages[i].sender === messages[i - 1].sender) {
      consecutive += 1;
      maxConsecutive = Math.max(maxConsecutive, consecutive);
    } else {
      consecutive = 1;
    }
  }

  const burstTolerance = Math.max(1, Math.min(6, Math.round(maxConsecutive / 2)));
  const responseStyle: Profile["responseStyle"] =
    avg <= 10 || shortReplyShare > 0.6 ? "LOW" : avg <= 25 ? "MEDIUM" : "HIGH";

  const recommendedDose = Math.max(
    35,
    Math.min(
      90,
      Math.round(
        45 +
          (responseStyle === "HIGH" ? 20 : responseStyle === "MEDIUM" ? 10 : 0) +
          Math.min(15, burstTolerance * 3) -
          Math.round(shortReplyShare * 15),
      ),
    ),
  );

  const preferredFormat =
    responseStyle === "LOW"
      ? "One object. One reason. One question."
      : responseStyle === "MEDIUM"
        ? "One strong object + a short note. Keep the second idea in reserve."
        : "Context is tolerated, but separate decisions from exploration.";

  const warning =
    shortReplyShare > 0.65
      ? "Their replies are usually compact. Long explanations are more likely to become homework."
      : burstTolerance <= 2
        ? "Low evidence of appetite for message bursts. Do not stack sends."
        : "They tolerate some flow. Still make each send earn the next one.";

  return {
    name,
    messages: mine.length,
    averageWords: avg,
    medianWords: med,
    shortReplyShare,
    questionShare,
    mediaShare,
    burstTolerance,
    responseStyle,
    recommendedDose,
    preferredFormat,
    warning,
  };
}

function assessSend(profile: Profile | null, draft: string, attachments: number, ideas: number) {
  const wc = words(draft);
  let score = 35;
  score += Math.min(50, wc / 2);
  score += attachments * 18;
  score += Math.max(0, ideas - 1) * 22;

  const ceiling = profile?.recommendedDose ?? 60;
  const overload = Math.round((score / ceiling) * 100);

  if (overload <= 85) {
    return {
      overload,
      label: "SEND",
      line: "This is below the current bandwidth ceiling.",
      instruction: "Send it. Do not add another thing underneath it.",
    };
  }

  if (overload <= 120) {
    return {
      overload,
      label: "TRIM",
      line: "This is starting to become a package.",
      instruction:
        attachments > 1
          ? "Choose the strongest object. Mention the others; do not attach them."
          : "Cut the context by a third and end with one clear question.",
    };
  }

  return {
    overload,
    label: "HOLD",
    line: "You are sending faster than they can process.",
    instruction:
      ideas > 1
        ? "Pick one idea. Put the rest back under the tree."
        : "Send the object, not the explanation. Give them room to react.",
  };
}

export default function DoseClient() {
  const [raw, setRaw] = useState("");
  const [person, setPerson] = useState("");
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState(1);
  const [ideas, setIdeas] = useState(1);

  const parsed = useMemo(() => parseWhatsApp(raw), [raw]);
  const senders = useMemo(
    () => Array.from(new Set(parsed.map((m) => m.sender))).sort((a, b) => a.localeCompare(b)),
    [parsed],
  );
  const profile = useMemo(() => makeProfile(person, parsed), [person, parsed]);
  const verdict = useMemo(
    () => assessSend(profile, draft, attachments, ideas),
    [profile, draft, attachments, ideas],
  );

  async function loadFile(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    setRaw(text);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a href="/" className={styles.brand}>ctrl+love</a>
        <span>INSTRUMENT 025 · RELATIONSHIP BANDWIDTH</span>
        <a href="/instruments/">INSTRUMENT ROOM ↗</a>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>CTRL+DOSE™</p>
        <h1>THE RIGHT AMOUNT<br />OF YOU<br />FOR THIS HUMAN.</h1>
        <p className={styles.lead}>
          WhatsApp behaviour in. Individual communication guidelines out.
          Then run the next send through Savannah before enthusiasm becomes homework.
        </p>
        <div className={styles.privacy}>LOCAL-FIRST · CHAT CONTENT STAYS IN THIS BROWSER</div>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <span className={styles.step}>01 · FEED THE HISTORY</span>
          <h2>Drop the exported WhatsApp .txt</h2>
          <label className={styles.file}>
            <input type="file" accept=".txt,text/plain" onChange={(e) => loadFile(e.target.files?.[0])} />
            CHOOSE CHAT EXPORT
          </label>
          <textarea
            className={styles.raw}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="Or paste the WhatsApp export here…"
          />
          <div className={styles.meta}>
            <span>{parsed.length} messages parsed</span>
            <span>{senders.length} people found</span>
          </div>
        </article>

        <article className={styles.panel}>
          <span className={styles.step}>02 · PICK THE HUMAN</span>
          <h2>Who are we learning?</h2>
          <select className={styles.select} value={person} onChange={(e) => setPerson(e.target.value)}>
            <option value="">Select participant…</option>
            {senders.map((sender) => <option key={sender}>{sender}</option>)}
          </select>

          {profile ? (
            <div className={styles.profile}>
              <div className={styles.dose}>
                <span>POPPE CEILING</span>
                <strong>{profile.recommendedDose}%</strong>
              </div>
              <dl>
                <div><dt>APPETITE FOR LENGTH</dt><dd>{profile.responseStyle}</dd></div>
                <div><dt>AVG. MESSAGE</dt><dd>{profile.averageWords} words</dd></div>
                <div><dt>SHORT-REPLY SHARE</dt><dd>{Math.round(profile.shortReplyShare * 100)}%</dd></div>
                <div><dt>BURST TOLERANCE</dt><dd>{profile.burstTolerance}/6</dd></div>
              </dl>
              <div className={styles.guideline}>
                <span>BEST FORMAT</span>
                <p>{profile.preferredFormat}</p>
              </div>
              <div className={styles.guideline}>
                <span>WATCH FOR</span>
                <p>{profile.warning}</p>
              </div>
            </div>
          ) : (
            <p className={styles.empty}>A profile appears after a participant is selected.</p>
          )}
        </article>

        <article className={styles.panel + " " + styles.sendPanel}>
          <span className={styles.step}>03 · BEFORE YOU SEND</span>
          <h2>Let Savannah stand in the doorway.</h2>
          <textarea
            className={styles.draft}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste what you are about to send…"
          />
          <div className={styles.controls}>
            <label>ATTACHMENTS
              <input type="number" min="0" max="12" value={attachments} onChange={(e) => setAttachments(Number(e.target.value))} />
            </label>
            <label>NEW IDEAS
              <input type="number" min="1" max="12" value={ideas} onChange={(e) => setIdeas(Number(e.target.value))} />
            </label>
          </div>

          <div className={styles.verdict} data-state={verdict.label}>
            <div>
              <span>CURRENT DOSE</span>
              <strong>{verdict.overload}%</strong>
            </div>
            <div>
              <span>SAVANNAH SAYS</span>
              <h3>{verdict.label}</h3>
              <p>{verdict.line}</p>
              <b>{verdict.instruction}</b>
            </div>
          </div>
        </article>
      </section>

      <footer className={styles.footer}>
        <p>Stop communicating when the communication has already worked.</p>
        <small>CTRL+DOSE™ · FIELD PROTOTYPE 001</small>
      </footer>
    </main>
  );
}
