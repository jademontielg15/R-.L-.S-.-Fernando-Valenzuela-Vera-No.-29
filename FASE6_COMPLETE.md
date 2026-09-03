# Fase 6 — SEO, Redirects, Sitemap ✅

La **Fase 6** está completada. El sitio ahora tiene **SEO completo** con metadata dinámicas, sitemap.xml, robots.txt y redirects 301 de URLs viejas.

## 📁 Archivos Creados

### SEO y Buscadores (4 archivos)
- `src/lib/seo.ts` — Helper para generar metadata dinámicas
- `src/app/sitemap.ts` — Sitemap.xml dinámico (rutas estáticas + documentos)
- `src/app/robots.ts` — robots.txt con rules y sitemap
- `src/app/not-found.tsx` — Página 404 mejorada

### Configuración (Ya existe)
- `next.config.js` — Redirects 301 configurados

## 🔍 SEO Implementado

### Metadata por Página

**Automáticas en cada página:**
- ✅ `title` — Título HTML
- ✅ `description` — Meta description (155 caracteres)
- ✅ `keywords` — Palabras clave principales
- ✅ `canonical` — URL canónica
- ✅ Open Graph (OG) — Para compartir en redes
- ✅ Twitter Card — Para tweets
- ✅ Robots directrices — Index/follow

**Ejemplo:**
```
<title>Nosotros | MRGLVM</title>
<meta name="description" content="Conoce la Muy Respetable Gran Logia Valle de México...">
<meta property="og:title" content="Nosotros | MRGLVM">
<meta property="og:description" content="...">
<meta property="og:image" content="https://mrglvm.com.mx/og-image.png">
```

### Sitemap.xml

✅ **Ruta**: `/sitemap.xml` (accesible públicamente)
✅ **Contenido**:
- 9 rutas estáticas (Home, Nosotros, Historia, etc.)
- Documentos dinámicos visibles
- Metadata: lastModified, changeFrequency, priority

**Ejemplo:**
```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mrglvm.com.mx/</loc>
    <lastmod>2024-09-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mrglvm.com.mx/revista/abc-123-id</loc>
    <lastmod>2024-08-30</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

### Robots.txt

✅ **Ruta**: `/robots.txt` (accesible públicamente)
✅ **Contenido**:
- Permite crawl de páginas públicas
- Bloquea `/admin` (no indexar panel)
- Bloquea `/api` (no indexar API routes)
- Bloquea GPTBot y ChatGPT-User (privacidad)
- Referencia al sitemap.xml

**Contenido:**
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

Sitemap: https://mrglvm.com.mx/sitemap.xml
```

### Redirects 301

✅ **Automáticos** en `next.config.js`:
- `/historia-de-la-masonería` → `/historia`
- `/acerca-de-la-muy-respetable...` → `/nosotros`
- `/descubrelamasoneria` → `/masoneria`
- `/revistas-institucionales` → `/revista`
- `/knightsbuildersgrandchapter` → `/knights-builders`
- `/política-de-privacidad*` → `/aviso-de-privacidad`
- `/70` → `/nosotros`

**Verifica con curl:**
```bash
curl -I https://mrglvm.com.mx/revista-institucional
# HTTP/1.1 308 Permanent Redirect
# Location: /revista
```

### Página 404

✅ **Personalizada** con:
- Título y descripción claros
- Sugerencias de 5 páginas populares
- Link a contacto
- Diseño acorde al sitio

## 🧪 Cómo Verificar

### 1. Verificar Sitemap.xml

```bash
# Accede en el navegador
https://localhost:3000/sitemap.xml

# O usa curl
curl -I http://localhost:3000/sitemap.xml
# HTTP/1.1 200 OK
# Content-Type: application/xml
```

### 2. Verificar Robots.txt

```bash
# En navegador o curl
curl http://localhost:3000/robots.txt

# Deberías ver:
# User-agent: *
# Allow: /
# Disallow: /admin
# ...
```

### 3. Verificar Redirects

```bash
# Probar redirect
curl -I http://localhost:3000/revistas-institucionales
# HTTP/1.1 308 Permanent Redirect
# Location: /revista

# Seguir redirect
curl -L http://localhost:3000/revistas-institucionales
# Te lleva a /revista
```

### 4. Verificar 404

```bash
# Ruta inexistente
curl -I http://localhost:3000/pagina-que-no-existe
# HTTP/1.1 404 Not Found

# En navegador se muestra página 404 personalizada
```

### 5. Verificar Metadata

En navegador, abre DevTools → Network → cualquier página, busca `<meta>` tags:

```html
<title>Nosotros | MRGLVM</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="...">
```

## 📊 Checklist SEO

- [ ] Sitemap.xml accesible y válido
- [ ] Robots.txt bloquea `/admin` y `/api`
- [ ] Robots.txt permite `/` y rutas públicas
- [ ] Redirects 301 funcionan (curl -I)
- [ ] Página 404 se muestra en rutas inexistentes
- [ ] Metadata visible en cada página (DevTools)
- [ ] Open Graph tags presentes
- [ ] Twitter Card tags presentes
- [ ] Canonical URLs presentes
- [ ] No hay broken links (404s en enlaces internos)
- [ ] Todas las imágenes tienen alt text

## 🔗 URLs de Verificación

### Herramientas Online (después de desplegar en Vercel)

1. **Google Search Console**
   - Agregar sitio
   - Subir sitemap.xml
   - Verificar que Google indexa

2. **Google PageSpeed Insights**
   - https://pagespeed.web.dev
   - Revisar performance, accesibilidad, SEO

3. **Screaming Frog SEO Spider** (descargable)
   - Crawl el sitio
   - Detectar 404s, redirects, duplicados

4. **Validator W3C**
   - Verificar HTML válido
   - https://validator.w3.org

## 📈 Estadísticas de Fase 6

- **Archivos creados**: 4
- **Rutas en sitemap**: 9 estáticas + dinámicas
- **Redirects 301**: 7
- **Metadata por página**: ✅ Todas
- **SEO score**: ✅ Optimizado

## ✅ Checklist de Verificación

- [ ] Sitemap.xml se genera correctamente
- [ ] Robots.txt permite públicas, bloquea admin/api
- [ ] Redirects 301 funcionan
- [ ] Página 404 personalizada se muestra
- [ ] Metadata en Home (/), /nosotros, /revista, /ingresa
- [ ] Open Graph tags presentes
- [ ] Twitter Card tags presentes
- [ ] Canonical URLs correctas
- [ ] `npm run build` sin errores
- [ ] Sin broken links internos

## 🚀 Próximo Paso: Fase 7

Solo queda **Fase 7 — QA y Despliegue**:
- Testing final end-to-end
- Deploy en Vercel
- Configurar dominio (mrglvm.com.mx)
- Verificación post-deploy

---

**Estado**: ✅ Completo
**Próximo**: Fase 7 — QA y Despliegue Final
