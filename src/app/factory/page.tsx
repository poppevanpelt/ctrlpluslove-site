import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata={title:"Factory | ctrl+love",description:"The ctrl+love production line: signal to judgment to object to ship to watch."};
const items=[
  ["001","CTRL+SWAT","DISPATCHED","/swat/","Mission 001 is already in the field."],
  ["004","DECISION MEMORY","WORKING PROTOTYPE","/decision-memory/","Record the decision. Reopen it when reality answers back."],
  ["023","CTRL+CHASE","FIELD PROTOTYPE","/chase/","Follow the signal until it produces evidence, a move, or dies."],
  ["022","MARIA BENCH","EXCAVATING","/maria/","Anecdote → oddity → mechanism → principle."],
  ["POP","CTRL+POP","CEREMONY UNIT","/pop/","Something shipped. The facility acknowledges it."],
] as const;
export default function FactoryPage(){return <main className={styles.page}><header className={styles.topbar}><Link href="/">ctrl+love</Link><span>FACTORY STATUS · OPEN</span><Link href="/instruments/">INSTRUMENT ROOM →</Link></header><section className={styles.hero}><p>PRODUCTION LINE / BATCH 001</p><h1>THE FACTORY<br/>GATES ARE OPEN.</h1><span>Things arrive unfinished. The guys drag them inside. Survivors leave as working objects.</span></section><section className={styles.flow}><b>SIGNAL</b><i>→</i><b>JUDGMENT</b><i>→</i><b>OBJECT</b><i>→</i><b>SHIP</b><i>→</i><b>WATCH</b></section><section className={styles.floor}>{items.map(([no,name,state,href,line])=><Link href={href} key={name} className={styles.unit}><span>{no}</span><small>{state}</small><strong>{name}</strong><p>{line}</p><b>ENTER UNIT ↗</b></Link>)}</section></main>}
