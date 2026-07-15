import Image from "next/image";
import Link from "next/link";

import { routeMetadata } from "../seo";

const pricingDocuments = [
  {
    name: "Decision Stress-Test™",
    href: "/pricing/decision-stress-test/",
    src: "/pricing/decision-stress-test.webp",
  },
  {
    name: "On-Call Room™",
    href: "/pricing/on-call-room/",
    src: "/pricing/on-call-room.webp",
  },
  {
    name: "Kill or Scale™",
    href: "/pricing/kill-or-scale/",
    src: "/pricing/kill-or-scale.webp",
  },
];

export const metadata = routeMetadata("/pricing/");

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
                  href={document.href}
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
