"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";

import styles from "./living-decision-review.module.css";

const decision = "Should we relaunch our brand?";

const reviewMoments = [
  {
    label: "Question entered",
    title: "Should we relaunch our brand?",
    text: "Nobody agrees what the problem is yet.",
    consensus: 42,
  },
  {
    label: "Maya - human insight",
    title: "People don't miss the logo.",
    text: "They miss the feeling.",
    badge: "Perspective added",
    consensus: 49,
  },
  {
    label: "Simon - constructive skeptic",
    title: "I don't buy it yet.",
    text: "This sounds like boredom.",
    badge: "Contested",
    consensus: 48,
  },
  {
    label: "Wade - evidence",
    title: "The numbers don't support a relaunch.",
    text: "Awareness is fine. Consideration isn't.",
    badge: "Evidence added",
    consensus: 61,
  },
  {
    label: "Mira - commercial reality",
    title: "A relaunch costs attention.",
    text: "Spend it carefully.",
    consensus: 66,
  },
  {
    label: "Lexi - brand memory",
    title: "Don't spend trust on cosmetics.",
    text: "That's expensive trust.",
    consensus: 70,
  },
  {
    label: "Vera - experience design",
    title: "If customers don't notice the difference...",
    text: "Nothing has actually relaunched.",
    consensus: 76,
  },
  {
    label: "Akiko - cultural signals",
    title: "Relevance beats novelty.",
    text: "Every time.",
    consensus: 81,
  },
  {
    label: "Recommendation updated",
    title: "Renew the customer experience first.",
    text: "Refresh the identity afterwards.",
    badge: "Shifted",
    previous: "Relaunch the brand.",
    revision: "Renew the customer experience first.",
    consensus: 84,
  },
  {
    label: "Consensus emerging",
    title: "86%",
    text: "The room changed its mind.",
    badge: "Final",
    consensus: 86,
  },
];

const productRows = [
  {
    term: "Input",
    text: (
      <>
        A live decision, written in plain language.
        <br />
        No deck, no prompt engineering, no theatre. The room first finds the
        hidden bet inside the question.
      </>
    ),
  },
  {
    term: "Pressure",
    text: (
      <>
        Different minds argue from different jobs: customer, culture, money,
        consequence, evidence, emotion. The point is not to agree faster.
        <br />
        It is to make the weak parts visible.
      </>
    ),
  },
  {
    term: "Output",
    text: "A sharper recommendation with conditions attached: what to do, what to watch, what would change the answer, and which assumption should be tested before money or reputation moves.",
  },
];

export default function LivingDecisionReview() {
  const [activeMoment, setActiveMoment] = useState(-1);
  const [reviewProgress, setReviewProgress] = useState(0);
  const reviewRef = useRef<HTMLElement | null>(null);
  const activeReview = reviewMoments[Math.max(activeMoment, 0)] ?? reviewMoments[0];
  const consensusPercent = activeMoment < 0 ? 0 : activeReview.consensus;

  useEffect(() => {
    let frame = 0;

    function updateActiveMoment() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const review = reviewRef.current;
        if (!review) return;

        const rect = review.getBoundingClientRect();
        const travel = Math.max(rect.height - window.innerHeight * 0.18, 1);
        const rawProgress = -rect.top / travel;
        const progress = Math.min(Math.max(rawProgress, 0), 1);
        const activeProgress = Math.min(progress * 1.18, 1);
        const nextMoment = rect.top > window.innerHeight * 0.48
          ? -1
          : Math.min(reviewMoments.length - 1, Math.floor(activeProgress * (reviewMoments.length - 1)));

        setActiveMoment(nextMoment);
        setReviewProgress(nextMoment < 0 ? 0 : progress);
      });
    }

    updateActiveMoment();
    window.addEventListener("scroll", updateActiveMoment, { passive: true });
    window.addEventListener("resize", updateActiveMoment);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveMoment);
      window.removeEventListener("resize", updateActiveMoment);
    };
  }, []);

  function startReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("review")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="ctrl+love home">
          ctrl+love
        </Link>
        <span>Living Decision Review</span>
      </header>

      <section className={`${styles.section} ${styles.hero}`} aria-labelledby="hero-title">
        <p className={styles.kicker}>Live product</p>
        <h1 id="hero-title">A decision room that thinks in public.</h1>
        <p className={styles.heroCopy}>
          Bring one unresolved decision. The room turns it into tension, opposition,
          evidence, and a recommendation you can defend.
        </p>

        <form className={styles.decisionInput} onSubmit={startReview} aria-label="Decision example">
          <label htmlFor="decision">Decision</label>
          <div>
            <input id="decision" readOnly value={decision} />
            <button
              type="submit"
            >
              Start review
            </button>
          </div>
        </form>
      </section>

      <section
        className={`${styles.section} ${styles.review}`}
        id="review"
        aria-labelledby="review-title"
        ref={reviewRef}
      >
        <div className={styles.reviewHeader}>
          <div>
            <p className={styles.kicker}>Review in progress.</p>
            <h2 id="review-title">The decision evolves in public.</h2>
          </div>

          <aside
            className={styles.consensusCard}
            aria-label="Consensus"
            style={
              {
                "--consensus-progress": `${consensusPercent}%`,
              } as CSSProperties
            }
          >
            <span>Consensus</span>
            <strong>{consensusPercent}%</strong>
            <p>{activeReview.label}</p>
            <i aria-hidden="true" />
          </aside>
        </div>

        <ol
          className={styles.reviewTrail}
          style={
            {
              "--review-progress": `${reviewProgress * 100}%`,
            } as CSSProperties
          }
        >
          {reviewMoments.map((moment, index) => {
            const relation = activeMoment < 0
              ? "future"
              : index < activeMoment
                ? "past"
                : index === activeMoment
                  ? "current"
                  : index === activeMoment + 1
                    ? "next"
                  : "future";

            return (
            <li
              className={styles.reviewMoment}
              data-relation={relation}
              key={moment.label}
            >
              <article>
                <div className={styles.momentMeta}>
                  <span>{moment.label}</span>
                  {moment.badge ? <em>{moment.badge}</em> : null}
                </div>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
                {moment.revision ? (
                  <div className={styles.revision}>
                    <span>Previous</span>
                    <s>{moment.previous}</s>
                    <span>Updated</span>
                    <strong>{moment.revision}</strong>
                  </div>
                ) : null}
              </article>
            </li>
            );
          })}
        </ol>
      </section>

      <section className={`${styles.section} ${styles.product}`} aria-labelledby="product-title">
        <p className={styles.kicker}>What it does</p>
        <h2 id="product-title">One decision in. A tested recommendation out.</h2>
        <p>
          The product is a structured argument engine.
          <br />
          It does not summarize a decision. It makes the decision withstand
          pressure before the outside world gets a vote.
        </p>

        <dl className={styles.productRows}>
          {productRows.map((row) => (
            <div key={row.term}>
              <dt>{row.term}</dt>
              <dd>{row.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${styles.section} ${styles.close}`} aria-labelledby="close-title">
        <h2 id="close-title">
          Built by observation. Designed for conflict. Made for better decisions.
        </h2>
        <Link href="/stress-test">Bring your own decision into the room</Link>
      </section>
    </main>
  );
}
