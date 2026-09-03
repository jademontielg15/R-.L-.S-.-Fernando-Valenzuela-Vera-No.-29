-- Crear tabla de documentos (PDFs)
create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  categoria_id uuid references public.categorias(id) on delete set null,
  numero_edicion integer,
  fecha_publicacion date not null,
  archivo_path text not null,
  paginas integer,
  descripcion text,
  visible boolean not null default false,
  creado_por uuid references auth.users(id) on delete set null,
  creado_en timestamp with time zone not null default now(),
  actualizado_en timestamp with time zone not null default now()
);

-- Índices
create index if not exists idx_documentos_visible on public.documentos(visible);
create index if not exists idx_documentos_categoria_id on public.documentos(categoria_id);
create index if not exists idx_documentos_creado_por on public.documentos(creado_por);
create index if not exists idx_documentos_fecha_publicacion on public.documentos(fecha_publicacion);

-- Comentarios
comment on table public.documentos is 'Documentos PDF (Revistas, boletines, etc.) almacenados en Storage y referenciados aquí';
comment on column public.documentos.titulo is 'Título del documento (ej: "9a. Edición Noviembre/Diciembre 2025")';
comment on column public.documentos.archivo_path is 'Ruta en Storage (ej: pdfs-institucionales/revista-9.pdf)';
comment on column public.documentos.visible is 'Si true, se muestra en /revista para visitantes públicos';
comment on column public.documentos.paginas is 'Número de páginas (cacheado al upload)';
