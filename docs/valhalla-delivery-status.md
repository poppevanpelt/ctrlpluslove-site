# Valhalla delivery — implementation checkpoint

Added transactional CONVICTION receipt generation and private-token retrieval:
- Worker locks a paid queued order, loads its persisted assessment, writes a complete text receipt, and updates delivery + order states in one transaction. A rollback leaves the order queued.
- Repeated workers skip already-completed work using the delivery state and row locks.
- Download requires order UUID and the private token established at draft creation; only completed and fulfilled orders return content.
- Both worker and read endpoint are disabled by default through VALHALLA_DELIVERY_ENABLED.

**Important:** this is NOT authenticated customer identity. Possession of a token grants access. Token leakage, lack of recovery, unbounded draft creation and brute-force protections must be addressed before enabling. The checkout code does not yet reserve one checkout session per order. No email delivery has been implemented. No external deployment or database migration has been performed.

Additional blockers:
- Install dependencies and regenerate package lock, run typecheck and tests.
- Apply reviewed migrations to isolated private Postgres and configure secure environment variables.
- Add authenticated customer-scoped sessions and security controls, rate limiting and abuse prevention.
- Establish refund/dispute and delayed payment handling before accepting real payments.
- Perform staging test payment, duplicate webhook tests and production Savannah browser/voice regression.

Never merge or enable production payments on the basis of this checkpoint alone.
