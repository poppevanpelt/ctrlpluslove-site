import type { Metadata } from "next";
import styles from "../holy-fools.module.css";
export const metadata: Metadata={title:"PRODUCTION GAP™ — Holy Fools × ctrl+love"};
export default function Page(){return <main className={styles.page} id="main-content">
<div className={styles.top}><a href="/holy-fools">← Tool room</a><span className={styles.stamp}><i className={styles.dot}/>PRODUCTION GAP™</span></div>
<section className={styles.instrumentHero}><div className={styles.eyebrow}>HOLY FOOLS / PRODUCTION GAP™</div><h1>Spot where the ambition is bigger than the production answer.</h1></section>
<section className={styles.work}><div className={styles.prompt}><label htmlFor="thing">The thing</label><textarea id="thing" placeholder="Paste the idea, treatment or production plan." /><button className={styles.button} disabled>Run instrument — prototype wiring next</button></div><div className={styles.result}><small>THE GAP</small><h2>Where the creative promise is being flattened by the current production logic.</h2><p>This room is intentionally visible before the engine is fully wired. The point is to expose the instrument, not hide it in a deck.</p></div></section>
<footer className={styles.footer}><span>Holy Fools × ctrl+love</span><span>Built while working.</span></footer>
</main>}