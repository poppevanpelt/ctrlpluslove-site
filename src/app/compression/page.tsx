import Link from "next/link";
import styles from "../thin-press.module.css";

export default function CompressionPage() {
  return (
    <main className={styles.page}>
      <div className={styles.top}><span>CTRL+LOVE THIN PRESS</span><span>BOOK 01</span></div>
      <section className={styles.hero}>
        <h1>COMPRESSION.<br /><em>VERY LITTLE.</em></h1>
        <div className={styles.copy}>
          <p>How much meaning fits in as little language as possible?</p>
          <p>A very thin book about punctuation, tone and the strange amount of humanity that can hide inside one tiny mark.</p>
          <Link className={styles.back} href="/#reading-title">BACK TO THE LIBRARY ↗</Link>
        </div>
      </section>
      <section className={styles.grid}>
        <article className={styles.card}><span>01 / ZO.</span><h2>Two letters. One full stop.</h2><p>There. Done. Enough. A whole meeting could also have worked.</p></article>
        <article className={styles.card}><span>02 / &</span><h2>Not “and”. Closer.</h2><p>A conjunction that behaves more like an encounter.</p></article>
        <article className={styles.card}><span>03 / ,</span><h2>Wait.</h2><p>A tiny mark controlling time without making a sound.</p></article>
        <article className={styles.card}><span>04 / !</span><h2>Volume on paper.</h2><p>A line, a dot, and an attempt to make typography shout.</p></article>
      </section>
    </main>
  );
}