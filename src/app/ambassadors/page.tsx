import type { Metadata } from "next";
import Link from "next/link";

import { AmbassadorGrid } from "../ambassador-grid";
import { ambassadorMetrics, confirmedAmbassadors } from "../ambassadors-data";
import { routeMetadata } from "../seo";
import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = routeMetadata("/ambassadors/");

export default function AmbassadorsPage() {
  return (
    <main className="site-shell ambassadors-page">
      <ThemeToggle />

      <section className="content-section ambassador-directory-section">
        <div className="content-block ambassador-directory-block">
          <div className="page-backlinks">
            <Link className="back-home-link" href="/">
              ← Home
            </Link>
            <Link className="back-home-link" href="/room-runner/">
              Live Room
            </Link>
          </div>

          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">Around the Table</p>
              <h1>A distributed human network for better rooms.</h1>
            </div>
            <p>
              The current public network of people ctrl+love can bring into
              the Room.
            </p>
          </div>

          <div className="ambassador-metrics" aria-label="Around the Table metrics">
            {ambassadorMetrics.map(([label, value]) => (
              <div className="ambassador-metric" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <AmbassadorGrid ambassadors={confirmedAmbassadors} />

          <section className="ambassador-closing" aria-labelledby="ambassador-closing-title">
            <p className="section-kicker">The Room changes with the question</p>
            <h2 id="ambassador-closing-title">
              Bring in the people the decision actually needs.
            </h2>
            <Link className="text-link" href="/room-runner/">
              Open the Live Room →
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
