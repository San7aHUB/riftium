-- ── Cards ────────────────────────────────────────────────────────────────────
create table if not exists public.cards (
  id          text primary key,          -- es. "OGN-179"
  slug        text unique not null,
  name        text not null,
  effect      text,
  flavor      text,
  color       text[],                    -- es. ["Chaos"], ["Calm","Fury"]
  cost        integer,
  type        text,                      -- Spell | Unit | Gear | ...
  supertype   text,                      -- Champion | ""
  might       integer,
  tags        text[],                    -- es. ["Mech","Piltover"]
  set_name    text,
  rarity      text,
  cycle       text,
  image_url   text,
  promo       boolean default false,
  has_normal  boolean default true,
  has_foil    boolean default false,
  cm_url      text,
  cm_id       bigint,
  updated_at  timestamptz default now()
);

create index if not exists cards_name_idx      on public.cards using gin (to_tsvector('english', name));
create index if not exists cards_type_idx      on public.cards (type);
create index if not exists cards_rarity_idx    on public.cards (rarity);
create index if not exists cards_set_idx       on public.cards (set_name);
create index if not exists cards_color_idx     on public.cards using gin (color);
create index if not exists cards_tags_idx      on public.cards using gin (tags);
create index if not exists cards_cost_idx      on public.cards (cost);

alter table public.cards enable row level security;
create policy "cards public read" on public.cards for select using (true);
create policy "cards service write" on public.cards for all using (auth.role() = 'service_role');

-- ── Prices ───────────────────────────────────────────────────────────────────
create table if not exists public.card_prices (
  id              bigserial primary key,
  card_id         text not null references public.cards(id) on delete cascade,
  price           numeric(10,4),
  foil_price      numeric(10,4),
  delta_1d        numeric(10,4),
  delta_1d_foil   numeric(10,4),
  delta_7d        numeric(10,4),
  delta_7d_foil   numeric(10,4),
  cm_price        numeric(10,4),
  cm_foil_price   numeric(10,4),
  recorded_at     timestamptz default now()
);

create index if not exists prices_card_idx      on public.card_prices (card_id);
create index if not exists prices_recorded_idx  on public.card_prices (recorded_at desc);

alter table public.card_prices enable row level security;
create policy "prices public read"   on public.card_prices for select using (true);
create policy "prices service write" on public.card_prices for all using (auth.role() = 'service_role');

-- ── Decks ────────────────────────────────────────────────────────────────────
create table if not exists public.decks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  is_public   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.decks enable row level security;
create policy "decks owner read"   on public.decks for select using (is_public or auth.uid() = user_id);
create policy "decks owner write"  on public.decks for all   using (auth.uid() = user_id);

-- ── Deck cards ───────────────────────────────────────────────────────────────
create table if not exists public.deck_cards (
  id          bigserial primary key,
  deck_id     uuid not null references public.decks(id) on delete cascade,
  card_id     text not null references public.cards(id),
  quantity    smallint not null default 1 check (quantity between 1 and 4),
  is_sideboard boolean default false
);

create index if not exists deck_cards_deck_idx on public.deck_cards (deck_id);

alter table public.deck_cards enable row level security;
create policy "deck_cards read"  on public.deck_cards for select using (
  exists (select 1 from public.decks d where d.id = deck_id and (d.is_public or d.user_id = auth.uid()))
);
create policy "deck_cards write" on public.deck_cards for all using (
  exists (select 1 from public.decks d where d.id = deck_id and d.user_id = auth.uid())
);

-- ── News ─────────────────────────────────────────────────────────────────────
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

create index if not exists news_published_idx on public.news (published_at desc);

alter table public.news enable row level security;
create policy "news public read"  on public.news for select using (published_at <= now());
create policy "news auth write"   on public.news for all    using (auth.role() = 'authenticated');
