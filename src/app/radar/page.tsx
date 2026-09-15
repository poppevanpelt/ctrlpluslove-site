import type { Metadata } from "next";
import Link from "next/link";

import { getPublicRadarSignals, PublicRadarSignal } from "@/lib/radar/notion";
import { routeMetadata } from "../seo";
import { ThemeToggle } from "../theme-toggle";
import { RadarForm } from "./radar-form";
import "./radar.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...routeMetadata("/radar/"),
  title: "Radar — ctrl+love",
  description:
    "The human-facing sensing layer of ctrl+love: observations, contradictions and weak signals before they become questions.",
};

const fallbackSignals: PublicRadarSignal[] = [
  {
    signal: "People trust disagreement more than a polished conclusion.",
    type: "Pattern",
    market: "AI decision work",
    location: "Client rooms",
    confidence: "High",
    notes:
      "When the argument is visible, the final recommendation feels earned rather than generated.",
  },
  {
    signal: "Local workarounds are sometimes protecting the thing the central process cannot see.",
    type: "Contradiction",
    market: "Operations",
    location: "Regional teams",
    confidence: "Medium",
    notes:
      "What looks inefficient may carry context, safety, memory or trust.",
  },
  {
    signal: "Audience fatigue is showing up as a strategy problem.",
    type: "Cultural Note",
    market: "Media and brands",
    location: "Public channels",
    confidence: "Medium",
    notes:
      "People are not only asking for better content. They are asking for less extraction.",
  },
];

const pathSteps = [
  "Signal",
  "Review",
  "Decision Question",
  "Room",
  "Evidence",
  "Decision",
];

async function loadSignals() {
  try {
    const signals = await getPublicRadarSignals();
    return signals.length > 0 ? signals : fallbackSignals;
  } catch {
    return fallbackSignals;
  }
}

export default async function RadarPage() {
  const signals = await loadSignals();

  return (
    <main className="site-shell radar-page">
      <ThemeToggle />
      <Link className="radar-home-link" href="/" aria-label="Back to ctrl+love homepage">
        ctrl+love
      </Link>

      <section className="radar-hero">
        <div className="radar-hero-copy">
          <p className="radar-kicker">ctrl+love Radar</p>
          <h1>Notice it before it becomes obvious.</h1>
          <p className="radar-intro">
            Radar collects weak signals, contradictions and cultural shifts before
            they harden into strategy. The useful ones become Decision Questions.
          </p>
          <div className="radar-actions">
            <a href="#submit-signal">Send a signal</a>
            <Link href="/instruments/">See the instruments</Link>
            <Link href="/inside-ctrl-love/">Inside ctrl+love</Link>
          </div>
        </div>

        <div className="radar-console" aria-label="Radar signal status">
          <div className="radar-console-topline">
            <span>Signal intake</span>
            <strong>Human first</strong>
          </div>
          <div className="radar-sweep" />
          <div className="radar-console-grid">
            <span>Observation</span>
            <span>Contradiction</span>
            <span>Pattern</span>
            <span>Open Question</span>
          </div>
        </div>
      </section>

      <section className="radar-flow" aria-label="How radar signals move">
        {pathSteps.map((step, index) => (
          <div className="radar-flow-step" key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </section>

      <section className="radar-section radar-observations">
        <div className="radar-section-heading">
          <p className="radar-kicker">Visible Signals</p>
          <h2>What the network is learning to notice.</h2>
        </div>
        <div className="radar-signal-list">
          {signals.map((signal) => (
            <article className="radar-signal-card" key={`${signal.signal}-${signal.location}`}>
              <div className="radar-signal-meta">
                <span>{signal.type}</span>
                <span>{signal.confidence || "Review"}</span>
              </div>
              <h3>{signal.signal}</h3>
              <p>{signal.notes}</p>
              <div className="radar-signal-context">
                <span>{signal.market || "Unsorted market"}</span>
                <span>{signal.location || "Unplaced"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="radar-section radar-submit-section" id="submit-signal">
        <div className="radar-submit-copy">
          <p className="radar-kicker">Contribute</p>
          <h2>Send a signal into review.</h2>
          <p>
            It does not need to be complete. It needs to be specific enough to
            make someone ask a better question.
          </p>
          <ul>
            <li>Something changed before the dashboard noticed.</li>
            <li>A local behaviour contradicts the official story.</li>
            <li>A pattern keeps appearing across unrelated conversations.</li>
          </ul>
        </div>
        <RadarForm />
      </section>
    </main>
  );
}
