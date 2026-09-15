import styles from "./earthrise-moment.module.css";

export function EarthriseMoment() {
  return (
    <section className={styles.section} aria-label="Earthrise perspective shift">
      <div className={styles.meta}>
        <span>12 — PLATE 118 / FAR FIELD</span>
        <span>SCALE CORRECTION</span>
      </div>

      <div className={styles.copy}>
        <p>WHEN THE ROOM IS FINALLY UNDERSTOOD,</p>
        <p>PERSPECTIVE CHANGES.</p>
      </div>

      <div className={styles.scene} aria-hidden="true">
        <div className={styles.stars} />
        <div className={styles.earthWrap}>
          <div className={styles.earth}>
            <span className={styles.cloudOne} />
            <span className={styles.cloudTwo} />
            <span className={styles.cloudThree} />
          </div>
          <span className={styles.halo} />
          <span className={styles.core} />
          <span className={styles.streak} />
          <span className={`${styles.ghost} ${styles.ghostOne}`} />
          <span className={`${styles.ghost} ${styles.ghostTwo}`} />
        </div>
        <div className={styles.moon} />
      </div>

      <div className={styles.endline}>
        <strong>READY WHEN TRUE.</strong>
        <span>ROOM · READ &nbsp; SYSTEM · ASSEMBLED &nbsp; SCALE · CORRECTED</span>
      </div>
    </section>
  );
}
