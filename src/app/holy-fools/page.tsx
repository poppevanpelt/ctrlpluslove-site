import type { Metadata } from "next";
import styles from "./holy-fools.module.css";

export const metadata: Metadata = { title:"Holy Fools Tool Room — ctrl+love", description:"A small collection of working instruments made with Holy Fools." };

const tools=[
  ["01","DIRECTOR SEARCH","Find the person you didn’t know you were looking for.","/holy-fools/director-search"],
  ["02","HOLY DRIPPER","One interesting thing in. A month of useful trouble out.","/holy-fools/holy-dripper"],
  ["03","HOLY SHIT MAKER","Find the part that deserves the reaction.","/holy-fools/holy-shit-maker"],
  ["04","HOLY SHIT! LIVE","Savannah edits the meeting while the meeting is still happening.","/holy-fools/holy-shit-live"],
] as const;

export default function HolyFools(){return <main className={styles.page} id="main-content">
  <div className={styles.top}><a href="/">ctrl+love</a><span className={styles.stamp}><i className={styles.dot}/>HOLY FOOLS / TOOL ROOM</span></div>
  <section className={styles.hero}><div className={styles.eyebrow}>A SMALL COLLECTION OF WORKING INSTRUMENTS</div><h1>WHO IS TRYING TO FOOL ME?</h1><p>Some find directors. Some interrogate briefs. Some turn one good thing into twenty useful things. None of them need another presentation.</p><a className={styles.enter} href="#tools">Enter the tool room →</a><div className={styles.note}>If you’re meant to be here, someone probably sent you the link.</div></section>
  <section className={styles.grid} id="tools">{tools.map(([no,name,line,href])=><a className={styles.card} href={href} key={no}><span className={styles.cardNo}>{no} / HOLY FOOLS × CTRL+LOVE</span><h2>{name}</h2><p>{line}</p><span>Open instrument →</span></a>)}</section>
  <footer className={styles.footer}><span>Built while working. Not while planning to work.</span><span>Fools have more fun.</span></footer>
</main>}