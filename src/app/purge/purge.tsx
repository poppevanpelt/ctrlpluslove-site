"use client";

// Deployment retry marker: PURGE scalpel production sync.
import { FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type Verdict = "KEEP" | "TEST REMOVAL" | "CUT NOW";
type Item = { id: string; text: string; verdict: Verdict | null };

export default function Purge() {
  const [organ, setOrgan] = useState("");
  const [draft, setDraft] = useState("");
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [activeCut, setActiveCut] = useState<string | null>(null);

  const keep = useMemo(() => items.filter((i) => i.verdict === "KEEP"), [items]);
  const test = useMemo(() => items.filter((i) => i.verdict === "TEST REMOVAL"), [items]);
  const cut = useMemo(() => items.filter((i) => i.verdict === "CUT NOW"), [items]);

  const start = (e: FormEvent) => {
    e.preventDefault();
    if (organ.trim()) setStarted(true);
  };

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setItems((current) => [...current, { id: crypto.randomUUID(), text: draft.trim(), verdict: null }]);
    setDraft("");
  };

  const decide = (id: string, verdict: Verdict) => {
    if (verdict === "CUT NOW") {
      setActiveCut(id);
      window.setTimeout(() => setActiveCut(null), 720);
    }
    setItems((current) => current.map((item) => (item.id === id ? { ...item, verdict } : item)));
  };

  return (
    <section className={styles.machine}>
      <div className={styles.instrumentHead}>
        <div>
          <span>PROTECTED ORGAN</span>
          <strong>{started ? organ : "UNSET"}</strong>
        </div>

        <div className={styles.scalpelDock} aria-label="Scalpel dock">
          <span>SCALPEL / PARKED UNTIL CUT</span>
          <div className={styles.scalpelMat} aria-hidden="true" />
          <svg
            className={`${styles.scalpel} ${activeCut ? styles.scalpelActive : ""}`}
            viewBox="0 0 520 120"
            role="img"
            aria-label="Surgical scalpel"
          >
            <defs>
              <linearGradient id="purge-blade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.42" stopColor="#d8dde0" />
                <stop offset="0.68" stopColor="#8b9195" />
                <stop offset="1" stopColor="#4f5457" />
              </linearGradient>
              <linearGradient id="purge-handle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d4d7d8" />
                <stop offset="0.28" stopColor="#777d80" />
                <stop offset="0.55" stopColor="#34383a" />
                <stop offset="0.78" stopColor="#8b9092" />
                <stop offset="1" stopColor="#242728" />
              </linearGradient>
              <pattern id="purge-knurl" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="14" stroke="#161819" strokeWidth="4" opacity=".55" />
              </pattern>
              <filter id="purge-shadow" x="-20%" y="-50%" width="140%" height="200%">
                <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000000" floodOpacity=".28" />
              </filter>
            </defs>

            <g filter="url(#purge-shadow)">
              <path
                d="M20 61 C61 45 91 32 138 18 L191 18 L188 56 L150 69 L76 72 Z"
                fill="url(#purge-blade)"
                stroke="#383c3e"
                strokeWidth="2"
              />
              <path d="M20 61 L77 72 L145 69" fill="none" stroke="#f7f7f7" strokeWidth="2" opacity=".8" />
              <path d="M174 34 L492 34 L510 60 L492 86 L174 86 Z" fill="url(#purge-handle)" stroke="#1b1d1e" strokeWidth="3" />
              <path d="M215 45 L462 45 L475 60 L462 75 L215 75 Z" fill="url(#purge-knurl)" opacity=".95" />
              <rect x="193" y="49" width="18" height="22" rx="3" fill="#c1c5c7" stroke="#2d3032" strokeWidth="2" />
              <text x="325" y="65" textAnchor="middle" fill="#d9dcdd" fontSize="13" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="3">CTRL+PURGE · 020</text>
            </g>
          </svg>
          <small className={styles.scalpelCaption}>STERILE OBJECT / HUMAN CUT REQUIRED</small>
        </div>
      </div>

      {!started ? (
        <form className={styles.organForm} onSubmit={start}>
          <label>WHAT MUST SURVIVE THIS PURGE?</label>
          <textarea
            value={organ}
            onChange={(e) => setOrgan(e.target.value)}
            placeholder="The thing we refuse to damage."
            required
          />
          <button>PROTECT THE ORGAN</button>
        </form>
      ) : (
        <>
          <div className={styles.operatingTable}>
            <div className={styles.tableHeader}>
              <span>ATTACHED MATERIAL</span>
              <small>Pressure-test each piece against the protected organ.</small>
            </div>

            {items.length === 0 ? (
              <div className={styles.empty}>Nothing loaded yet. Add arguments, features, rituals, politics, habits or furniture.</div>
            ) : (
              <div className={styles.itemStack}>
                {items.map((item, index) => (
                  <article
                    key={item.id}
                    className={`${styles.item} ${item.verdict === "CUT NOW" ? styles.cutItem : ""} ${activeCut === item.id ? styles.beingCut : ""}`}
                  >
                    <div className={styles.itemIndex}>{String(index + 1).padStart(2, "0")}</div>
                    <div className={styles.itemBody}>
                      <p>{item.text}</p>
                      {item.verdict ? (
                        <strong className={styles.verdict}>{item.verdict}</strong>
                      ) : (
                        <div className={styles.actions}>
                          <button type="button" onClick={() => decide(item.id, "KEEP")}>KEEP</button>
                          <button type="button" onClick={() => decide(item.id, "TEST REMOVAL")}>TEST REMOVAL</button>
                          <button type="button" className={styles.cutButton} onClick={() => decide(item.id, "CUT NOW")}>CUT NOW</button>
                        </div>
                      )}
                    </div>
                    <span className={styles.cutLine} aria-hidden="true" />
                  </article>
                ))}
              </div>
            )}

            <form className={styles.addForm} onSubmit={add}>
              <label>LOAD NEXT ATTACHMENT</label>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="What has accumulated around the thing that matters?"
              />
              <button>ADD TO TABLE</button>
            </form>
          </div>

          <div className={styles.outputBay}>
            <section>
              <span>SURVIVING SPINE</span>
              <strong>{keep.length}</strong>
              {keep.map((item) => <p key={item.id}>{item.text}</p>)}
            </section>
            <section>
              <span>TEST BAY</span>
              <strong>{test.length}</strong>
              {test.map((item) => <p key={item.id}>{item.text}</p>)}
            </section>
            <section className={styles.cutTray}>
              <span>CUT TRAY</span>
              <strong>{cut.length}</strong>
              {cut.map((item) => <p key={item.id}>{item.text}</p>)}
            </section>
          </div>

          <div className={styles.receipt}>
            <span>PURGE RECEIPT</span>
            <b>ORGAN:</b> {organ}
            <b>KEPT:</b> {keep.length} · <b>TEST:</b> {test.length} · <b>CUT:</b> {cut.length}
          </div>
        </>
      )}
    </section>
  );
}
