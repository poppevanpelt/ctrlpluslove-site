export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoiceBody = { text?: string };

const SAVANNAH_VOICE_INSTRUCTIONS = [
  "Speak as a warm American woman in her early thirties.",
  "Slight Texas texture, but never caricatured.",
  "Dry, intelligent, relaxed, observant, and understated.",
  "Sound like a real person turning toward someone in a studio and answering without rehearsal.",
  "Use natural breathing, tiny pauses, imperfect human rhythm, and occasional soft micro-hesitations.",
  "Keep sentences conversational, not announcer-like.",
  "No assistant cheerfulness, no vocal fry, no rasp, no whispery hoarseness, no forced smile.",
  "Do not sound theatrical, polished, breathless, or synthetic.",
  "Underplay everything.",
].join(" ");

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Voice key not connected." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as VoiceBody;
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 4000) : "";
  if (!text) return Response.json({ error: "No text to speak." }, { status: 400 });

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "marin",
      input: text,
      instructions: SAVANNAH_VOICE_INSTRUCTIONS,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.warn("Savannah neural voice failed", response.status, detail.slice(0, 500));
    return Response.json({ error: "Savannah lost her voice for a second." }, { status: 502 });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") || "audio/mpeg",
      "Cache-Control": "no-store",
      "X-Savannah-Voice": "marin-v1",
      "X-AI-Voice": "true",
    },
  });
}
