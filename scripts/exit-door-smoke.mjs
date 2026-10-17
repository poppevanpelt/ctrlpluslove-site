#!/usr/bin/env node
// EXIT DOOR: read-only HTTP smoke checks. No secret, login or payment requests.
const hosts = process.argv.slice(2);
const targets = hosts.length ? hosts : [
  "https://www.ctrlpluslove.com",
  "https://ctrlpluslove-site-production.up.railway.app",
];
const routes = [
  { path: "/", marker: /instruments for human judgment/i, html: true },
  { path: "/savannah/", marker: /Savannah/i, html: true },
  { path: "/pricing/", marker: /pricing|decision|ctrl\+love/i, html: true },
  { path: "/manifest.webmanifest", html: false },
];
let errors = 0;
for (const target of targets) {
  let origin;
  try {
    const parsed = new URL(target);
    if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash) throw new Error("Use an HTTPS origin only");
    origin = parsed.origin;
  } catch (error) {
    console.error("INVALID TARGET", target, error.message);
    errors++;
    continue;
  }
  for (const route of routes) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(new URL(route.path, origin), {
        signal: controller.signal, redirect: "follow",
        headers: { "User-Agent": "ctrl-love-exit-door-readonly-smoke/1" },
        cache: "no-store",
      });
      const finalUrl = new URL(response.url);
      if (finalUrl.protocol !== "https:" || !response.ok) throw new Error("HTTP " + response.status + " at " + finalUrl.origin);
      const type = response.headers.get("content-type") || "";
      if (route.html && !type.includes("text/html")) throw new Error("Expected HTML, got " + type);
      if (route.marker && !(route.marker.test((await response.text()).slice(0, 300000)))) throw new Error("Expected page marker absent");
      console.log("PASS", origin, route.path, response.status, finalUrl.origin === origin ? "" : "redirected to " + finalUrl.origin);
    } catch (error) {
      errors++;
      console.error("FAIL", origin, route.path, error.message);
    } finally {
      clearTimeout(timer);
    }
  }
}
console.log(errors ? `EXIT DOOR HTTP smoke failed (${errors} checks)` : "EXIT DOOR HTTP smoke passed. Voice, login, payments and data restore NOT tested.");
process.exitCode = errors ? 1 : 0;

