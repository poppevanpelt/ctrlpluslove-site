"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./system-shock.module.css";

const CHEMICAL_VIDEO_ID = "c8ayjYLuE-4";

export function SystemShock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (
    pathname?.startsWith("/poppe") ||
    pathname === "/everything-looks-normal" ||
    pathname === "/everything-looks-normal/"
  ) {
    return null;
  }

  return (
    <>
      <button
        className={styles.trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="SYSTEM SHOCK · Beck — Chemical"
      >
        <span className={styles.dot} aria-hidden="true" />
        SYSTEM SHOCK
      </button>

      {open ? (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="System Shock">
          <div className={styles.panel}>
            <div className={styles.topline}>
              <div className={styles.meta}>
                <span>SYSTEM SHOCK / 001</span>
                <span>BECK · CHEMICAL</span>
                <span>NASA / JPL · CASSINI-HUYGENS</span>
              </div>
              <button className={styles.close} type="button" onClick={() => setOpen(false)}>
                CLOSE ×
              </button>
            </div>

            <div className={styles.frame}>
              <iframe
                src={`https://www.youtube.com/embed/${CHEMICAL_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Beck - Chemical (Hyperspace: A.I. Exploration)"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className={styles.caption}>
              <div>
                <strong>Shock to the system.</strong>
                <span>
                  The ctrl+love rupture track. Beck’s Hyperspace: A.I. Exploration pairs Chemical with Cassini-Huygens imagery transformed through AI in collaboration with NASA/JPL.
                </span>
              </div>
              <a href="https://www.youtube.com/watch?v=c8ayjYLuE-4" target="_blank" rel="noreferrer">
                OPEN OFFICIAL VIDEO ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
