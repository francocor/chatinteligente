# Estructura del Repositorio - Producto SaaS

## 1. Visión General de la Estructura

Esta estructura está diseñada para un **SaaS multi-tenant profesional** que prioriza:

- **Mantenibilidad**: Código organizado por responsabilidad clara
- **Escalabilidad**: Capacidad de crecer sin reorganizar
- **Separación de responsabilidades**: Cada carpeta tiene un propósito específico
- **Multi-empresa**: Aislamiento nativo de datos por tenant

### Raíz del Proyecto

```
plataforma-atencion-inteligente/
├── apps/                          # Aplicaciones del monorepo
│   ├── api/                       # Backend NestJS
│   ├── web/                       # Frontend Next.js
│   └── widget/                    # Widget embebible (futuro)
│
├── packages/                     # Paquetes共享
│   ├── ui/                        # Biblioteca de componentes
│   ├── config/                   # Configuraciones compartidas
│   ├── types/                     # Tipos TypeScript compartidos
│   └── utils/                     # Utilidades compartidas
│
├── docs/                         # Documentación
├── scripts/                      # Scripts de utilidad (DB, deploy)
├── turbo.json                    # Config Turborepo
├── package.json                   # Workspace root
└── tsconfig.json                 # TypeScript base
```

---

## 2. Estructura del Frontend (apps/web)

### 2.1 Carpeta Principal

**Filosofía**: Next.js App Router con separación por ruta y dominio de negocio.

```
apps/web/
├── src/
│   ├── app/                       # Páginas routing (Next.js App Router)
│   │   ├── (auth)/               # Grupo auth - sin layout de dashboard
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (marketing)/          # Grupo marketing - landing pages
│   │   │   ├── page.tsx          # Landing principal
│   │   │   ├── pricing/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/          # Grupo dashboard - panel admin
│   │   │   ├── layout.tsx        # Layout con sidebar
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── conversations/
│   │   │   ├── agents/
│   │   │   ├── flows/
│   │   │   ├── knowledge/
│   │   │   ├── analytics/
│   │   │   ├── settings/
│   │   │   └── integrations/
│   │   │
│   │   ├── (public)/            # Widget público embebible
│   │   │   └── widget/
│   │   │
│   │   ├── api/                 # Next.js API Routes (proxy al backend)
│   │   │   └── auth/
│   │   │
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx             # Redirect a (marketing)
│   │   └── globals.css          # Estilos globales
│   │
│   ├── components/             # Componentes específicos de features
│   │   ├── ui/                 # Base UI (shadcn/ui style)
│   │   ├── marketing/           # Componentes landing
│   │   ├── dashboard/          # Componentes panel admin
│   │   ├── chat/               # Componentes widget chat
│   │   └── flows/              # Flow builder
│   │
��   ├── hooks/                   # Custom hooks por dominio
│   │   ├── use-auth.ts
│   │   ├── use-conversations.ts
│   │   ├── use-agents.ts
│   │   ├── use-websocket.ts
│   │   └── use-realtime.ts
│   │
│   ├── lib/                    # Utilidades y configuración
│   │   ├── api/               # Cliente HTTP + endpoints
│   │   ├── socket/           # Socket.io client
│   │   ├── utils/            # Funciones utilitarias
│   │   ├── constants/        # Constantes de la app
│   │   └── config/          # Config del cliente
│   │
│   ├── stores/                 # Zustand stores (state global)
│   │   ├── auth-store.ts
│   │   ├── conversation-store.ts
│   │   ├── agent-store.ts
│   │   └── notification-store.ts
│   │
│   ├── types/                  # Tipos específicos del frontend
│   │   ├── conversation.ts
│   │   ├── agent.ts
│   │   └── api.ts
│   │
│   └── styles/                 # Estilos globales
│       ├── globals.css
│       └── theme.css          # Variables CSS
│
├── public/                     # Assets estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

### 2.2 Estructura Detallada de Componentes UI

```
components/
├── ui/                          # ✅ Componentes base reusables
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── modal.tsx
│   ├── dropdown.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── card.tsx
│   ├── skeleton.tsx
│   ├── toast.tsx
│   ├── tabs.tsx
│   ├── table.tsx
│   └── form/
│       ├── field.tsx
│       ├── label.tsx
│       └── error-message.tsx
│
├── marketing/                   # Landing page
│   ├── hero.tsx
│   ├── feature-card.tsx
│   ├── pricing-table.tsx
│   ├── testimonial-carousel.tsx
│   ├── cta-section.tsx
│   └── footer.tsx
│
├── dashboard/                   # Panel administrativo
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   ├── stat-card.tsx
│   ├── metric-chart.tsx
│   ├── conversation-list.tsx
│   ├── conversation-detail.tsx
│   ├── agent-status-badge.tsx
│   ├── queue-monitor.tsx
│   ├── quick-replies.tsx
│   ├── filter-bar.tsx
│   └── search-input.tsx
│
├── chat/                        # Widget de chat
│   ├── chat-widget.tsx          # Botón flotante
│   ├── chat-window.tsx         # Ventana principal
│   ├── message-bubble.tsx
│   ├── message-input.tsx
│   ├── typing-indicator.tsx
│   ├── quick-replies.tsx
│   ├── file-upload.tsx
│   └── header.tsx
│
└── flows/                      # Flow builder
    ├── canvas.tsx
    ├── node-panel.tsx
    ├── node-config.tsx
    ├── connection-line.tsx
    └── nodes/
        ├── message-node.tsx
        ├── condition-node.tsx
        ├── action-node.tsx
        └── trigger-node.tsx
```

### 2.3 Estructura de Páginas por Ruta

```
(app)/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
│
├── (marketing)/
│   ├── page.tsx               # Landing principal
│   ├── pricing/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
│
├── (dashboard)/
│   ├��─ page.tsx               # Dashboard home
│   ├── conversations/
│   │   ├── page.tsx           # Lista conversaciones
│   │   └── [id]/page.tsx      # Detalle conversación
│   ├── agents/
│   │   ├── page.tsx           # Lista agentes
│   │   └── [id]/page.tsx
│   ├── flows/
│   │   ├── page.tsx           # Lista flujos
│   │   ├── builder/page.tsx   # Editor visual
│   │   └── [id]/page.tsx
│   ├── knowledge/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── analytics/
│   │   ├── page.tsx
│   │   └── reports/page.tsx
│   ├── settings/
│   │   ├── page.tsx
│   │   ├── general/page.tsx
│   │   ├── channels/page.tsx
│   │   ├── ai/page.tsx
│   │   ├── branding/page.tsx
│   │   └── billing/page.tsx
│   └── integrations/
│       ├── page.tsx
│       └── [id]/page.tsx
│
└── (public)/
    └── widget/
        └── embed/page.tsx
```

---

## 3. Estructura del Backend (apps/api)

### 3.1 Carpeta Principal

**Filosofía**: Clean Architecture con módulos NestJS por dominio de negocio.

```
apps/api/
├── src/
│   ├── main.ts                 # Bootstrap
│   ├── app.module.ts          # Root module
│   │
│   ├── config/                # Configuración global
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── whatsapp.config.ts
│   │
│   ├── common/               # Código共享 del backend
│   │   ├── decorators/      # Decoradores personalizados
│   │   │   ├── tenant.decorator.ts
│   │   │   ├── user.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   │
│   │   ├── filters/         # Filtros de excepciones
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma.filter.ts
│   │   │
│   │   ├── interceptors/     # Interceptores
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── audit.interceptor.ts
│   │   │
│   │   ├── guards/           # Guards personalizados
│   │   │   ├── tenant.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── throttle.guard.ts
│   │   │
│   │   ├── pipes/           # Pipes de validación
│   │   │   └── validation.pipe.ts
│   │   │
│   │   └── constants/       # Constantes compartidas
│   │
│   ├── modules/             # Módulos por dominio (camelCase)
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── users/
│   │   ├── conversations/
│   │   ├── messages/
│   │   ├── agents/
│   │   ├── flows/
│   │   ├── ai/
│   │   ├── knowledge/
│   │   ├── analytics/
│   │   ├── alerts/
│   │   ├── webhooks/
│   │   ├── chat/
│   │   └── integrations/
│   │
│   ├── services/           # Servicios共享
│   │   ├── audit/
│   │   ├── notification/
│   │   ├── export/
│   │   └── scheduler/
│   │
│   └── infrastructure/     # Implementaciones técnicas
│       ├── prisma/
│       ├── redis/
│       ├── openai/
│       ├── whatsapp/
│       ├── stripe/
│       └── storage/
│
│
├── prisma/
│   ├── schema.prisma         # Schema principal
│   ├── seed.ts             # Seed data
│   └��─ migrations/         # Migraciones
│
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

### 3.2 Estructura Detallada de un Módulo de Dominio

Cada módulo sigue la misma estructura interna:

```
modules/
├── {domain}/                  # Ej: conversations, agents, flows
│   ├── dto/                  # Data Transfer Objects
│   │   ├── create-{domain}.dto.ts
│   │   ├── update-{domain}.dto.ts
│   │   └── {domain}-filter.dto.ts
│   │
│   ├── entities/            # Entidades del dominio (opcional)
│   │   └── {domain}.entity.ts
│   │
│   ├── interfaces/         # Interfaces de repositorio
│   │   └── {domain}-repository.interface.ts
│   │
│   ├── {domain}.module.ts   # Module definition
│   ├── {domain}.service.ts# Lógica de negocio
│   └── {domain}.controller.ts # REST endpoints
│
├── - dto/                 # ✅ Validación entrada
├── - service.ts          # ✅ Lógica negocios
├── - controller.ts     # ✅ Endpoints HTTP
└── - module.ts       # ✅ Inyección dependencias
```

### 3.3 Ejemplo: Módulo de Conversaciones

```
modules/conversations/
├── dto/
│   ├── create-conversation.dto.ts
│   ├── update-conversation.dto.ts
│   └── conversation-filter.dto.ts
│
├── conversation.module.ts
├── conversation.service.ts
│   ├── create()
│   ├── findAll()
│   ├── findOne()
│   ├── update()
│   ├── assign()
│   ├── transfer()
│   ├── resolve()
│   ├── close()
│   └── getMetrics()
│
└── conversation.controller.ts
    ├── POST   /conversations
    ├── GET    /conversations
    ├── GET    /conversations/:id
    ├── PATCH  /conversations/:id
    ├── POST   /conversations/:id/assign/:agentId
    ├── POST   /conversations/:id/transfer/:agentId
    ├── POST   /conversations/:id/resolve
    └── POST   /conversations/:id/close
```

---

## 4. Paquetes Compartidos (packages/)

### 4.1 Biblioteca de Componentes UI

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-dialog.ts
│   │
│   ├── utils/
│   │   ├── cn.ts           # clsx + tailwind-merge
│   │   └── form-utils.ts
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

### 4.2 Tipos Compartidos

```
packages/types/
├── src/
│   ├── index.ts
│   ├── api/
│   │   └── responses.ts     # Tipos respuestas API
│   ├── domain/
│   │   ├── conversation.ts
│   │   ├── agent.ts
│   │   ├── flow.ts
│   │   └── tenant.ts
│   └── shared/
│       ├── pagination.ts
│       └── filter.ts
│
└── package.json
```

### 4.3 Utilidades Compartidas

```
packages/utils/
├── src/
│   ├── date.ts             # Fechas
│   ├── string.ts          # Strings
│   ├── validation.ts     # Regex
│   └── storage.ts      # LocalStorage
│
└── package.json
```

---

## 5. Estructura de Prisma

### 5.1 Schema Principal

```
prisma/
├── schema.prisma                 # Schema completo
│
├── seed.ts                   # Seed para desarrollo
│
├── migrations/               # Migraciones históricas
│   ├── 20240101000000_initial/
│   └── ...
│
├── schemas/                # Schema por módulo (futuro)
│   ├── tenant.prisma
│   ├── conversations.prisma
│   └── ...
│
└── README.md              # Documentación del modelo
```

### 5.2 Organización del Schema

```prisma
// schema.prisma

// ==========================================
// GRUPO 1: CORE - Multi-tenancy y Usuarios
// ==========================================
model Tenant { ... }
model Subscription { ... }
model User { ... }
model Role { ... }

// ==========================================
// GRUPO 2: Conversaciones
// ==========================================
model Conversation { ... }
model Message { ... }

// ==========================================
// GRUPO 3: Flujos y AI
// ==========================================
model Flow { ... }
model Intent { ... }
model KnowledgeDocument { ... }

// ==========================================
// GRUPO 4: Agentes
// ==========================================
model Agent { ... }
model Queue { ... }
model QueueMember { ... }

// ==========================================
// GRUPO 5: Monitoreo
// ==========================================
model AlertRule { ... }
model Alert { ... }
model DailyMetric { ... }

// ==========================================
// GRUPO 6: Configuración
// ==========================================
model ChannelConfig { ... }
model Webhook { ... }

// ==========================================
// GRUPO 7: Auditoría
// ==========================================
model AuditLog { ... }
```

---

## 6. Convenciones de Nombres

### 6.1 Archivos

| Tipo | Naming | Ejemplo |
|------|-------|-------|
| Componentes React | PascalCase | `ConversationList.tsx` |
| Hooks | camelCase con prefijo use | `useConversations.ts` |
| Servicios NestJS | nombre del módulo + .service | `conversations.service.ts` |
| DTOs | operacion + nombre | `CreateConversationDto` |
| Tipos/Interfaces | PascalCase | `Conversation` |
| Utilidades | kebab-case | `format-date.ts` |
| Constantes | SCREAMING_SNAKE | `MAX_CONVERSATIONS` |

### 6.2 Rutas API

```
Método HTTP  | Endpoint                    | Descripción
-----------|----------------------------|------------------
POST        | /conversations             | Crear conversación
GET        | /conversations            | Listar conversaciones
GET        | /conversations/:id       | Obtener una conversación
PATCH      | /conversations/:id      | Actualizar conversación
DELETE    | /conversations/:id      | Eliminar conversación
POST       | /conversations/:id/assign/:agentId | Asignar agente
POST       | /conversations/:id/transfer/:agentId | Transferir
POST       | /conversations/:id/resolve | Resolver
POST       | /conversations/:id/close | Cerrar
```

### 6.3 Nombres en Base de Datos

- Tablas: snake_case `conversations`
- Columnas: snake_case `user_id`
- Índices: `idx_conversations_tenant_status`
- Foreign keys: `fk_conversations_tenant`

---

## 7. Organización por Responsabilidad

### 7.1 Código de Presentación (Frontend)

```
src/
├── app/                    # ✅ Páginas routing
│   └── (dashboard)/
│       └── conversations/   # Página de conversaciones
│
├── components/           # ✅ Componentes visuales
│   └── dashboard/
│       └── conversation-list.tsx
│
├── hooks/               # ✅ Lógica de UI
│   └── use-conversations.ts
│
├── lib/                # ✅ Configuración
│   └── api/
│       └── client.ts
│
└── stores/             # ✅ Estado global
    └── conversation-store.ts
```

### 7.2 Código de Negocio (Backend)

```
modules/
├── conversations/       # ✅ Dominio conversaciones
│   ├── dto/        #  contratos entrada
│   ├── conversation.service.ts  # lógica
│   └── conversation.controller.ts # exposición
│
├── messages/       # ✅ Dominio mensajes
│   └── ...
│
└── agents/       # ✅ Dominio agentes
    └── ...
```

### 7.3 Código de Datos (Infraestructura)

```
infrastructure/
├── prisma/              # ✅ Acceso a datos
│   ├── prisma.service.ts
│   └── repositories/
│
├── redis/             # ✅ Caché
│   └── cache.service.ts
│
└── external/         # ✅ APIs externas
    ├── openai/
    └── whatsapp/
```

---

## 8. Preparado para Multi-Empresa

### 8.1 Aislamiento a Nivel de Código

```typescript
// Cada request tiene contexto de tenant
@Controller('conversations')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ConversationsController {
  // tenantId viene del guard - nunca del params
  async findAll(@Req() req: Request) {
    const tenantId = req.tenant.id; // ✅ Aislamiento automático
    return this.conversationsService.findAll(tenantId, filter);
  }
}
```

### 8.2 Prefijos de Rutas

```
/api/v1/tenants           # Gestión de empresas
/api/v1/auth             # Autenticación
/api/v1/conversations    # API del tenant actual
/api/v1/agents          # (se filtra por tenant automáticamente)
```

---

## 9. Estructura de Archivos de Configuración

### 9.1 Raíz

```
├── turbo.json               # Turborepo config
├── package.json           # Workspace root
├── tsconfig.json         # TypeScript base
├── .eslintrc.js         # ESLint
├── .prettierrc         # Prettier
├── .gitignore
└── docker-compose.yml    # Desarrollo local
```

### 9.2 apps/api/

```
apps/api/
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env/
│   ├── .env.local
│   ├── .env.staging
│   └── .env.production
└── scripts/
    ├── db-reset.sh
    └── seed.sh
```

### 9.3 apps/web/

```
apps/web/
├─��� .env.example
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .env/
│   ├── .env.local
│   └── .env.production
└── public/
    └── locales/       # i18n futuro
```

---

## 10. Resumen de Responsabilidades

| Carpeta | Responsabilidad | Quién la Usa |
|--------|-------------|-------------|
| `components/ui/` | Componentes base atómicos | Todo el frontend |
| `components/dashboard/` | Panel admin | Administradores |
| `modules/conversations/` | Lógica de conversaciones | API + WebSocket |
| `modules/ai/` | Procesamiento IA | Workers |
| `packages/types/` | Definiciones compartidas | Frontend + Backend |
| `prisma/` | Schema de datos | Todos |
| `lib/` | Clientes externos | Módulos que consumen APIs |

---

## 11. Por Qué Esta Estructura

### 11.1 Decisions Clave

1. **Monorepo con turbo**
   - ✅ Compartir código entre apps
   - ✅ Build cacheado
   - ✅ Deploys independientes

2. **Next.js App Router**
   - ✅ Layouts anidados
   - ✅ Route groups con paréntesis ()
   - ✅ Código splitting automático

3. **Módulos NestJS por dominio**
   - ✅ Separan responsabilidad clara
   - ✅测试 modular
   - ✅ Escalable a microservicios

4. **Paquetes separados**
   - ✅ UI reutilizable
   - ✅ Tipos compartidos
   - ✅ Consistencia

5. **Schema Prisma único**
   - ✅ Transacciones ACID
   - ✅ Migraciones ordenadas
   - ✅ Simple en fases tempranas

### 11.2 trade-offs

| Ventaja | trade-off |
|---------|---------|
| Escalable | Más carpetas initially |
| type-safe | Más configuración |
| Flexible | curva de aprendizaje |
| Multi-tenant | Aislamiento obligatorio |

---

**Última actualización**: 2026-04-19