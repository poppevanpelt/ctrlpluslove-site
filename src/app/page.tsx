import { LivingTicker } from "./living-ticker";

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <h1 className="hero-logo">ctrl+love</h1>
          <p className="hero-line">
            Shortcut to reality.
          </p>
          <p className="subtle-line">
            A decision stress-test room for strategies, launches, and
            high-stakes ideas.
          </p>
          <a
            href="mailto:hello@ctrlpluslove.com"
            className="text-link hero-cta"
          >
            hello@ctrlpluslove.com →
          </a>
          <a
            href="#ways-in"
            className="scroll-cue"
            aria-label="Scroll to the first section"
          >
            <span aria-hidden="true" />
          </a>
        </div>
      </section>

      <LivingTicker />

      <section className="content-section" id="ways-in">
        <div className="content-block wide poster-block">
          <div className="ways-heading">
            <p className="section-kicker">Three ways in</p>
            <h2>Bring the decision into the room.</h2>
          </div>

          <div className="offer-grid">
            <article className="offer-block">
              <h3>Decision Stress-Test&trade;</h3>
              <p className="muted">
                One important decision.
                <br />
                Before money and time commit.
              </p>
            </article>

            <article className="offer-block">
              <h3>On-Call Room&trade;</h3>
              <p className="muted">
                Recurring pressure.
                <br />
                While the work keeps moving.
              </p>
            </article>

            <article className="offer-block offer-featured">
              <h3>Kill or Scale&trade;</h3>
              <p className="muted">
                Stop, reshape, or accelerate.
                <br />
                No soft landing.
              </p>
            </article>
          </div>

          <div className="process-path" aria-label="Decision room path">
            <span>Decision</span>
            <span aria-hidden="true">↓</span>
            <span>Room</span>
            <span aria-hidden="true">↓</span>
            <span>Disagreement</span>
            <span aria-hidden="true">↓</span>
            <span>Insight</span>
            <span aria-hidden="true">↓</span>
            <span>Decision</span>
          </div>
        </div>
      </section>

      <section className="content-section ruled" id="intro">
        <div className="content-block statement-block">
          <div className="opening-flow">
            <p className="opening-line">
              Enter the room of people you&apos;ll want to meet early.
            </p>
            <p className="bridge-line">
              Once the decision is named, the room makes the answer harder.
            </p>
          </div>
          <div className="room-preview" aria-label="Room preview">
            <div className="persona-card">
              <p>The Critic</p>
              <em>Challenges the answer everyone already agreed on.</em>
              <span>Simon Cross</span>
            </div>
            <div className="persona-card">
              <p>The Commercial Realist</p>
              <em>Sees the cost of being wrong.</em>
              <span>Nick Deckman</span>
            </div>
            <div className="persona-card">
              <p>The Cultural Lens</p>
              <em>Spots what others miss.</em>
              <span>Lexi Arden</span>
            </div>
            <div className="persona-card">
              <p>The Consequence Keeper</p>
              <em>Looks beyond the next decision.</em>
              <span>Akiko Hayashi</span>
            </div>
            <div className="persona-card">
              <p>The Truth Teller</p>
              <em>Protects emotional truth.</em>
              <span>Maya Elise Harper</span>
            </div>
            <div className="persona-card">
              <p>The Reality Check</p>
              <em>Tests what survives outside the room.</em>
              <span>Adrian Mbeki</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section ruled proof-section">
        <div className="content-block surfaced-section">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">From early rooms</p>
              <h2>What the room surfaced.</h2>
            </div>
            <p>
              A few early stress-tests.
              <br />
              Shared anonymously.
            </p>
          </div>

          <div className="case-grid" aria-label="Anonymous room findings">
            <article className="case-card">
              <p>FINTECH LENDER</p>
              <h3>
                The rejection experience may matter more than the approval
                experience.
              </h3>
            </article>
            <article className="case-card">
              <p>HOMECARE BRAND</p>
              <h3>
                Nobody wanted a chair.
                <br />
                They wanted their life back.
              </h3>
            </article>
            <article className="case-card">
              <p>FASHION BRAND</p>
              <h3>
                People weren&apos;t buying apparel.
                <br />
                They were buying freedom.
              </h3>
            </article>
            <article className="case-card">
              <p>BREWING GROUP</p>
              <h3>
                Cost-cutting revealed a deeper organizational question.
              </h3>
            </article>
          </div>

          <p className="case-close">
            From the first rooms.
            <br />
            Nothing left exactly as it entered.
          </p>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block why-block">
          <p className="section-kicker">Why this exists</p>
          <div className="why-lines">
            <div className="why-core">
              <p>AI made answers abundant.</p>
              <p>
                <span>Judgment</span> did not.
              </p>
            </div>
            <p className="ai-bridge">
              AI generates perspectives. Humans remain responsible for the
              decision.
            </p>
            <p>Strategies multiplied.</p>
            <p>Decks multiplied.</p>
            <p>Options multiplied.</p>
            <p className="bright">That&apos;s the bottleneck.</p>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block poster-block founder-note">
          <h2 className="label-title">Built by observation.</h2>
          <p>
            Poppe van Pelt.
            <br />
            ADCN Hall of Fame.
            <br />
            Apple. TBWA. Selmore.
          </p>
          <p>
            Three decades of <span className="changing-word">changing</span> minds.
            <br />
            Now rebuilt for a world with AI.
          </p>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block statement-block centered final-cta">
          <h2 className="statement-title cta-title">
            DESIGNED FOR <span className="conflict-word">CONFLICT.</span>
            <br />
            <span>NOT COMFORT.</span>
          </h2>
          <a
            href="mailto:hello@ctrlpluslove.com"
            className="text-link"
          >
            Bring a decision →
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-copy">
          <p>Conversations on request</p>
          <p>
            <a
              href="mailto:hello@ctrlpluslove.com"
            >
              hello@ctrlpluslove.com
            </a>{" "}
            <br />
            <a
              href="tel:+31625279867"
            >
              +31 6 2527 9867
            </a>
          </p>
          <p>
            <a href="https://nl.linkedin.com/in/poppevanpelt">
              Poppe van Pelt · LinkedIn
            </a>
          </p>
          <p className="copyright">ctrl+love/2026</p>
        </div>
      </footer>
    </main>
  );
}
