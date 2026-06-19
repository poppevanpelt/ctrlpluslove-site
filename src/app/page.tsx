import Image from "next/image";

import { LivingTicker } from "./living-ticker";
import { MeetingFilterController } from "./meeting-filter-controller";
import { ThemeToggle } from "./theme-toggle";

export default function Home() {
  return (
    <main className="site-shell">
      <ThemeToggle />
      <MeetingFilterController />

      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-logo hero-logo-mark" aria-label="ctrl+love">
            ctrl+love
          </p>
          <div className="hero-message">
            <h1 className="hero-line" aria-label="Shortcut to reality.">
              <span className="hero-route hero-route-long" aria-hidden="true">
                Agreeable compromise.
              </span>
              <span className="hero-route hero-route-final" aria-hidden="true">
                Shortcut to reality.
              </span>
            </h1>
            <p className="hero-translation">
              Stress-test your decisions before the market does.
            </p>
          </div>
          <div className="hero-message hero-message-secondary">
            <h2 className="hero-invitation">
              Bring the decision into the room.
            </h2>
          </div>
          <a
            href="mailto:hello@ctrlpluslove.com"
            className="hero-email"
          >
            hello@ctrlpluslove.com →
          </a>
        </div>

      </section>

      <LivingTicker />

      <nav
        className="explore-section hero-explore"
        id="explore"
        aria-labelledby="explore-title"
      >
        <div className="explore-block">
          <p className="section-kicker" id="explore-title">
            Explore
          </p>
          <div className="explore-list" aria-label="Explore destinations">
            <a className="explore-destination" href="/reality/">
              <strong>Department of Reality Preservation →</strong>
              <em>Cornelis van Loon</em>
            </a>
            <a
              className="explore-destination"
              href="/unfinished-thoughts/"
            >
              <strong>Department of Unfinished Thoughts →</strong>
              <em>Nora Veld</em>
            </a>
            <div className="explore-destination">
              <a href="#intro">Meet the Room →</a>
            </div>
            <a className="explore-destination" href="/ai-y-fier/">
              <strong>AI-y-fier →</strong>
              <em>Empty thoughts in. Thought leadership out.</em>
            </a>
            <a className="explore-destination" href="/meeting-filter/">
              <strong>Meeting Filter →</strong>
              <em>Should we be in this meeting?</em>
            </a>
            <a className="explore-destination" href="/constitution/">
              <strong>ctrl+love constitution →</strong>
              <em>Governance archive.</em>
            </a>
            <div className="explore-destination">
              <a href="/museum/">Museum Shop →</a>
            </div>
          </div>
        </div>
      </nav>

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
            <div className="persona-card">
              <span>The Customer</span>
              <p>The Missing Chair</p>
              <em>Would anyone outside this room actually care?</em>
            </div>
            <div className="persona-card">
              <span>The Future</span>
              <p>The Missing Chair</p>
              <em>How will this decision look in five years?</em>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="ways-in">
        <div className="content-block wide poster-block">
          <div className="ways-heading">
            <p className="section-kicker">Three ways in</p>
            <h2>Bring the decision into the room.</h2>
            <p className="ways-support">
              For decisions you only want to make once.
            </p>
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

      <section className="content-section ruled why-section">
        <div className="content-block why-block">
          <p className="section-kicker">Why this exists</p>
          <div className="why-lines">
            <div className="why-core">
              <p>AI made answers abundant.</p>
              <p>
                <span>Judgment</span> became valuable.
              </p>
            </div>
            <p className="ai-bridge">
              The room exists to help people think together.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section ruled method-section">
        <div className="content-block method-block">
          <p
            className="section-kicker"
            style={{ fontSize: "clamp(1.08rem, 1.35vw, 1.24rem)" }}
          >
            How it works
          </p>
          <div
            className="method-lines"
            style={{
              gap: "0.48rem",
              fontSize: "clamp(1.72rem, 2.55vw, 2.38rem)",
            }}
          >
            <p>Powered by billions of human signals.</p>
            <p style={{ fontSize: "clamp(1.28rem, 1.68vw, 1.54rem)" }}>
              AI makes perspectives available.
            </p>
            <p style={{ fontSize: "clamp(1.28rem, 1.68vw, 1.54rem)" }}>
              The room decides which ones matter.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section ruled founder-section">
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

      <section className="content-section ruled final-cta-section">
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

      <section
        id="archive"
        className="content-section ruled archive-section"
        aria-labelledby="archive-title"
      >
        <div className="content-block archive-block">
          <div className="archive-heading">
            <p className="section-kicker" id="archive-title">
              Archive
            </p>
            <p>A few artifacts from before the move.</p>
          </div>

          <div className="archive-list" aria-label="Archive artifacts">
            <a
              href="https://www.youtube.com/watch?v=6cSVEYtbAZU"
              target="_blank"
              rel="noreferrer"
            >
              <span className="archive-thumbnail" aria-hidden="true">
                <Image
                  src="https://i.ytimg.com/vi/6cSVEYtbAZU/hqdefault.jpg"
                  alt=""
                  width={118}
                  height={66}
                  loading="lazy"
                />
              </span>
              <span className="archive-title">100 People</span>
              <em>United Nations</em>
              <p className="archive-caption">
                Eight billion people.
                <br />
                One village.
                <br />
                <br />
                An experiment in reducing humanity to a sample size of 100.
                <br />
                <br />
                Long before &quot;billions of human signals&quot;
                <br />
                became part of our vocabulary.
              </p>
            </a>
            <a
              href="https://www.youtube.com/watch?v=iiaj2xrgvNw"
              target="_blank"
              rel="noreferrer"
            >
              <span className="archive-thumbnail" aria-hidden="true">
                <Image
                  src="https://i.ytimg.com/vi/iiaj2xrgvNw/hqdefault.jpg"
                  alt=""
                  width={118}
                  height={66}
                  loading="lazy"
                />
              </span>
              <span className="archive-title">Creature of Habit</span>
              <em>ASN Bank</em>
              <p className="archive-caption">
                Complexity enters disguised as a story.
                <br />
                <br />
                Sometimes the fastest route to understanding
                <br />
                isn&apos;t data.
                <br />
                <br />
                It&apos;s a character.
              </p>
            </a>
            <a
              href="https://www.youtube.com/watch?v=zeCSDR0Emfk"
              target="_blank"
              rel="noreferrer"
            >
              <span className="archive-thumbnail" aria-hidden="true">
                <Image
                  src="https://i.ytimg.com/vi/zeCSDR0Emfk/hqdefault.jpg"
                  alt=""
                  width={118}
                  height={66}
                  loading="lazy"
                />
              </span>
              <span className="archive-title">Fireworks</span>
              <em>L.A.A.F.</em>
              <p className="archive-caption">
                Reality leaves clues.
                <br />
                <br />
                While most people watched the fireworks,
                <br />
                someone else was watching the supply chain.
              </p>
            </a>
            <a
              href="https://www.youtube.com/watch?v=hbsINkeRA_U"
              target="_blank"
              rel="noreferrer"
            >
              <span className="archive-thumbnail" aria-hidden="true">
                <Image
                  src="https://i.ytimg.com/vi/hbsINkeRA_U/hqdefault.jpg"
                  alt=""
                  width={118}
                  height={66}
                  loading="lazy"
                />
              </span>
              <span className="archive-title">Disobedient North-Korean Protester</span>
              <em>Delta Lloyd</em>
              <p className="archive-caption">
                Every system contains its opposite.
                <br />
                <br />
                Even on the most choreographed day imaginable,
                <br />
                someone eventually asks a different question.
              </p>
            </a>
            <a
              href="https://www.youtube.com/watch?v=Xw9Y-lh_OFE"
              target="_blank"
              rel="noreferrer"
            >
              <span className="archive-thumbnail" aria-hidden="true">
                <Image
                  src="https://i.ytimg.com/vi/Xw9Y-lh_OFE/hqdefault.jpg"
                  alt=""
                  width={118}
                  height={66}
                  loading="lazy"
                />
              </span>
              <span className="archive-title">You Need Protection</span>
              <em>New York Pizza</em>
              <p className="archive-caption">
                Culture is what happens when nobody is watching.
                <br />
                <br />
                A pizza company.
                <br />
                A helmet.
                <br />
                A manager who cares more than necessary.
                <br />
                <br />
                Those details tend to matter.
              </p>
            </a>
          </div>

          <p className="archive-footnote">
            We didn&apos;t invent these questions.
            <br />
            We&apos;ve just been following them for a very long time.
          </p>
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
          <p>
            <a href="/constitution/">
              ctrl+love constitution
            </a>
          </p>
          <p className="copyright">ctrl+love/2026</p>
        </div>
      </footer>
    </main>
  );
}
