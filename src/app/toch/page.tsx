import Link from "next/link";
import styles from "../thin-press.module.css";

export default function TochPage() {
  return (
    <main className={styles.page}>
      <div className={styles.top}><span>CTRL+LOVE THIN PRESS</span><span>BOOK 02</span></div>
      <section className={styles.hero}>
        <h1>TOCH?<br /><em>TOCH!</em></h1>
        <div className={styles.copy}>
          <p>The words stay exactly the same. Only the punctuation moves.</p>
          <p>And suddenly the speaker changes: uncertain, triumphant, irritated, relieved, suspicious, finished.</p>
          <Link className={styles.back} href="/#reading-title">BACK TO THE LIBRARY ↗</Link>
        </div>
      </section>
      <section className={styles.grid}>
        <article className={styles.card}><span>01</span><h2>Toch?</h2><p>Looks for confirmation.</p></article>
        <article className={styles.card}><span>02</span><h2>Toch!</h2><p>Has already decided.</p></article>
        <article className={styles.card}><span>03</span><h2>Ja.</h2><p>Closed.</p></article>
        <article className={styles.card}><span>04</span><h2>Ja...</h2><p>Maybe not.</p></article>
      </section>
    </main>
  );
}