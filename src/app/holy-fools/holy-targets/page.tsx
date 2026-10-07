import type { Metadata } from "next";
import styles from "../holy-fools.module.css";
export const metadata: Metadata={title:"HOLY TARGETS — Holy Fools × ctrl+love"};
export default function Page(){return <main className={styles.page} id="main-content">
<div className={styles.top}><a href="/holy-fools">← Tool room</a><span className={styles.stamp}><i className={styles.dot}/>HOLY TARGETS</span></div>
<section className={styles.instrumentHero}><div className={styles.eyebrow}>HOLY FOOLS / HOLY TARGETS</div><h1>Find the agencies, brands and briefs that actually deserve a Holy Fools approach.</h1></section>
<section className={styles.work}><div className={styles.prompt}><label htmlFor="thing">The thing</label><textarea id="thing" placeholder="Describe the kind of work you want more of." /><button className={styles.button} disabled>Run instrument — prototype wiring next</button></div><div className={styles.result}><small>THE TARGET</small><h2>Places where taste, ambition and a useful amount of trouble overlap.</h2><p>This room is intentionally visible before the engine is fully wired. The point is to expose the instrument, not hide it in a deck.</p></div></section>
<footer className={styles.footer}><span>Holy Fools × ctrl+love</span><span>Built while working.</span></footer>
</main>}