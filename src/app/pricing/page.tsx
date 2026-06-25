import Link from "next/link";

const rooms = [
  {
    name: "Decision Stress-Test™",
    price: "€5,000",
    cadence: "one-off · ex VAT",
    body: "One important decision, brought into the room before money and time are committed.",
    link: "/pricing/decision-stress-test.png",
  },
  {
    name: "On-Call Room™",
    price: "€5,000 / month",
    cadence: "Essential · billed monthly",
    body: "Recurring pressure while the work keeps moving. A standing room for sharper judgment.",
    link: "/pricing/on-call-room.png",
  },
  {
    name: "On-Call Room™ — Founder",
    price: "€10,000 / month",
    cadence: "Founder · billed monthly",
    body: "Closer access for founder-level questions, narrative shifts and decisions with consequence.",
    link: "/pricing/on-call-room.png",
  },
  {
    name: "Kill or Scale™",
    price: "From €15,000",
    cadence: "one-off engagement",
    body: "For ideas that need to be stopped, narrowed, reshaped or given more force.",
    link: "/pricing/kill-or-scale.png",
  },
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <Link className="museum-back" href="/">
        ctrl+love
      </Link>

      <section className="pricing-hero">
        <p className="section-kicker">Rooms and pricing</p>
        <h1>Rooms and pricing</h1>
        <p>
          Pricing is simple. But the room should fit the question.
        </p>
      </section>

      <section className="pricing-room-grid" aria-label="Rooms and pricing">
        {rooms.map((room) => (
          <article className="pricing-room-card" key={`${room.name}-${room.price}`}>
            <div>
              <h2>{room.name}</h2>
              <p>{room.body}</p>
            </div>
            <div className="pricing-room-price">
              <strong>{room.price}</strong>
              <span>{room.cadence}</span>
            </div>
            <a
              className="offer-document"
              href={room.link}
              target="_blank"
              rel="noreferrer"
            >
              View full pricing ↗
            </a>
          </article>
        ))}
      </section>

      <section className="pricing-close">
        <p>
          If the question is still forming, start there.
        </p>
        <a
          className="text-link"
          href="mailto:hello@ctrlpluslove.com?subject=Finding%20the%20right%20room"
        >
          Find the right room →
        </a>
      </section>
    </main>
  );
}
