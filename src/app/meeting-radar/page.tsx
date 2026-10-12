"use client";

import { useMemo, useRef, useState } from "react";

import { analyse, rank, type FlagKind, type Mode } from "./engine";
const demo = [
  "Chris: We need to make the brand proposition clearer before we proceed.",
  "Julian: I agree but we should start building now.",
  "Chris: We cannot start until the proposition is clear.",
  "Sikko: What evidence says the current proposition is failing?",
  "Julian: Let's build the first version and learn from it.",
  "Chris: We need to make the brand proposition clearer before we proceed.",
  "Sikko: Who actually owns this decision?",
  "Julian: I will own the prototype, but we have not agreed on approval.",
  "Sikko: Let us test that assumption with five customers before committing.",
  "Chris: Great, I can change my mind if we see that evidence.",
];

const rehearsals = [
  { name: "BridgeFund-style / conflicting priorities", lines: demo },
  { name: "Productive disagreement", lines: [
    "Alex: I think customers want a simpler proposition.",
    "Sam: I disagree, but I can change my mind if we see that evidence.",
    "Alex: Let's test that assumption with customers."
  ] },
  { name: "Unowned decision", lines: [
    "Alex: The design is ready for review.",
    "Sam: Who actually owns this decision?",
    "Alex: We have not agreed on approval."
  ] },
  { name: "Ordinary conversation", lines: [
    "Alex: Thank you for bringing the notes.",
    "Sam: You're welcome.",
    "Alex: The next meeting is on Thursday."
  ] }
];

export default function SavannahMeetingRadar() {
  const [lines, setLines] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [scenario, setScenario] = useState(0);
  const [reviews, setReviews] = useState<Record<string, "useful" | "unnecessary">>({});
  const [missedNote, setMissedNote] = useState("");
  const [missed, setMissed] = useState<string[]>([]);
  const [interruptionMode, setInterruptionMode] = useState<"quiet" | "balanced" | "active">("balanced");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [spoken, setSpoken] = useState<string[]>([]);
  const [owner, setOwner] = useState("");
  const [decision, setDecision] = useState("");
  const [deadline, setDeadline] = useState("");
  const [evidence, setEvidence] = useState("");
  const [listening, setListening] = useState(false);
  const [replayStep, setReplayStep] = useState<number | null>(null);
  const [message, setMessage] = useState("Ready for a simulated meeting or live notes.");
  const recognition = useRef<{ stop: () => void } | null>(null);
  const visibleLines = replayStep === null ? lines : lines.slice(0, replayStep);
  const flags = useMemo(() => analyse(visibleLines), [visibleLines]);
  const counts = (kind: FlagKind) => flags.filter(f => f.kind === kind).length;
  // Conservative, inspectable prioritisation. No autonomous microphone output.
  const ranked = rank(flags, interruptionMode, dismissed);
  const actionable = ranked.filter(f => f.action === "SUGGEST INTERRUPTING");
  const silent = ranked.filter(f => f.action === "STAY SILENT" || f.action === "PROTECT DISCUSSION");
  const usefulCount = Object.values(reviews).filter(v => v === "useful").length;
  const unnecessaryCount = Object.values(reviews).filter(v => v === "unnecessary").length;
  function loadScenario(i: number) {
    recognition.current?.stop();
    setListening(false);
    window.speechSynthesis?.cancel();
    setScenario(i);
    setLines(rehearsals[i].lines);
    setReplayStep(1);
    setDismissed([]);
    setSpoken([]);
    setReviews({});
    setMissed([]);
    setMissedNote("");
    setMessage("Fictional rehearsal loaded. Step through and judge Savannah's interventions.");
  }
  function downloadReceipt() {
    const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "savannah-meeting-receipt.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    setMessage("Text receipt prepared. If your browser blocks downloads, select the text below.");
  }
  function speak(text: string, id: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setMessage("Speech synthesis is unavailable in this browser."); return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
    setSpoken(prev => [...prev, id]);
  }
  const receipt = [
    "SAVANNAH / MEETING RECEIPT", "",
    "DECISION: " + (decision || "Not yet committed"),
    "OWNER: " + (owner || "Unassigned"),
    "DEADLINE: " + (deadline || "Unset"),
    "EVIDENCE / NEXT TEST: " + (evidence || "Not specified"), "",
    "INTERVENTION MODE: " + interruptionMode,
    "INTERVENTIONS OFFERED: " + actionable.length,
    "SIGNALS LEFT SILENT: " + silent.length,
    "PRODUCTIVE DISCUSSION SIGNALS: " + ranked.filter(f => f.action === "PROTECT DISCUSSION").length,
    "HUMAN-DISMISSED: " + dismissed.length,
    "HUMAN MARKED USEFUL: " + usefulCount,
    "HUMAN MARKED UNNECESSARY: " + unnecessaryCount,
    "HUMAN REPORTED MISSES: " + missed.length,
    ...missed.map(m => "- MISSED: " + m),
    "OBSERVATIONS:",
    ...flags.map(f => "- " + f.kind + ": " + f.message),
    "", "Meeting notes:", ...lines
  ].join("\n");
  function addLine() {
    if (!note.trim()) return;
    setReplayStep(null);
    setLines(prev => [...prev, note.trim()]);
    setNote("");
  }
  function toggleMic() {
    if (listening) { recognition.current?.stop(); recognition.current = null; setListening(false); return; }
    setReplayStep(null);
    type ResultEvent = { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> };
    type Rec = { continuous: boolean; interimResults: boolean; lang: string; onresult: ((e: ResultEvent) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; start: () => void; stop: () => void };
    const w = window as Window & { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const Speech = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Speech) { setMessage("Speech recognition is not available in this browser. Add notes manually."); return; }
    const rec = new Speech();
    rec.continuous = true; rec.interimResults = false; rec.lang = "en-US";
    rec.onresult = e => {
      const fresh: string[] = [];
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal && e.results[i][0].transcript.trim()) fresh.push(e.results[i][0].transcript.trim());
      }
      if (fresh.length) setLines(prev => [...prev, ...fresh]);
    };
    rec.onend = () => { setListening(false); recognition.current = null; };
    rec.onerror = () => { setMessage("Microphone recognition stopped. You can still type notes."); setListening(false); };
    try { rec.start(); recognition.current = rec; setListening(true); setMessage("Microphone active. Browser speech recognition may use a vendor service; do not use confidential meetings without consent."); }
    catch { setMessage("Could not start microphone. Check browser permissions."); }
  }
  const button: React.CSSProperties = { background: "#e8e5dc", color: "#111", border: 0, padding: "12px 17px", cursor: "pointer", fontWeight: 700, borderRadius: 4 };
  const input: React.CSSProperties = { background: "#1d1d1d", border: "1px solid #555", color: "#f3f1eb", padding: 12, width: "100%", borderRadius: 4, fontSize: 15 };
  return <main style={{ minHeight: "100vh", background: "#101010", color: "#f3f1eb", fontFamily: "Arial, sans-serif", padding: "clamp(20px,4vw,65px)" }}>
    <div style={{ maxWidth: 1100, margin: "auto" }}>
      <div style={{ letterSpacing: 3, fontSize: 12, color: "#aaa" }}>CTRL+LOVE / FIELD INSTRUMENT 001</div>
      <h1 style={{ fontSize: "clamp(36px,6vw,76px)", margin: "18px 0 8px", letterSpacing: -2 }}>SAVANNAH <span style={{ color: "#9c9c94" }}>/ MEETING RADAR</span></h1>
      <p style={{ color: "#bcbcb8", maxWidth: 700, lineHeight: 1.5 }}>A room that can notice when the conversation stops moving. Prototype detection is rule-based, not an AI judgement system.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "25px 0" }}>
        <button style={button} onClick={() => loadScenario(scenario)}>▶ Run simulated meeting</button>
        <button style={{ ...button, background: listening ? "#e2a28e" : "#777", color: "#fff" }} onClick={toggleMic}>{listening ? "■ Stop microphone" : "◉ Use microphone"}</button>
        <button style={{ ...button, background: "#333", color: "#eee" }} onClick={() => { recognition.current?.stop(); setListening(false); setLines([]); setReplayStep(null); setDismissed([]); setSpoken([]); setReviews({}); setMissed([]); window.speechSynthesis?.cancel(); setMessage("Session cleared."); }}>Clear session</button>
      </div>
      <label style={{ display: "block", maxWidth: 430, fontSize: 12, color: "#aaa" }}>Choose a fictional test scenario
        <select value={scenario} onChange={e => loadScenario(Number(e.target.value))} style={{ ...input, marginTop: 8 }}>
          {rehearsals.map((r, i) => <option key={r.name} value={i}>{r.name}</option>)}
        </select>
      </label>
      {replayStep !== null && <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", padding: "15px 0" }}>
        <strong>REHEARSAL: {replayStep} / {lines.length} statements</strong>
        <button style={button} disabled={replayStep >= lines.length} onClick={() => setReplayStep(n => n === null ? null : Math.min(lines.length, n + 1))}>Next statement →</button>
        <button style={{ ...button, background: "#333", color: "#eee" }} onClick={() => setReplayStep(null)}>Show full meeting</button>
      </div>}
      <p role="status" style={{ fontSize: 12, color: "#aaa" }}>{message} Session stays in page memory only; copying a receipt is optional.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, margin: "28px 0" }}>
        {([["LOOP", "Circular arguments"], ["CONTRADICTION", "Opposing directions"], ["DECISION", "Open ownership"], ["EVIDENCE", "Evidence questions"], ["PRODUCTIVE", "Productive signals"]] as const).map(([kind, label]) => <div key={kind} style={{ padding: 22, border: "1px solid #444" }}><div style={{ color: "#aaa", fontSize: 12 }}>{label}</div><div style={{ fontSize: 48, marginTop: 8 }}>{counts(kind)}</div></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28 }}>
        <section><h2 style={{ fontSize: 23 }}>01 / THE ROOM</h2>
          <div style={{ height: 330, overflowY: "auto", border: "1px solid #444", padding: 18, lineHeight: 1.6 }}>
            {lines.length === 0 ? <span style={{ color: "#888" }}>No observations yet. Run the demo or add a line.</span> : visibleLines.map((l, i) => <p key={i} style={{ margin: "0 0 15px" }}><span style={{ color: "#888" }}>{String(i + 1).padStart(2, "0")} </span>{l}</p>)}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}><input aria-label="Meeting note" style={input} value={note} placeholder="Add a statement from the room…" onChange={e => setNote(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addLine(); }} /><button style={button} onClick={addLine}>Add</button></div>
        </section>
        <section><h2 style={{ fontSize: 23 }}>02 / SAVANNAH JUDGES</h2>
          <label style={{ display: "block", marginBottom: 14, color: "#aaa", fontSize: 12 }}>Interruption threshold
            <select aria-label="Interruption threshold" value={interruptionMode} onChange={e => setInterruptionMode(e.target.value as "quiet" | "balanced" | "active")} style={{ ...input, marginTop: 7 }}>
              <option value="quiet">Quiet — only contradictions</option>
              <option value="balanced">Balanced — contradictions and unresolved decisions</option>
              <option value="active">Active — all detected signals</option>
            </select>
          </label>
          <div aria-live="polite" style={{ border: "1px solid #555", padding: 22, minHeight: 330 }}>
            <p style={{ fontSize: 12, color: "#aaa" }}>{actionable.length} interruption candidates · {silent.length} intentionally silent · {dismissed.length} dismissed</p>
            {ranked.length ? ranked.map(f => <div key={f.id} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #333" }}>
              <div style={{ color: f.action === "SUGGEST INTERRUPTING" ? "#d4bb9d" : "#999", fontSize: 11, letterSpacing: 1.5 }}>{f.kind} / LINE {f.line + 1} / {f.action}</div>
              <p style={{ fontSize: 17, lineHeight: 1.45, margin: "8px 0" }}>“{f.message}”</p>
              <p style={{ fontSize: 12, color: "#aaa" }}>{f.action === "PROTECT DISCUSSION" ? "A falsifiable next step or openness to evidence was detected. Preserve the discussion." : f.action === "STAY SILENT" ? "Not important enough to interrupt under this setting." : f.action === "DISMISSED" ? "Human chose not to interrupt." : "Candidate only: a human decides whether Savannah speaks."}</p>
              {f.action === "SUGGEST INTERRUPTING" && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{ ...button, padding: "8px 12px" }} onClick={() => speak(f.message, f.id)}>{spoken.includes(f.id) ? "↻ Speak again" : "▷ Let Savannah speak"}</button>
                <button style={{ ...button, padding: "8px 12px", background: "#333", color: "#eee" }} onClick={() => setDismissed(prev => [...prev, f.id])}>Not worth interrupting</button>
              </div>}
              {f.action === "SUGGEST INTERRUPTING" && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 9 }}>
                <button aria-pressed={reviews[f.id] === "useful"} style={{ ...button, padding: "8px 12px", background: reviews[f.id] === "useful" ? "#a8c4a4" : "#333", color: reviews[f.id] === "useful" ? "#111" : "#eee" }} onClick={() => setReviews(prev => ({ ...prev, [f.id]: "useful" }))}>✓ Useful interruption</button>
                <button aria-pressed={reviews[f.id] === "unnecessary"} style={{ ...button, padding: "8px 12px", background: reviews[f.id] === "unnecessary" ? "#e2a28e" : "#333", color: reviews[f.id] === "unnecessary" ? "#111" : "#eee" }} onClick={() => setReviews(prev => ({ ...prev, [f.id]: "unnecessary" }))}>× Unnecessary</button>
              </div>}
              {f.action === "DISMISSED" && <button style={{ ...button, padding: "8px 12px", background: "#333", color: "#eee" }} onClick={() => setDismissed(prev => prev.filter(id => id !== f.id))}>Restore suggestion</button>}
            </div>) : <p style={{ color: "#888" }}>Nothing worth interrupting yet. A quiet Savannah is a feature.</p>}
          </div>
        </section>
      </div>
      <section style={{ marginTop: 42, borderTop: "1px solid #555", paddingTop: 22 }}>
        <h2>03 / HUMAN JUDGEMENT LAB</h2>
        <p style={{ color: "#aaa" }}>The model proposes. You judge. These labels stay in this browser tab and are included in the receipt; they are not training data or uploaded anywhere.</p>
        <p>{usefulCount} marked useful · {unnecessaryCount} marked unnecessary · {missed.length} missed opportunities reported</p>
        <label style={{ display: "block", maxWidth: 700, fontSize: 12, color: "#aaa" }}>Did Savannah miss an intervention?
          <textarea value={missedNote} onChange={e => setMissedNote(e.target.value)} placeholder="What should she have noticed, and at which statement?" style={{ ...input, marginTop: 8, minHeight: 85, resize: "vertical" }} />
        </label>
        <button style={{ ...button, marginTop: 10 }} disabled={!missedNote.trim()} onClick={() => { setMissed(prev => [...prev, missedNote.trim()]); setMissedNote(""); }}>Record missed opportunity</button>
      </section>
      <section style={{ marginTop: 42, borderTop: "1px solid #555", paddingTop: 22 }}>
        <h2>04 / MAKE THE DECISION REAL</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(225px,1fr))", gap: 12 }}>
          {([["Decision", decision, setDecision], ["Owner", owner, setOwner], ["Deadline", deadline, setDeadline], ["Evidence / next test", evidence, setEvidence]] as const).map(([label, value, setter]) => <label key={label} style={{ fontSize: 12, color: "#aaa" }}>{label}<input style={{ ...input, marginTop: 7 }} value={value} onChange={e => setter(e.target.value)} /></label>)}
        </div>
        <button style={{ ...button, marginTop: 20 }} onClick={async () => { try { await navigator.clipboard.writeText(receipt); setMessage("Receipt copied."); } catch { setMessage("Clipboard unavailable. Select and copy the receipt below."); } }}>Copy decision receipt</button>
        <button style={{ ...button, marginTop: 20, marginLeft: 10, background: "#333", color: "#eee" }} onClick={downloadReceipt}>Download .txt</button>
        <label style={{ display: "block", marginTop: 20, fontSize: 12, color: "#aaa" }}>Selectable receipt text — long-press to select on iPhone
          <textarea readOnly aria-label="Selectable meeting receipt" value={receipt} onFocus={e => e.currentTarget.select()} style={{ ...input, marginTop: 8, minHeight: 220, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
        </label>
      </section>
      <footer style={{ marginTop: 50, fontSize: 12, color: "#888" }}>Prototype only • No server-side meeting storage • Obtain participant consent before recording • A human decides when to intervene.</footer>
    </div>
  </main>;
}
