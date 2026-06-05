export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <h1>ctrl+love</h1>
          <p className="hero-line">
            Stress-test your decisions
            <br />
            <span>before the market does.</span>
          </p>
          <p className="subtle-line">Not one voice. Pressure from many.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-block">
          <h2>One voice is rarely enough.</h2>
          <div className="prose">
            <p>
              That&apos;s why we built a{" "}
              <span className="bright">pressure chamber</span>.
              <br />
              60+ handcrafted personas.
              <br />
              Each with its own posture, its own instincts, its own way of
              seeing.
            </p>
            <p>
              You bring an idea.
              <br />A scribble, a full deck, whatever.
              <br />
              They push back. Not to please you, not to confirm what you already
              believe. To expose where your thinking holds and where it folds.
            </p>
            <p className="muted">
              A room of minds.
              <br />
              That puts your idea under pressure.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block">
          <h2 className="centered">Two teams. Two temperatures.</h2>

          <div className="team-grid">
            <div className="team-block">
              <h3>ctrl+love</h3>
              <p>
                The creative conscience. Protects the feeling, the craft, the
                thing that made the idea worth having. Asks what the work demands
                before it gets diluted.
              </p>
            </div>

            <div className="team-block">
              <h3>cmd+hmm</h3>
              <p>
                The pressure side. Tests the structure, finds the cracks, asks
                the questions you have been avoiding. Shows you where it breaks
                before money is spent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block">
          <h2>The process is simple.</h2>
          <div className="process-list">
            <p>Open the room.</p>
            <p>Put the idea on the table.</p>
            <p>Let them react.</p>
            <p>See where it breaks.</p>
            <p className="bright">See how it works.</p>
          </div>
        </div>
      </section>

      <section className="content-section ruled">
        <div className="content-block centered">
          <h2 className="cta-title">
            Designed for conflict,
            <br />
            <span>not comfort.</span>
          </h2>
          <a
            href="mailto:hello@ctrlpluslove.com?subject=ctrl%2Blove%20demo"
            className="button-link"
          >
            Request a demo
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-copy">
          <p>
            For demo or inquiries, contact Poppe van Pelt:
            <br />
            <a
              href="mailto:hello@ctrlpluslove.com"
            >
              hello@ctrlpluslove.com
            </a>{" "}
            or{" "}
            <a
              href="tel:+31625279867"
            >
              +31 6 2527 9867
            </a>
          </p>
          <p className="copyright">ctrl+love/2026</p>
        </div>
      </footer>
    </main>
  );
}
