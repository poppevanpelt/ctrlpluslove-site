import { NextRequest, NextResponse } from "next/server";

import { createRadarSignal, findMatchingRadarSignal } from "@/lib/radar/notion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  return value.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      console.error("Radar signal rejected: invalid JSON body.");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const signal = normalizeText(body.signal, 220);
    const hiddenField = normalizeText(body.website, 120);

    if (hiddenField) {
      return NextResponse.json({ ok: true });
    }

    if (signal.length < 12) {
      console.error("Radar signal rejected: signal below minimum length.");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    let insight = null;

    try {
      insight = await findMatchingRadarSignal(signal);
    } catch (error) {
      console.error("Radar matching check failed", error);
    }

    await createRadarSignal({
      signal,
      type: normalizeChoice(body.type, VALID_TYPES, "Observation"),
      source: normalizeChoice(body.source, VALID_SOURCES, "Other"),
      confidence: normalizeChoice(body.confidence, VALID_CONFIDENCE, "Medium"),
      market: normalizeText(body.market, 120),
      location: normalizeText(body.location, 120),
      notes: normalizeText(body.notes, 1200),
      sourceMaterial: normalizeText(body.sourceMaterial, 600),
    });

    return NextResponse.json({
      ok: true,
      insight,
    });
  } catch (error) {
    console.error("Radar signal submission failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
