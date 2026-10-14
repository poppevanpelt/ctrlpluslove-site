import type { Metadata } from "next";
import RefillClock from "./RefillClock";
import styles from "./refill-clock.module.css";

export const metadata: Metadata = {
  title: "Refill Clock | ctrl+love",
  description: "A small working instrument: estimate how long a tin of matcha lasts and when a refill could be useful.",
};

export default function RefillClockPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}><a href="/">ctrl+love</a><a href="/#instruments">INSTRUMENTS ↗</a></nav>
      <header className={styles.header}>
        <p className={styles.label}>SMALL QUESTION. WORKING INSTRUMENT.</p>
        <h1>Refill Clock.</h1>
        <p>The first cup gets attention. The next thirty cups build a business.</p>
      </header>
      <RefillClock />
      <div className={styles.explanation}>
        <div><h2>What it knows.</h2><p>Quantity ÷ dose ÷ daily cups = days of matcha. A 40g tin, at 2g per cup and one cup a day, lasts twenty days. The refill window subtracts a fixed three-day delivery buffer.</p></div>
        <div><h2>What it needs to learn.</h2><p>Real habits vary. Before connecting reminders, ask willing buyers about their routine and compare the estimate with their actual refill date. An estimate becomes useful when reality gets a vote.</p></div>
      </div>
      <footer className={styles.footer}><span>ctrl+love · Instruments for human judgment.</span><a href="/pricing/">Discuss an instrument for your business ↗</a></footer>
    </main>
  );
}
