create table if not exists public.properties (
  id bigint primary key,
  type integer not null,
  house_type text not null default 'Rumah',
  payment_method text not null default 'Cash Bertahap',
  title text not null,
  price bigint not null,
  location text not null,
  beds integer not null default 0,
  baths integer not null default 0,
  sqft numeric not null default 0,
  image text not null,
  gallery text[] not null default '{}',
  tag text not null,
  description text not null default '',
  agent text not null default ''
);

alter table public.properties
  add column if not exists payment_method text not null default 'Cash Bertahap';

alter table public.properties enable row level security;
grant select on public.properties to anon, authenticated;

drop policy if exists "Anyone can read properties" on public.properties;
create policy "Anyone can read properties"
  on public.properties
  for select
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';