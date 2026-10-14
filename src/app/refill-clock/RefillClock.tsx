"use client";

import { useId, useState } from "react";
import styles from "./refill-clock.module.css";

export default function RefillClock({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [grams, setGrams] = useState("40");
  const [dose, setDose] = useState("2");
  const [cups, setCups] = useState("1");
  const values = [Number(grams), Number(dose), Number(cups)];
  const valid = values.every(value => Number.isFinite(value) && value > 0);
  const duration = valid ? values[0] / values[1] / values[2] : NaN;
  const usable = valid && Number.isFinite(duration);
  const days = usable ? Math.round(duration * 10) / 10 : null;
  const reminder = usable ? Math.max(0, Math.floor(duration - 3)) : null;
  const fields = [
    { name: "Matcha in the tin", unit: "grams", value: grams, set: setGrams, step: "1" },
    { name: "Matcha per cup", unit: "grams", value: dose, set: setDose, step: "0.1" },
    { name: "Cups per day", unit: "cups", value: cups, set: setCups, step: "0.1" },
  ];

  return (
    <div className={`${styles.specimen} ${compact ? styles.compact : ""}`} aria-labelledby={`${id}-title`}>
      <div className={styles.copy}>
        <p className={styles.label}>WORKING SPECIMEN / REFILL CLOCK</p>
        <h3 id={`${id}-title`}>When does the<br />tin run out?</h3>
        <p>A daily ritual has a practical question. Change the numbers. Find the moment a refill could help.</p>
        <div className={styles.links}>
          {compact ? <a href="/refill-clock/">Open the instrument ↗</a> : <a href="/#instruments">Back to the instruments ↖</a>}
          {compact ? <a href="/cabinet/">Explore the cabinet ↗</a> : null}
        </div>
      </div>
      <div className={styles.mechanism}>
        <div className={styles.fields}>
          {fields.map((field, index) => (
            <label key={field.name} htmlFor={`${id}-${index}`}>
              <span>{field.name}</span>
              <div className={styles.inputWrap}>
                <input id={`${id}-${index}`} type="number" inputMode="decimal" min="0.1" step={field.step} value={field.value} onChange={event => field.set(event.target.value)} aria-invalid={!Number.isFinite(Number(field.value)) || Number(field.value) <= 0} />
                <small>{field.unit}</small>
              </div>
            </label>
          ))}
        </div>
        <div className={styles.readout} role="status" aria-live="polite" aria-atomic="true">
          <div><strong>{days === null ? "—" : days.toLocaleString("en-GB", { maximumFractionDigits: 1 })}</strong><span>days of matcha</span></div>
          <p>{reminder === null ? "Enter a positive number in each field." : `With a three-day delivery buffer, a refill could be useful around day ${reminder.toLocaleString("en-GB")}.`}</p>
        </div>
        <p className={styles.note}>Editable assumptions. Consumption estimate only; no customer data or reminders connected.</p>
      </div>
    </div>
  );
}
