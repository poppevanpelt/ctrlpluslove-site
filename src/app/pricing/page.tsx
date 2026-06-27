import Image from "next/image";
import Link from "next/link";

const pricingDocuments = [
  {
    name: "Decision Stress-Test™",
    src: "/pricing/decision-stress-test.png?v=20260626-prices",
  },
  {
    name: "On-Call Room™",
    src: "/pricing/on-call-room.png?v=20260626-prices",
  },
  {
    name: "Kill or Scale™",
    src: "/pricing/kill-or-scale.png?v=20260626-prices",
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
          <Link className="text-link pricing-home-link" href="/">
            <Image
              src="/favicon.png"
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
            />
            <span>ctrl+love →</span>
          </Link>

          <div className="ways-heading">
            <p className="section-kicker">Rooms and pricing</p>
            <h1 className="section-title">Rooms and pricing</h1>
          </div>

          <div className="pricing-document-grid" aria-label="Pricing documents">
            {pricingDocuments.map((document) => (
              <article className="pricing-document-card" key={document.name}>
                <a
                  className="text-link"
                  href={document.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${document.name} pricing document`}
                >
                  <Image
                    src={document.src}
                    alt={`${document.name} pricing document`}
                    width={1536}
                    height={1024}
                    priority={document.name === "Decision Stress-Test™"}
                    sizes="(max-width: 900px) 33vw, 28vw"
                  />
                  <span>{document.name} ↗</span>
                </a>
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
