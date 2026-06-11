export const metadata = {
  title: "The Artifact Registry — ctrl+love",
};

const artifacts = [
  {
    code: "Artifact 001",
    name: "Franz's Steel Ball",
    line: "Reality took a turn for the steel ball.",
    status: "Replica available.",
  },
  {
    code: "Artifact 002",
    name: "Lee's Flip-Flops",
    line: "A secret weapon during reviews.",
    status: "Replica available.",
  },
  {
    code: "Artifact 003",
    name: "Oscar's Fruit Sando",
    line: "A small sandwich. A disproportionate response.",
    status: "Replica unavailable.",
  },
  {
    code: "Artifact 004",
    name: "Poppe's Windowsill",
    line: "Four objects. An entire biography.",
    status: "Replica unavailable.",
  },
  {
    code: "Artifact 005",
    name: "The Smallest Artwork",
    line: "Some things become larger when you get closer.",
    status: "Replica unavailable.",
  },
  {
    code: "Artifact 006",
    name: "Department of Reality Preservation",
    line: "Filed before it was needed.",
    status: "Replica available.",
  },
];

export default function ArtifactsPage() {
  return (
    <main className="museum-page">
      <a className="museum-back" href="/">
        ctrl+love
      </a>

      <section className="museum-hero">
        <p className="section-kicker">The Artifact Registry</p>

        <h1>
          Ordinary objects.
          <br />
          Extraordinary memories.
        </h1>

        <p>A collection of things that refused to leave.</p>
      </section>

      <section className="museum-grid">
        {artifacts.map((artifact) => (
          <article className="museum-card" key={artifact.code}>
            <p className="museum-price">{artifact.code}</p>
            <h2>{artifact.name}</h2>
            <p className="museum-line">{artifact.line}</p>
            <p className="museum-note">{artifact.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
