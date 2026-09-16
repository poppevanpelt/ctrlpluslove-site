import type { Metadata } from "next";
import Link from "next/link";
import styles from "./swat-home.module.css";
import { swatMissions } from "./missions-data";

export const metadata: Metadata = {
  title: "CTRL+SWAT | Rapid intervention for live situations",
  description:
    "Rapid intervention for live situations. Signal to judgment to artifact to target to send.",
};

const doctrine = [
  ["01", "SEE IT", "Notice the live signal before it becomes old news."],
  ["02", "JUDGE IT", "Find the useful angle. No reaction for reaction's sake."],
  ["03", "MAKE IT", "Build the smallest artifact that proves the thought."],
  ["04", "SEND IT", "Get it in front of the right person while the signal is still warm."],
] as const;

export default function SwatPage() {
  const latest = swatMissions[0];

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span className={styles.serial}>CTRL+SWAT / RAPID RESPONSE UNIT</span>
        <span className={styles.status}>FIELD STATUS: ACTIVE</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>RAPID INTERVENTION FOR LIVE SITUATIONS</p>
          <div className={styles.heroMain}>
            <h1>CTRL+SWAT</h1>
            <p className={styles.lead}>When something happens now, make something useful now.</p>
          </div>
          <div className={styles.chain} aria-label="SWAT operating chain">
            <small>OPERATING CHAIN / LIVE INPUT</small>
            <div>
              <span>SIGNAL</span><b>→</b><span>JUDGMENT</span><b>→</b><span>ARTIFACT</span><b>→</b><span>TARGET</span><b>→</b><span>SEND</span>
            </div>
          </div>
        </div>

        <div className={styles.latencyWrap}>
          <div className={styles.latencyPlate} tabIndex={0} aria-label={`Signal to inbox latency: ${latest.latency}`}>
            <i className={`${styles.bolt} ${styles.boltNw}`} aria-hidden="true" />
            <i className={`${styles.bolt} ${styles.boltNe}`} aria-hidden="true" />
            <i className={`${styles.bolt} ${styles.boltSw}`} aria-hidden="true" />
            <i className={`${styles.bolt} ${styles.boltSe}`} aria-hidden="true" />
            <div className={styles.latencyTopline}>
              <span>SIGNAL-TO-INBOX</span>
              <span>CAL / {latest.number}</span>
            </div>
            <strong>{latest.latency}</strong>
            <div className={styles.gauge} aria-hidden="true"><span /></div>
            <p>IF IT TAKES TOO LONG, IT ISN&apos;T SWAT.</p>
          </div>
          <span className={styles.steelBall} aria-hidden="true" />
        </div>
      </section>

      <section className={styles.principle}>
        <p className={styles.sectionIndex}>OPERATING PRINCIPLE / 00</p>
        <div>
          <p className={styles.principleCopy}>A SWAT move is not a campaign. It is a useful response built fast enough to still belong to the moment.</p>
          <div className={styles.tags}>
            <span><b>01</b>LIVE SIGNAL</span>
            <span><b>02</b>HUMAN JUDGMENT</span>
            <span><b>03</b>WORKING ARTIFACT</span>
            <span><b>04</b>REAL TARGET</span>
          </div>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>FIELD EVIDENCE / CASE FILE</p>
            <h2>Mission {latest.number}</h2>
          </div>
          <span className={styles.dispatched}>{latest.status}</span>
        </div>

        <article className={styles.caseFile}>
          <div className={styles.caseTab}>{latest.number} / {latest.client}</div>

          <div className={styles.caseHeader}>
            <dl className={styles.caseFacts}>
              <div><dt>Date</dt><dd>{latest.date}</dd></div>
              <div><dt>Client</dt><dd>{latest.client}</dd></div>
              <div><dt>Detection → inbox</dt><dd>{latest.latency}</dd></div>
              <div><dt>Target</dt><dd>{latest.target}</dd></div>
            </dl>
            <div className={styles.judgmentBlock}>
              <p>JUDGMENT / DECISION LINE</p>
              <h3>{latest.judgment}</h3>
            </div>
          </div>

          <div className={styles.caseBrief}>
            <div>
              <p>MISSION TRIGGER</p>
              <span>{latest.trigger}</span>
            </div>
            <div>
              <p>ARTIFACT</p>
              <span>{latest.artifact}</span>
            </div>
          </div>

          <div className={styles.evidenceChain} aria-label="Mission operating chain">
            {latest.steps.map((step, index) => (
              <div className={styles.evidenceStrip} key={step.label} tabIndex={0}>
                <span className={styles.stripNumber}>0{index + 1}</span>
                <strong>{step.label}</strong>
                <p>{step.value}</p>
                <small>RRU-{String(index + 1).padStart(3, "0")} / VERIFIED</small>
              </div>
            ))}
          </div>

          <div className={styles.caseFooter}>
            <span>ROUTING / DIRECT / {latest.target}</span>
            <Link href={`/swat/missions/${latest.slug}/`}>OPEN FIELD REPORT ↗</Link>
          </div>
        </article>
      </section>

      <section className={styles.doctrine}>
        <p className={styles.kicker}>OPERATING DOCTRINE / 04 MOVES</p>
        <div className={styles.doctrineRows}>
          {doctrine.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <i aria-hidden="true">↗</i>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>SWAT IS A CTRL+LOVE RAPID RESPONSE INSTRUMENT.</p>
        <Link href="/instruments/">BACK TO INSTRUMENT CABINET ↗</Link>
      </footer>
    </main>
  );
}
