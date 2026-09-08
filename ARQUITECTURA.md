# Diagrama general del sitio — MRGLVM

Documento de arquitectura del proyecto `mrglvm-web`: componentes técnicos, páginas funcionales y conexión a base de datos.

Stack: **Next.js 15 (App Router) + React 18 + TypeScript + Tailwind CSS + Supabase (PostgreSQL, Auth, Storage) + react-pdf/pdfjs-dist + Zod + react-hook-form**.

---

## 1. Diagrama general de arquitectura

```mermaid
graph TB
    subgraph CLIENTES["👥 Clientes"]
        VIS["Visitante público<br/>(anónimo)"]
        ADM["Administrador<br/>(autenticado)"]
    end

    subgraph NEXT["▲ Next.js 15 — App Router"]
        MW["middleware.ts<br/>updateSession() · refresca cookies de sesión<br/>matcher: todo excepto /api, _next/*, favicon"]

        subgraph PUB["Páginas públicas (Server Components / SSR)"]
            P1["/ · /nosotros · /historia<br/>/masoneria · /knights-builders<br/>/contacto · /aviso-de-privacidad"]
            P2["/revista<br/>(listado de PDFs)"]
            P3["/revista/[id]<br/>(visor PDF)"]
            P4["/ingresa<br/>(formulario de solicitud)"]
            P5["/robots.ts · /sitemap.ts<br/>/not-found"]
        end

        subgraph ADMZONE["Zona /admin (Client Components)"]
            A0["/admin/login"]
            A1["/admin<br/>(dashboard documentos)"]
            A2["/admin/documentos/nuevo<br/>/admin/documentos/[id]"]
            A3["/admin/solicitudes"]
            AL["admin/layout.tsx<br/>guard de sesión en cliente"]
        end

        subgraph API["Route Handlers (/api)"]
            R1["POST /api/solicitudes<br/>rate-limit + validación Zod"]
            R2["GET /api/documentos/[id]/signed-url<br/>genera URL firmada (60 s)"]
        end

        subgraph LIB["Capa de librerías (src/lib)"]
            L1["supabase/client.ts<br/>createBrowserClient (anon)"]
            L2["supabase/server.ts<br/>createServerClient + cookies (anon)"]
            L3["supabase/middleware.ts<br/>createServerClient sobre request/response"]
            L4["supabase/admin.ts<br/>service_role ⚠️ solo servidor"]
            L5["validaciones/solicitud.schema.ts (Zod)<br/>constants.ts · utils.ts · seo.ts"]
        end
    end

    subgraph SUPA["🗄️ Supabase (BaaS)"]
        AUTH["Auth<br/>auth.users · email + password<br/>sesión en cookies"]
        DB[("PostgreSQL<br/>categorias<br/>documentos<br/>solicitudes_ingreso<br/>+ RLS activo")]
        ST["Storage<br/>bucket privado<br/>pdfs-institucionales"]
    end

    CDN["cdnjs.cloudflare.com<br/>pdf.worker.min.js"]

    VIS --> MW
    ADM --> MW
    MW --> PUB
    MW --> ADMZONE

    P2 -->|"SSR: select documentos<br/>where visible = true"| L2
    P3 -->|"SSR: metadata + datos del doc"| L2
    P3 -->|"cliente: VisorPDF"| R2
    P4 -->|"POST JSON"| R1

    A0 -->|"signInWithPassword"| L1
    AL -->|"getSession / onAuthStateChange"| L1
    A1 -->|"select/update/delete documentos"| L1
    A2 -->|"upload PDF + insert/update"| L1
    A3 -->|"select/update solicitudes_ingreso"| L1

    R1 --> L2
    R2 --> L2
    L1 -.->|"HTTPS + anon key"| AUTH
    L1 -.->|"PostgREST + anon key"| DB
    L1 -.->|"Storage API"| ST
    L2 -.->|"PostgREST + anon key<br/>+ cookies de sesión"| DB
    L2 -.->|"createSignedUrl"| ST
    L3 -.-> AUTH
    L4 -.->|"service_role (bypassa RLS)"| DB

    P3 -.->|"descarga worker"| CDN
    P3 -.->|"GET PDF con URL firmada"| ST

    style SUPA fill:#e8f5e9
    style NEXT fill:#eef3fb
    style API fill:#fff4e5
    style ADMZONE fill:#fdecea
```

---

## 2. Mapa de páginas funcionales

| Ruta | Tipo | Función | Origen de datos |
|---|---|---|---|
| `/` | Server Component | Home institucional (Hero, secciones, CTA) | Estático |
| `/nosotros` | Server Component | Quiénes somos, `LineaDeTiempo` | Estático |
| `/historia` | Server Component | Historia de la masonería | Estático |
| `/masoneria` | Server Component | Divulgación / preguntas frecuentes | Estático |
| `/knights-builders` | Server Component | Knights Builders Grand Chapter | Estático |
| `/revista` | Server Component (SSR) | Hemeroteca: lista documentos publicados | `documentos` (visible = true) |
| `/revista/[id]` | Server Component + `VisorPDF` (cliente) | Lectura paginada del PDF, sin descarga | `documentos` + Storage vía URL firmada |
| `/ingresa` | Client Component | Formulario de solicitud de ingreso | `POST /api/solicitudes` |
| `/contacto` | Server Component | Datos de contacto y formulario **estático** (sin `action`/`onSubmit`) | — |
| `/aviso-de-privacidad` | Server Component | Aviso legal (LFPDPPP) | Estático |
| `/robots.ts`, `/sitemap.ts` | Route Handlers | SEO | Estático |
| `/not-found` | Server Component | 404 | — |
| `/admin/login` | Client Component | Login con email + contraseña | Supabase Auth |
| `/admin` | Client Component | Dashboard: listar documentos, alternar visibilidad, eliminar | `documentos` + `categorias` |
| `/admin/documentos/nuevo` | Client Component | Alta: sube PDF a Storage + inserta registro | Storage + `documentos` |
| `/admin/documentos/[id]` | Client Component | Edición de metadatos / reemplazo de archivo | Storage + `documentos` |
| `/admin/solicitudes` | Client Component | Bandeja de solicitudes, filtro y marcar revisadas | `solicitudes_ingreso` |

`next.config.js` mantiene **7 redirects 301** desde las URLs del sitio anterior (`/revistas-institucionales` → `/revista`, `/descubrelamasoneria` → `/masoneria`, etc.).

---

## 3. Modelo de datos y conexión a base de datos

```mermaid
erDiagram
    AUTH_USERS ||--o{ DOCUMENTOS : "creado_por"
    CATEGORIAS ||--o{ DOCUMENTOS : "categoria_id"
    DOCUMENTOS ||--|| STORAGE_OBJECT : "archivo_path"

    AUTH_USERS {
        uuid id PK
        text email
    }

    CATEGORIAS {
        uuid id PK
        text nombre
        text slug UK
        timestamptz created_at
    }

    DOCUMENTOS {
        uuid id PK
        text titulo
        uuid categoria_id FK "ON DELETE SET NULL"
        int numero_edicion
        date fecha_publicacion
        text archivo_path "ruta en bucket"
        int paginas
        text descripcion
        bool visible "default false"
        uuid creado_por FK
        timestamptz creado_en
        timestamptz actualizado_en
    }

    SOLICITUDES_INGRESO {
        uuid id PK
        text nombre_completo
        date fecha_nacimiento
        text profesion
        text estado_residencia
        text interes_ingreso
        text conocimiento_institucion
        text email
        text telefono
        bool disponible_entre_semana
        bool disponible_sabado
        bool acepta_consentimiento_datos "CHECK = true"
        bool declara_hombre_libre "CHECK = true"
        bool revisado "default false"
        timestamptz creado_en
    }

    STORAGE_OBJECT {
        text bucket "pdfs-institucionales (privado)"
        text name
    }
```

### Rutas de conexión a Supabase

| Cliente | Archivo | Clave | Contexto | Uso |
|---|---|---|---|---|
| Browser | `src/lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Navegador | Login, panel admin, upload de PDFs |
| Server | `src/lib/supabase/server.ts` | anon key + cookies | RSC y Route Handlers | SSR de `/revista`, `/revista/[id]`, ambas APIs |
| Middleware | `src/lib/supabase/middleware.ts` | anon key sobre request/response | Edge/middleware | Refresco de sesión en cada navegación |
| Admin | `src/lib/supabase/admin.ts` | `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor | Operaciones que bypassan RLS |

Todas las lecturas/escrituras pasan por **PostgREST** de Supabase con RLS aplicado en la base; no hay ORM ni servidor propio de base de datos.

### Políticas RLS vigentes

| Tabla | anon | authenticated |
|---|---|---|
| `documentos` | `SELECT` solo `visible = true` | `SELECT` todo (incl. borradores), `INSERT`, `UPDATE`, `DELETE` |
| `solicitudes_ingreso` | `INSERT` únicamente | `SELECT`, `UPDATE`, `DELETE` |
| `storage.objects` (`pdfs-institucionales`) | sin acceso directo | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `categorias` | RLS no habilitado (lectura abierta) | — |

El bucket es **privado**: el público nunca accede a los PDFs directamente, solo mediante URLs firmadas de 60 segundos (`PDF_SIGNED_URL_EXPIRY_SECONDS`).

---

## 4. Flujo A — Lectura de un documento PDF

```mermaid
sequenceDiagram
    participant U as Visitante
    participant N as Next.js (RSC)
    participant V as VisorPDF (cliente)
    participant API as GET /api/documentos/[id]/signed-url
    participant DB as PostgreSQL (RLS)
    participant ST as Storage (bucket privado)

    U->>N: GET /revista
    N->>DB: select documentos where visible = true
    DB-->>N: listado
    N-->>U: HTML con TarjetaDocumento[]

    U->>N: GET /revista/{id}
    N->>DB: select documento + categoria
    DB-->>N: metadatos
    N-->>U: HTML + VisorPDF (client)

    V->>API: fetch /api/documentos/{id}/signed-url
    API->>DB: select archivo_path, visible
    alt visible = false
        API-->>V: 403 "Documento no disponible"
    else visible = true
        API->>ST: createSignedUrl(archivo_path, 60s)
        ST-->>API: signedUrl
        API-->>V: { url, expiresAt, documento }
        V->>ST: GET PDF (URL firmada)
        ST-->>V: bytes del PDF
        V-->>U: render paginado (react-pdf, sin botón de descarga)
    end
```

## 5. Flujo B — Solicitud de ingreso

```mermaid
sequenceDiagram
    participant U as Candidato
    participant F as FormularioSolicitud (react-hook-form + Zod)
    participant API as POST /api/solicitudes
    participant DB as PostgreSQL (RLS)
    participant A as Admin

    U->>F: completa /ingresa
    F->>F: validación cliente (zodResolver)
    F->>API: POST JSON
    API->>API: rate limit 5/hora por IP (Map en memoria)
    API->>API: solicitudIngresoSchema.parse (validación servidor)
    alt datos inválidos
        API-->>F: 400 { fieldErrors }
    else válidos
        API->>DB: insert solicitudes_ingreso (anon key, policy insert público)
        DB-->>API: id
        API-->>F: 201 "Solicitud recibida"
    end

    A->>DB: /admin/solicitudes — select (requiere sesión)
    A->>DB: update revisado = true
```

## 6. Flujo C — Publicación de un documento (admin)

```mermaid
sequenceDiagram
    participant A as Admin
    participant L as /admin/login
    participant AU as Supabase Auth
    participant M as middleware.ts
    participant F as FormularioDocumento
    participant ST as Storage
    participant DB as PostgreSQL

    A->>L: email + password
    L->>AU: signInWithPassword
    AU-->>L: sesión en cookies
    L-->>A: redirect /admin
    M->>AU: getSession() en cada navegación (refresco)

    A->>F: /admin/documentos/nuevo
    F->>DB: select categorias
    F->>ST: upload(nombreArchivo, PDF) al bucket privado
    ST-->>F: ok
    F->>DB: insert documentos (archivo_path, visible)
    A->>DB: /admin — toggle visible / delete
```

---

## 7. Componentes de interfaz

```
src/components/
├── layout/           Header, Footer            → usados en app/layout.tsx
├── ui/               Button, Card, Input, Textarea, Checkbox
├── Hero, SeccionImagenTexto, GaleriaImagenes, LineaDeTiempo
├── revista/          ListaDocumentosPDF (RSC) → TarjetaDocumento
│                     VisorPDF (client, react-pdf + worker de CDN)
├── admin/            FormularioDocumento (client, upload + CRUD)
└── FormularioSolicitud/  FormularioSolicitud (client, RHF + Zod)
```

---

## 8. Observaciones sobre el estado actual

Puntos que el diagrama deja a la vista y conviene tener presentes:

1. **`FormularioDocumento.tsx` (`'use client'`) importa `createAdminClient`** (`src/lib/supabase/admin.ts:8`), que lee `SUPABASE_SERVICE_ROLE_KEY`. El import está sin usar y la variable no es `NEXT_PUBLIC_`, así que hoy no se filtra la clave, pero es un import que debe eliminarse para que nunca llegue al bundle del navegador.
2. **El guard de `/admin` es solo de cliente** (`admin/layout.tsx`): el middleware refresca la sesión pero no redirige. La protección real la da RLS, no el enrutado.
3. **RLS de admin es "cualquier usuario autenticado"**: no hay tabla de roles ni claim de admin. Cualquier usuario dado de alta en `auth.users` puede ver borradores y las solicitudes de ingreso (datos personales).
4. **El formulario de `/contacto` no envía nada**: es markup sin `action` ni handler.
5. **El rate limit de `/api/solicitudes` vive en un `Map` en memoria**: se reinicia en cada cold start y no se comparte entre instancias serverless.
6. **El worker de PDF.js se carga desde cdnjs**: dependencia externa en tiempo de render y riesgo de desajuste de versión con `pdfjs-dist`.
