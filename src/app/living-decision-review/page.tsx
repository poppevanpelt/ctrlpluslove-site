"use client";

import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";

import styles from "./living-decision-review.module.css";

const decision = "Should Suki launch a Matcha Subscription?";

const minds = [
  {
    name: "Maya",
    title: "Emotional Pull",
    thought: "Customers don't buy subscriptions. They buy reassurance.",
    status: "Contested",
  },
  {
    name: "Simon",
    title: "Skeptical Strategist",
    thought: "Too early. Loyalty is not proven yet.",
    status: "Open",
  },
  {
    name: "Lexi",
    title: "Brand Risk",
    thought: "Efficiency could make Suki feel less cared for.",
    status: "Open",
  },
  {
    name: "Mira",
    title: "Business Logic",
    thought: "Margins work. Churn decides everything.",
    status: "Open",
  },
  {
    name: "Akiko",
    title: "Japanese Nuance",
    thought: "Respect the ritual. Matcha is not just a flavor.",
    status: "Open",
  },
  {
    name: "Wade",
    title: "Evidence",
    thought: "Daily rituals behave differently from convenience refills.",
    status: "Shifted",
  },
  {
    name: "Vera",
    title: "Cultural Timing",
    thought: "Matcha is moving from trend to ritual.",
    status: "Aligned",
  },
];

const statusFlow = [
  "Open",
  "Contested",
  "Evidence added",
  "Perspective shifted",
  "Consensus emerging",
];

const productBlocks = [
  {
    title: "Bring your decision",
    body: "Enter a real strategic question.",
  },
  {
    title: "Watch the room",
    body: "Different perspectives test assumptions, disagree, challenge each other and evolve.",
  },
  {
    title: "Leave with sharper judgment",
    body: "Not just an answer. A visible reasoning process.",
  },
];

const differencePoints = [
  "Designed disagreement",
  "Opinions can change",
  "Evidence changes conclusions",
  "Human signals matter",
  "The process is as valuable as the answer",
];

export default function LivingDecisionReview() {
  const [demoStarted, setDemoStarted] = useState(false);

  function startDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDemoStarted(true);

    window.setTimeout(() => {
      document.getElementById("room")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  return (
    <main className={`${styles.page} ${demoStarted ? styles.demoStarted : ""}`}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="ctrl+love home">
          ctrl+love
        </Link>
        <span>Living Decision Review</span>
      </header>

      <section className={`${styles.section} ${styles.hero}`} aria-labelledby="hero-title">
        <p className={styles.kicker}>Product demo</p>
        <h1 id="hero-title">Watch a decision change its mind.</h1>
        <p className={styles.heroLine}>
          Bring any important business decision into a room of distinct strategic
          minds and watch better judgment emerge.
        </p>

        <form className={styles.decisionInput} onSubmit={startDemo} aria-label="Decision example">
          <label htmlFor="decision">Decision</label>
          <div>
            <input id="decision" readOnly value={decision} />
            <button type="submit">{demoStarted ? "Demo running" : "Start the demo"}</button>
          </div>
        </form>
      </section>

      <section className={styles.section} id="room" aria-labelledby="room-title">
        <div className={styles.sectionLead}>
          <p className={styles.kicker}>The room gathers</p>
          <h2 id="room-title">Every important decision deserves more than one perspective.</h2>
        </div>

        <div className={styles.demoState} aria-live="polite">
          <span>{demoStarted ? "Demo started" : "Waiting to start"}</span>
          <p>
            {demoStarted
              ? "Seven named minds join, take positions and begin pressure-testing the decision."
              : "Use Start the demo above to bring the decision into the room."}
          </p>
        </div>

        <div className={styles.room} aria-label="Seven minds around the room">
          <div className={styles.roomQuestion}>
            <span>The decision enters</span>
            <p>{decision}</p>
          </div>

          {minds.map((mind, index) => {
            const angle = (index / minds.length) * 360 - 90;

            return (
              <article
                className={styles.mind}
                key={mind.name}
                style={
                  {
                    "--angle": `${angle}deg`,
                    "--delay": `${index * 120}ms`,
                  } as CSSProperties
                }
              >
                <strong>{mind.name}</strong>
                <span>{mind.title}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="reactions-title">
        <div className={styles.sectionLead}>
          <p className={styles.kicker}>Initial reactions</p>
          <h2 id="reactions-title">The room does not start in agreement.</h2>
        </div>

        <div className={styles.reactionGrid}>
          {minds.map((mind) => (
            <article className={styles.reaction} key={mind.name}>
              <span>{mind.name}</span>
              <em>{mind.title}</em>
              <p>{mind.thought}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="conflict-title">
        <div className={styles.conflict}>
          <div className={styles.sectionLead}>
            <p className={styles.kicker}>Conflict</p>
            <h2 id="conflict-title">One position becomes contested.</h2>
          </div>

          <div className={styles.challenge}>
            <article>
              <span>Maya</span>
              <p>Launch it. The emotional pull is strong.</p>
            </article>
            <article>
              <span>Simon</span>
              <p>I don&apos;t buy it yet. This could create subscription fatigue before loyalty.</p>
            </article>
          </div>

          <div className={styles.statusFlow} aria-label="Status changes">
            {statusFlow.map((status) => (
              <span key={status}>{status}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="consensus-title">
        <div className={styles.consensus}>
          <div className={styles.sectionLead}>
            <p className={styles.kicker}>Consensus</p>
            <h2 id="consensus-title">The room changes its mind.</h2>
          </div>

          <div className={styles.recommendation}>
            <article>
              <span>Original recommendation</span>
              <p>Launch subscriptions.</p>
            </article>
            <div className={styles.arrow} aria-hidden="true">
              ↓
            </div>
            <article>
              <span>Final recommendation</span>
              <p>Launch ritual-based replenishment.</p>
            </article>
          </div>

          <div className={styles.reason}>
            <p>Don&apos;t sell convenience.</p>
            <p>Protect the daily ritual.</p>
          </div>

          <div className={styles.confidence} aria-label="Confidence improves from 78% to 86%">
            <span>78%</span>
            <div />
            <span>86%</span>
          </div>
        </div>
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

      <section className={styles.section} aria-labelledby="different-title">
        <div className={styles.sectionLead}>
          <p className={styles.kicker}>Why it works</p>
          <h2 id="different-title">The thinking is visible.</h2>
        </div>

        <div className={styles.differenceGrid}>
          {differencePoints.map((point) => (
            <p key={point}>{point}</p>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.close}`} aria-label="Closing">
        <div>
          <p>Built by observation.</p>
          <p>Designed for conflict.</p>
          <p>Made for better decisions.</p>
        </div>
        <a href="#room">Bring your own decision into the room</a>
      </section>
    </main>
  );
}
