import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  allRoomPersonas,
  getRoomPersona,
  getRoomPersonaNeighbors,
} from "../../room-personas-data";
import { absoluteUrl } from "../../seo";
import { ThemeToggle } from "../../theme-toggle";

type SyntheticPersonaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return allRoomPersonas.map((persona) => ({
    id: persona.id,
  }));
}

export async function generateMetadata({
  params,
}: SyntheticPersonaPageProps): Promise<Metadata> {
  const { id } = await params;
  const persona = getRoomPersona(id);

  if (!persona) {
    return {
      title: "Synthetic perspective not found — ctrl+love",
    };
  }

  const description = `${persona.name} applies ${persona.role.toLowerCase()} inside the ctrl+love Room.`;

  return {
    title: `${persona.name} — synthetic perspective — ctrl+love`,
    description,
    alternates: {
      canonical: absoluteUrl(`/room/${persona.id}/`),
    },
    openGraph: {
      title: `${persona.name} — synthetic perspective — ctrl+love`,
      description,
      url: absoluteUrl(`/room/${persona.id}/`),
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${persona.name} — synthetic perspective — ctrl+love`,
      description,
    },
  };
}

export default async function SyntheticPersonaPage({
  params,
}: SyntheticPersonaPageProps) {
  const { id } = await params;
  const persona = getRoomPersona(id);

  if (!persona) {
    notFound();
  }

  const { previous, next } = getRoomPersonaNeighbors(persona.id);
  const worksWith = allRoomPersonas
    .filter((candidate) => candidate.id !== persona.id)
    .slice(0, 3);

  return (
    <main className="site-shell ambassador-detail-page synthetic-detail-page">
      <ThemeToggle />

      <section className="content-section ambassador-detail-section">
        <div className="content-block ambassador-detail-block">
          <div className="ambassador-detail-backlinks" aria-label="Profile navigation">
            <Link className="back-home-link" href="/">
              ← Home
            </Link>
            <Link className="back-home-link" href="/room/">
              The Room
            </Link>
          </div>

          <section className="ambassador-detail-hero" aria-labelledby="synthetic-profile-title">
            <div className="ambassador-detail-city" aria-hidden="true">
              Synthetic
            </div>

            <div className="ambassador-detail-copy">
              <p className="section-kicker">Synthetic Perspective</p>
              <h1 id="synthetic-profile-title">{persona.name}</h1>
              <p className="ambassador-detail-role">
                Permanently inside The Room / {persona.role}
              </p>
              <p className="ambassador-detail-perspective">
                {persona.line}
              </p>
            </div>

            <div className="ambassador-detail-media">
              <div
                className="synthetic-detail-portrait"
                aria-label={`Synthetic portrait for ${persona.name}`}
              >
                <span>{persona.name.slice(0, 2)}</span>
              </div>
            </div>
          </section>

          <section className="ambassador-detail-panel" aria-labelledby="synthetic-function-title">
            <dl className="ambassador-detail-facts">
              <div>
                <dt>Model</dt>
                <dd>Synthetic perspective</dd>
              </div>
              <div>
                <dt>Function</dt>
                <dd>{persona.role}</dd>
              </div>
              <div>
                <dt>Primary pressure</dt>
                <dd>{persona.line}</dd>
              </div>
              <div>
                <dt>Works with</dt>
                <dd>{worksWith.map((candidate) => candidate.name).join(", ")}</dd>
              </div>
            </dl>

            <div className="ambassador-detail-story">
              <div>
                <h2 id="synthetic-function-title">What it protects</h2>
                <ul>
                  <li>Decisions that have become too comfortable.</li>
                  <li>Questions that are trying to become answers too early.</li>
                  <li>Rooms where confidence is moving faster than evidence.</li>
                </ul>
              </div>

              <blockquote className="ambassador-detail-quote">
                <p>{persona.line}</p>
              </blockquote>

              <div className="ambassador-detail-bio">
                <h2>In the Room</h2>
                <p>
                  {persona.contribution ??
                    `${persona.name} applies ${persona.role.toLowerCase()} whenever the decision needs that pressure.`}
                </p>
                <Link className="ambassador-detail-link" href="/room/">
                  Meet the full Room →
                </Link>
              </div>
            </div>
          </section>

          <nav className="ambassador-detail-nav" aria-label="Synthetic profile navigation">
            {previous ? (
              <Link href={`/room/${previous.id}/`}>
                <span>Previous</span>
                <strong>{previous.name}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/room/${next.id}/`}>
                <span>Next</span>
                <strong>{next.name}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>
    </main>
  );
}
