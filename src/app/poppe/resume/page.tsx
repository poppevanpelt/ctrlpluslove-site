import type { Metadata } from "next";
import Link from "next/link";

import PrintButton from "./print-button";
import styles from "../portfolio.module.css";

export const metadata: Metadata = {
  title: "Resume — Poppe van Pelt",
  description: "Resume of Poppe van Pelt, Applied AI Decision Systems Engineer.",
};

const roles = [
  {
    period: "2025—NOW",
    title: "Founder — ctrl+love",
    body: "Applied AI decision systems, live decision instruments, research protocols and working prototypes for organisations dealing with ambiguity, evidence, alignment and judgment.",
  },
  {
    period: "PREVIOUSLY",
    title: "Co-founder — Saint Amsterdam",
    body: "Creative practice spanning strategy, design, communication and making. Built work where ideas had to survive real organisational constraints.",
  },
  {
    period: "8 YEARS",
    title: "Lead Creative Director — Apple",
    body: "Global creative leadership across launches, retail, communication and brand systems.",
  },
  {
    period: "EARLIER",
    title: "Co-founder — Selmore / Creative leadership — TBWA and others",
    body: "Three decades in advertising and design, observing how decisions are framed, challenged, diluted, defended and eventually made real.",
  },
];

const systems = [
  "Decision Collider",
  "Prime the Room",
  "Brand Survival",
  "Decision Memory",
  "Living Ticker",
  "Meeting Filter",
  "Cultural Vault",
  "Atlas Mentis Humanae",
];

const capabilities = [
  "Applied AI systems design",
  "Decision architecture",
  "Human-AI collaboration",
  "Rapid prototyping",
  "Falsification protocols",
  "Evidence tagging",
  "Live room instrumentation",
  "Creative systems thinking",
  "Organisational observation",
  "Narrative compression",
];

export default function ResumePage() {
  return (
    <main id="main-content" className={styles.resumeShell}>
      <div className={styles.resumeToolbar}>
        <Link href="/poppe/">← Portfolio</Link>
        <PrintButton />
      </div>

      <article className={styles.resumePage}>
        <header className={styles.resumeHeader}>
          <div>
            <h1>Poppe van Pelt</h1>
            <h2>Applied AI Decision Systems Engineer</h2>
          </div>
          <div className={styles.resumeMeta}>
            <span>Haarlem, Netherlands</span>
            <a href="mailto:hello@ctrlpluslove.com">hello@ctrlpluslove.com</a>
            <a href="https://www.linkedin.com/in/poppevanpelt/">linkedin.com/in/poppevanpelt</a>
            <a href="https://www.ctrlpluslove.com/poppe/">ctrlpluslove.com/poppe</a>
          </div>
        </header>

        <section className={styles.resumeIntro}>
          <span className={styles.resumeLabel}>PROFILE</span>
          <p>
            I build applied AI decision systems that make judgment observable, challengeable and better. After three decades making ideas, I now design instruments that help humans decide which ideas deserve to survive.
          </p>
        </section>

        <section className={styles.resumeSection}>
          <span className={styles.resumeLabel}>CURRENT PRACTICE</span>
          <div className={styles.resumeItems}>
            <div className={styles.resumeItem}>
              <span>FOCUS</span>
              <div>
                <h3>Decision systems, not AI theatre</h3>
                <p>
                  Prototype the actual mechanism behind a better decision: assumptions, opposition, evidence, controls, uncertainty, room dynamics and memory.
                </p>
              </div>
            </div>
            <div className={styles.resumeItem}>
              <span>METHOD</span>
              <div>
                <h3>Observe → test → collide → decide</h3>
                <p>
                  Working prototypes, live experiments, falsifiers, do-nothing controls, opposition seats and evidence tags. The recurring question is simple: <strong>Wait, what?</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.resumeSection}>
          <span className={styles.resumeLabel}>SELECTED SYSTEMS</span>
          <div className={styles.resumeTags}>
            {systems.map((system) => (
              <span key={system}>{system}</span>
            ))}
          </div>
        </section>

        <section className={styles.resumeSection}>
          <span className={styles.resumeLabel}>EXPERIENCE</span>
          <div className={styles.resumeItems}>
            {roles.map((role) => (
              <div className={styles.resumeItem} key={role.title}>
                <span>{role.period}</span>
                <div>
                  <h3>{role.title}</h3>
                  <p>{role.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.resumeSection}>
          <span className={styles.resumeLabel}>CAPABILITIES</span>
          <div className={styles.resumeTags}>
            {capabilities.map((capability) => (
              <span key={capability}>{capability}</span>
            ))}
          </div>
        </section>

        <footer className={styles.resumeFooter}>
          <span><strong>Current:</strong> Founder, ctrl+love</span>
          <span><strong>Working principle:</strong> Better judgment begins with better observation.</span>
          <span><strong>Personal operating system:</strong> Curious until the end.</span>
        </footer>
      </article>
    </main>
  );
}
