import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import {
  getRoomPersonaPortraitSrc,
  homepagePersonaIds,
  homepageRoomPersonas,
  supportingRoomPersonas,
} from "../room-personas-data";
import { routeMetadata } from "../seo";
import showcase from "./room-showcase.module.css";

export const metadata: Metadata = routeMetadata("/room/");

const homepagePersonaIdSet = new Set<string>(homepagePersonaIds);
const additionalRoomPersonas = supportingRoomPersonas.filter(
  (persona) => !homepagePersonaIdSet.has(persona.id),
);

const lead = homepageRoomPersonas.find((persona) => persona.id === "lexi-arden") ?? homepageRoomPersonas[0];
const leftPortrait = homepageRoomPersonas.find((persona) => persona.id === "maya-elise-harper") ?? homepageRoomPersonas[1];
const rightPortrait = homepageRoomPersonas.find((persona) => persona.id === "simon-cross") ?? homepageRoomPersonas[2];

const featurePersonas = homepageRoomPersonas.filter(
  (persona) => persona.id !== lead.id,
);

function FeatureCard({ persona, index }: { persona: (typeof homepageRoomPersonas)[number]; index: number }) {
  return (
    <Link className={showcase.featureCard} href={`/room/${persona.id}/`}>
      <span className={showcase.featureIcon}>{String(index + 1).padStart(2, "0")}</span>
      <span className={showcase.featureCopy}>
        <strong>{persona.role}</strong>
        <span>{persona.name}</span>
        <small>{persona.line}</small>
      </span>
    </Link>
  );
}

function Portrait({
  persona,
  className,
  label,
}: {
  persona: (typeof homepageRoomPersonas)[number];
  className: string;
  label: string;
}) {
  return (
    <Link
      className={`${showcase.portrait} ${className}`}
      href={`/room/${persona.id}/`}
      style={{ "--portrait-position": persona.portraitPosition } as CSSProperties}
    >
      <Image
        src={getRoomPersonaPortraitSrc(persona) ?? persona.portrait ?? ""}
        alt={persona.name}
        fill
        unoptimized
        sizes="(max-width: 980px) 70vw, 32vw"
        style={{ objectPosition: persona.portraitPosition }}
      />
      <span className={showcase.portraitLabel}>
        <b>{persona.name}</b>
        <span>{label}</span>
      </span>
    </Link>
  );
}

export default function RoomPage() {
  const leftFeatures = featurePersonas.slice(0, 5);
  const rightFeatures = featurePersonas.slice(5, 9);

  return (
    <main className="site-shell room-page">
      <nav className={showcase.nav}>
        <Link className={showcase.brand} href="/">ctrl+love</Link>
        <span className={showcase.navCenter}>The Room · human judgment before certainty</span>
        <Link className={showcase.navAction} href="/decision-collider/">Run a decision →</Link>
      </nav>

      <section className={showcase.showcase} aria-labelledby="meet-the-room">
        <div className={showcase.heading}>
          <p className={showcase.kicker}>Synthetic perspectives / real disagreement</p>
          <h1 id="meet-the-room">Meet the Room</h1>
          <strong>Not one AI pretending to be certain.</strong>
          <span>
            A deliberately small group of distinct perspectives — with memories,
            biases and reasons to disagree before your decision hardens.
          </span>
        </div>

        <div className={showcase.stage}>
          <div className={showcase.featureColumn}>
            {leftFeatures.map((persona, index) => (
              <FeatureCard persona={persona} index={index} key={persona.id} />
            ))}
          </div>

          <div className={showcase.portraitStage} aria-label="A few people in the Room">
            <Portrait persona={leftPortrait} className={showcase.portraitLeft} label={leftPortrait.role} />
            <Portrait persona={rightPortrait} className={showcase.portraitRight} label={rightPortrait.role} />
            <Portrait persona={lead} className={showcase.portraitMain} label={lead.role} />
          </div>

          <div className={showcase.featureColumn}>
            {rightFeatures.map((persona, index) => (
              <FeatureCard persona={persona} index={index + leftFeatures.length} key={persona.id} />
            ))}
          </div>
        </div>

        <div className={showcase.signalBar} aria-label="Room system">
          <span><b>10 core lenses</b>Small enough to know them.</span>
          <span><b>Designed opposition</b>Agreement is not the default.</span>
          <span><b>Evidence first</b>Observed ≠ assumed.</span>
          <span><b>One decision</b>Then the Room changes.</span>
        </div>
      </section>

      <section className="content-section room-directory-section">
        <div className="content-block room-directory-block">
          <div className={showcase.directoryIntro}>
            <div>
              <p className="section-kicker">The full room</p>
              <h2>The perspectives invited before a decision hardens.</h2>
            </div>
            <p>
              Nobody attends by default. The decision determines who enters,
              what they are there to challenge, and when their perspective has
              done enough.
            </p>
          </div>

          <div className="room-persona-list">
            {homepageRoomPersonas.map((persona, index) => (
              <article className="room-persona-profile" key={persona.id}>
                <p className="room-persona-number">
                  {String(index + 1).padStart(2, "0")}
                </p>
                {persona.portrait ? (
                  <Link
                    className="room-persona-portrait-link"
                    href={`/room/${persona.id}/`}
                    aria-label={`${persona.name} profile`}
                    style={{
                      "--portrait-position": persona.portraitPosition,
                    } as CSSProperties}
                  >
                    <Image
                      src={getRoomPersonaPortraitSrc(persona) ?? persona.portrait}
                      alt=""
                      unoptimized
                      fill
                      sizes="(max-width: 680px) 24vw, 7rem"
                    />
                  </Link>
                ) : null}
                <div>
                  <h2>
                    <Link href={`/room/${persona.id}/`}>{persona.name}</Link>
                  </h2>
                  <p className="room-persona-role">{persona.role}</p>
                </div>
                <p className="room-persona-line">{persona.line}</p>
                {persona.contribution ? (
                  <p className="room-persona-contribution">
                    {persona.contribution}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <section
            className="supporting-room-section"
            aria-labelledby="supporting-room-title"
          >
            <div className="section-heading quiet-heading">
              <div>
                <p className="section-kicker">Supporting perspectives</p>
                <h2 id="supporting-room-title">
                  They enter only when the decision earns them.
                </h2>
              </div>
            </div>

            <div className="supporting-persona-list">
              {additionalRoomPersonas.map((persona) => (
                <article className="supporting-persona" key={persona.id}>
                  {persona.portrait ? (
                    <Link
                      className="supporting-persona-portrait-link"
                      href={`/room/${persona.id}/`}
                      aria-label={`${persona.name} profile`}
                      style={{
                        "--portrait-position": persona.portraitPosition,
                      } as CSSProperties}
                    >
                      <Image
                        src={getRoomPersonaPortraitSrc(persona) ?? persona.portrait}
                        alt=""
                        unoptimized
                        fill
                        sizes="(max-width: 680px) 20vw, 5rem"
                      />
                    </Link>
                  ) : null}
                  <h3>
                    <Link href={`/room/${persona.id}/`}>{persona.name}</Link>
                  </h3>
                  <p>{persona.role}</p>
                  <strong>{persona.line}</strong>
                  {persona.contribution ? <span>{persona.contribution}</span> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="room-closing" aria-labelledby="room-closing-title">
            <p className="section-kicker">Then the decision enters</p>
            <h2 id="room-closing-title">
              The Room is useful only if somebody eventually has to decide.
            </h2>
            <Link className="text-link" href="/decision-collider/">
              Open the Decision Collider →
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
