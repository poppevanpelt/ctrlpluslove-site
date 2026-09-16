import type { Metadata } from "next";
import Link from "next/link";
import Purge from "./purge";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "PURGE | ctrl+love",
  description:
    "A removal instrument for finding what is genuinely load-bearing. Cut the fat. Keep the organ.",
};

export default function PurgePage() {
  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <Link href="/">ctrl+love</Link>
        <span>PURGE / 001</span>
        <Link href="/instruments/">instrument room</Link>
      </header>
      <Purge />
    </main>
  );
}
