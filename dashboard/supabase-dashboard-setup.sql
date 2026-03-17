-- Dashboard password + placeholder content tables
create table if not exists public.dashboard_passwords (
  id bigint generated always as identity primary key,
  password text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.dashboard_content (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Vendor credentials table for future API integrations
create table if not exists public.vendor_credentials (
  id bigint generated always as identity primary key,
  vendor_name text not null unique,
  api_key text not null,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.dashboard_passwords (password, is_active)
select 'grandson2025', true
where not exists (
  select 1 from public.dashboard_passwords where is_active = true
);
