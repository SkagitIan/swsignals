create table if not exists public.notify_subscriptions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid,
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

create index if not exists idx_notify_subscriptions_user_id
  on public.notify_subscriptions (user_id)
  where user_id is not null;

create unique index if not exists ux_notify_subscriptions_email
  on public.notify_subscriptions (email)
  where email is not null;

create unique index if not exists ux_notify_subscriptions_phone
  on public.notify_subscriptions (phone)
  where phone is not null;

create or replace function public.set_notify_subscription_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_notify_subscription_updated_at on public.notify_subscriptions;

create trigger trg_notify_subscription_updated_at
before update on public.notify_subscriptions
for each row
execute function public.set_notify_subscription_updated_at();
