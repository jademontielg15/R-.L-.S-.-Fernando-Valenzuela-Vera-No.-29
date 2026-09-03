-- Crear bucket privado para PDFs
insert into storage.buckets (id, name, public)
values ('pdfs-institucionales', 'pdfs-institucionales', false)
on conflict (id) do nothing;

-- POLICY: Solo usuarios autenticados (admin) pueden acceder al bucket
-- Los visitantes públicos acceden SOLO vía signed URLs generadas por la API
create policy "storage_pdfs_admin_read"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'pdfs-institucionales');

create policy "storage_pdfs_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'pdfs-institucionales');

create policy "storage_pdfs_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'pdfs-institucionales')
  with check (bucket_id = 'pdfs-institucionales');

create policy "storage_pdfs_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'pdfs-institucionales');

-- Comentarios
comment on policy "storage_pdfs_admin_read" on storage.objects is 'Solo admins autenticados pueden leer directamente del bucket';
comment on policy "storage_pdfs_admin_insert" on storage.objects is 'Solo admins pueden subir archivos';
comment on policy "storage_pdfs_admin_delete" on storage.objects is 'Solo admins pueden eliminar archivos';
