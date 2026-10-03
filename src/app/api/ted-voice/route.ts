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
  HUFF: 0.3,
  BARK: 0.3,
  DOUBLE: 0.7,
  RUMBLE: 0.55,
  SIGH: 0.7,
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
      "X-Ted-Voice": "real-dog-v2",
      "X-Ted-Sound": sound,
    },
  });
}

export function GET() {
  return Response.json({
    name: "Ted",
    status: "ready",
    mode: "real-dog-v2",
    format: "silent raw PCM timing bed; browser performs Ted's real Labrador sound",
    note: "Dad Vader has left the building.",
  });
}
