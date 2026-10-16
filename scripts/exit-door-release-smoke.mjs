#!/usr/bin/env node
// Public GETs only; no login, cron, payment or customer-data requests.
import { pathToFileURL } from 'node:url';
export const ORIGINS = ['https://ctrlpluslove.com', 'https://www.ctrlpluslove.com', 'https://ctrlpluslove-site-production.up.railway.app'];
const routes = [['/', /instruments for human judgment/i], ['/savannah/', /Savannah/i], ['/pricing/', /pricing|decision|ctrl\+love/i], ['/manifest.webmanifest', null], ['/api/health', null]];
export async function checkRelease({ origins = ORIGINS, revision, fetchImpl = fetch, timeoutMs = 12000 } = {}) {
  const allowed = new Set(origins.map(value => {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.pathname !== '/' || u.search || u.hash || u.username || u.password) throw Error('Use credential-free HTTPS origins');
    return u.origin;
  }));
  const results = [];
  for (const origin of allowed) for (const [path, marker] of routes) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let url = new URL(path, origin), response;
      const visited = new Set();
      for (let hop = 0; hop <= 5; hop++) {
        if (url.protocol !== 'https:' || !allowed.has(url.origin) || url.username || url.password) throw Error('Redirect leaves approved origins: ' + url.origin);
        if (visited.has(url.href)) throw Error('Redirect loop');
        visited.add(url.href);
        response = await fetchImpl(url, { signal: controller.signal, redirect: 'manual', cache: 'no-store' });
        if (![301,302,303,307,308].includes(response.status)) break;
        const location = response.headers.get('location');
        if (!location) throw Error('Redirect missing Location');
        url = new URL(location, url);
        if (hop === 5) throw Error('Too many redirects');
      }
      if (!response.ok) throw Error('HTTP ' + response.status);
      const body = await response.text();
      if (marker) {
        if (!(response.headers.get('content-type') || '').includes('text/html') || !marker.test(body)) throw Error('Expected page content absent');
        if (path === '/') {
          const tag = (body.match(/<link\b[^>]*>/gi) || []).find(tag => /\brel=["']canonical["']/i.test(tag));
          const canonical = tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
          if (!canonical || new URL(canonical, url).href !== 'https://www.ctrlpluslove.com/') throw Error('Homepage canonical is not www');
        }
      } else {
        const json = JSON.parse(body);
        if (path === '/manifest.webmanifest' && typeof json.name !== 'string') throw Error('Invalid manifest');
        if (path === '/api/health' && (json.status !== 'ok' || json.service !== 'ctrlpluslove-site' || (revision && json.revision !== revision))) throw Error('Release identity mismatch');
      }
      results.push({ origin, path, ok: true, finalOrigin: url.origin });
    } catch (error) { results.push({ origin, path, ok: false, error: error.message }); }
    finally { clearTimeout(timer); }
  }
  return { ok: results.every(result => result.ok), results };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2), revisionArg = args.find(arg => arg.startsWith('--revision='));
  const origins = args.filter(arg => !arg.startsWith('--'));
  const report = await checkRelease({ origins: origins.length ? origins : ORIGINS, revision: revisionArg?.slice(11) });
  for (const r of report.results) console.log(r.ok ? 'PASS' : 'FAIL', r.origin, r.path, r.ok ? r.finalOrigin : r.error);
  console.log('Voice/device playback, login, payment delivery and data restore NOT tested.');
  process.exitCode = report.ok ? 0 : 1;
}
