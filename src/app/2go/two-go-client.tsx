"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./two-go.module.css";

type Order = "DECIDE 2GO" | "WATCH 2GO" | "TEST 2GO" | "NO IDEA";
type Extra = "NO THANKS" | "YES PLEASE" | "MAKE IT A MENU";

export default function TwoGoClient() {
  const [problem, setProblem] = useState("");
  const [order, setOrder] = useState<Order>("NO IDEA");
  const [extra, setExtra] = useState<Extra>("YES PLEASE");
  const [receipt, setReceipt] = useState(false);

  const message = useMemo(() => [
    "Hi Poppe. I just drove through ctrl+2go.",
    "",
    "PROBLEM",
    problem || "I will explain at the window.",
    "",
    "LIKELY ORDER",
    order,
    "",
    "EXTRA SOLUTIONS",
    extra
  ].join("\n"), [problem, order, extra]);

  const whatsapp = `https://wa.me/31625279867?text=${encodeURIComponent(message)}`;

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span className={styles.slash}>/</span>
        <strong>ctrl+2go</strong>
        <nav><a href="#menu">MENU</a><a href="#order">ORDER</a></nav>
      </header>

      <section className={styles.hero}>
        <img src="/2go-assets/hero.webp" alt="ctrl+2go drive-through at night in the rain" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p>APPLIED AI. TAKEAWAY SIZE.</p>
          <h1>What can I get you, guys?</h1>
          <p className={styles.lead}><strong>A few days of us. A useful little machine that stays.</strong><br/>One real problem in. One purpose-built system out.</p>
          <a href="#order" className={styles.cta}>ORDER 2GO →</a>
        </div>
        <span className={styles.smallFood}>SMALL FOOD<br/>BIG DAYS</span>
      </section>

      <section className={styles.world}>
        <figure><img src="/2go-assets/handoff.webp" alt="ctrl+2go order handoff at the pickup window" /><figcaption>GOOD STUFF ON THE WAY.</figcaption></figure>
        <figure><img src="/2go-assets/speaker.webp" alt="ctrl+2go order speaker in the rain" /><figcaption>TALK TO US.</figcaption></figure>
        <figure><img src="/2go-assets/extras.webp" alt="ctrl+2go extra solutions" /><figcaption>CLEAR. DOUBT. NOPE. MAYBE. YES.</figcaption></figure>
        <figure><img src="/2go-assets/hero.webp" alt="ctrl+2go drive-through" /><figcaption>CONSULTANTS LEFT ON PREMISES — 0.</figcaption></figure>
      </section>

      <section className={styles.extraGrid}>
        <div className={styles.extraCopy}>
          <p>NEXT WINDOW</p>
          <h2>Do you want extra solutions with that?</h2>
          <span>SUPERSIZE MY PROBLEM — ABSOLUTELY NOT.</span>
        </div>
        <img src="/2go-assets/extras.webp" alt="ctrl+2go extra solutions on a wet stainless counter" />
      </section>

      <section className={styles.menu} id="menu">
        <article><span>01</span><h2>DECIDE<br/>2GO</h2><p>One stubborn decision turned into a working decision instrument.</p><b>THE DECISION SYSTEM STAYS.</b></article>
        <article><span>02</span><h2>WATCH<br/>2GO</h2><p>One behaviour worth watching. Where people disappear. Where money leaks out.</p><b>THE MONITOR STAYS.</b></article>
        <article><span>03</span><h2>TEST<br/>2GO</h2><p>One thing you are about to spend real money on, hurt early.</p><b>THE TEST RIG STAYS.</b></article>
      </section>

      <section className={styles.statement}>
        <p>Most problems don’t need another transformation programme.</p>
        <h2>Sometimes one thing just needs fixing.</h2>
      </section>

      <section className={styles.order} id="order">
        <div className={styles.orderIntro}>
          <p>ORDER STATION 01</p>
          <h2>What’s holding you up?</h2>
          <p>Describe it badly. The real version is more useful than the polished one.</p>
        </div>
        <div className={styles.orderForm}>
          <textarea value={problem} onChange={e => setProblem(e.target.value)} placeholder="People keep…" />
          <div className={styles.choices}>
            {(["DECIDE 2GO","WATCH 2GO","TEST 2GO","NO IDEA"] as Order[]).map(v => <button key={v} type="button" onClick={() => setOrder(v)} className={order===v ? styles.selected : ""}>{v}</button>)}
          </div>
          <p className={styles.question}>Do you want extra solutions with that?</p>
          <div className={styles.choices}>
            {(["NO THANKS","YES PLEASE","MAKE IT A MENU"] as Extra[]).map(v => <button key={v} type="button" onClick={() => setExtra(v)} className={extra===v ? styles.selected : ""}>{v}</button>)}
          </div>
          <button type="button" className={styles.print} onClick={() => setReceipt(true)}>PULL FORWARD →</button>
        </div>

        {receipt && <div className={styles.receipt}>
          <div className={styles.receiptTop}><b>CTRL+2GO</b><span>ORDER #2GO</span></div>
          <hr/>
          <p><span>PROBLEM</span><b>{problem || "TELL US AT THE WINDOW"}</b></p>
          <p><span>LIKELY ORDER</span><b>{order}</b></p>
          <p><span>EXTRA SOLUTIONS</span><b>{extra}</b></p>
          <hr/>
          <p><span>CONSULTANTS LEFT ON PREMISES</span><b>0</b></p>
          <p><span>SYSTEMS LEFT BEHIND</span><b>1+</b></p>
          <hr/>
          <a href={whatsapp} target="_blank" rel="noreferrer">SEND MY ORDER ON WHATSAPP →</a>
        </div>}
      </section>

      <section className={styles.closer}>
        <p>CONSULTANCY THAT ENDS WITH LESS CONSULTANCY.</p>
        <h2>Thank you.<br/>Please keep the machine.</h2>
      </section>

      <footer className={styles.footer}>
        <b>ctrl+2go</b>
        <span>A few days of us. A useful little machine that stays.</span>
        <Link href="/">ctrl+love ↗</Link>
      </footer>
    </main>
  );
}