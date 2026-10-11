import test from "node:test";
import assert from "node:assert/strict";
import {parseMemoryInput} from "../src/lib/valhalla/memory-policy.ts";
test("requires explicit consent",()=>assert.equal(parseMemoryInput({kind:"outcome",note:"Pilot succeeded",observedAt:"2026-10-11",consent:false}),null));
test("accepts bounded observable outcome",()=>assert.equal(parseMemoryInput({kind:"outcome",note:"Measured result",observedAt:"2026-10-11",consent:true})?.kind,"outcome"));
test("rejects empty entry or future event",()=>{assert.equal(parseMemoryInput({kind:"outcome",note:"",observedAt:"2026-10-11",consent:true}),null);assert.equal(parseMemoryInput({kind:"outcome",note:"Future",observedAt:"2099-01-01",consent:true}),null)});
