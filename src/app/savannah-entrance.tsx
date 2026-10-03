"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./savannah-entrance.module.css";

type Phase = "arrive" | "leaving" | "gone";

export function SavannahEntrance({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("arrive");
  const [reducedMotion, setReducedMotion] = useState(false);
  const exitTimerRef = useRef<number | null>(null);
  const hasEnteredRef = useRef(false);

  const enter = useCallback(() => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;
    setPhase("leaving");

    exitTimerRef.current = window.setTimeout(
      () => setPhase("gone"),
      reducedMotion ? 120 : 980,
    );
  }, [reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(media.matches);
    syncPreference();
    media.addEventListener?.("change", syncPreference);

    return () => media.removeEventListener?.("change", syncPreference);
  }, []);

  useEffect(() => {
    if (phase === "gone") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === "Escape"
      ) {
        event.preventDefault();
        enter();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 8 || Math.abs(event.deltaX) > 8) enter();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [enter, phase]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.shell} data-phase={phase}>
      <div className={styles.site} aria-hidden={phase !== "gone"}>
        {children}
      </div>

      {phase !== "gone" ? (
        <section
          className={styles.entrance}
          aria-label="Enter ctrl+love"
          onPointerDown={enter}
        >
          <div className={styles.portrait} aria-hidden="true">
            <Image
              src="/home/savannah.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>

          <div className={styles.shadow} aria-hidden="true" />

          <div className={styles.copy}>
            <span className={styles.firstLine}>Oh. Hi.</span>
            <span className={styles.secondLine}>You found ctrl+love.</span>
          </div>

          <button
            type="button"
            className={styles.enter}
            onClick={(event) => {
              event.stopPropagation();
              enter();
            }}
          >
            Come in.
          </button>

          <span className={styles.hint}>scroll · tap · enter</span>
        </section>
      ) : null}
    </div>
  );
}
