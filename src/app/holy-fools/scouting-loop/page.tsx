import type { Metadata } from "next";
import styles from "../holy-fools.module.css";
export const metadata: Metadata={title:"SCOUTING LOOP — Holy Fools × ctrl+love"};
export default function Page(){return <main className={styles.page} id="main-content">
<div className={styles.top}><a href="/holy-fools">← Tool room</a><span className={styles.stamp}><i className={styles.dot}/>SCOUTING LOOP</span></div>
<section className={styles.instrumentHero}><div className={styles.eyebrow}>HOLY FOOLS / SCOUTING LOOP</div><h1>Turn signals into talent, talent into briefs, and briefs into better scouting.</h1></section>
<section className={styles.work}><div className={styles.prompt}><label htmlFor="thing">The thing</label><textarea id="thing" placeholder="Drop in a director, signal, job or reference." /><button className={styles.button} disabled>Run instrument — prototype wiring next</button></div><div className={styles.result}><small>THE LOOP</small><h2>New talent paths, adjacent disciplines and follow-on searches worth opening.</h2><p>This room is intentionally visible before the engine is fully wired. The point is to expose the instrument, not hide it in a deck.</p></div></section>
<footer className={styles.footer}><span>Holy Fools × ctrl+love</span><span>Built while working.</span></footer>
</main>}