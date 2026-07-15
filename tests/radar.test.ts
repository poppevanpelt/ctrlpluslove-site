import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  generateRadarReflection,
  parseRadarReflection,
} from "../src/lib/radar/reflection.ts";
import { getRadarSignal, updateRadarSignalReflection } from "../src/lib/radar/notion.ts";

const baseInput = {
  signal: "Three people apologized to ChatGPT before changing their prompt.",
  type: "Observation",
  source: "Other",
  confidence: "Medium",
};

test("Radar gives vague signals an honest limitation", async () => {
  const reflection = await generateRadarReflection({
    ...baseInput,
    signal: "People seem different lately.",
  });

  assert.equal(reflection.reflectionType, "Needs more evidence");
  assert.equal(reflection.quality.comparativeValue, "low");
  assert.equal(reflection.relatedSignals.length, 0);
  assert.match(reflection.reflection, /too broad|observable/i);
});

test("Radar does not fabricate meaning from test or nonsense input", async () => {
  const testReflection = await generateRadarReflection({
    ...baseInput,
    signal: "test test test",
  });
  const nonsenseReflection = await generateRadarReflection({
    ...baseInput,
    signal: "asdf qwer zxqv",
  });

  assert.equal(testReflection.reflectionType, "Needs more evidence");
  assert.equal(nonsenseReflection.reflectionType, "Needs more evidence");
  assert.equal(testReflection.roomWorthy, false);
  assert.equal(nonsenseReflection.roomWorthy, false);
});

test("Radar reflections are content-specific when the model provides content-specific output", async () => {
  const first = await generateRadarReflection(baseInput, [], async () => ({
    reflectionType: "Possible implication",
    reflection:
      "Apologizing before editing a prompt may show people treating the system as a social presence, not just a tool.",
    quality: { specific: true, observable: true, comparativeValue: "medium" },
    roomWorthy: true,
    relatedSignals: [],
  }));
  const second = await generateRadarReflection(
    { ...baseInput, signal: "A client asked for a human disagreement round before approving the summary." },
    [],
    async () => ({
      reflectionType: "Question worth exploring",
      reflection:
        "Requesting a disagreement round suggests trust may come from visible friction before agreement.",
      quality: { specific: true, observable: true, comparativeValue: "high" },
      roomWorthy: true,
      relatedSignals: [],
    }),
  );

  assert.notEqual(first.reflection, second.reflection);
  assert.match(first.reflection, /social presence/);
  assert.match(second.reflection, /visible friction/);
});

test("Radar propagates model failure instead of inventing a fallback reflection", async () => {
  await assert.rejects(
    generateRadarReflection(baseInput, [], async () => {
      throw new Error("model unavailable");
    }),
    /model unavailable/,
  );
});

test("Radar only returns related signals that were actually retrieved", () => {
  const reflection = parseRadarReflection(
    {
      reflectionType: "Related pattern",
      reflection:
        "The signal may connect to existing observations about people treating machine interaction as social exchange.",
      quality: { specific: true, observable: true, comparativeValue: "medium" },
      roomWorthy: true,
      relatedSignals: [
        { id: "real-signal", signal: "A retrieved signal" },
        { id: "invented-signal", signal: "An invented signal" },
      ],
    },
    [{ id: "real-signal", signal: "A retrieved signal" }],
  );

  assert.deepEqual(reflection.relatedSignals, [{ id: "real-signal", signal: "A retrieved signal" }]);
});

test("Radar writes the exact generated reflection back to the saved Notion record", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  process.env.NOTION_TOKEN = "notion-test";

  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), init });
    return Response.json({ id: "page-test", properties: {} });
  };

  try {
    await updateRadarSignalReflection("page-test", {
      reflectionType: "Possible implication",
      reflection: "A real saved reflection that should be persisted exactly.",
      quality: { specific: true, observable: true, comparativeValue: "high" },
      roomWorthy: true,
      relatedSignals: [{ id: "related-one", signal: "A similar saved signal" }],
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  const body = JSON.parse(String(requests[0].init?.body));

  assert.equal(body.properties.Reflection.rich_text[0].text.content, "A real saved reflection that should be persisted exactly.");
  assert.equal(body.properties["Reflection Type"].select.name, "Possible implication");
  assert.equal(body.properties.Confidence.select.name, "High");
  assert.equal(body.properties["Room Worthy"].checkbox, true);
  assert.equal(body.properties["Reflection Status"].select.name, "Generated");
  assert.equal(body.properties["Related Signals"].rich_text[0].text.content, "A similar saved signal");
});

test("Radar can retrieve a saved signal for retrying reflection", async () => {
  const originalFetch = globalThis.fetch;
  process.env.NOTION_TOKEN = "notion-test";

  globalThis.fetch = async () =>
    Response.json({
      id: "page-test",
      properties: {
        Signal: { title: [{ plain_text: "A saved observation" }] },
        Type: { select: { name: "Observation" } },
        Source: { select: { name: "Other" } },
        Confidence: { select: { name: "Medium" } },
        Market: { rich_text: [{ plain_text: "Culture" }] },
        Location: { rich_text: [{ plain_text: "Online" }] },
        Notes: { rich_text: [{ plain_text: "It changed the discussion." }] },
        "Source Material": { rich_text: [{ plain_text: "A link" }] },
      },
    });

  try {
    const signal = await getRadarSignal("page-test");

    assert.equal(signal.id, "page-test");
    assert.equal(signal.signal, "A saved observation");
    assert.equal(signal.market, "Culture");
    assert.equal(signal.sourceMaterial, "A link");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Radar client code does not expose server credentials", () => {
  const clientCode = readFileSync("src/app/radar/radar-form.tsx", "utf8");

  assert.equal(clientCode.includes("OPENAI_API_KEY"), false);
  assert.equal(clientCode.includes("NOTION_TOKEN"), false);
});
