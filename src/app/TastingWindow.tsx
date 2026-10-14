import styles from "./tasting-window.module.css";

const bites = [
  ["First Sip", "Make the first visit the start of something."],
  ["Cup to Cupboard", "Turn a café favourite into a home ritual."],
  ["Refill Clock", "Find the moment the next tin matters."],
  ["Creator → Regular", "Follow attention all the way to a second cup."],
  ["Proof, Please", "Let people taste what the quality words mean."],
  ["Another Store", "Repeat the feeling, not just the floor plan."],
] as const;

export default function TastingWindow() {
  return (
    <div className={styles.window} aria-labelledby="tasting-window-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.label}>ONE BUSINESS. A WHOLE MENU OF POSSIBILITIES.</p>
          <h3 id="tasting-window-title">What are you hungry for?</h3>
          <p className={styles.intro}>Imagine a sushi store of instruments made for your business. Small bites. Specific questions. Something you actually want to try.</p>
        </div>
        <span className={styles.seal}>12 BITES<br />PICK YOUR<br />FIRST THREE</span>
      </div>
      <div className={styles.bites}>
        {bites.map(([name, line], index) => (
          <a key={name} href="/tasting-menu/index.html#menu" className={styles.bite}>
            <div className={styles.tray}><span className={styles.number}>0{index + 1}</span><span className={styles.roll} aria-hidden="true" /></div>
            <strong>{name}</strong><p>{line}</p>
          </a>
        ))}
      </div>
      <div className={styles.bottom}>
        <p>A complete shop window for a fictional matcha business. Explore twelve proposals, taste a working example, and assemble your own box.</p>
        <a className={styles.enter} href="/tasting-menu/index.html">Enter the tasting menu ↗</a>
      </div>
      <a className={styles.cabinet} href="/cabinet/">Explore the ctrl+love instrument cabinet ↗</a>
    </div>
  );
}
