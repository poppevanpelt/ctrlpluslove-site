import type { Metadata } from "next";
import Link from "next/link";
import ExecMachine from "./exec-machine";
import layout from "./exec-layout.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "EXEC CHUTE | ctrl+love",
  description: "The shortest route through ctrl+love for a live executive decision.",
};

const stages = [
  {
    no: "01",
    label: "INPUT",
    question: "WHAT CHANGED?",
    answer: "Name the thing that moved. Not the whole history around it.",
  },
  {
    no: "02",
    label: "IMPACT",
    question: "WHY DOES IT MATTER?",
    answer: "Find the consequence that becomes expensive if everyone keeps talking.",
  },
  {
    no: "03",
    label: "DECISION",
    question: "WHAT NEEDS A HUMAN?",
    answer: "Separate analysis from judgment. Keep the irreversible bit human-owned.",
  },
  {
    no: "04",
    label: "MOVE",
    question: "WHAT HAPPENS NEXT?",
    answer: "Choose the smallest action that creates useful evidence or commitment.",
  },
] as const;

export default function ExecChutePage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span className={styles.serial}>EMERGENCY DECISION ROUTE · E-04</span>
        <Link href="/instruments/" className={styles.room}>INSTRUMENT ROOM →</Link>
      </header>

      <section className={styles.intro} aria-labelledby="exec-title">
        <div className={styles.introCopy}>
          <p className={styles.kicker}>NO TIME FOR THE WHOLE BUILDING?</p>
          <h1 id="exec-title">EXEC<br />CHUTE</h1>
          <p className={styles.lead}>Four questions. One human decision. No tour.</p>
          <div className={layout.unitPlateCompact}>
            <span>CTRL+LOVE</span>
            <strong>EXEC CHUTE</strong>
            <small>MODEL E-04 · HUMAN OVERRIDE FITTED</small>
          </div>
        </div>

        <div className={layout.machineHero}>
          <ExecMachine />
        </div>
      </section>

      <section className={styles.sequence} aria-label="Four stage executive route">
        <div className={styles.sequenceHeader}>
          <span>ONE PASS ONLY</span>
          <span>THE MACHINE MAY CLARIFY. IT MAY NOT DECIDE FOR YOU.</span>
        </div>
        <ol>
          {stages.map((stage) => (
            <li key={stage.no} className={stage.no === "03" ? layout.humanStage : undefined}>
              <div className={styles.stageIndex}>
                <span>{stage.no}</span>
                <strong>{stage.label}</strong>
              </div>
              <div className={styles.stageBody}>
                <h2>{stage.question}</h2>
                <p>{stage.answer}</p>
                {stage.no === "03" ? <small>HUMAN OWNERSHIP / IRREVERSIBLE GATE</small> : null}
              </div>
              <div className={styles.stageMechanism} aria-hidden="true">
                <span className={styles.guide} />
                <span className={styles.gate} />
                <span className={styles.marker}>{stage.no}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.verdict} aria-labelledby="verdict-title">
        <p className={styles.kicker}>END OF CHUTE</p>
        <h2 id="verdict-title">If you still cannot name the decision, that is the decision problem.</h2>
        <div className={styles.exits}>
          <Link href="/">ENTER THE FULL BUILDING →</Link>
          <a href="mailto:hello@ctrlpluslove.com?subject=EXEC%20CHUTE%20%E2%80%94%20live%20decision">CONTACT / SEND THIS TO THE HUMAN →</a>
        </div>
      </section>
    </main>
  );
}
