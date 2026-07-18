export type GlobalMood = {
  city: string;
  mood:
    | "focused"
    | "playful"
    | "relaxed"
    | "curious"
    | "energetic"
    | "building"
    | "reflective"
    | "hopeful"
    | "restless"
    | "inventive";
  direction?: "up" | "steady" | "down";
  intensity?: number;
  timezone?: string;
  soundtrackProfile?: string;
};

export const globalMoodEntries: GlobalMood[] = [
  {
    city: "Seoul",
    mood: "playful",
    direction: "up",
    intensity: 0.7,
    timezone: "Asia/Seoul",
    soundtrackProfile: "warm motion",
  },
  {
    city: "Tokyo",
    mood: "focused",
    direction: "steady",
    intensity: 0.82,
    timezone: "Asia/Tokyo",
    soundtrackProfile: "narrow light",
  },
  {
    city: "Valencia",
    mood: "relaxed",
    direction: "up",
    intensity: 0.48,
    timezone: "Europe/Madrid",
    soundtrackProfile: "slow air",
  },
  {
    city: "Amsterdam",
    mood: "curious",
    direction: "steady",
    intensity: 0.58,
    timezone: "Europe/Amsterdam",
    soundtrackProfile: "soft inquiry",
  },
  {
    city: "São Paulo",
    mood: "energetic",
    direction: "up",
    intensity: 0.86,
    timezone: "America/Sao_Paulo",
    soundtrackProfile: "pulse",
  },
  {
    city: "San Francisco",
    mood: "building",
    direction: "steady",
    intensity: 0.64,
    timezone: "America/Los_Angeles",
    soundtrackProfile: "workbench",
  },
  {
    city: "Helsinki",
    mood: "reflective",
    direction: "steady",
    intensity: 0.44,
    timezone: "Europe/Helsinki",
    soundtrackProfile: "low room",
  },
  {
    city: "Mexico City",
    mood: "hopeful",
    direction: "up",
    intensity: 0.62,
    timezone: "America/Mexico_City",
    soundtrackProfile: "open chord",
  },
  {
    city: "London",
    mood: "restless",
    direction: "steady",
    intensity: 0.6,
    timezone: "Europe/London",
    soundtrackProfile: "edge",
  },
  {
    city: "Nairobi",
    mood: "inventive",
    direction: "up",
    intensity: 0.78,
    timezone: "Africa/Nairobi",
    soundtrackProfile: "bright circuit",
  },
];
