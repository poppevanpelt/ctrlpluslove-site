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
  const chamberClass = styles.chamber;

  return (
    <main
      className={embedded ? `${styles.page} ${styles.embedded}` : styles.page}
      aria-labelledby="decision-collider-title"
    >
      {embedded ? null : (
        <Link className={styles.returnLink} href="/instruments/">
          Return to Instrument Cabinet
        </Link>
      )}

      <header className={styles.header}>
        <p className={styles.kicker}>Instrument No. 001</p>
        <h1 id="decision-collider-title">Decision Collider</h1>
        <p className={styles.decision}>Should we launch this product now?</p>
        <p className={styles.kicker}>Illustrative scenario / not a live measurement</p>
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
          <svg className={styles.machine} viewBox="0 0 400 400" role="img" aria-label={`Illustrative decision specimen, stage ${stage.name}. Five perspectives and one missing seat.`}>
            <defs>
              <radialGradient id="dc-metal"><stop stopColor="#d9d5c7"/><stop offset=".45" stopColor="#8c928d"/><stop offset="1" stopColor="#333a39"/></radialGradient>
              <radialGradient id="dc-core"><stop stopColor="#f7e8c7"/><stop offset="1" stopColor="#b98b49"/></radialGradient>
            </defs>
            <circle cx="200" cy="200" r="157" fill="#292e2d" stroke="#757c76" strokeWidth="2"/>
            <circle cx="200" cy="200" r="140" fill="#111515" stroke="#464e49" strokeWidth="9"/>
            {Array.from({length:60},(_,i)=><line key={i} x1="200" y1="59" x2="200" y2={i%5===0?72:65} stroke="#8b9389" strokeWidth={i%5===0?1.6:.7} transform={`rotate(${i*6} 200 200)`}/>)}
            {["CUSTOMER","FINANCE","LEGAL","BRAND","OPERATIONS","MISSING SEAT"].map((label,i)=>{
              const a=i*Math.PI/3, missing=i===5;
              return <g key={label}>
                <g transform={`rotate(${i*60} 200 200)`}>
                  <g className={activeStage>=3&&!missing?styles.actuatorEngaged:styles.actuator}>
                    <rect x="183" y="76" width="34" height="49" rx="3" fill={missing?"none":"url(#dc-metal)"} stroke={missing?"#d9aa6b":"#929b91"} strokeDasharray={missing?"4 3":undefined}/>
                    <path d="M193 125 V148 H207 V125" fill={missing?"none":"#a8aea6"} stroke="#929b91"/>
                    <path d="M200 148 V159" stroke="#e7a46b" strokeDasharray={missing?"3 3":undefined} strokeWidth="2"/>
                  </g>
                </g>
                <text x={200+174*Math.sin(a)} y={203-174*Math.cos(a)} textAnchor="middle" fill={missing?"#e4bd81":"#c6ccc3"} fontSize="9" fontFamily="monospace">{label}</text>
              </g>;
            })}
            <circle cx="200" cy="200" r="52" fill="none" stroke="#bb7645" strokeDasharray="3 5" opacity={activeStage>=3?1:.25}/>
            <g className={styles.specimen} style={{transform:`rotate(${activeStage===1?45:0}deg) scale(${activeStage===3?.85:activeStage===4?1.15:1})`}}>
              <rect x={activeStage===2?158:166} y={activeStage===2?177:166} width={activeStage===2?84:68} height={activeStage===2?46:68} rx={activeStage===2?7:activeStage===1?13:34} fill={activeStage===4?"#333b39":activeStage===5?"#91b59b":"url(#dc-core)"} stroke="#f5d9a5" strokeWidth="1.5"/>
            </g>
            <text x="200" y="198" textAnchor="middle" fill={activeStage===4?"#f7e8c7":"#24221d"} fontSize="9" fontWeight="bold">DECISION</text>
            <text x="200" y="211" textAnchor="middle" fill={activeStage===4?"#f7e8c7":"#423629"} fontSize="7">SPECIMEN 01</text>
          </svg>
        </div>

        <div className={styles.output}><StageOutputView output={stage.output} /></div>
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
          onClick={() => setActiveStage(activeStage === stages.length - 1 ? 0 : activeStage + 1)}
        >
          {stage.button}
        </button>
      </footer>
    </main>
  );
}
