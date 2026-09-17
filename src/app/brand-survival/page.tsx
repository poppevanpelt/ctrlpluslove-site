import Link from "next/link";
import { OriginSpecimen } from "../origin-specimen";
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
      <OriginSpecimen
        specimen="024"
        title="The Missing Label Experiment, 1994"
        story="Institute folklore says Prof. Dr. H. von Schmaalhauzen once removed the label from his breakfast cereal and discovered he could no longer tell which box was his, despite insisting for years that the brand was obvious. He spent the afternoon removing one cue at a time from everything in his kitchen."
        sources={[
          {
            citation:
              "Warlop, Ratneshwar & van Osselaer (2005), Distinctive brand cues and memory for product consumption experiences, International Journal of Research in Marketing 22(1), 27-44.",
            href: "https://doi.org/10.1016/j.ijresmar.2004.06.001",
            note:
              "The study examines how distinctive brand cues can become linked to consumption experiences in memory. It supports the idea that recognisable cues matter, but does not validate Brand Survival's removal curve or thresholds.",
          },
        ]}
      />
    </main>
  );
}
