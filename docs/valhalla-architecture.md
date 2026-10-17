# Savannah OS — Valhalla / gated implementation

## Production isolation
PR #158 remains a draft. The existing Savannah speech routes, portrait logic, audio, Vapi configuration and production entrypoint are not changed by this payment slice.

## Current implemented slice
- Savannah utterance → CONVICTION context prefill (PR #158; never evidence grades or gates).
- POST /api/valhalla/checkout creates a Stripe-hosted checkout for the server-controlled CONVICTION price. Disabled unless VALHALLA_PAYMENTS_ENABLED=true.
- GET /api/valhalla/entitlement independently verifies completed, paid Stripe checkout and the expected line item, server-side.
- POST /api/valhalla/stripe-webhook verifies signed webhook payloads with a 5-minute tolerance. It does NOT yet fulfill an order.
- /valhalla/delivery shows verified entitlement without claiming a deliverable has been sent.

## Server configuration (never NEXT_PUBLIC)
STRIPE_SECRET_KEY
STRIPE_PRICE_CONVICTION
STRIPE_WEBHOOK_SECRET
VALHALLA_PAYMENTS_ENABLED=true (only after end-to-end tests)
NEXT_PUBLIC_SITE_URL (optional, server read; defaults to canonical site)

## Mandatory before taking real payment
1. Create durable order/event store with uniqueness on Stripe event ID, checkout session ID, and order ID.
2. On webhook, retrieve Checkout Session and line items from Stripe, match expected instrument/price, and atomically persist paid state.
3. Implement idempotent fulfillment jobs, retry/dead-letter handling, and accessible delivery artifacts.
4. Add authenticated Decision Memory scoped to the purchasing organization, consent, retention and deletion/export controls; do not store payment card data or full voice transcripts by default.
5. Build checkout entry UI only after completed delivery and refund/support path work end-to-end.
6. Test invalid/replayed webhook signatures; delayed/asynchronous payments; duplicate events; wrong price; refund/dispute; missing secrets; Stripe downtime; repeat fulfillment; audio and browser Savannah smoke tests.
7. Observe all deploy checks and use preview/staging before enabling the feature flag.

## Invariants
- The LLM cannot authorize payments, prices, evidence scores or delivery.
- Client-side success redirects are not proof of payment.
- Decision Memory must distinguish user assertions, supported evidence, contradictory evidence and instrument recommendations.
- A paid diagnostic is not the same as CEO approval, commercial impact or predictive validity.
