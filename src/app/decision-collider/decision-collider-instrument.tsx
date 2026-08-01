"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./decision-collider.module.css";

const stages = [
  {
    name: "OBSERVE",
    purpose: "Collect reality signals.",
    output: "Reality signals enter the decision.",
    button: "CONTINUE",
  },
  {
    name: "INTERPRET",
    purpose: "Organize what those signals may mean.",
    output: "Signals are arranged without becoming a verdict.",
    button: "CONTINUE",
  },
  {
    name: "FRAME",
    purpose: "Reveal the assumptions already built into the decision.",
    output: "The decision object exposes the frame it already carries.",
    button: "CONTINUE TO COLLISION",
  },
  {
    name: "COLLIDE",
    purpose: "Apply distinct forces and perspectives to the framed decision.",
    output:
      "CUSTOMER, FINANCE, LEGAL, BRAND, OPERATIONS, and THE MISSING SEAT converge.",
    button: "VIEW DETECTIONS",
  },
  {
    name: "DETECT",
    purpose:
      "Reveal tensions, contradictions, missing evidence, and hidden assumptions.",
    output: [
      [
        "ASSUMPTION EXPOSED",
        "The launch date is being treated as fixed without clear evidence.",
      ],
      [
        "TENSION DETECTED",
        "Commercial urgency and operational readiness are pulling in different directions.",
      ],
      [
        "EVIDENCE MISSING",
        "Customer demand has not yet been tested strongly enough.",
      ],
      [
        "UNCERTAINTY REMAINS",
        "The cost of delaying is clearer than the cost of launching early.",
      ],
    ],
    button: "MAKE YOUR DECISION",
  },
  {
    name: "DECIDE",
    purpose: "Return judgment and responsibility to the human.",
    output: {
      statement: [
        "The instrument has revealed what is under pressure.",
        "The decision remains yours.",
      ],
      actions: ["DECIDE NOW", "REFRAME THE DECISION", "INVESTIGATE FURTHER"],
    },
    button: "RESET",
  },
] as const;

type StageOutput = (typeof stages)[number]["output"];
type DecisionReturn = Extract<StageOutput, { statement: readonly string[] }>;

function isDecisionReturn(output: StageOutput): output is DecisionReturn {
  return typeof output === "object" && !Array.isArray(output) && "statement" in output;
}

function StageOutputView({ output }: { output: StageOutput }) {
  if (Array.isArray(output)) {
    return (
      <ol className={styles.findings}>
        {output.map(([label, text]) => (
          <li key={label}>
            <strong>{label}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (isDecisionReturn(output)) {
    return (
      <div className={styles.decisionReturn}>
        {output.statement.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <div className={styles.humanActions}>
          {output.actions.map((action) => (
            <span key={action}>{action}</span>
          ))}
        </div>
      </div>
    );
  }

  return <p>{output}</p>;
}

export function DecisionColliderInstrument({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [activeStage, setActiveStage] = useState(0);
  const stage = stages[activeStage];
  const chamberClass = `${styles.chamber} ${
    styles[`stage${stage.name[0]}${stage.name.slice(1).toLowerCase()}`]
  }`;

  return (
    <main
      className={embedded ? `${styles.page} ${styles.embedded}` : styles.page}
      aria-labelledby="decision-collider-title"
    >
      {embedded ? null : (
        <Link className={styles.returnLink} href="/">
          Return to ctrl+love
        </Link>
      )}

      <header className={styles.header}>
        <p className={styles.kicker}>Instrument No. 001</p>
        <h1 id="decision-collider-title">Decision Collider</h1>
        <p className={styles.decision}>Should we launch this product now?</p>
      </header>

      <section className={styles.stage} aria-live="polite">
        <div className={styles.stageCopy}>
          <p className={styles.count}>
            {String(activeStage + 1).padStart(2, "0")} / 06
          </p>
          <h2>{stage.name}</h2>
          <p className={styles.purpose}>{stage.purpose}</p>
        </div>

        <div className={chamberClass} aria-label="Decision transformation">
          <div className={styles.transformation} aria-hidden="true" />
          <div className={`${styles.force} ${styles.forceCustomer}`}>
            <span>CUSTOMER</span>
          </div>
          <div className={`${styles.force} ${styles.forceFinance}`}>
            <span>FINANCE</span>
          </div>
          <div className={`${styles.force} ${styles.forceLegal}`}>
            <span>LEGAL</span>
          </div>
          <div className={`${styles.force} ${styles.forceBrand}`}>
            <span>BRAND</span>
          </div>
          <div className={`${styles.force} ${styles.forceOperations}`}>
            <span>OPERATIONS</span>
          </div>
          <div className={`${styles.force} ${styles.forceMissing}`}>
            <span>THE MISSING SEAT</span>
          </div>
          <div className={styles.particle}>
            <span className={styles.particleLabel}>Decision</span>
          </div>
          <div className={styles.collisionRipple} aria-hidden="true" />
        </div>

        <div className={styles.output}>
          <StageOutputView output={stage.output} />
        </div>
      </section>

      <footer className={styles.controls}>
        <p className={styles.stageLine}>
          {stages.map((item, itemIndex) => (
            <button
              aria-current={itemIndex === activeStage ? "step" : undefined}
              className={itemIndex === activeStage ? styles.activeStage : undefined}
              key={item.name}
              onClick={() => setActiveStage(itemIndex)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </p>
        <button
          className={styles.next}
          type="button"
          onClick={() =>
            setActiveStage(activeStage === stages.length - 1 ? 0 : activeStage + 1)
          }
        >
          {stage.button}
        </button>
      </footer>
    </main>
  );
}
