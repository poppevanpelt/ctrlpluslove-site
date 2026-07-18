import { allRoomPersonas } from "../../app/room-personas-data.ts";

export type OfficeStatus =
  | "reviewing"
  | "thinking"
  | "challenging"
  | "writing"
  | "observing"
  | "away"
  | "experimenting"
  | "building"
  | "arguing"
  | "dreaming"
  | "intervening";

export type OfficeMood =
  | "focused"
  | "curious"
  | "reflective"
  | "restless"
  | "warm"
  | "unimpressed"
  | "inventive"
  | "quiet";

export type OfficePersonaPresence = {
  id: string;
  name: string;
  role: string;
  status: OfficeStatus;
  currentTask: string;
  location: string;
  mood: OfficeMood;
  energy: number;
  visibility: number;
  lastAction: string;
};

export type TimeBand = "morning" | "afternoon" | "night" | "late-night";

export const officeStatuses: OfficeStatus[] = [
  "reviewing",
  "thinking",
  "challenging",
  "writing",
  "observing",
  "away",
  "experimenting",
  "building",
  "arguing",
  "dreaming",
  "intervening",
];

const knownOfficePersonas = [
  {
    id: "mira-fang",
    name: "Mira Fang",
    role: "Editorial Precision",
    tasks: [
      "Stress-testing the proposal.",
      "Removing sentences that arrived overdressed.",
      "Checking whether precision has become emotional.",
    ],
    actions: [
      "Removed one unnecessary sentence.",
      "Simplified an argument without softening it.",
      "Put the sharpest point closer to the beginning.",
    ],
  },
  {
    id: "cass-loam",
    name: "Cass Loam",
    role: "Productive Ambiguity",
    tasks: [
      "Keeping one uncomfortable question open.",
      "Looking for the doubt that still has value.",
      "Letting the answer remain usefully unfinished.",
    ],
    actions: [
      "Reopened an uncomfortable question.",
      "Introduced productive ambiguity.",
      "Refused to let the brief settle too early.",
    ],
  },
  {
    id: "sofia-kpi",
    name: "Sofia KPI",
    role: "Evidence Discipline",
    tasks: [
      "Waiting for evidence.",
      "Separating momentum from proof.",
      "Checking whether confidence has earned its number.",
    ],
    actions: [
      "Asked for evidence before enthusiasm.",
      "Reduced confidence by a responsible amount.",
      "Moved a metric out of costume.",
    ],
  },
  {
    id: "robert-wild",
    name: "Robert Wild",
    role: "Necessary Taste",
    tasks: [
      "Rejecting a sentence for trying too hard.",
      "Protecting the idea from performance.",
      "Keeping the page allergic to theatre.",
    ],
    actions: [
      "Removed an adjective.",
      "Rejected a sentence for trying too hard.",
      "Asked the copy to stop auditioning.",
    ],
  },
  {
    id: "flip",
    name: "Flip",
    role: "Unsupervised Interruption",
    tasks: [
      "Testing the patience of a keyboard.",
      "Interrupting absolutely nothing.",
      "Looking busy near a paperclip.",
    ],
    actions: [
      "Interrupted absolutely nothing.",
      "Borrowed a keyboard key and returned it.",
      "Moved a paperclip by one private degree.",
    ],
  },
  {
    id: "grace",
    name: "Grace",
    role: "Reputation Memory",
    tasks: [
      "Deciding whether the brief deserves forgiveness.",
      "Listening for trust damage.",
      "Checking whether humanity survived the recommendation.",
    ],
    actions: [
      "Has not forgiven the brief yet.",
      "Kept one reputational consequence visible.",
      "Asked whether the room would say this in public.",
    ],
  },
] as const;

const officeLocations = [
  "Tokyo Embassy",
  "Amsterdam signal desk",
  "Seoul signal desk",
  "Valencia signal desk",
  "Helsinki quiet room",
  "The Room",
  "Back office",
];

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length];
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function getTimeBand(date = new Date()): TimeBand {
  const hour = date.getHours();

  if (hour < 5) {
    return "late-night";
  }

  if (hour < 12) {
    return "morning";
  }

  if (hour < 21) {
    return "afternoon";
  }

  return "night";
}

export function createPersonaPresence(options: {
  date?: Date;
  mood: string;
  page: string;
}) {
  const date = options.date ?? new Date();
  const timeBand = getTimeBand(date);
  const timeEnergy =
    timeBand === "morning"
      ? 0.18
      : timeBand === "afternoon"
        ? 0.04
        : timeBand === "night"
          ? -0.16
          : -0.34;
  const moodEnergy =
    options.mood === "energetic" || options.mood === "building"
      ? 0.14
      : options.mood === "reflective" || options.mood === "relaxed"
        ? -0.1
        : 0;

  return knownOfficePersonas.map((persona, index): OfficePersonaPresence => {
    const seed = `${persona.id}:${options.mood}:${options.page}:${date.getDate()}:${date.getHours()}`;
    const base = 0.46 + (hashText(seed) % 37) / 100;
    const energy = clamp(base + timeEnergy + moodEnergy - index * 0.015);
    const status =
      timeBand === "late-night" && index > 1
        ? "away"
        : timeBand === "night" && index > 3
          ? "dreaming"
          : pick(officeStatuses, seed) === "away"
            ? "observing"
            : pick(officeStatuses, seed);

    return {
      id: persona.id,
      name: persona.name,
      role: persona.role,
      status,
      currentTask: pick(persona.tasks, `${seed}:task`),
      location: pick(officeLocations, `${seed}:location`),
      mood: pick(
        [
          "focused",
          "curious",
          "reflective",
          "restless",
          "warm",
          "unimpressed",
          "inventive",
          "quiet",
        ] satisfies OfficeMood[],
        `${seed}:mood`,
      ),
      energy,
      visibility: clamp(energy + (status === "away" ? -0.42 : 0.08)),
      lastAction: pick(persona.actions, `${seed}:action`),
    };
  });
}

export function getSyntheticRoomNames() {
  return allRoomPersonas.slice(0, 5).map((persona) => persona.name);
}
