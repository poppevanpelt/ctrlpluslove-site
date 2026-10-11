import test from "node:test";
import assert from "node:assert/strict";
import { summarizeReality } from "../src/lib/valhalla/reality-memory.ts";
test("old decision is frozen and narrative remains nonquantitative",()=>{
 const r={title:"Pilot",promise:"Improve handoffs",created_at:"2026-10-11T10:00:00Z",criteria:[{name:"Evidence",weight:100}],entries:[{grade:3}],gates:[true,false,false]};
 const m=[{id:"entry-1",item_type:"outcome",content:{note:"Less waiting",observedAt:"2026-10-11"},created_at:"2026-10-11T11:00:00Z"}];
 const x=summarizeReality(r as never,m);
 assert.equal(x.original.score,60);
 assert.equal(x.observations[0].comparison.difference,null);
 assert.equal(x.observations[0].note,"Less waiting");
});
