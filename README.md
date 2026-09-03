# MRGLVM Web — Rediseño del Sitio Institucional

Sitio web moderno para la Muy Respetable Gran Logia Valle de México, construido con **Next.js 15** + **Supabase** + **React PDF**.

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend/BD**: Supabase (PostgreSQL + Storage + Auth)
- **Visor PDF**: react-pdf (basado en pdf.js)
- **Formularios**: React Hook Form + Zod
- **Despliegue**: Vercel (frontend) + Supabase Cloud (BD/Storage/Auth)

## Requisitos Previos

- Node.js 18+ 
- npm 9+
- Cuenta en Supabase (https://supabase.com)
- Cuenta en Vercel (opcional, para despliegue)

## Setup Local

### 1. Instalar Dependencias

```bash
cd mrglvm-web
npm install
```

### 2. Crear Proyecto Supabase

1. Ir a https://supabase.com y crear una cuenta
2. Crear un nuevo proyecto
3. Copiar las credenciales (URL y Anon Key) desde el panel "API Settings"

### 3. Configurar Variables de Entorno

Copiar `.env.local.example` a `.env.local` y llenar con tus credenciales:

```bash
cp .env.local.example .env.local
```

Editar `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**⚠️ IMPORTANTE**: El `SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse al cliente. Solo se usa en route handlers server-side.

### 4. Instalar Supabase CLI (para migraciones)

```bash
npm install -g @supabase/cli
supabase login
supabase link --project-ref <tu-project-ref>
```

### 5. Aplicar Migraciones de Base de Datos

Las migraciones están en `supabase/migrations/`. Cuando estén listas (Fase 2), ejecutar:

```bash
supabase db push
```

### 6. Generar Tipos TypeScript

Después de aplicar las migraciones:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

### 7. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## Estructura del Proyecto

```
mrglvm-web/
├── src/
│   ├── app/              # Páginas y rutas (Next.js App Router)
│   ├── components/       # Componentes reutilizables
│   ├── lib/
│   │   ├── supabase/     # Clientes Supabase (client, server, admin)
│   │   └── constants.ts  # Constantes globales
│   ├── types/            # Tipos TypeScript (generados desde BD)
│   └── styles/           # Estilos globales
├── supabase/
│   └── migrations/       # Migraciones SQL versionadas
├── scripts/              # Scripts de utilidad (generar PDFs, cargar datos)
└── public/               # Assets estáticos
```

## Fases de Implementación

- **Fase 0** (ACTUAL): Setup de proyecto y Supabase ✅
- **Fase 1**: Layout base + páginas institucionales
- **Fase 2**: Esquema de BD + RLS
- **Fase 3**: Repositorio de PDFs + visor
- **Fase 4**: Panel de administración + Auth
- **Fase 5**: Formulario de solicitud
- **Fase 6**: SEO, redirects, sitemap
- **Fase 7**: QA y despliegue

Cada fase es verificable de forma independiente antes de avanzar a la siguiente.

## Recursos Importantes

- [Documentación del Plan](../documento-tecnico-proyecto-mrglvm.md)
- [Plan de Implementación](../.claude/plans/vectorized-conjuring-wall.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## Contenido Placeholder

El sitio actualmente usa contenido de ejemplo en español para permitir desarrollo/testing sin depender de contenido final del cliente:

- **Textos**: Institucionales genéricos, tono solemne
- **Imágenes**: Placeholder vía picsum.photos (determinísticas por seed)
- **PDFs**: Generados programáticamente (se agregarán en Fase 3)
- **Logos**: SVGs simples locales

**Nota**: Todo es fácil de reemplazar cuando el cliente entregue contenido real.

## Seguridad

- El bucket de PDFs es **privado** — nunca se accede directamente
- Los PDFs se sirven vía **URLs firmadas de corta duración** (60 segundos)
- El `SUPABASE_SERVICE_ROLE_KEY` solo se usa server-side, nunca se expone al cliente
- RLS (Row Level Security) está habilitada en ambas tablas desde el inicio
- Políticas de acceso separadas para documentos públicos vs. datos sensibles (solicitudes de ingreso)

## Despliegue

### Vercel (Frontend)

1. Crear repo en GitHub y pushear el código
2. Ir a https://vercel.com y conectar el repo
3. Configurar las mismas env vars (`NEXT_PUBLIC_SUPABASE_URL`, etc.) en settings
4. Deploy automático en cada push

### Supabase (BD/Storage/Auth)

Ya está desplegado en Supabase Cloud. Solo asegurarse de que:
- Bucket de PDFs está privado
- RLS está habilitada
- Backups están configurados en production

## Soporte y Contacto

Para problemas o sugerencias, revisar el documento técnico original o contactar al equipo de desarrollo.
