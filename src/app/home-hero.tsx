"use client";

import { useEffect, useState } from "react";

type HeroPhase =
  | "is-route-long"
  | "is-route-glitch-to-final"
  | "is-route-final";

export function HomeHero() {
  const [phase, setPhase] = useState<HeroPhase>("is-route-long");

  useEffect(() => {
    const sequence: Array<[HeroPhase, number]> = [
      ["is-route-long", 6300],
      ["is-route-glitch-to-final", 620],
      ["is-route-final", 0],
    ];
    let index = 1;
    let timeout: number;

    const tick = () => {
      const [nextPhase, duration] = sequence[index];
      setPhase(nextPhase);

      if (index < sequence.length - 1) {
        index += 1;
        timeout = window.setTimeout(tick, duration);
      }
    };

    timeout = window.setTimeout(tick, sequence[0][1]);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section className={`hero-section home-hero-section ${phase}`}>
      <div className="home-hero-copy">
        <p className="home-hero-logo" aria-label="ctrl+love">
          ctrl+love
        </p>
        <div className="home-hero-message">
          <h1
            className="home-hero-line"
            aria-label="Assuring compromise. Shortcut to reality."
          >
            <span className="home-hero-route home-hero-route-long" aria-hidden="true">
              Assuring compromise.
            </span>
            <span className="home-hero-route home-hero-route-final">
              Shortcut to reality.
            </span>
          </h1>
          <p className="home-hero-translation">
            Stress-test your decisions before the market does.
          </p>
        </div>
        <div className="home-hero-message home-hero-message-secondary">
          <h2 className="home-hero-invitation">
            Bring the decision into the room.
          </h2>
        </div>
        <a href="mailto:hello@ctrlpluslove.com" className="home-hero-email">
          hello@ctrlpluslove.com →
        </a>
      </div>
    </section>
  );
}
