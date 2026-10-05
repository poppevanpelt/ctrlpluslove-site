import type { Metadata } from "next";
import styles from "./bonkers.module.css";
import { BONKERS_TOOLS } from "./tools";

export const metadata: Metadata = {
  title: "Bonkers Tool Room — ctrl+love",
  description: "Ten working instruments built around Bonkers production intelligence.",
  robots: { index: false, follow: false },
};

export default function Bonkers() {
  return (
    <main className={styles.page} id="main-content">
      <div className={styles.top}>
        <a href="/">ctrl+love</a>
        <span className={styles.stamp}><i className={styles.dot}/>BONKERS / TOOL ROOM</span>
      </div>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>TEN WORKING INSTRUMENTS / PRODUCTION INTELLIGENCE UPSTREAM</div>
        <h1>KNOW IT BEFORE THE BRIEF DOES.</h1>
        <p>
          Bonkers has spent 27 years knowing things before there was a tool for knowing them.
          This room puts that producer instinct to work before production is asked to rescue the idea.
        </p>
        <a className={styles.enter} href="#tools">Enter the tool room →</a>
        <div className={styles.note}>Not Bonkers becoming an agency. Bonkers becoming more Bonkers.</div>
      </section>
      <section className={styles.grid} id="tools">
        {BONKERS_TOOLS.map((tool) => (
          <a className={styles.card} href={"/bonkers/" + tool.slug} key={tool.slug}>
            <span className={styles.cardNo}>{tool.index} / BONKERS × CTRL+LOVE</span>
            <h2>{tool.title}</h2>
            <p>{tool.line}</p>
            <span>Open instrument →</span>
          </a>
        ))}
      </section>
      <footer className={styles.footer}>
        <span>Built from the things producers know before the room knows why.</span>
        <span>Made with ctrl+love.</span>
      </footer>
    </main>
  );
}
