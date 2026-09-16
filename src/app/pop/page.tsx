import type { Metadata } from "next";
import Link from "next/link";
import PopMachine from "./pop-machine";
import styles from "./page.module.css";
export const metadata: Metadata={title:"CTRL+POP | ctrl+love",description:"An absurdly serious ceremony for shipping something."};
export default function Page(){return <main className={styles.page}><header className={styles.topbar}><Link href="/">ctrl+love</Link><span>CEREMONY UNIT 001</span><Link href="/instruments/">INSTRUMENT ROOM →</Link></header><section className={styles.hero}><p>CTRL+POP / FACILITY CEREMONY</p><h1>SOMETHING SHIPPED.<br/>THE FACILITY ACKNOWLEDGES IT.</h1></section><PopMachine/></main>}
