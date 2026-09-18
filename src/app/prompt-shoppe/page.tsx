import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ShoppeBench from "./shoppe-bench";
import styles from "./prompt-shoppe.module.css";

export const metadata: Metadata = {
  title: "Poppe’s Prompt Shoppe | ctrl+love",
  description: "Bring in your old prompts. Put them on the dyno.",
};

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

      <ShoppeBench />

      <section className={styles.objectShelf} aria-labelledby="object-shelf-title">
        <div className={styles.objectShelfHead}>
          <p className={styles.kicker}>PHYSICAL OBJECTS / SMALL BATCH</p>
          <h2 id="object-shelf-title">DECISIONS<br />YOU CAN HOLD.</h2>
          <p>No soda. No shirts. Things with a job.</p>
        </div>
        <article className={styles.realObject}>
          <div className={styles.realObjectImage}>
            <Image src="/instruments/objects/ten-decisions-usb.webp" alt="The ctrl+love Decision Stick in its numbered sleeve" fill sizes="(max-width: 760px) 100vw, 50vw" />
          </div>
          <span>OBJECT 001 / EDITION 001–100</span>
          <h3>DECISION STICK</h3>
          <p>Ten decisions. Pick carefully.</p>
        </article>
        <article className={styles.realObject}>
          <div className={styles.realObjectImage}>
            <Image src="/instruments/objects/decision-in-a-box.webp" alt="Decision in a Box with five metal forms and decision cards" fill sizes="(max-width: 760px) 100vw, 50vw" />
          </div>
          <span>OBJECT 002 / FIVE CARDS</span>
          <h3>DECISION IN A BOX</h3>
          <p>Four unresolved. One decision. Once the ball lands, everybody owns it.</p>
        </article>
      </section>

      <footer className={styles.footer}>
        <p>OLD PROMPTS BOUGHT &amp; SOLD.</p>
        <Link href="/">BACK TO MOTHERSHIP ↗</Link>
      </footer>
    </main>
  );
}
