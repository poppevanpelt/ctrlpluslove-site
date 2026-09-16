"use client";

import { useState } from "react";
import styles from "./brand-survival.module.css";

type Stage = {
  short: string;
  label: string;
  removed: string;
  question: string;
};

const stages: readonly Stage[] = [
  {
    short: "FULL",
    label: "Full execution",
    removed: "Nothing removed.",
    question: "Can we recognise the source while every identifier is still doing the work?",
  },
  {
    short: "MARK",
    label: "Logo removed",
    removed: "Logo / mark",
    question: "Does the execution still have a pulse when the mark disappears?",
  },
  {
    short: "IDENTITY",
    label: "Name + signature colour removed",
    removed: "Logo / name / signature colour",
    question: "Is there anything distinctive left once the obvious identity system is gone?",
  },
  {
    short: "CATEGORY",
    label: "Expected category codes removed",
    removed: "Identity / category language / expected visual codes",
    question: "Does the thing survive without leaning on the category to explain itself?",
  },
  {
    short: "STRIPPED",
    label: "Only the underlying behaviour remains",
    removed: "Everything except behaviour / voice / structure / idea",
    question: "Could this still plausibly have come from only one brand?",
  },
];

// Calibration trace only. Batch measurements replace these values when evidence is loaded.
const brandTrace = [96, 89, 78, 64, 47] as const;
const wallpaperTrace = [96, 67, 34, 8, 5] as const;

const chart = {
  width: 1200,
  height: 620,
  left: 88,
  right: 1092,
  top: 78,
  bottom: 526,
};

const xFor = (index: number) =>
  chart.left + ((chart.right - chart.left) * index) / (stages.length - 1);

const yFor = (value: number) =>
  chart.bottom - ((chart.bottom - chart.top) * value) / 100;

function pathFor(values: readonly number[]) {
  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(value)}`)
    .join(" ");
}

export default function BrandSurvival() {
  const [activeStage, setActiveStage] = useState(stages.length - 1);
  const [runStarted, setRunStarted] = useState(false);

  const active = stages[activeStage];
  const brandY = yFor(brandTrace[activeStage]);
  const wallpaperY = yFor(wallpaperTrace[activeStage]);
  const probeX = xFor(activeStage);

  function advance() {
    if (!runStarted || activeStage === stages.length - 1) {
      setRunStarted(true);
      setActiveStage(0);
      return;
    }
    setActiveStage((value) => Math.min(value + 1, stages.length - 1));
  }

  return (
    <section className={styles.instrument} aria-labelledby="brand-survival-title">
      <div className={styles.heading}>
        <div>
          <p>Instrument 024 / Test / Batch 001</p>
          <h1 id="brand-survival-title">BRAND<br />SURVIVAL</h1>
        </div>
        <div className={styles.thesis}>
          <strong>How much can we take away before it stops being you?</strong>
          <span>Keep removing. Watch what survives.</span>
        </div>
      </div>

      <div className={styles.tracePlate}>
        <div className={styles.plateTopline}>
          <span>SUBTRACTION TRACE</span>
          <span>REFERENCE SHAPE / NOT A SCORE</span>
          <span>BATCH 001</span>
        </div>

        <div className={styles.chartWrap}>
          <svg
            className={styles.chart}
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label="A brand survival curve stays alive as identifiers are removed while a wallpaper curve drops and flatlines."
          >
            <g className={styles.grid} aria-hidden="true">
              {[0, 1, 2, 3, 4].map((index) => (
                <line key={`v-${index}`} x1={xFor(index)} x2={xFor(index)} y1={chart.top} y2={chart.bottom} />
              ))}
              {[0, 25, 50, 75, 100].map((value) => (
                <line key={`h-${value}`} x1={chart.left} x2={chart.right} y1={yFor(value)} y2={yFor(value)} />
              ))}
            </g>

            <text className={styles.axisLabel} x="28" y="300" transform="rotate(-90 28 300)">
              DISTINCTIVENESS SURVIVING
            </text>
            <text className={styles.axisLabel} x="850" y="592">MORE REMOVED →</text>

            <path className={styles.brandGhost} d={pathFor(brandTrace)} />
            <path className={styles.wallpaperGhost} d={pathFor(wallpaperTrace)} />

            <path
              className={styles.brandLine}
              d={pathFor(brandTrace)}
              style={{ clipPath: `inset(0 ${100 - (activeStage / (stages.length - 1)) * 100}% 0 0)` }}
            />
            <path
              className={styles.wallpaperLine}
              d={pathFor(wallpaperTrace)}
              style={{ clipPath: `inset(0 ${100 - (activeStage / (stages.length - 1)) * 100}% 0 0)` }}
            />

            <line className={styles.probe} x1={probeX} x2={probeX} y1={chart.top - 18} y2={chart.bottom + 12} />
            <circle className={styles.brandPoint} cx={probeX} cy={brandY} r="8" />
            <circle className={styles.wallpaperPoint} cx={probeX} cy={wallpaperY} r="7" />

            <g className={styles.endLabels} aria-hidden="true">
              <text x={chart.right + 18} y={yFor(brandTrace[4]) + 5}>BRAND</text>
              <text x={chart.right + 18} y={yFor(wallpaperTrace[4]) + 5}>WALLPAPER</text>
            </g>
          </svg>
        </div>

        <div className={styles.stageRail} aria-label="Subtraction stages">
          {stages.map((stage, index) => (
            <button
              key={stage.short}
              type="button"
              className={index === activeStage ? styles.activeStage : ""}
              onClick={() => {
                setRunStarted(true);
                setActiveStage(index);
              }}
              aria-pressed={index === activeStage}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage.short}</strong>
              <small>{stage.label}</small>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.readout}>
        <div className={styles.readoutStage}>
          <span>CUT {String(activeStage + 1).padStart(2, "0")}</span>
          <strong>{active.label}</strong>
          <small>{active.removed}</small>
        </div>
        <p>{active.question}</p>
        <button type="button" onClick={advance}>
          {!runStarted || activeStage === stages.length - 1 ? "RUN SUBTRACTION" : "REMOVE NEXT"}
        </button>
      </div>

      <div className={styles.finding}>
        <span>PUBLIC OUTPUT</span>
        <strong>The picture is the proof object.</strong>
        <p>The raw curve stays visible. Any eventual score stays backstage until the evidence earns it.</p>
      </div>
    </section>
  );
}
