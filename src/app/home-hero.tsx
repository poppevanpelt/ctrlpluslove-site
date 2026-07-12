export function HomeHero() {
  return (
    <section className="hero-section home-hero-section">
      <div className="home-hero-copy">
        <p className="home-hero-logo" aria-label="ctrl+love">
          ctrl+love
        </p>
        <nav className="home-hero-nav" aria-label="Homepage">
          <a href="#how-it-works">How it works</a>
          <a href="#projects">Projects</a>
          <a href="#room">The Room</a>
          <a href="/inside-ctrl-love/">About</a>
        </nav>
        <div className="home-hero-message">
          <h1 className="home-hero-line">
            Shortcut to reality.
          </h1>
          <p
            className="home-hero-proposition"
            style={{
              maxWidth: "min(100%, 38rem)",
              color: "color-mix(in srgb, var(--ink) 82%, var(--muted))",
              fontSize: "clamp(1.08rem, 1.5vw, 1.34rem)",
              fontWeight: 520,
              lineHeight: 1.42,
            }}
          >
            We expose disagreement, blind spots and likely consequences before
            a decision reaches the market.
          </p>
          <p className="home-hero-translation">
            Stress-test your decisions before the market does.
          </p>
          <p className="home-hero-mechanism">
            Powered by AI, trusted experts and structured workflows.
          </p>
          <div className="home-hero-actions" aria-label="Primary actions">
            <a href="mailto:hello@ctrlpluslove.com" className="home-hero-cta">
              Stress-test a decision
            </a>
            <a href="#how-it-works" className="home-hero-secondary">
              Watch the Room think
            </a>
          </div>
          <p className="home-hero-proof">
            Real decisions. Real disagreement. Clearer next moves.
          </p>
        </div>
      </div>
    </section>
  );
}
