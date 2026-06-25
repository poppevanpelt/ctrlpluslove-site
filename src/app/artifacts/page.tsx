import Link from "next/link";

export const metadata = {
title: "The Artifact Registry — ctrl+love",
};

const artifacts = [
{
code: "Artifact 001",
name: "Franz's Steel Ball",
line: "One throw. Permanent residency.",
status: "Replica available.",
availability: "In stock",
},
{
code: "Artifact 002",
name: "Lee's Flip-Flops",
line: "A secret weapon during reviews.",
status: "Replica available.",
availability: "In stock",
},
{
code: "Artifact 003",
name: "Oscar's Fruit Sando",
line: "Best consumed within 15 minutes.",
status: "No replicas. Ever.",
availability: "Low stock",
},
{
code: "Artifact 004",
name: "Poppe's Windowsill",
line: "Four objects. An entire biography.",
status: "No replicas. Ever.",
availability: "In stock",
},
{
code: "Artifact 005",
name: "World's Smallest Artwork",
line: "Some things become larger when you get closer.",
status: "One-of-a-kind.",
availability: "Out of stock",
},
{
code: "Artifact 006",
name: "Department of Reality Preservation",
line: "Filed before it was needed.",
status: "No replicas. Ever.",
availability: "In stock",
},
];

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

        <p>Artifacts from a life in service of Reality.</p>
      </section>

      <section className="museum-grid">
        {artifacts.map((artifact) => (
          <article className="museum-card" key={artifact.code}>
            <div className="artifact-image-placeholder">
              <div className="artifact-badge">
                {artifact.availability}
              </div>
            </div>

            <p className="museum-price">{artifact.code}</p>

            <h2>{artifact.name}</h2>

            <p className="museum-line">
              {artifact.line}
            </p>

            <p className="museum-note">
              {artifact.status}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
