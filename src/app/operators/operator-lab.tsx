"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./operator-lab.module.css";

export type OperatorMode = "plus" | "minus" | "divide" | "multiply" | "not";

type OperatorLabProps = { initialMode?: OperatorMode };

const modes: readonly {
  key: OperatorMode;
  symbol: string;
  name: string;
  verb: string;
  line: string;
  question: string;
}[] = [
  { key: "plus", symbol: "+", name: "ctrl+love", verb: "ADD", line: "Add humanity, consequence and care.", question: "What becomes better if we actually give a damn?" },
  { key: "minus", symbol: "−", name: "ctrl−love", verb: "REMOVE", line: "Remove attachment, politeness and sunk-cost affection.", question: "Would we still do this if nobody loved the idea?" },
  { key: "divide", symbol: "÷", name: "ctrl÷love", verb: "DIVIDE", line: "See where the attention, money and benefit actually land.", question: "Who gets the love — and who gets almost none?" },
  { key: "multiply", symbol: "×", name: "ctrl×love", verb: "MULTIPLY", line: "Amplify the thing people already demonstrably value.", question: "What deserves to become ten times bigger?" },
  { key: "not", symbol: "≠", name: "ctrl≠love", verb: "SEPARATE", line: "Separate approval from actual enthusiasm.", question: "Did they approve it — or do they want it?" },
];

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function OperatorLab({ initialMode = "plus" }: OperatorLabProps) {
  const [mode, setMode] = useState<OperatorMode>(initialMode);
  const [subject, setSubject] = useState("");
  const [care, setCare] = useState(38);
  const [attachmentHeat, setAttachmentHeat] = useState(76);
  const [attachments, setAttachments] = useState("the original idea, the deck, the founder's favourite line");
  const [pool, setPool] = useState(4000000);
  const [people, setPeople] = useState(800000);
  const [unit, setUnit] = useState("€");
  const [baseline, setBaseline] = useState(1);
  const [factor, setFactor] = useState(10);
  const [approval, setApproval] = useState(86);
  const [enthusiasm, setEnthusiasm] = useState(34);
  const [copied, setCopied] = useState(false);

  const current = modes.find((item) => item.key === mode) ?? modes[0];
  const namedSubject = subject.trim() || "The thing in front of you";

  const result = useMemo(() => {
    if (mode === "plus") {
      const gap = Math.max(0, 100 - care);
      return {
        signal: "CARE GAP " + gap + "%",
        headline: gap > 45 ? "There is more room for human consequence than another layer of polish." : "The human consequence is visible. Make it impossible to miss.",
        prompts: [
          "Name the single person whose day changes if this works.",
          "Describe what gets better for them in a way they can feel, not merely measure.",
          "Find one piece of proof that would make them say: finally.",
        ],
        move: "Add one lived consequence before adding another feature.",
      };
    }
    if (mode === "minus") {
      const sacred = attachments.split(",").map((item) => item.trim()).filter(Boolean);
      const first = sacred[0] || "the thing everyone is protecting";
      return {
        signal: "ATTACHMENT LOAD " + attachmentHeat + "%",
        headline: attachmentHeat > 60 ? "Affection may be doing some of the argument's work." : "Good. There is enough distance here to cut without theatre.",
        prompts: [
          "Delete " + first + " first. Does the idea still work?",
          "Ask what a hostile new owner would keep if history meant nothing.",
          "If the answer only survives because you love it, it is not the answer.",
        ],
        move: "Make the stripped version before defending the full one.",
      };
    }
    if (mode === "divide") {
      const safePeople = Math.max(1, people || 1);
      const perPerson = (pool || 0) / safePeople;
      return {
        signal: unit + formatNumber(perPerson) + " / PERSON",
        headline: "The claim just became a distribution problem.",
        prompts: [
          unit + formatNumber(pool) + " divided across " + formatNumber(safePeople) + " people = " + unit + formatNumber(perPerson) + " each.",
          "Mark who receives the highest concentration of attention, money or convenience.",
          "Now find the constituency living with the consequence while receiving the smallest share.",
        ],
        move: "Move one meaningful unit of love toward the least-served person.",
      };
    }
    if (mode === "multiply") {
      const output = (baseline || 0) * (factor || 0);
      return {
        signal: formatNumber(baseline) + " × " + formatNumber(factor) + " = " + formatNumber(output),
        headline: "Scale the proof, not the ambition.",
        prompts: [
          "Name the smallest behaviour people already choose without being pushed.",
          "Protect the reason it works before multiplying the volume.",
          "List what breaks at " + formatNumber(factor) + "× — trust, quality, access, intimacy or economics.",
        ],
        move: "Multiply one proven behaviour before inventing another proposition.",
      };
    }
    const gap = approval - enthusiasm;
    return {
      signal: "APPROVAL GAP " + (gap >= 0 ? "+" : "") + gap + " PTS",
      headline: Math.abs(gap) >= 30 ? "Approved is doing suspiciously more work than loved." : "Approval and enthusiasm are close enough to deserve a harder test.",
      prompts: [
        "Approval: " + approval + "%. Enthusiasm: " + enthusiasm + "%.",
        "Ask what people would fight to keep if permission disappeared tomorrow.",
        "Measure voluntary behaviour next: return, recommend, pay, defend, repeat.",
      ],
      move: "Do not count assent as affection. Look for voluntary energy.",
    };
  }, [approval, attachmentHeat, attachments, baseline, care, enthusiasm, factor, mode, people, pool, unit]);

  const report = [
    current.name + " / " + current.verb,
    "SUBJECT: " + namedSubject,
    result.signal,
    result.headline,
    ...result.prompts.map((item, index) => String(index + 1).padStart(2, "0") + " — " + item),
    "NEXT MOVE: " + result.move,
    "ctrl+love · shortcut to reality",
  ].join("\n");

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className={styles.page} id="main-content">
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span>INSTRUMENT FAMILY 026 / LOVE OPERATORS</span>
        <Link href="/instruments/">Instrument room ↗</Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>PRIMARY-SCHOOL MATHEMATICS / BOARDROOM USE</p>
          <h1>LOVE<br />OPERATORS</h1>
          <p className={styles.lead}>One thing in. Five different attacks.</p>
          <p className={styles.sublead}>Do not brainstorm harder. Change the operator.</p>
        </div>
        <div className={styles.operatorMachine} aria-hidden="true">
          <div className={styles.ring} />
          <div className={styles.steelBall}><span>{current.symbol}</span></div>
          <div className={styles.machineLabel}>026{String.fromCharCode(65 + modes.findIndex((item) => item.key === mode))}</div>
          <div className={styles.machineReadout}>{current.verb}</div>
        </div>
      </section>

      <section className={styles.console}>
        <div className={styles.modeRail} aria-label="Choose an operator">
          {modes.map((item) => (
            <button type="button" key={item.key} className={item.key === mode ? styles.modeActive : styles.mode} onClick={() => { setMode(item.key); setCopied(false); }} aria-pressed={item.key === mode}>
              <span>{item.symbol}</span><strong>{item.name}</strong><small>{item.verb}</small>
            </button>
          ))}
        </div>

        <div className={styles.workbench}>
          <section className={styles.inputPanel}>
            <div className={styles.panelLabel}><span>INPUT</span><strong>{current.name}</strong></div>
            <label className={styles.subjectLabel}>
              Put the real thing on the table.
              <textarea value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. We need a new brand campaign." rows={5} />
            </label>
            <p className={styles.question}>{current.question}</p>

            {mode === "plus" && (
              <div className={styles.controlBlock}>
                <div className={styles.controlHead}><span>Current care density</span><strong>{care}%</strong></div>
                <input type="range" min="0" max="100" value={care} onChange={(event) => setCare(Number(event.target.value))} />
                <p>How much is currently designed around a real human consequence rather than organisational preference?</p>
              </div>
            )}

            {mode === "minus" && (
              <div className={styles.controlBlock}>
                <div className={styles.controlHead}><span>Attachment heat</span><strong>{attachmentHeat}%</strong></div>
                <input type="range" min="0" max="100" value={attachmentHeat} onChange={(event) => setAttachmentHeat(Number(event.target.value))} />
                <label>Sacred cows, comma separated<input value={attachments} onChange={(event) => setAttachments(event.target.value)} /></label>
              </div>
            )}

            {mode === "divide" && (
              <div className={styles.controlBlock}>
                <div className={styles.numberGrid}>
                  <label>Total pool<input type="number" value={pool} onChange={(event) => setPool(Number(event.target.value))} /></label>
                  <label>People / units<input type="number" min="1" value={people} onChange={(event) => setPeople(Number(event.target.value))} /></label>
                  <label>Unit<input value={unit} maxLength={8} onChange={(event) => setUnit(event.target.value)} /></label>
                </div>
                <p>Use money, hours, service minutes, media value, attention points — anything the organisation claims to distribute.</p>
              </div>
            )}

            {mode === "multiply" && (
              <div className={styles.controlBlock}>
                <div className={styles.numberGridTwo}>
                  <label>Proven signal<input type="number" value={baseline} onChange={(event) => setBaseline(Number(event.target.value))} /></label>
                  <label>Multiplier<input type="number" min="1" value={factor} onChange={(event) => setFactor(Number(event.target.value))} /></label>
                </div>
                <p>Start with something people already do, choose or return to. Then increase the pressure.</p>
              </div>
            )}

            {mode === "not" && (
              <div className={styles.controlBlock}>
                <div className={styles.controlHead}><span>Approval</span><strong>{approval}%</strong></div>
                <input type="range" min="0" max="100" value={approval} onChange={(event) => setApproval(Number(event.target.value))} />
                <div className={styles.controlHead}><span>Actual enthusiasm</span><strong>{enthusiasm}%</strong></div>
                <input type="range" min="0" max="100" value={enthusiasm} onChange={(event) => setEnthusiasm(Number(event.target.value))} />
                <p>Use the second slider brutally. Smiles in the meeting do not count.</p>
              </div>
            )}
          </section>

          <section className={styles.resultPanel} aria-live="polite">
            <div className={styles.panelLabel}><span>OUTPUT</span><strong>{result.signal}</strong></div>
            <p className={styles.subjectEcho}>{namedSubject}</p>
            <h2>{result.headline}</h2>
            <ol>{result.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol>
            <div className={styles.nextMove}><span>NEXT MOVE</span><strong>{result.move}</strong></div>
            <button type="button" className={styles.copy} onClick={copyReport}>{copied ? "COPIED ✓" : "COPY FIELD NOTE"}</button>
          </section>
        </div>
      </section>

      <section className={styles.five}>
        {modes.map((item, index) => (
          <article key={item.key}>
            <span>026{String.fromCharCode(65 + index)}</span>
            <b>{item.symbol}</b>
            <h2>{item.name}</h2>
            <p>{item.line}</p>
            <Link href={"/operators/" + item.key + "/"}>OPEN DIRECT LINK ↗</Link>
          </article>
        ))}
      </section>

      <section className={styles.close}>
        <span>OPERATING PRINCIPLE</span>
        <h2>Same problem.<br />Different mathematics.</h2>
        <p>The operator is not the answer. It changes what the room is forced to notice.</p>
      </section>

      <footer className={styles.footer}>
        <span>ctrl+love · shortcut to reality</span>
        <div><Link href="/instruments/">Instrument room ↖</Link><Link href="/">Home ↗</Link></div>
      </footer>
    </main>
  );
}
