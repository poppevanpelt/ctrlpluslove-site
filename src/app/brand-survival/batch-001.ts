export type BatchStageId =
  | "full"
  | "mark"
  | "identity"
  | "category"
  | "stripped";

export type BatchCondition = "brand" | "wallpaper";

export type BatchObservation = {
  id: string;
  participantId: string;
  specimenId: string;
  stage: BatchStageId;
  condition: BatchCondition;
  sourceRecognised: boolean;
  categoryRecognised: boolean;
  confidence: 1 | 2 | 3 | 4 | 5;
  sourceGuess: string;
  recordedAt: string;
};

export type BatchStage = {
  id: BatchStageId;
  short: string;
  label: string;
  removed: string;
  question: string;
};

export const batch001Stages: readonly BatchStage[] = [
  {
    id: "full",
    short: "FULL",
    label: "Full execution",
    removed: "Nothing removed.",
    question: "Can we recognise the source while every identifier is still doing the work?",
  },
  {
    id: "mark",
    short: "MARK",
    label: "Logo removed",
    removed: "Logo / mark",
    question: "Does the execution still have a pulse when the mark disappears?",
  },
  {
    id: "identity",
    short: "IDENTITY",
    label: "Name + signature colour removed",
    removed: "Logo / name / signature colour",
    question: "Is there anything distinctive left once the obvious identity system is gone?",
  },
  {
    id: "category",
    short: "CATEGORY",
    label: "Expected category codes removed",
    removed: "Identity / category language / expected visual codes",
    question: "Does the thing survive without leaning on the category to explain itself?",
  },
  {
    id: "stripped",
    short: "STRIPPED",
    label: "Only the underlying behaviour remains",
    removed: "Everything except behaviour / voice / structure / idea",
    question: "Could this still plausibly have come from only one brand?",
  },
] as const;

/**
 * Committed Batch 001 evidence lives here.
 *
 * The lab bench can collect observations locally first. Once a run is checked,
 * export the JSON and promote only verified rows into this array. The public
 * curve therefore remains evidence-backed while the operator can still watch
 * a live local curve during the experiment.
 */
export const batch001Observations: readonly BatchObservation[] = [];

export type StageMeasurement = {
  n: number;
  recognised: number;
  rate: number | null;
};

export type StageResult = {
  stage: BatchStage;
  brand: StageMeasurement;
  wallpaper: StageMeasurement;
};

const stageIds = new Set<BatchStageId>(batch001Stages.map((stage) => stage.id));
const conditions = new Set<BatchCondition>(["brand", "wallpaper"]);

function isConfidence(value: unknown): value is 1 | 2 | 3 | 4 | 5 {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function isBatchObservation(value: unknown): value is BatchObservation {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;

  return (
    typeof row.id === "string" &&
    typeof row.participantId === "string" &&
    typeof row.specimenId === "string" &&
    stageIds.has(row.stage as BatchStageId) &&
    conditions.has(row.condition as BatchCondition) &&
    typeof row.sourceRecognised === "boolean" &&
    typeof row.categoryRecognised === "boolean" &&
    isConfidence(row.confidence) &&
    typeof row.sourceGuess === "string" &&
    typeof row.recordedAt === "string"
  );
}

export function parseBatch001Observations(input: string): BatchObservation[] {
  try {
    const value: unknown = JSON.parse(input);
    return Array.isArray(value) ? value.filter(isBatchObservation) : [];
  } catch {
    return [];
  }
}

function measure(
  observations: readonly BatchObservation[],
  stage: BatchStageId,
  condition: BatchCondition,
): StageMeasurement {
  const rows = observations.filter(
    (observation) => observation.stage === stage && observation.condition === condition,
  );
  const recognised = rows.filter((observation) => observation.sourceRecognised).length;

  return {
    n: rows.length,
    recognised,
    rate: rows.length === 0 ? null : Math.round((recognised / rows.length) * 1000) / 10,
  };
}

export function aggregateBatch001(
  observations: readonly BatchObservation[] = batch001Observations,
): readonly StageResult[] {
  return batch001Stages.map((stage) => ({
    stage,
    brand: measure(observations, stage.id, "brand"),
    wallpaper: measure(observations, stage.id, "wallpaper"),
  }));
}
