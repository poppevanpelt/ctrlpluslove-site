export function HomeHero() {
  return (
    <section className="hero-section home-hero-section">
      <div className="home-hero-copy">
        <p className="home-hero-logo" aria-label="ctrl+love">
          ctrl+love
        </p>
        <div className="home-hero-message">
          <h1 className="home-hero-line">
            Shortcut to reality.
          </h1>
          <p
            className="home-hero-proposition"
            style={{
              maxWidth: "min(100%, 31rem)",
              color: "color-mix(in srgb, var(--ink) 82%, var(--muted))",
              fontSize: "clamp(1.08rem, 1.5vw, 1.34rem)",
              fontWeight: 520,
              lineHeight: 1.42,
            }}
          >
            We combine AI, trusted experts and structured workflows to help
            organizations make better strategic and creative decisions.
          </p>
          <p className="home-hero-translation">
            Stress-test your decisions before the market does.
          </p>
          <div className="home-hero-actions" aria-label="Primary actions">
            <a href="mailto:hello@ctrlpluslove.com" className="home-hero-cta">
              Bring a decision into the room
            </a>
            <a href="#how-it-works" className="home-hero-secondary">
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
