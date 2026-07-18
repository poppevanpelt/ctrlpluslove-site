import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { embassies } from "@/content/embassies";
import { routeMetadata } from "../seo";
import { ThemeToggle } from "../theme-toggle";
import { EmbassyAtlas } from "./embassy-atlas";

export const metadata: Metadata = routeMetadata("/embassies/");

export default function EmbassiesPage() {
  return (
    <main className="site-shell embassy-page" id="main-content">
      <ThemeToggle />

      <section className="content-section embassy-hero-section">
        <div className="content-block embassy-hero-block">
          <div className="embassy-backlinks">
            <Link className="back-home-link" href="/">
              ← Home
            </Link>
            <Link className="back-home-link" href="/ambassadors/">
              Around the Table
            </Link>
            <Link className="back-home-link" href="/room-runner/">
              Live Room
            </Link>
          </div>

          <div className="embassy-hero-grid">
            <div>
              <p className="section-kicker">Embassy Network</p>
              <h1>Ideas don’t scale. Trusted people do.</h1>
            </div>
            <div className="embassy-hero-copy">
              <p>
                The ctrl+love Embassy Network is a growing community of creative
                leaders who help ideas arrive with local intelligence.
              </p>
              <Link className="text-link" href="/room-runner/">
                Open the Live Room →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block wide embassy-index-block">
          <EmbassyAtlas embassies={embassies} />

          <div className="embassy-card-grid" aria-label="Embassy dossiers">
            {embassies.map((embassy) => (
              <article
                className="embassy-card ctrl-layer-anchor"
                data-ctrl-note={embassy.id}
                key={embassy.id}
              >
                <Link href={`/embassies/${embassy.slug}/`}>
                  <div className="embassy-card-media">
                    <Image
                      src={embassy.portrait}
                      alt={`Portrait of ${embassy.ambassador}, ${embassy.city} Embassy ambassador`}
                      width={760}
                      height={950}
                      sizes="(max-width: 900px) 100vw, 34vw"
                    />
                  </div>
                  <div className="embassy-card-copy">
                    <p>{embassy.id}</p>
                    <h2>{embassy.city}</h2>
                    <span>{embassy.ambassador}</span>
                    <em>{embassy.status ?? "quiet"}</em>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
