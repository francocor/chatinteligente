# 2. Explicación Técnica para Desarrollador Fullstack

## Arquitectura General del Proyecto

La plataforma sigue una arquitectura **Modular Monolith** con plan de migración a microservicios. Actualmente es un monorepo gestionado con Turborepo/pnpm.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                 │
│  (Web Dashboard, Widget, Mobile App - futuro)          │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    API GATEWAY                          │
│           NestJS (Express + WebSocket)                │
│         REST API + GraphQL (futuro) + Socket.io       │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    BUSINESS MODULES                     │
│  Auth │ Tenants │ Conversations │ Agents │ Flows       │
│  Messages │ Knowledge │ Tickets │ Webhooks │ Chat      │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    DATA LAYER                           │
│  PostgreSQL (Prisma ORM) │ Redis (Cache + PubSub)      │
└─────────────────────────────────────────────────────────┘
```

## Estructura del Monorepo

```
plataforma-atencion-inteligente/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Autenticación JWT
│   │   │   │   ├── tenants/    # Multi-tenancy
│   │   │   │   ├── conversations/
│   │   │   │   ├── messages/
│   │   │   │   ├── agents/
│   │   │   │   ├── flows/
│   │   │   │   ├── knowledge/
│   │   │   │   ├── tickets/
│   │   │   │   ├── webhooks/
│   │   │   │   ├── chat/       # WebSocket gateway
│   │   │   │   ├── ai/         # DESACTIVADO (errores TS)
│   │   │   │   ├── analytics/  # DESACTIVADO (errores TS)
│   │   │   │   └── alerts/     # DESACTIVADO (errores TS)
│   │   │   └── core/
│   │   │       └── security/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/            # App Router (Next.js 14)
│       │   │   ├── (dashboard)/ # Grupo de rutas
│       │   │   ├── (auth)/
│       │   │   └── api/
│       │   ├── components/
│       │   ├── types/
│       │   ├── data/
│       │   │   └── mocks/      # Datos mock (ver sección abajo)
│       │   └── lib/
│       └── package.json
│
├── packages/                   # SHARED PACKAGES (futuro)
│   ├── ui/
│   ├── types/
│   └── utils/
│
├── docs/
├── docker-compose.yml
├── pnpm-workspace.yaml
└── turbo.json
```

## Frontend (apps/web)

### Tecnologías

- **Next.js 14** con App Router (no Pages Router)
- **React 18** con Server Components
- **TypeScript 5.x**
- **Tailwind CSS 3.x** con custom design tokens
- **Zustand** para state management (no Redux)
- **React Query (TanStack)** para data fetching
- **Framer Motion** para animaciones
- **Lucide React** para iconos

### Next.js App Router

La aplicación usa el nuevo sistema de rutas basado en archivos:

```
src/app/
├── layout.tsx           # Root layout
├── page.tsx             # Landing page
├── providers.tsx        # React Query, Zustand providers
├── globals.css
│
├── (auth)/              # Grupo de rutas de autenticación
│   ├── login/
│   │   └── page.tsx
│   └── register/
│   └── forgot-password/
│
└── (dashboard)/         # Grupo de rutas protegidas
    ├── layout.tsx       # Dashboard layout con sidebar
    ├── page.tsx         # Dashboard home
    │
    ├── conversations/
    │   ├── page.tsx     # Lista de conversaciones
    │   └── [id]/        # Carpeta dinámica
    │       └── page.tsx # Conversación individual
    │
    ├── flows/
    │   ├── page.tsx
    │   └── [id]/page.tsx
    │
    ├── tickets/
    │   └── page.tsx
    │
    ├── knowledge/
    │   └── page.tsx
    │
    ├── reports/
    │   └── page.tsx
    │
    ├── alerts/
    ├── exports/
    │
    └── dashboard/       # Sub-dashboard administrativo
        ├── page.tsx
        ├── agents/
        ├── contacts/
        ├── flows/
        ├── knowledge/
        ├── reports/
        └── settings/
```

### Rutas Principales del Frontend

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Landing page marketing | ✅ Funcional |
| `/login` | Login con JWT | ✅ Funcional (sin backend) |
| `/register` | Registro de usuarios | ✅ UI lista |
| `/demo` | Página de demostración | ✅ Funcional |
| `/dashboard` | Home del dashboard | ✅ Funcional |
| `/dashboard/conversations` | Lista de conversaciones | ✅ MOCK |
| `/dashboard/conversations/[id]` | Chat individual | ✅ MOCK |
| `/dashboard/flows` | Gestión de flujos | ✅ MOCK |
| `/dashboard/tickets` | Sistema de tickets | ✅ MOCK |
| `/dashboard/knowledge` | Base de conocimiento | ✅ MOCK |
| `/dashboard/reports` | Reportes y analíticas | ✅ MOCK |
| `/dashboard/alerts` | Configuración de alertas | ✅ MOCK |
| `/dashboard/exports` | Exportación de datos | ✅ MOCK |

## Backend (apps/api)

### Tecnologías

- **NestJS 10** (Node.js + TypeScript)
- **Prisma ORM** (PostgreSQL)
- **JWT** para autenticación
- **Socket.io** para WebSocket
- **class-validator** para validación DTOs
- **Swagger** para documentación API

### Módulos Principales del Backend

#### Módulos Activos ✅
| Módulo | Funcionalidad | Endpoints |
|--------|---------------|-----------|
| `auth` | JWT Authentication, login, register | `/api/v1/auth/*` |
| `tenants` | Multi-tenant management | `/api/v1/tenants/*` |
| `users` | CRUD de usuarios | `/api/v1/users/*` |
| `conversations` | CRUD de conversaciones | `/api/v1/conversations/*` |
| `messages` | Mensajes de conversación | `/api/v1/messages/*` |
| `agents` | Gestión de agentes | `/api/v1/agents/*` |
| `flows` | Motor de flujos guiados | `/api/v1/flows/*` |
| `knowledge` | Base de conocimiento | `/api/v1/knowledge/*` |
| `tickets` | Sistema de tickets | `/api/v1/tickets/*` |
| `chat` | WebSocket gateway | `ws://localhost:4000/chat` |
| `webhooks` | Webhooks externos | `/api/v1/webhooks/*` |

#### Módulos Desactivados ⚠️
| Módulo | Razón | Comentario |
|--------|-------|------------|
| `ai` | Errores de TypeScript | Necesita refactor |
| `analytics` | Errores de TypeScript | Necesita refactor |
| `alerts` | Errores de TypeScript | Necesita refactor |

### Estructura de Módulos NestJS

```typescript
// apps/api/src/modules/conversations/
├── conversations.module.ts  # @Module decorator
├── conversations.controller.ts  # @Controller REST endpoints
├── conversations.service.ts     # Lógica de negocio
├── conversations.dto.ts         # DTOs con validación
└── conversations.repository.ts  # Abstracción de datos (futuro)
```

## TypeScript

- Configuración strict habilitada
- Tipos compartidos en `packages/shared/src` (futuro)
- Tipos del dominio en `apps/web/src/types/`

## Tailwind CSS

- Configuración en `tailwind.config.ts`
- Design tokens en `apps/web/src/styles/design-tokens.css`
- Paleta personalizada con colores primarios:
  - Primary: `#0ea5e9` (sky-500)
  - Colors semánticos: success, warning, danger

## NestJS

- Arquitectura modular
- Dependency Injection nativa
- Guards: `JwtAuthGuard`, `RolesGuard`
- Interceptors para logging y transformación
- Pipes de validación con class-validator

## Prisma

- Schema definido en `apps/api/prisma/` (falta verificar)
- Tablas multi-tenant con `tenant_id` en cada tabla
- Tipos Prisma generados automáticamente

## PostgreSQL

- PostgreSQL 15 recomendado
- Extensiones: uuid-ossp, pgvector (para embeddings)
- Índices estratégicos para performance

## Docker

```yaml
# docker-compose.yml services
postgres:    # Base de datos
redis:       # Cache y Pub/Sub
api:         # Backend NestJS
nginx:       # Reverse proxy
```

## pnpm

Gestor de paquetes con workspaces para monorepo.

## Autenticación con JWT

### Flujo
1. Login con email/password → validación en backend
2. Backend genera JWT con payload: `{ userId, tenantId, role }`
3. Frontend almacena JWT en cookie httpOnly
4. Cada request incluye `Authorization: Bearer <token>`
5. Guards validan token y extraen usuario

### Guards
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'AGENT')
@Get('conversations')
async findAll(@Req() req) {
  // req.user contiene datos del JWT
}
```

## TenantId / Multitenancy

Estrategia **Shared Database, Shared Schema**:

- Cada tabla tiene columna `tenant_id UUID NOT NULL`
- Todos los queries incluyen filtro por `tenant_id`
- Middleware/interceptor inyecta `tenantId` en requests

```typescript
// Ejemplo de query Prisma
await prisma.conversation.findMany({
  where: {
    tenant_id: currentTenantId,  // filtro obligatorio
    status: 'ACTIVE'
  }
})
```

## Flujo Esperado de Datos

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │    API      │     │   BASE      │
│  (Next.js)   │────▶│  (NestJS)   │────▶│ (PostgreSQL)│
│             │     │             │     │             │
│ 1. Usuario  │     │ 2. Validar  │     │ 4. Query    │
│ accede      │     │ JWT         │     │ con tenantId│
│ a /dashboard│     │ filtra por  │     │             │
└─────────────┘     │ tenantId    │     └─────────────┘
                    │             │           │
                    │ 3. Prisma   │◀──────────┘
                    │ ORM query   │
                    └─────────────┘     ┌─────────────┐
                                          │   REDIS     │
                                          │ (Cache)     │
                                          └─────────────┘
                                            ▲      │
                          Actualización   │      │ Lectura
                          de cache          │      │
                                            └──────┘
```

**NOTA**: Actualmente el frontend usa MOCKS en lugar de conectar al backend. Ver sección "Qué partes usan mocks".

## Qué Partes Usan Mocks

### Frontend (100% mock)

Todas las páginas del dashboard consumen datos mock:

```typescript
// apps/web/src/data/mocks/
├── conversations.ts    # Conversaciones, mensajes, agentes
├── tickets.ts         # Tickets de soporte
├── flows.ts           # Flujos guiados
├── knowledge.ts       # Artículos de conocimiento
├── analytics.ts       # Datos de analíticas
├── reports.ts         # Datos de reportes
└── settings.ts        # Configuraciones
```

**Ejemplo de uso en componente:**
```typescript
import { mockConversations } from '@/data/mocks/conversations'

export default function ConversationsPage() {
  // Usa datos mock en lugar de API call
  return mockConversations.map(conv => ...)
}
```

### Backend (sin datos mock, pero módulos desactivados)

Los módulos `ai`, `analytics` y `alerts` están importados pero comentados en `app.module.ts` debido a errores de TypeScript.

## Qué Partes Deben Conectarse al Backend

### Prioridad Alta

1. **Autenticación** (`/login`, `/register`)
   - POST `/api/v1/auth/login`
   - POST `/api/v1/auth/register`

2. **Conversaciones** (`/dashboard/conversations`)
   - GET `/api/v1/conversations`
   - GET `/api/v1/conversations/:id`
   - PUT `/api/v1/conversations/:id`

3. **Flujos** (`/dashboard/flows`)
   - GET `/api/v1/flows`
   - POST `/api/v1/flows`
   - PUT `/api/v1/flows/:id`

### Prioridad Media

4. **Tickets** (`/dashboard/tickets`)
5. **Knowledge Base** (`/dashboard/knowledge`)
6. **Reportes** (`/dashboard/reports`)
7. **Alertas** (`/dashboard/alerts`)

### Prioridad Baja

8. **WebSocket Chat** (`ChatGateway`)
   - Conexión Socket.io
   - Suscripción a rooms de conversación

## Cómo Levantar Frontend y Backend

### Requisitos Previos

- Node.js 18+
- pnpm 8+
- Docker (para PostgreSQL y Redis)

### Levantar Backend

```bash
# 1. Clonar y entrar al proyecto
git clone <repo-url>
cd plataforma-atencion-inteligente

# 2. Copiar .env.example
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Levantar PostgreSQL con Docker
docker-compose up -d postgres redis

# 4. Instalar dependencias
pnpm install

# 5. Generar cliente Prisma
cd apps/api
npx prisma generate
npx prisma migrate dev

# 6. Iniciar backend en modo desarrollo
npm run start:dev
# API disponible en http://localhost:4000
# Docs en http://localhost:4000/api/docs
```

### Levantar Frontend

```bash
# En otra terminal
cd apps/web

# Instalar dependencias (si no se usó pnpm install en raíz)
pnpm install

# Iniciar en modo desarrollo
pnpm dev
# Web disponible en http://localhost:3000
```

### Con Docker Compose (Alternativa)

```bash
# Levvanta todo el stack (postgres, redis, api)
docker-compose up -d

# Frontend por separado
cd apps/web
pnpm dev
```

## Credenciales Demo

```env
# Backend (.env dentro de apps/api/)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="15m"

# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plataforma_atencion"

# Frontend (.env.local dentro de apps/web/)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000/chat
```

**Nota**: Las credenciales reales deben crearse en la base de datos ejecutando los seeds o creando usuarios manualmente.

## Pendientes Técnicos

### Críticos (Bloquean producción)

1. **Resolver errores TypeScript en módulos AI/Analytics/Alerts**
   - Archivos: `apps/api/src/modules/ai/**/*`, `analytics/**/*`, `alerts/**/*`
   - Impacto: Funcionalidades de IA y reportes no disponibles

2. **Implementar Prisma Client y migrations**
   - Schema Prisma falta o está incompleto
   - Sin BD migrada, backend no funciona

3. **Conectar frontend a backend (eliminar mocks)**
   - Reemplazar `mockConversations` etc. con API calls
   - Agregar React Query hooks

4. **Autenticación funcional**
   - Crear usuarios seed
   - Login que valide contra BD

### Altos

5. **WebSocket Gateway funcional**
   - `ChatGateway` necesita testing
   - Rooms por conversación

6. **Middleware de tenantId**
   - Interceptor/Guard para inyectar tenant en queries

7. **Validación de roles y permisos**
   - Sistema RBAC completo

8. **Tests unitarios y e2e**
   - Jest configurado pero sin tests

### Medios

9. **Dockerfile productivo**
   - Multi-stage build optimizado

10. **Variables de entorno en producción**
    - Secrets management

11. **Documentación OpenAPI/Swagger**
    - Completar DTOs con decoradores

12. **Sistema de refresh tokens**
    - Rotación de tokens JWT