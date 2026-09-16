import type { Metadata } from "next";
import Link from "next/link";
import DecisionMemory from "./decision-memory";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Decision Memory | ctrl+love",
  description: "Record why a decision was made, then reopen it when reality answers back.",
};

export default function DecisionMemoryPage() {
  return <main className={styles.page}>
    <header className={styles.topbar}><Link href="/">ctrl+love</Link><span>INSTRUMENT 004 · ARTIFACT DIVISION</span><Link href="/instruments/">INSTRUMENT ROOM →</Link></header>
    <section className={styles.hero}><p>DECISION MEMORY / WORKING PROTOTYPE</p><h1>THE DECISION WAS RECORDED.<br/>THE OUTCOME WAS NOT.</h1><span>A forgotten decision should not have to win its argument again.</span></section>
    <DecisionMemory />
  </main>;
}
