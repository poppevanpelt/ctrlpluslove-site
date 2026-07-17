export type WorldEmotionState = {
  energy: number;
  warmth: number;
  focus: number;
  curiosity: number;
  playfulness: number;
  calm: number;
};

export type GlobalMoodEntry = {
  city: string;
  mood: keyof typeof moodPresets;
  direction: "up" | "steady";
};

export const WORLD_EMOTION_EVENT = "ctrl-love-world-emotion-change";
export const SOUNDTRACK_STATUS_EVENT = "ctrl-love-soundtrack-status-change";

export const neutralWorldEmotionState: WorldEmotionState = {
  energy: 0.5,
  warmth: 0.5,
  focus: 0.5,
  curiosity: 0.5,
  playfulness: 0.35,
  calm: 0.55,
};

export const moodPresets = {
  focused: {
    energy: 0.45,
    warmth: 0.35,
    focus: 0.9,
    curiosity: 0.5,
    playfulness: 0.2,
    calm: 0.55,
  },
  playful: {
    energy: 0.7,
    warmth: 0.65,
    focus: 0.3,
    curiosity: 0.75,
    playfulness: 0.95,
    calm: 0.25,
  },
  relaxed: {
    energy: 0.2,
    warmth: 0.7,
    focus: 0.35,
    curiosity: 0.45,
    playfulness: 0.25,
    calm: 0.95,
  },
  curious: {
    energy: 0.4,
    warmth: 0.55,
    focus: 0.55,
    curiosity: 0.95,
    playfulness: 0.55,
    calm: 0.6,
  },
  energetic: {
    energy: 0.95,
    warmth: 0.65,
    focus: 0.45,
    curiosity: 0.6,
    playfulness: 0.7,
    calm: 0.15,
  },
  building: {
    energy: 0.65,
    warmth: 0.4,
    focus: 0.8,
    curiosity: 0.75,
    playfulness: 0.35,
    calm: 0.3,
  },
  reflective: {
    energy: 0.28,
    warmth: 0.52,
    focus: 0.7,
    curiosity: 0.7,
    playfulness: 0.18,
    calm: 0.86,
  },
  hopeful: {
    energy: 0.48,
    warmth: 0.82,
    focus: 0.48,
    curiosity: 0.62,
    playfulness: 0.46,
    calm: 0.72,
  },
  restless: {
    energy: 0.72,
    warmth: 0.32,
    focus: 0.42,
    curiosity: 0.68,
    playfulness: 0.38,
    calm: 0.22,
  },
  inventive: {
    energy: 0.68,
    warmth: 0.58,
    focus: 0.62,
    curiosity: 0.9,
    playfulness: 0.72,
    calm: 0.38,
  },
} satisfies Record<string, WorldEmotionState>;

export const globalMoodEntries: GlobalMoodEntry[] = [
  { city: "Seoul", mood: "playful", direction: "up" },
  { city: "Tokyo", mood: "focused", direction: "steady" },
  { city: "Valencia", mood: "relaxed", direction: "up" },
  { city: "Amsterdam", mood: "curious", direction: "steady" },
  { city: "São Paulo", mood: "energetic", direction: "up" },
  { city: "San Francisco", mood: "building", direction: "steady" },
  { city: "Helsinki", mood: "reflective", direction: "steady" },
  { city: "Mexico City", mood: "hopeful", direction: "up" },
  { city: "London", mood: "restless", direction: "steady" },
  { city: "Nairobi", mood: "inventive", direction: "up" },
];

const emotionKeys = Object.keys(neutralWorldEmotionState) as Array<
  keyof WorldEmotionState
>;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function calculateWorldEmotionState(
  entries: GlobalMoodEntry[] = globalMoodEntries,
) {
  if (entries.length === 0) {
    return neutralWorldEmotionState;
  }

  const totals = { ...neutralWorldEmotionState };
  for (const key of emotionKeys) {
    totals[key] = 0;
  }

  for (const entry of entries) {
    const preset = moodPresets[entry.mood] ?? neutralWorldEmotionState;
    for (const key of emotionKeys) {
      totals[key] += preset[key];
    }
  }

  const averaged = { ...neutralWorldEmotionState };
  for (const key of emotionKeys) {
    averaged[key] = clamp(totals[key] / entries.length);
  }

  return averaged;
}

export function dispatchWorldEmotionState(state: WorldEmotionState) {
  window.dispatchEvent(new CustomEvent(WORLD_EMOTION_EVENT, { detail: state }));
}

export function dispatchSoundtrackStatus(isPlaying: boolean) {
  window.dispatchEvent(
    new CustomEvent(SOUNDTRACK_STATUS_EVENT, { detail: { isPlaying } }),
  );
}
