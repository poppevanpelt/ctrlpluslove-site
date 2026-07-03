"use client";

import { useEffect, useState } from "react";

type HeroPhase = "is-route-long" | "is-route-glitch" | "is-route-final";

export function HomeHero() {
  const [phase, setPhase] = useState<HeroPhase>("is-route-long");

  useEffect(() => {
    const sequence: Array<[HeroPhase, number]> = [
      ["is-route-long", 1800],
      ["is-route-glitch", 2400],
      ["is-route-final", 3000],
      ["is-route-glitch", 1600],
    ];
    let index = 0;
    let timeout: number;

    const tick = () => {
      const [nextPhase, duration] = sequence[index];
      setPhase(nextPhase);
      index = (index + 1) % sequence.length;
      timeout = window.setTimeout(tick, duration);
    };

    timeout = window.setTimeout(tick, sequence[0][1]);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section className={`hero-section home-hero-section ${phase}`}>
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
