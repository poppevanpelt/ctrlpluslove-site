export type RoomEnv = {
  notionToken: string;
  notionRunsDataSourceId: string;
  openaiApiKey: string;
  cronSecret: string;
  dryRun: boolean;
  roomModel: string;
  roomMaxRunsPerCycle: number;
  roomMinimumIntervalMinutes: number;
  roomStaleRequestHours: number;
};

const DEFAULT_ROOM_MODEL = "gpt-4.1-mini";
const DEFAULT_MAX_RUNS = 3;
const DEFAULT_MINIMUM_INTERVAL_MINUTES = 5;
const DEFAULT_STALE_REQUEST_HOURS = 72;

function readRequired(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readRequiredOne(primary: string, fallback: string): string {
  const primaryValue = process.env[primary]?.trim();

  if (primaryValue) {
    return primaryValue;
  }

  const fallbackValue = process.env[fallback]?.trim();

  if (fallbackValue) {
    return fallbackValue;
  }

  throw new Error(`Missing required environment variable: ${primary} (or legacy ${fallback}).`);
}

function readBoolean(name: string): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

function readPositiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];

  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer.`);
  }

  return parsed;
}

export function getRoomEnv(): RoomEnv {
  return {
    notionToken: readRequired("NOTION_TOKEN"),
    notionRunsDataSourceId: readRequiredOne("NOTION_RUNS_DATA_SOURCE_ID", "NOTION_PROJECT_DATABASE_ID"),
    openaiApiKey: readRequired("OPENAI_API_KEY"),
    cronSecret: readRequired("CRON_SECRET"),
    dryRun: readBoolean("DRY_RUN"),
    roomModel: process.env.ROOM_MODEL?.trim() || DEFAULT_ROOM_MODEL,
    roomMaxRunsPerCycle: readPositiveInteger("ROOM_MAX_RUNS_PER_CYCLE", DEFAULT_MAX_RUNS),
    roomMinimumIntervalMinutes: readPositiveInteger(
      "ROOM_MINIMUM_INTERVAL_MINUTES",
      DEFAULT_MINIMUM_INTERVAL_MINUTES,
    ),
    roomStaleRequestHours: readPositiveInteger("ROOM_STALE_REQUEST_HOURS", DEFAULT_STALE_REQUEST_HOURS),
  };
}
