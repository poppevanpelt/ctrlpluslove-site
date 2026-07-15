"use client";

import { FormEvent, useRef, useState } from "react";

const signalTypes = [
  "Observation",
  "Signal",
  "Pattern",
  "Contradiction",
  "Open Question",
  "Cultural Note",
];

const sources = ["Ambassador", "Client", "Social", "News", "Other"];
const confidenceLevels = ["Low", "Medium", "High"];

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; insight?: SubmissionInsight }
  | { status: "error" };

type SubmissionInsight = "similar-observed" | "first-observed";

const successInsightText: Record<SubmissionInsight, string> = {
  "first-observed": "No matching signals yet. You may be the first.",
  "similar-observed": "A similar signal has already been observed elsewhere.",
};

export function RadarForm() {
  const firstFieldRef = useRef<HTMLTextAreaElement>(null);
  const isSubmittingRef = useRef(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitState.status === "sending" || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState({
      status: "sending",
    });

    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/radar-signals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        insight?: SubmissionInsight | null;
      };

      if (!response.ok || !result.ok) {
        throw new Error("Radar transmission failed.");
      }

      form.reset();
      setSubmitState({
        status: "success",
        insight: result.insight ?? undefined,
      });
      firstFieldRef.current?.focus();
    } catch {
      setSubmitState({
        status: "error",
      });
    } finally {
      isSubmittingRef.current = false;
    }
  }

  const isSending = submitState.status === "sending";

  return (
    <form className="radar-form" onSubmit={handleSubmit}>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="radar-hidden-field"
        name="website"
        tabIndex={-1}
        type="text"
      />

      <label className="radar-field radar-field-full">
        <span>What did you notice?</span>
        <textarea
          ref={firstFieldRef}
          name="signal"
          minLength={12}
          maxLength={220}
          placeholder="A short, sharp observation. Something that changed, contradicted the brief, or felt too alive to ignore."
          required
        />
      </label>

      <label className="radar-field">
        <span>Type</span>
        <select name="type" defaultValue="Observation">
          {signalTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="radar-field">
        <span>Source</span>
        <select name="source" defaultValue="Other">
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </label>

      <label className="radar-field">
        <span>Confidence</span>
        <select name="confidence" defaultValue="Medium">
          {confidenceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>

      <label className="radar-field">
        <span>Market or domain</span>
        <input
          name="market"
          maxLength={120}
          placeholder="Media, fintech, healthcare, culture..."
        />
      </label>

      <label className="radar-field">
        <span>Location</span>
        <input name="location" maxLength={120} placeholder="City, country or online place" />
      </label>

      <label className="radar-field radar-field-full">
        <span>Why might it matter?</span>
        <textarea
          name="notes"
          maxLength={1200}
          placeholder="Add the friction, consequence, or question this signal opens."
        />
      </label>

      <label className="radar-field radar-field-full">
        <span>Source material</span>
        <textarea
          name="sourceMaterial"
          maxLength={600}
          placeholder="Optional quote, link, context or reference. Keep private details out unless they are safe to share."
        />
      </label>

      <div className="radar-submit-row">
        <button className="radar-submit" disabled={isSending} type="submit">
          {isSending ? "Sending" : "Send to Radar"}
        </button>
        <div aria-live="polite" className={`radar-submit-message ${submitState.status}`}>
          {submitState.status === "sending" ? (
            <>
              <strong>Transmitting signal…</strong>
            </>
          ) : null}
          {submitState.status === "success" ? (
            <>
              <strong>SIGNAL RECEIVED.</strong>
              <span>
                Your observation has entered the ctrl+love Radar.
                It may strengthen an existing pattern, challenge an assumption or trigger a new question.
              </span>
              {submitState.insight ? <em>{successInsightText[submitState.insight]}</em> : null}
            </>
          ) : null}
          {submitState.status === "error" ? (
            <>
              <strong>RADAR IS TEMPORARILY OUT OF RANGE.</strong>
              <span>
                Your signal could not be transmitted right now. Please try again in a moment.
              </span>
            </>
          ) : null}
        </div>
      </div>
    </form>
  );
}
