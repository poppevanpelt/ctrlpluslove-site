"use client";

import { useMemo, useState } from "react";

import styles from "./prompt-shoppe.module.css";

const vagueWords = ["better", "great", "engaging", "interesting", "powerful", "innovative", "compelling"];

function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

export default function ShoppeBench() {
  const [prompt, setPrompt] = useState("");
  const [ran, setRan] = useState(false);

  const reading = useMemo(() => {
    const words = prompt.trim().split(/\s+/).filter(Boolean);
    const lower = prompt.toLowerCase();
    const specificity = countMatches(prompt, /\d|\b(?:because|must|avoid|include|exclude|before|after)\b/gi);
    const questions = countMatches(prompt, /\?/g);
    const vague = vagueWords.filter((word) => lower.includes(word));
    const hasAudience = /\b(?:for|audience|reader|customer|team|people|who)\b/i.test(prompt);
    const hasOutcome = /\b(?:so that|decide|choose|make|produce|create|find|test|compare|write|build)\b/i.test(prompt);
    const hasEvidence = /\b(?:source|evidence|data|example|quote|verify|reference)\b/i.test(prompt);

    return {
      load: Math.min(100, words.length * 2 + specificity * 9 + questions * 4),
      vague,
      direction: hasOutcome ? "OUTCOME PRESENT" : "OUTCOME MISSING",
      audience: hasAudience ? "AUDIENCE PRESENT" : "AUDIENCE MISSING",
      evidence: hasEvidence ? "EVIDENCE REQUESTED" : "EVIDENCE UNSTATED",
      assumptions: [
        hasAudience ? null : "The receiver will somehow know who this is for.",
        hasOutcome ? null : "The model can infer what a useful result should change.",
        hasEvidence ? null : "A plausible answer will be accepted without proof.",
        vague.length ? `Words carrying unmeasured weight: ${vague.join(", ")}.` : null,
      ].filter(Boolean) as string[],
    };
  }, [prompt]);

  return (
    <section className={styles.liveBench} aria-labelledby="live-bench-title">
      <div className={styles.liveBenchHead}>
        <p className={styles.kicker}>THE WORKING BENCH</p>
        <h2 id="live-bench-title">PUT ONE UNDER LOAD.</h2>
        <p>Paste a prompt. These instruments inspect its structure; they do not rewrite it for you.</p>
      </div>

      <label className={styles.promptInput}>
        <span>OLD PROMPT / INPUT</span>
        <textarea
          value={prompt}
          onChange={(event) => { setPrompt(event.target.value); setRan(false); }}
          placeholder="Paste the prompt you keep trying to fix."
          rows={7}
        />
        <button type="button" disabled={!prompt.trim()} onClick={() => setRan(true)}>RUN ALL THREE ↗</button>
      </label>

      <div className={styles.benchReadouts} aria-live="polite">
        <article>
          <span>OBJ—01 / PROMPT DYNO</span>
          <strong>{ran ? `${reading.load}%` : "—"}</strong>
          <p>{ran ? (reading.load > 60 ? "Enough structure to test under load." : "Low structural load. Add constraints, stakes or a decision.") : "Measures how much explicit structure the prompt is carrying."}</p>
        </article>
        <article>
          <span>OBJ—02 / ASSUMPTION EXTRACTOR</span>
          <strong>{ran ? String(reading.assumptions.length).padStart(2, "0") : "—"}</strong>
          <p>{ran ? (reading.assumptions[0] ?? "No obvious structural assumption surfaced by this pass.") : "Presses out what the prompt expects the model to guess."}</p>
        </article>
        <article>
          <span>OBJ—03 / INTENT COMPASS</span>
          <strong>{ran ? reading.direction : "—"}</strong>
          <p>{ran ? `${reading.audience}. ${reading.evidence}.` : "Checks whether the prompt names an outcome, an audience and proof."}</p>
        </article>
      </div>
    </section>
  );
}
