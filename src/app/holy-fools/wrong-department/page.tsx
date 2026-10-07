import type { Metadata } from "next";
import styles from "../holy-fools.module.css";
export const metadata: Metadata={title:"WRONG DEPARTMENT™ — Holy Fools × ctrl+love"};
export default function Page(){return <main className={styles.page} id="main-content">
<div className={styles.top}><a href="/holy-fools">← Tool room</a><span className={styles.stamp}><i className={styles.dot}/>WRONG DEPARTMENT™</span></div>
<section className={styles.instrumentHero}><div className={styles.eyebrow}>HOLY FOOLS / WRONG DEPARTMENT™</div><h1>Ask the wrong people. Find unexpected makers, directors and disciplines for the job.</h1></section>
<section className={styles.work}><div className={styles.prompt}><label htmlFor="thing">The thing</label><textarea id="thing" placeholder="Paste the job, brief or problem." /><button className={styles.button} disabled>Run instrument — prototype wiring next</button></div><div className={styles.result}><small>THE WRONG DOOR</small><h2>People outside the obvious category who may see the problem more clearly than the usual suspects.</h2><p>This room is intentionally visible before the engine is fully wired. The point is to expose the instrument, not hide it in a deck.</p></div></section>
<footer className={styles.footer}><span>Holy Fools × ctrl+love</span><span>Built while working.</span></footer>
</main>}