"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import styles from "./living-decision-review.module.css";

const scenes = [
  {
    id: "question",
    title: "Question enters",
    body: (
      <div className={`${styles.frame} ${styles.narrow} ${styles.fadeUp}`}>
        <p className={styles.kicker}>The Moment the Room Changes Its Mind</p>
        <h1>Should we launch the new campaign platform now?</h1>
        <p className={styles.support}>
          The room starts with an answer. Then the evidence arrives.
        </p>
        <a className={styles.startButton} href="#initial">
          Start the room
        </a>
      </div>
    ),
  },
  {
    id: "initial",
    title: "Initial recommendation",
    body: (
      <div className={`${styles.frame} ${styles.decisionGrid} ${styles.fadeUp}`}>
        <div className={styles.panel}>
          <p className={styles.kicker}>Initial recommendation</p>
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Recommendation</span>
            <strong className={`${styles.metricValue} ${styles.small}`}>Launch</strong>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Confidence</span>
            <strong className={styles.metricValue}>68%</strong>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Room mood</span>
            <strong className={`${styles.metricValue} ${styles.small}`}>Cautiously positive</strong>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.kicker}>Why launch feels plausible</p>
          <ul className={styles.argumentList}>
            <li>The platform gives the brand new energy.</li>
            <li>Internal momentum is high.</li>
            <li>The launch window is available.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "mira",
    title: "First challenge",
    body: (
      <div className={`${styles.frame} ${styles.fadeUp}`}>
        <Challenge name="Mira Voss" role="Commercial Reality">
          Momentum is not the same as market readiness.
        </Challenge>
        <Effect
          items={[
            ["Confidence", "68% -> 61%"],
            ["Recommendation", "Launch"],
            ["Signal", "First doubt", true],
          ]}
        />
      </div>
    ),
  },
  {
    id: "wade",
    title: "Evidence enters",
    body: (
      <div className={`${styles.frame} ${styles.fadeUp}`}>
        <Challenge name="Wade Mercer" role="Evidence">
          Awareness is stable, but consideration is falling.
        </Challenge>
        <p className={styles.support}>
          The campaign may create attention without solving conversion.
        </p>
        <Effect
          items={[
            ["Confidence", "61% -> 54%"],
            ["Recommendation", "Hold / Reframe", true],
            ["Turning point", "Visible"],
          ]}
        />
        <div className={styles.turningPoint}>
          <strong>Recommendation changes here.</strong>
          First visible turning point: the room no longer agrees on the question.
        </div>
      </div>
    ),
  },
  {
    id: "maya",
    title: "Question reframed",
    body: (
      <div className={`${styles.frame} ${styles.fadeUp}`}>
        <Challenge name="Maya Elise Harper" role="Human Insight">
          People do not need a louder campaign. They need a clearer reason to care.
        </Challenge>
        <div className={styles.questionChange}>
          <p className={styles.oldQuestion}>
            Should we launch the new campaign platform now?
          </p>
          <p className={styles.newQuestion}>
            What must be true before this platform deserves a launch?
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "simon",
    title: "Skeptic pressure",
    body: (
      <div className={`${styles.frame} ${styles.fadeUp}`}>
        <Challenge name="Simon Cross" role="Constructive Skeptic">
          Are we launching because the market needs it, or because the deck is finished?
        </Challenge>
        <Effect
          items={[
            ["Room mood", "Contested", true],
            ["Confidence", "54% -> 49%"],
            ["Logic", "Pressure test"],
          ]}
        />
      </div>
    ),
  },
  {
    id: "lexi",
    title: "Brand memory",
    body: (
      <div className={`${styles.frame} ${styles.fadeUp}`}>
        <Challenge name="Lexi Arden" role="Brand Memory">
          A platform is not remembered because it is new.
        </Challenge>
        <p className={styles.support}>
          It is remembered because it makes old strengths easier to recognize.
        </p>
        <Effect
          items={[
            ["Recommendation", "Proof sprint first", true],
            ["Confidence", "49% -> 63%"],
            ["Reason", "Sharper test"],
          ]}
        />
      </div>
    ),
  },
  {
    id: "final",
    title: "Final recommendation",
    body: (
      <div className={`${styles.frame} ${styles.finalCard} ${styles.fadeUp}`}>
        <div className={styles.finalPanel}>
          <p className={styles.kicker}>Final recommendation</p>
          <h2>Do not launch the platform yet.</h2>
        </div>
        <div className={styles.panel}>
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Next move</span>
            <strong className={`${styles.metricValue} ${styles.small}`}>
              10-day proof sprint
            </strong>
          </div>
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Confidence</span>
            <strong className={styles.metricValue}>72%</strong>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.kicker}>What to test</p>
          <ul className={styles.testList}>
            <li>Does the platform sharpen the customer promise?</li>
            <li>Does it improve consideration, not just attention?</li>
            <li>Can the strongest idea survive outside the presentation?</li>
          </ul>
        </div>
        <div className={styles.panel}>
          <p className={styles.endLine}>
            The decision did not get slower.
            <span>It got smarter.</span>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "outro",
    title: "End frame",
    body: (
      <div className={`${styles.frame} ${styles.narrow} ${styles.fadeUp}`}>
        <p className={styles.kicker}>End frame</p>
        <h2>One unresolved business question in.</h2>
        <p className={styles.endLine}>One recommendation worth defending out.</p>
        <p className={styles.productSignal}>
          ctrl+love turns disagreement into a decision you can defend.
        </p>
      </div>
    ),
  },
];

function Challenge({
  children,
  name,
  role,
}: {
  children: React.ReactNode;
  name: string;
  role: string;
}) {
  return (
    <div className={styles.challenge}>
      <div className={styles.persona}>
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
      <p className={styles.quote}>{children}</p>
    </div>
  );
}

function Effect({ items }: { items: Array<[string, string, boolean?]> }) {
  return (
    <div className={styles.effect}>
      {items.map(([label, value, blue]) => (
        <div className={styles.effectItem} key={label}>
          <span>{label}</span>
          <strong className={blue ? styles.blue : undefined}>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function LivingDecisionReview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const timerRef = useRef<number | null>(null);

  function scrollToScene(index: number) {
    const nextIndex = Math.max(0, Math.min(index, scenes.length - 1));
    sceneRefs.current[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const nextIndex = sceneRefs.current.indexOf(visible.target as HTMLElement);
        if (nextIndex >= 0) {
          setActiveIndex(nextIndex);
          if (nextIndex === scenes.length - 1) setIsPlaying(false);
        }
      },
      { threshold: [0.42, 0.58, 0.72] },
    );

    sceneRefs.current.forEach((scene) => {
      if (scene) observer.observe(scene);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= scenes.length - 1) {
          setIsPlaying(false);
          return current;
        }

        scrollToScene(current + 1);
        return current;
      });
    }, 5200);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <main className={styles.page}>
      <div className={styles.progress} aria-hidden="true" />
      <div className={styles.episodeLabel}>
        ctrl+love decision simulator / episode 002
      </div>
      <Link className={styles.returnLink} href="/">
        Return to ctrl+love
      </Link>
      <nav className={styles.sceneNav} aria-label="Episode navigation">
        {scenes.map((scene, index) => (
          <a
            aria-label={scene.title}
            className={index === activeIndex ? styles.isActive : undefined}
            href={`#${scene.id}`}
            key={scene.id}
          />
        ))}
      </nav>
      <div className={styles.scrollControls} aria-label="Scroll controls">
        <button
          className={styles.scrollControl}
          disabled={activeIndex === 0}
          type="button"
          onClick={() => scrollToScene(activeIndex - 1)}
          aria-label="Previous scene"
        >
          ↑
        </button>
        <span className={styles.sceneCount} aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
        </span>
        <button
          className={`${styles.scrollControl} ${styles.playControl}`}
          type="button"
          onClick={() => {
            if (activeIndex === scenes.length - 1) scrollToScene(0);
            setIsPlaying((playing) => !playing);
          }}
          aria-label={isPlaying ? "Pause episode" : "Play episode"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          className={styles.scrollControl}
          disabled={activeIndex === scenes.length - 1}
          type="button"
          onClick={() => scrollToScene(activeIndex + 1)}
          aria-label="Next scene"
        >
          ↓
        </button>
      </div>

      {scenes.map((scene, index) => (
        <section
          className={`${styles.scene} ${index === activeIndex ? styles.isCurrent : ""} ${
            scene.id === "outro" ? styles.outro : ""
          }`}
          data-title={scene.title}
          id={scene.id}
          key={scene.id}
          ref={(node) => {
            sceneRefs.current[index] = node;
          }}
        >
          {scene.body}
        </section>
      ))}
    </main>
  );
}
