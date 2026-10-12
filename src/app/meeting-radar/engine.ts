export type FlagKind = "LOOP" | "CONTRADICTION" | "DECISION" | "EVIDENCE" | "PRODUCTIVE";
export type Flag = { kind: FlagKind; message: string; line: number };
export type Mode = "quiet" | "balanced" | "active";
export type Intervention = Flag & { id: string; score: number; action: "DISMISSED" | "SUGGEST INTERRUPTING" | "STAY SILENT" | "PROTECT DISCUSSION" };

export function analyse(lines: string[]): Flag[] {
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
  lines.forEach((l, index) => {
    if (/test (that|the|this) assumption|experiment|change my mind if|validate with (customers|users)/i.test(l)) {
      result.push({ kind: "PRODUCTIVE", message: "The room has proposed a test or evidence that could change a position. Protect this exploration rather than interrupting it.", line: index });
    }
  });
  // Treat only explicit competing proposals within the same short exchange as a conflict.
  // A quotation, a changed mind by one speaker, or unrelated discussion minutes later
  // must not trigger an interruption. This is still a deliberately narrow heuristic.
  const speakerOf = (s: string) => /^([^:]{1,30}):\s/.exec(s)?.[1].trim().toLowerCase();
  const building = lines.map((s, i) => /\b(?:we should|we can|let'?s|i think we should)\s+(?:start building(?: now)?|build the first version)\b/i.test(s) ? i : -1).filter(i => i >= 0);
  const blocking = lines.map((s, i) => /\b(?:cannot|can't|should not|must not) start until\\b/i.test(s) ? i : -1).filter(i => i >= 0);
  let conflictLine = -1;
  for (const a of building) for (const b of blocking) {
    if (a === b || Math.abs(a - b) > 6) continue;
    const speakerA = speakerOf(lines[a]);
    const speakerB = speakerOf(lines[b]);
    if (speakerA && speakerB && speakerA === speakerB) continue;
    conflictLine = Math.max(conflictLine, a, b);
  }
  if (conflictLine !== -1) {
    result.push({ kind: "CONTRADICTION", message: "The room is pulling in opposite directions: build now versus wait for clarity. Decide what can be tested without final approval.", line: conflictLine });
  }
  return result.sort((a, b) => a.line - b.line);
}

export function rank(flags: Flag[], mode: Mode, dismissed: string[] = []): Intervention[] {
  const threshold = mode === "quiet" ? 3 : mode === "balanced" ? 2 : 1;
  return flags.map(f => {
    const id = f.kind + ":" + f.line;
    // Evidence proposed AFTER an earlier conflict does not erase its history;
    // it only de-escalates an as-yet-unresolved suggestion.
    const hasProductiveFollowUp = flags.some(x => x.kind === "PRODUCTIVE" && x.line >= f.line && x.line - f.line <= 5);
    const score = f.kind === "CONTRADICTION" ? (hasProductiveFollowUp ? 1 : 3) : f.kind === "DECISION" ? 2 : f.kind === "PRODUCTIVE" ? 0 : 1;
    const action: Intervention["action"] = f.kind === "PRODUCTIVE" ? "PROTECT DISCUSSION" : dismissed.includes(id) ? "DISMISSED" : score >= threshold ? "SUGGEST INTERRUPTING" : "STAY SILENT";
    return { ...f, id, score, action };
  });
}
