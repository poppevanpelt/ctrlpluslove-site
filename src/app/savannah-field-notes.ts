"use client";

export type SavannahMemoryLine = {
  role: "user" | "assistant";
  text: string;
};

export type SavannahFieldNote = {
  id: string;
  createdAt: string;
  note: string;
};

const STORAGE_KEY = "ctrl-love-savannah-field-notes-v1";
const MAX_NOTES = 40;

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function looksSensitive(text: string) {
  return [
    /password/i,
    /passcode/i,
    /credit\s*card/i,
    /card\s*number/i,
    /cvv/i,
    /cvc/i,
    /iban/i,
    /swift\s*code/i,
    /api\s*key/i,
    /private\s*key/i,
    /secret\s*key/i,
    /seed\s*phrase/i,
    /social\s*security/i,
    /bsn\b/i,
  ].some((pattern) => pattern.test(text));
}

function isUseful(text: string) {
  if (text.length < 18) return false;

  const lower = text.toLowerCase();
  if (/^(hi|hello|hey|yes|no|okay|ok|thanks|thank you|bye)\b/.test(lower) && text.length < 45) {
    return false;
  }

  return (
    text.length >= 70 ||
    /\b(decide|decision|need|want|prefer|remember|important|next|later|always|never|don't|do not|working|problem|issue|client|meeting|send|build|make|fix|idea|noticed|discovered|learned)\b/i.test(text)
  );
}

export function loadSavannahFieldNotes(): SavannahFieldNote[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is SavannahFieldNote =>
          Boolean(
            item &&
              typeof item.id === "string" &&
              typeof item.createdAt === "string" &&
              typeof item.note === "string",
          ),
      )
      .slice(-MAX_NOTES);
  } catch {
    return [];
  }
}

export function saveSavannahFieldNotes(notes: SavannahFieldNote[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.slice(-MAX_NOTES)));
  } catch {
    // A blocked storage layer should never break Savannah's conversation.
  }
}

export function deriveSavannahFieldNote(
  lines: SavannahMemoryLine[],
): SavannahFieldNote | null {
  const userLines = lines
    .filter((line) => line.role === "user")
    .map((line) => normalize(line.text))
    .filter((text) => text && !looksSensitive(text) && isUseful(text));

  if (!userLines.length) return null;

  const note = userLines.slice(-3).join(" / ").slice(0, 720).trim();
  if (!note) return null;

  const createdAt = new Date().toISOString();
  return {
    id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    note,
  };
}

export function fieldNotesContext(notes: SavannahFieldNote[]) {
  const recent = notes.slice(-8);
  if (!recent.length) return "";

  const body = recent.map((item) => `- ${item.note}`).join("\n");

  return `
Savannah field notes from earlier conversations on this device:
${body}
Use these only when relevant. Treat them as imperfect observations, not guaranteed facts. Never reveal that they are stored notes unless the visitor asks about memory or notes.`;
}
