"use client";

import { useEffect, useMemo, useState } from "react";

import styles from "./portfolio-additions.module.css";

const BASE_MINUTES = 17;
const BASE_VALUE = 42000;
const VALUE_PER_SECOND = BASE_VALUE / (BASE_MINUTES * 60);

export default function FoundationTeller() {
  const [seconds, setSeconds] = useState(BASE_MINUTES * 60);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setSeconds(BASE_MINUTES * 60 + Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const value = useMemo(() => Math.round(seconds * VALUE_PER_SECOND), [seconds]);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className={styles.foundationReadout} aria-label="ctrl+love Foundation live value teller">
      <div className={styles.foundationLive}><span />LIVE</div>
      <div className={styles.foundationMetric}>
        <span>READING TIME</span>
        <strong>{minutes}:{String(secs).padStart(2, "0")}</strong>
      </div>
      <div className={styles.foundationEquals} aria-hidden="true">→</div>
      <div className={styles.foundationMetric}>
        <span>VALUE CREATED</span>
        <strong>€{value.toLocaleString("en-US")}</strong>
      </div>
    </div>
  );
}
