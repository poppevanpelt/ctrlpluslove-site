import { normalizeForMeaning } from "./buildFingerprint.ts";
import type { ChangeSignal } from "./types.ts";

const ACKNOWLEDGEMENTS = new Set([
  "great",
  "thanks",
  "thank you",
  "ok",
  "okay",
  "yes",
  "no",
  "nice",
  "love it",
  "looks good",
  "agreed",
  "agree",
  "approved",
]);

const MEANINGFUL_PATTERNS = [
  /\b(i saw|i heard|customer|user|client|buyer|market|sales|revenue|margin|cost|budget|deadline)\b/i,
  /\b(risk|constraint|requirement|evidence|data|correction|wrong|changed|preference|decision)\b/i,
  /\b(disagree|concern|local|cultural|legal|compliance|firsthand|observed|tested)\b/i,
  /\b(must|cannot|should not|need to|has to|won't|will not)\b/i,
  /\?\s*$/,
  /[€$]\s?\d|\d+\s?(%|percent|days|weeks|months|eur|usd)/i,
];

function isEmojiOnly(value: string): boolean {
  const stripped = value.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s|\p{Punctuation}/gu, "");
  return stripped.length === 0;
}

export function classifyTextMeaning(text: string): { meaningful: boolean; reason: string } {
  if (isEmojiOnly(text)) {
    return { meaningful: false, reason: "emoji-only input" };
  }

  const normalized = normalizeForMeaning(text);

  if (!normalized) {
    return { meaningful: false, reason: "empty or formatting-only input" };
  }

  if (ACKNOWLEDGEMENTS.has(normalized)) {
    return { meaningful: false, reason: "simple acknowledgement" };
  }

  if (normalized.length < 16 && !/\d/.test(normalized)) {
    return { meaningful: false, reason: "too short to be material without evidence" };
  }

  if (MEANINGFUL_PATTERNS.some((pattern) => pattern.test(text))) {
    return { meaningful: true, reason: "contains evidence, constraint, disagreement, or decision signal" };
  }

  if (normalized.split(/\s+/).length >= 8) {
    return { meaningful: true, reason: "substantive new text" };
  }

  return { meaningful: false, reason: "non-material comment or edit" };
}

export function classifyChanges(signals: ChangeSignal[]): ChangeSignal[] {
  return signals.map((signal) => {
    const classification = classifyTextMeaning(signal.text);
    return {
      ...signal,
      meaningful: signal.meaningful || classification.meaningful,
      reason: signal.reason || classification.reason,
    };
  });
}
