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
          <a href="#people-title">Human network</a>
          <a href="/steel-ball/">Steel Ball</a>
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
            Test important decisions with the people they affect before reality
            makes the decision for you.
          </p>
          <p className="home-hero-translation">
            Stress-test your decisions before the market does.
          </p>
          <p className="home-hero-mechanism">
            CTRL+LOVE builds Decision Rooms: structured pressure tests powered
            by AI, trusted experts and perspectives from the markets that matter.
          </p>
          <div className="home-hero-actions" aria-label="Primary actions">
            <a href="/stress-test/" className="home-hero-cta">
              Bring a decision into the room
            </a>
            <a href="#decision-room-works" className="home-hero-secondary">
              See how a Decision Room works
            </a>
          </div>
          <a className="home-steel-ball-link" href="/steel-ball/">
            <span>
              <strong>Artifact 001</strong>
              The Steel Ball · €29.95 →
            </span>
          </a>
          <p className="home-hero-proof">
            For leaders, founders and teams who need to know what breaks before
            money, reputation or momentum is committed.
          </p>
        </div>
      </div>
    </section>
  );
}
