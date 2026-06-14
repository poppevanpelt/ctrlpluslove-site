import { LivingTicker } from "./living-ticker";
import { ThemeToggle } from "./theme-toggle";

export default function Home() {
  return (
    <main className="site-shell">
      <ThemeToggle />

      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-logo hero-logo-mark" aria-label="ctrl+love">
            ctrl+love
          </p>
          <div className="hero-message">
            <h1 className="hero-line">
              Shortcut to reality.
            </h1>
            <p className="hero-proof">
              Powered by billions of human signals.
            </p>
          </div>
          <div className="hero-message hero-message-secondary">
            <h2 className="hero-invitation">
              Bring the decision into the room.
            </h2>
            <p className="hero-stakes">
              For decisions you only want to make once.
            </p>
          </div>
          <a
            href="#intro"
            className="scroll-cue"
            aria-label="Scroll to the first section"
          >
            <span aria-hidden="true" />
          </a>
        </div>
      </section>

      <LivingTicker />

      <section className="explore-section ruled" aria-labelledby="explore-title">
        <div className="explore-block">
          <p className="section-kicker" id="explore-title">
            Explore
          </p>
          <div className="explore-list" aria-label="Explore destinations">
            <a href="/reality">Department of Reality Preservation</a>
            <a href="/unfinished-thoughts">
              Department of Unfinished Thoughts
            </a>
            <a href="#intro">Meet the Room</a>
            <a href="/museum">Museum Shop</a>
          </div>
        </div>
      </section>

      <section className="content-section ruled" id="intro">
        <div className="content-block statement-block">
          <div className="opening-flow">
            <p className="opening-line">
              Meet the room.
            </p>
            <p className="bridge-line">
              Named minds.
              <br />
              Built to disagree before the world does.
            </p>
          </div>
          <div className="room-preview" aria-label="Room preview">
            <div className="persona-card">
              <span>Simon Cross</span>
              <p>The Critic</p>
              <em>Challenges the answer everyone already agreed on.</em>
            </div>
            <div className="persona-card">
              <span>Nick Deckman</span>
              <p>The Commercial Realist</p>
              <em>Sees the cost of being wrong.</em>
            </div>
            <div className="persona-card">
              <span>Lexi Arden</span>
              <p>The Cultural Lens</p>
              <em>Spots what others miss.</em>
            </div>
            <div className="persona-card">
              <span>Akiko Hayashi</span>
              <p>The Consequence Keeper</p>
              <em>Looks beyond the next decision.</em>
            </div>
            <div className="persona-card">
              <span>Maya Elise Harper</span>
              <p>The Truth Teller</p>
              <em>Protects emotional truth.</em>
            </div>
            <div className="persona-card">
              <span>Adrian Mbeki</span>
              <p>The Reality Check</p>
              <em>Tests what survives outside the room.</em>
            </div>
          </div>
        </div>
      </section>

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
            <span>Friction</span>
            <span aria-hidden="true">↓</span>
            <span>Insight</span>
            <span aria-hidden="true">↓</span>
            <span>Better decision</span>
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
                <span>Meaning</span> became valuable.
              </p>
            </div>
            <p className="ai-bridge">
              AI generates perspectives. The room creates meaning.
            </p>
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
            Apple. Saint. TBWA. Selmore.
          </p>
          <p>
            Three decades of seeing what <span className="changing-word">changes</span> minds.
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
