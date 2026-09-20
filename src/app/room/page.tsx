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
import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = routeMetadata("/room/");

const homepagePersonaIdSet = new Set<string>(homepagePersonaIds);
const additionalRoomPersonas = supportingRoomPersonas.filter(
  (persona) => !homepagePersonaIdSet.has(persona.id),
);

export default function RoomPage() {
  return (
    <main className="site-shell room-page">
      <ThemeToggle />

      <section className="content-section room-directory-section">
        <div className="content-block room-directory-block">
          <div className="page-backlinks">
            <Link className="back-home-link" href="/">
              ← Home
            </Link>
          </div>

          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">The Room</p>
              <h1>The perspectives invited before a decision hardens.</h1>
            </div>
            <p>
              The Room is not one voice pretending to be certainty. It is a set
              of distinct lenses that pressure the decision from different
              angles.
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
                  These participants enter only when their perspective is
                  relevant.
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
              Every decision gets the perspectives it actually needs.
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
