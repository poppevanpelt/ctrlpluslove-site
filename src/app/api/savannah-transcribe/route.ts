export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  payload.append("language", "en");
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: payload,
    signal: AbortSignal.timeout(25000),
  }).catch(() => null);
  if (!response?.ok) return Response.json({ error: "Could not understand the recording. Please try again." }, { status: 502 });
  const result = await response.json().catch(() => null);
  const text = typeof result?.text === "string" ? result.text.trim() : "";
  if (!text) return Response.json({ error: "I didn't catch that. Try again." }, { status: 422 });
  return Response.json({ text }, { headers: { "Cache-Control": "no-store" } });
}
