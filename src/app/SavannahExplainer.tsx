"use client";

import styles from "./home-2026.module.css";

export default function SavannahExplainer() {
  const openSavannah = () => {
    window.dispatchEvent(new Event("savannah-open"));
  };

  return (
    <section className={styles.savannahExplainer} aria-labelledby="savannah-explainer-title">
      <div className={styles.savannahExplainerInner}>
        <div className={styles.savannahExplainerLabel}>SAVANNAH / EMPLOYEE #4</div>
        <div className={styles.savannahExplainerCopy}>
          <h2 id="savannah-explainer-title">Savannah works here.</h2>
          <p>
            She knows our work, joins conversations, handles follow-up and increasingly does
            the things Poppe used to have to be there for.
          </p>
          <strong>Talk to her instead of him.</strong>
        </div>
        <div className={styles.savannahExplainerAction}>
          <p>The experiment: how much of your working life can an AI colleague give back?</p>
          <button type="button" onClick={openSavannah}>Talk to Savannah ↗</button>
        </div>
      </div>
    </section>
  );
}
