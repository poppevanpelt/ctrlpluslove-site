import Link from "next/link";
import { routeMetadata } from "../seo";
import BrandSurvival from "./brand-survival";
import styles from "./brand-survival.module.css";

export const metadata = routeMetadata("/brand-survival/");

export default function BrandSurvivalPage() {
  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <Link href="/">ctrl+love</Link>
        <span>BRAND SURVIVAL / BATCH 001</span>
        <Link href="/instruments/">instrument room</Link>
      </header>
      <BrandSurvival />
    </main>
  );
}
