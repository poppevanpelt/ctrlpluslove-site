type LogLevel = "info" | "warn" | "error";

export function roomLog(
  level: LogLevel,
  event: {
    pageId?: string;
    runVersion?: number;
    stage: string;
    result?: string;
    durationMs?: number;
    errorCategory?: string;
    message?: string;
  },
) {
  const payload = {
    component: "rerun-room",
    level,
    timestamp: new Date().toISOString(),
    ...event,
  };

  console[level === "warn" ? "warn" : level](JSON.stringify(payload));
}
