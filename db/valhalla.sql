-- PRIVATE Postgres draft schema. NOT applied to any database.
create schema if not exists valhalla;
create table if not exists valhalla.orders (
 order_id uuid primary key,
 stripe_session_id text unique not null,
 instrument text not null check (instrument in ('conviction')),
 state text not null check (state in ('paid','fulfilled','refunded','disputed')),
 currency text not null,
 amount_total bigint not null check (amount_total >= 0),
 created_at timestamptz not null default now()
);
create table if not exists valhalla.payment_events (
 stripe_event_id text primary key,
 event_type text not null,
 stripe_session_id text,
 received_at timestamptz not null default now()
);
create table if not exists valhalla.deliveries (
 order_id uuid primary key references valhalla.orders(order_id),
 state text not null default 'queued' check (state in ('queued','processing','complete','failed')),
 attempts integer not null default 0,
 artifact_id uuid,
 updated_at timestamptz not null default now()
);
create table if not exists valhalla.decision_memory (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references valhalla.orders(order_id),
 actor_id text not null,
 item_type text not null check (item_type in ('claim','evidence','opposition','score','repair','outcome')),
 content jsonb not null,
 source_reference text,
 consent_recorded_at timestamptz not null,
 created_at timestamptz not null default now()
);
revoke all on schema valhalla from public;
revoke all on all tables in schema valhalla from public;
-- Explicit role restrictions, tenant isolation and consent enforcement still required.
