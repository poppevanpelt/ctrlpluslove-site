# CONVICTION receipt gate
Receipt renderer and validator are pure, isolated and independently testable.
Receipt inputs are untrusted until validated; evidence grades are user declared, never generated or raised by Savannah.
This renderer does not send mail, imply scientific predictive validity, or grant entitlement.

Before enabling paid delivery: authenticated customer submission and owner-scoped storage of the receipt; a durable artifact format; an idempotent worker that persists artifact data, grants access, and commits delivery state; secure read endpoint; consented Decision Memory; cancellation/refunds; webhook retries and tests. Never claim a delivery has happened merely from an artifact ID.
