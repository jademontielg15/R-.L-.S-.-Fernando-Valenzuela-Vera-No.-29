-- Crear tabla de solicitudes de ingreso
create table if not exists public.solicitudes_ingreso (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  fecha_nacimiento date not null,
  profesion text not null,
  estado_residencia text not null,
  interes_ingreso text not null,
  conocimiento_institucion text not null,
  email text not null,
  telefono text not null,
  disponible_entre_semana boolean not null default false,
  disponible_sabado boolean not null default false,
  acepta_consentimiento_datos boolean not null default false,
  declara_hombre_libre boolean not null default false,
  creado_en timestamp with time zone not null default now(),
  revisado boolean not null default false
);

-- Índices
create index if not exists idx_solicitudes_email on public.solicitudes_ingreso(email);
create index if not exists idx_solicitudes_creado_en on public.solicitudes_ingreso(creado_en);
create index if not exists idx_solicitudes_revisado on public.solicitudes_ingreso(revisado);

-- Constraints: verificar que los checkboxes obligatorios están marcados
alter table public.solicitudes_ingreso
  add constraint chk_solicitud_consentimiento check (acepta_consentimiento_datos = true),
  add constraint chk_solicitud_declaracion check (declara_hombre_libre = true);

-- Comentarios
comment on table public.solicitudes_ingreso is 'Solicitudes de ingreso de candidatos (datos sensibles, protegidos por RLS)';
comment on column public.solicitudes_ingreso.acepta_consentimiento_datos is 'Debe ser true (obligatorio por ley)';
comment on column public.solicitudes_ingreso.declara_hombre_libre is 'Debe ser true (requisito masónico)';
comment on column public.solicitudes_ingreso.revisado is 'true si un admin ya revisó esta solicitud';
