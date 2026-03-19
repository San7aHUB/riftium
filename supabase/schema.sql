-- Tabella collezione carte
create table if not exists public.cards (
  id          uuid primary key default gen_random_uuid(),
  scryfall_id text unique not null,
  name        text not null,
  mana_cost   text,
  type_line   text,
  rarity      text,
  set_code    text,
  set_name    text,
  image_url   text,
  oracle_text text,
  power       text,
  toughness   text,
  price_usd   text,
  created_at  timestamptz default now()
);

-- Indici per ricerca veloce
create index if not exists cards_name_idx    on public.cards (name);
create index if not exists cards_rarity_idx  on public.cards (rarity);
create index if not exists cards_created_idx on public.cards (created_at desc);

-- RLS: chiunque può leggere, inserire e cancellare (puoi restringere dopo)
alter table public.cards enable row level security;

create policy "public read"   on public.cards for select using (true);
create policy "public insert" on public.cards for insert with check (true);
create policy "public delete" on public.cards for delete using (true);

-- ── News ────────────────────────────────────────────────────────
create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  excerpt      text,
  content      text,
  image_url    text,
  category     text not null default 'general',
  published_at timestamptz not null default now(),
  created_at   timestamptz default now()
);

create index if not exists news_slug_idx      on public.news (slug);
create index if not exists news_published_idx on public.news (published_at desc);
create index if not exists news_category_idx  on public.news (category);

alter table public.news enable row level security;

create policy "news public read"   on public.news for select using (published_at <= now());
create policy "news auth insert"   on public.news for insert with check (auth.role() = 'authenticated');
create policy "news auth update"   on public.news for update  using (auth.role() = 'authenticated');
create policy "news auth delete"   on public.news for delete  using (auth.role() = 'authenticated');
