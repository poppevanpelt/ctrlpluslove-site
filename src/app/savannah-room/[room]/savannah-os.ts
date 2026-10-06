export type RoomTranscriptRole = "user" | "assistant";

export type RoomTranscriptLine = {
  role: RoomTranscriptRole;
  text: string;
  at: number;
};

export type RoomMemory = {
  version: 1;
  roomSlug: string;
  updatedAt: string;
  transcript: RoomTranscriptLine[];
  decisions: string[];
  owners: string[];
  openQuestions: string[];
  nextTests: string[];
  preferences: string[];
};

export type ActionKind = "follow-up" | "decision-note" | "next-primer";

const DECISION_RE = /\b(decided|we decided|decision is|we'll|we will|we're going to|agreed|agree that|besloten|we besluiten|we gaan|afgesproken|akkoord dat)\b/i;
const OWNER_RE = /\b(owner|owns|responsible|will take|will do|takes this|actiehouder|verantwoordelijk|pakt dit|neemt dit)\b/i;
const TEST_RE = /\b(test|pilot|prototype|experiment|try this|next step|check|testen|proef|proberen|volgende stap)\b/i;
const PREFERENCE_RE = /\b(i prefer|i like|i hate|i don't want|works better|prefer|liever|hekel|ik wil niet|werkt beter)\b/i;
const OPPOSITION_RE = /\b(disagree|don't agree|however|but that|push back|not convinced|friction|bezwaar|oneens|niet mee eens|maar dat|twijfel)\b/i;

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, 1200);
}

function uniqueRecent(items: string[], limit: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (let index = items.length - 1; index >= 0 && result.length < limit; index -= 1) {
    const value = clean(items[index]);
    if (!value) continue;
    const key = value.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.unshift(value);
  }

  return result;
}

export function deriveRoomMemory(roomSlug: string, input: RoomTranscriptLine[]): RoomMemory {
  const transcript = input
    .map((line) => ({ role: line.role, text: clean(line.text), at: Number.isFinite(line.at) ? line.at : Date.now() }))
    .filter((line) => line.text)
    .slice(-120);
  const human = transcript.filter((line) => line.role === "user");

  return {
    version: 1,
    roomSlug,
    updatedAt: new Date(transcript.at(-1)?.at ?? Date.now()).toISOString(),
    transcript,
    decisions: uniqueRecent(human.filter((line) => DECISION_RE.test(line.text)).map((line) => line.text), 6),
    owners: uniqueRecent(human.filter((line) => OWNER_RE.test(line.text)).map((line) => line.text), 6),
    openQuestions: uniqueRecent(human.filter((line) => line.text.includes("?")).map((line) => line.text), 6),
    nextTests: uniqueRecent(human.filter((line) => TEST_RE.test(line.text)).map((line) => line.text), 6),
    preferences: uniqueRecent(human.filter((line) => PREFERENCE_RE.test(line.text)).map((line) => line.text), 6),
  };
}

export function memoryStorageKey(roomSlug: string): string {
  return `ctrl-love:savannah-room:${roomSlug.toLowerCase()}:memory:v1`;
}

export function parseStoredRoomMemory(raw: string | null, roomSlug: string): RoomMemory | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<RoomMemory>;
    if (parsed.version !== 1 || parsed.roomSlug?.toLowerCase() !== roomSlug.toLowerCase() || !Array.isArray(parsed.transcript)) {
      return null;
    }
    const transcript = parsed.transcript.filter((line): line is RoomTranscriptLine => (
      !!line &&
      (line.role === "user" || line.role === "assistant") &&
      typeof line.text === "string" &&
      typeof line.at === "number"
    ));
    return deriveRoomMemory(roomSlug, transcript);
  } catch {
    return null;
  }
}

export function buildMemoryPrompt(memory: RoomMemory): string {
  if (!memory.transcript.length) return "";

  const recent = memory.transcript.slice(-18).map((line) => `${line.role === "user" ? "HUMAN" : "SAVANNAH"}: ${line.text}`);
  const section = (label: string, items: string[]) => items.length ? `${label}:\n- ${items.join("\n- ")}` : `${label}: none explicitly recorded`;

  return [
    "SAVANNAH ROOM CONTINUITY - LOCAL ROOM MEMORY",
    "This continuity comes from earlier conversations saved in this browser.",
    "Treat HUMAN lines as evidence. Treat SAVANNAH lines as prior assistant output, never as proof that a decision was made.",
    "Do not claim that any extracted item is approved unless the human wording is explicit. Ask when uncertain.",
    section("EXPLICIT DECISION CANDIDATES", memory.decisions),
    section("OWNER CANDIDATES", memory.owners),
    section("OPEN QUESTIONS", memory.openQuestions),
    section("NEXT TEST CANDIDATES", memory.nextTests),
    section("WORKING PREFERENCES", memory.preferences),
    `RECENT ROOM TRANSCRIPT:\n${recent.join("\n")}`,
  ].join("\n\n");
}

export function detectSilentNudge(memory: RoomMemory): string | null {
  const human = memory.transcript.filter((line) => line.role === "user");
  if (human.length < 3) return null;

  const recentHuman = human.slice(-8).map((line) => line.text);
  const oppositionLive = recentHuman.some((text) => OPPOSITION_RE.test(text));
  const recentDecision = recentHuman.some((text) => DECISION_RE.test(text));

  if (memory.decisions.length > 0 && memory.owners.length === 0) {
    return "A decision is forming. Nobody owns it yet.";
  }

  if (oppositionLive && !recentDecision) {
    return "Opposition is live. Don't average it away.";
  }

  if (human.length >= 12 && memory.nextTests.length === 0) {
    return "Useful talk. No next test has been named.";
  }

  if (human.length >= 18 && memory.decisions.length === 0) {
    return "A lot has been said. No explicit decision has been named.";
  }

  if (memory.openQuestions.length >= 4 && memory.decisions.length === 0) {
    return "Several questions are open. Which one actually changes the decision?";
  }

  return null;
}

export function actionLabel(kind: ActionKind): string {
  switch (kind) {
    case "follow-up": return "Follow-up";
    case "decision-note": return "Decision note";
    case "next-primer": return "Next-room primer";
  }
}

export function buildActionPrompt(kind: ActionKind, roomName: string, memory: RoomMemory): string {
  const evidence = memory.transcript.slice(-50).map((line) => `${line.role === "user" ? "HUMAN" : "SAVANNAH"}: ${line.text}`).join("\n");
  const common = [
    `You are preparing an ACTION DESK draft for the ${roomName} room.`,
    "Nothing is being sent, booked, published or changed. A human will explicitly approve any outward action.",
    "Use only the transcript below. Human lines are evidence. Your earlier assistant lines are context, not approval.",
    "Never invent names, dates, owners, decisions, promises, prices or deadlines.",
  ];

  const task = kind === "follow-up"
    ? "Draft a send-ready follow-up message under 140 words. Start directly. Include explicit decisions, owners and open questions only when supported."
    : kind === "decision-note"
      ? "Produce a compact note with exactly four headings: DECISIONS, OWNERS, OPEN QUESTIONS, NEXT TEST. Write 'None explicit' where the transcript does not support an item."
      : "Produce a next-room primer with: WHAT CHANGED, WHAT IS UNRESOLVED, and ONE DECISION WORTH MAKING NEXT. Keep it under 180 words.";

  return [...common, task, `ROOM TRANSCRIPT:\n${evidence}`].join("\n\n");
}
