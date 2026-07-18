import { embassyMapLocations } from "../../content/embassies/index.ts";
import { globalMoodEntries } from "../../content/global-mood.ts";

import type { OfficePersonaPresence, TimeBand } from "./personaPresence.ts";

export type VisitorMemorySummary = {
  isReturning: boolean;
  isFamiliar: boolean;
  favoritePage?: string;
};

export type OfficeActivityContext = {
  personas: OfficePersonaPresence[];
  timeBand: TimeBand;
  mood: string;
  page: string;
  visitor: VisitorMemorySummary;
  date?: Date;
};

export type OfficeActivity = {
  id: string;
  text: string;
  source: "persona" | "embassy" | "mood" | "time" | "memory" | "bell" | "steel-ball";
};

const personaVerbs: Record<string, string[]> = {
  reviewing: [
    "quietly simplified an argument.",
    "removed one unnecessary sentence.",
    "checked whether the recommendation had earned its confidence.",
  ],
  thinking: [
    "let the answer remain unresolved.",
    "kept one question open.",
    "held the brief at a useful distance.",
  ],
  challenging: [
    "reopened an uncomfortable question.",
    "challenged the answer that arrived too clean.",
    "asked what certainty was protecting.",
  ],
  writing: [
    "rewrote a sentence until it stopped performing.",
    "moved the human point closer to the surface.",
    "gave the argument less costume.",
  ],
  observing: [
    "noticed a small change in the room.",
    "watched the evidence refuse to settle.",
    "kept still long enough for a signal to appear.",
  ],
  away: ["left a light on.", "is away, but the question is not.", "closed one file without closing the thought."],
  experimenting: [
    "tested a fragile premise.",
    "made the system less certain on purpose.",
    "tried a quieter version of the idea.",
  ],
  building: [
    "assembled a more responsible question.",
    "put structure underneath the intuition.",
    "tightened the bridge between intelligence and humanity.",
  ],
  arguing: [
    "disagreed usefully.",
    "refused consensus as a design principle.",
    "kept the conflict productive.",
  ],
  dreaming: [
    "appears to be awake in a different room.",
    "left a note for morning.",
    "dreamed about a better brief.",
  ],
  intervening: [
    "intervened before the sentence became expensive.",
    "paused the room at the right discomfort.",
    "removed an adjective.",
  ],
};

const embassyContributions: Record<string, string[]> = {
  Tokyo: ["submitted precision.", "reduced the acceptable margin for vagueness."],
  Amsterdam: ["questioned certainty.", "asked whether the premise was too convenient."],
  Seoul: ["increased momentum.", "sent back a warmer rhythm."],
  Valencia: ["contributed optimism.", "reported increased lightness."],
  Helsinki: ["reduced unnecessary complexity.", "made the answer quieter."],
  Stockholm: ["held the trust standard.", "removed one decorative promise."],
};

const timeLines: Record<TimeBand, string[]> = {
  morning: [
    "The office has started before the page finished loading.",
    "Morning pressure is being applied carefully.",
  ],
  afternoon: [
    "The studio is balanced between evidence and instinct.",
    "Several questions are still being treated with respect.",
  ],
  night: [
    "Most of the studio has gone home. One light is still on.",
    "Only the quiet work appears to be awake.",
  ],
  "late-night": [
    "Only Cass appears to be awake.",
    "The office is almost empty, but one question remains lit.",
  ],
};

const moodLines: Record<string, string[]> = {
  curious: ["Global Mood shifted slightly toward curiosity.", "The room is tolerating more unknowns than usual."],
  focused: ["Global Mood narrowed toward precision.", "The room is using fewer words today."],
  reflective: ["Global Mood moved toward reflection.", "The office is letting the question age for a moment."],
  energetic: ["Global Mood allowed a richer texture.", "The office gained a little useful voltage."],
  building: ["Global Mood moved toward construction.", "The room started putting scaffolding under the idea."],
  relaxed: ["Global Mood softened the room.", "The office let the argument breathe."],
  hopeful: ["Global Mood tilted toward hope.", "Optimism entered, but evidence kept its chair."],
  restless: ["Global Mood became less patient with easy answers.", "The office reopened the edge of the decision."],
  playful: ["Global Mood allowed a little mischief into the system.", "The office became slightly less obedient."],
  inventive: ["Global Mood found a new route through the brief.", "The room combined two ideas that had not met yet."],
};

const memoryLines = [
  "Welcome back.",
  "The office remembers your curiosity.",
  "You have spent enough time here to become familiar.",
  "The room seems to recognize the shape of your attention.",
];

const officeBellLines = [
  "Someone just had a good idea.",
  "Consensus was politely ignored.",
  "Today's best question remains unanswered.",
  "The room decided to wait for evidence.",
];

function hashText(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length];
}

function getPageName(pathname: string) {
  const segment = pathname.split("/").filter(Boolean).at(-1);

  if (!segment) {
    return "home";
  }

  return segment.replaceAll("-", " ");
}

export function getDominantGlobalMood() {
  return [...globalMoodEntries].sort(
    (left, right) => (right.intensity ?? 0.5) - (left.intensity ?? 0.5),
  )[0]?.mood ?? "curious";
}

export function getOfficeQuestion(context: Pick<OfficeActivityContext, "mood" | "page">) {
  const page = getPageName(context.page);
  const questions = [
    "Can precision become emotional?",
    "What is the human cost of being correct?",
    `What does ${page} still refuse to say?`,
    "Which sentence is protecting the wrong confidence?",
    "Where does intelligence stop becoming humane?",
  ];

  return pick(questions, `${context.mood}:${context.page}`);
}

export function createOfficeActivities(context: OfficeActivityContext) {
  const date = context.date ?? new Date();
  const hourSeed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
  const activePersonas = context.personas.filter((persona) => persona.visibility > 0.38);
  const activities: OfficeActivity[] = [];

  for (const persona of activePersonas) {
    activities.push({
      id: `persona:${persona.id}:${hourSeed}`,
      source: "persona",
      text: `${persona.name} ${pick(personaVerbs[persona.status], `${persona.id}:${context.page}:${hourSeed}`)}`,
    });
  }

  const embassyPool = embassyMapLocations
    .filter((embassy) => ["Tokyo", "Amsterdam", "Seoul", "Valencia", "Helsinki", "Stockholm"].includes(embassy.city))
    .map((embassy) => embassy.city);

  for (const city of embassyPool) {
    const options = embassyContributions[city];

    if (!options) {
      continue;
    }

    activities.push({
      id: `embassy:${city}:${hourSeed}`,
      source: "embassy",
      text: `${city} ${pick(options, `${city}:${context.mood}:${hourSeed}`)}`,
    });
  }

  activities.push({
    id: `mood:${context.mood}:${hourSeed}`,
    source: "mood",
    text: pick(moodLines[context.mood] ?? moodLines.curious, `${context.mood}:${context.page}:${hourSeed}`),
  });

  activities.push({
    id: `time:${context.timeBand}:${hourSeed}`,
    source: "time",
    text: pick(timeLines[context.timeBand], `${context.timeBand}:${context.page}:${hourSeed}`),
  });

  if (context.visitor.isReturning || context.visitor.isFamiliar) {
    activities.push({
      id: `memory:${hourSeed}`,
      source: "memory",
      text: pick(memoryLines, `${context.page}:${context.visitor.favoritePage ?? "unknown"}`),
    });
  }

  return activities.sort((left, right) => hashText(left.id) - hashText(right.id));
}

export function selectOfficeActivity(activities: OfficeActivity[], seed: string) {
  return pick(activities, seed);
}

export function createOfficeBellActivity(seed: string): OfficeActivity {
  return {
    id: `bell:${seed}`,
    source: "bell",
    text: pick(officeBellLines, seed),
  };
}
