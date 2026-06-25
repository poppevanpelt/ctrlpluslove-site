import Image from "next/image";
import Link from "next/link";

const pricingDocuments = [
  {
    name: "Decision Stress-Test™",
    src: "/pricing/decision-stress-test.png",
  },
  {
    name: "On-Call Room™",
    src: "/pricing/on-call-room.png",
  },
  {
    name: "Kill or Scale™",
    src: "/pricing/kill-or-scale.png",
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
          </div>

          <div style={{ display: "grid", gap: "2.4rem" }}>
            {pricingDocuments.map((document) => (
              <article style={{ display: "grid" }} key={document.name}>
                <a
                  className="text-link"
                  href={document.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${document.name} pricing document`}
                  style={{ display: "grid", gap: "0.55rem", textDecoration: "none" }}
                >
                  <Image
                    src={document.src}
                    alt={`${document.name} pricing document`}
                    width={1536}
                    height={1024}
                    priority={document.name === "Decision Stress-Test™"}
                    sizes="(max-width: 900px) 100vw, 88vw"
                    style={{ width: "100%", height: "auto" }}
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
