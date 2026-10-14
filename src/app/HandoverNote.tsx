import styles from "./xray-follow-through.module.css";

export default function HandoverNote() {
  return (
    <section className={styles.panel} aria-labelledby="handover-title">
      <span className={styles.label}>AFTER THE BUILD / THE MACHINE PASSPORT™</span>
      <h2 id="handover-title">The machine stays. The responsibilities should be clear.</h2>
      <p>Before commissioning a tool, we need to agree who owns it, where it runs, what it costs to keep running, and who fixes it. A prototype and a maintained service are different arrangements.</p>
      <p className={styles.note}>The Machine Passport records those decisions, dependencies, data handling and shutdown instructions. Ownership, hosting and support terms are confirmed for each engagement; this template does not set them.</p>
      <a className={styles.action} href="/machine-passport/">Open the Machine Passport ↗</a>
    </section>
  );
}
