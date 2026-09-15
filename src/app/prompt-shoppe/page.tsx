import type { Metadata } from "next";
import Link from "next/link";
import styles from "./prompt-shoppe.module.css";

export const metadata: Metadata = {
  title: "Poppe’s Prompt Shoppe | ctrl+love",
  description: "Bring in your old prompts. Put them on the dyno.",
};

const objects = [
  {
    no: "OBJ—01",
    name: "THE PROMPT DYNO",
    line: "Puts a prompt under working load and reads what holds.",
  },
  {
    no: "OBJ—02",
    name: "THE ASSUMPTION EXTRACTOR",
    line: "Presses out the assumptions a prompt smuggles in.",
  },
  {
    no: "OBJ—03",
    name: "THE INTENT COMPASS",
    line: "Finds the true intent and holds the heading.",
  },
] as const;

export default function PromptShoppePage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span>WORKSHOP / BENCH 02</span>
        <Link href="/instruments/">INSTRUMENT CABINET ↗</Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroImage} role="img" aria-label="Poppe’s Prompt Shoppe instrument in the California prototype laboratory" />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>SAN GREGORIO / CALIFORNIA</p>
          <h1>POPPE’S<br />PROMPT SHOPPE</h1>
          <p>Bring in your old ones. We’ll make ’em perform like never before.</p>
        </div>
      </section>

      <section className={styles.counter}>
        <div className={styles.counterHead}>
          <p className={styles.kicker}>THE COUNTER</p>
          <h2>HAND IT OVER.</h2>
          <p>A prompt without a decision is decoration.</p>
        </div>
        <div className={styles.ticket}>
          <span>BENCH TICKET</span>
          <strong>NO DECISION?</strong>
          <strong>NO AUDIENCE?</strong>
          <strong>NO EVIDENCE?</strong>
          <small>We’ll find out what the prompt is actually trying to do.</small>
        </div>
      </section>

      <section className={styles.objects} aria-label="Prompt Shoppe instruments">
        {objects.map((object) => (
          <article key={object.no}>
            <div className={styles.objectStage}>
              <span className={styles.objectDial} />
              <span className={styles.objectLever} />
              <span className={styles.objectPlate}>{object.no}</span>
            </div>
            <p className={styles.kicker}>{object.no}</p>
            <h2>{object.name}</h2>
            <p>{object.line}</p>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>OLD PROMPTS BOUGHT &amp; SOLD.</p>
        <Link href="/">BACK TO MOTHERSHIP ↗</Link>
      </footer>
    </main>
  );
}
