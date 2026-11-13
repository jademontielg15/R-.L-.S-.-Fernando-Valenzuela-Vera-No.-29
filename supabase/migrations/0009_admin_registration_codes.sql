create table if not exists public.admin_registration_codes (
  token_hash text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
  email text not null check (email = lower(btrim(email))),
  created_at timestamp with time zone not null default now(),
  expires_at timestamp with time zone not null,
  used_at timestamp with time zone,
  check (expires_at > created_at)
);

create index if not exists admin_registration_codes_email_idx
  on public.admin_registration_codes (email);

alter table public.admin_registration_codes enable row level security;
revoke all on public.admin_registration_codes from public, anon, authenticated;
grant all on public.admin_registration_codes to service_role;
