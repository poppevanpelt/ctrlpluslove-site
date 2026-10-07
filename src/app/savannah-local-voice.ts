type SpeechWindow = Window & typeof globalThis & {
  speechSynthesis?: SpeechSynthesis;
};

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
    if (match) return match;
  }

  return (
    voices.find((voice) => /^en-US/i.test(voice.lang)) ||
    voices.find((voice) => /^en-/i.test(voice.lang)) ||
    null
  );
}

export function canSpeakSavannahLocally() {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function stopSavannahLocalVoice() {
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
    if (voice) utterance.voice = voice;

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
