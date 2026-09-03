-- Seed de categorías iniciales
insert into public.categorias (nombre, slug) values
  ('Revista Institucional', 'revista-institucional'),
  ('Documento oficial', 'documento-oficial'),
  ('Boletín', 'boletin'),
  ('Acta', 'acta'),
  ('Circular', 'circular')
on conflict (slug) do nothing;

-- Comentario
comment on table public.categorias is 'Categorías base para clasificar documentos. Pueden ser expandidas según necesidad.';
