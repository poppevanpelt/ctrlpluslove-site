import Link from "next/link";

export const metadata = {
  title: "Museum Shop — ctrl+love",
};

const artifacts = [
  {
    price: "€39",
    name: "Cybertruck Steel Ball",
    line: "Reality always gets a turn.",
  },
  {
    price: "€89",
    name: "Lee's Flip-Flops",
    line: "Creative authority. No socks.",
  },
  {
    price: "€149",
    name: "The Fax Machine",
    line: "Contains none of your ideas.",
  },
  {
    price: "€29",
    name: "The Giant IKEA Eraser",
    line: "For removing marketing.",
  },
  {
    price: "€19",
    name: "Reality Preservation Mug",
    line: "Keeps coffee warm. Keeps bullshit cold.",
  },
  {
    price: "€49",
    name: "The Room Bell",
    line: "Ring before presenting.",
  },
];

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
      </section>

      <section className="museum-grid">
        {artifacts.map((artifact) => (
          <article className="museum-card" key={artifact.name}>
            <p className="museum-price">{artifact.price}</p>

            <h2>{artifact.name}</h2>

            <p className="museum-line">
              {artifact.line}
            </p>

            <a
              href={`mailto:hello@ctrlpluslove.com?subject=${encodeURIComponent(
                artifact.name
              )}`}
            >
              Request artifact →
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
