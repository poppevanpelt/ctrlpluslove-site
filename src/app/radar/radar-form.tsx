"use client";

import { FormEvent, useState } from "react";

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
  | { status: "idle"; message: string }
  | { status: "sending"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function RadarForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState({
      status: "sending",
      message: "Receiving the signal.",
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
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The signal could not be sent.");
      }

      form.reset();
      setSubmitState({
        status: "success",
        message: result.message ?? "Signal received.",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "The signal could not be sent.",
      });
    }
  }

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
        <button className="radar-submit" disabled={submitState.status === "sending"} type="submit">
          {submitState.status === "sending" ? "Sending" : "Submit signal"}
        </button>
        <p aria-live="polite" className={`radar-submit-message ${submitState.status}`}>
          {submitState.message}
        </p>
      </div>
    </form>
  );
}
