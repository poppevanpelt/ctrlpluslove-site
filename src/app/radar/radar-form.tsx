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
  | { status: "reflected"; reflection: RadarReflectionResult }
  | { status: "reflection-error"; signalId: string; retrying?: boolean; reference?: string }
  | { status: "save-error"; reference?: string };

type RadarReflectionResult = {
  status: "reflected";
  signalId: string;
  reflectionType: string;
  reflection: string;
  quality: {
    specific: boolean;
    observable: boolean;
    comparativeValue: "low" | "medium" | "high";
  };
  roomWorthy: boolean;
  relatedSignals: Array<{ id: string; signal: string }>;
  reference?: string;
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

    const payload = {
      ...Object.fromEntries(formData.entries()),
      idempotencyKey: crypto.randomUUID(),
    };

    try {
      const response = await fetch("/api/radar-signals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as
        | RadarReflectionResult
        | { status?: "saved_reflection_unavailable"; signalId?: string; reference?: string }
        | { status?: "save_failed"; reference?: string };

      if (result.status === "reflected") {
        form.reset();
        setSubmitState({
          status: "reflected",
          reflection: result,
        });
        firstFieldRef.current?.focus();
        return;
      }

      if (result.status === "saved_reflection_unavailable" && result.signalId) {
        setSubmitState({
          status: "reflection-error",
          signalId: result.signalId,
          reference: result.reference,
        });
        return;
      }

      setSubmitState({
        status: "save-error",
        reference: result.reference,
      });
    } catch {
      setSubmitState({
        status: "save-error",
      });
    } finally {
      isSubmittingRef.current = false;
    }
  }

  async function retryReflection(signalId: string) {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setSubmitState({ status: "reflection-error", signalId, retrying: true });

    try {
      const response = await fetch("/api/radar-signals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signalId }),
      });

      const result = (await response.json().catch(() => ({}))) as
        | RadarReflectionResult
        | { status?: "saved_reflection_unavailable"; signalId?: string; reference?: string };

      if (response.ok && result.status === "reflected") {
        setSubmitState({
          status: "reflected",
          reflection: result,
        });
        const form = firstFieldRef.current?.form;
        form?.reset();
        firstFieldRef.current?.focus();
        return;
      }

      setSubmitState({ status: "reflection-error", signalId, reference: result.reference });
    } catch {
      setSubmitState({ status: "reflection-error", signalId });
    } finally {
      isSubmittingRef.current = false;
    }
  }

  const isSending =
    submitState.status === "sending" ||
    (submitState.status === "reflection-error" && submitState.retrying);

  function renderSubmitMessage() {
    if (submitState.status === "sending") {
      return <strong>Reading the signal…</strong>;
    }

    if (submitState.status === "reflected") {
      const { reflection } = submitState;

      return (
        <>
          <strong>SIGNAL RECEIVED.</strong>
          <span>
            Your observation has entered the ctrl+love Radar. The reflection below is saved with
            the signal.
          </span>
          <div className="radar-reflection-card">
            <b>{reflection.reflectionType.toUpperCase()}</b>
            <p>{reflection.reflection}</p>
            <small>
              {reflection.quality.specific ? "Specific" : "Needs specificity"} ·{" "}
              {reflection.quality.observable ? "Observable" : "Needs observation"} · Comparative
              value: {reflection.quality.comparativeValue}
            </small>
            {reflection.roomWorthy ? <em>Room worthy</em> : null}
            {reflection.relatedSignals.length > 0 ? (
              <ul>
                {reflection.relatedSignals.map((signal) => (
                  <li key={signal.id}>{signal.signal}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </>
      );
    }

    if (submitState.status === "reflection-error") {
      return (
        <>
          <strong>
            {submitState.retrying ? "Reading the signal…" : "SIGNAL SAVED. REFLECTION UNAVAILABLE."}
          </strong>
          {!submitState.retrying ? (
            <>
              <span>
                Your observation is safely in Radar, but the interpretation service did not
                respond.
              </span>
              {submitState.reference ? <em>Reference: {submitState.reference}</em> : null}
              <button
                className="radar-retry"
                disabled={isSending}
                onClick={() => retryReflection(submitState.signalId)}
                type="button"
              >
                Retry reflection
              </button>
            </>
          ) : null}
        </>
      );
    }

    if (submitState.status === "save-error") {
      return (
        <>
          <strong>RADAR COULD NOT SAVE THIS SIGNAL.</strong>
          <span>Nothing has been stored. Please try again.</span>
          {submitState.reference ? <em>Reference: {submitState.reference}</em> : null}
        </>
      );
    }

    return null;
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
          ref={firstFieldRef}
          name="signal"
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
          {isSending ? "Reading" : "Send to Radar"}
        </button>
        <div aria-live="polite" className={`radar-submit-message ${submitState.status}`}>
          {renderSubmitMessage()}
        </div>
      </div>
    </form>
  );
}
