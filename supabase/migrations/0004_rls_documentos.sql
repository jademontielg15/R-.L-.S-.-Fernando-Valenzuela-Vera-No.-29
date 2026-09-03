-- Habilitar RLS en tabla documentos
alter table public.documentos enable row level security;

-- POLICY 1: Lectura pública de documentos visibles
create policy "documentos_select_publico"
  on public.documentos
  for select
  to anon, authenticated
  using (visible = true);

-- POLICY 2: Lectura admin de todos los documentos (incluye borradores)
create policy "documentos_select_admin"
  on public.documentos
  for select
  to authenticated
  using (true);

-- POLICY 3: Insertar documentos (solo admin autenticado)
create policy "documentos_insert_admin"
  on public.documentos
  for insert
  to authenticated
  with check (true);

-- POLICY 4: Actualizar documentos (solo admin autenticado)
create policy "documentos_update_admin"
  on public.documentos
  for update
  to authenticated
  using (true)
  with check (true);

-- POLICY 5: Eliminar documentos (solo admin autenticado)
create policy "documentos_delete_admin"
  on public.documentos
  for delete
  to authenticated
  using (true);

-- Comentarios
comment on policy "documentos_select_publico" on public.documentos is 'Visitantes anónimos ven solo documentos visibles=true';
comment on policy "documentos_select_admin" on public.documentos is 'Admins autenticados ven todos los documentos (visibles + borradores)';
comment on policy "documentos_insert_admin" on public.documentos is 'Solo usuarios autenticados pueden crear documentos';
comment on policy "documentos_update_admin" on public.documentos is 'Solo usuarios autenticados pueden editar documentos';
comment on policy "documentos_delete_admin" on public.documentos is 'Solo usuarios autenticados pueden eliminar documentos';
