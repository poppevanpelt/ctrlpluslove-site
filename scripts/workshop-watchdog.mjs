// THE SELF-REPAIRING WORKSHOP - non-invasive production checks.
// Run with: node scripts/workshop-watchdog.mjs
// Override target with WORKSHOP_BASE_URL. Never send credentials or personal data.
const base = (process.env.WORKSHOP_BASE_URL || "https://www.ctrlpluslove.com").replace(/\/$/, "");
const checks = [
  { name: "Next.js readiness", path: "/api/health", expect: /"status"\s*:\s*"ready"/ },
  { name: "Savannah page availability", path: "/savannah/", expect: /<html[\s>]/i },
];
const results = [];
for (const check of checks) {
  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(new URL(check.path, base), {
      headers: { "User-Agent": "ctrl-love-workshop-watchdog/0.1", "Cache-Control": "no-cache" },
      redirect: "follow", signal: controller.signal,
    });
    const body = (await response.text()).slice(0, 200000);
    const ok = response.ok && check.expect.test(body);
    results.push({ name: check.name, ok, status: response.status, duration_ms: Date.now() - started,
      reason: ok ? "verified" : "unexpected status or response" });
  } catch (error) {
    results.push({ name: check.name, ok: false, duration_ms: Date.now() - started,
      reason: error?.name === "AbortError" ? "timeout" : "network/request error" });
  } finally {
    clearTimeout(timeout);
  }
}
const report = {
  instrument: "THE SELF-REPAIRING WORKSHOP",
  kind: "read-only availability check",
  checked_at: new Date().toISOString(),
  base, results,
  verified: results.every(item => item.ok),
  limitations: "Checks page and readiness availability only. Cannot verify microphone, real iPhone audio, speech latency, or AI judgment.",
};
console.log(JSON.stringify(report, null, 2));
if (!report.verified) process.exitCode = 1;
