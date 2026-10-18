import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";

async function scenario({ healthStatus = 200, savannahStatus = 200, healthBody = '{"status":"ready"}', savannahBody = "<html><body>savannah</body></html>" }) {
  const server = createServer((req, res) => {
    const health = req.url?.startsWith("/api/health");
    res.writeHead(health ? healthStatus : savannahStatus, { "content-type": health ? "application/json" : "text/html" });
    res.end(health ? healthBody : savannahBody);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  try {
    const port = server.address().port;
    const child = spawn(process.execPath, ["scripts/workshop-watchdog.mjs"], {
      env: { ...process.env, WORKSHOP_BASE_URL: `http://127.0.0.1:${port}` },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "", stderr = "";
    child.stdout.setEncoding("utf8").on("data", chunk => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", chunk => { stderr += chunk; });
    const code = await new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", resolve);
    });
    assert.equal(stderr, "");
    return { code, receipt: JSON.parse(stdout) };
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test("healthy routes yield a positive receipt", async () => {
  const { code, receipt } = await scenario({});
  assert.equal(code, 0);
  assert.equal(receipt.verified, true);
  assert.equal(receipt.results.length, 2);
  assert.ok(receipt.results.every(item => item.ok));
});

test("a failed Savannah route makes the check fail independently of readiness", async () => {
  const { code, receipt } = await scenario({ savannahStatus: 503 });
  assert.equal(code, 1);
  assert.equal(receipt.verified, false);
  assert.equal(receipt.results[0].ok, true);
  assert.equal(receipt.results[1].ok, false);
});

test("a misleading HTTP 200 readiness response is rejected", async () => {
  const { code, receipt } = await scenario({ healthBody: '{"status":"broken"}' });
  assert.equal(code, 1);
  assert.equal(receipt.results[0].ok, false);
});

test("a misleading HTTP 200 Savannah error page is rejected", async () => {
  const { code, receipt } = await scenario({ savannahBody: "Something went wrong" });
  assert.equal(code, 1);
  assert.equal(receipt.results[1].ok, false);
});
