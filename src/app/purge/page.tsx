import type { Metadata } from "next";
import Link from "next/link";
import Purge from "./purge";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "CTRL+PURGE | ctrl+love",
  description: "A subtraction instrument for seeing exactly what can be removed without damaging the thing that matters.",
};

export default function PurgePage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/">ctrl+love</Link>
        <span>INSTRUMENT 020 · SUBTRACTION UNIT</span>
        <Link href="/instruments/">INSTRUMENT ROOM →</Link>
      </header>

      <section className={styles.hero} aria-labelledby="purge-title">
        <p>CTRL+PURGE / FIELD PROTOTYPE</p>
        <h1 id="purge-title">CUT THE FAT.<br />KEEP THE ORGAN.</h1>
        <span>Not simplify. Not declutter. Remove exactly what the thing can survive without.</span>
      </section>

      <Purge />

      <footer className={styles.footer}>
        <span>SUBTRACTION IS ONLY USEFUL IF THE IMPORTANT THING SURVIVES.</span>
        <Link href="/instruments/">RETURN TO INSTRUMENT ROOM ↗</Link>
      </footer>
    </main>
  );
}
