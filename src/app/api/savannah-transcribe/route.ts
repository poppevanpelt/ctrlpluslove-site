export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Whisper sometimes hallucinates subtitle credits and other stock phrases over
// silence, music, or road noise. Never publish these as somebody's speech.
const KNOWN_AUDIO_HALLUCINATIONS = [
  /^(?:ondertitels? (?:ingediend|verzorgd|aangeleverd) door (?:de )?)?amara\.org(?: gemeenschap)?[.!]?$/i,
  /^ondertitels? (?:ingediend|verzorgd|aangeleverd) door de amara\.org gemeenschap[.!]?$/i,
  /^subtitles? (?:by|provided by) (?:the )?amara\.org (?:community)?[.!]?$/i,
  /^thanks? for watching[.!]?$/i,
  /^thank you for watching[.!]?$/i,
  /^bedankt voor het kijken[.!]?$/i,
];
function stripKnownHallucinations(value: string): string {
  return value.split(/\r?\n/).map(line => line.trim())
    .filter(line => line && !KNOWN_AUDIO_HALLUCINATIONS.some(pattern => pattern.test(line)))
    .join("\n").trim();
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: "Voice is not configured." }, { status: 503 });
  const form = await request.formData().catch(() => null);
  const audio = form?.get("audio");
  if (!(audio instanceof File) || audio.size === 0 || audio.size > 12_000_000) {
    return Response.json({ error: "Invalid or oversized recording." }, { status: 400 });
  }
  const payload = new FormData();
  payload.append("file", audio, audio.name || "speech.webm");
  payload.append("model", "whisper-1");
  // Keep automatic language detection: Dutch and English frequently alternate.
  // This is vocabulary context, not an instruction to generate missing speech.
  payload.append("prompt", "Conversation in Dutch and English. Proper names include Savannah, ctrl+love, Fiat. Transcribe only clearly audible speech.");
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: payload,
    signal: AbortSignal.timeout(25000),
  }).catch(() => null);
  if (!response?.ok) return Response.json({ error: "Could not understand the recording. Please try again." }, { status: 502 });
  const result = await response.json().catch(() => null);
  const raw = typeof result?.text === "string" ? result.text.trim() : "";
  const text = stripKnownHallucinations(raw);
  // MeetingListener already treats 422 as silence and does not add it to notes.
  if (!text) return Response.json({ error: "No reliable speech detected in this segment." }, { status: 422 });
  return Response.json({ text }, { headers: { "Cache-Control": "no-store" } });
}
