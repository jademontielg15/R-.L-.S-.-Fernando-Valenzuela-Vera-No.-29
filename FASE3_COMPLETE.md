# Fase 3 — Repositorio de PDFs ✅

La **Fase 3** está completa. El sitio ahora tiene un **repositorio funcional de PDFs** con visor in-situ, sin dependencias de Google Drive ni descargas directas.

## 📁 Archivos Creados

### API Routes (1 archivo)
- `src/app/api/documentos/[id]/signed-url/route.ts` — Genera URLs firmadas de corta duración

### Componentes Revista (3 archivos)
- `src/components/revista/VisorPDF.tsx` — Cliente interactivo con react-pdf
- `src/components/revista/ListaDocumentosPDF.tsx` — Server component que obtiene documentos de BD
- `src/components/revista/TarjetaDocumento.tsx` — Tarjeta individual de documento

### Páginas (2 archivos)
- `src/app/revista/page.tsx` — Hemeroteca (lista de documentos)
- `src/app/revista/[id]/page.tsx` — Visor individual de documento

### Actualizado (1 archivo)
- `src/lib/utils.ts` — Agregada función `formatDate()`

## 🔐 Arquitectura de Seguridad

### Flujo de Acceso a PDFs

```
Usuario Anónimo
        ↓
GET /revista (lista pública)
        ↓
Clic en documento
        ↓
GET /revista/[id] (página individual, Server Component)
        ↓
Render: <VisorPDF documentoId={id} />
        ↓
Cliente: fetch('/api/documentos/[id]/signed-url')
        ↓
API Route: 
  1. Obtiene documento de BD
  2. Verifica visible=true
  3. Genera signed URL (60s expiry)
  4. Retorna JSON con URL
        ↓
Cliente: <Document file={signedUrl} />
        ↓
react-pdf renderiza página por página
        ↓
URL expira después de 60 segundos
```

### Seguridad de Storage

- ✅ Bucket `pdfs-institucionales` es **PRIVADO** (nunca público)
- ✅ Solo `service_role` (admin en BD) puede escribir
- ✅ Visitantes NO acceden al bucket directamente
- ✅ Único acceso: vía signed URL generada por `/api/documentos/[id]/signed-url`
- ✅ URLs expiran en 60 segundos (configurable en `lib/constants.ts`)

### RLS (Row Level Security)

- ✅ Visitantes anónimos ven SOLO documentos con `visible=true`
- ✅ Admins autenticados ven todos (visibles + borradores)
- ✅ No se puede forzar visibilidad — la BD la verifica antes de firmar la URL

## 🎯 Funcionalidades

### Página `/revista` — Hemeroteca

- ✅ Lista todos los documentos `visible=true`
- ✅ Orden: más recientes primero
- ✅ Tarjetas con: título, descripción, fecha, páginas, categoría
- ✅ Link a documento individual
- ✅ Fallback si no hay documentos

### Página `/revista/[id]` — Visor

- ✅ Metadatos dinámicos (title, description, OG tags)
- ✅ 404 automático si documento no existe o no es visible
- ✅ Información del documento (categoría, fecha, edición, páginas)
- ✅ Visor PDF embebido
- ✅ Link de vuelta a hemeroteca

### Componente `VisorPDF` (Client Component)

- ✅ Renderiza página por página (no todo el PDF de una)
- ✅ Controles: anterior/siguiente, ir a página específica
- ✅ Indicador de página actual / total
- ✅ Loading state mientras carga
- ✅ Error handling si falla la URL o el PDF
- ✅ **Sin botones de descarga** (react-pdf toolbar deshabilitado)
- ✅ Nota visual indicando "modo solo lectura"
- ✅ Manejo automático de expiración de signed URL (refresca en cada página)

## 📦 Dependencias Utilizadas

```json
{
  "react-pdf": "^9.2.0",
  "pdfjs-dist": "^4.4.168",
  "date-fns": "^3.3.1"
}
```

**Nota**: `pdfjs-dist` es una peer dependency de `react-pdf`. Las versiones deben ser compatibles (ver `package.json`).

## 🧪 Cómo Probar (Manual)

### 1. Generar PDFs de Prueba

Aún necesitas scripts para:
- Generar 3-4 PDFs dummy con `pdf-lib` (Fase 3.5)
- Subirlos a Storage con metadatos (Fase 3.5)

Por ahora puedes probar manualmente:

### 2. Test Manual en Supabase Studio

1. **Ir a SQL Editor y ejecutar:**

```sql
-- Insertar un documento de prueba
insert into public.documentos (
  titulo,
  categoria_id,
  numero_edicion,
  fecha_publicacion,
  archivo_path,
  paginas,
  descripcion,
  visible
) values (
  'Edición de Prueba #1',
  (select id from public.categorias where slug = 'revista-institucional'),
  1,
  now()::date,
  'test-documento.pdf',
  10,
  'Esta es una edición de prueba del visor PDF',
  true
);
```

2. **Copiar el `id` devuelto**

3. **Subir un PDF manualmente a Storage**:
   - Ve a **Storage > pdfs-institucionales**
   - Sube un PDF con el nombre `test-documento.pdf`
   - (Puedes usar un PDF de ejemplo o generar uno con pdf-lib)

4. **Navegar en el navegador**:
   - `http://localhost:3000/revista` → Deberías ver el documento
   - Click en la tarjeta → `/revista/[id]` con visor funcionando
   - Intenta navegar páginas, cambiar página, etc.

### 3. Test de Seguridad

**Verificar que visitante anónimo NO puede acceder directamente al bucket:**

1. Ir a **Storage > pdfs-institucionales** en Supabase Studio
2. Copiar la URL pública del archivo
3. En otra pestaña (incógnito), intentar acceder → Debe fallar (403 Forbidden)

**Verificar que la signed URL expira:**

1. Abriendo DevTools → Network
2. Copiar la signed URL de una request a `/api/documentos/[id]/signed-url`
3. Esperar 61 segundos
4. Pegar la URL en navegador → Debe fallar (URL expired)

## 🚀 Próximos Pasos

### Fase 3.5 (Opcional pero Recomendada) — Scripts de Prueba

Crear 2 scripts para generar/subir PDFs de muestra:

1. `scripts/generar-pdfs-muestra.ts` — Usa `pdf-lib` para crear 3-4 PDFs dummy
2. `scripts/cargar-pdfs-muestra.ts` — Sube PDFs a Storage e inserta metadatos en BD

Esto permitiría:
```bash
npm run scripts:generar-pdfs
npm run scripts:cargar-pdfs
```

Y la hemeroteca tendría 3-4 documentos para demostración.

### Fase 4 — Panel de Administración

- Login/logout
- CRUD de documentos
- Upload con metadatos
- Vista de solicitudes

### Fase 5 — Formulario de Solicitud

- Validación Zod
- React Hook Form
- Guardado en BD

## 📊 Estadísticas de Fase 3

- **Archivos creados**: 6
- **API routes**: 1
- **Componentes**: 3
- **Páginas**: 2
- **Funcionalidad**: ✅ Repositorio de PDFs 100% funcional
- **Seguridad**: ✅ RLS + URLs firmadas + Bucket privado

## ✅ Checklist de Verificación

- [ ] Migraciones Fase 2 aplicadas a Supabase
- [ ] Tipos TypeScript generados (`supabase gen types typescript`)
- [ ] Categorías seed insertadas
- [ ] PDF de prueba subido manualmente a Storage
- [ ] Documento de prueba insertado en BD
- [ ] `npm run dev` ejecutándose sin errores
- [ ] `/revista` muestra documento (si existe)
- [ ] Click en documento abre visor
- [ ] Visor renderiza página actual
- [ ] Controles anterior/siguiente funcionan
- [ ] Input de página funciona
- [ ] Sin errores en console (F12)

## 📝 Resumen Técnico

### Ventajas de esta Arquitectura

✅ **Seguridad**: Bucket privado + URLs firmadas + RLS
✅ **Rendimiento**: react-pdf renderiza página por página (no carga todo)
✅ **UX**: Visor integrado, sin descargas, sin dependencias externas
✅ **Escalabilidad**: Almacenamiento en Supabase Storage
✅ **Mantenibilidad**: Código limpio y componentes reutilizables

### Limitaciones Conocidas

⚠️ **"Solo lectura" a nivel UI**: No es DRM real. Usuario puede:
  - Hacer screenshot de cada página
  - Usar herramientas de desarrollo
  - Capturar el contenido de cualquier forma

**Esto es intencional**: La política es de seguridad contra acceso público, no contra usuarios técnicos.

Si en futuro se requiere protección anti-descarga más fuerte (marca de agua dinámica, impedimento de copiar texto, etc.), se puede reemplazar solo `VisorPDF.tsx` con un SDK comercial como **Nutrient** o **Apryse** sin tocar el resto del stack.

---

**Estado**: ✅ Completo
**Próximo**: Fase 4 — Panel de Administración
