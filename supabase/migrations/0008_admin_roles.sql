create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'super_admin')),
  created_at timestamp with time zone not null default now()
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
grant all on public.admin_users to service_role;

create table if not exists public.galeria_imagenes (
  id uuid primary key default gen_random_uuid(),
  archivo_path text not null unique,
  titulo text not null,
  alt text not null,
  descripcion text,
  categoria text not null check (categoria in ('eventos', 'fraternidad', 'convivencias')),
  visible boolean not null default false,
  creado_en timestamp with time zone not null default now()
);

alter table public.galeria_imagenes enable row level security;
revoke all on public.galeria_imagenes from anon, authenticated;
grant select on public.galeria_imagenes to anon, authenticated;
grant insert, update, delete on public.galeria_imagenes to authenticated;
grant all on public.galeria_imagenes to service_role;

update public.documentos
set archivo_path = substr(archivo_path, length('pdfs-institucionales/') + 1)
where archivo_path like 'pdfs-institucionales/%';

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and role in ('admin', 'super_admin')
  );
$$;

create or replace function public.is_site_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and role = 'super_admin'
  );
$$;

revoke all on function public.is_site_admin() from public, anon;
revoke all on function public.is_site_super_admin() from public, anon;
grant execute on function public.is_site_admin() to authenticated, service_role;
grant execute on function public.is_site_super_admin() to authenticated, service_role;

create policy "admin_users_select_self_or_super_admin"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_site_super_admin()));

create policy "galeria_imagenes_select_publicas"
  on public.galeria_imagenes
  for select
  to anon, authenticated
  using (visible);

create policy "galeria_imagenes_select_admin"
  on public.galeria_imagenes
  for select
  to authenticated
  using ((select public.is_site_admin()));

create policy "galeria_imagenes_insert_admin"
  on public.galeria_imagenes
  for insert
  to authenticated
  with check ((select public.is_site_admin()));

create policy "galeria_imagenes_update_admin"
  on public.galeria_imagenes
  for update
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

create policy "galeria_imagenes_delete_admin"
  on public.galeria_imagenes
  for delete
  to authenticated
  using ((select public.is_site_admin()));

drop policy if exists "documentos_select_admin" on public.documentos;
drop policy if exists "documentos_insert_admin" on public.documentos;
drop policy if exists "documentos_update_admin" on public.documentos;
drop policy if exists "documentos_delete_admin" on public.documentos;

create policy "documentos_select_admin"
  on public.documentos
  for select
  to authenticated
  using ((select public.is_site_admin()));

create policy "documentos_insert_admin"
  on public.documentos
  for insert
  to authenticated
  with check ((select public.is_site_admin()));

create policy "documentos_update_admin"
  on public.documentos
  for update
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

create policy "documentos_delete_admin"
  on public.documentos
  for delete
  to authenticated
  using ((select public.is_site_admin()));

drop policy if exists "solicitudes_select_admin" on public.solicitudes_ingreso;
drop policy if exists "solicitudes_update_admin" on public.solicitudes_ingreso;
drop policy if exists "solicitudes_delete_admin" on public.solicitudes_ingreso;

create policy "solicitudes_select_admin"
  on public.solicitudes_ingreso
  for select
  to authenticated
  using ((select public.is_site_admin()));

create policy "solicitudes_update_admin"
  on public.solicitudes_ingreso
  for update
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

create policy "solicitudes_delete_admin"
  on public.solicitudes_ingreso
  for delete
  to authenticated
  using ((select public.is_site_admin()));

drop policy if exists "storage_pdfs_admin_read" on storage.objects;
drop policy if exists "storage_pdfs_admin_insert" on storage.objects;
drop policy if exists "storage_pdfs_admin_update" on storage.objects;
drop policy if exists "storage_pdfs_admin_delete" on storage.objects;

create policy "storage_pdfs_admin_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'pdfs-institucionales'
    and (select public.is_site_admin())
  );

create policy "storage_pdfs_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'pdfs-institucionales'
    and (select public.is_site_admin())
  );

create policy "storage_pdfs_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'pdfs-institucionales'
    and (select public.is_site_admin())
  )
  with check (
    bucket_id = 'pdfs-institucionales'
    and (select public.is_site_admin())
  );

create policy "storage_pdfs_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'pdfs-institucionales'
    and (select public.is_site_admin())
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'imagenes-galeria',
  'imagenes-galeria',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "storage_galeria_admin_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'imagenes-galeria'
    and (select public.is_site_admin())
  );

create policy "storage_galeria_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'imagenes-galeria'
    and (select public.is_site_admin())
  );

create policy "storage_galeria_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'imagenes-galeria'
    and (select public.is_site_admin())
  )
  with check (
    bucket_id = 'imagenes-galeria'
    and (select public.is_site_admin())
  );

create policy "storage_galeria_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'imagenes-galeria'
    and (select public.is_site_admin())
  );

create or replace function public.prevent_last_super_admin_removal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'super_admin'
    and (tg_op = 'DELETE' or new.role <> 'super_admin') then
    perform pg_advisory_xact_lock(hashtext('admin_super_admin_roles'));

    if not exists (
      select 1
      from public.admin_users
      where role = 'super_admin'
        and user_id <> old.user_id
    ) then
      raise exception 'Cannot remove the last super administrator';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger prevent_last_super_admin_removal
  before update or delete on public.admin_users
  for each row
  execute function public.prevent_last_super_admin_removal();
