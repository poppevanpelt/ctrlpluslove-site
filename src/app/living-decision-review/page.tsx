"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";

import styles from "./living-decision-review.module.css";

const decision = "Should Suki launch a Matcha Subscription?";

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
    title: "Input",
    body: "A live decision, written in plain language. No deck, no prompt engineering, no theatre. The room first finds the hidden bet inside the question.",
  },
  {
    title: "Pressure",
    body: "Different minds argue from different jobs: customer, culture, money, consequence, evidence, emotion. The point is not to agree faster. It is to make the weak parts visible.",
  },
  {
    title: "Output",
    body: "A sharper recommendation with conditions attached: what to do, what to watch, what would change the answer, and which assumption should be tested before money or reputation moves.",
  },
];

const fallbackController = `
(() => {
  function init() {
    const root = document.querySelector("[data-demo-root]");
    const review = document.getElementById("review");
    const start = document.querySelector("[data-review-start]");
    const steps = Array.from(document.querySelectorAll("[data-review-step]"));
    const consensus = document.querySelector("[data-consensus-panel]");

    if (!root || !review || !start || steps.length === 0) return;

    function syncReview() {
      if (root.dataset.demoRunning !== "true") return;

      const rect = review.getBoundingClientRect();
      const pageTop = rect.top + window.scrollY;
      const startY = pageTop - window.innerHeight * 0.14;
      const endY = pageTop + window.innerHeight * 1.05;
      const rawProgress = (window.scrollY - startY) / Math.max(endY - startY, 1);
      const progress = Math.min(Math.max(rawProgress, 0), 1);
      const visibleCount = Math.min(steps.length, Math.max(0, Math.ceil(progress * steps.length)));

      steps.forEach((step, index) => {
        if (index < visibleCount) {
          step.dataset.visible = "true";
        } else {
          delete step.dataset.visible;
        }
      });

      if (visibleCount >= steps.length && consensus) {
        consensus.dataset.complete = "true";
        consensus.setAttribute("aria-label", "Consensus 86%");
      } else if (consensus) {
        delete consensus.dataset.complete;
        consensus.setAttribute("aria-label", "Consensus 78%");
      }
    }

    function runReview(event) {
      event.preventDefault();

      root.dataset.demoRunning = "true";
      start.textContent = start.dataset.runningLabel || "Review running";

      if (consensus) {
        delete consensus.dataset.complete;
        consensus.setAttribute("aria-label", "Consensus 78%");
      }

      steps.forEach((step) => {
        delete step.dataset.visible;
      });

      history.replaceState(null, "", "#review");
      review.scrollIntoView({ behavior: "smooth", block: "start" });
      window.requestAnimationFrame(syncReview);
    }

    start.addEventListener("click", runReview);
    window.addEventListener("scroll", syncReview, { passive: true });
    window.addEventListener("resize", syncReview);
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

    function syncReviewToScroll() {
      const review = document.getElementById("review");

      if (!review) return;

      const rect = review.getBoundingClientRect();
      const pageTop = rect.top + window.scrollY;
      const startY = pageTop - window.innerHeight * 0.14;
      const endY = pageTop + window.innerHeight * 1.05;
      const rawProgress = (window.scrollY - startY) / Math.max(endY - startY, 1);
      const progress = Math.min(Math.max(rawProgress, 0), 1);
      const visibleCount = Math.min(
        timeline.length,
        Math.max(0, Math.ceil(progress * timeline.length))
      );

      setRevealedSteps(
        Array.from({ length: visibleCount }, (_, index) => index)
      );
    }

    syncReviewToScroll();
    window.addEventListener("scroll", syncReviewToScroll, { passive: true });
    window.addEventListener("resize", syncReviewToScroll);

    return () => {
      window.removeEventListener("scroll", syncReviewToScroll);
      window.removeEventListener("resize", syncReviewToScroll);
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
        <p className={styles.kicker}>Live product</p>
        <h1 id="hero-title">A decision room that thinks in public.</h1>
        <p className={styles.heroSubcopy}>
          Bring one unresolved decision. The room turns it into tension,
          opposition, evidence, and a recommendation you can defend.
        </p>

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
          <p className={styles.kicker}>What it does</p>
          <h2 id="how-title">One decision in. A tested recommendation out.</h2>
          <p className={styles.productIntro}>
            The product is a structured argument engine. It does not summarize
            a decision. It makes the decision withstand pressure before the
            outside world gets a vote.
          </p>
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
