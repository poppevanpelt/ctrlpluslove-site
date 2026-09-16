import type { Metadata } from "next";
import Link from "next/link";
import Chase from "./chase";
import styles from "./page.module.css";

export const metadata: Metadata = { title:"CTRL+CHASE | ctrl+love", description:"Keep following a signal until it produces evidence, a move, or earns the right to die." };
export default function Page(){return <main className={styles.page}><header className={styles.topbar}><Link href="/">ctrl+love</Link><span>INSTRUMENT 023 · PURSUIT UNIT</span><Link href="/instruments/">INSTRUMENT ROOM →</Link></header><section className={styles.hero}><p>CTRL+CHASE / FIELD PROTOTYPE</p><h1>A QUESTION EITHER PRODUCES EVIDENCE<br/>OR EARNS ITS DEATH.</h1><span>One unresolved signal. One trail. No task-manager cosplay.</span></section><Chase/></main>}
