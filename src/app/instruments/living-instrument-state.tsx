"use client";

import type { CSSProperties } from "react";
import styles from "./living-state.module.css";

type Props = {
  no: string;
  state: "WORKING" | "PROTOTYPE" | "FIELD TEST" | "ARCHIVE" | "IN DEVELOPMENT";
  family: "SEE" | "TEST" | "DECIDE" | "MOVE" | "ARTIFACT";
};

export default function LivingInstrumentState({ no, state }: Props) {
  const signal =
    no === "003" ? "MOVEMENT" :
    no === "005" ? "FIELD" :
    no === "013" ? "CONTROL" :
    no === "016" ? "EVIDENCE" :
    no === "018" ? "WATCH" :
    null;

  if (!signal) {
    return null;
  }

  return (
    <div className={styles.panel} data-state={state} data-instrument={no}>
      <div className={styles.rail}>
        <span className={styles.lamp} aria-hidden="true" />
        <span>{signal}</span>
      </div>

      {no === "003" ? (
        <div className={styles.waveform} aria-label="Living Ticker activity signal">
          {Array.from({ length: 18 }).map((_, index) => (
            <i key={index} style={{ ["--bar" as string]: index } as CSSProperties} />
          ))}
        </div>
      ) : null}

      {no === "013" ? (
        <div className={styles.controlHold}>
          <span>NO INTERVENTION</span>
          <b>HOLDING</b>
        </div>
      ) : null}
    </div>
  );
}
