"use client";

import { useMemo, useRef, useState } from "react";

type FlagKind = "LOOP" | "CONTRADICTION" | "DECISION" | "EVIDENCE";
type Flag = { kind: FlagKind; message: string; line: number };
const demo = [
  "Chris: We need to make the brand proposition clearer before we proceed.",
  "Julian: I agree but we should start building now.",
  "Chris: We cannot start until the proposition is clear.",
  "Sikko: What evidence says the current proposition is failing?",
  "Julian: Let's build the first version and learn from it.",
  "Chris: We need to make the brand proposition clearer before we proceed.",
  "Sikko: Who actually owns this decision?",
  "Julian: I will own the prototype, but we have not agreed on approval.",
];

function analyse(lines: string[]): Flag[] {
  const result: Flag[] = [];
  const seen = new Map<string, number>();
  lines.forEach((original, index) => {
    const line = original.replace(/^[^:]{1,30}:\s*/, "").toLowerCase().trim();
    if (!line) return;
    const clean = line.replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    if (clean.length > 25 && seen.has(clean)) result.push({ kind: "LOOP", message: "This point has been made before. What new evidence would move it forward?", line: index });
    else if (clean.length > 25) seen.set(clean, index);
    if (/who (actually )?owns|who decides|not agreed on approval|who approves/i.test(line)) result.push({ kind: "DECISION", message: "Decision ownership or approval is unresolved. Name an owner and a deadline.", line: index });
    if (/what evidence|where is the evidence|how do we know|what would change your mind/i.test(line)) result.push({ kind: "EVIDENCE", message: "An evidence question has been raised. Record what would count as proof.", line: index });
  });
  const together = lines.join(" ").toLowerCase();
  if (/start building now|start building|build the first version/.test(together) && /cannot start until|can't start until/.test(together)) {
    result.push({ kind: "CONTRADICTION", message: "The room is pulling in opposite directions: build now versus wait for clarity. Decide what can be tested without final approval.", line: lines.length - 1 });
  }
  return result.sort((a, b) => a.line - b.line);
}

export default function SavannahMeetingRadar() {
  const [lines, setLines] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [owner, setOwner] = useState("");
  const [decision, setDecision] = useState("");
  const [deadline, setDeadline] = useState("");
  const [evidence, setEvidence] = useState("");
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("Ready for a simulated meeting or live notes.");
  const recognition = useRef<{ stop: () => void } | null>(null);
  const flags = useMemo(() => analyse(lines), [lines]);
  const counts = (kind: FlagKind) => flags.filter(f => f.kind === kind).length;
  const receipt = [
    "SAVANNAH / MEETING RECEIPT", "",
    "DECISION: " + (decision || "Not yet committed"),
    "OWNER: " + (owner || "Unassigned"),
    "DEADLINE: " + (deadline || "Unset"),
    "EVIDENCE / NEXT TEST: " + (evidence || "Not specified"), "",
    "OBSERVATIONS:",
    ...flags.map(f => "- " + f.kind + ": " + f.message),
    "", "Meeting notes:", ...lines
  ].join("\n");
  function addLine() {
    if (!note.trim()) return;
    setLines(prev => [...prev, note.trim()]);
    setNote("");
  }
  function toggleMic() {
    if (listening) { recognition.current?.stop(); recognition.current = null; setListening(false); return; }
    type ResultEvent = { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> };
    type Rec = { continuous: boolean; interimResults: boolean; lang: string; onresult: ((e: ResultEvent) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; start: () => void; stop: () => void };
    const w = window as Window & { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const Speech = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Speech) { setMessage("Speech recognition is not available in this browser. Add notes manually."); return; }
    const rec = new Speech();
    rec.continuous = true; rec.interimResults = false; rec.lang = "en-US";
    rec.onresult = e => {
      const fresh: string[] = [];
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) fresh.push(e.results[i][0].transcript.trim());
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
        <button style={button} onClick={() => { setLines(demo); setMessage("Demo loaded. These lines are fictional test data."); }}>▶ Run simulated meeting</button>
        <button style={{ ...button, background: listening ? "#e2a28e" : "#777", color: "#fff" }} onClick={toggleMic}>{listening ? "■ Stop microphone" : "◉ Use microphone"}</button>
        <button style={{ ...button, background: "#333", color: "#eee" }} onClick={() => { recognition.current?.stop(); setLines([]); setMessage("Session cleared."); }}>Clear session</button>
      </div>
      <p role="status" style={{ fontSize: 12, color: "#aaa" }}>{message} Session stays in page memory only; copying a receipt is optional.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, margin: "28px 0" }}>
        {([["LOOP", "Circular arguments"], ["CONTRADICTION", "Opposing directions"], ["DECISION", "Open ownership"], ["EVIDENCE", "Evidence questions"]] as const).map(([kind, label]) => <div key={kind} style={{ padding: 22, border: "1px solid #444" }}><div style={{ color: "#aaa", fontSize: 12 }}>{label}</div><div style={{ fontSize: 48, marginTop: 8 }}>{counts(kind)}</div></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28 }}>
        <section><h2 style={{ fontSize: 23 }}>01 / THE ROOM</h2>
          <div style={{ height: 330, overflowY: "auto", border: "1px solid #444", padding: 18, lineHeight: 1.6 }}>
            {lines.length === 0 ? <span style={{ color: "#888" }}>No observations yet. Run the demo or add a line.</span> : lines.map((l, i) => <p key={i} style={{ margin: "0 0 15px" }}><span style={{ color: "#888" }}>{String(i + 1).padStart(2, "0")} </span>{l}</p>)}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}><input aria-label="Meeting note" style={input} value={note} placeholder="Add a statement from the room…" onChange={e => setNote(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addLine(); }} /><button style={button} onClick={addLine}>Add</button></div>
        </section>
        <section><h2 style={{ fontSize: 23 }}>02 / SAVANNAH INTERRUPTS</h2>
          <div aria-live="polite" style={{ border: "1px solid #555", padding: 22, minHeight: 330 }}>
            {flags.length ? flags.map((f, i) => <div key={i} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid #333" }}><div style={{ color: "#b6a89c", fontSize: 11, letterSpacing: 2 }}>{f.kind} / LINE {f.line + 1}</div><p style={{ fontSize: 17, lineHeight: 1.45, margin: "8px 0" }}>“{f.message}”</p></div>) : <p style={{ color: "#888" }}>Nothing worth interrupting yet. A quiet Savannah is a feature.</p>}
          </div>
        </section>
      </div>
      <section style={{ marginTop: 42, borderTop: "1px solid #555", paddingTop: 22 }}>
        <h2>03 / MAKE THE DECISION REAL</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(225px,1fr))", gap: 12 }}>
          {([["Decision", decision, setDecision], ["Owner", owner, setOwner], ["Deadline", deadline, setDeadline], ["Evidence / next test", evidence, setEvidence]] as const).map(([label, value, setter]) => <label key={label} style={{ fontSize: 12, color: "#aaa" }}>{label}<input style={{ ...input, marginTop: 7 }} value={value} onChange={e => setter(e.target.value)} /></label>)}
        </div>
        <button style={{ ...button, marginTop: 20 }} onClick={async () => { try { await navigator.clipboard.writeText(receipt); setMessage("Receipt copied."); } catch { setMessage("Clipboard unavailable. Select and copy the receipt below."); } }}>Copy decision receipt</button>
        <details style={{ marginTop: 18 }}><summary style={{ cursor: "pointer" }}>View receipt</summary><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "#222", padding: 18 }}>{receipt}</pre></details>
      </section>
      <footer style={{ marginTop: 50, fontSize: 12, color: "#888" }}>Prototype only • No server-side meeting storage • Obtain participant consent before recording • A human decides when to intervene.</footer>
    </div>
  </main>;
}
