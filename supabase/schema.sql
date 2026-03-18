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
