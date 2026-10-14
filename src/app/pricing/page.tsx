import Image from "next/image";
import Link from "next/link";

import { routeMetadata } from "../seo";
import ContactChoice from "../ContactChoice";
import styles from "../xray-follow-through.module.css";

const pricingDocuments = [
  {
    name: "Decision Stress-Test™",
    href: "/pricing/decision-stress-test/",
    src: "/pricing/decision-stress-test.webp",
    line: "One important decision before you commit money, time or reputation.",
  },
  {
    name: "On-Call Room™",
    href: "/pricing/on-call-room/",
    src: "/pricing/on-call-room.webp",
    line: "Recurring support for teams and leaders making ongoing decisions.",
  },
  {
    name: "Kill or Scale™",
    href: "/pricing/kill-or-scale/",
    src: "/pricing/kill-or-scale.webp",
    line: "An initiative already underway: decide whether to stop, reshape or accelerate.",
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
            <h1 className="section-title">What kind of decision are we dealing with?</h1>
            <p>
              Pick the pressure that fits the decision. If none of these fit,
              we probably need a stranger room.
            </p>
          </div>

          <section className={styles.panel} aria-labelledby="room-key-title">
            <span className={styles.label}>THE ROOM KEY™</span>
            <h2 id="room-key-title">Start with the decision. We will find the room.</h2>
            <p>One decision before committing? Decision Stress-Test. Ongoing decisions? On-Call Room. Something already underway that needs a verdict? Kill or Scale.</p>
            <p className={styles.note}>Not sure? Answer three questions for a suggested fit and the reason behind it. Mixed answers lead to a conversation.</p>
            <a className={styles.action} href="https://ctrl-love-room-key.lovable.app/">Find a suggested fit ↗</a>
          </section>

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
                  <small>{document.line}</small>
                </a>
              </article>
            ))}
          </div>

          <section className={styles.panel} aria-labelledby="contact-choice-title"><h2 id="contact-choice-title">Two ways to start.</h2><ContactChoice /></section>
        </div>
      </section>
    </main>
  );
}
