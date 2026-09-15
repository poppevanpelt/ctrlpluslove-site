"use client";

import { useMemo, useState } from "react";

type Decision = {
  id: string;
  prompt: string;
  choices: string[];
  note: string;
};

const decisions: Decision[] = [
  {
    id: "customer",
    prompt: "Customer-facing AI systems are degrading.",
    choices: ["Continue", "Restrict", "Shut down"],
    note: "Dependency exposed",
  },
  {
    id: "fallback",
    prompt: "Operations asks to switch to a weaker fallback model.",
    choices: ["Approve", "Approve with limits", "Refuse"],
    note: "Fallback quality becomes policy",
  },
  {
    id: "authority",
    prompt: "Who has authority to communicate externally?",
    choices: ["Incident lead", "Executive team", "Legal only"],
    note: "Authority unclear",
  },
  {
    id: "manual",
    prompt: "A critical process has no documented non-AI fallback.",
    choices: ["Manual workaround", "Pause service", "Accept degraded output"],
    note: "Undocumented fallback",
  },
  {
    id: "return",
    prompt: "Access returns. Root cause is still unknown.",
    choices: ["Resume immediately", "Staged resume", "Stay offline"],
    note: "Uncertainty remains",
  },
];

const redlineActions = [
  "Publish public statement",
  "Switch model provider",
  "Approve customer refunds",
  "Resume automated decisions",
];

const redlineZones = [
  "HUMAN ONLY",
  "AI MAY ADVISE",
  "AI MAY ACT",
  "PRE-AUTHORISED",
  "NEVER",
];

export default function BlackoutClient() {
  const [stage, setStage] = useState<"arm" | "scenario" | "decisions" | "redline" | "debrief">("arm");
  const [decisionIndex, setDecisionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [redlines, setRedlines] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);

  const completed = Object.keys(answers).length;
  const unresolved = useMemo(() => {
    return decisions.filter((d) => !answers[d.id]).length + redlineActions.filter((a) => !redlines[a]).length;
  }, [answers, redlines]);

  const begin = () => {
    setStage("scenario");
    setElapsed(0);
  };

  const tickForward = () => setElapsed((v) => v + 37 + Math.floor(Math.random() * 48));

  const choose = (decision: Decision, choice: string) => {
    setAnswers((prev) => ({ ...prev, [decision.id]: choice }));
    tickForward();
    if (decisionIndex < decisions.length - 1) setDecisionIndex((i) => i + 1);
    else setStage("redline");
  };

  const placeRedline = (action: string, zone: string) => {
    setRedlines((prev) => ({ ...prev, [action]: zone }));
  };

  const finishRedline = () => setStage("debrief");

  const reset = () => {
    setStage("arm");
    setDecisionIndex(0);
    setAnswers({});
    setRedlines({});
    setElapsed(0);
  };

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const current = decisions[decisionIndex];

  return (
    <main className="blackout-shell">
      <header className="blackout-topbar">
        <div className="brand-lockup">ctrl+love</div>
        <div className="protocol">PROTOCOL 001 / AI CONTINUITY</div>
        <a className="home-link" href="https://ctrlpluslove.com/">shortcut to reality ↗</a>
      </header>

      {stage === "arm" && (
        <section className="hero-grid">
          <div>
            <div className="eyebrow">FIELD INSTRUMENT / LIVE ROOM</div>
            <h1>CTRL+<span>BLACKOUT</span></h1>
            <p className="lead">AI continuity drill.</p>
            <p className="hero-copy">Find out what quietly breaks when the models disappear.</p>
            <button className="primary" onClick={begin}>START DRILL</button>
          </div>
          <div className="steel-object" aria-hidden="true">
            <div className="steel-ring"><div className="steel-ball" /></div>
            <div className="object-label">DEPENDENCY / UNKNOWN</div>
          </div>
          <div className="manifesto-line">Strategies are useful. Drills tell you what is true.</div>
        </section>
      )}

      {stage === "scenario" && (
        <section className="instrument-panel">
          <div className="panel-meta"><span>INCIDENT / 09:14</span><span>STATUS: ACTIVE</span></div>
          <div className="incident-card">
            <div className="incident-time">09:14</div>
            <h2>Frontier model access is unavailable across Europe.</h2>
            <div className="incident-facts">
              <p>CAUSE <strong>UNKNOWN</strong></p>
              <p>RESTORATION <strong>NO ESTIMATE</strong></p>
              <p>DEPENDENCY <strong>ASSUME NOTHING</strong></p>
            </div>
          </div>
          <div className="countdown-block">
            <div className="countdown">46:00</div>
            <div className="countdown-copy">You do not have 46 minutes to discuss what to do. You have 46 minutes to discover what was never decided.</div>
          </div>
          <button className="primary" onClick={() => setStage("decisions")}>ENTER INCIDENT</button>
        </section>
      )}

      {stage === "decisions" && current && (
        <section className="decision-layout">
          <div className="decision-rail">
            <div className="eyebrow">DECISION {decisionIndex + 1} / {decisions.length}</div>
            <div className="elapsed">+{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div>
            <div className="rail-progress"><i style={{ width: `${((decisionIndex + 1) / decisions.length) * 100}%` }} /></div>
            <div className="tiny-note">{completed} decisions recorded</div>
          </div>
          <div className="decision-card">
            <div className="status-dot" />
            <h2>{current.prompt}</h2>
            <div className="choice-grid">
              {current.choices.map((choice) => (
                <button key={choice} onClick={() => choose(current, choice)}>{choice}</button>
              ))}
            </div>
            <div className="pressure-note">PRESSURE NOTE / {current.note.toUpperCase()}</div>
          </div>
        </section>
      )}

      {stage === "redline" && (
        <section className="redline-section">
          <div className="section-head">
            <div className="eyebrow">CONTROL OBJECT / REDLINE</div>
            <h2>Decide before the next incident does it for you.</h2>
          </div>
          <div className="redline-table">
            {redlineActions.map((action) => (
              <div className="redline-row" key={action}>
                <div className="redline-action">{action}</div>
                <div className="redline-zones">
                  {redlineZones.map((zone) => (
                    <button
                      key={zone}
                      className={redlines[action] === zone ? "selected" : ""}
                      onClick={() => placeRedline(action, zone)}
                    >{zone}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="primary" disabled={Object.keys(redlines).length < redlineActions.length} onClick={finishRedline}>GENERATE FIELD REPORT</button>
        </section>
      )}

      {stage === "debrief" && (
        <section className="report-wrap">
          <div className="report-sheet">
            <div className="report-kicker">BLACKOUT / DRILL 001</div>
            <div className="report-header">
              <div>
                <h2>AI continuity field report</h2>
                <p>Protocol v0.1 / local simulation</p>
              </div>
              <div className="report-stamp">OBSERVED<br/>NOT SCORED</div>
            </div>

            <div className="metrics-grid">
              <div><span>OBSERVED</span><strong>{minutes}:{String(seconds).padStart(2, "0")}</strong><small>time across forced decisions</small></div>
              <div><span>OBSERVED</span><strong>{completed}</strong><small>decisions recorded</small></div>
              <div><span>INFERRED</span><strong>{answers.manual ? 1 : 0}</strong><small>critical fallback exposed</small></div>
              <div><span>ASSUMED</span><strong>{unresolved}</strong><small>unresolved items</small></div>
            </div>

            <div className="report-section">
              <h3>Decision trace</h3>
              {decisions.map((d, i) => (
                <div className="trace-row" key={d.id}><span>0{i + 1}</span><p>{d.prompt}</p><strong>{answers[d.id] || "UNRESOLVED"}</strong></div>
              ))}
            </div>

            <div className="report-section">
              <h3>Redline</h3>
              {redlineActions.map((a) => (
                <div className="trace-row" key={a}><span>•</span><p>{a}</p><strong>{redlines[a] || "UNRESOLVED"}</strong></div>
              ))}
            </div>

            <div className="kill-question">
              <span>KILL QUESTION</span>
              <p>What evidence would make us change this policy?</p>
            </div>

            <div className="no-score">Do not collapse this into a readiness score.</div>
          </div>
          <div className="report-actions">
            <button className="secondary" onClick={() => window.print()}>PRINT / SAVE PDF</button>
            <button className="secondary" onClick={reset}>RUN AGAIN</button>
          </div>
        </section>
      )}
    </main>
  );
}
