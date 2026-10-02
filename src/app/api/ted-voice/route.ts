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

function hashText(text: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function doggishPcm(text: string, sampleRate: number) {
  const seed = hashText(text || "ted");
  const question = /\?\s*$/.test(text);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const barkCount = words < 7 ? 1 : words < 18 ? 2 : 3;
  const base = 105 + (seed % 58);
  const gap = 0.12;
  const barkDuration = question ? 0.28 : 0.34;
  const growlDuration = words > 15 ? 0.34 : 0.16;
  const totalSeconds = 0.08 + barkCount * barkDuration + Math.max(0, barkCount - 1) * gap + growlDuration;
  const sampleCount = Math.max(1, Math.floor(totalSeconds * sampleRate));
  const out = Buffer.allocUnsafe(sampleCount * 2);

  let rng = seed || 1;
  const random = () => {
    rng ^= rng << 13;
    rng ^= rng >>> 17;
    rng ^= rng << 5;
    return ((rng >>> 0) / 4294967295) * 2 - 1;
  };

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    let signal = 0;

    for (let bark = 0; bark < barkCount; bark += 1) {
      const start = 0.06 + bark * (barkDuration + gap);
      const local = (t - start) / barkDuration;
      if (local >= 0 && local <= 1) {
        const attack = Math.min(1, local / 0.055);
        const decay = Math.exp(-3.3 * local);
        const envelope = attack * decay;
        const f = base * (1.42 - 0.45 * local) * (1 + bark * 0.045);
        const throat =
          Math.sin(2 * Math.PI * f * (t - start)) +
          0.52 * Math.sin(2 * Math.PI * f * 2.02 * (t - start) + 0.4) +
          0.22 * Math.sin(2 * Math.PI * f * 3.1 * (t - start) + 1.1);
        const rasp = random() * (0.58 + 0.24 * Math.sin(2 * Math.PI * 34 * (t - start)));
        signal += envelope * (0.66 * throat + 0.34 * rasp);
      }
    }

    const growlStart = 0.06 + barkCount * barkDuration + Math.max(0, barkCount - 1) * gap - 0.01;
    const growlLocal = (t - growlStart) / Math.max(0.01, growlDuration);
    if (growlLocal >= 0 && growlLocal <= 1) {
      const env = Math.sin(Math.PI * growlLocal) * 0.34;
      const f = 72 + (seed % 26);
      const rumble =
        0.8 * Math.sin(2 * Math.PI * f * (t - growlStart)) +
        0.36 * Math.sin(2 * Math.PI * f * 1.53 * (t - growlStart)) +
        0.22 * random();
      signal += env * rumble;
    }

    const softClip = Math.tanh(signal * 1.35) * 0.82;
    const int16 = Math.max(-32768, Math.min(32767, Math.round(softClip * 32767)));
    out.writeInt16LE(int16, i * 2);
  }

  return out;
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

  const audio = doggishPcm(text, sampleRate);

  return new Response(audio, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(audio.byteLength),
      "Cache-Control": "no-store",
      "X-Ted-Voice": "doggish-v1",
    },
  });
}

export function GET() {
  return Response.json({
    name: "Ted",
    status: "ready",
    format: "raw PCM, mono, signed 16-bit little-endian",
    note: "POST a Vapi custom-voice request here. English stays in subtitles; this endpoint only makes Doggish.",
  });
}
