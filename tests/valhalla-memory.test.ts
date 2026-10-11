import test from "node:test";
import assert from "node:assert/strict";
import {parseMemoryInput} from "../src/lib/valhalla/memory-policy.ts";
test("requires explicit consent",()=>assert.equal(parseMemoryInput({kind:"outcome",note:"Pilot succeeded",observedAt:"2026-10-11",consent:false}),null));
test("accepts bounded observable outcome",()=>assert.equal(parseMemoryInput({kind:"outcome",note:"Measured result",observedAt:"2026-10-11",consent:true})?.kind,"outcome"));
test("rejects empty entry or future event",()=>{assert.equal(parseMemoryInput({kind:"outcome",note:"",observedAt:"2026-10-11",consent:true}),null);assert.equal(parseMemoryInput({kind:"outcome",note:"Future",observedAt:"2099-01-01",consent:true}),null)});

test("rejects calendar-impossible dates",()=>{
 assert.equal(parseMemoryInput({kind:"outcome",note:"Claim",observedAt:"2026-02-30",consent:true}),null);
 assert.equal(parseMemoryInput({kind:"outcome",note:"Claim",observedAt:"2026-13-01",consent:true}),null);
});
test("bounds provenance and preserves source reference",()=>{
 const input={kind:"opposition",note:"Buyer objects",observedAt:"2026-10-11",consent:true,sourceReference:"buyer-interview-001"};
 assert.equal(parseMemoryInput(input)?.sourceReference,"buyer-interview-001");
 assert.equal(parseMemoryInput({...input,sourceReference:"x".repeat(1001)}),null);
});
