export type ImpactSurface =
  | "hero-stage"
  | "viewport-edge"
  | "pinball"
  | "calibration"
  | "unknown";

export type ImpactEnergyClass = "tiny" | "normal" | "hard" | "violent";

export type ImpactEvent = {
  timestamp: number;
  energy: number;
  surface: ImpactSurface;
  velocity: number;
  location: { x: number; y: number };
};

export type BallIntegrity = {
  wear: number;
  fatigue: number;
  lastMaintenance?: number;
  recentImpacts: ImpactEvent[];
  maintenanceRequestedAt?: number;
};

export type ImpactInput = {
  timestamp?: number;
  energy?: number;
  surface?: ImpactSurface;
  velocity?: number;
  location?: { x: number; y: number };
};

export const MAX_RECENT_IMPACTS = 12;
export const FATIGUE_DECAY_PER_MS = 0.0000048;
export const MAINTENANCE_WEAR_THRESHOLD = 0.028;
export const MAINTENANCE_FATIGUE_THRESHOLD = 0.32;

export const pristineBallIntegrity: BallIntegrity = {
  wear: 0,
  fatigue: 0,
  recentImpacts: [],
};

export function clampIntegrity(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function classifyImpactEnergy(energy: number): ImpactEnergyClass {
  if (!Number.isFinite(energy) || energy < 0.18) {
    return "tiny";
  }

  if (energy < 0.58) {
    return "normal";
  }

  if (energy < 1.15) {
    return "hard";
  }

  return "violent";
}

export function createImpactEvent(input: ImpactInput, now = Date.now()): ImpactEvent {
  const velocity = Math.max(0, Number.isFinite(input.velocity) ? input.velocity ?? 0 : 0);
  const energy = Math.max(0, Number.isFinite(input.energy) ? input.energy ?? velocity / 1800 : velocity / 1800);

  return {
    timestamp: input.timestamp ?? now,
    energy,
    surface: input.surface ?? "unknown",
    velocity,
    location: {
      x: Number.isFinite(input.location?.x) ? input.location?.x ?? 0 : 0,
      y: Number.isFinite(input.location?.y) ? input.location?.y ?? 0 : 0,
    },
  };
}

export function normalizeBallIntegrity(value: Partial<BallIntegrity> | null | undefined): BallIntegrity {
  return {
    wear: clampIntegrity(value?.wear ?? 0),
    fatigue: clampIntegrity(value?.fatigue ?? 0),
    lastMaintenance: Number.isFinite(value?.lastMaintenance) ? value?.lastMaintenance : undefined,
    maintenanceRequestedAt: Number.isFinite(value?.maintenanceRequestedAt)
      ? value?.maintenanceRequestedAt
      : undefined,
    recentImpacts: Array.isArray(value?.recentImpacts)
      ? value.recentImpacts
          .filter((impact) => impact && typeof impact === "object")
          .map((impact) => createImpactEvent(impact))
          .slice(-MAX_RECENT_IMPACTS)
      : [],
  };
}

export function decayIntegrityFatigue(
  integrity: BallIntegrity,
  elapsedMs: number,
): BallIntegrity {
  if (elapsedMs <= 0 || integrity.fatigue <= 0) {
    return normalizeBallIntegrity(integrity);
  }

  return normalizeBallIntegrity({
    ...integrity,
    fatigue: Math.max(0, integrity.fatigue - elapsedMs * FATIGUE_DECAY_PER_MS),
  });
}

export function registerIntegrityImpact(
  integrity: BallIntegrity,
  input: ImpactInput,
  now = Date.now(),
) {
  const impact = createImpactEvent(input, now);
  const classification = classifyImpactEnergy(impact.energy);

  if (classification === "tiny" || classification === "normal") {
    return {
      integrity: normalizeBallIntegrity(integrity),
      impact,
      classification,
      changed: false,
      maintenanceRequested: false,
    };
  }

  const isViolent = classification === "violent";
  const fatigueIncrease = isViolent
    ? Math.min(0.095, impact.energy * 0.042)
    : Math.min(0.052, impact.energy * 0.028);
  const wearIncrease = isViolent
    ? Math.min(0.003, 0.0014 + impact.energy * 0.0007)
    : Math.min(0.0016, 0.00055 + impact.energy * 0.00035);
  const next = normalizeBallIntegrity({
    ...integrity,
    fatigue: integrity.fatigue + fatigueIncrease,
    wear: integrity.wear + wearIncrease,
    recentImpacts: [...integrity.recentImpacts, impact].slice(-MAX_RECENT_IMPACTS),
  });
  const maintenanceRequested =
    !next.maintenanceRequestedAt &&
    (next.wear >= MAINTENANCE_WEAR_THRESHOLD || next.fatigue >= MAINTENANCE_FATIGUE_THRESHOLD);

  return {
    integrity: maintenanceRequested
      ? normalizeBallIntegrity({ ...next, maintenanceRequestedAt: now })
      : next,
    impact,
    classification,
    changed: true,
    maintenanceRequested,
  };
}

export function completeIntegrityMaintenance(
  integrity: BallIntegrity,
  now = Date.now(),
): BallIntegrity {
  return normalizeBallIntegrity({
    ...integrity,
    fatigue: 0,
    wear: Math.max(0, integrity.wear - 0.001),
    lastMaintenance: now,
    maintenanceRequestedAt: undefined,
  });
}

export function toPersistedIntegrity(integrity: BallIntegrity): BallIntegrity {
  return normalizeBallIntegrity({
    wear: integrity.wear,
    fatigue: 0,
    lastMaintenance: integrity.lastMaintenance,
    recentImpacts: integrity.recentImpacts,
    maintenanceRequestedAt: integrity.maintenanceRequestedAt,
  });
}

export function getIntegrityAppearance(integrity: BallIntegrity) {
  const normalized = normalizeBallIntegrity(integrity);

  return {
    wearVisibility: normalized.wear < 0.006 ? 0 : Math.min(0.16, normalized.wear * 2.4),
    fatigueInstability: normalized.fatigue < 0.08 ? 0 : Math.min(0.18, normalized.fatigue * 0.42),
    fatigueDelayMs: normalized.fatigue < 0.14 ? 0 : Math.round(50 + Math.min(70, normalized.fatigue * 140)),
    shouldTick: normalized.fatigue >= 0.18,
    shouldWobble: normalized.fatigue >= 0.12,
  };
}
