"use client";

import { useEffect, useState } from "react";

type Status = { entitled: boolean; instrument?: string; order_id?: string };

export default function ValhallaDelivery() {
  const [state, setState] = useState<"checking" | "paid" | "unpaid">("checking");
  const [order, setOrder] = useState("");
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) { setState("unpaid"); return; }
    fetch("/api/valhalla/entitlement?session_id=" + encodeURIComponent(sessionId), { cache: "no-store" })
      .then(async response => ({ ok: response.ok, data: await response.json() as Status }))
      .then(({ ok, data }) => {
        setState(ok && data.entitled ? "paid" : "unpaid");
        if (ok && data.entitled && data.order_id) setOrder(data.order_id);
      }).catch(() => setState("unpaid"));
  }, []);
  return <main id="main-content" style={{ maxWidth: 720, margin: "12vh auto", padding: 32 }}>
    <a href="/">ctrl+love</a>
    <p>VALHALLA / VERIFIED DELIVERY</p>
    <h1>{state === "checking" ? "Checking the payment…" : state === "paid" ? "Payment verified." : "Payment not yet verified."}</h1>
    {state === "paid"
      ? <><p>CONVICTION™ access has been verified with Stripe. Order reference: {order}</p><p>This is a payment receipt checkpoint, not yet automatic instrument fulfillment. Your evidence and score were not altered.</p><a href="/conviction">Open CONVICTION™ →</a></>
      : <><p>No instrument access is granted until the server confirms a completed paid checkout.</p><a href="/conviction">Return to CONVICTION™ →</a></>}
  </main>;
}
