"use client";

import Link from "next/link";
import styles from "./dispatches.module.css";

const dispatches = [
  {
    number: "01",
    label: "THE SIGNAL",
    title: "The Accidental Enter Economy™",
    dek: "What happens when a tiny interface decision becomes a way of working, thinking and doing business?",
    body: "A small observation with a much larger shadow. The tools we use do not merely carry our intentions. Sometimes they quietly shape them.",
    note: "A live idea. Still developing.",
    className: "lead",
  },
  {
    number: "02",
    label: "THE PROVOCATION",
    title: "THE LAST AD AGENCY™",
    dek: "An AI seller. An AI buyer. An independent auditor.",
    body: "What if the system's most valuable recommendation were not another advertisement, but a reason not to run one? A proposition worth testing, not just applauding.",
    note: "A decision experiment.",
    className: "agency",
  },
  {
    number: "03",
    label: "THE OPEN QUESTION",
    title: "When agents become a commodity",
    dek: "If everyone can deploy an army of temporary bots, where does the advantage move?",
    body: "Perhaps away from the number of agents and towards the quality of the judgment that directs them. This is a question, not a conclusion.",
    note: "An unfinished thought.",
    className: "open",
  },
];

export const metadata = {
  title: "Dispatches — ctrl+love",
  description:
    "Ideas tested in public. Dispatches from ctrl+love on AI, human judgment, creative work and the questions still worth asking.",
  alternates: { canonical: "https://ctrlpluslove.com/dispatches/" },
  openGraph: {
    title: "Dispatches — ctrl+love",
    description:
      "Ideas tested in public. Dispatches from ctrl+love on AI, human judgment, creative work and the questions still worth asking.",
    url: "https://ctrlpluslove.com/dispatches/",
    siteName: "ctrl+love",
    type: "website",
  },
};

export default function DispatchesPage() {
  return (
    <main className={styles.page} id="main-content">
      <header className={styles.topline}>
        <Link href="/" className={styles.wordmark}>ctrl+love</Link>
        <span>FIELD NOTES / 001—003</span>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>Ideas tested in public</p>
        <h1>Dispatches<span>.</span></h1>
        <p className={styles.introCopy}>
          LinkedIn is where an idea meets the world. This is where the ideas get
          room to connect, develop, and occasionally prove themselves wrong.
        </p>
        <div className={styles.rule} />
        <p className={styles.smallNote}>Not a content treadmill. A working record.</p>
      </section>

      <section className={styles.list} aria-label="Dispatches">
        {dispatches.map((item) => (
          <article key={item.number} className={`${styles.entry} ${styles[item.className]}`}>
            <div className={styles.entryMeta}>
              <span>{item.number} / {item.label}</span>
              <span>CTRL+LOVE FIELD NOTES</span>
            </div>
            <div className={styles.entryBody}>
              <div>
                <h2>{item.title}</h2>
                <p className={styles.dek}>{item.dek}</p>
              </div>
              <div className={styles.entryAside}>
                <p>{item.body}</p>
                <span className={styles.status}>{item.note}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>Observation is not evidence. A claim is interesting. A test is more interesting.</p>
        <Link href="/">Back to ctrl+love <span aria-hidden="true">↗</span></Link>
      </footer>
    </main>
  );
}
