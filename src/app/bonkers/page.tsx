import type { Metadata } from "next";
import styles from "./bonkers.module.css";
import { BONKERS_TOOLS } from "./tools";

export const metadata: Metadata = {
  title: "Bonkers United — The Tool Room",
  description: "Ten working instruments built from Bonkers producer intelligence.",
  robots: { index: false, follow: false },
};

export default function Bonkers() {
  return (
    <main className={styles.page} id="main-content">
      <div className={styles.top}>
        <a href="/">ctrl+love</a>
        <span className={styles.stamp}><i className={styles.dot}/>BONKERS UNITED / THE TOOL ROOM</span>
      </div>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>TEN WORKING INSTRUMENTS / PRODUCER INTELLIGENCE BEFORE THE BRIEF HARDENS</div>
        <h1>SOME THINGS YOU LEARN AFTER PRODUCING FILMS FOR 27 YEARS.</h1>
        <p>
          Bonkers already knows things before the room knows why. This room turns that instinct
          into ten objects you can actually use — before production is asked to rescue the idea.
        </p>
        <a className={styles.enter} href="#tools">Enter the tool room →</a>
        <div className={styles.note}>We don&apos;t teach companies AI. We teach AI the company.</div>
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
