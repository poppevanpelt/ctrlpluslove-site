"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type Verdict = "protect" | "cut";
type Tier = "organ" | "muscle";
type Phase = "intake" | "examine" | "results";
type Item = { id: string; label: string; verdict: Verdict | null; tier: Tier | null };

const demo = [
  "One-line thesis slide",
  "Founder origin story",
  "Market size triple-nested chart",
  "Live product walkthrough",
  "Competitive landscape quadrant",
  "Retention cohort curve",
  "Team logos of past employers",
  "Ask and use of funds",
  "Appendix of press mentions",
];

export default function Purge() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [specimen, setSpecimen] = useState("");
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [cursor, setCursor] = useState(0);
  const [cutting, setCutting] = useState<string | null>(null);

  const current = items[cursor];
  const cut = items.filter((item) => item.verdict === "cut");
  const kept = items.filter((item) => item.verdict === "protect");
  const clarity = items.length ? Math.round((cut.length / items.length) * 100) : 0;

  const reveal = useMemo(() => {
    const organs = kept.filter((item) => item.tier === "organ");
    const muscles = kept.filter((item) => item.tier !== "organ");
    return {
      organs,
      muscles,
      sentence:
        organs.length > 0
          ? `${specimen || "The specimen"} is really ${organs.map((item) => item.label.toLowerCase()).join(", ")}.`
          : `${clarity}% of the mass was removed. The remainder is the load path.`,
    };
  }, [clarity, kept, specimen]);

  function addItem(event: FormEvent) {
    event.preventDefault();
    const label = draft.trim();
    if (!label) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), label, verdict: null, tier: null }]);
    setDraft("");
  }

  function loadDemo() {
    setSpecimen("Series A pitch deck");
    setItems(demo.map((label) => ({ id: crypto.randomUUID(), label, verdict: null, tier: null })));
  }

  function decide(verdict: Verdict) {
    if (!current) return;
    const id = current.id;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, verdict, tier: verdict === "protect" ? "muscle" : null } : item,
      ),
    );
    if (verdict === "cut") {
      setCutting(id);
      window.setTimeout(() => setCutting(null), 520);
    }
    if (cursor + 1 >= items.length) {
      window.setTimeout(() => setPhase("results"), verdict === "cut" ? 540 : 220);
    } else {
      setCursor((value) => value + 1);
    }
  }

  function reset() {
    setPhase("intake");
    setSpecimen("");
    setDraft("");
    setItems([]);
    setCursor(0);
    setCutting(null);
  }

  return (
    <section className={styles.instrument}>
      <div className={styles.titleBlock}>
        <p>Instrument 04 / ctrl+love</p>
        <h1>PURGE</h1>
        <strong>Cut the fat. Keep the organ.</strong>
        <span>A removal instrument for finding what is genuinely load-bearing.</span>
      </div>

      {phase === "intake" && (
        <div className={styles.intake}>
          <div className={styles.intakeIntro}>
            <button className={styles.bearing} onClick={loadDemo} aria-label="Load demo specimen" />
            <small>press the bearing for a demo specimen</small>
          </div>

          <div className={styles.intakeForm}>
            <label>
              <span>Specimen</span>
              <input
                value={specimen}
                onChange={(event) => setSpecimen(event.target.value)}
                placeholder="What are you examining?"
              />
            </label>

            <form onSubmit={addItem}>
              <span>Components — one at a time</span>
              <div className={styles.inlineInput}>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="A slide, a step, a feature, a ritual…"
                />
                <button>Seat</button>
              </div>
            </form>

            <div className={styles.itemList}>
              {items.map((item, index) => (
                <div className={styles.intakeItem} key={item.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item.label}</p>
                  <button onClick={() => setItems((prev) => prev.filter((entry) => entry.id !== item.id))}>×</button>
                </div>
              ))}
            </div>

            <button
              className={styles.enterButton}
              disabled={specimen.trim().length < 2 || items.length < 2}
              onClick={() => {
                setCursor(0);
                setPhase("examine");
              }}
            >
              Enter the aperture
            </button>
          </div>
        </div>
      )}

      {phase === "examine" && current && (
        <div className={styles.examine}>
          <div className={styles.spine}>
            <div className={styles.sectionLabel}>Specimen / {specimen}</div>
            <div className={styles.spineLine} />
            {items.map((item, index) => {
              const removed = item.verdict === "cut" && item.id !== cutting;
              if (removed) return null;
              return (
                <div
                  key={item.id}
                  className={`${styles.spineItem} ${index === cursor ? styles.currentItem : ""} ${item.id === cutting ? styles.cuttingItem : ""}`}
                >
                  <i />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.aperture}>
            <div className={styles.plate}>
              <span>Cutting plane</span>
              <span>{String(cursor + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            </div>
            <div className={styles.bladeLine} />
            <div className={styles.question}>
              <small>Component under test</small>
              <h2>{current.label}</h2>
              <p>If we remove this, does {specimen || "the thing"} become weaker, less distinctive, less useful, or less true?</p>
              <div className={styles.decisionButtons}>
                <button onClick={() => decide("protect")}>
                  <small>Yes — load-bearing</small>
                  Protect
                </button>
                <button onClick={() => decide("cut")}>
                  <small>No — carries nothing</small>
                  Cut
                </button>
              </div>
            </div>
            <div className={styles.clarity}>
              <span>Core visibility</span>
              <span>{clarity}% excess removed</span>
              <div><i style={{ width: `${clarity}%` }} /></div>
            </div>
          </div>

          <div className={styles.cutTray}>
            <div className={styles.sectionLabel}>Cut tray</div>
            <div className={styles.trayBox}>
              {cut.length === 0 ? <p>Empty.</p> : cut.map((item) => <span key={item.id}>{item.label}</span>)}
            </div>
          </div>
        </div>
      )}

      {phase === "results" && (
        <div className={styles.results}>
          <div className={styles.resultsHead}>
            <div>
              <span>Findings</span>
              <h2>{specimen}</h2>
            </div>
            <p>Exactly what to remove, without damaging the thing that matters.</p>
          </div>

          <div className={styles.resultColumns}>
            <ResultZone title="REMOVE" caption="Can be killed safely.">
              {cut.length === 0 ? <p>Nothing was released.</p> : cut.map((item) => <p key={item.id}>{item.label}</p>)}
            </ResultZone>

            <ResultZone title="PROTECT" caption="Do not accidentally optimise away.">
              {kept.length === 0 ? (
                <p>Nothing survived. That is also a finding.</p>
              ) : (
                kept.map((item) => (
                  <div className={styles.protectRow} key={item.id}>
                    <p>{item.label}</p>
                    <div>
                      <button
                        className={item.tier === "organ" ? styles.activeTier : ""}
                        onClick={() => setItems((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, tier: "organ" } : entry))}
                      >
                        organ
                      </button>
                      <button
                        className={item.tier === "muscle" ? styles.activeTier : ""}
                        onClick={() => setItems((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, tier: "muscle" } : entry))}
                      >
                        muscle
                      </button>
                    </div>
                  </div>
                ))
              )}
            </ResultZone>

            <ResultZone title="REVEAL" caption="What becomes clearer once the excess is gone.">
              <p>{reveal.sentence}</p>
              <p>{cut.length} component{cut.length === 1 ? "" : "s"} were consuming attention without carrying the idea.</p>
            </ResultZone>
          </div>

          <div className={styles.core}>
            <div>
              {kept.map((item) => (
                <span className={item.tier === "organ" ? styles.organ : ""} key={item.id}>{item.label}</span>
              ))}
            </div>
            <h2>What survived is the thing.</h2>
            <button onClick={reset}>New specimen</button>
          </div>
        </div>
      )}

      <Scalpel active={Boolean(cutting)} />
    </section>
  );
}

function ResultZone({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <section className={styles.resultZone}>
      <h3>{title}</h3>
      <small>{caption}</small>
      <div>{children}</div>
    </section>
  );
}

function Scalpel({ active }: { active: boolean }) {
  return (
    <div className={`${styles.scalpel} ${active ? styles.scalpelActive : ""}`} aria-hidden="true">
      <svg viewBox="0 0 240 44" fill="none">
        <rect x="70" y="17" width="164" height="10" rx="1.5" fill="#c8c9c8" />
        <rect x="70" y="17" width="164" height="4" rx="1.5" fill="#dedfdd" />
        <rect x="70" y="25.5" width="164" height="1.5" fill="#8d908f" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1={96 + i * 4} y1="18.5" x2={96 + i * 4} y2="25.5" stroke="#989a99" strokeWidth="0.9" />
        ))}
        <rect x="64" y="15.5" width="7" height="13" rx="1" fill="#7e8180" />
        <path d="M64 16.5 L20 17.5 C10 18 3 21 1.5 24 C9 26.5 22 27.5 40 27.5 L64 27.5 Z" fill="#e9eae8" />
        <path d="M64 24.5 L30 25.2 C20 25.6 10 25.4 1.5 24 C9 26.5 22 27.5 40 27.5 L64 27.5 Z" fill="#a4a7a5" />
        <text x="168" y="23.4" textAnchor="middle" fill="#555957" opacity=".72" fontSize="5.4" letterSpacing="1.2">PURGE / 001</text>
      </svg>
    </div>
  );
}
