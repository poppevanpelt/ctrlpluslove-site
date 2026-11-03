"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type CaseItem = { id: string; objective: string; successCriteria: string[]; status: string; integrationReady: boolean };
type EventItem = { id: string; event_type: string; summary: string; created_at: string };
type DecisionItem = { action: string; reason: string; rationale: string[]; requiresHuman: boolean };

const panel: React.CSSProperties = { border: "1px solid #303830", borderRadius: 12, padding: 18, background: "#121713" };
const field: React.CSSProperties = { width: "100%", padding: 11, borderRadius: 8, border: "1px solid #485148", background: "#0c100d", color: "#f1f3ef", font: "inherit" };
const button: React.CSSProperties = { border: 0, borderRadius: 8, padding: "10px 13px", background: "#d9ff72", color: "#111", fontWeight: 700, cursor: "pointer" };

export default function SavannahFollowThroughPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [objective, setObjective] = useState("Resolve the Vercel refund request");
  const [criteria, setCriteria] = useState("Written decision on the refund\nRefund issued or a reasoned final decision");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [decisions, setDecisions] = useState<Record<string, DecisionItem>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/savannah/follow-through", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load cases");
      setCases(data.cases || []);
      setEvents(data.events || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Follow-through service unavailable");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function createCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/savannah/follow-through", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "create", objective, successCriteria: criteria.split("\n").map((s) => s.trim()).filter(Boolean), authority: "read_only" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create case");
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not create case"); }
    finally { setBusy(false); }
  }

  async function evaluate(item: CaseItem) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/savannah/follow-through", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "evaluate", id: item.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not evaluate case");
      setDecisions((previous) => ({ ...previous, [item.id]: data.decision }));
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not evaluate case"); }
    finally { setBusy(false); }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0c100d", color: "#f1f3ef", padding: "clamp(20px,5vw,60px)", fontFamily: "Arial,sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 22 }}>
        <header>
          <p style={{ color: "#d9ff72", letterSpacing: ".15em", fontSize: 12, fontWeight: 700 }}>SAVANNAH / EXPERIMENT 01</p>
          <h1 style={{ fontSize: "clamp(34px,5vw,54px)", lineHeight: 1, letterSpacing: "-.04em", margin: "12px 0" }}>Follow through.</h1>
          <p style={{ maxWidth: 680, color: "#bac3bb", lineHeight: 1.6 }}>A case is not a task list. It is an objective that stays alive until the outcome is verified, the evidence changes the plan, or a genuine blocker needs judgment.</p>
          <p style={{ color: "#8f9b91", fontSize: 12 }}>Prototype mode. Decisions are recorded; no external messages are sent.</p>
        </header>

        {error && <div role="alert" style={{ ...panel, borderColor: "#a85c5c", color: "#ffd0d0" }}>{error}</div>}

        <section style={panel}>
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Give Savannah an objective</h2>
          <form onSubmit={createCase} style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>Objective
              <input style={field} value={objective} onChange={(e) => setObjective(e.target.value)} maxLength={1200} required />
            </label>
            <label style={{ display: "grid", gap: 6 }}>Success criteria, one per line
              <textarea style={{ ...field, minHeight: 86 }} value={criteria} onChange={(e) => setCriteria(e.target.value)} required />
            </label>
            <div><button style={button} disabled={busy}>{busy ? "Working…" : "Register objective"}</button></div>
          </form>
        </section>

        <section style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Objectives</h2>
            <button type="button" style={{ ...button, background: "transparent", color: "inherit", border: "1px solid #485148" }} onClick={() => void refresh()} disabled={loading || busy}>Refresh</button>
          </div>
          {loading ? <p>Loading…</p> : cases.length === 0 ? <div style={panel}>No objectives yet. Register one above.</div> : cases.map((item) => {
            const d = decisions[item.id];
            return <article key={item.id} style={{ ...panel, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, flexWrap: "wrap" }}>
                <div><h3 style={{ margin: "0 0 6px" }}>{item.objective}</h3><small style={{ color: "#8f9b91" }}>{item.status} · {item.integrationReady ? "integration ready" : "no live integration"} · {item.id}</small></div>
                <button type="button" style={button} onClick={() => void evaluate(item)} disabled={busy}>Evaluate next move</button>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, color: "#c4ccc5", lineHeight: 1.6 }}>{item.successCriteria.map((c, i) => <li key={item.id + "-" + i}>{c}</li>)}</ul>
              {d && <div style={{ borderTop: "1px solid #303830", paddingTop: 12 }}>
                <p style={{ color: "#d9ff72", fontWeight: 700 }}>Next move: {d.action.replaceAll("_", " ")}</p>
                <p>{d.reason.replaceAll("_", " ")}</p>
                <ul style={{ color: "#bac3bb", lineHeight: 1.5 }}>{d.rationale.map((line, i) => <li key={i}>{line}</li>)}</ul>
                {d.requiresHuman && <p style={{ color: "#ffcf8a" }}>Human judgment required for this step.</p>}
              </div>}
            </article>;
          })}
        </section>

        <section style={panel}>
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Decision ledger</h2>
          {events.length === 0 ? <p style={{ color: "#8f9b91" }}>Case creation and each evaluation leave a trace here.</p> : events.slice(0, 12).map((event) => <div key={event.id} style={{ borderTop: "1px solid #303830", paddingTop: 10 }}>
            <p>{event.summary}</p><small style={{ color: "#8f9b91" }}>{event.event_type} · {new Date(event.created_at).toLocaleString()}</small>
          </div>)}
        </section>
      </div>
    </main>
  );
}
