import type { Metadata } from "next";
import Link from "next/link";

import { HolyShitLiveClient } from "./holy-shit-live-client";
import styles from "./holy-shit-live.module.css";

export const metadata: Metadata = {
  title: "HOLY SHIT! LIVE — Holy Fools × ctrl+love",
  description: "Savannah edits the meeting while the meeting is still happening.",
  robots: { index: false, follow: false },
};

export default function HolyShitLivePage() {
  return (
    <main className={styles.page} id="main-content">
      <header className={styles.topbar}>
        <Link href="/holy-fools/">← Holy Fools</Link>
        <span>HOLY FOOLS × ctrl+love / MEETING MODE</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>SAVANNAH / LIVE EDITOR</p>
        <h1>HOLY SHIT! LIVE</h1>
        <p className={styles.dek}>
          The newsletter now happens inside the meeting. Savannah listens for
          the bit everybody nearly walked past.
        </p>
        <div className={styles.rule}>
          LISTEN → MARK → INTERRUPT ONCE → EDIT → CLOSE THE ISSUE
        </div>
      </section>

      <HolyShitLiveClient />

      <footer className={styles.footer}>
        <span>Nothing published without a human.</span>
        <span>Fools have more fun.</span>
      </footer>
    </main>
  );
}
