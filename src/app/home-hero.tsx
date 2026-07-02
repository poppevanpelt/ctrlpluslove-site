export function HomeHero() {
  return (
    <section className="hero-section home-hero-section">
      <div className="hero-copy">
        <p className="hero-logo hero-logo-mark" aria-label="ctrl+love">
          ctrl+love
        </p>
        <div className="hero-message">
          <h1
            className="hero-line"
            aria-label="Assuring compromise. Shortcut to reality."
          >
            <span className="hero-route hero-route-long" aria-hidden="true">
              Assuring compromise.
            </span>
            <span className="hero-route hero-route-final">
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
        <a href="mailto:hello@ctrlpluslove.com" className="hero-email">
          hello@ctrlpluslove.com →
        </a>
      </div>
    </section>
  );
}
