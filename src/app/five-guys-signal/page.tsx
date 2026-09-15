import type { Metadata } from "next";
import Link from "next/link";
import styles from "./five-guys-signal.module.css";

export const metadata: Metadata = {
  title: "Five Guys Signal Distortion | ctrl+love",
  description: "A Signal Distortion field object showing where premium quality disappears before the campaign begins.",
};

const layers = [
  { label: "BRAND", value: "Premium quality", retained: 100 },
  { label: "SEARCH", value: "Burgers, fries, locations", retained: 43 },
  { label: "AI ANSWERS", value: "Fast casual, customizable, expensive", retained: 18 },
  { label: "RECOMMENDATION", value: "Good burger option", retained: 9 },
] as const;

export default function FiveGuysSignalPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span>SIGNAL DISTORTION / LIVE RUN 005</span>
        <span>FIVE GUYS / NL</span>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>WHAT THE BRAND SAYS</p>
          <h1>PREMIUM<br />QUALITY</h1>
        </div>
        <div className={styles.lossObject}>
          <span>SIGNAL RETAINED</span>
          <strong>9%</strong>
          <small>91% disappeared before the campaign began.</small>
        </div>
      </section>

      <section className={styles.chain} aria-label="Signal loss chain">
        {layers.map((layer) => (
          <article key={layer.label}>
            <div className={styles.layerHead}>
              <span>{layer.label}</span>
              <strong>{layer.retained}%</strong>
            </div>
            <p>{layer.value}</p>
            <div className={styles.meter}><i style={{ width: `${layer.retained}%` }} /></div>
          </article>
        ))}
      </section>

      <section className={styles.judgment}>
        <p className={styles.kicker}>JUDGMENT</p>
        <h2>The campaign cannot communicate what the surfaces have already deleted.</h2>
        <p>Five Guys may make a premium-quality product. But when search, AI answers and recommendation surfaces reduce the brand to category shorthand, media has to buy back meaning that should already be visible.</p>
      </section>

      <section className={styles.move}>
        <div>
          <p className={styles.kicker}>NEXT MOVE</p>
          <h2>Build the proof object before the campaign.</h2>
        </div>
        <div className={styles.proofCard}>
          <span>DO NOT SAY</span>
          <strong>PREMIUM QUALITY</strong>
          <span>MAKE IT VISIBLE</span>
          <strong>INGREDIENTS / PROCESS / ABUNDANCE / FRESHNESS</strong>
        </div>
      </section>

      <section className={styles.end}>
        <p>Signal Distortion asks one question:</p>
        <h2>What survives before you spend a euro explaining it?</h2>
        <Link href="/instruments/">RETURN TO INSTRUMENT CABINET ↗</Link>
      </section>
    </main>
  );
}
