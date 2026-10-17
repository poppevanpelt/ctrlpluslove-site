import test from "node:test";
import assert from "node:assert/strict";
import {validateReceipt,renderReceipt} from "../src/lib/valhalla/receipt.ts";
const good={title:"Pilot",buyer:"CEO",price:"EUR 495",promise:"Reduce waiting",alternative:"Do nothing",entries:Array.from({length:6},()=>({grade:2,source:"Interview",observation:"Small sample"})),gates:[false,false,false]};
test("receipts retain evidence and identify missing gates",()=>{const r=validateReceipt(good);assert.ok(r);const t=renderReceipt(r);assert.match(t,/NOT READY TO APPROVE/);assert.match(t,/Interview/);assert.match(t,/KILL QUESTION/);});
test("rejects invalid grading and gate claims",()=>{assert.equal(validateReceipt({...good,entries:[{grade:9},...good.entries.slice(1)]}),null);assert.equal(validateReceipt({...good,gates:[true,true,"yes"]}),null);});
