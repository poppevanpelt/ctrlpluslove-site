import type { Metadata } from "next";
import styles from "../holy-fools.module.css";
export const metadata: Metadata={title:"WORK MATCH — Holy Fools × ctrl+love"};
export default function Page(){return <main className={styles.page} id="main-content">
<div className={styles.top}><a href="/holy-fools">← Tool room</a><span className={styles.stamp}><i className={styles.dot}/>WORK MATCH</span></div>
<section className={styles.instrumentHero}><div className={styles.eyebrow}>HOLY FOOLS / WORK MATCH</div><h1>Find work Holy Fools could credibly have made — and why.</h1></section>
<section className={styles.work}><div className={styles.prompt}><label htmlFor="thing">The thing</label><textarea id="thing" placeholder="Paste a piece of work or describe the kind of work." /><button className={styles.button} disabled>Run instrument — prototype wiring next</button></div><div className={styles.result}><small>THE MATCH</small><h2>The specific production sensibility, craft or worldview that makes the connection believable.</h2><p>This room is intentionally visible before the engine is fully wired. The point is to expose the instrument, not hide it in a deck.</p></div></section>
<footer className={styles.footer}><span>Holy Fools × ctrl+love</span><span>Built while working.</span></footer>
</main>}