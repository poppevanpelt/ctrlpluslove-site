"use client";

import { useState } from "react";
import styles from "./page.module.css";

const gates = [
  { no: "01", label: "INPUT", action: "REGISTER CHANGE" },
  { no: "02", label: "IMPACT", action: "MARK CONSEQUENCE" },
  { no: "03", label: "DECISION", action: "HUMAN OVERRIDE" },
  { no: "04", label: "MOVE", action: "COMMIT MOVE" },
] as const;

export default function ExecMachine() {
  const [stage, setStage] = useState(-1);
  const complete = stage >= gates.length;
  const running = stage >= 0 && !complete;

  const advance = () => setStage((current) => Math.min(current + 1, gates.length));
  const reset = () => setStage(-1);

  return (
    <div className={styles.machineShell}>
      <div className={styles.machineTopline}>
        <span>UNIT 04 / CAL. 1–4</span>
        <span><i className={running ? styles.lightOn : styles.light} /> IN TRANSIT</span>
      </div>

      <div className={styles.feedSlot}>
        <span>INSERT LIVE SITUATION</span>
        <div className={styles.slotOpening} />
        <div className={`${styles.issuePacket} ${stage < 0 ? styles.packetReady : styles.packetEntered}`}>
          <strong>LIVE ISSUE</strong>
          <small>E-04 / 0001</small>
        </div>
      </div>

      <div className={styles.machineTrack}>
        <span className={styles.rail} aria-hidden="true" />
        {gates.map((gate, index) => {
          const active = stage === index;
          const passed = stage > index;
          return (
            <button
              type="button"
              key={gate.no}
              className={`${styles.machineGate} ${active ? styles.gateActive : ""} ${passed ? styles.gatePassed : ""} ${index === 2 ? styles.humanGate : ""}`}
              onClick={() => setStage(index)}
              aria-label={`Inspect ${gate.label} gate`}
            >
              <span>{gate.no}</span>
              <div>
                <i className={active || passed ? styles.lightOn : styles.light} />
                <strong>{gate.label}</strong>
                {index === 2 ? <small>HUMAN OWNED / IRREVERSIBLE</small> : null}
              </div>
              <b className={active ? styles.markerActive : styles.marker}>ISSUE</b>
            </button>
          );
        })}
        <span className={styles.steelBall} aria-hidden="true" />
      </div>

      <div className={styles.machineOutput}>
        <span>HUMAN DECISION OUT</span>
        <div className={`${styles.outputPacket} ${complete ? styles.outputVisible : ""}`}>HUMAN DECISION</div>
      </div>

      <div className={styles.machineControls}>
        <button type="button" onClick={advance} disabled={complete}>
          {stage < 0 ? "INSERT LIVE SITUATION" : running ? gates[stage].action : "HUMAN DECISION OUT"}
        </button>
        {stage >= 0 ? <button type="button" className={styles.resetButton} onClick={reset}>RESET</button> : null}
      </div>
    </div>
  );
}
