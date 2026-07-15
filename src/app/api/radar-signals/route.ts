import { NextRequest, NextResponse } from "next/server";

import {
  createRadarSignal,
  getRadarSignal,
  RadarNotionError,
  radarSignalsDataSourceId,
  updateRadarSignalReflection,
  type RadarSignalInput,
} from "@/lib/radar/notion";
import {
  generateRadarReflection,
  type RadarRelatedSignal,
  type RadarReflectionResponse,
} from "@/lib/radar/reflection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 10_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const idempotentSubmissions = new Map<string, Promise<RadarApiResponse>>();
const rateLimitBuckets = new Map<string, number[]>();

const VALID_TYPES = new Set([
  "Observation",
  "Signal",
  "Pattern",
  "Contradiction",
  "Open Question",
  "Cultural Note",
]);

const VALID_SOURCES = new Set([
  "Ambassador",
  "Client",
  "Social",
  "News",
  "Other",
]);

const VALID_CONFIDENCE = new Set(["Low", "Medium", "High"]);

function normalizeChoice(value: unknown, valid: Set<string>, fallback: string) {
  return typeof value === "string" && valid.has(value) ? value : fallback;
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

type RadarApiResponse =
  | (RadarReflectionResponse & { reference: string })
  | { status: "saved_reflection_unavailable"; signalId: string; reference: string }
  | { status: "save_failed"; reference: string }
  | { status: "ignored"; reference: string };

function radarReference() {
  return `RADAR-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

function radarLog(
  level: "info" | "error",
  event: {
    reference: string;
    stage: string;
    signalId?: string;
    status?: number;
    notionCode?: string;
    message?: string;
    validation?: Record<string, unknown>;
  },
) {
  const payload = {
    component: "radar-submission",
    dataSourceId: radarSignalsDataSourceId(),
    ...event,
  };

  if (level === "error") {
    console.error("Radar submission", payload);
    return;
  }

  console.info("Radar submission", payload);
}

function errorDetails(error: unknown) {
  if (error instanceof RadarNotionError) {
    return {
      status: error.status,
      notionCode: error.code,
      message: error.message,
      stage: error.stage,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: String(error),
  };
}

function envPresence() {
  return {
    hasNotionToken: Boolean(process.env.NOTION_TOKEN?.trim()),
    hasOpenaiApiKey: Boolean(process.env.OPENAI_API_KEY?.trim()),
    hasRadarSignalsDataSourceId: Boolean(process.env.RADAR_SIGNALS_DATA_SOURCE_ID?.trim()),
  };
}

function clientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "anonymous"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (rateLimitBuckets.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(key, recent);
    return true;
  }

  recent.push(now);
  rateLimitBuckets.set(key, recent);
  return false;
}

function requestIsTooLarge(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  return Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES;
}

function inputFromBody(body: Record<string, unknown>): RadarSignalInput {
  return {
    signal: normalizeText(body.signal, 220),
    type: normalizeChoice(body.type, VALID_TYPES, "Observation"),
    source: normalizeChoice(body.source, VALID_SOURCES, "Other"),
    confidence: normalizeChoice(body.confidence, VALID_CONFIDENCE, "Medium"),
    market: normalizeText(body.market, 120),
    location: normalizeText(body.location, 120),
    notes: normalizeText(body.notes, 1200),
    sourceMaterial: normalizeText(body.sourceMaterial, 600),
  };
}

async function reflectSavedSignal(
  reference: string,
  signalId: string,
  input: RadarSignalInput,
): Promise<RadarReflectionResponse> {
  const relatedSignals: RadarRelatedSignal[] = [];
  radarLog("info", { reference, stage: "model-generation-start", signalId });
  const reflection = await generateRadarReflection(input, relatedSignals);

  radarLog("info", {
    reference,
    stage: "model-generation-complete",
    signalId,
    validation: {
      reflectionType: reflection.reflectionType,
      relatedSignalCount: reflection.relatedSignals.length,
      roomWorthy: reflection.roomWorthy,
    },
  });
  radarLog("info", { reference, stage: "notion-reflection-update-start", signalId });
  await updateRadarSignalReflection(signalId, reflection);
  radarLog("info", { reference, stage: "notion-reflection-update-complete", signalId });

  return {
    status: "reflected",
    signalId,
    ...reflection,
  };
}

async function saveAndReflect(reference: string, input: RadarSignalInput): Promise<RadarApiResponse> {
  let savedSignal: { id: string };

  try {
    radarLog("info", {
      reference,
      stage: "notion-page-create-start",
      validation: {
        hasSignal: Boolean(input.signal),
        type: input.type,
        source: input.source,
        confidence: input.confidence,
        optionalFields: {
          market: Boolean(input.market),
          location: Boolean(input.location),
          notes: Boolean(input.notes),
          sourceMaterial: Boolean(input.sourceMaterial),
        },
      },
    });
    savedSignal = await createRadarSignal(input);
    radarLog("info", {
      reference,
      stage: "notion-page-create-complete",
      signalId: savedSignal.id,
    });
  } catch (error) {
    const details = errorDetails(error);
    radarLog("error", {
      reference,
      stage: details.stage ?? "notion-page-create-failed",
      status: details.status,
      notionCode: details.notionCode,
      message: details.message,
    });
    return { status: "save_failed", reference };
  }

  try {
    return {
      ...(await reflectSavedSignal(reference, savedSignal.id, input)),
      reference,
    };
  } catch (error) {
    const details = errorDetails(error);
    radarLog("error", {
      reference,
      stage: details.stage ?? "reflection-after-save-failed",
      signalId: savedSignal.id,
      status: details.status,
      notionCode: details.notionCode,
      message: details.message,
    });
    return { status: "saved_reflection_unavailable", signalId: savedSignal.id, reference };
  }
}

function responseForResult(result: RadarApiResponse) {
  if (result.status === "save_failed") {
    return NextResponse.json(result, { status: 500 });
  }

  if (result.status === "saved_reflection_unavailable") {
    return NextResponse.json(result, { status: 202 });
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const reference = radarReference();

  radarLog("info", {
    reference,
    stage: "request-received",
    validation: envPresence(),
  });

  if (requestIsTooLarge(request)) {
    radarLog("error", {
      reference,
      stage: "payload-too-large",
      status: 413,
      validation: {
        contentLength: request.headers.get("content-length"),
      },
    });
    return NextResponse.json({ status: "save_failed", reference }, { status: 413 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      radarLog("error", { reference, stage: "invalid-json", status: 400 });
      return NextResponse.json({ status: "save_failed", reference }, { status: 400 });
    }

    const hiddenField = normalizeText(body.website, 120);

    if (hiddenField) {
      radarLog("info", { reference, stage: "honeypot-ignored" });
      return NextResponse.json({ status: "ignored", reference });
    }

    if (isRateLimited(clientKey(request))) {
      radarLog("error", { reference, stage: "rate-limited", status: 429 });
      return NextResponse.json({ status: "save_failed", reference }, { status: 429 });
    }

    const input = inputFromBody(body);

    radarLog("info", {
      reference,
      stage: "payload-validated",
      validation: {
        hasSignal: Boolean(input.signal),
        type: input.type,
        source: input.source,
        confidence: input.confidence,
      },
    });

    if (!input.signal) {
      radarLog("error", { reference, stage: "empty-signal", status: 400 });
      return NextResponse.json({ status: "save_failed", reference }, { status: 400 });
    }

    const idempotencyKey = normalizeText(body.idempotencyKey, 120);
    const submissionKey = idempotencyKey ? `${clientKey(request)}:${idempotencyKey}` : "";

    if (submissionKey) {
      const existing = idempotentSubmissions.get(submissionKey);

      if (existing) {
        radarLog("info", { reference, stage: "idempotent-replay" });
        return responseForResult(await existing);
      }

      const submission = saveAndReflect(reference, input);
      idempotentSubmissions.set(submissionKey, submission);
      const result = await submission;
      setTimeout(() => idempotentSubmissions.delete(submissionKey), RATE_LIMIT_WINDOW_MS);
      radarLog("info", { reference, stage: "response-returned", status: result.status === "reflected" ? 200 : 500 });
      return responseForResult(result);
    }

    const result = await saveAndReflect(reference, input);
    radarLog("info", { reference, stage: "response-returned", status: result.status === "reflected" ? 200 : 500 });
    return responseForResult(result);
  } catch (error) {
    const details = errorDetails(error);
    radarLog("error", {
      reference,
      stage: "submission-unhandled-error",
      status: 500,
      message: details.message,
    });
    return NextResponse.json({ status: "save_failed", reference }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const reference = radarReference();

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const signalId = normalizeText(body?.signalId, 120);

    if (!signalId) {
      radarLog("error", { reference, stage: "retry-missing-signal-id", status: 400 });
      return NextResponse.json(
        { status: "saved_reflection_unavailable", reference },
        { status: 400 },
      );
    }

    radarLog("info", { reference, stage: "retry-signal-fetch-start", signalId });
    const input = await getRadarSignal(signalId);

    try {
      return responseForResult({
        ...(await reflectSavedSignal(reference, signalId, input)),
        reference,
      });
    } catch (error) {
      const details = errorDetails(error);
      radarLog("error", {
        reference,
        stage: details.stage ?? "retry-reflection-failed",
        signalId,
        status: details.status,
        notionCode: details.notionCode,
        message: details.message,
      });
      return responseForResult({ status: "saved_reflection_unavailable", signalId, reference });
    }
  } catch (error) {
    const details = errorDetails(error);
    radarLog("error", {
      reference,
      stage: "retry-before-reflection-failed",
      status: details.status ?? 500,
      notionCode: details.notionCode,
      message: details.message,
    });
    return NextResponse.json(
      { status: "saved_reflection_unavailable", reference },
      { status: 500 },
    );
  }
}
