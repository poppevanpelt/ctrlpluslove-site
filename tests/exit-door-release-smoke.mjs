import assert from 'node:assert/strict';
import test from 'node:test';
import { checkRelease } from '../scripts/exit-door-release-smoke.mjs';
const origin = 'https://www.ctrlpluslove.com';
function response(url, revision = 'release-1') {
  const path = new URL(url).pathname;
  if (path === '/api/health') return Response.json({ status: 'ok', service: 'ctrlpluslove-site', revision });
  if (path === '/manifest.webmanifest') return Response.json({ name: 'ctrl+love' });
  return new Response('<link rel="canonical" href="https://www.ctrlpluslove.com/"><h1>Instruments for human judgment</h1>Savannah pricing', { headers: { 'Content-Type': 'text/html' } });
}
test('accepts intended site and matching release', async () => {
  const report = await checkRelease({ origins: [origin], revision: 'release-1', fetchImpl: async url => response(url) });
  assert.equal(report.ok, true); assert.equal(report.results.length, 5);
});
test('rejects Vercel intermediate redirects without requesting them', async () => {
  let outsideCalls = 0;
  const report = await checkRelease({ origins: [origin], fetchImpl: async url => {
    if (new URL(url).origin !== origin) outsideCalls++;
    return new Response(null, { status: 307, headers: { location: 'https://old.vercel.app/' } });
  } });
  assert.equal(report.ok, false); assert.equal(outsideCalls, 0);
});
test('rejects stale releases and HTML health placeholders', async () => {
  for (const health of [Response.json({ status: 'ok', service: 'ctrlpluslove-site', revision: 'old' }), new Response('<html>200</html>')]) {
    const r = await checkRelease({ origins: [origin], revision: 'release-1', fetchImpl: async url => new URL(url).pathname === '/api/health' ? health : response(url) });
    assert.equal(r.results.at(-1).ok, false);
  }
});
test('rejects stale apex canonical', async () => {
  const r = await checkRelease({ origins: [origin], fetchImpl: async url => new URL(url).pathname === '/' ? new Response('<link rel="canonical" href="https://ctrlpluslove.com/">Instruments for human judgment', { headers: { 'Content-Type': 'text/html' } }) : response(url) });
  assert.equal(r.results[0].ok, false);
});
test('accepts explicit apex to www redirect and rejects loops', async () => {
  const apex = 'https://ctrlpluslove.com';
  const r = await checkRelease({ origins: [apex, origin], fetchImpl: async url => new URL(url).origin === apex ? new Response(null, { status: 308, headers: { location: origin + new URL(url).pathname } }) : response(url) });
  assert.equal(r.ok, true);
  const loop = await checkRelease({ origins: [origin], fetchImpl: async url => new Response(null, { status: 308, headers: { location: String(url) } }) });
  assert.equal(loop.ok, false);
});
test('times out even when response headers arrive but body stalls', async () => {
  const r = await checkRelease({ origins: [origin], timeoutMs: 10, fetchImpl: async (_url, { signal }) => new Response(new ReadableStream({ start(c) { signal.addEventListener('abort', () => c.error(Error('Timed out')), { once: true }); } })) });
  assert.equal(r.ok, false);
});
