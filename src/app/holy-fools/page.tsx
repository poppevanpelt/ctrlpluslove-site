import type { Metadata } from "next";
import Link from "next/link";

import styles from "./holy-fools.module.css";
import { HOLY_TOOLS } from "./tools";

export const metadata: Metadata = {
  title: "Holy Fools Field Kit",
  description: "A field kit of small instruments for creative judgment.",
  robots: { index: false, follow: false },
};

export default function HolyFoolsPage() {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>HF</span>
            <span>HOLY FOOLS × ctrl+love</span>
          </div>
          <span>FIELD KIT / 2026</span>
        </header>

        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>TEN SMALL WAYS TO GET CLOSER TO THE THING</p>
            <h1>Holy Fools Field Kit.</h1>
          </div>
          <div>
            <p className={styles.heroCopy}>
              Not a methodology. A shelf of useful interruptions.
            </p>
            <p className={styles.heroNote}>
              Open one. Use it on real work. Close it again.
            </p>
          </div>
        </section>

        <section className={styles.grid} aria-label="Holy Fools instruments">
          {HOLY_TOOLS.map((tool) => (
            <Link
              className={styles.card}
              href={"/holy-fools/" + tool.slug + "/"}
              key={tool.slug}
            >
              <span className={styles.cardIndex}>{tool.index}</span>
              <h2>{tool.title}</h2>
              <p>{tool.line}</p>
              <div className={styles.cardMeta}>
                <span>{tool.kicker}</span>
                <span>OPEN →</span>
              </div>
            </Link>
          ))}
        </section>

        <footer className={styles.footer}>
          <span>HOLY FOOLS / WORKING PROTOTYPES</span>
          <Link href="/">ctrl+love</Link>
        </footer>
      </div>
    </main>
  );
}
