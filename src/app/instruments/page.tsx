import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Instrument Cabinet | ctrl+love",
  description: "A cabinet of applied AI instruments for seeing, testing, deciding and moving.",
};

const instruments = [
  { no: "001", name: "PITCH CRASH TEST", status: "LIVE RUN", image: "/instruments/01-pitch-crash-test.webp", line: "Prepared cupboards are not prepared communities." },
  { no: "002", name: "DECISION COLLIDER", status: "LIVE INSTRUMENT", image: "/instruments/02-decision-collider.webp", line: "A decision becomes visible when its interests collide." },
  { no: "003", name: "LIVING TICKER", status: "PROTOTYPE 001", image: "/instruments/03-living-ticker.webp", line: "Minutes record words. The ticker records movement." },
  { no: "004", name: "BRAND TRANSPLANT", status: "TESTED", image: "/instruments/04-brand-transplant.webp", line: "What survives the transplant is probably the brand." },
  { no: "005", name: "SIGNAL DISTORTION", status: "LIVE RUN", image: "/instruments/05-signal-distortion.webp", line: "Premium quality disappeared before the campaign began." },
  { no: "006", name: "DECISION SURFACE", status: "PROTOTYPE 001", image: "/instruments/06-decision-surface.webp", line: "Every surface edits the brand before the audience sees it." },
  { no: "007", name: "DECISION MEMORY", status: "LIVE SYSTEM", image: "/instruments/07-decision-memory.webp", line: "A forgotten decision must win its argument again." },
  { no: "008", name: "MEETING FILTER", status: "WORKING PROTOTYPE", image: "/instruments/08-meeting-filter.webp", line: "Most bad meetings fail before they begin." },
  { no: "009", name: "DECISION IN A BOX", status: "PHYSICAL PROTOTYPE", image: "/instruments/09-decision-in-a-box.webp", line: "Five options enter. One imperfect object leaves." },
  { no: "010", name: "PROMPT SHOPPE", status: "WORKING INSTRUMENT", image: "/instruments/10-prompt-shoppe.webp", line: "A prompt without a decision is decoration." },
  { no: "011", name: "USB DECISION ACCELERATOR", status: "LIMITED EDITION", image: "/instruments/11-usb-decision-accelerator.webp", line: "Ten decisions. No subscription. No ceremony." },
  { no: "012", name: "READ THE ROOM", status: "PROTOTYPE", image: "/instruments/12-read-the-room.webp", line: "The room has a strategy before the strategy has the room." },
  { no: "013", name: "OPPOSITION SEAT", status: "PROTOCOL", image: "/instruments/13-opposition-seat.webp", line: "Every important decision needs someone paid to disagree." },
  { no: "014", name: "DO-NOTHING CONTROL", status: "PROTOCOL", image: "/instruments/14-do-nothing-control.webp", line: "Change must beat the cost of leaving reality alone." },
  { no: "015", name: "MISS ARCHIVE", status: "PROTOCOL", image: "/instruments/15-miss-archive.webp", line: "Wrong Marcel. Correct lesson." },
  { no: "016", name: "EVIDENCE TAGS", status: "PROTOCOL", image: "/instruments/16-evidence-tags.webp", line: "Confidence becomes useful when its source is visible." },
] as const;

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
        <p>
          A family of working objects for seeing what is happening, exposing what has to be true,
          testing what survives pressure and finding the smallest useful move.
        </p>
        <div className={styles.legend}>
          <span><i className={styles.dotLive} /> LIVE</span>
          <span><i className={styles.dotProto} /> PROTOTYPE</span>
          <span><i className={styles.dotProtocol} /> PROTOCOL</span>
        </div>
      </section>

      <section className={styles.grid} aria-label="Sixteen ctrl+love instruments">
        {instruments.map((instrument) => (
          <article className={styles.card} key={instrument.no}>
            <div className={styles.imageWrap}>
              <img
                src={instrument.image}
                alt={`${instrument.name}, ctrl+love instrument ${instrument.no}`}
                loading={Number(instrument.no) > 4 ? "lazy" : "eager"}
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
