import Link from "next/link";

const rooms = [
  {
    name: "Decision Stress-Test™",
    price: "€5,000",
    detail: "One-off · ex VAT",
    description: "One important decision, before money and time are committed.",
  },
  {
    name: "On-Call Room™ — Essential",
    price: "€5,000 / month",
    detail: "Monthly retainer · billed monthly",
    description: "Recurring pressure while the work keeps moving.",
  },
  {
    name: "On-Call Room™ — Founder",
    price: "€10,000 / month",
    detail: "Monthly retainer · billed monthly",
    description: "Closer access for questions that keep returning.",
  },
  {
    name: "Kill or Scale™",
    price: "From €15,000",
    detail: "One-off engagement",
    description: "Stop, reshape, or accelerate. No soft landing.",
  },
];

export const metadata = {
  title: "Rooms and pricing — ctrl+love",
  description: "Pricing is simple. But the room should fit the question.",
};

export default function PricingPage() {
  return (
    <main className="site-shell">
      <section className="content-section">
        <div className="content-block wide poster-block">
          <Link className="text-link" href="/">
            ctrl+love →
          </Link>

          <div className="ways-heading">
            <p className="section-kicker">Rooms and pricing</p>
            <h1 className="section-title">Rooms and pricing</h1>
            <p className="ways-support">
              Pricing is simple. But the room should fit the question.
            </p>
          </div>

          <div className="offer-grid">
            {rooms.map((room) => (
              <article className="offer-block" key={room.name}>
                <h2>{room.name}</h2>
                <p className="muted">{room.description}</p>
                <p className="offer-price">
                  <strong>{room.price}</strong>
                  <span>{room.detail}</span>
                </p>
              </article>
            ))}
          </div>

          <a
            className="text-link"
            href="mailto:hello@ctrlpluslove.com?subject=Find%20the%20right%20room"
          >
            Find the right room →
          </a>
        </div>
      </section>
    </main>
  );
}
