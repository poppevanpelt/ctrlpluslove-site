import assert from "node:assert/strict";
import test from "node:test";
import { buildFingerprint } from "../src/lib/room/buildFingerprint.ts";
import { classifyTextMeaning } from "../src/lib/room/classifyChanges.ts";
import { detectChanges } from "../src/lib/room/detectChanges.ts";
import { evaluateRunEligibility } from "../src/lib/room/runGuards.ts";
import { parseRoomResult } from "../src/lib/room/resultSchema.ts";
import { updateRunStatus } from "../src/lib/notion/updateRunStatus.ts";
import { controlledBlockIdsForArchive, writeRoomResult } from "../src/lib/notion/writeRoomResult.ts";
import { getRoomEnv } from "../src/lib/env.ts";
import type { PageContext, RoomRefreshResult } from "../src/lib/room/types.ts";
import type { RoomEnv } from "../src/lib/env.ts";

const baseContext: PageContext = {
  page: { id: "page-1", properties: {} },
  title: "A decision room",
  properties: {
    "Room Status": "Refresh requested",
    "Run Version": 1,
  },
  blocks: [
    {
      id: "block-1",
      type: "paragraph",
      depth: 0,
      text: "We are deciding whether to launch in Amsterdam.",
      children: [],
    },
  ],
  sectionText: {
    discussion: "Simon: The current evidence is thin.",
    synthesis: "Proceed carefully.",
    recommendation: "Run a small test.",
  },
  comments: [],
};

const validResult: RoomRefreshResult = {
  meaningfulChange: true,
  triggeringComments: [{ author: "Ari", text: "Budget is lower.", createdAt: "2026-07-11T09:00:00.000Z" }],
  voicesReactivated: ["Commercial Realist"],
  discussionMarkdown: "Commercial Realist: The lower budget rules out a broad launch.",
  changedPositions: [{ voice: "Room", before: "Broad test", after: "Narrow test", reason: "Budget constraint" }],
  synthesisMarkdown: "The launch can continue only as a narrow test.",
  recommendationMarkdown: "Launch a narrow pilot.",
  recommendationChanged: true,
  confidenceBefore: 0.62,
  confidenceAfter: 0.7,
  changeLogMarkdown: "Updated for budget constraint.",
};

test("buildFingerprint is deterministic", () => {
  const first = buildFingerprint(baseContext, 1);
  const second = buildFingerprint(baseContext, 1);
  assert.equal(first.fingerprint, second.fingerprint);
});

test("emoji-only comments are filtered as non-material", () => {
  const result = classifyTextMeaning("🔥🔥");
  assert.equal(result.meaningful, false);
  assert.equal(result.reason, "emoji-only input");
});

test("simple acknowledgements are filtered as non-material", () => {
  const result = classifyTextMeaning("thanks");
  assert.equal(result.meaningful, false);
  assert.equal(result.reason, "simple acknowledgement");
});

test("approved acknowledgement is filtered as non-material", () => {
  const result = classifyTextMeaning("approved");
  assert.equal(result.meaningful, false);
});

test("sensory or firsthand observation is meaningful", () => {
  const result = classifyTextMeaning("I saw three users hesitate when the rejection message appeared.");
  assert.equal(result.meaningful, true);
});

test("direct question is meaningful", () => {
  const result = classifyTextMeaning("What happens if the object feels too heavy to fiddle with?");
  assert.equal(result.meaningful, true);
});

test("changed constraint is meaningful", () => {
  const result = classifyTextMeaning("The budget changed to €5,000 and we cannot use paid media.");
  assert.equal(result.meaningful, true);
});

test("duplicate-run prevention blocks Running pages", () => {
  const result = evaluateRunEligibility({
    status: "Running",
    now: "2026-07-11T10:00:00.000Z",
    minimumIntervalMinutes: 5,
    staleRequestHours: 72,
  });
  assert.deepEqual(result, {
    allowed: false,
    reason: "already_running",
    summary: "Page is already running.",
  });
});

test("duplicate-run prevention blocks already processed requests", () => {
  const result = evaluateRunEligibility({
    status: "Refresh requested",
    refreshRequestedAt: "2026-07-11T09:00:00.000Z",
    lastRoomRun: "2026-07-11T09:05:00.000Z",
    now: "2026-07-11T10:00:00.000Z",
    minimumIntervalMinutes: 5,
    staleRequestHours: 72,
  });
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.reason, "already_processed");
});

test("valid model result parses", () => {
  assert.deepEqual(parseRoomResult(validResult), validResult);
});

test("invalid model result is rejected", () => {
  assert.throws(() => parseRoomResult({ ...validResult, meaningfulChange: "yes" }), /meaningfulChange/);
});

test("no-material-change flow detects identical fingerprint", () => {
  const marker = buildFingerprint(baseContext, 1);
  const result = detectChanges(baseContext, marker, 1);
  assert.equal(result.changed, false);
  assert.deepEqual(result.signals, []);
});

test("successful status transition writes Updated payload", async () => {
  const calls: unknown[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(String(init?.body)));
    return Response.json({ id: "page-1", properties: {} });
  };

  try {
    await updateRunStatus(testEnv(), "page-1", "Updated", {
      runVersion: 2,
      summary: "Done",
      error: "",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  const payload = calls[0] as { properties: Record<string, unknown> };
  assert.deepEqual(payload.properties["Room Status"], { status: { name: "Updated" } });
  assert.deepEqual(payload.properties["Run Version"], { number: 2 });
});

test("failed status transition writes readable Room Error", async () => {
  const calls: unknown[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    calls.push(JSON.parse(String(init?.body)));
    return Response.json({ id: "page-1", properties: {} });
  };

  try {
    await updateRunStatus(testEnv(), "page-1", "Failed", {
      error: "Model output was invalid.",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  const payload = calls[0] as { properties: Record<string, { rich_text?: Array<{ text: { content: string } }> }> };
  assert.deepEqual(payload.properties["Room Status"], { status: { name: "Failed" } });
  assert.equal(payload.properties["Room Error"].rich_text?.[0]?.text.content, "Model output was invalid.");
});

test("controlled write-back targets only Engine-owned room sections", () => {
  const blockIds = controlledBlockIdsForArchive([
    { id: "brief-heading", type: "heading_2", depth: 0, text: "Brief", children: [] },
    { id: "brief-body", type: "paragraph", depth: 0, text: "Human authored brief.", children: [] },
    { id: "discussion-heading", type: "heading_2", depth: 0, text: "Discussion", children: [] },
    { id: "discussion-body", type: "paragraph", depth: 0, text: "Old controlled discussion.", children: [] },
    { id: "recommendation-heading", type: "heading_2", depth: 0, text: "Recommendation", children: [] },
    { id: "recommendation-body", type: "paragraph", depth: 0, text: "Old controlled recommendation.", children: [] },
    { id: "notes-heading", type: "heading_2", depth: 0, text: "Ambassador notes", children: [] },
    { id: "notes-body", type: "paragraph", depth: 0, text: "Keep me.", children: [] },
  ]);

  assert.deepEqual(blockIds, [
    "discussion-heading",
    "discussion-body",
    "recommendation-heading",
    "recommendation-body",
  ]);
});

test("writeRoomResult archives controlled sections before appending fresh output", async () => {
  const calls: Array<{ url: string; body: unknown }> = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
    return Response.json({ id: "ok", properties: {} });
  };

  try {
    await writeRoomResult(testEnv(), "page-1", validResult, 2, "2026-07-11T10:00:00.000Z", [
      { id: "human-heading", type: "heading_2", depth: 0, text: "Brief", children: [] },
      { id: "human-body", type: "paragraph", depth: 0, text: "Keep.", children: [] },
      { id: "discussion-heading", type: "heading_2", depth: 0, text: "Discussion", children: [] },
      { id: "discussion-body", type: "paragraph", depth: 0, text: "Old.", children: [] },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(calls[0].url.endsWith("/blocks/discussion-heading"), true);
  assert.deepEqual(calls[0].body, { archived: true });
  assert.equal(calls[1].url.endsWith("/blocks/discussion-body"), true);
  assert.deepEqual(calls[1].body, { archived: true });
  assert.equal(calls[2].url.endsWith("/blocks/page-1/children"), true);
  assert.ok(Array.isArray((calls[2].body as { children?: unknown[] }).children));
});

test("DRY_RUN is parsed as a server-only dry-run mode flag", () => {
  const previous = {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_RUNS_DATA_SOURCE_ID: process.env.NOTION_RUNS_DATA_SOURCE_ID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
    DRY_RUN: process.env.DRY_RUN,
  };

  process.env.NOTION_TOKEN = "notion-test";
  process.env.NOTION_RUNS_DATA_SOURCE_ID = "source-test";
  process.env.OPENAI_API_KEY = "openai-test";
  process.env.CRON_SECRET = "secret-test";
  process.env.DRY_RUN = "true";

  try {
    assert.equal(getRoomEnv().dryRun, true);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});

function testEnv(): RoomEnv {
  return {
    notionToken: "notion-test",
    notionRunsDataSourceId: "source-test",
    openaiApiKey: "openai-test",
    cronSecret: "secret-test",
    dryRun: false,
    roomModel: "test-model",
    roomMaxRunsPerCycle: 3,
    roomMinimumIntervalMinutes: 5,
    roomStaleRequestHours: 72,
  };
}
