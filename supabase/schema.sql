-- IntentFlow Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Intents table ────────────────────────────────────────────────────────────
create table if not exists public.intents (
  id              uuid primary key default uuid_generate_v4(),
  user_address    text not null,
  raw_text        text not null,
  parsed          jsonb not null,
  status          text not null default 'pending'
                  check (status in ('pending', 'active', 'executed', 'failed', 'cancelled')),
  on_chain_hash   text,
  execution_count integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  last_executed_at timestamptz
);

-- Indexes
create index idx_intents_user_address on public.intents(user_address);
create index idx_intents_status on public.intents(status);
create index idx_intents_created_at on public.intents(created_at desc);

-- Row Level Security
alter table public.intents enable row level security;

-- Allow anyone to read (public intents are on-chain anyway)
create policy "Intents are publicly readable"
  on public.intents for select
  using (true);

-- Only the owner can insert/update/delete
create policy "Users can insert their own intents"
  on public.intents for insert
  with check (true); -- Relaxed for demo; tighten with auth in production

create policy "Users can update their own intents"
  on public.intents for update
  using (true);

-- ── Executions table ─────────────────────────────────────────────────────────
create table if not exists public.executions (
  id          uuid primary key default uuid_generate_v4(),
  intent_id   uuid not null references public.intents(id) on delete cascade,
  tx_hash     text,
  status      text not null check (status in ('success', 'failed', 'skipped')),
  error       text,
  gas_used    text,
  details     jsonb,
  executed_at timestamptz not null default now()
);

create index idx_executions_intent_id on public.executions(intent_id);
create index idx_executions_executed_at on public.executions(executed_at desc);

alter table public.executions enable row level security;

create policy "Executions are publicly readable"
  on public.executions for select
  using (true);

create policy "Service can insert executions"
  on public.executions for insert
  with check (true);

-- ── Helper function ───────────────────────────────────────────────────────────
create or replace function increment_execution_count(intent_id uuid)
returns void as $$
  update public.intents
  set execution_count = execution_count + 1,
      last_executed_at = now(),
      updated_at = now()
  where id = intent_id;
$$ language sql;

-- ── Auto-update updated_at trigger ───────────────────────────────────────────
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger intents_updated_at
  before update on public.intents
  for each row execute function update_updated_at_column();
