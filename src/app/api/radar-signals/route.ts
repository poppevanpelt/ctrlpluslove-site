import { NextRequest, NextResponse } from "next/server";

import {
  createRadarSignal,
  getRadarSignal,
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
  | RadarReflectionResponse
  | { status: "saved_reflection_unavailable"; signalId: string }
  | { status: "save_failed" }
  | { status: "ignored" };

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

async function reflectSavedSignal(signalId: string, input: RadarSignalInput): Promise<RadarReflectionResponse> {
  const relatedSignals: RadarRelatedSignal[] = [];
  const reflection = await generateRadarReflection(input, relatedSignals);

  await updateRadarSignalReflection(signalId, reflection);

  return {
    status: "reflected",
    signalId,
    ...reflection,
  };
}

async function saveAndReflect(input: RadarSignalInput): Promise<RadarApiResponse> {
  let savedSignal: { id: string };

  try {
    savedSignal = await createRadarSignal(input);
  } catch (error) {
    console.error("Radar signal save failed", error);
    return { status: "save_failed" };
  }

  try {
    return await reflectSavedSignal(savedSignal.id, input);
  } catch (error) {
    console.error("Radar reflection failed after save", {
      signalId: savedSignal.id,
      error,
    });
    return { status: "saved_reflection_unavailable", signalId: savedSignal.id };
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
  if (requestIsTooLarge(request)) {
    console.error("Radar signal rejected: payload too large.");
    return NextResponse.json({ status: "save_failed" }, { status: 413 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      console.error("Radar signal rejected: invalid JSON body.");
      return NextResponse.json({ status: "save_failed" }, { status: 400 });
    }

    const hiddenField = normalizeText(body.website, 120);

    if (hiddenField) {
      return NextResponse.json({ status: "ignored" });
    }

    if (isRateLimited(clientKey(request))) {
      console.error("Radar signal rejected: rate limit exceeded.");
      return NextResponse.json({ status: "save_failed" }, { status: 429 });
    }

    const input = inputFromBody(body);

    if (!input.signal) {
      console.error("Radar signal rejected: empty signal.");
      return NextResponse.json({ status: "save_failed" }, { status: 400 });
    }

    const idempotencyKey = normalizeText(body.idempotencyKey, 120);
    const submissionKey = idempotencyKey ? `${clientKey(request)}:${idempotencyKey}` : "";

    if (submissionKey) {
      const existing = idempotentSubmissions.get(submissionKey);

      if (existing) {
        return responseForResult(await existing);
      }

      const submission = saveAndReflect(input);
      idempotentSubmissions.set(submissionKey, submission);
      const result = await submission;
      setTimeout(() => idempotentSubmissions.delete(submissionKey), RATE_LIMIT_WINDOW_MS);
      return responseForResult(result);
    }

    return responseForResult(await saveAndReflect(input));
  } catch (error) {
    console.error("Radar signal submission failed", error);
    return NextResponse.json({ status: "save_failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const signalId = normalizeText(body?.signalId, 120);

    if (!signalId) {
      console.error("Radar reflection retry rejected: missing signal id.");
      return NextResponse.json({ status: "saved_reflection_unavailable" }, { status: 400 });
    }

    const input = await getRadarSignal(signalId);

    try {
      return responseForResult(await reflectSavedSignal(signalId, input));
    } catch (error) {
      console.error("Radar reflection retry failed", { signalId, error });
      return responseForResult({ status: "saved_reflection_unavailable", signalId });
    }
  } catch (error) {
    console.error("Radar reflection retry failed before reflection", error);
    return NextResponse.json({ status: "saved_reflection_unavailable" }, { status: 500 });
  }
}
