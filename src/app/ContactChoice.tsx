"use client";

import styles from "./xray-follow-through.module.css";

export default function ContactChoice() {
  return (
    <div className={styles.grid} aria-label="Choose who to talk to">
      <article>
        <h3>Talk to Savannah</h3>
        <p className={styles.note}>Our AI colleague. Explore the work or talk through your question here.</p>
        <button className={styles.action} type="button" onClick={() => window.dispatchEvent(new Event("savannah-open"))}>Talk to Savannah ↗</button>
      </article>
      <article>
        <h3>Talk to Poppe</h3>
        <p className={styles.note}>A human conversation. Email Poppe directly; your mail app opens with the address ready.</p>
        <a className={styles.action} href="mailto:poppevanpelt@gmail.com?subject=A%20question%20for%20ctrl%2Blove">Email Poppe ↗</a>
      </article>
    </div>
  );
}
