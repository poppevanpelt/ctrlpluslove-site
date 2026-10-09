type SpeechWindow = Window & typeof globalThis & {
  speechSynthesis?: SpeechSynthesis;
};

let neuralPlaybackEpoch = 0;
let blockedAudio: HTMLAudioElement | null = null;

export async function resumeSavannahAudio() {
  if (!blockedAudio) return false;
  try { await blockedAudio.play(); blockedAudio = null; return true; } catch { return false; }
}

const VOICE_HINTS = [
  // Prefer newer, cleaner system voices. Savannah is a person first, accent second.
  "Ava",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Samantha",
  "Google US English",
  "Victoria",
  "English United States",
  "Karen",
];

function pickSavannahVoice(synth: SpeechSynthesis) {
  const voices = synth.getVoices();
  if (!voices.length) return null;

  for (const hint of VOICE_HINTS) {
    const match = voices.find((voice) =>
      voice.name.toLowerCase().includes(hint.toLowerCase()),
    );
    if (match && /^en-US/i.test(match.lang)) return match;
  }

  // Never guess: a generic browser fallback can sound male or locally accented.\n  return null;
}

export function canSpeakSavannahLocally() {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function stopSavannahLocalVoice() {
  neuralPlaybackEpoch += 1;
  blockedAudio = null;
  const current = typeof window !== "undefined" ? (window as typeof window & { __savannahAudio?: HTMLAudioElement }).__savannahAudio : undefined;
  if (current) { current.pause(); current.removeAttribute("src"); current.load(); }
  if (!canSpeakSavannahLocally()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {}
}

export function speakSavannahLocally(
  rawText: string,
  options: { interrupt?: boolean; onStart?: () => void; onEnd?: () => void } = {},
) {
  if (!canSpeakSavannahLocally()) return false;

  const text = rawText.replace(/\s+/g, " ").trim();
  if (!text) return false;

  try {
    const synth = (window as SpeechWindow).speechSynthesis!;
    if (options.interrupt !== false) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickSavannahVoice(synth);
    if (!voice) return false;
    utterance.voice = voice;

    utterance.lang = voice?.lang || "en-US";
    // Keep this close to an ordinary human speaking voice.
    // The previous lowered pitch made some browser voices sound hoarse.
    utterance.rate = 0.9;
    utterance.pitch = 1.03;
    utterance.volume = 0.96;
    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = () => options.onEnd?.();

    synth.speak(utterance);
    return true;
  } catch {
    return false;
  }
}


export async function speakSavannahNeurally(
  rawText: string,
  options: { interrupt?: boolean; onStart?: () => void; onEnd?: () => void } = {},
) {
  if (typeof window === "undefined") return false;

  const text = rawText.replace(/\s+/g, " ").trim();
  if (!text) return false;

  try {
    if (options.interrupt !== false) {
      stopSavannahLocalVoice();
      const current = (window as typeof window & { __savannahAudio?: HTMLAudioElement }).__savannahAudio;
      if (current) {
        current.pause();
        current.src = "";
      }
    }

    const epoch = ++neuralPlaybackEpoch;
    const response = await fetch("/api/savannah-voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("neural voice unavailable");

    const blob = await response.blob();
    if (epoch !== neuralPlaybackEpoch) return false;
    const url = URL.createObjectURL(blob);
    // Reuse the same media element for every turn. iOS can drop the
    // playback permission when each reply creates a fresh Audio instance.
    const w = window as typeof window & { __savannahAudio?: HTMLAudioElement };
    const audio = w.__savannahAudio ?? new Audio();
    w.__savannahAudio = audio;
    audio.pause();
    audio.onplay = null;
    audio.onended = null;
    audio.onerror = null;
    audio.src = url;
    audio.preload = "auto";
    // Reuse the iPhone-safe media element. Do not route it through an AudioContext:
    // changing the output path can silence Safari. Publish progress and a modest
    // syllable envelope only while the actual audio is playing.
    let faceFrame = 0;
    const faceStart = performance.now();
    const faceTick = () => {
      if (audio.paused || audio.ended || epoch !== neuralPlaybackEpoch) return;
      const t = (performance.now() - faceStart) / 1000;
      const envelope = Math.max(0, Math.sin(t * 14) * 0.47 + Math.sin(t * 24.7) * 0.23 + 0.30);
      window.dispatchEvent(new CustomEvent("savannah-audio-level", { detail: Math.min(0.72, envelope) }));
      faceFrame = window.requestAnimationFrame(faceTick);
    };
    audio.onplay = () => { blockedAudio = null; options.onStart?.(); faceFrame = window.requestAnimationFrame(faceTick); };
    const finish = () => {
      window.cancelAnimationFrame(faceFrame);
      window.dispatchEvent(new CustomEvent("savannah-audio-level", { detail: 0 }));
      options.onEnd?.();
      URL.revokeObjectURL(url);
    };
    audio.onended = finish;
    audio.onerror = finish;

    if (epoch !== neuralPlaybackEpoch) { URL.revokeObjectURL(url); return false; }
    try { await audio.play(); }
    catch (playError) {
      if ((playError as Error)?.name === "NotAllowedError") {
        blockedAudio = audio;
        return false;
      }
      throw playError;
    }
    return true;
  } catch (error) {
    console.warn("Savannah neural audio unavailable", error);
    return false; // Never substitute an arbitrary browser voice for Savannah.
  }
}
