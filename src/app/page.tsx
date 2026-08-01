"use client";

import { useState } from "react";

const stages = [
  {
    name: "OBSERVE",
    purpose: "Collect reality",
    output: "Reality signals enter the decision.",
    button: "Interpret",
  },
  {
    name: "INTERPRET",
    purpose: "Organize signals",
    output: "Signals become possible meanings.",
    button: "Frame",
  },
  {
    name: "FRAME",
    purpose: "Expose assumptions",
    output: "The question changes shape.",
    button: "Collide",
  },
  {
    name: "COLLIDE",
    purpose: "Compare perspectives",
    output: "Lenses meet the decision.",
    button: "Detect",
  },
  {
    name: "DETECT",
    purpose: "Reveal tensions",
    output: "The pressure points become visible.",
    button: "Decide",
  },
  {
    name: "DECIDE",
    purpose: "Return ownership",
    output: "The human carries the judgment.",
    button: "Reset",
  },
];

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = stages[activeStage];

  function nextStage() {
    setActiveStage((current) => (current === stages.length - 1 ? 0 : current + 1));
  }

  return (
    <main className="decision-collider-site" id="main-content">
      <section className="decision-collider-instrument" aria-labelledby="decision-collider-title">
        <header className="decision-collider-header">
          <p className="decision-collider-kicker">Instrument No. 001</p>
          <h1 id="decision-collider-title">Decision Collider</h1>
          <p className="decision-collider-question">
            Should we launch this product now?
          </p>
        </header>

        <div className="decision-collider-stage" aria-live="polite">
          <div className="decision-collider-stage-copy">
            <p className="decision-collider-count">
              {String(activeStage + 1).padStart(2, "0")} / 06
            </p>
            <h2>{stage.name}</h2>
            <p>{stage.purpose}</p>
          </div>

          <div
            className={`decision-collider-chamber decision-collider-${stage.name.toLowerCase()}`}
            aria-label="Decision transformation"
          >
            <div className="decision-collider-particle" />
            <div className="decision-collider-transformation" />
          </div>

          <p className="decision-collider-output">{stage.output}</p>
        </div>

        <footer className="decision-collider-controls">
          <div className="decision-collider-rail" aria-label="Stage progress">
            {stages.map((item, index) => (
              <button
                aria-label={`Go to ${item.name}`}
                aria-current={index === activeStage ? "step" : undefined}
                className={`decision-collider-dot${index === activeStage ? " active" : ""}`}
                key={item.name}
                onClick={() => setActiveStage(index)}
                type="button"
              />
            ))}
          </div>
          <button className="decision-collider-next" onClick={nextStage} type="button">
            {stage.button}
          </button>
        </footer>
      </section>
    </main>
  );
}
