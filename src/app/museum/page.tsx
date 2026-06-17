import Link from "next/link";

export const metadata = {
  title: "Museum Shop — ctrl+love",
};

const artifacts = [
  {
    price: "€39",
    name: "Cybertruck Steel Ball",
    line: "Reality always gets a turn.",
    object: "steel-ball",
  },
  {
    price: "€89",
    name: "Lee's Flip-Flops",
    line: "Creative authority. No socks.",
    object: "flip-flops",
  },
  {
    price: "€149",
    name: "The Fax Machine",
    line: "Contains none of your ideas.",
    object: "fax-machine",
  },
  {
    price: "€29",
    name: "The Giant IKEA Eraser",
    line: "For removing marketing.",
    object: "eraser",
  },
  {
    price: "€19",
    name: "Reality Preservation Mug",
    line: "Keeps coffee warm. Keeps bullshit cold.",
    object: "mug",
  },
];

function ArtifactObject({ object, name }: { object: string; name: string }) {
  return (
    <div className={`museum-object museum-object-${object}`} aria-label={name}>
      <span />
      <span />
      <span />
    </div>
  );
}

export default function MuseumPage() {
  return (
    <main className="museum-page">
      <Link className="museum-back" href="/">
        ctrl+love
      </Link>

      <section className="museum-hero">
        <p className="section-kicker">Museum Shop</p>

        <h1>
          We don&apos;t sell products.
          <br />
          We sell evidence.
        </h1>

        <p>
          Replicas of tiny moments when reality interrupted the room.
        </p>

        <p className="museum-intro">
          A shop for people who know the meeting went wrong before the slide
          changed.
        </p>
      </section>

      <section className="museum-grid">
        {artifacts.map((artifact) => (
          <article className="museum-card" key={artifact.name}>
            <div className="museum-case">
              <ArtifactObject object={artifact.object} name={artifact.name} />
            </div>

            <div className="museum-card-copy">
              <div className="museum-card-heading">
                <h2>{artifact.name}</h2>
                <p className="museum-price">{artifact.price}</p>
              </div>

              <p className="museum-line">{artifact.line}</p>

              <a
                href={`mailto:hello@ctrlpluslove.com?subject=${encodeURIComponent(
                  artifact.name
                )}`}
              >
                Request artifact →
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
