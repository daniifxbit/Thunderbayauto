-- Thunder Bay Auto — catalogue de pièces.
-- Structure issue de la maquette Claude Design : 12 systèmes, aucune pièce au départ.
-- Lecture publique (le site client), écriture réservée à un compte authentifié (l'admin).

create extension if not exists pgcrypto;

/* ---------------------------------------------------------------- tables ---- */

create table if not exists public.categories (
  id         text primary key,
  code       text        not null,
  name       text        not null,
  vehicles   text[]      not null default '{}',
  position   integer     not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_vehicles_valides
    check (vehicles <@ array['Auto', 'Camion', 'Moto', 'Bateau']::text[])
);

create table if not exists public.parts (
  id          uuid primary key default gen_random_uuid(),
  seq         bigint generated always as identity,
  ref         text        not null default '',
  name        text        not null,
  cat_id      text        references public.categories (id) on delete restrict,
  vehicles    text[]      not null default '{}',
  state       text        not null default '',
  oem         text        not null default 'À renseigner',
  price_new   text        not null default 'À renseigner',
  price_used  text        not null default 'À renseigner',
  fit         text        not null default 'Selon véhicule, moteur et année',
  stock       text        not null default '',
  image       text        not null default '',
  description text        not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint parts_nom_non_vide check (length(btrim(name)) > 0),
  constraint parts_vehicles_valides
    check (vehicles <@ array['Auto', 'Camion', 'Moto', 'Bateau']::text[]),
  -- Une image est soit un fichier du bucket, soit une adresse http(s) collée.
  constraint parts_image_valide
    check (image = '' or image ~ '^https?://')
);

-- Les pièces les plus récentes en tête : le tableau d'administration empile les
-- ajouts en haut, comme la maquette.
create index if not exists parts_seq_desc on public.parts (seq desc);
create index if not exists parts_cat_id on public.parts (cat_id);

create table if not exists public.settings (
  key        text primary key,
  value      text        not null default '',
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values ('whatsapp', '')
  on conflict (key) do nothing;

/* -------------------------------------------------------------- triggers ---- */

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists parts_set_updated_at on public.parts;
create trigger parts_set_updated_at before update on public.parts
  for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- Horodatage global affiché dans l'en-tête de l'administration
-- (« DERNIÈRE MODIFICATION — … »), y compris après une suppression.
create or replace function public.touch_catalogue() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.settings (key, value, updated_at)
       values ('catalogue_updated_at', now()::text, now())
  on conflict (key) do update
          set value = excluded.value, updated_at = excluded.updated_at;
  return null;
end $$;

drop trigger if exists parts_touch_catalogue on public.parts;
create trigger parts_touch_catalogue after insert or update or delete on public.parts
  for each statement execute function public.touch_catalogue();

drop trigger if exists categories_touch_catalogue on public.categories;
create trigger categories_touch_catalogue after insert or update or delete on public.categories
  for each statement execute function public.touch_catalogue();

-- Sur les réglages, on ne se déclenche pas sur la ligne d'horodatage elle-même.
drop trigger if exists settings_touch_catalogue on public.settings;
create trigger settings_touch_catalogue after insert or update on public.settings
  for each row when (new.key <> 'catalogue_updated_at')
  execute function public.touch_catalogue();

/* ------------------------------------------------------ administrateurs ---- */

-- Être authentifié ne suffit pas : seuls les comptes inscrits ici écrivent.
-- Pour habiliter un compte créé dans Authentication :
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'admin@exemple.ca';
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "un administrateur se voit lui-meme" on public.admins;
create policy "un administrateur se voit lui-meme"
  on public.admins for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

/* ------------------------------------------------------------------ RLS ---- */

alter table public.categories enable row level security;
alter table public.parts      enable row level security;
alter table public.settings   enable row level security;

drop policy if exists "categories lisibles par tous" on public.categories;
create policy "categories lisibles par tous"
  on public.categories for select using (true);

drop policy if exists "categories gerees par un administrateur" on public.categories;
create policy "categories gerees par un administrateur"
  on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "pieces lisibles par tous" on public.parts;
create policy "pieces lisibles par tous"
  on public.parts for select using (true);

drop policy if exists "pieces gerees par un administrateur" on public.parts;
create policy "pieces gerees par un administrateur"
  on public.parts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reglages lisibles par tous" on public.settings;
create policy "reglages lisibles par tous"
  on public.settings for select using (true);

drop policy if exists "reglages geres par un administrateur" on public.settings;
create policy "reglages geres par un administrateur"
  on public.settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

/* -------------------------------------------------------------- stockage ---- */

insert into storage.buckets (id, name, public)
     values ('pieces', 'pieces', true)
on conflict (id) do update set public = true;

drop policy if exists "images de pieces lisibles par tous" on storage.objects;
create policy "images de pieces lisibles par tous"
  on storage.objects for select using (bucket_id = 'pieces');

drop policy if exists "images de pieces deposees par un administrateur" on storage.objects;
create policy "images de pieces deposees par un administrateur"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'pieces' and public.is_admin());

drop policy if exists "images de pieces remplacees par un administrateur" on storage.objects;
create policy "images de pieces remplacees par un administrateur"
  on storage.objects for update to authenticated
  using (bucket_id = 'pieces' and public.is_admin())
  with check (bucket_id = 'pieces' and public.is_admin());

drop policy if exists "images de pieces supprimees par un administrateur" on storage.objects;
create policy "images de pieces supprimees par un administrateur"
  on storage.objects for delete to authenticated
  using (bucket_id = 'pieces' and public.is_admin());

/* ------------------------------------------------ structure du catalogue ---- */

create or replace function public.seed_categories() returns void
language sql security invoker as $$
  insert into public.categories (id, code, name, vehicles, position) values
    ('c01', '01', 'Moteur & distribution',              array['Auto','Camion','Moto','Bateau'],  1),
    ('c02', '02', 'Transmission',                       array['Auto','Camion','Moto','Bateau'],  2),
    ('c03', '03', 'Freinage',                           array['Auto','Camion','Moto'],           3),
    ('c04', '04', 'Suspension & direction',             array['Auto','Camion','Moto','Bateau'],  4),
    ('c05', '05', 'Électricité & électronique',         array['Auto','Camion','Moto','Bateau'],  5),
    ('c06', '06', 'Refroidissement & climatisation',    array['Auto','Camion','Bateau'],         6),
    ('c07', '07', 'Carrosserie, éclairage & habitacle', array['Auto','Camion','Moto','Bateau'],  7),
    ('c08', '08', 'Alimentation & échappement',         array['Auto','Camion','Moto','Bateau'],  8),
    ('c09', '09', 'Roues, pneus & train roulant',       array['Auto','Camion','Moto'],           9),
    ('c10', '10', 'Pièces spécifiques camions',         array['Camion'],                        10),
    ('c11', '11', 'Pièces spécifiques motos',           array['Moto'],                          11),
    ('c12', '12', 'Pièces spécifiques bateaux',         array['Bateau'],                        12)
  on conflict (id) do nothing;
$$;

select public.seed_categories();

-- « Réinitialiser depuis le catalogue » : les 12 catégories reviennent, les pièces
-- partent. Le numéro WhatsApp est un réglage du site, il est conservé.
create or replace function public.reset_catalogue() returns void
language plpgsql security invoker as $$
begin
  delete from public.parts;
  delete from public.categories;
  perform public.seed_categories();
end $$;

revoke all on function public.reset_catalogue() from anon;
grant execute on function public.reset_catalogue() to authenticated;
