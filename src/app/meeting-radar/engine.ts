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
  const together = lines.join(" ").toLowerCase();
  const productiveIndex = lines.findIndex(l => /test (that|the|this) assumption|experiment|change my mind if|validate with (customers|users)/i.test(l));
  if (productiveIndex !== -1) result.push({ kind: "PRODUCTIVE", message: "The room has proposed a test or evidence that could change a position. Protect this exploration rather than interrupting it.", line: productiveIndex });
  const buildingIndex = lines.findIndex(l => /start building now|start building|build the first version/i.test(l));
  const blockingIndex = lines.findIndex(l => /cannot start until|can't start until/i.test(l));
  if (buildingIndex !== -1 && blockingIndex !== -1) {
    const line = Math.max(buildingIndex, blockingIndex);
    result.push({ kind: "CONTRADICTION", message: "The room is pulling in opposite directions: build now versus wait for clarity. Decide what can be tested without final approval.", line });
  }
  return result.sort((a, b) => a.line - b.line);
}

export function rank(flags: Flag[], mode: Mode, dismissed: string[] = []): Intervention[] {
  const threshold = mode === "quiet" ? 3 : mode === "balanced" ? 2 : 1;
  return flags.map(f => {
    const id = f.kind + ":" + f.line;
    // Evidence proposed AFTER an earlier conflict does not erase its history;
    // it only de-escalates an as-yet-unresolved suggestion.
    const hasProductiveFollowUp = flags.some(x => x.kind === "PRODUCTIVE" && x.line >= f.line);
    const score = f.kind === "CONTRADICTION" ? (hasProductiveFollowUp ? 1 : 3) : f.kind === "DECISION" ? 2 : f.kind === "PRODUCTIVE" ? 0 : 1;
    const action: Intervention["action"] = f.kind === "PRODUCTIVE" ? "PROTECT DISCUSSION" : dismissed.includes(id) ? "DISMISSED" : score >= threshold ? "SUGGEST INTERRUPTING" : "STAY SILENT";
    return { ...f, id, score, action };
  });
}
