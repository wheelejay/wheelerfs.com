-- Wheeler Food Safety: certificate portal database setup
--
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run again: it only creates what is missing and replaces the
-- functions and policies with the versions below.
--
-- Who can see what:
--   * Admins (rows in public.admins) can read and change everything.
--   * A signed-in customer user sees only the customers their email is listed
--     under in public.customer_members, and only those customers' certificates
--     and PDFs.
--   * Anyone (signed in or not) can call verify_certificate(code), which
--     returns a few non-sensitive facts about one certificate. The 16+
--     character random code printed in the QR is what makes this safe.

-- ---------------------------------------------------------------- tables

create table if not exists public.admins (
  email text primary key check (email = lower(email))
);

create table if not exists public.customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_members (
  customer_id uuid not null references public.customers (id) on delete cascade,
  email       text not null check (email = lower(email)),
  created_at  timestamptz not null default now(),
  primary key (customer_id, email)
);

create table if not exists public.certificates (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.customers (id) on delete restrict,
  cert_no         text not null unique,
  verify_code     text not null unique check (length(verify_code) >= 16),
  validation_date date not null,
  next_due        date,
  manufacturer    text,
  model           text,
  serial          text,
  asset_id        text,
  as_found        text,
  as_left         text,
  status          text not null default 'valid' check (status in ('valid', 'superseded', 'revoked')),
  pdf_path        text,
  data            jsonb,            -- everything entered in the generator, for reissuing
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists certificates_customer_idx on public.certificates (customer_id, validation_date desc);
create index if not exists customer_members_email_idx on public.customer_members (email);

-- ---------------------------------------------------------------- helpers
-- SECURITY DEFINER so the policies below can look up admins/members without
-- giving users read access to those tables (and without policy recursion).

create or replace function public.current_email() returns text
language sql stable
as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) $$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where email = public.current_email()) $$;

create or replace function public.my_customer_ids() returns setof uuid
language sql stable security definer set search_path = public
as $$ select customer_id from public.customer_members where email = public.current_email() $$;

-- Public QR check: only facts that prove the paper is genuine. No customer name, no results.
create or replace function public.verify_certificate(code text)
returns table (cert_no text, validation_date date, next_due date, manufacturer text,
               model text, serial text, status text)
language sql stable security definer set search_path = public
as $$
  select c.cert_no, c.validation_date, c.next_due, c.manufacturer, c.model, c.serial, c.status
  from public.certificates c
  where length(code) >= 16 and c.verify_code = code
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists certificates_touch on public.certificates;
create trigger certificates_touch before update on public.certificates
  for each row execute function public.touch_updated_at();

revoke all on function public.is_admin() from public;
revoke all on function public.my_customer_ids() from public;
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.my_customer_ids() to authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- ---------------------------------------------------------------- row level security

alter table public.admins           enable row level security;
alter table public.customers        enable row level security;
alter table public.customer_members enable row level security;
alter table public.certificates     enable row level security;

-- admins: no policies → nobody can read or change it through the API.
-- Add or remove admins here in the SQL Editor only.

drop policy if exists "customers: members read"  on public.customers;
drop policy if exists "customers: admin all"     on public.customers;
create policy "customers: members read" on public.customers for select to authenticated
  using (id in (select public.my_customer_ids()));
create policy "customers: admin all" on public.customers for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "members: read own"  on public.customer_members;
drop policy if exists "members: admin all" on public.customer_members;
create policy "members: read own" on public.customer_members for select to authenticated
  using (email = public.current_email());
create policy "members: admin all" on public.customer_members for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "certificates: members read" on public.certificates;
drop policy if exists "certificates: admin all"    on public.certificates;
create policy "certificates: members read" on public.certificates for select to authenticated
  using (customer_id in (select public.my_customer_ids()));
create policy "certificates: admin all" on public.certificates for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- PDF storage
-- Private bucket; files are stored as <customer_id>/<cert_no>.pdf and are only
-- reachable through short-lived signed links, which the policies below gate.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificates', 'certificates', false, 5242880, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
  allowed_mime_types = array['application/pdf'];

drop policy if exists "certificate pdfs: members read" on storage.objects;
drop policy if exists "certificate pdfs: admin all"    on storage.objects;
create policy "certificate pdfs: members read" on storage.objects for select to authenticated
  using (bucket_id = 'certificates'
         and (storage.foldername(name))[1] in (select id::text from public.my_customer_ids() as t(id)));
create policy "certificate pdfs: admin all" on storage.objects for all to authenticated
  using (bucket_id = 'certificates' and public.is_admin())
  with check (bucket_id = 'certificates' and public.is_admin());

-- ---------------------------------------------------------------- you

insert into public.admins (email) values ('jordan@wheelerfs.com') on conflict do nothing;
