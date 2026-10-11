# Valhalla Decision Memory prototype
Feature flag VALHALLA_MEMORY_ENABLED defaults off. This append/read implementation is scoped to a fulfilled order and its 256-bit private token. It deliberately cannot rewrite past entries, score evidence, or mark approvals.
This is not verified human identity: a stolen token gives access. Do not enable in production until authenticated customer identity, rate limits, consent withdrawal, export/deletion, tenancy boundaries, retention and audit controls are implemented and tested. Drafts have bearer tokens, not managed login or password recovery. No database migration was applied.
The instrument receipt remains a historical snapshot; later outcomes are separate timestamped append-only records.
