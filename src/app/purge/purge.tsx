"use client";

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
      window.setTimeout(() => setActiveCut(null), 560);
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
          <div className={`${styles.scalpel} ${activeCut ? styles.scalpelActive : ""}`} aria-hidden="true">
            <i className={styles.blade} />
            <i className={styles.handle} />
          </div>
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
                          <button onClick={() => decide(item.id, "KEEP")}>KEEP</button>
                          <button onClick={() => decide(item.id, "TEST REMOVAL")}>TEST REMOVAL</button>
                          <button className={styles.cutButton} onClick={() => decide(item.id, "CUT NOW")}>CUT NOW</button>
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
