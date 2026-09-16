import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Maria Excavation 001 | ctrl+love",
  description: "The Birth of a New Idea. A Maria excavation into the distance between biological change and human meaning.",
};

const stages = [
  ["BEFORE", "Isolated structures."],
  ["REACH", "Processes extend."],
  ["CONTACT", "A possible connection."],
  ["NETWORK", "Structure becomes relationship."],
  ["THOUGHT", "And somewhere much further up the stack, we call it an idea."],
] as const;

export default function MariaExcavationPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span>ATLAS MENTIS HUMANAE · MARIA</span>
        <Link href="/instruments/">INSTRUMENT ROOM →</Link>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>MARIA EXCAVATION 001 · SPECIMEN 014</p>
        <h1>THE BIRTH<br />OF A NEW IDEA</h1>
        <p className={styles.lead}>Before an idea becomes a sentence, a decision, a ritual, a company, a war, a cure or a song, something changes.</p>
      </section>

      <section className={styles.specimen} aria-label="Microscopy specimen">
        <div className={styles.micrograph} aria-hidden="true">
          <span className={styles.soma} />
          <span className={`${styles.branch} ${styles.b1}`} />
          <span className={`${styles.branch} ${styles.b2}`} />
          <span className={`${styles.branch} ${styles.b3}`} />
          <span className={`${styles.branch} ${styles.b4}`} />
          <span className={`${styles.branch} ${styles.b5}`} />
          <span className={`${styles.node} ${styles.n1}`} />
          <span className={`${styles.node} ${styles.n2}`} />
          <span className={`${styles.node} ${styles.n3}`} />
        </div>
        <div className={styles.evidenceGrid}>
          <div><span>OBSERVED</span><p>Neuronal growth and branching in culture.</p></div>
          <div><span>INTERPRETATION</span><p>A useful physical metaphor for learning and ideation.</p></div>
          <div><span>CLAIM STATUS</span><p>Not a literal recording of one specific idea being born.</p></div>
        </div>
      </section>

      <section className={styles.sequence}>
        <div className={styles.sequenceHead}><span>EXCAVATION SEQUENCE</span><span>MICRO → MEANING</span></div>
        <ol>
          {stages.map(([label, copy], index) => (
            <li key={label}>
              <div className={styles.stageImage} aria-hidden="true"><span style={{ "--i": index } as React.CSSProperties} /></div>
              <small>0{index + 1}</small>
              <h2>{label}</h2>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.depth}>
        <p className={styles.kicker}>SAME EXCAVATION. DIFFERENT DEPTH.</p>
        <div className={styles.layers}>
          <div><span>01</span><strong>CULTURAL</strong><p>Rituals, customs, ceremonies, social protocols.</p></div>
          <div><span>02</span><strong>BEHAVIOURAL</strong><p>Actions, habits, signals, responses.</p></div>
          <div><span>03</span><strong>COGNITIVE</strong><p>Beliefs, assumptions, interpretations, decisions.</p></div>
          <div><span>04</span><strong>BIOLOGICAL</strong><p>Plasticity, adaptation, stress, reward, synchronisation.</p></div>
        </div>
      </section>

      <section className={styles.rule}>
        <p>Sometimes Maria digs down.<br />Sometimes Maria looks through a microscope.</p>
        <div>
          <span>WHAT ARE WE ACTUALLY LOOKING AT?</span>
          <span>WHAT DO WE THINK IT MEANS?</span>
          <span>HOW FAR ARE WE ALLOWED TO GO?</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Evidence first. Wonder intact.</p>
        <Link href="/instruments/">RETURN TO THE LAB ↗</Link>
      </footer>
    </main>
  );
}
