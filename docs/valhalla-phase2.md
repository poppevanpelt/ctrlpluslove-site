# Valhalla phase 2: isolated scaffolding

PR #158 is a draft. These files are NOT deployed. Production Savannah and payments remain unchanged.

- Private Postgres schema draft for unique orders, webhook events, delivery state, and consent-tagged decision memory.
- Pure order validation against a server-selected Stripe price; explicit delivery state transition policy.
- Test fixtures for unpaid/wrong-price/order mismatch and completed delivery safety.

Before real checkout: provision and secure tenant-separated storage, persist and deduplicate signed verified payment events, implement atomic worker claims and idempotent artifact delivery, authenticate entitlement access (Stripe session ID alone is not authentication), enforce Decision Memory consent and deletion, add refund/dispute handling, run build/test/browser/voice regressions. Only then enable checkout.
