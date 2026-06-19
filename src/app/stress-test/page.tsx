import type { Metadata } from "next";
import Link from "next/link";

import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = {
  title: "Decision Stress-Test™ — ctrl+love",
  description:
    "Bring one live creative decision into the ctrl+love room. Leave with less fog.",
};

const clientInputs = [
  "Campaign route",
  "Brand positioning",
  "Product idea",
  "Innovation concept",
  "Strategic dilemma",
  "Internal presentation",
  "Launch narrative",
  "Founder story",
];

const outputs = [
  "What is working",
  "What is pretending",
  "What is risky",
  "What is missing",
  "What should be killed",
  "What should be protected",
  "What should be made braver",
];

const roomEmail =
  "mailto:hello@ctrlpluslove.com?subject=Decision%20Stress-Test&body=Hello%20ctrl%2Blove%2C%0A%0AI%20have%20one%20decision%20for%20the%20room.%0A%0AThe%20decision%3A%20";

export default function StressTestPage() {
  return (
    <main className="site-shell stress-page">
      <ThemeToggle />

      <Link className="stress-home" href="/">
        ctrl+love
      </Link>

      <section className="stress-hero">
        <div className="stress-hero-block">
          <p className="section-kicker">One live decision</p>
          <h1>
            Decision
            <br />
            Stress-Test<sup>™</sup>
          </h1>
          <p className="stress-hero-line">Bring one decision. Leave with less fog.</p>
          <p className="stress-hero-support">
            ctrl+love helps companies see what their ideas are really doing
            before the market, the boardroom, or the comment section does it
            for them.
          </p>
          <div className="stress-actions">
            <a className="stress-primary-action" href={roomEmail}>
              Enter the room →
            </a>
            <a className="stress-secondary-action" href="#inside">
              What happens inside?
            </a>
          </div>
        </div>
      </section>

      <section className="stress-section ruled" id="what-it-is">
        <div className="stress-block stress-split">
          <p className="section-kicker">What it is</p>
          <div className="stress-section-copy">
            <h2>A room for decisions that got too familiar.</h2>
            <div className="stress-prose">
              <p>
                Some ideas become impossible to judge from the inside.
                <br />
                Too many meetings.
                <br />
                Too many opinions.
                <br />
                Too much politeness.
              </p>
              <p>
                ctrl+love creates useful friction around one live decision, so
                the thing can finally be seen clearly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stress-section ruled">
        <div className="stress-block">
          <div className="stress-section-heading">
            <p className="section-kicker">What clients bring</p>
            <h2>Bring one unresolved thing.</h2>
          </div>
          <ul className="stress-list stress-input-list">
            {clientInputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="stress-closing-line">
            If the room can’t find the tension, the idea may not be alive yet.
          </p>
        </div>
      </section>

      <section className="stress-section ruled" id="inside">
        <div className="stress-block stress-inside-block">
          <div className="stress-section-heading">
            <p className="section-kicker">What happens inside</p>
            <h2>The idea enters the room.</h2>
          </div>
          <div className="stress-forces" aria-label="Forces inside the room">
            <article className="stress-force stress-force-warm">
              <p>ctrl+love</p>
              <h3>Protects the emotional truth.</h3>
            </article>
            <article className="stress-force stress-force-cold">
              <p>cmd+hmm</p>
              <h3>
                Applies pressure from risk, budget, politics, legal,
                production, stakeholder fear, and market reality.
              </h3>
            </article>
          </div>
          <p className="stress-principle">
            Some voices protect the idea. Some attack it. Most need both.
          </p>
        </div>
      </section>

      <section className="stress-section ruled">
        <div className="stress-block">
          <div className="stress-section-heading">
            <p className="section-kicker">What comes back</p>
            <h2>You do not get a polite report.</h2>
          </div>
          <ul className="stress-list stress-output-list">
            {outputs.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="stress-closing-line">
            The output is a clear decision artifact. Something people can
            actually use.
          </p>
        </div>
      </section>

      <section className="stress-section stress-quiet-section ruled">
        <div className="stress-block stress-split">
          <p className="section-kicker">What this refuses to become</p>
          <div className="stress-section-copy">
            <h2>This is not a dashboard.</h2>
            <p className="stress-quiet-copy">
              ctrl+love is not a SaaS product, productivity platform, or AI
              wrapper. It is a high-touch, low-volume room for better creative
              judgment.
            </p>
          </div>
        </div>
      </section>

      <section className="stress-section stress-founder-section ruled">
        <div className="stress-block stress-split">
          <p className="section-kicker">Founder role</p>
          <div className="stress-section-copy">
            <h2>Founder-editor, not founder-operator.</h2>
            <p className="stress-quiet-copy">
              Poppe protects the taste, rhythm, edge, and weirdness of the
              room. The system can assist the decision. It should never replace
              the human responsibility for making it.
            </p>
          </div>
        </div>
      </section>

      <section className="stress-final ruled">
        <div className="stress-final-block">
          <p className="section-kicker">One decision. One room.</p>
          <h2>Stress-test one decision before it gets expensive.</h2>
          <a className="stress-primary-action" href={roomEmail}>
            Enter the room →
          </a>
        </div>
      </section>

      <footer className="stress-footer">
        <p>Useful disagreement nearby.</p>
        <Link href="/">ctrl+love / 2026</Link>
      </footer>
    </main>
  );
}
