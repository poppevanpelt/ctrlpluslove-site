"use client";

import { useState } from "react";
import {
  aggregateBatch001,
  batch001Observations,
  batch001Stages,
} from "./batch-001";
import styles from "./brand-survival.module.css";

const chart = {
  width: 1200,
  height: 620,
  left: 88,
  right: 1092,
  top: 78,
  bottom: 526,
};

const xFor = (index: number) =>
  chart.left + ((chart.right - chart.left) * index) / (batch001Stages.length - 1);

const yFor = (value: number) =>
  chart.bottom - ((chart.bottom - chart.top) * value) / 100;

function pathFor(values: readonly (number | null)[]) {
  let drawing = false;

  return values
    .map((value, index) => {
      if (value === null) {
        drawing = false;
        return "";
      }

      const command = drawing ? "L" : "M";
      drawing = true;
      return `${command} ${xFor(index)} ${yFor(value)}`;
    })
    .filter(Boolean)
    .join(" ");
}

function formatRate(value: number | null) {
  return value === null ? "NO DATA" : `${value}%`;
}

export default function BrandSurvival() {
  const [activeStage, setActiveStage] = useState(0);
  const results = aggregateBatch001();
  const active = results[activeStage];
  const brandTrace = results.map((result) => result.brand.rate);
  const wallpaperTrace = results.map((result) => result.wallpaper.rate);
  const totalResponses = batch001Observations.length;
  const hasAnyData = totalResponses > 0;
  const hasCompleteCurve = results.every(
    (result) => result.brand.rate !== null && result.wallpaper.rate !== null,
  );
  const stageHasData = active.brand.n + active.wallpaper.n > 0;
  const probeX = xFor(activeStage);
  const brandY = active.brand.rate === null ? null : yFor(active.brand.rate);
  const wallpaperY = active.wallpaper.rate === null ? null : yFor(active.wallpaper.rate);
  const reveal = (activeStage / (batch001Stages.length - 1)) * 100;

  function advance() {
    setActiveStage((value) => (value + 1) % batch001Stages.length);
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
          <span>Keep removing. Record what survives.</span>
        </div>
      </div>

      <div className={styles.tracePlate}>
        <div className={styles.plateTopline}>
          <span>SUBTRACTION TRACE</span>
          <span>OBSERVED DATA ONLY</span>
          <span>BATCH 001 · {totalResponses} RESPONSES</span>
        </div>

        <div className={styles.chartWrap}>
          <svg
            className={styles.chart}
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label={
              hasAnyData
                ? "Observed Batch 001 source-recognition curves for distinctive brand specimens and category-wallpaper controls."
                : "Batch 001 chart waiting for recorded observations. Reference curves have been removed."
            }
          >
            <g className={styles.grid} aria-hidden="true">
              {batch001Stages.map((stage, index) => (
                <line key={stage.id} x1={xFor(index)} x2={xFor(index)} y1={chart.top} y2={chart.bottom} />
              ))}
              {[0, 25, 50, 75, 100].map((value) => (
                <line key={`h-${value}`} x1={chart.left} x2={chart.right} y1={yFor(value)} y2={yFor(value)} />
              ))}
            </g>

            <text className={styles.axisLabel} x="28" y="300" transform="rotate(-90 28 300)">
              SOURCE RECOGNITION
            </text>
            <text className={styles.axisLabel} x="850" y="592">MORE REMOVED →</text>

            {hasAnyData ? (
              <>
                <path
                  className={styles.brandLine}
                  d={pathFor(brandTrace)}
                  style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
                />
                <path
                  className={styles.wallpaperLine}
                  d={pathFor(wallpaperTrace)}
                  style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
                />

                <line className={styles.probe} x1={probeX} x2={probeX} y1={chart.top - 18} y2={chart.bottom + 12} />
                {brandY !== null ? <circle className={styles.brandPoint} cx={probeX} cy={brandY} r="8" /> : null}
                {wallpaperY !== null ? <circle className={styles.wallpaperPoint} cx={probeX} cy={wallpaperY} r="7" /> : null}

                {brandTrace.at(-1) !== null && wallpaperTrace.at(-1) !== null ? (
                  <g className={styles.endLabels} aria-hidden="true">
                    <text x={chart.right + 18} y={yFor(brandTrace.at(-1) as number) + 5}>BRAND</text>
                    <text x={chart.right + 18} y={yFor(wallpaperTrace.at(-1) as number) + 5}>WALLPAPER</text>
                  </g>
                ) : null}
              </>
            ) : (
              <g className={styles.emptyState} aria-hidden="true">
                <text className={styles.emptyTitle} x="600" y="286" textAnchor="middle">NO OBSERVATIONS YET</text>
                <text className={styles.emptySub} x="600" y="322" textAnchor="middle">REFERENCE CURVES REMOVED · BATCH 001 WAITS FOR DATA</text>
              </g>
            )}
          </svg>
        </div>

        <div className={styles.stageRail} aria-label="Subtraction stages">
          {batch001Stages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              className={index === activeStage ? styles.activeStage : ""}
              onClick={() => setActiveStage(index)}
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
          <strong>{active.stage.label}</strong>
          <small>{active.stage.removed}</small>
        </div>
        <p>
          {stageHasData
            ? `BRAND ${formatRate(active.brand.rate)} (n=${active.brand.n}) · WALLPAPER ${formatRate(active.wallpaper.rate)} (n=${active.wallpaper.n})`
            : active.stage.question}
        </p>
        <button type="button" onClick={advance}>
          {activeStage === batch001Stages.length - 1 ? "BACK TO FULL" : "NEXT CUT"}
        </button>
      </div>

      <div className={styles.finding}>
        <span>EVIDENCE STATUS</span>
        <strong>
          {!hasAnyData
            ? "No curve until the batch speaks."
            : hasCompleteCurve
              ? "Observed curve."
              : "Partial curve. Keep collecting."}
        </strong>
        <p>Reference geometry is gone. Every visible point is computed from recorded Batch 001 responses.</p>
      </div>
    </section>
  );
}
