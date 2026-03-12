create table if not exists public.notify_subscriptions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id uuid,
  channel text not null check (channel in ('email', 'sms')),
  email text,
  phone text,
  is_active boolean not null default true,
  constraint notify_contact_check check (
    (channel = 'email' and email is not null and phone is null)
    or
    (channel = 'sms' and phone is not null and email is null)
  )
);

create index if not exists idx_notify_subscriptions_created_at
  on public.notify_subscriptions (created_at desc);

create index if not exists idx_notify_subscriptions_email
  on public.notify_subscriptions (email)
  where email is not null;

create index if not exists idx_notify_subscriptions_phone
  on public.notify_subscriptions (phone)
  where phone is not null;
