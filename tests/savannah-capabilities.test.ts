import { test } from "node:test";
import assert from "node:assert/strict";
import { parseNotes, parseProposal, capabilityContext } from "../src/lib/savannah/capabilities.ts";
import { parseFeed, fetchHeadlines } from "../src/lib/savannah/news.ts";

test("memory rejects corrupted storage and never pretends it verifies identity", () => {
  assert.deepEqual(parseNotes("broken"), []);
  assert.deepEqual(parseNotes('{"text":"not an array"}'), []);
  assert.equal(parseNotes(JSON.stringify([{ id: "1", text: "Keep meetings short", savedAt: "2026-10-05" }, { id: 2 }])).length, 1);
  assert.match(capabilityContext([], new Date("2026-10-05T18:00:00Z")), /2026-10-05/);
  assert.match(capabilityContext([]), /not identity verification/);
});
test("a decision cannot be saved with missing ownership or stop criteria", () => {
  assert.equal(parseProposal("record_decision", { decision: "Try it" }), null);
  assert.equal(parseProposal("remember_note", "broken"), null);
  assert.equal(parseProposal("remember_note", { note: "   " }), null);
  assert.equal(parseProposal("record_decision", { decision: "Pilot", owner: "Poppe", deadline: "9 October", evidence: "Five trials", stopRule: "Stop if nobody uses it" })?.kind, "decision");
});
test("headlines reject hostile links, preserve dates, and tolerate malformed items", () => {
  const xml = '<rss><item><title><![CDATA[AI &amp; humans]]></title><link>https://www.wired.com/story/test/</link><pubDate>Mon, 05 Oct 2026 10:00:00 GMT</pubDate></item><item><title>Trap</title><link>javascript:alert(1)</link></item><item><title>Other host</title><link>https://wired.com.attacker.example/</link></item></rss>';
  const items = parseFeed(xml, { name: "WIRED", host: "wired.com" });
  assert.equal(items.length, 1);
  assert.equal(items[0].title, "AI & humans");
  assert.equal(items[0].publishedAt, "2026-10-05T10:00:00.000Z");
});
test("unavailable sources are explicit, and no keyword match invents no fallback", async () => {
  const fake = (async (url: string) => {
    if (url.includes("wired")) return new Response('<rss><item><title>New AI work</title><link>https://www.wired.com/story/ai/</link></item></rss>');
    throw new Error("Offline");
  }) as typeof fetch;
  const match = await fetchHeadlines("AI", fake);
  assert.equal(match.headlines.length, 1);
  assert.equal(match.unavailableSources.length, 2);
  assert.equal((await fetchHeadlines("banana", fake)).headlines.length, 0);
});
