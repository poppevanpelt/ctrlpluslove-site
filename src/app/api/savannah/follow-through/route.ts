import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { authorizeAction, decideNextMove, type FollowThroughCase } from "../../../savannah-follow-through";
import { database, isOwner } from "../inbox/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

function ensureTables(db: ReturnType<typeof database>) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS savannah_follow_through_cases (
      id TEXT PRIMARY KEY,
      objective TEXT NOT NULL,
      success_criteria TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      next_review_at TEXT,
      deadline_at TEXT,
      outcome_evidence TEXT NOT NULL DEFAULT '[]',
      attempts TEXT NOT NULL DEFAULT '[]',
      latest_response TEXT,
      authority TEXT NOT NULL,
      integration_ready INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS savannah_follow_through_events (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      summary TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS savannah_ft_events_case_idx
      ON savannah_follow_through_events(case_id, created_at);
  `);
}

function parseCase(row: Record<string, unknown>): FollowThroughCase {
  return {
    id: String(row.id),
    objective: String(row.objective),
    successCriteria: JSON.parse(String(row.success_criteria || "[]")),
    status: row.status as FollowThroughCase["status"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    ...(row.next_review_at ? { nextReviewAt: String(row.next_review_at) } : {}),
    ...(row.deadline_at ? { deadlineAt: String(row.deadline_at) } : {}),
    outcomeEvidence: JSON.parse(String(row.outcome_evidence || "[]")),
    attempts: JSON.parse(String(row.attempts || "[]")),
    ...(row.latest_response ? { latestResponse: JSON.parse(String(row.latest_response)) } : {}),
    authority: row.authority as FollowThroughCase["authority"],
    integrationReady: Number(row.integration_ready) === 1,
  };
}

export async function GET(request: NextRequest) {
  if (!isOwner(request)) return NextResponse.json({ error: "Owner sign-in required" }, { status: 403, headers });
  let db;
  try {
    db = database();
    ensureTables(db);
    const cases = db.prepare("SELECT * FROM savannah_follow_through_cases ORDER BY updated_at DESC LIMIT 100").all();
    const events = db.prepare("SELECT * FROM savannah_follow_through_events ORDER BY created_at DESC LIMIT 300").all();
    return NextResponse.json({ cases: cases.map((row) => ({ ...parseCase(row as Record<string, unknown>) })), events }, { headers });
  } catch {
    return NextResponse.json({ error: "Follow-through store unavailable; check private database configuration" }, { status: 503, headers });
  } finally {
    db?.close();
  }
}

export async function POST(request: NextRequest) {
  if (!isOwner(request)) return NextResponse.json({ error: "Owner sign-in required" }, { status: 403, headers });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers });
  let db;
  try {
    db = database();
    ensureTables(db);
    const now = new Date().toISOString();

    if (body.operation === "create") {
      const objective = typeof body.objective === "string" ? body.objective.trim() : "";
      const criteria = Array.isArray(body.successCriteria)
        ? body.successCriteria.filter((value: unknown) => typeof value === "string" && value.trim()).map((value: string) => value.trim()).slice(0, 12)
        : [];
      if (!objective || objective.length > 1200 || criteria.length === 0 || criteria.some((value: string) => value.length > 500)) {
        return NextResponse.json({ error: "Provide an objective (max 1200 characters) and at least one success criterion (max 500 characters each)." }, { status: 400, headers });
      }
      const id = randomUUID();
      const authority = body.authority === "draft" || body.authority === "send_routine_support_message" ? body.authority : "read_only";
      const item: FollowThroughCase = {
        id, objective, successCriteria: criteria, status: "active", createdAt: now, updatedAt: now,
        attempts: [], outcomeEvidence: [], authority, integrationReady: false,
        ...(typeof body.deadlineAt === "string" && Number.isFinite(Date.parse(body.deadlineAt)) ? { deadlineAt: new Date(body.deadlineAt).toISOString() } : {}),
      };
      db.prepare(`INSERT INTO savannah_follow_through_cases
        (id,objective,success_criteria,status,created_at,updated_at,next_review_at,deadline_at,outcome_evidence,attempts,latest_response,authority,integration_ready)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
          id, objective, JSON.stringify(criteria), item.status, now, now, null, item.deadlineAt ?? null,
          "[]", "[]", null, authority, 0,
        );
      db.prepare("INSERT INTO savannah_follow_through_events(id,case_id,event_type,summary,details,created_at) VALUES(?,?,?,?,?,?)")
        .run(randomUUID(), id, "case_created", "Objective registered; external actions disabled until an integration is explicitly configured.", JSON.stringify({ authority, integrationReady: false }), now);
      return NextResponse.json({ case: item, created: true }, { status: 201, headers });
    }

    if (body.operation === "evaluate" && typeof body.id === "string") {
      const row = db.prepare("SELECT * FROM savannah_follow_through_cases WHERE id=?").get(body.id) as Record<string, unknown> | undefined;
      if (!row) return NextResponse.json({ error: "Case not found" }, { status: 404, headers });
      const item = parseCase(row);
      const result = decideNextMove(item, now);
      db.prepare("INSERT INTO savannah_follow_through_events(id,case_id,event_type,summary,details,created_at) VALUES(?,?,?,?,?,?)")
        .run(randomUUID(), item.id, "decision", result.reason, JSON.stringify(result), now);
      db.prepare("UPDATE savannah_follow_through_cases SET updated_at=? WHERE id=?").run(now, item.id);
      return NextResponse.json({ case: item, decision: result, authorityCheck: authorizeAction(result.suggestedAuthority, item.authority) }, { headers });
    }

    return NextResponse.json({ error: "Supported operations: create, evaluate" }, { status: 400, headers });
  } catch {
    return NextResponse.json({ error: "Could not save or evaluate the case" }, { status: 503, headers });
  } finally {
    db?.close();
  }
}
