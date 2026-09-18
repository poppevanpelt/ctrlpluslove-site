import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ExcavationBench from "./excavation-bench";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Maria Excavation 001 | ctrl+love",
  description: "The Birth of a New Idea. A Maria excavation into the distance between biological change and human meaning.",
};

const stages = [
  ["BEFORE", "Isolated structures.", "/maria/neuron-01.webp"],
  ["REACH", "Processes extend.", "/maria/neuron-02.webp"],
  ["CONTACT", "A possible connection.", "/maria/neuron-03.webp"],
  ["NETWORK", "Structure becomes relationship.", "/maria/neuron-04.webp"],
  ["THOUGHT", "And somewhere much further up the stack, we call it an idea.", "/maria/neuron-04.webp"],
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
        <div className={styles.micrograph}>
          <Image src="/maria/neuron-04.webp" alt="Microscope video frame showing a branching neuron-like cell structure" fill sizes="100vw" priority />
        </div>
        <div className={styles.evidenceGrid}>
          <div><span>OBSERVED</span><p>Microscope footage presented as neuronal growth and contact.</p></div>
          <div><span>INTERPRETATION</span><p>A useful physical metaphor for learning and ideation.</p></div>
          <div><span>CLAIM STATUS</span><p>Field reference. Original source and protocol still to be verified.</p></div>
        </div>
      </section>

      <section className={styles.sequence}>
        <div className={styles.sequenceHead}><span>EXCAVATION SEQUENCE</span><span>MICRO → MEANING</span></div>
        <ol>
          {stages.map(([label, copy, image], index) => (
            <li key={label}>
              <div className={styles.stageImage}>
                <Image src={image} alt="" fill sizes="(max-width: 900px) 50vw, 20vw" />
              </div>
              <small>0{index + 1}</small>
              <h2>{label}</h2>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <ExcavationBench />

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
