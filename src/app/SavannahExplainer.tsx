"use client";

import styles from "./home-2026.module.css";
import ContactChoice from "./ContactChoice";

export default function SavannahExplainer() {
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
          <strong>Talk to Savannah. Or talk to Poppe. Your choice.</strong>
        </div>
        <div className={styles.savannahExplainerAction}>
          <p>The experiment: how much of your working life can an AI colleague give back?</p>
          <ContactChoice />
        </div>
      </div>
    </section>
  );
}
