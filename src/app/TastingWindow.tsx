import styles from "./tasting-window.module.css";

export default function TastingWindow() {
  return (
    <aside className={styles.compactExhibit} aria-label="Tasting menu">
      <span className={styles.compactMark} aria-hidden="true">◉</span>
      <div>
        <small>FIELD EXPERIMENT / 12 BITES</small>
        <h3>What are you hungry for?</h3>
        <p>A fictional matcha business. Twelve instruments. Pick your first three.</p>
      </div>
      <a href="/tasting-menu/index.html">Enter the tasting menu ↗</a>
    </aside>
  );
}
