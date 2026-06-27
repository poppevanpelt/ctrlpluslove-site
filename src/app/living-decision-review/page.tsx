"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import styles from "./living-decision-review.module.css";

type MindStatus = "Waiting" | "Open" | "Contested" | "Shifted" | "Aligned";

type Mind = {
  id: string;
  name: string;
  lens: string;
  initial: string;
};

type TranscriptLine = {
  stage: number;
  speaker: string;
  text: string;
};

const minds: Mind[] = [
  {
    id: "maya",
    name: "Maya",
    lens: "emotional pull",
    initial: "Launch subscription",
  },
  {
    id: "mira",
    name: "Mira",
    lens: "business logic",
    initial: "Open",
  },
  {
    id: "wade",
    name: "Wade",
    lens: "evidence",
    initial: "Waiting for signal",
  },
  {
    id: "vera",
    name: "Vera",
    lens: "cultural timing",
    initial: "Open",
  },
  {
    id: "lexi",
    name: "Lexi",
    lens: "brand risk",
    initial: "Concerned",
  },
  {
    id: "simon",
    name: "Simon",
    lens: "skeptical strategist",
    initial: "Against",
  },
  {
    id: "akiko",
    name: "Akiko",
    lens: "Japanese nuance",
    initial: "Careful",
  },
];

const stages = [
  "Question enters",
  "Seven minds join",
  "Initial positions",
  "Disagreement",
  "Contested",
  "Evidence changes the room",
  "Consensus shifts",
  "Recommendation",
];

const transcript: TranscriptLine[] = [
  {
    stage: 2,
    speaker: "Maya",
    text: "Customers are not buying subscriptions. They are buying the comfort of not running out.",
  },
  {
    stage: 2,
    speaker: "Mira",
    text: "The economics can work, but churn is the real risk.",
  },
  {
    stage: 3,
    speaker: "Simon",
    text: "I don't buy it yet. This could create subscription fatigue before loyalty.",
  },
  {
    stage: 5,
    speaker: "Wade",
    text: "Subscription fatigue is real, but daily rituals behave differently from convenience refills.",
  },
  {
    stage: 5,
    speaker: "Vera",
    text: "The cultural timing is good. Matcha is moving from trend to ritual.",
  },
  {
    stage: 5,
    speaker: "Akiko",
    text: "Be careful. In Japan, matcha is not just a flavor. It carries ceremony, restraint and respect.",
  },
  {
    stage: 6,
    speaker: "Lexi",
    text: "The brand risk is making Suki feel too efficient. The subscription should feel like care, not commerce.",
  },
];

const productBlocks = [
  {
    title: "Bring in the decision",
    body: "You start with a real business question, not a prompt.",
  },
  {
    title: "Watch the room work",
    body: "Different minds pressure-test the decision from emotion, business, evidence, culture, brand and skepticism.",
  },
  {
    title: "Leave with sharper judgment",
    body: "The output is not just an answer. It is the visible path to a better decision.",
  },
];

const differencePoints = [
  "Disagreement is designed in",
  "Opinions can change",
  "Assumptions are made visible",
  "Human signals matter",
  "The process is as valuable as the answer",
];

function statusForMind(id: string, stage: number): MindStatus {
  if (stage < 1) return "Waiting";
  if (stage < 4) return "Open";
  if (id === "maya" && stage === 4) return "Contested";
  if (stage < 6) return id === "maya" ? "Contested" : "Open";
  if (stage < 7) return id === "simon" || id === "maya" || id === "wade" ? "Shifted" : "Open";
  return "Aligned";
}

function confidenceForStage(stage: number) {
  if (stage < 5) return 78;
  if (stage === 5) return 81;
  if (stage === 6) return 84;
  return 86;
}

export default function LivingDecisionReview() {
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(true);

  const visibleTranscript = useMemo(
    () => transcript.filter((line) => line.stage <= stage),
    [stage],
  );
  const confidence = confidenceForStage(stage);
  const activeSpeaker = visibleTranscript[visibleTranscript.length - 1]?.speaker;
  const consensus =
    stage >= 7
      ? "Do not sell it as a subscription. Sell it as: Never run out of your daily ritual."
      : stage >= 6
        ? "Launch ritual-based replenishment."
        : stage >= 3
          ? "Subscription may create fatigue before loyalty."
          : "Launch subscription.";

  useEffect(() => {
    if (!running) return;

    const timers = stages.map((_, index) =>
      window.setTimeout(() => {
        setStage(index);
        if (index === stages.length - 1) {
          window.setTimeout(() => setRunning(false), 900);
        }
      }, index * 1450),
    );

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [running]);

  function startRoom() {
    setStage(0);
    setRunning(false);
    window.setTimeout(() => setRunning(true), 60);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="ctrl+love home">
          ctrl+love
        </Link>
        <span>Living Decision Review</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Product demo</p>
          <h1>Watch a decision change its mind.</h1>
          <p className={styles.subline}>
            Living Decision Review brings your decision into a room of distinct
            strategic minds, so you can see assumptions tested, disagreement
            surface, and judgment improve before you act.
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={startRoom}>
              Try the room
            </button>
            <a href="#how-it-works">See how it works</a>
          </div>
        </div>

        <section className={styles.demo} aria-label="Live decision review demo">
          <div className={styles.demoHeader}>
            <div>
              <span>Decision</span>
              <h2>Should Suki launch a Matcha Subscription?</h2>
            </div>
            <div className={styles.confidence} aria-label={`Confidence ${confidence}%`}>
              <span>Confidence</span>
              <strong>{confidence}%</strong>
              <em>{stage >= 7 ? "78% to 86%" : "78% to 86%"}</em>
            </div>
          </div>

          <div className={styles.roomGrid}>
            <div className={styles.room} aria-label="Seven named minds">
              <div className={styles.roomCenter}>
                <span>{stages[stage]}</span>
                <p>{consensus}</p>
              </div>

              {minds.map((mind, index) => {
                const angle = (index / minds.length) * 360 - 90;
                const status = statusForMind(mind.id, stage);
                const active = activeSpeaker === mind.name || (stage === 1 && index <= stage + 2);

                return (
                  <article
                    className={styles.mind}
                    data-status={status}
                    data-active={active ? "true" : undefined}
                    key={mind.id}
                    style={{ "--angle": `${angle}deg` } as React.CSSProperties}
                  >
                    <strong>{mind.name}</strong>
                    <span>{mind.lens}</span>
                    <em>{status}</em>
                  </article>
                );
              })}
            </div>

            <aside className={styles.transcript} aria-label="Room transcript">
              <div className={styles.stageList}>
                {stages.map((label, index) => (
                  <span data-current={stage === index ? "true" : undefined} key={label}>
                    {index + 1}. {label}
                  </span>
                ))}
              </div>

              <div className={styles.lines}>
                {visibleTranscript.length === 0 ? (
                  <p className={styles.waiting}>The question enters the room.</p>
                ) : (
                  visibleTranscript.map((line) => (
                    <article
                      className={styles.line}
                      data-active={line.speaker === activeSpeaker ? "true" : undefined}
                      key={`${line.speaker}-${line.stage}`}
                    >
                      <span>{line.speaker}</span>
                      <p>{line.text}</p>
                    </article>
                  ))
                )}
              </div>

              <div className={styles.recommendation} data-visible={stage >= 6 ? "true" : undefined}>
                {stage >= 7 ? (
                  <>
                    <span>Consensus shift</span>
                    <p>From launch subscription to ritual-based replenishment.</p>
                    <span>Final recommendation</span>
                    <p>
                      Do not sell it as a subscription. Sell it as
                      <strong> Never run out of your daily ritual.</strong>
                    </p>
                  </>
                ) : stage >= 6 ? (
                  <>
                    <span>Consensus shift</span>
                    <p>From launch subscription to ritual-based replenishment.</p>
                  </>
                ) : (
                  <>
                    <span>Recommendation</span>
                    <p>Waiting for the room to move.</p>
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>
      </section>

      <section className={styles.how} id="how-it-works" aria-labelledby="how-title">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>How it works</p>
          <h2 id="how-title">A room for decisions that deserve pressure.</h2>
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

      <section className={styles.difference} aria-labelledby="different-title">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>What makes it different</p>
          <h2 id="different-title">Better judgment is visible while it forms.</h2>
        </div>
        <div className={styles.differenceGrid}>
          {differencePoints.map((point) => (
            <p key={point}>{point}</p>
          ))}
        </div>
      </section>

      <section className={styles.close}>
        <p>Built by observation.</p>
        <p>Designed for conflict.</p>
        <p>Made for better decisions.</p>
      </section>
    </main>
  );
}
