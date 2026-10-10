export type SavannahOutfit = "white-sweater" | "camel-blazer" | "denim" | "black-satin" | "suede";
export type SavannahExpression = "waiting" | "listening" | "thinking-1" | "thinking-2" | "bridge" | "reaction";

const ZONE = "Europe/Amsterdam";
const ROOM_OUTFITS: Record<string, SavannahOutfit> = {
  bridgefund: "camel-blazer",
  luther: "camel-blazer",
  bonkers: "denim",
};

export function selectSavannahOutfit(date: Date, room?: string): SavannahOutfit {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE, weekday: "short", hour: "2-digit", hourCycle: "h23",
    month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const read = (key: string) => parts.find(part => part.type === key)?.value ?? "";
  const month = Number(read("month"));
  const day = Number(read("day"));
  const hour = Number(read("hour"));
  const weekday = read("weekday");

  // Reserved for celebrations; no special portrait becomes active until
  // corresponding assets are provided.
  if ((month === 12 && day >= 24 && day <= 26) || (month === 12 && day === 31)) {
    return "black-satin";
  }
  const roomOutfit = room ? ROOM_OUTFITS[room.toLowerCase()] : undefined;
  if (roomOutfit) return roomOutfit;
  if (weekday === "Sat" || weekday === "Sun") return "white-sweater";
  return hour >= 18 ? "black-satin" : "white-sweater";
}

// New outfit sets must contain all approved frames before they may replace
// the canonical portraits. Until then preserve the already-normalized face.
export const SAVANNAH_CANONICAL_FRAMES: SavannahExpression[] = [
  "waiting", "listening", "thinking-1", "thinking-2", "bridge", "reaction",
];
export function savannahPortraitPath(_outfit: SavannahOutfit, expression: SavannahExpression): string {
  return `/savannah-presence/${expression}.webp`;
}
