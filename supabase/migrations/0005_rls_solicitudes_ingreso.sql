-- Habilitar RLS en tabla solicitudes_ingreso
alter table public.solicitudes_ingreso enable row level security;

-- POLICY 1: Cualquiera (anon o autenticado) puede INSERTAR una solicitud
create policy "solicitudes_insert_publico"
  on public.solicitudes_ingreso
  for insert
  to anon, authenticated
  with check (true);

-- POLICY 2: Nadie puede SELECT (excepto admins)
-- Los visitantes nunca deben poder leer solicitudes de otros
create policy "solicitudes_select_admin"
  on public.solicitudes_ingreso
  for select
  to authenticated
  using (true);

-- POLICY 3: Actualizar solo para admins autenticados
create policy "solicitudes_update_admin"
  on public.solicitudes_ingreso
  for update
  to authenticated
  using (true)
  with check (true);

-- POLICY 4: Eliminar solo para admins autenticados
create policy "solicitudes_delete_admin"
  on public.solicitudes_ingreso
  for delete
  to authenticated
  using (true);

-- Comentarios
comment on policy "solicitudes_insert_publico" on public.solicitudes_ingreso is 'Visitantes públicos pueden enviar solicitudes de ingreso';
comment on policy "solicitudes_select_admin" on public.solicitudes_ingreso is 'Solo usuarios autenticados (admins) pueden ver solicitudes';
comment on policy "solicitudes_update_admin" on public.solicitudes_ingreso is 'Solo admins pueden actualizar (marcar revisado, comentarios)';
comment on policy "solicitudes_delete_admin" on public.solicitudes_ingreso is 'Solo admins pueden eliminar solicitudes';
