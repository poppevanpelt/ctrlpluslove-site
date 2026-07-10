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
          <p className="home-hero-proposition">
            ctrl+love is a distributed creative intelligence network that
            combines AI, trusted human experts and structured workflows to make
            better strategic and creative decisions.
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
