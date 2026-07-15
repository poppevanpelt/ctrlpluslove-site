export function HomeHero() {
  return (
    <section className="hero-section home-hero-section chapter-arrival">
      <div className="home-hero-copy chapter-arrival-copy">
        <p className="home-hero-logo" aria-label="ctrl+love">
          ctrl+love
        </p>
        <nav className="home-hero-nav" aria-label="Institution">
          <a href="#the-room">The Room</a>
          <a href="/museum/">The Museum</a>
          <a href="/artifacts/">Artifacts</a>
          <a href="/constitution/">The Constitution</a>
          <a href="mailto:hello@ctrlpluslove.com">Admission</a>
        </nav>
        <div className="chapter-arrival-message">
          <h1 className="home-hero-line">Shortcut to Reality.</h1>
          <div className="arrival-status" aria-label="Room status">
            <span>ROOM STATUS</span>
            <strong>Decision entering...</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
