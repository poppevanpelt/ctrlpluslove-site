import type { Metadata } from "next";
import styles from "./holy-fools.module.css";

export const metadata: Metadata = { title:"Holy Fools Tool Room — ctrl+love", description:"Ten working instruments made with Holy Fools." };

const tools=[
  ["01","DIRECTOR SEARCH","Find the person you didn’t know you were looking for.","/holy-fools/director-search"],
  ["02","HOLY DRIPPER","One interesting thing in. A month of useful trouble out.","/holy-fools/holy-dripper"],
  ["03","HOLY SHIT MAKER","Find the part that deserves the reaction.","/holy-fools/holy-shit-maker"],
  ["04","HOLY SHIT!","A weekly radar for cultural absurdities, contradictions and things worth turning into work.","/holy-fools/holy-shit"],
  ["05","WRONG DEPARTMENT™","Ask the wrong people. Find unexpected makers, directors and disciplines for the job.","/holy-fools/wrong-department"],
  ["06","HOLY TARGETS","Find the agencies, brands and briefs that actually deserve a Holy Fools approach.","/holy-fools/holy-targets"],
  ["07","PRODUCTION GAP™","Spot where the ambition is bigger than the production answer.","/holy-fools/production-gap"],
  ["08","SCOUTING LOOP","Turn signals into talent, talent into briefs, and briefs into better scouting.","/holy-fools/scouting-loop"],
  ["09","WORK MATCH","Find work Holy Fools could credibly have made — and why.","/holy-fools/work-match"],
  ["10","PRIME","Decide what to do now, prime, watch, or leave alone.","/holy-fools/prime"],
] as const;

export default function HolyFools(){return <main className={styles.page} id="main-content">
  <div className={styles.top}><a href="/">ctrl+love</a><span className={styles.stamp}><i className={styles.dot}/>HOLY FOOLS / TOOL ROOM</span></div>
  <section className={styles.hero}><div className={styles.eyebrow}>TEN WORKING INSTRUMENTS</div><h1>WHO IS TRYING TO FOOL ME?</h1><p>Some find directors. Some interrogate briefs. Some turn one good thing into twenty useful things. Some tell you to walk away. None of them need another presentation.</p><a className={styles.enter} href="#tools">Enter the tool room →</a><div className={styles.note}>If you’re meant to be here, someone probably sent you the link.</div></section>
  <section className={styles.grid} id="tools">{tools.map(([no,name,line,href])=><a className={styles.card} href={href} key={no}><span className={styles.cardNo}>{no} / HOLY FOOLS × CTRL+LOVE</span><h2>{name}</h2><p>{line}</p><span>Open instrument →</span></a>)}</section>
  <footer className={styles.footer}><span>Built while working. Not while planning to work.</span><span>Fools have more fun.</span></footer>
</main>}