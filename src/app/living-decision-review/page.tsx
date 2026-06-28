"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";

import styles from "./living-decision-review.module.css";

const decision = "Should Suki launch a Matcha Subscription?";

const reviewMoments = [
  {
    label: "Question entered",
    title: "A launch decision enters.",
    text: "The review starts before anyone has agreed what kind of risk it is.",
  },
  {
    label: "Maya - emotional pull",
    title: "Launch it.",
    text: "The strongest pull is reassurance: never running out.",
  },
  {
    label: "Simon - skeptical strategist",
    title: "I don't buy it yet.",
    text: "This could create subscription fatigue before loyalty.",
    badge: "Contested",
  },
  {
    label: "Wade - evidence",
    title: "Ritual categories behave differently.",
    text: "Subscription fatigue is real, but ritual categories behave differently from convenience refills.",
    badge: "Evidence added",
  },
  {
    label: "Mira - business logic",
    title: "Margins can work.",
    text: "Churn decides everything.",
  },
  {
    label: "Akiko - Japanese nuance",
    title: "Respect the ritual.",
    text: "Matcha is not just a flavor.",
  },
  {
    label: "Recommendation updated",
    title: "Launch ritual-based replenishment.",
    text: "From: Launch subscriptions.",
    badge: "Shifted",
    revision: "Launch ritual-based replenishment.",
  },
  {
    label: "Consensus emerging",
    title: "86%",
    text: "The room is not louder. It is sharper.",
    badge: "Updated",
  },
];

const productRows = [
  {
    term: "Input",
    text: "A live decision, written in plain language. No deck, no prompt engineering, no theatre. The room first finds the hidden bet inside the question.",
  },
  {
    term: "Pressure",
    text: "Different minds argue from different jobs: customer, culture, money, consequence, evidence, emotion. The point is not to agree faster. It is to make the weak parts visible.",
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
  const consensusPercent = activeMoment < 0
    ? 0
    : Math.round((Math.max(activeMoment, 0) / (reviewMoments.length - 1)) * 86);

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
              style={{
                minWidth: "15rem",
                minHeight: "4.75rem",
                border: "3px solid #171512",
                background: "#171512",
                color: "#fffefa",
                padding: "0 1.8rem",
                fontSize: "1.12rem",
                fontWeight: 950,
                textTransform: "uppercase",
              }}
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
                    <s>Launch subscriptions.</s>
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
          The product is a structured argument engine. It does not summarize a decision.
          It makes the decision withstand pressure before the outside world gets a vote.
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
