import type { Metadata } from "next";

import { createPageMetadata } from "../seo";
import styles from "./out-house.module.css";

export const metadata: Metadata = createPageMetadata({
  path: "/out-house/",
  title: "In-house needs an out-house — ctrl+love",
  description:
    "An external pressure unit for in-house teams. Temporary distance, useful opposition and evidence without taking over the work.",
});

const instruments = [
  {
    number: "01",
    name: "Opposition Seat",
    note: "Give the strongest objection a proper chair before consensus gets comfortable.",
  },
  {
    number: "02",
    name: "Do-Nothing Control",
    note: "Compare the proposed move with the cost and consequence of doing nothing.",
  },
  {
    number: "03",
    name: "Blind Trial",
    note: "Remove the logo, hierarchy and authorship. See what survives without borrowed authority.",
  },
  {
    number: "04",
    name: "Kill Question",
    note: "Ask what evidence would make us abandon this conclusion.",
  },
];

const formats = [
  {
    code: "A",
    title: "Half day",
    note: "One live question. One room. Enough pressure to expose what the team can no longer see from inside.",
  },
  {
    code: "B",
    title: "Full day",
    note: "More evidence, more collision, more room for the uncomfortable answer to become useful.",
  },
  {
    code: "C",
    title: "On call",
    note: "External perspective within reach when an important decision starts hardening too quickly.",
  },
];

export default function OutHousePage() {
  return (
    <main className={styles.page}>
      <header className={styles.utilityBar}>
        <a className={styles.brand} href="https://ctrlpluslove.com">
          CTRL+LOVE
        </a>
        <span>APPLIED AI</span>
        <span>EXTERNAL PRESSURE UNIT</span>
        <span>001</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroLabel}>OUT-HOUSE / FIELD UNIT 001</div>
        <h1>
          IN-HOUSE NEEDS
          <br />
          AN OUT-HOUSE.
        </h1>
        <p>A little distance is sometimes the most useful thing in the room.</p>
        <div className={styles.signal} aria-hidden="true">
          <span />
          EXTERNAL PERSPECTIVE AVAILABLE
        </div>
      </section>

      <section className={styles.splitStatement}>
        <div>
          <span className={styles.eyebrow}>INSIDE</span>
          <h2>IN-HOUSE KNOWS THE BUSINESS.</h2>
        </div>
        <div>
          <span className={styles.eyebrow}>OUTSIDE</span>
          <h2>OUT-HOUSE PROTECTS THE PERSPECTIVE.</h2>
        </div>
      </section>

      <section className={styles.argument}>
        <div className={styles.sectionCode}>WHY / 001</div>
        <div className={styles.argumentCopy}>
          <p>
            Internal teams accumulate context, speed and fluency. That is exactly what makes them valuable.
          </p>
          <p>
            They also inherit assumptions, politics, vocabulary and blind spots. Eventually some things stop looking strange simply because everybody has been looking at them for too long.
          </p>
          <p>
            Out-house creates temporary distance. Useful opposition. Evidence. A view from outside the weather system, without trying to take over the forecast.
          </p>
        </div>
      </section>

      <section className={styles.seatSection}>
        <div className={styles.seatIntro}>
          <span className={styles.sectionCode}>MODULE / 004</span>
          <h2>THE UNCOMFORTABLE SEAT.</h2>
          <p>Installed only when agreement starts arriving suspiciously early.</p>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTopline}>
            <span>CTRL+LOVE EXTERNAL PRESSURE UNIT</span>
            <span>STATUS: ARMED</span>
          </div>

          <div className={styles.panelSeat}>
            <div className={styles.seatPlate}>
              <span>SEAT</span>
              <strong>01</strong>
              <small>KEEP EMPTY UNTIL NEEDED</small>
            </div>
          </div>

          <div className={styles.instrumentGrid}>
            {instruments.map((instrument) => (
              <article className={styles.instrument} key={instrument.number}>
                <span className={styles.instrumentNumber}>{instrument.number}</span>
                <h3>{instrument.name}</h3>
                <p>{instrument.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.promise}>
        <span className={styles.sectionCode}>TERMS / 001</span>
        <h2>
          WE DON&apos;T WANT
          <br />
          YOUR ACCOUNT.
        </h2>
        <p>We want the uncomfortable seat in the room.</p>
      </section>

      <section className={styles.formatsSection}>
        <div className={styles.formatsHead}>
          <span className={styles.sectionCode}>INSTALLATION OPTIONS</span>
          <p>Enough outside pressure to make the inside sharper.</p>
        </div>

        <div className={styles.formatsGrid}>
          {formats.map((format) => (
            <article className={styles.formatCard} key={format.code}>
              <span className={styles.formatCode}>UNIT {format.code}</span>
              <h3>{format.title}</h3>
              <p>{format.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <span className={styles.sectionCode}>REQUEST / OPEN</span>
          <h2>BORROW AN OUT-HOUSE.</h2>
          <p>No retainer required. No takeover intended. Bring one thing that matters.</p>
        </div>
        <div className={styles.ctaActions}>
          <a className={styles.primaryButton} href="mailto:hello@ctrlpluslove.com?subject=Borrow%20an%20out-house">
            OPEN THE DOOR
          </a>
          <a className={styles.secondaryLink} href="https://ctrlpluslove.com">
            BACK TO CTRL+LOVE →
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>CTRL+LOVE</span>
        <span>SHORTCUT TO REALITY.</span>
        <span>OUT-HOUSE / 001</span>
      </footer>
    </main>
  );
}
