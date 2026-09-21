import type { Metadata } from "next";
import Link from "next/link";

import { routeMetadata } from "../../seo";

export const metadata: Metadata = routeMetadata("/pricing/on-call-room/");

export default function OnCallRoomPricingPage() {
  return (
    <main className="site-shell">
      <section className="content-section">
        <div className="content-block wide poster-block">
          <Link className="text-link pricing-home-link" href="/pricing/">
            <span>← Pricing</span>
          </Link>

          <div className="ways-heading">
            <p className="section-kicker">Pricing · On-Call Room™</p>
            <h1 className="section-title">Your decision team. On call.</h1>
            <p>
              Recurring pressure. Real-time clarity. The Room stays close enough to use when the decision arrives.
            </p>
          </div>

          <div className="on-call-pricing-grid">
            <article className="on-call-price-card">
              <span className="section-kicker">Essential</span>
              <h2>For teams that need a trusted decision partner.</h2>
              <strong>€7,500</strong>
              <small>PER MONTH · EX VAT</small>
              <p>
                Direct access to the Room, fast response, real-time pressure testing,
                continuity and context across recurring decisions.
              </p>
            </article>

            <article className="on-call-price-card">
              <span className="section-kicker">Founder</span>
              <h2>For founders and leaders making high-consequence decisions.</h2>
              <strong>€12,500</strong>
              <small>PER MONTH · EX VAT</small>
              <p>
                Everything in Essential, with higher access, deeper challenge,
                founder-level sparring and more proactive support.
              </p>
            </article>
          </div>

          <a
            className="text-link"
            href="mailto:hello@ctrlpluslove.com?subject=On-Call%20Room"
          >
            Bring us the decision →
          </a>
        </div>
      </section>
    </main>
  );
}
