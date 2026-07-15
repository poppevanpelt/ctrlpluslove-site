export function HomeHero() {
  return (
    <section className="hero-section home-hero-section chapter-arrival">
      <div className="home-hero-copy chapter-arrival-copy">
        <p className="home-hero-logo" aria-label="ctrl+love">
          ctrl+love
        </p>
        <nav className="home-hero-nav" aria-label="Institution">
          <a href="#the-room">THE ROOM</a>
          <a href="#personas">PERSONAS</a>
          <a href="#products">PRODUCTS</a>
          <a href="#cases">CASES</a>
          <a href="#network">NETWORK</a>
          <a href="#founder">FOUNDER</a>
          <a href="/constitution/">THE CONSTITUTION</a>
          <a href="mailto:hello@ctrlpluslove.com">ADMISSION</a>
        </nav>
        <div className="chapter-arrival-message">
          <h1 className="home-hero-line sequence-reveal sequence-shortcut">
            Shortcut to reality.
          </h1>
          <div
            className="arrival-status sequence-reveal sequence-hero-status"
            aria-label="Room status"
          >
            <span>ROOM STATUS</span>
            <strong>Decision entering...</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
