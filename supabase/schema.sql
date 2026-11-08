-- HueSmart Travel initial schema
-- Run this script in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  category text not null default 'Di tích',
  description text,
  address text,
  image_url text,
  price_text text,
  duration text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  content text,
  created_at timestamptz not null default now(),
  unique(user_id, destination_id)
);

create table if not exists public.trip_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  contact_name text not null,
  contact_email text,
  start_date date,
  duration_days int not null default 1,
  people_count int not null default 1,
  budget text,
  interests text[],
  notes text,
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  description text,
  address text,
  price_text text,
  image_url text,
  contact text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  image_url text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.reviews enable row level security;
alter table public.trip_requests enable row level security;
alter table public.services enable row level security;
alter table public.events enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "Profiles read own or admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());
create policy "Profiles update own" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Destinations public read" on public.destinations
for select using (true);
create policy "Destinations admin insert" on public.destinations
for insert with check (public.is_admin());
create policy "Destinations admin update" on public.destinations
for update using (public.is_admin()) with check (public.is_admin());
create policy "Destinations admin delete" on public.destinations
for delete using (public.is_admin());

create policy "Reviews public read" on public.reviews
for select using (true);
create policy "Users create own reviews" on public.reviews
for insert with check (user_id = auth.uid());
create policy "Users update own reviews" on public.reviews
for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users delete own reviews or admin" on public.reviews
for delete using (user_id = auth.uid() or public.is_admin());

create policy "Users read own trip requests or admin" on public.trip_requests
for select using (user_id = auth.uid() or public.is_admin());
create policy "Anyone submit trip request" on public.trip_requests
for insert with check (user_id is null or user_id = auth.uid());
create policy "Admin update trip requests" on public.trip_requests
for update using (public.is_admin()) with check (public.is_admin());

create policy "Published services public read" on public.services
for select using (is_published = true or public.is_admin());
create policy "Admin insert services" on public.services
for insert with check (public.is_admin());
create policy "Admin update services" on public.services
for update using (public.is_admin()) with check (public.is_admin());
create policy "Admin delete services" on public.services
for delete using (public.is_admin());

create policy "Events public read" on public.events
for select using (true);
create policy "Admin insert events" on public.events
for insert with check (public.is_admin());
create policy "Admin update events" on public.events
for update using (public.is_admin()) with check (public.is_admin());
create policy "Admin delete events" on public.events
for delete using (public.is_admin());

-- After registering your account, grant admin access manually:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL');
