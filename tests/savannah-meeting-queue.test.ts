import test from "node:test";
import assert from "node:assert/strict";
import { MeetingQueue } from "../src/app/savannah/meeting-queue.ts";
const tick = () => new Promise(resolve => setImmediate(resolve));

test("listening can queue new segments while an earlier upload is still processing", async () => {
  const received: number[] = [];
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  const queue = new MeetingQueue<number>(async item => { received.push(item); if (item === 1) await held; }, () => {});
  queue.add(1); queue.add(2); queue.add(3);
  assert.equal(queue.pending, 3);
  assert.deepEqual(received, [1]);
  release(); await tick();
  assert.deepEqual(received, [1, 2, 3]);
  assert.equal(queue.pending, 0);
});

test("network failure retains the failed segment and subsequent speech in order for retry", async () => {
  let fail = true;
  const received: string[] = [];
  const queue = new MeetingQueue<string>(async item => { if (fail) throw new Error("Load failed"); received.push(item); }, () => {});
  queue.add("first"); queue.add("second"); await tick();
  assert.equal(queue.paused, true);
  assert.equal(queue.pending, 2);
  fail = false; queue.retry(); await tick();
  assert.deepEqual(received, ["first", "second"]);
  assert.equal(queue.pending, 0);
});

test("leaving the page cancels queued processing", async () => {
  const received: number[] = [];
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  const queue = new MeetingQueue<number>(async item => { received.push(item); await held; }, () => {});
  queue.add(1); queue.add(2); queue.cancel(); release(); await tick(); queue.add(3);
  assert.deepEqual(received, [1]);
  assert.equal(queue.pending, 0);
});
