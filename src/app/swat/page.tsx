import type { Metadata } from "next";
import Link from "next/link";
import styles from "./swat.module.css";
import { swatMissions } from "./missions-data";

export const metadata: Metadata = {
  title: "CTRL+SWAT | Rapid intervention for live situations",
  description:
    "Rapid intervention for live situations. Signal to judgment to artifact to target to send.",
};

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
          <h1>CTRL+SWAT</h1>
          <p className={styles.lead}>When something happens now, make something useful now.</p>
          <div className={styles.chain} aria-label="SWAT operating chain">
            <span>SIGNAL</span><b>→</b><span>JUDGMENT</span><b>→</b><span>ARTIFACT</span><b>→</b><span>TARGET</span><b>→</b><span>SEND</span>
          </div>
        </div>

        <div className={styles.latencyObject} aria-label="Signal to inbox latency">
          <span className={styles.latencyLabel}>SIGNAL-TO-INBOX</span>
          <strong>{latest.latency}</strong>
          <span className={styles.latencyRule}>IF IT TAKES TOO LONG, IT ISN&apos;T SWAT.</span>
        </div>
      </section>

      <section className={styles.principle}>
        <p>A SWAT move is not a campaign. It is a useful response built fast enough to still belong to the moment.</p>
        <div className={styles.tags}>
          <span>LIVE SIGNAL</span>
          <span>HUMAN JUDGMENT</span>
          <span>WORKING ARTIFACT</span>
          <span>REAL TARGET</span>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>FIELD EVIDENCE</p>
            <h2>Mission {latest.number}</h2>
          </div>
          <span className={styles.dispatched}>{latest.status}</span>
        </div>

        <Link href={`/swat/missions/${latest.slug}/`} className={styles.missionCard}>
          <div className={styles.missionMeta}>
            <span>{latest.date}</span>
            <span>MISSION {latest.number}</span>
            <span>{latest.client}</span>
          </div>
          <div className={styles.missionBody}>
            <div>
              <p className={styles.missionLabel}>JUDGMENT</p>
              <h3>{latest.judgment}</h3>
            </div>
            <div className={styles.missionProof}>
              <span>{latest.latency}</span>
              <small>DETECTION → INBOX</small>
            </div>
          </div>
          <div className={styles.missionFooter}>
            <span>{latest.target}</span>
            <span>OPEN FIELD REPORT ↗</span>
          </div>
        </Link>
      </section>

      <section className={styles.doctrine}>
        <p className={styles.kicker}>OPERATING DOCTRINE</p>
        <div className={styles.doctrineGrid}>
          <article><span>01</span><h3>SEE IT</h3><p>Notice the live signal before it becomes old news.</p></article>
          <article><span>02</span><h3>JUDGE IT</h3><p>Find the useful angle. No reaction for reaction&apos;s sake.</p></article>
          <article><span>03</span><h3>MAKE IT</h3><p>Build the smallest artifact that proves the thought.</p></article>
          <article><span>04</span><h3>SEND IT</h3><p>Get it in front of the right person while the signal is still warm.</p></article>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>SWAT IS A CTRL+LOVE RAPID RESPONSE INSTRUMENT.</p>
        <Link href="/instruments/">BACK TO INSTRUMENT CABINET ↗</Link>
      </footer>
    </main>
  );
}
