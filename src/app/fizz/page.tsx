import type { Metadata } from "next";
import Link from "next/link";
import styles from "./fizz.module.css";

export const metadata: Metadata = {
  title: "CTRL+FIZZ | Carbonated judgment",
  description: "CTRL+FIZZ. For meetings that have gone flat. Carbonated judgment by ctrl+love.",
};

const flavours = [
  ["CLEAR", "Lemon", "Same question. Fresh perspective."],
  ["DOUBT", "Grapefruit", "A little bitter goes a long way."],
  ["NOPE", "Ginger", "Sharp ideas. Clearer boundaries."],
  ["MAYBE", "Yuzu", "Complicated can still be good."],
  ["YEP", "Cola", "Someone has to decide."],
] as const;

export default function FizzPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span>PHYSICAL INSTRUMENT / BATCH 001</span>
        <span>CTRL+FIZZ</span>
      </header>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>FOR MEETINGS THAT HAVE GONE FLAT.</p>
          <h1>CTRL+<br />FIZZ</h1>
          <p className={styles.lead}>Carbonated judgment.</p>
        </div>
        <div className={styles.bottle}><div className={styles.label}><span>CTRL+</span><strong>FIZZ</strong><small>BATCH 001</small></div></div>
      </section>
      <section className={styles.manifesto}>
        <p>We live in times of screen abundance. Laptops. iPhones. Second screens. Screens in cars. Screens on fridges. Screens telling us how long we have been looking at screens.</p>
        <p>Even marriage proposals apparently need a Jumbotron now.</p>
        <h2>So we made a soda.</h2>
      </section>
      <section className={styles.flavours}>
        {flavours.map(([code, flavour, line], i) => <article key={code}><span>0{i + 1}</span><strong>{code}</strong><h3>{flavour}</h3><p>{line}</p></article>)}
      </section>
      <section className={styles.pricing}>
        <article><span>SINGLE BOTTLE</span><strong>€4.50</strong><p>One decision. One bottle.</p></article>
        <article><span>DECISION PACK</span><strong>€24</strong><p>6 bottles. One civilized disagreement.</p></article>
        <article><span>MEETING RESCUE</span><strong>12 bottles</strong><p>For rooms that should have ended 40 minutes ago.</p></article>
      </section>
      <section className={styles.collab}>
        <p className={styles.kicker}>BOTTLING PARTNER WANTED</p>
        <h2>Vrumona, or another brave carbonator: want to make this real with us?</h2>
        <a href="mailto:hello@ctrlpluslove.com?subject=CTRL%2BFIZZ%20collaboration">MAKE CONTACT ↗</a>
      </section>
      <footer className={styles.footer}><p>CTRL+FIZZ / BATCH 001 / CARBONATED JUDGMENT</p><Link href="/instruments/">BACK TO INSTRUMENT CABINET ↗</Link></footer>
    </main>
  );
}
