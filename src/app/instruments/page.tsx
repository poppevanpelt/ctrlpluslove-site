import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Instrument Cabinet | ctrl+love",
  description: "A cabinet of applied AI instruments for seeing, testing, deciding and moving.",
};

const instruments = [
  { no: "001", name: "PITCH CRASH TEST", status: "LIVE RUN", line: "Prepared cupboards are not prepared communities." },
  { no: "002", name: "DECISION COLLIDER", status: "LIVE INSTRUMENT", line: "A decision becomes visible when its interests collide." },
  { no: "003", name: "LIVING TICKER", status: "PROTOTYPE 001", line: "Minutes record words. The ticker records movement." },
  { no: "004", name: "BRAND TRANSPLANT", status: "TESTED", line: "What survives the transplant is probably the brand." },
  { no: "005", name: "SIGNAL DISTORTION", status: "LIVE RUN", line: "Premium quality disappeared before the campaign began." },
  { no: "006", name: "DECISION SURFACE", status: "PROTOTYPE 001", line: "Every surface edits the brand before the audience sees it." },
  { no: "007", name: "DECISION MEMORY", status: "LIVE SYSTEM", line: "A forgotten decision must win its argument again." },
  { no: "008", name: "MEETING FILTER", status: "WORKING PROTOTYPE", line: "Most bad meetings fail before they begin." },
  { no: "009", name: "DECISION IN A BOX", status: "PHYSICAL PROTOTYPE", line: "Five options enter. One imperfect object leaves." },
  { no: "010", name: "PROMPT SHOPPE", status: "WORKING INSTRUMENT", line: "A prompt without a decision is decoration." },
  { no: "011", name: "USB DECISION ACCELERATOR", status: "LIMITED EDITION", line: "Ten decisions. No subscription. No ceremony." },
  { no: "012", name: "READ THE ROOM", status: "PROTOTYPE", line: "The room has a strategy before the strategy has the room." },
  { no: "013", name: "OPPOSITION SEAT", status: "PROTOCOL", line: "Every important decision needs someone paid to disagree." },
  { no: "014", name: "DO-NOTHING CONTROL", status: "PROTOCOL", line: "Change must beat the cost of leaving reality alone." },
  { no: "015", name: "MISS ARCHIVE", status: "PROTOCOL", line: "Wrong Marcel. Correct lesson." },
  { no: "016", name: "EVIDENCE TAGS", status: "PROTOCOL", line: "Confidence becomes useful when its source is visible." },
] as const;

function spriteStyle(index: number): CSSProperties {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return {
    backgroundPosition: `${(col / 3) * 100}% ${(row / 3) * 100}%`,
  };
}

export default function InstrumentCabinetPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span className={styles.serial}>APPLIED AI / INSTRUMENT FAMILY 001</span>
        <Link href="/" className={styles.back}>BACK TO MOTHERSHIP ↗</Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>CALIFORNIA PROTOTYPE SHOP</p>
          <h1>INSTRUMENT<br />CABINET</h1>
          <p className={styles.lead}>Ideas enter. Evidence leaves.</p>
        </div>
        <div className={styles.heroMeta}>
          <span>16 instruments</span>
          <span>physical / analytical / slightly unreasonable</span>
          <span>built for human judgment</span>
        </div>
      </section>

      <section className={styles.intro} aria-label="Cabinet introduction">
        <p>A family of working objects for seeing what is happening, exposing what has to be true, testing what survives pressure and finding the smallest useful move.</p>
        <div className={styles.legend}>
          <span><i className={styles.dotLive} /> LIVE</span>
          <span><i className={styles.dotProto} /> PROTOTYPE</span>
          <span><i className={styles.dotProtocol} /> PROTOCOL</span>
        </div>
      </section>

      <section className={styles.grid} aria-label="Sixteen ctrl+love instruments">
        {instruments.map((instrument, index) => (
          <article className={styles.card} key={instrument.no}>
            <div className={styles.imageWrap}>
              <div
                className={styles.spriteImage}
                style={spriteStyle(index)}
                role="img"
                aria-label={`${instrument.name}, ctrl+love instrument ${instrument.no}`}
              />
              <div className={styles.imageTag}>{instrument.status}</div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitleRow}>
                <span className={styles.number}>{instrument.no}</span>
                <h2>{instrument.name}</h2>
              </div>
              <p>{instrument.line}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.protocols}>
        <p className={styles.kicker}>FOUNDATIONAL PROTOCOLS</p>
        <div className={styles.protocolGrid}>
          <div><span>01</span><strong>OPPOSITION SEAT</strong><p>Pay someone to disagree.</p></div>
          <div><span>02</span><strong>DO-NOTHING CONTROL</strong><p>Make change beat reality left alone.</p></div>
          <div><span>03</span><strong>BLIND TRIAL</strong><p>Remove the label before judging the thing.</p></div>
          <div><span>04</span><strong>MISS ARCHIVE</strong><p>Keep the wrong calls. Extract the lesson.</p></div>
          <div><span>05</span><strong>EVIDENCE TAGS</strong><p>Observed / Inferred / Assumed / Tested / Proven.</p></div>
          <div className={styles.kill}><span>KQ</span><strong>KILL QUESTION</strong><p>What evidence would make us abandon this conclusion?</p></div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>LET US HELP YOU BREAK SOMETHING.</p>
        <Link href="/">ctrlpluslove.com ↗</Link>
      </footer>
    </main>
  );
}
