import { CtrlLayerLogoTrigger } from "./ctrl-layer";
import { CtrlLayerNote } from "./ctrl-layer-note";

export function HomeHero() {
  return (
    <section className="hero-section home-hero-section chapter-arrival">
      <div className="home-hero-copy chapter-arrival-copy">
        <CtrlLayerLogoTrigger>
          <p className="home-hero-logo ctrl-layer-anchor" aria-label="ctrl+love">
            ctrl+love
            <CtrlLayerNote className="ctrl-layer-note-logo">
              CONTROL REVEALS ANOTHER LAYER
            </CtrlLayerNote>
          </p>
        </CtrlLayerLogoTrigger>
        <nav className="home-hero-nav" aria-label="Institution">
          <a href="/radar/">RADAR</a>
          <a href="#the-room">THE ROOM</a>
          <a href="#personas">PERSONAS</a>
          <a href="#products">PRODUCTS</a>
          <a href="#cases">CASES</a>
          <a href="#network">NETWORK</a>
          <a href="/embassies/">EMBASSIES</a>
          <a href="#founder">FOUNDER</a>
          <a href="/constitution/">THE CONSTITUTION</a>
          <a href="mailto:hello@ctrlpluslove.com">ADMISSION</a>
        </nav>
        <div className="chapter-arrival-message">
          <div className="chapter-arrival-scene" aria-hidden="true">
            <span className="chapter-arrival-floor" />
            <span className="chapter-arrival-incident-mark" />
            <span className="chapter-arrival-dust" />
            <span className="home-hero-reality-word">
              <span
                className="steel-ball-stage-origin"
                aria-hidden="true"
                data-stage-origin-source="hero"
              >
                <span
                  className="steel-ball-cursor steel-ball-stage-ball"
                  data-visible="true"
                  data-origin-resting="true"
                  data-origin-settling="true"
                />
              </span>
            </span>
          </div>
          <div className="chapter-arrival-title-lockup">
            <h1
              className="home-hero-line sequence-reveal sequence-shortcut"
              id="homepage-start"
              tabIndex={-1}
            >
              Shortcut to reality.
              <CtrlLayerNote className="ctrl-layer-note-hero">
                HUMAN SIGNAL DETECTED
              </CtrlLayerNote>
            </h1>
            <p className="chapter-arrival-signature">ctrl+love</p>
          </div>
          <p className="home-hero-subline sequence-reveal sequence-hero-orientation">
            Bring the decision into the room.
            <CtrlLayerNote className="ctrl-layer-note-subline">
              STILL THINKING
            </CtrlLayerNote>
          </p>
          <p className="home-hero-proposition sequence-reveal sequence-hero-orientation">
            AI finds patterns. Human judgment decides what matters.
          </p>
          <p className="home-hero-category sequence-reveal sequence-hero-orientation">
            A global network for better decisions.
          </p>
          <div
            className="arrival-status sequence-reveal sequence-hero-status"
            aria-label="Room status"
          >
            <span>ROOM STATUS</span>
            <strong>Decision entering...</strong>
            <CtrlLayerNote className="ctrl-layer-note-status">
              CURRENTLY BROADCASTING
            </CtrlLayerNote>
          </div>
        </div>
      </div>
    </section>
  );
}
