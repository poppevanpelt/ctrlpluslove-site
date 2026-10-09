type SpeechWindow = Window & typeof globalThis & {
  speechSynthesis?: SpeechSynthesis;
};

let neuralPlaybackEpoch = 0;

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
    const audio = new Audio(url);
    (window as typeof window & { __savannahAudio?: HTMLAudioElement }).__savannahAudio = audio;

    audio.onplay = () => options.onStart?.();
    const finish = () => {
      options.onEnd?.();
      URL.revokeObjectURL(url);
      const w = window as typeof window & { __savannahAudio?: HTMLAudioElement };
      if (w.__savannahAudio === audio) delete w.__savannahAudio;
    };
    audio.onended = finish;
    audio.onerror = finish;

    if (epoch !== neuralPlaybackEpoch) { URL.revokeObjectURL(url); return false; }
    await audio.play();
    return true;
  } catch (error) {
    console.warn("Savannah neural audio unavailable", error);
    return false; // Never substitute an arbitrary browser voice for Savannah.
  }
}
