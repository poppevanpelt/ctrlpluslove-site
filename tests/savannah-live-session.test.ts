import { test } from "node:test";
import assert from "node:assert/strict";
import { GET, POST } from "../src/app/api/savannah/live-session/route.ts";

test("live sessions stay disabled without setup and require same-origin test access with bounded duration", async () => {
  const previous = { key: process.env.SIMLI_API_KEY, face: process.env.SIMLI_FACE_ID, access: process.env.SAVANNAH_LIVE_TEST_KEY, fetch: globalThis.fetch };
  let calls = 0;
  globalThis.fetch = (async (_input, init) => {
    calls++;
    const config = JSON.parse(String(init?.body));
    assert.equal(config.maxSessionLength, 120);
    assert.equal(config.maxIdleTime, 30);
    assert.equal(config.audioInputFormat, "pcm16");
    return Response.json({ session_token: "temporary-test-session" });
  }) as typeof fetch;
  try {
    delete process.env.SIMLI_API_KEY;
    assert.deepEqual(await (await GET()).json(), { configured: false });
    assert.equal((await POST(new Request("https://example.test/api/savannah/live-session", { method: "POST" }))).status, 503);
    process.env.SIMLI_API_KEY = "test-provider-key";
    process.env.SIMLI_FACE_ID = "test-face";
    process.env.SAVANNAH_LIVE_TEST_KEY = "test-access-value-at-least-32-characters";
    const request = (origin: string, authorization: string) => new Request("https://example.test/api/savannah/live-session", { method: "POST", headers: { origin, authorization } });
    assert.equal((await POST(request("https://other.test", ""))).status, 403);
    assert.equal((await POST(request("https://example.test", "Bearer wrong"))).status, 401);
    assert.equal(calls, 0);
    const headers = `Bearer ${process.env.SAVANNAH_LIVE_TEST_KEY}`;
    const result = await POST(request("https://example.test", headers));
    assert.equal(result.status, 200);
    const body = await result.json();
    assert.deepEqual(body, { session_token: "temporary-test-session" });
    assert.equal(JSON.stringify(body).includes(process.env.SIMLI_API_KEY), false);
    assert.equal((await POST(request("https://example.test", headers))).status, 429);
    assert.equal(calls, 1);
  } finally {
    for (const [key, value] of Object.entries({ SIMLI_API_KEY: previous.key, SIMLI_FACE_ID: previous.face, SAVANNAH_LIVE_TEST_KEY: previous.access })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    globalThis.fetch = previous.fetch;
  }
});
