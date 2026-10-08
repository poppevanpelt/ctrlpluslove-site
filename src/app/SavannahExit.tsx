"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SavannahExit.module.css";

/**
 * A deliberate exit door, not a beforeunload trap.
 * Browsers cannot reliably play an outro while a tab is closing.
 */
export default function SavannahExit() {
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLButtonElement>(null);
  const stayButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stayButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>('[data-savannah-exit-dialog="true"]');
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>("button, a[href]"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      returnFocus.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button ref={returnFocus} className={styles.trigger} type="button" onClick={() => setOpen(true)}>
        Exit ↗
      </button>
      {open && (
        <div className={styles.scrim}>
          <section
            className={styles.scene}
            role="dialog"
            aria-modal="true"
            aria-labelledby="savannah-exit-line"
            aria-describedby="savannah-exit-context"
            data-savannah-exit-dialog="true"
          >
            <span className={styles.index}>CTRL+LOVE / THE WAY OUT</span>
            <div className={styles.portrait}>
              <img src="/savannah-avatar.jpg" alt="Savannah, seeing you out" />
            </div>
            <div className={styles.words}>
              <p className={styles.speaker}>SAVANNAH</p>
              <h2 id="savannah-exit-line">Well. That was something.</h2>
              <p id="savannah-exit-context" className={styles.subline}>A small pause. Then she gets back to work.</p>
            </div>
            <div className={styles.actions}>
              <button ref={stayButton} type="button" onClick={() => setOpen(false)}>
                Actually, stay
              </button>
              <a href="about:blank" aria-label="Leave ctrl+love for a blank page">
                Leave quietly ↗
              </a>
            </div>
            <span className={styles.footnote}>No sales pitch on the way out.</span>
          </section>
        </div>
      )}
    </>
  );
}
