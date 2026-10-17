import assert from 'node:assert/strict';
import test from 'node:test';
import { GET } from '../src/app/api/health/route.ts';
test('health exposes release identity without credential configuration', async () => {
  const previous = process.env.RAILWAY_GIT_COMMIT_SHA;
  try {
    process.env.RAILWAY_GIT_COMMIT_SHA = 'test-release';
    const response = await GET();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { status: 'ok', service: 'ctrlpluslove-site', revision: 'test-release' });
    delete process.env.RAILWAY_GIT_COMMIT_SHA;
    assert.equal((await (await GET()).json()).revision, null);
  } finally {
    if (previous === undefined) delete process.env.RAILWAY_GIT_COMMIT_SHA;
    else process.env.RAILWAY_GIT_COMMIT_SHA = previous;
  }
});
