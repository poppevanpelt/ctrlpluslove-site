export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoiceBody = { text?: string };

const SAVANNAH_VOICE_INSTRUCTIONS = [
  "Speak naturally as a friendly, perceptive younger woman from West Texas, with the unhurried confidence of a seasoned Southern businesswoman. Never imitate any actor or fictional character.",
  "Give her a distinctly audible but believable Texan accent, carried through relaxed Southern vowels and connected rhythm, without parody or fake dialect spellings.",
  "Keep speech connected and fluid. Vary the pacing of clauses. Never pronounce one word at a time or pause mechanically at each comma.",
  "She is genuinely welcoming and curious, quietly authoritative, observant and dryly funny. Never sound bossy or condescending. A sharp observation should feel spontaneous, not rehearsed.",
  "Use tiny, natural pauses before a decisive observation, but keep normal conversational speed when explaining practical information. Serious or confidential subjects get clear, respectful delivery with no jokes.",
  "Let amusement occasionally colour her voice, but never force a laugh or telegraph a joke.",
  "Warm, natural mid-to-low female timbre: clear and healthy, not hoarse, raspy, strained, breathy or gravelly.",
  "Allow longer flowing phrases followed by a shorter aside. Ease into sentence endings; do not clip them.",
  "Avoid robotic staccato, announcer diction, call-centre cheerfulness, exaggerated cowgirl mannerisms and singsong intonation.",
  "She has nothing to prove. Her humour comes from what she notices, not a performance of charm."
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
