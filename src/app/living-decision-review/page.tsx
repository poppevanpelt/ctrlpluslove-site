"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";

import styles from "./living-decision-review.module.css";

const decision = "Should Suki launch a Matcha Subscription?";
const initialReviewDelay = 520;
const reviewStepDelay = 1180;

const timeline = [
  {
    eyebrow: "Question entered",
    title: "A launch decision enters.",
    body: "The review starts before anyone has agreed what kind of risk it is.",
  },
  {
    eyebrow: "Maya · Emotional Pull",
    title: "Launch it.",
    body: "The strongest pull is reassurance: never running out.",
  },
  {
    eyebrow: "Simon · Skeptical Strategist",
    title: "I don't buy it yet.",
    body: "This could create subscription fatigue before loyalty.",
    status: "Contested",
  },
  {
    eyebrow: "Wade · Evidence",
    title: "Ritual categories behave differently.",
    body: "Subscription fatigue is real, but ritual categories behave differently from convenience refills.",
    status: "Evidence added",
  },
  {
    eyebrow: "Mira · Business Logic",
    title: "Margins can work.",
    body: "Churn decides everything.",
  },
  {
    eyebrow: "Akiko · Japanese Nuance",
    title: "Respect the ritual.",
    body: "Matcha is not just a flavor.",
  },
  {
    eyebrow: "Recommendation updated",
    title: "Launch ritual-based replenishment.",
    body: "From: Launch subscriptions.",
    status: "Shifted",
  },
  {
    eyebrow: "Consensus emerging",
    title: "86%",
    body: "The room is not louder. It is sharper.",
    status: "Updated",
  },
];

const productBlocks = [
  {
    title: "Bring your decision",
    body: "Start with the real question.",
  },
  {
    title: "Watch judgment form",
    body: "Positions move as evidence arrives.",
  },
  {
    title: "Leave with sharper direction",
    body: "Not certainty. Better judgment.",
  },
];

const fallbackController = `
(() => {
  const initialDelay = ${initialReviewDelay};
  const stepDelay = ${reviewStepDelay};
  const timers = [];

  function clearTimers() {
    while (timers.length) {
      window.clearTimeout(timers.pop());
    }
  }

  function init() {
    const root = document.querySelector("[data-demo-root]");
    const review = document.getElementById("review");
    const start = document.querySelector("[data-review-start]");
    const steps = Array.from(document.querySelectorAll("[data-review-step]"));
    const consensus = document.querySelector("[data-consensus-panel]");

    if (!root || !review || !start || steps.length === 0) return;

    function revealStep(step) {
      step.dataset.visible = "true";

      if (step.dataset.reviewStep === String(steps.length - 1) && consensus) {
        consensus.dataset.complete = "true";
        consensus.setAttribute("aria-label", "Consensus 86%");
      }
    }

    function runReview(event) {
      event.preventDefault();
      clearTimers();

      root.dataset.demoRunning = "true";
      start.textContent = start.dataset.runningLabel || "Review running";

      if (consensus) {
        delete consensus.dataset.complete;
        consensus.setAttribute("aria-label", "Consensus 78%");
      }

      steps.forEach((step) => {
        delete step.dataset.visible;
      });

      steps.forEach((step, index) => {
        timers.push(window.setTimeout(() => revealStep(step), initialDelay + index * stepDelay));
      });

      history.replaceState(null, "", "#review");
      review.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    start.addEventListener("click", runReview);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
`;

export default function LivingDecisionReview() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!demoStarted) return;

    const timers = timeline.map((_, index) =>
      window.setTimeout(() => {
        setRevealedSteps((currentSteps) =>
          currentSteps.includes(index)
            ? currentSteps
            : [...currentSteps, index].sort((a, b) => a - b)
        );
      }, initialReviewDelay + index * reviewStepDelay)
    );

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [demoStarted]);

  function startDemo(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setRevealedSteps([]);
    setDemoStarted(false);

    window.setTimeout(() => {
      setDemoStarted(true);
      history.replaceState(null, "", "#review");
      document.getElementById("review")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 40);
  }

  const consensusComplete = demoStarted && revealedSteps.includes(timeline.length - 1);

  return (
    <main
      className={`${styles.page} ${demoStarted ? styles.demoStarted : ""}`}
      data-demo-root
      data-demo-running={demoStarted ? "true" : undefined}
    >
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="ctrl+love home">
          ctrl+love
        </Link>
        <span>Living Decision Review</span>
      </header>

      <section className={`${styles.section} ${styles.hero}`} aria-labelledby="hero-title">
        <p className={styles.kicker}>Product demo</p>
        <h1 id="hero-title">Watch a decision change its mind.</h1>

        <div className={styles.decisionInput} aria-label="Decision example">
          <span>Decision</span>
          <div>
            <p>{decision}</p>
            <a href="#review" onClick={startDemo} data-review-start data-running-label="Review running">
              {demoStarted ? "Review running" : "Start the review"}
            </a>
          </div>
        </div>
      </section>

      <section className={styles.section} id="review" aria-labelledby="review-title">
        <div className={styles.reviewHeader}>
          <div className={styles.sectionLead}>
            <p className={styles.kicker}>Review in progress.</p>
            <h2 id="review-title">The decision evolves in public.</h2>
          </div>

          <div
            className={`${styles.consensusPanel} ${consensusComplete ? styles.consensusComplete : ""}`}
            data-consensus-panel
            data-complete={consensusComplete ? "true" : undefined}
            aria-label={`Consensus ${consensusComplete ? 86 : 78}%`}
          >
            <span>Consensus</span>
            <strong>
              <span className={styles.consensusValueInitial}>78%</span>
              <span className={styles.consensusValueFinal}>86%</span>
            </strong>
            <div className={styles.consensusTrack}>
              <i />
            </div>
          </div>
        </div>

        <ol className={styles.timeline} aria-live="polite">
          {timeline.map((item, index) => {
            const isVisible = demoStarted && revealedSteps.includes(index);

            return (
              <li
                className={`${styles.timelineItem} ${isVisible ? styles.visible : ""}`}
                data-review-step={index}
                data-visible={isVisible ? "true" : undefined}
                key={`${item.eyebrow}-${item.title}`}
                style={{ "--delay": `${Math.min(index * 25, 120)}ms` } as CSSProperties}
              >
                <div className={styles.timelineMarker} aria-hidden="true" />
                <article>
                  <div className={styles.itemMeta}>
                    <span>{item.eyebrow}</span>
                    {item.status ? <em>{item.status}</em> : null}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  {item.eyebrow === "Recommendation updated" ? (
                    <div className={styles.recommendationShift} aria-label="Recommendation changed">
                      <span>Launch subscriptions.</span>
                      <strong>Launch ritual-based replenishment.</strong>
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="how-title">
        <div className={styles.sectionLead}>
          <p className={styles.kicker}>How it works</p>
          <h2 id="how-title">Only now, the product.</h2>
        </div>

        <div className={styles.productGrid}>
          {productBlocks.map((block) => (
            <article key={block.title}>
              <h3>{block.title}</h3>
              <p>{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.close}`} aria-label="Closing">
        <div>
          <p>Built by observation.</p>
          <p>Designed for conflict.</p>
          <p>Made for better decisions.</p>
        </div>
        <a href="#review">Bring your own decision into the room</a>
      </section>
      <Script id="living-decision-review-fallback" strategy="afterInteractive">
        {fallbackController}
      </Script>
    </main>
  );
}
