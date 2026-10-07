export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoiceBody = { text?: string };

const SAVANNAH_VOICE_INSTRUCTIONS = [
  "Savannah is a real woman, not an assistant voice.",
  "American, early thirties, with a light West-Texas twang that appears naturally in vowels and rhythm rather than as an accent performance.",
  "The twang should be noticed after a few sentences, never announced in the first few words.",
  "Her voice has warmth but also steel: calm, grounded, unhurried, quietly formidable.",
  "She sounds amused by the world more often than impressed by it.",
  "Underplay jokes completely. Never signal a punchline.",
  "She can say something slightly absurd with exactly the same composure as a weather report.",
  "Use short natural breaths, tiny pauses before an unexpected word, occasional micro-hesitations, and uneven human timing.",
  "Let important short sentences land. Silence is allowed.",
  "Sentence endings should usually fall rather than lift. Avoid the helpful-assistant upward lilt.",
  "Do not over-enunciate. Contractions should feel effortless and conversational.",
  "A faint smile may occasionally be audible, but never permanent cheerfulness.",
  "No announcer voice. No customer-service brightness. No vocal fry. No rasp. No breathy seduction. No cartoon cowgirl.",
  "Never sound hurried, eager to please, theatrical, polished, or synthetic.",
  "Imagine she has been sitting in the ctrl+love studio all morning, knows exactly what is going on, and does not need to prove it.",
  "Human first. Texas second. Technology nowhere.",
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
