# Fase 2 — Setup de Base de Datos

## Migraciones SQL Creadas ✅

Se han creado 7 migraciones SQL versionadas en `supabase/migrations/`:

1. `0001_init_categorias.sql` — Tabla de categorías
2. `0002_init_documentos.sql` — Tabla de documentos/PDFs
3. `0003_init_solicitudes_ingreso.sql` — Tabla de solicitudes
4. `0004_rls_documentos.sql` — Políticas RLS para documentos
5. `0005_rls_solicitudes_ingreso.sql` — Políticas RLS para solicitudes
6. `0006_storage_bucket_pdfs.sql` — Bucket privado y políticas de Storage
7. `0007_seed_categorias.sql` — Datos iniciales (categorías)

## Cómo Aplicar las Migraciones

### Opción 1: Usar Supabase CLI (Recomendado)

#### 1. Instalar Supabase CLI (si no lo has hecho)

```bash
npm install -g @supabase/cli
```

#### 2. Conectar a tu proyecto Supabase

```bash
supabase login
supabase link --project-ref your-project-ref
```

Obtén `your-project-ref` de la URL de tu proyecto Supabase:
- Ejemplo: `https://abc123def456.supabase.co` → `abc123def456`

#### 3. Aplicar las migraciones

```bash
supabase db push
```

Esto ejecutará todas las migraciones en orden automáticamente.

#### 4. Generar tipos TypeScript (IMPORTANTE)

Una vez aplicadas las migraciones, genera los tipos para tu proyecto:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

### Opción 2: Ejecutar Manualmente en Supabase Studio

Si prefieres aplicar las migraciones manualmente:

1. Ve al dashboard de tu proyecto en https://supabase.com
2. Abre la pestaña **SQL Editor**
3. Copia el contenido de `0001_init_categorias.sql` y ejecuta (Run)
4. Repite para cada archivo (0002, 0003, ... 0007) en orden

**⚠️ IMPORTANTE**: Ejecuta en este orden exacto:
- 0001 (categorias)
- 0002 (documentos)
- 0003 (solicitudes_ingreso)
- 0004 (RLS documentos)
- 0005 (RLS solicitudes)
- 0006 (bucket storage)
- 0007 (seed datos)

## Verificación Post-Migración

### 1. Verificar Tablas en Supabase Studio

1. Ve a **Database > Tables**
2. Deberías ver:
   - `categorias`
   - `documentos`
   - `solicitudes_ingreso`
   - (storage.objects - ya existe, con nuevo bucket)

### 2. Verificar Datos Iniciales

En SQL Editor, ejecuta:

```sql
select * from public.categorias;
```

Deberías ver 5 filas (Revista Institucional, Documento oficial, etc.)

### 3. Verificar RLS está Habilitada

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and rowsecurity = true;
```

Deberías ver:
- `documentos` → rowsecurity = true
- `solicitudes_ingreso` → rowsecurity = true

### 4. Verificar Bucket de Storage

En el dashboard Supabase:

1. **Storage > Buckets**
2. Busca `pdfs-institucionales`
3. Verifica que **Public** esté deshabilitado (🔒 privado)

## Generar Tipos TypeScript

Después de aplicar migraciones, SIEMPRE regenera los tipos:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

Esto actualiza `src/types/database.types.ts` con los tipos exactos de tu BD.

## Crear Usuario Admin de Prueba

Para Fase 4 (panel admin), necesitarás un usuario autenticado.

**En Supabase Studio**:

1. Ve a **Authentication > Users**
2. Haz click en **Add user**
3. Email: `admin@mrglvm.test`
4. Password: `TempPassword123!` (cámbialo después)
5. Click **Save user**

Este usuario podrá:
- Ver el panel en `/admin`
- Subir documentos
- Ver solicitudes de ingreso

## Testing de RLS

Para verificar que RLS funciona correctamente:

### Test 1: Lectura Pública de Documentos Visibles

En SQL Editor, como **anon** (no autenticado):

```sql
-- Esto funcionará (visible = true)
select * from public.documentos where visible = true;

-- Esto mostrará 0 filas (no hay acceso a visibles = false)
select * from public.documentos where visible = false;
```

### Test 2: Inserción Pública Bloqueada

Como **anon**:

```sql
-- Esto fallará con "new row violates row level security policy"
insert into public.documentos (titulo, fecha_publicacion, archivo_path, visible)
values ('Test', now()::date, 'test.pdf', false);
```

### Test 3: Lectura de Solicitudes Bloqueada

Como **anon**:

```sql
-- Esto mostrará 0 filas
select * from public.solicitudes_ingreso;
```

Como usuario **autenticado** (admin):

```sql
-- Esto mostrará todas las solicitudes
select * from public.solicitudes_ingreso;
```

## Troubleshooting

### Error: "Permission denied"

**Causa**: La migración no se aplicó correctamente.

**Solución**:
1. Ve a SQL Editor
2. Ejecuta: `select * from public.categorias;`
3. Si da error "does not exist", reaplica las migraciones desde 0001

### Error: "constraint violation"

**Causa**: Datos que violan constraints (ej. checkboxes obligatorios).

**Solución**: Los constraints están en `solicitudes_ingreso` para forzar que los checkboxes sean true. Esto es intencional — usa la API desde Next.js que validará con Zod primero.

### No ves el bucket `pdfs-institucionales`

**Causa**: La migración 0006 no se ejecutó.

**Solución**:
1. Ve a **Storage > Buckets**
2. Si no existe, ejecuta manualmente el SQL de 0006
3. Verifica que esté marcado como **Private**

## Próximos Pasos (Fase 3)

Una vez confirmado que las migraciones funcionan:

1. ✅ Migraciones aplicadas
2. ✅ Tipos TypeScript generados
3. ✅ RLS funcionando
4. ✅ Bucket privado creado

**Próximo**: Fase 3 — Repositorio de PDFs
- API route para generar signed URLs
- Componente VisorPDF con react-pdf
- Scripts para generar/subir PDFs de prueba

---

**Estado**: ⏳ Esperando que apliques las migraciones
**Próximo**: Fase 3 — Repositorio de PDFs
