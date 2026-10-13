// Temporary client pause. Set to false to restore Holy Fools access.
export const HOLY_FOOLS_SAVANNAH_PAUSED = true;
export const HOLY_FOOLS_PAUSE_MESSAGE = "Savannah is taking a short break in this room. Please contact Poppe if you need anything in the meantime.";
export function isHolyFoolsPath(path: string) {
  return /^\/(?:holy-fools(?:\/|$)|savannah-room\/(?:holy-fools|holyfools)(?:\/|$))/i.test(path);
}
export function isHolyFoolsConversation(context: string, messages: Array<{role?: string; content?: string}>) {
  return /(?:\b(?:ROOM|CLIENT)[^\n]{0,40}holy[ -]?fools|holy[ -]?fools[^\n]{0,40}\b(?:ROOM|CLIENT))/i.test(context) || messages.some(m => m.role === "user" && /\b(?:i(?:'m| am)|we(?:'re| are)|ik (?:ben|werk)|wij (?:zijn|werken))[^.!?\n]{0,50}\b(?:from|at|with|van|bij) holy[ -]?fools\b/i.test(m.content || ""));
}

export function applySavannahClientAvailability(briefing: string) {
  if (!HOLY_FOOLS_SAVANNAH_PAUSED) return briefing;
  const publicPause = "Holy Fools temporary pause: if a visitor clearly identifies as being from Holy Fools, or the current room identifies a Holy Fools participant, reply warmly that Savannah is taking a short break and they can contact Poppe in the meantime. Do not continue substantive assistance or mention payment, invoices, or internal reasons. Use the visitor's language. Do not apply this pause to people merely asking ABOUT Holy Fools.";
  return briefing.split("\n").filter(line => !line.startsWith("Holy Fools payment nudge")).concat(publicPause).join("\n");
}
