import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../swat.module.css";
import { getSwatMission, swatMissions } from "../../missions-data";

type MissionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return swatMissions.map((mission) => ({ slug: mission.slug }));
}

export async function generateMetadata({ params }: MissionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const mission = getSwatMission(slug);

  if (!mission) {
    return { title: "Mission not found | CTRL+SWAT" };
  }

  return {
    title: `Mission ${mission.number}: ${mission.client} | CTRL+SWAT`,
    description: `${mission.judgment} ${mission.latency} from detection to inbox.`,
  };
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { slug } = await params;
  const mission = getSwatMission(slug);

  if (!mission) notFound();

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.topbar}>
        <Link href="/swat/" className={styles.brand}>CTRL+SWAT</Link>
        <span className={styles.serial}>FIELD REPORT / MISSION {mission.number}</span>
        <span className={styles.status}>{mission.status}</span>
      </header>

      <section className={styles.reportHero}>
        <div className={styles.reportHeroCopy}>
          <p className={styles.kicker}>MISSION {mission.number} / {mission.date}</p>
          <h1>{mission.client}</h1>
          <p>{mission.judgment}</p>
        </div>
        <aside className={styles.reportStamp}>
          <span>SIGNAL-TO-INBOX</span>
          <strong>{mission.latency}</strong>
          <span>{mission.status}</span>
          <small>{mission.latencyNote}</small>
        </aside>
      </section>

      <section className={styles.evidenceGrid} aria-label="Mission evidence">
        <article className={styles.evidenceBlock}>
          <p className={styles.kicker}>01 / TRIGGER / OBSERVED</p>
          <h2>A live story names the target.</h2>
          <p>{mission.trigger}</p>
          <a href={mission.sourceUrl} target="_blank" rel="noreferrer">OPEN SOURCE ↗</a>
        </article>

        <article className={styles.evidenceBlock}>
          <p className={styles.kicker}>02 / JUDGMENT / INFERRED</p>
          <h2>{mission.judgment}</h2>
          <p>The story describes pressure. SWAT asks what choices that pressure creates, and what can be made before the moment goes cold.</p>
        </article>

        <article className={styles.evidenceBlock}>
          <p className={styles.kicker}>03 / ARTIFACT / TESTED</p>
          <h2>A headline becomes a decision object.</h2>
          <p>{mission.artifact}</p>
        </article>

        <article className={styles.evidenceBlock}>
          <p className={styles.kicker}>04 / TARGET / PROVEN</p>
          <h2>{mission.target}</h2>
          <p>The intervention only counts once it leaves the workshop and reaches a real person who can do something with it.</p>
        </article>
      </section>

      <section className={styles.timeline}>
        <p className={styles.kicker}>MISSION CHAIN</p>
        <div className={styles.timelineGrid}>
          {mission.steps.map((step, index) => (
            <article key={step.label}>
              <span>0{index + 1}</span>
              <h3>{step.label}</h3>
              <p>{step.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.reportEnd}>
        <p>If it takes too long, it isn&apos;t SWAT.</p>
        <Link href="/swat/">RETURN TO CTRL+SWAT ↗</Link>
      </section>

      <footer className={styles.footer}>
        <p>CTRL+SWAT / RAPID INTERVENTION FOR LIVE SITUATIONS</p>
        <Link href="/">CTRL+LOVE ↗</Link>
      </footer>
    </main>
  );
}
