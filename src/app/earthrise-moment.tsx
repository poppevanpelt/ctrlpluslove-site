import Image from "next/image";
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
        <Image
          className={styles.earthriseImage}
          src="https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/a/AS08-14-2383_2-1.jpg?crop=faces%2Cfocalpoint&fit=clip&h=4600&w=4400"
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.imageVeil} />
        <span className={styles.flareHalo} />
        <span className={styles.flareCore} />
        <span className={styles.flareStreak} />
        <span className={`${styles.flareGhost} ${styles.flareGhostOne}`} />
        <span className={`${styles.flareGhost} ${styles.flareGhostTwo}`} />
      </div>

      <div className={styles.endline}>
        <strong>READY WHEN TRUE.</strong>
        <span>APOLLO 8 · BILL ANDERS · NASA · 24 DECEMBER 1968</span>
      </div>
    </section>
  );
}
