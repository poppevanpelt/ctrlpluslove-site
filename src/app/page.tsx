import Image from "next/image";

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <h1 className="sr-only">ctrl+love</h1>
          <div className="hero-logo" aria-hidden="true">
            <Image
              className="hero-logo-image"
              src="/ctrl-love-logo-gradient-master.png"
              alt=""
              width={1548}
              height={366}
              priority
              unoptimized
            />
          </div>
          <p className="hero-line">
            AI made answers abundant.
            <br />
            <span>Judgment became the bottleneck.</span>
          </p>
          <p className="subtle-line">
            Most AI smooths tension.
            <br />
            We bring it back.
          </p>
          <p className="access-note">
            Half a deck is enough.
          </p>
          <a
            href="mailto:hello@ctrlpluslove.com"
            className="button-link hero-cta"
          >
            hello@ctrlpluslove.com
          </a>
        </div>
        <a href="#intro" className="scroll-cue" aria-label="Scroll to intro">
          <span />
        </a>
      </section>

      <section className="content-section" id="intro">
        <div className="content-block statement-block">
          <h2 className="statement-title">Ideas are not scarce. Judgment is.</h2>
          <div className="prose">
            <p>
              Good ideas rarely fail because nobody liked them.
              <br />
              They fail after too many people make them safer.
            </p>
            <p>
              <span className="logo-text">ctrl+love</span> is a private room
              of synthetic personas built to disagree with the work while it
              can still change.
              <br />
              The pressure comes before the market.
            </p>
            <p className="muted">
              Nobody leaves with exactly what they brought in.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block statement-block">
          <h2 className="statement-title centered">
            Two teams.
            <br />
            Two temperatures.
          </h2>

          <div className="team-manifesto">
            <p>Not everyone agrees.</p>
            <p className="bright">Good.</p>
            <p>Some protect the idea.</p>
            <p>Some attack it.</p>
            <p>Some discover the stronger version.</p>
            <p className="bright">
              Enter the room of people you&apos;ll want to meet early.
            </p>
          </div>

          <div className="team-grid">
            <div className="team-block">
              <h3 className="team-warm">ctrl+love</h3>
              <p>
                The warm side. It protects the original impulse, the craft, and
                the feeling that made the idea worth fighting for.
              </p>
              <p className="muted">
                It asks what should stay alive.
              </p>
            </div>

            <div className="team-block">
              <h3 className="team-cold">cmd+hmm</h3>
              <p>
                The cold side. It checks the claim, the logic, the risk, and
                the cost of being wrong.
              </p>
              <p className="muted">
                It says what will break first.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block wide">
          <div className="section-heading">
            <h2>Three ways to apply pressure.</h2>
            <p>Start anywhere.</p>
          </div>

          <div className="offer-grid">
            <article className="offer-block">
              <h3>On-Call Room&trade;</h3>
              <p className="offer-lead">When the work keeps moving.</p>
              <p>
                A room available around live work, late doubts, and decisions
                that keep changing.
              </p>
              <p className="muted">Bad decisions escalate quickly.</p>
            </article>

            <article className="offer-block">
              <h3>Decision Stress-Test&trade;</h3>
              <p className="offer-lead">
                When an idea feels too easy to defend.
              </p>
              <p>
                We test the claim, the audience, the tension, and what the work
                is asking people to believe.
              </p>
              <p className="muted">What survives gets sharper.</p>
            </article>

            <article className="offer-block">
              <h3>Kill or Scale&trade;</h3>
              <p className="offer-lead">When maybe has become expensive.</p>
              <p>
                We look for the reason to continue, stop, or change direction.
              </p>
              <p className="muted">No soft landings. No maybe.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block">
          <h2>A simple stress-test.</h2>
          <div className="process-list">
            <p>A launch plan enters.</p>
            <p>The main claim is too polite.</p>
            <p>The audience has no reason to care yet.</p>
            <p>The sharper tension appears.</p>
            <p className="bright">The launch changes.</p>
          </div>
          <div className="outcome-note">
            <p>The idea is not discarded. The weak promise is.</p>
            <p>
              Change the decision while it is still cheap to change.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block founder-note">
          <p>
            Created by Poppe van Pelt, an Amsterdam-based creative leader and
            ADCN Dutch Hall of Fame member.
          </p>
          <p>
            Decades of creative judgment, rebuilt as{" "}
            <span className="logo-text">ctrl+love</span>. Pressure, taste,
            doubt, and pushback before the market makes the decision for you.
          </p>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block statement-block centered">
          <h2 className="statement-title cta-title">
            Designed for conflict,
            <br />
            <span>not comfort.</span>
          </h2>
          <a
            href="mailto:hello@ctrlpluslove.com"
            className="button-link"
          >
            hello@ctrlpluslove.com
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
