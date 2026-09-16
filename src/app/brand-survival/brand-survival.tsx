"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  aggregateBatch001,
  batch001Observations,
  batch001Stages,
  parseBatch001Observations,
  type BatchCondition,
  type BatchObservation,
} from "./batch-001";
import styles from "./brand-survival.module.css";
import labStyles from "./brand-survival-lab.module.css";

const chart = {
  width: 1200,
  height: 620,
  left: 88,
  right: 1092,
  top: 78,
  bottom: 526,
};

const STORAGE_KEY = "ctrl-love:brand-survival:batch-001";

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

function makeObservationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `obs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function BrandSurvival() {
  const [activeStage, setActiveStage] = useState(0);
  const [labMode, setLabMode] = useState(false);
  const [localObservations, setLocalObservations] = useState<BatchObservation[]>([]);
  const [participantId, setParticipantId] = useState("P001");
  const [specimenId, setSpecimenId] = useState("S001");
  const [condition, setCondition] = useState<BatchCondition>("brand");
  const [sourceRecognised, setSourceRecognised] = useState<boolean | null>(null);
  const [categoryRecognised, setCategoryRecognised] = useState<boolean | null>(null);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [sourceGuess, setSourceGuess] = useState("");
  const [captureStatus, setCaptureStatus] = useState("READY");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLabMode(params.get("lab") === "1");

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setLocalObservations(parseBatch001Observations(stored));
  }, []);

  const observations = useMemo(
    () => [...batch001Observations, ...localObservations],
    [localObservations],
  );
  const results = useMemo(() => aggregateBatch001(observations), [observations]);
  const active = results[activeStage];
  const brandTrace = results.map((result) => result.brand.rate);
  const wallpaperTrace = results.map((result) => result.wallpaper.rate);
  const totalResponses = observations.length;
  const committedResponses = batch001Observations.length;
  const hasAnyData = totalResponses > 0;
  const hasCompleteCurve = results.every(
    (result) => result.brand.rate !== null && result.wallpaper.rate !== null,
  );
  const stageHasData = active.brand.n + active.wallpaper.n > 0;
  const probeX = xFor(activeStage);
  const brandY = active.brand.rate === null ? null : yFor(active.brand.rate);
  const wallpaperY = active.wallpaper.rate === null ? null : yFor(active.wallpaper.rate);
  const reveal = (activeStage / (batch001Stages.length - 1)) * 100;

  function persistLocal(next: BatchObservation[]) {
    setLocalObservations(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function advance() {
    setActiveStage((value) => (value + 1) % batch001Stages.length);
  }

  function recordObservation() {
    if (!participantId.trim() || !specimenId.trim()) {
      setCaptureStatus("PARTICIPANT + SPECIMEN REQUIRED");
      return;
    }
    if (sourceRecognised === null || categoryRecognised === null) {
      setCaptureStatus("RECORD BOTH RECOGNITION CALLS");
      return;
    }

    const observation: BatchObservation = {
      id: makeObservationId(),
      participantId: participantId.trim(),
      specimenId: specimenId.trim(),
      stage: active.stage.id,
      condition,
      sourceRecognised,
      categoryRecognised,
      confidence,
      sourceGuess: sourceGuess.trim(),
      recordedAt: new Date().toISOString(),
    };

    persistLocal([...localObservations, observation]);
    setSourceRecognised(null);
    setCategoryRecognised(null);
    setConfidence(3);
    setSourceGuess("");
    setCaptureStatus(`RECORDED ${active.stage.short}`);
    setActiveStage((value) => Math.min(value + 1, batch001Stages.length - 1));
  }

  async function copyLocalBatch() {
    if (localObservations.length === 0) {
      setCaptureStatus("NOTHING TO COPY");
      return;
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(localObservations, null, 2));
      setCaptureStatus(`COPIED ${localObservations.length} LOCAL ROWS`);
    } catch {
      setCaptureStatus("COPY BLOCKED · USE EXPORT JSON");
    }
  }

  function exportLocalBatch() {
    if (localObservations.length === 0) {
      setCaptureStatus("NOTHING TO EXPORT");
      return;
    }

    const blob = new Blob([JSON.stringify(localObservations, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `brand-survival-batch-001-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setCaptureStatus(`EXPORTED ${localObservations.length} LOCAL ROWS`);
  }

  function resetLocalBatch() {
    if (localObservations.length === 0) return;
    if (!window.confirm("Clear all locally captured Batch 001 observations on this browser?")) return;

    window.localStorage.removeItem(STORAGE_KEY);
    setLocalObservations([]);
    setCaptureStatus("LOCAL BATCH CLEARED");
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
          <span>BATCH 001 · {totalResponses} OBSERVATIONS</span>
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

      {labMode ? (
        <section className={labStyles.labBench} aria-labelledby="batch-001-lab-title">
          <div className={labStyles.labTopline}>
            <div>
              <span>LOCAL OBSERVATION CAPTURE</span>
              <h2 id="batch-001-lab-title">BATCH 001 / LAB BENCH</h2>
            </div>
            <div className={labStyles.labCounter}>
              <strong>{localObservations.length}</strong>
              <span>LOCAL ROWS</span>
            </div>
          </div>

          <div className={labStyles.labContext}>
            <label>
              <span>PARTICIPANT</span>
              <input value={participantId} onChange={(event: ChangeEvent<HTMLInputElement>) => setParticipantId(event.target.value)} />
            </label>
            <label>
              <span>SPECIMEN</span>
              <input value={specimenId} onChange={(event: ChangeEvent<HTMLInputElement>) => setSpecimenId(event.target.value)} />
            </label>
            <div className={labStyles.labField}>
              <span>CONDITION</span>
              <div className={labStyles.segmented}>
                {(["brand", "wallpaper"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={condition === value ? labStyles.selected : ""}
                    onClick={() => setCondition(value)}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={labStyles.labStage}>
            <span>RECORDING CUT {String(activeStage + 1).padStart(2, "0")}</span>
            <strong>{active.stage.short}</strong>
            <p>{active.stage.question}</p>
          </div>

          <div className={labStyles.labCalls}>
            <div className={labStyles.labField}>
              <span>SOURCE RECOGNISED?</span>
              <div className={labStyles.binaryChoice}>
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    className={sourceRecognised === value ? labStyles.selected : ""}
                    onClick={() => setSourceRecognised(value)}
                  >
                    {value ? "YES" : "NO"}
                  </button>
                ))}
              </div>
            </div>
            <div className={labStyles.labField}>
              <span>CATEGORY RECOGNISED?</span>
              <div className={labStyles.binaryChoice}>
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    className={categoryRecognised === value ? labStyles.selected : ""}
                    onClick={() => setCategoryRecognised(value)}
                  >
                    {value ? "YES" : "NO"}
                  </button>
                ))}
              </div>
            </div>
            <label className={labStyles.confidenceField}>
              <span>CONFIDENCE</span>
              <select
                value={confidence}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setConfidence(Number(event.target.value) as 1 | 2 | 3 | 4 | 5)}
              >
                {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className={labStyles.guessField}>
              <span>SOURCE GUESS / OPTIONAL</span>
              <input
                value={sourceGuess}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSourceGuess(event.target.value)}
                placeholder="What did they say?"
              />
            </label>
          </div>

          <div className={labStyles.labActions}>
            <button className={labStyles.recordButton} type="button" onClick={recordObservation}>RECORD OBSERVATION</button>
            <span className={labStyles.captureStatus}>{captureStatus}</span>
            <button type="button" onClick={copyLocalBatch}>COPY JSON</button>
            <button type="button" onClick={exportLocalBatch}>EXPORT JSON</button>
            <button className={labStyles.dangerButton} type="button" onClick={resetLocalBatch}>CLEAR LOCAL</button>
          </div>

          <div className={labStyles.labFootnote}>
            <span>COMMITTED {committedResponses}</span>
            <span>LOCAL {localObservations.length}</span>
            <span>TOTAL VISIBLE {totalResponses}</span>
            <p>Local rows stay in this browser until exported or cleared. Only checked observations should be promoted into the committed Batch 001 evidence set.</p>
          </div>
        </section>
      ) : null}

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
