export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoiceRequest = {
  message?: {
    type?: string;
    text?: string;
    sampleRate?: number;
  };
  text?: string;
  sampleRate?: number;
};

const DURATIONS: Record<string, number> = {
  HUFF: 0.8,
  BARK: 0.8,
  DOUBLE: 1.08,
  RUMBLE: 1.2,
  SIGH: 1.36,
};

function soundFromText(text: string) {
  const match = text.match(/^\s*\[\[TED:(HUFF|BARK|DOUBLE|RUMBLE|SIGH)\]\]/i);
  return match?.[1]?.toUpperCase() ?? "HUFF";
}

export async function POST(request: Request) {
  let body: VoiceRequest;
  try {
    body = (await request.json()) as VoiceRequest;
  } catch {
    return Response.json({ error: "Expected JSON voice request." }, { status: 400 });
  }

  const message = body.message ?? body;
  const text = typeof message.text === "string" ? message.text : "";
  const requestedRate = Number(message.sampleRate) || 24000;
  const sampleRate = [8000, 16000, 22050, 24000, 44100, 48000].includes(requestedRate)
    ? requestedRate
    : 24000;

  // Vapi still needs correctly timed raw PCM for turn-taking.
  // The browser performs Ted's real canine sound from a sample bank.
  const sound = soundFromText(text);
  const duration = DURATIONS[sound] ?? DURATIONS.HUFF;
  const sampleCount = Math.max(1, Math.floor(duration * sampleRate));
  const silence = Buffer.alloc(sampleCount * 2);

  return new Response(silence, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(silence.byteLength),
      "Cache-Control": "no-store",
      "X-Ted-Voice": "canine-samplebank-v2",
      "X-Ted-Sound": sound,
    },
  });
}

export function GET() {
  return Response.json({
    name: "Ted",
    status: "ready",
    mode: "canine-samplebank-v2",
    format: "raw PCM timing bed; browser performs the real dog sample",
    note: "Dad Vader has left the building.",
  });
}
