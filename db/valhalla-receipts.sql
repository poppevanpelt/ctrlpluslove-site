-- Additive draft migration, NOT deployed. Apply after db/valhalla.sql.
create table if not exists valhalla.receipt_drafts (
 order_id uuid primary key,
 access_hash text not null,
 assessment jsonb not null,
 created_at timestamptz not null default now()
);
create table if not exists valhalla.receipt_artifacts (
 order_id uuid primary key references valhalla.orders(order_id),
 receipt_text text not null,
 created_at timestamptz not null default now()
);
revoke all on valhalla.receipt_drafts, valhalla.receipt_artifacts from public;
-- Token-based access is bearer access, NOT identity authentication.
-- For production, use short-lived identity-bound access with rate limits, audit logging and a recovery mechanism.
