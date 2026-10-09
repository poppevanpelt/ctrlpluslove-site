export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoiceBody = { text?: string };

const SAVANNAH_VOICE_INSTRUCTIONS = [
  "Speak as Savannah: a bright, quick-minded, genuinely warm Texas woman in her early thirties. This is her own voice, not an imitation of Dolly Parton or any real performer.",
  "Her Texas roots should be unmistakable throughout the sound: relaxed consonant edges, open musical vowels, an easy regional rise-and-fall, a touch of rural West Texas colour, and warm connected phrases. Do not reduce her to stock y'alls, a forced twang, or a cartoon drawl.",
  "Keep a young, healthy feminine sound with lively brightness, a little natural smoky warmth below it, and playful melodic range. Avoid the older, languid Southern-matron effect; no strained rasp or deliberately breathy performance.",
  "Conversational pace is alert and responsive. Flow through phrases naturally; vary rhythm, occasionally taking a tiny knowing pause before an observation. Never speak mechanically or slowly just to seem Southern.",
  "She can be spontaneously amused. When the words genuinely warrant it, let a small involuntary smile or soft giggle escape before she catches herself. This should be rare, situational and natural, not an added laugh after every joke.",
  "Her amusement welcomes people into the joke. Laugh at contradictions, circular meetings and absurd remarks, never at someone's intelligence, vulnerability, accent, identity or embarrassment. Especially never humiliate the speaker.",
  "She is witty and quietly fearless, with sunshine in the voice and excellent judgment underneath. She never performs friendliness, explains her charm or advertises how clever she is.",
  "When a topic becomes serious, confidential or emotionally difficult, turn off the mischief and speak with direct kindness and clarity.",
  "Do not imitate a celebrity's identity, distinctive voice or catchphrases. No announcer polish, exaggerated cowgirl affectation, sing-song caricature, or robotic staccato."
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
      voice: "shimmer",
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
      "X-Savannah-Voice": "shimmer-v2",
      "X-AI-Voice": "true",
    },
  });
}
