-- Crear tabla de categorías para documentos
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  created_at timestamp with time zone default now()
);

-- Índices
create index if not exists idx_categorias_slug on public.categorias(slug);

-- Comentarios
comment on table public.categorias is 'Categorías de documentos (Revista Institucional, Documento oficial, etc.)';
comment on column public.categorias.nombre is 'Nombre de la categoría (ej: Revista Institucional)';
comment on column public.categorias.slug is 'URL-friendly slug (ej: revista-institucional)';
