import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/savannah-meeting/route.ts";

test("meeting judgment speaks only with two supported transcript excerpts", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "connection-test-placeholder";
  let output = { flag: "Can we reconcile those two decisions?", evidence: ["Launch Friday.", "Do not launch Friday."] };
  globalThis.fetch = async () => Response.json({ output_text: JSON.stringify(output) });
  const request = () => new Request("https://example.test/api/savannah-meeting", { method: "POST", body: JSON.stringify({ transcript: "Launch Friday. Do not launch Friday." }) });
  try {
    assert.equal((await (await POST(request())).json()).flag, output.flag);
    output = { flag: "Invented problem", evidence: ["Launch Friday.", "A statement nobody made."] };
    assert.equal((await (await POST(request())).json()).flag, "");
    output = { flag: "", evidence: [] };
    assert.equal((await (await POST(request())).json()).flag, "");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  }
});
