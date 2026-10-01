import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AmbassadorGrid } from "../ambassador-grid";
import { ambassadorMetrics, confirmedAmbassadors } from "../ambassadors-data";
import { routeMetadata } from "../seo";
import styles from "./ambassadors-showcase.module.css";

export const metadata: Metadata = routeMetadata("/ambassadors/");

const lead = confirmedAmbassadors.find((person) => person.id === "poppe-van-pelt") ?? confirmedAmbassadors[0];
const leftPortrait = confirmedAmbassadors.find((person) => person.id === "shun-iwai") ?? confirmedAmbassadors[1];
const rightPortrait = confirmedAmbassadors.find((person) => person.id === "sung-wook-tayl-chung") ?? confirmedAmbassadors[2];

const orbit = confirmedAmbassadors.filter(
  (person) => ![lead?.id, leftPortrait?.id, rightPortrait?.id].includes(person.id),
);

function PersonCard({ person }: { person: (typeof confirmedAmbassadors)[number] }) {
  const body = (
    <>
      <span className={styles.thumb}>
        {person.image ? (
          <Image src={person.image} alt="" fill sizes="3.4rem" />
        ) : null}
      </span>
      <span className={styles.personCopy}>
        <strong>{person.name}</strong>
        <span>{person.city} · {person.country}</span>
        <small>{person.participationLabel}</small>
      </span>
    </>
  );

  return person.linkedin ? (
    <a className={styles.personCard} href={person.linkedin} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <div className={styles.personCard}>{body}</div>
  );
}

function Portrait({
  person,
  className,
}: {
  person: (typeof confirmedAmbassadors)[number];
  className: string;
}) {
  const body = (
    <>
      {person.image ? (
        <Image
          src={person.image}
          alt={person.name}
          fill
          priority={person.id === lead.id}
          sizes="(max-width: 980px) 70vw, 32vw"
        />
      ) : null}
      <span className={styles.label}>
        <b>{person.name}</b>
        <span>{person.city}</span>
      </span>
    </>
  );

  return person.linkedin ? (
    <a
      className={`${styles.portrait} ${className}`}
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
    >
      {body}
    </a>
  ) : (
    <div className={`${styles.portrait} ${className}`}>{body}</div>
  );
}

export default function AmbassadorsPage() {
  const leftRail = orbit.slice(0, 2);
  const rightRail = orbit.slice(2, 4);

  return (
    <main className="site-shell ambassadors-page">
      <nav className={styles.topbar}>
        <Link href="/">ctrl+love</Link>
        <span>Around the Table · distributed human network</span>
        <Link href="/room/">Meet the Room →</Link>
      </nav>

      <section className={styles.showcase} aria-labelledby="around-the-table-title">
        <div className={styles.heading}>
          <p className={styles.kicker}>Around the Table</p>
          <h1 id="around-the-table-title">Bring in the people the decision actually needs.</h1>
          <p>
            Not bought by the kilo. A deliberately small public network ctrl+love can
            bring into a decision when local knowledge, lived experience or an
            inconvenient perspective matters.
          </p>
        </div>

        <div className={styles.table}>
          <div className={styles.rail}>
            {leftRail.map((person) => <PersonCard person={person} key={person.id} />)}
          </div>

          <div className={styles.portraits} aria-label="People around the ctrl+love table">
            <Portrait person={leftPortrait} className={styles.leftPortrait} />
            <Portrait person={rightPortrait} className={styles.rightPortrait} />
            <Portrait person={lead} className={styles.mainPortrait} />
          </div>

          <div className={styles.rail}>
            {rightRail.map((person) => <PersonCard person={person} key={person.id} />)}
          </div>
        </div>

        <div className={styles.metrics} aria-label="Around the Table metrics">
          {ambassadorMetrics.map(([label, value]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`content-section ambassador-directory-section ${styles.directory}`}>
        <div className="content-block ambassador-directory-block">
          <div className={styles.directoryIntro}>
            <div>
              <p className="section-kicker">The full public table</p>
              <h2>People, not profiles.</h2>
            </div>
            <p>
              The decision changes who gets invited. Geography and expertise matter;
              so does the willingness to say the thing the room is quietly avoiding.
            </p>
          </div>

          <AmbassadorGrid ambassadors={confirmedAmbassadors} />

          <section className="ambassador-closing" aria-labelledby="ambassador-closing-title">
            <p className="section-kicker">The decision changes the table</p>
            <h2 id="ambassador-closing-title">
              Bring in the people the decision actually needs.
            </h2>
            <Link className="text-link" href="/instruments/">
              See the instruments they work with →
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
