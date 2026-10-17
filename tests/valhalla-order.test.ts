import test from "node:test";
import assert from "node:assert/strict";
import { validatedOrder, deliveryTransition } from "../src/lib/valhalla/order-policy.ts";
const id="fe28114d-1cb5-4f49-9c36-f9afaa821cdc";
const s={id:"cs_test_123",mode:"payment",status:"complete",payment_status:"paid",client_reference_id:id,metadata:{instrument:"conviction",order_id:id},currency:"eur",amount_total:49500};
const items=[{price:{id:"price_expected"},quantity:1}];
test("paid expected price yields order",()=>assert.equal(validatedOrder(s,items,"price_expected")?.order_id,id));
test("unpaid, wrong item and mismatched order fail",()=>{
 assert.equal(validatedOrder({...s,payment_status:"unpaid"},items,"price_expected"),null);
 assert.equal(validatedOrder(s,items,"price_wrong"),null);
 assert.equal(validatedOrder({...s,client_reference_id:"wrong"},items,"price_expected"),null);
});
test("completed delivery is terminal",()=>{
 assert.equal(deliveryTransition("complete","processing"),false);
 assert.equal(deliveryTransition("failed","processing"),true);
});
