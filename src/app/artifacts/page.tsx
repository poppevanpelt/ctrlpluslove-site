import Link from "next/link";

import { routeMetadata } from "../seo";

export const metadata = routeMetadata("/artifacts/");

const artifacts = [
  {
    code: "Artifact 001",
    name: "Franz's Steel Ball",
    line: "One throw. Permanent residency.",
    status: "Replica available.",
    price: "EUR 29,00",
    availability: "In stock",
    href: "/steel-ball/",
  },
  {
    code: "Artifact 002",
    name: "Lee's Flip-Flops",
    line: "A secret weapon during reviews.",
    status: "Replica available.",
    price: "EUR 19,00",
    availability: "In stock",
  },
  {
    code: "Artifact 003",
    name: "Oscar's Fruit Sando",
    line: "Best consumed within 15 minutes.",
    status: "No replicas. Ever.",
    price: "Archive only",
    availability: "Archived",
  },
  {
    code: "Artifact 004",
    name: "Poppe's Windowsill",
    line: "Four objects. An entire biography.",
    status: "No replicas. Ever.",
    price: "Archive only",
    availability: "Archived",
  },
  {
    code: "Artifact 005",
    name: "World's Smallest Artwork",
    line: "Some things become larger when you get closer.",
    status: "One-of-a-kind.",
    price: "Archive only",
    availability: "Archived",
  },
  {
    code: "Artifact 006",
    name: "Department of Reality Preservation",
    line: "Filed before it was needed.",
    status: "Filed object.",
    price: "Archive only",
    availability: "Filed",
    href: "/reality/",
  },
];

function requestHref(name: string) {
  return `mailto:hello@ctrlpluslove.com?subject=${encodeURIComponent(`Artifact request: ${name}`)}`;
}

export default function ArtifactsPage() {
  return (
    <main className="museum-page">
      <Link className="museum-back" href="/">
        ctrl+love
      </Link>

      <section className="museum-hero">
        <p className="section-kicker">The Artifact Registry</p>

        <h1>
          Ordinary objects.
          <br />
          Extraordinary memories.
        </h1>

        <p>Objects from the ctrl+love archive. Some can be owned. Some can only be witnessed.</p>
      </section>

      <section className="museum-grid">
        {artifacts.map((artifact) => (
          <article className="museum-card artifact-card" key={artifact.code}>
            <div className="artifact-image-placeholder">
              <div className="artifact-badge">{artifact.availability}</div>
            </div>

            <div className="artifact-card-copy">
              <p className="museum-price">{artifact.code}</p>
              <h2>{artifact.name}</h2>
              <p className="museum-line">{artifact.line}</p>
              <p className="museum-note">{artifact.status}</p>

              <div className="artifact-purchase-row">
                <strong>{artifact.price}</strong>

                {artifact.href ? (
                  <Link href={artifact.href}>View object</Link>
                ) : artifact.availability === "In stock" ? (
                  <a href={requestHref(artifact.name)}>Request object</a>
                ) : (
                  <a href={requestHref(artifact.name)}>Ask about this artifact</a>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
