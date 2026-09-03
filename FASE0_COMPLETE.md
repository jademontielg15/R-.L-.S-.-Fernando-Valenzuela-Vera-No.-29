# Fase 0 — Setup Completado ✅

La estructura base del proyecto Next.js ha sido creada exitosamente. Antes de continuar con la **Fase 1 (Layout base + páginas institucionales)**, necesitas completar estos pasos:

## 1. Instalar Dependencias (IMPORTANTE)

```bash
cd mrglvm-web
npm install
```

Este paso **requiere Node.js 18+** instalado en tu sistema. Si aún no lo tienes:

- **macOS**: `brew install node`
- **Linux/Ubuntu**: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
- **Windows**: Descargar desde https://nodejs.org

Luego verifica:
```bash
node --version  # debería ser v18+
npm --version   # debería ser v9+
```

## 2. Crear Proyecto Supabase

1. Ve a https://supabase.com y crea una cuenta (gratis)
2. Crea un nuevo proyecto:
   - Elige una región cercana (ej. `us-east-1` para México)
   - Guarda la contraseña del admin (la necesitarás)
3. Una vez creado, ve a **Settings > API**
4. Copia estos valores:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ nunca lo compartas)

## 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local

# Editar con tus credenciales de Supabase
# Abre .env.local y pega los valores del paso anterior
```

Archivo `.env.local` debe quedar así:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

⚠️ **IMPORTANTE**: El `service_role_key` nunca debe exposerse al cliente ni pushearse a Git. Ya está en `.gitignore`.

## 4. (Opcional) Instalar Supabase CLI para Migraciones

```bash
npm install -g @supabase/cli
supabase login
```

Cuando tengas el `project-ref` de tu proyecto Supabase:
```bash
supabase link --project-ref your-project-ref
```

## 5. Verificar Setup

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador. Deberías ver la página de inicio con el contenido placeholder.

Si ves errores sobre variables de entorno faltantes, verifica que `.env.local` esté completo y correctamente guardado.

## 6. Git Setup (Opcional)

Si usarás Git:

```bash
git init
git add .
git commit -m "feat: Fase 0 - estructura base del proyecto Next.js"
```

## Próximos Pasos

Una vez completados los pasos anteriores:

### ✅ Verificación de Fase 0
- `npm run dev` corre sin errores
- Puedes navegar a http://localhost:3000
- Página de inicio se ve correctamente
- No hay errores de variables de entorno en la consola

### 📋 Siguiente: Fase 1 (Layout base + páginas institucionales)

En Fase 1 construiremos:
- Componentes reutilizables (Button, Input, Card, etc.)
- Páginas institucionales: `/nosotros`, `/historia`, `/masoneria`, `/contacto`, etc.
- Contenido placeholder en español con tono institucional

Avísame cuando hayas completado los 6 pasos anteriores y estaré listo para comenzar la Fase 1.

---

**Estado del Proyecto:**
- ✅ Estructura Next.js (App Router, TypeScript, Tailwind)
- ✅ Clientes Supabase (client, server, admin)
- ✅ Configuración base (tsconfig, next.config, tailwind.config)
- ✅ Header y Footer globales
- ✅ Página de inicio (placeholder)
- ✅ Página 404 personalizada
- ⏳ Base de datos (Fase 2)
- ⏳ Repositorio de PDFs (Fase 3)
- ⏳ Panel de administración (Fase 4)
