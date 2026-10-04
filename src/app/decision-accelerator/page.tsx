import type { Metadata } from "next";
import Link from "next/link";
import styles from "./decision-accelerator.module.css";

export const metadata: Metadata = {
  title: "Decision Accelerator | ctrl+love",
  description: "A ctrl+love decision system for moving important decisions forward without sacrificing judgment.",
};

const instruments = [
  {
    name: "Opposition Seat",
    line: "Put intelligent disagreement in the room before reality does it for you.",
    href: "/instruments/",
    action: "Inspect",
  },
  {
    name: "Do-Nothing Control",
    line: "Test the uncomfortable possibility that doing nothing may be the better move.",
    href: "/instruments/",
    action: "Inspect",
  },
  {
    name: "Decision Collider",
    line: "Force competing routes into the same frame until the real trade-off appears.",
    href: "/decision-collider/",
    action: "Run",
  },
  {
    name: "Meeting Filter",
    line: "Test whether a meeting deserves to exist before anyone enters the room.",
    href: "/meeting-filter/",
    action: "Run",
  },
  {
    name: "Decision Memory",
    line: "Keep the evidence, assumptions and reversals that created the decision.",
    href: "/decision-memory/",
    action: "Open",
  },
  {
    name: "Signal Distortion",
    line: "See what changes between the signal itself and what the organisation thinks it heard.",
    href: "/instruments/",
    action: "Inspect",
  },
] as const;

const moves = [
  ["01", "Clarify", "What decision is actually being made?"],
  ["02", "Pressure", "What survives disagreement, evidence and the do-nothing control?"],
  ["03", "Move", "What is the smallest useful next move that reality can test?"],
] as const;

export default function DecisionAcceleratorPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span>INSTRUMENT 025 / DECISION ACCELERATOR</span>
        <Link href="/instruments/">Instrument room ↗</Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>DECISION SYSTEM / WORKING</p>
          <h1>Decision<br />Accelerator</h1>
          <p className={styles.lead}>Puts better judgment into motion.</p>
          <a href="#run" className={styles.primary}>Run instrument ↘</a>
        </div>

        <div className={styles.machine} aria-hidden="true">
          <div className={styles.trackBack} />
          <div className={styles.track} />
          <div className={styles.ball}>
            <span />
          </div>
          <div className={styles.markerOne}>SIGNAL</div>
          <div className={styles.markerTwo}>JUDGMENT</div>
          <div className={styles.markerThree}>MOVE</div>
        </div>
      </section>

      <section className={styles.statement}>
        <p>Most organisations do not suffer from a lack of decisions.</p>
        <h2>They suffer from delay, noise, politics, repetition, missing evidence, and rooms that create the appearance of progress instead of the real thing.</h2>
        <strong>Not faster decisions. Better movement.</strong>
      </section>

      <section className={styles.freedom}>
        <span>THE REAL PROMISE</span>
        <h2>You shouldn&apos;t have to be there.<br />Your judgment should.</h2>
        <p>A useful decision system makes standards travel. Questions travel. Judgment travel. The room should improve without needing the founder physically inside it every time.</p>
      </section>

      <section className={styles.run} id="run">
        <div className={styles.sectionHead}>
          <span>RUN / 01–03</span>
          <h2>Move the decision.</h2>
        </div>

        <div className={styles.moves}>
          {moves.map(([no,verb,line]) => (
            <article key={no}>
              <span>{no}</span>
              <h3>{verb}</h3>
              <p>{line}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.toolkit}>
        <div className={styles.sectionHead}>
          <span>INSTRUMENTS INSIDE THE ACCELERATOR</span>
          <h2>Pressure where it helps.</h2>
        </div>

        <div className={styles.grid}>
          {instruments.map((instrument, index) => (
            <Link href={instrument.href} className={styles.tool} key={instrument.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{instrument.name}</h3>
              <p>{instrument.line}</p>
              <strong>{instrument.action} ↗</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.close}>
        <span>THE OPERATING PRINCIPLE</span>
        <h2>Less delay.<br />Better judgment.<br />More movement.</h2>
        <p>The Decision Accelerator is designed to stay useful when ctrl+love leaves the room.</p>
        <a href="mailto:poppevanpelt@gmail.com?subject=Run%20the%20Decision%20Accelerator">Bring a decision ↗</a>
      </section>

      <footer className={styles.footer}>
        <span>ctrl+love · shortcut to reality</span>
        <Link href="/">Back home ↖</Link>
      </footer>
    </main>
  );
}
