import type { Metadata } from "next";
import Link from "next/link";

import styles from "./portfolio.module.css";

export const metadata: Metadata = {
  title: "Poppe van Pelt — Applied AI Decision Systems Engineer",
  description:
    "Poppe van Pelt builds applied AI decision systems that make judgment observable, challengeable and better.",
};

const systems = [
  {
    name: "Decision Collider",
    description:
      "A six-chamber live decision experiment: observe, interpret, frame, collide, detect, decide.",
    href: "/decision-collider/",
  },
  {
    name: "Prime the Room",
    description:
      "Tests whether the room itself is quietly steering people toward a conclusion before the work even begins.",
  },
  {
    name: "Brand Survival",
    description:
      "Subtract recognition layer by layer and watch what still breathes. Distinctive brand or category wallpaper?",
    href: "/brand-survival/",
  },
  {
    name: "Decision Memory",
    description:
      "Preserves assumptions, opposition, evidence, controls and uncertainty so an organisation remembers why it decided, not only what.",
  },
  {
    name: "Living Ticker",
    description:
      "Turns live room movement into observable signals: challenge, reframe, build, ownership and rupture.",
  },
  {
    name: "Meeting Filter",
    description:
      "A three-question gate for deciding whether a meeting deserves to exist before calendars fill up.",
    href: "/meeting-filter/",
  },
];

const lab = [
  "Atlas Mentis Humanae",
  "Human Protocol Library",
  "Protocol Compiler",
  "ctrl+love Foundation",
  "Institute for Decision Research",
  "Field Notes / Batch Experiments",
];

function SystemCard({
  system,
  index,
}: {
  system: (typeof systems)[number];
  index: number;
}) {
  const body = (
    <>
      <div className={styles.systemMeta}>
        <span>SELECTED SYSTEM</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{system.name}</h3>
      <p>{system.description}</p>
      <span className={styles.systemAction}>{system.href ? "OPEN SYSTEM ↗" : "IN DEVELOPMENT"}</span>
    </>
  );

  return system.href ? (
    <Link className={styles.systemCard} href={system.href}>
      {body}
    </Link>
  ) : (
    <article className={styles.systemCard}>{body}</article>
  );
}

export default function PoppePortfolioPage() {
  return (
    <main id="main-content" className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.wordmark} href="/poppe/" aria-label="Poppe van Pelt home">
          PP
        </Link>
        <div className={styles.topbarMeta}>
          <span>POPPE VAN PELT</span>
          <span>HAARLEM / NL</span>
          <span>2026</span>
        </div>
        <nav className={styles.nav} aria-label="Portfolio navigation">
          <a href="#systems">Systems</a>
          <a href="#experience">Field experience</a>
          <Link href="/poppe/resume/">Resume</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroIndex}>CURRENT PRACTICE / 001</div>
        <h1>
          Applied AI
          <br />
          Decision Systems
          <br />
          Engineer.
        </h1>
        <div className={styles.heroLower}>
          <p className={styles.heroStatement}>
            I build instruments that make judgment observable, challengeable and better.
          </p>
          <p className={styles.heroBridge}>
            I spent three decades making ideas. Now I build systems that help humans decide which ideas deserve to survive.
          </p>
        </div>
        <aside className={styles.waitTag} aria-label="Recurring question">
          <span>RECURRING INTERRUPTION</span>
          <strong>Wait, what?</strong>
        </aside>
      </section>

      <section id="systems" className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>01 / SELECTED SYSTEMS</span>
          <p>Working prototypes, live instruments and research machinery.</p>
        </div>
        <div className={styles.systemGrid}>
          {systems.map((system, index) => (
            <SystemCard key={system.name} system={system} index={index} />
          ))}
        </div>
      </section>

      <section id="experience" className={`${styles.section} ${styles.experience}`}>
        <div className={styles.sectionHeading}>
          <span>02 / FIELD EXPERIENCE</span>
          <p>Thirty years inside decisions before engineering them.</p>
        </div>
        <div className={styles.timeline}>
          <div className={styles.timelineRow}>
            <span>NOW</span>
            <strong>ctrl+love</strong>
            <p>Founder. Applied AI decision systems, instruments and live experiments.</p>
          </div>
          <div className={styles.timelineRow}>
            <span>PREVIOUSLY</span>
            <strong>Saint Amsterdam</strong>
            <p>Co-founder. Creative practice, strategy and making things real.</p>
          </div>
          <div className={styles.timelineRow}>
            <span>8 YEARS</span>
            <strong>Apple</strong>
            <p>Lead Creative Director, global.</p>
          </div>
          <div className={styles.timelineRow}>
            <span>EARLIER</span>
            <strong>Selmore / TBWA / advertising</strong>
            <p>Co-founder, creative leadership and three decades of watching beautiful ideas meet organisational reality.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.lab}`}>
        <div className={styles.sectionHeading}>
          <span>03 / CURRENT LAB</span>
          <p>Research that may become an instrument, or may fail usefully.</p>
        </div>
        <div className={styles.labGrid}>
          {lab.map((item, index) => (
            <div className={styles.labItem} key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.interruption}>
        <span>THE SUBARU</span>
        <h2>Wait, what?</h2>
        <p>
          The recurring interruption behind the work. Not contrarianism. A reflex against premature certainty.
        </p>
        <blockquote>If everybody agrees too quickly, inspect the room.</blockquote>
      </section>

      <footer className={styles.footer}>
        <div>
          <span>POPPE VAN PELT</span>
          <strong>Applied AI Decision Systems Engineer</strong>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/poppe/resume/">Resume</Link>
          <a href="https://www.linkedin.com/in/poppevanpelt/">LinkedIn ↗</a>
          <a href="mailto:hello@ctrlpluslove.com">hello@ctrlpluslove.com</a>
          <Link href="/">ctrl+love ↗</Link>
        </div>
        <p>Curious until the end.</p>
      </footer>
    </main>
  );
}
