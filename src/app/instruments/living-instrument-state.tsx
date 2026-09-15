"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import styles from "./living-state.module.css";

type Props = {
  no: string;
  state: "WORKING" | "PROTOTYPE" | "FIELD TEST" | "ARCHIVE" | "IN DEVELOPMENT";
  family: "SEE" | "TEST" | "DECIDE" | "MOVE" | "ARTIFACT";
};

function useRoomClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

export default function LivingInstrumentState({ no, state, family }: Props) {
  const now = useRoomClock();
  const minuteKey = now ? `${now.getHours()}-${now.getMinutes()}` : "pending";
  const time = now
    ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : "--:--";

  const signal = useMemo(() => {
    if (no === "003") return "MOVEMENT";
    if (no === "005") return "FIELD";
    if (no === "013") return "CONTROL";
    if (no === "016") return "EVIDENCE";
    if (no === "018") return "WATCH";
    return family;
  }, [family, no]);

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

      <div className={styles.clock} key={minuteKey} aria-label={`Room clock ${time}`}>
        <span>{time.slice(0, 2)}</span>
        <em>:</em>
        <span className={styles.minuteLeaf}>{time.slice(3)}</span>
      </div>
    </div>
  );
}
