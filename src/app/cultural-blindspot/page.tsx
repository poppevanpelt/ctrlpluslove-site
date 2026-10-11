"use client";

import { useMemo, useState } from "react";

type Metric = "clarity" | "trust" | "feasibility" | "resonance";
type Review = { id: number; context: string; evidence: string; clarity: number; trust: number; feasibility: number; resonance: number };
const metrics: { key: Metric; label: string; explanation: string }[] = [
  { key: "clarity", label: "Clarity", explanation: "Does the audience understand the offer?" },
  { key: "trust", label: "Trust", explanation: "Is the evidence credible in this setting?" },
  { key: "feasibility", label: "Feasibility", explanation: "Are local constraints addressed?" },
  { key: "resonance", label: "Resonance", explanation: "Does the framing work for this audience?" },
];
const initialReviews: Review[] = [
  { id: 1, context: "Context A", evidence: "", clarity: 3, trust: 3, feasibility: 3, resonance: 3 },
  { id: 2, context: "Context B", evidence: "", clarity: 3, trust: 3, feasibility: 3, resonance: 3 },
  { id: 3, context: "Context C", evidence: "", clarity: 3, trust: 3, feasibility: 3, resonance: 3 },
];
const score = (r: Review) => Math.round(metrics.reduce((sum, m) => sum + r[m.key], 0) / 20 * 100);

export default function CulturalBlindspotPage() {
  const [proposal, setProposal] = useState("");
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [assumptions, setAssumptions] = useState("");
  const [notice, setNotice] = useState("");
  const scores = useMemo(() => reviews.map(score), [reviews]);
  const spread = Math.max(...scores) - Math.min(...scores);
  const evidenceCount = reviews.filter(r => r.evidence.trim().length > 0).length;
  const ready = proposal.trim().length > 0 && evidenceCount === reviews.length && reviews.length >= 2;
  const status = !ready ? "INSUFFICIENT EVIDENCE" : spread >= 25 ? "HIGH CONTEXT SENSITIVITY" : spread >= 10 ? "CONTEXT SENSITIVITY" : "CONSISTENT IN THIS TEST";
  const update = (id: number, patch: Partial<Review>) => setReviews(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  const report = () => ({
    instrument: "CULTURAL BLINDSPOT™", version: "0.1 — human-scored pilot",
    proposal, assumptions, rubric: "Four 1–5 ratings per context; average mapped to 20–100. Descriptive only, not psychometrically validated.",
    reviews: reviews.map(r => ({ ...r, score: score(r) })),
    spread, evidenceCount, status, ready, generatedAt: new Date().toISOString(),
    warning: "Context labels do not represent national populations. Scores are entered by reviewers, not inferred by AI.",
  });
  async function copyReport() {
    try { await navigator.clipboard.writeText(JSON.stringify(report(), null, 2)); setNotice("Report copied to clipboard."); }
    catch { setNotice("Clipboard unavailable. Use your browser's print function to save this review."); }
  }
  return (
    <main className="cb-page">
      <header className="cb-header"><a href="/" aria-label="ctrl+love home">ctrl+love</a><span>INSTRUMENT / 013 / PILOT</span></header>
      <section className="cb-hero">
        <p className="cb-eyebrow">A PRESSURE TEST FOR IMPORTED ASSUMPTIONS</p>
        <h1>CULTURAL<br />BLINDSPOT<span>™</span></h1>
        <p className="cb-lede">A recommendation can sound perfectly reasonable. Until it crosses a border.</p>
        <p className="cb-description">Test the same decision across contexts. Record locally grounded evidence. Find the places where your preferred answer may stop making sense.</p>
      </section>
      <section className="cb-section">
        <div className="cb-sectiontitle"><span>01 / THE DECISION</span><span>KEEP THE PROPOSITION CONSTANT</span></div>
        <label htmlFor="proposal">What decision, proposal or recommendation are you testing?</label>
        <textarea id="proposal" rows={4} placeholder="e.g. Approve a paid AI concierge pilot for a group of independent villas." value={proposal} onChange={e => setProposal(e.target.value)} />
        <label htmlFor="assumptions">What might you be assuming? <small>Optional, but valuable.</small></label>
        <textarea id="assumptions" rows={2} placeholder="e.g. A fast digital checkout is universally reassuring." value={assumptions} onChange={e => setAssumptions(e.target.value)} />
      </section>
      <section className="cb-section">
        <div className="cb-sectiontitle"><span>02 / CONTEXT REVIEW</span><span>1 = WEAK · 3 = UNCERTAIN · 5 = STRONG</span></div>
        <p className="cb-help">Choose contexts your team can actually investigate. These are review panels, not country stereotypes. Ask locally knowledgeable reviewers to rate each dimension and cite what informed them. Defaults are neutral placeholders, not findings.</p>
        <div className="cb-panels">
          {reviews.map((r, index) => (
            <article className="cb-panel" key={r.id}>
              <div className="cb-panelhead"><span>CONTEXT {String(index + 1).padStart(2, "0")}</span>{reviews.length > 2 && <button type="button" onClick={() => setReviews(rs => rs.filter(x => x.id !== r.id))}>REMOVE</button>}</div>
              <label htmlFor={`context-${r.id}`}>Audience / market / specific setting</label>
              <input id={`context-${r.id}`} value={r.context} onChange={e => update(r.id, { context: e.target.value })} />
              {metrics.map(m => <div className="cb-metric" key={m.key}>
                <div className="cb-metrichead"><label htmlFor={`${m.key}-${r.id}`}>{m.label}</label><strong>{r[m.key]}/5</strong></div>
                <small>{m.explanation}</small>
                <input type="range" id={`${m.key}-${r.id}`} min={1} max={5} step={1} value={r[m.key]} onChange={e => update(r.id, { [m.key]: Number(e.target.value) })} />
              </div>)}
              <label htmlFor={`evidence-${r.id}`}>Local evidence / source / reviewer</label>
              <textarea id={`evidence-${r.id}`} rows={3} placeholder="Interview, field observation, local test, data source + date…" value={r.evidence} onChange={e => update(r.id, { evidence: e.target.value })} />
              <div className="cb-result"><span>REVIEW SCORE</span><strong>{score(r)}<small>/100</small></strong></div>
            </article>
          ))}
        </div>
        <button className="cb-add" type="button" onClick={() => setReviews(rs => [...rs, { ...initialReviews[0], id: Math.max(...rs.map(r => r.id)) + 1, context: `Context ${rs.length + 1}` }])}>+ ADD A CONTEXT</button>
      </section>
      <section className="cb-section cb-output" aria-live="polite">
        <div className="cb-sectiontitle"><span>03 / THE READOUT</span><span>DESCRIPTIVE, NOT A SCIENTIFIC CULTURAL INDEX</span></div>
        <div className="cb-verdict"><div><small>OBSERVED SCORE SPREAD</small><strong>{spread}<span> points</span></strong></div><div><small>INTERPRETATION</small><h2>{status}</h2><p>{ready ? "These reviewer scores differ across the contexts entered. Investigate why before transferring the recommendation." : "Add the proposal and a cited evidence note for every context to unlock an interpretable readout."}</p></div></div>
        <div className="cb-bars">{reviews.map(r => <div className="cb-bar" key={r.id}><div><span>{r.context || "Unlabelled context"}</span><strong>{score(r)}</strong></div><div className="cb-track"><div style={{ width: `${score(r)}%` }} /></div></div>)}</div>
        <div className="cb-caution"><strong>WHAT THIS CAN AND CANNOT SAY</strong><p>The scores are entered by human reviewers. Differences indicate where to investigate, not why they exist. A country's average values do not define an individual. This pilot has no normative population sample, confidence intervals, automated validation, or causal inference. It does not certify fairness.</p></div>
        <div className="cb-actions"><button type="button" onClick={copyReport}>COPY EVIDENCE REPORT ↗</button><button type="button" onClick={() => window.print()}>PRINT / SAVE REVIEW ↗</button></div>
        {notice && <p role="status">{notice}</p>}
      </section>
      <footer className="cb-footer"><span>ctrl+love / WE BUILD INSTRUMENTS FOR HUMAN JUDGEMENT.</span><span>QUESTION THE BASELINE.</span></footer>
      <style jsx>{`
        .cb-page{--bg:#e9e6de;--ink:#211f1c;--line:#bab5ac;--accent:#a12a29;background:var(--bg);color:var(--ink);min-height:100vh;font-family:Arial,Helvetica,sans-serif}
        .cb-header,.cb-footer{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:24px clamp(20px,5vw,84px);font-size:11px;letter-spacing:.12em;border-bottom:1px solid var(--line)}
        .cb-header a{font-size:22px;color:inherit;font-weight:800;letter-spacing:-.08em;text-decoration:none}.cb-hero,.cb-section{padding:60px clamp(20px,5vw,84px);max-width:1700px;margin:auto}
        .cb-hero{padding-top:100px;padding-bottom:95px}.cb-eyebrow,.cb-sectiontitle,.cb-panelhead{font-size:11px;letter-spacing:.18em;font-weight:800}
        h1{font-size:clamp(60px,11vw,178px);letter-spacing:-.085em;line-height:.8;margin:28px 0 32px;font-weight:900}h1 span{font-size:.24em;vertical-align:top;letter-spacing:0;color:var(--accent)}
        .cb-lede{font-size:clamp(22px,3vw,42px);max-width:810px;line-height:1.12;font-weight:750}.cb-description{font-size:17px;max-width:680px;line-height:1.5}
        .cb-section{border-top:1px solid var(--line)}.cb-sectiontitle,.cb-panelhead{display:flex;justify-content:space-between;gap:12px;margin-bottom:35px}.cb-sectiontitle span:last-child{color:#777068}
        label{display:block;font-weight:700;font-size:14px;margin:18px 0 9px}label small,.cb-help,.cb-metric small{font-size:12px;font-weight:400;color:#665f58}
        textarea,input:not([type=range]){font:inherit;background:rgba(255,255,255,.35);border:1px solid var(--line);padding:14px 15px;border-radius:0;color:var(--ink);width:100%}textarea:focus,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        .cb-panels{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,285px),1fr));gap:12px}.cb-panel{border:1px solid var(--ink);padding:24px;min-width:0}.cb-panelhead{margin-bottom:28px}.cb-panelhead button{border:0;background:none;text-decoration:underline;cursor:pointer;font-size:10px}
        .cb-metric{border-bottom:1px solid var(--line);padding:12px 0}.cb-metrichead{display:flex;justify-content:space-between;align-items:center}.cb-metrichead label{margin:0}.cb-metrichead strong{font-size:20px}.cb-metric small{display:block;margin:5px 0 9px}.cb-metric input{width:100%;accent-color:var(--accent)}
        .cb-result{display:flex;justify-content:space-between;align-items:end;border-top:2px solid var(--ink);margin-top:24px;padding-top:15px}.cb-result span{font-size:11px;letter-spacing:.1em}.cb-result strong{font-size:54px;line-height:1}.cb-result strong small{font-size:14px}
        .cb-add,.cb-actions button{border:1px solid var(--ink);background:var(--ink);color:var(--bg);padding:15px 19px;margin-top:20px;cursor:pointer;font-size:12px;font-weight:800;letter-spacing:.07em}.cb-add{background:transparent;color:var(--ink)}
        .cb-verdict{display:grid;grid-template-columns:1fr 2fr;gap:35px;padding:25px 0 35px;border-bottom:1px solid var(--line)}.cb-verdict small{font-size:11px;letter-spacing:.1em}.cb-verdict strong{display:block;font-size:clamp(80px,12vw,154px);line-height:1;letter-spacing:-.09em}.cb-verdict strong span{font-size:16px;letter-spacing:0}.cb-verdict h2{font-size:clamp(24px,3vw,45px);line-height:1;margin:17px 0;color:var(--accent)}.cb-verdict p{max-width:520px;line-height:1.45}
        .cb-bars{padding:30px 0}.cb-bar{margin-bottom:22px}.cb-bar>div:first-child{display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px}.cb-track{height:13px;background:#ccc6bc}.cb-track>div{height:100%;background:var(--ink);transition:width .2s}
        .cb-caution{max-width:820px;font-size:14px;line-height:1.55;border-left:3px solid var(--accent);padding-left:20px}.cb-caution strong{font-size:12px;letter-spacing:.1em}.cb-actions{display:flex;gap:12px;flex-wrap:wrap}.cb-footer{border-top:1px solid var(--line);border-bottom:0}
        @media(max-width:650px){.cb-hero{padding-top:75px;padding-bottom:60px}.cb-verdict{grid-template-columns:1fr}.cb-sectiontitle span:last-child{display:none}.cb-header,.cb-footer{font-size:9px}.cb-panel{padding:18px}}
        @media print{.cb-add,.cb-actions,.cb-panelhead button{display:none}.cb-section{break-inside:avoid}.cb-page{background:white}}
      `}</style>
    </main>
  );
}
