import {
  createOfficeActivities,
  getDominantGlobalMood,
  getOfficeQuestion,
  type OfficeActivity,
  type VisitorMemorySummary,
} from "./activityGenerator.ts";
import {
  createPersonaPresence,
  getTimeBand,
  type OfficePersonaPresence,
  type TimeBand,
} from "./personaPresence.ts";

export type LivingOfficeState = {
  generatedAt: string;
  timeBand: TimeBand;
  globalMood: string;
  activeCount: number;
  personas: OfficePersonaPresence[];
  activities: OfficeActivity[];
  currentQuestion: string;
  contributingEmbassies: string[];
};

export function createLivingOfficeState(options: {
  date?: Date;
  page: string;
  visitor?: VisitorMemorySummary;
  mood?: string;
}): LivingOfficeState {
  const date = options.date ?? new Date();
  const globalMood = options.mood ?? getDominantGlobalMood();
  const timeBand = getTimeBand(date);
  const visitor = options.visitor ?? { isReturning: false, isFamiliar: false };
  const personas = createPersonaPresence({
    date,
    mood: globalMood,
    page: options.page,
  });
  const activePersonas = personas.filter((persona) => persona.visibility > 0.38);
  const activities = createOfficeActivities({
    date,
    mood: globalMood,
    page: options.page,
    personas,
    timeBand,
    visitor,
  });

  return {
    generatedAt: date.toISOString(),
    timeBand,
    globalMood,
    activeCount: activePersonas.length,
    personas,
    activities,
    currentQuestion: getOfficeQuestion({ mood: globalMood, page: options.page }),
    contributingEmbassies: ["Tokyo", "Amsterdam", "Seoul", "Valencia", "Helsinki"].slice(
      0,
      timeBand === "late-night" ? 1 : timeBand === "night" ? 2 : 4,
    ),
  };
}
