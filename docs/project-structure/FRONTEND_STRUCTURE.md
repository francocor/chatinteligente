# Estructura Frontend - Landing Page & Dashboard

## Estructura General del Proyecto Frontend

```
medical-ai-platform/
├── app/                           # Next.js 14+ App Router
│   ├── (auth)/                   # Auth group (layout compartido)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Auth layout (sin navbar)
│   │
│   ├── (marketing)/              # Marketing pages group
│   │   ├── layout.tsx            # Marketing layout (con header/footer)
│   │   ├── page.tsx              # Landing page home
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/              # Dashboard pages (requiere auth)
│   │   ├── layout.tsx            # Dashboard layout (sidebar + navbar)
│   │   ├── overview/
│   │   │   └── page.tsx          # Dashboard principal
│   │   ├── conversations/
│   │   │   ├── page.tsx          # Lista de conversaciones
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Detalle conversación
│   │   ├── agents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── flows/
│   │   │   ├── page.tsx
│   │   │   ├── builder/
│   │   │   │   └── page.tsx      # Flow builder canvas
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── knowledge/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── analytics/
│   │   │   ├── page.tsx
│   │   │   └── reports/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── general/
│   │   │   │   └── page.tsx
│   │   │   ├── channels/
│   │   │   │   └── page.tsx
│   │   │   ├── ai-config/
│   │   │   │   └── page.tsx
│   │   │   ├── branding/
│   │   │   │   └── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx
│   │   └── integrations/
│   │       └── page.tsx
│   │
│   ├── api/                      # API Routes (server actions, webhooks)
│   │   ├── auth/
│   │   │   ├── route.ts          # /api/auth/login, logout
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   ├── conversations/
│   │   │   └── route.ts
│   │   ├── agents/
│   │   │   └── route.ts
│   │   └── ...
│   │
│   ├── components/               # Shared UI components
│   │   ├── ui/                   # Base components (shadcn/ui style)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── skeleton-loader.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── filter-dropdown.tsx
│   │   │   └── chart-card.tsx
│   │   │
│   │   ├── marketing/            # Components específicos de marketing
│   │   │   ├── navbar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── feature-section.tsx
│   │   │   ├── pricing-card.tsx
│   │   │   ├── testimonial-card.tsx
│   │   │   ├── cta-section.tsx
│   │   │   ├── footer.tsx
│   │   │   └── demo-request-modal.tsx
│   │   │
│   │   ├── chat/                 # Componentes del widget y chat
│   │   │   ├── chat-widget.tsx   # Widget embeddable
│   │   │   ├── chat-window.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── typing-indicator.tsx
│   │   │   ├── quick-replies.tsx
│   │   │   └── file-upload.tsx
│   │   │
│   │   ├── dashboard/            # Componentes del dashboard
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── metric-chart.tsx
│   │   │   ├── conversation-list.tsx
│   │   │   ├── agent-status-badge.tsx
│   │   │   ├── queue-monitor.tsx
│   │   │   └── suggested-replies.tsx
│   │   │
│   │   ├── flows/                # Flow builder
│   │   │   ├── flow-canvas.tsx
│   │   │   ├── node-component.tsx
│   │   │   ├── node-types/
│   │   │   │   ├── message-node.tsx
│   │   │   │   ├── question-node.tsx
│   │   │   │   ├── condition-node.tsx
│   │   │   │   └── action-node.tsx
│   │   │   ├── connection-line.tsx
│   │   │   └── property-panel.tsx
│   │   │
│   │   ├── analytics/            # Componentes de gráficos
│   │   │   ├── line-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   ├── pie-chart.tsx
│   │   │   ├── funnel-chart.tsx
│   │   │   ├── heatmap.tsx
│   │   │   └── data-table-advanced.tsx
│   │   │
│   │   └── forms/                # Formularios reutilizables
│   │       ├── tenant-setup-form.tsx
│   │       ├── agent-form.tsx
│   │       ├── flow-form.tsx
│   │       ├── knowledge-document-form.tsx
│   │       ├── integration-form.tsx
│   │       └── report-config-form.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-conversations.ts
│   │   ├── use-agents.ts
│   │   ├── use-analytics.ts
│   │   ├── use-websocket.ts
│   │   ├── use-realtime.ts
│   │   ├── use-permissions.ts
│   │   ├── use-tenancy.ts
│   │   ├── use-infinite-scroll.ts
│   │   ├── use-debounce.ts
│   │   ├── use-file-upload.ts
│   │   └── use-theme.ts
│   │
│   ├── lib/                      # Utilidades y helpers
│   │   ├── api/
│   │   │   ├── client.ts         # Axios/Fetch instance
│   │   │   ├── endpoints.ts      # API endpoint definitions
│   │   │   ├── auth.ts           # Auth helpers (login, logout)
│   │   │   └── socket.ts         # Socket.io client config
│   │   ├── utils/
│   │   │   ├── format-date.ts
│   │   │   ├── format-time.ts
│   │   │   ├── format-currency.ts
│   │   │   ├── truncate-text.ts
│   │   │   ├── cn.ts             # clsx + tailwind-merge
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts      # App constants (status, channels)
│   │   │   └── errors.ts
│   │   ├── constants/
│   │   │   ├── routes.ts         # Named routes
│   │   │   ├── feature-flags.ts
│   │   │   └── pricing-plans.ts
│   │   └── hooks/
│   │       └── use-media-query.ts
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── conversation.ts
│   │   ├── agent.ts
│   │   ├── message.ts
│   │   ├── tenant.ts
│   │   ├── user.ts
│   │   ├── analytics.ts
│   │   ├── flow.ts
│   │   ├── api.ts
│   │   └── common.ts
│   │
│   ├── stores/                   # State management (Zustand/Context)
│   │   ├── auth-store.ts
│   │   ├── conversation-store.ts
│   │   ├── agent-store.ts
│   │   ├── notification-store.ts
│   │   └── ui-store.ts
│   │
│   ├── styles/                   # Global styles and theme
│   │   ├── globals.css           # Tailwind imports + base styles
│   │   ├── theme.css             # CSS variables for theming
│   │   └── animations.css        # Keyframe animations personalizadas
│   │
│   ├── public/                   # Static assets
│   │   ├── images/
│   │   │   ├── logo/
│   │   │   │   ├── logo-dark.svg
│   │   │   │   ├── logo-light.svg
│   │   │   │   └── logo-icon.svg
│   │   │   ├── hero/
│   │   │   │   └── hero-medical-bg.jpg
│   │   │   ├── testimonials/
│   │   │   ├── features/
│   │   │   └── illustrations/
│   │   │       ├── chatbot-illustration.svg
│   │   │       ├── analytics-illustration.svg
│   │   │       └── whatsapp-integration.svg
│   │   ├──icons/
│   │   │   ├── social/
│   │   │   ├── ui/
│   │   │   └── brand/
│   │   └── fonts/
│   │
│   ├── layout.tsx                # Root layout (HTML head, font loading)
│   ├── page.tsx                  # Landing page (root)
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Error boundary
│
├── packages/                      # Shared packages (monorepo)
│   ├── ui/                       # Component library shared
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                    # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── conversation.ts
│   │   │   ├── agent.ts
│   │   │   ├── api.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                   # Shared config
│       ├── tailwind.config.js
│       ├── eslint.config.js
│       ├── typescript.config.json
│       └── jest.config.js
│
├── .env.local                    # Environment variables (example)
├── .env.production
├── .env.staging
├── .env.example
│
├── .env.test
├── .gitignore
├── next.config.js                # Next.js config (rewrites, images, env)
├── next.config.mjs               # ESM config
├── tailwind.config.ts            # Tailwind config with theme
├── postcss.config.js
├── tsconfig.json                 # Base tsconfig
├── tsconfig.app.json             # App-specific
├── tsconfig.node.json
│
├── package.json
├── package-lock.json
├── pnpm-workspace.yaml           # If using pnpm monorepo
├── yarn.lock
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── staging-deploy.yml
│       └── production-deploy.yml
│
├── turbo.json                    # Turborepo config (if used)
├── nx.json                       # Nx config (if used)
│
└── README.md
```

---

## Justificación de Estructura

### 1. **App Router Groups (/)**
Lógica de Next.js 14+ para agrupar layouts:
- `(auth)`: Pages que NO requieren navbar de dashboard
- `(marketing)`: Páginas públicas (landing, pricing, about)
- `(dashboard)`: Pages protegidas con layout de sidebar/navbar
- Ventaja: layouts anidados, compartimiento sin colocar lógica en cada page

### 2. **Feature-Based Organization**
Cada funcionalidad en su carpeta:
- `/conversations/` → listado y detalle
- `/flows/` → builder y lista
- `/analytics/` → dashboards y reportes
- Escalable: agregar nueva feature sin mezclar con otras

### 3. **Component Structure**
- `/components/ui/`: Base UI atoms (shadcn/ui style) reutilizables
- `/components/marketing/`: Solo para landing page
- `/components/dashboard/`: UI específico del panel admin
- `/components/flows/`: Builder visual complejo
- `/components/chat/`: Widget + chat window
- Separation of concerns: marketing ≠ dashboard ≠ chat

### 4. **Shared Packages (/)**
Monorepo pattern with workspaces:
- `packages/ui`:Biblioteca de componentes UI compartida entre marketing y dashboard
- `packages/types`: Definiciones TypeScript compartidas entre frontend y backend
- `packages/config`: Configs ESLint, Prettier, Tailwind consistentes
- Beneficio: Reutilización, consistencia,DRY

### 5. **State Management (Zustand)**
- `stores/*.ts`: Global state (auth, conversations, notifications)
- Context API solo para theme/language
- Zustand simple, type-safe, no boilerplate
- Cada store maneja su propio slice

### 6. **Custom Hooks**
- Hooks específicos por dominio (`use-conversations.ts`)
- Hooks genéricos (`use-debounce.ts`, `use-media-query.ts`)
- Encapsulan lógica de API + state + side effects

### 7. **API Layer**
- `/app/api/`: Server Actions (Next.js 14+) para mutaciones
- `/lib/api/`: Cliente HTTP (axios instance) para consumo desde cliente
- Endpoint definitions centralizadas en `lib/api/endpoints.ts`

### 8. **Type Safety**
- `types/`: Interfaces TypeScript para cada entidad
- Generación automática desde backend Prisma schema (opcional)
- Stricto mode en tsconfig

### 9. **Theming & Design System**
- Tailwind CSS con `theme.css` variables CSS
- Dark mode ready (media query or class strategy)
- Design tokens en tailwind.config.ts
- Colores primarios: Azul médico (#0ea5e9) + verde éxito (#10b981)

### 10. **Asset Organization**
- `/public/images/`: Organizado por contexto
- SVG icons en `/public/icons/` (tree-shakeable)
- Optimización automática Next.js Image component

### 11. **SEO & Meta**
- `metadata.ts` exports en cada page (SEO titles, descriptions)
- Generación dinámica de OG images (con Vercel OG o Satori)
- Sitemap.xml y robots.txt generados automáticamente

---

## Convenciones de Nombres

### 1. **Componentes**
- `PascalCase` para archivos de componente: `ChatWidget.tsx`
- `kebab-case` para archivos no-componente: `format-date.ts`
- Componentes de UI base: `Button.tsx`, `Input.tsx`
- Componentes de feature: `ConversationList.tsx`, `FlowBuilder.tsx`

### 2. **Hooks**
- Prefijo `use`: `useConversations.ts`, `useWebSocket.ts`
- Nombre describe el estado/acción: `useDebounce`, `useLocalStorage`

### 3. **Stores (Zustand)**
- Sufijo `-store`: `auth-store.ts`, `conversation-store.ts`

### 4. **Tipos**
- `PascalCase` para interfaces/types: `Conversation.ts`, `Message.ts`
- Archivo `index.ts` re-exporta todos los tipos del módulo

### 5. **Utilidades**
- `camelCase` para funciones: `formatDate()`, `truncateText()`
- Agrupadas por dominio en `lib/utils/`

### 6. **Páginas (App Router)**
- `page.tsx` para ruta principal
- `[param]` para dynamic routes (ej: `[id]/page.tsx`)
- `layout.tsx` para layouts compartidos

### 7. **Assets**
- Imágenes: `kebab-case` o descriptivo: `hero-medical-bg.jpg`
- SVG icons: `kebab-case`: `chat-bubble.svg`, `user-plus.svg`
- Logos: `logo-{variant}.{ext}`

### 8. **Styles**
- Global: `globals.css`
- Component-scoped: CSS modules `Component.module.css` (si se necesita)
- Tailwind classes directamente en JSX (no archivos CSS por componente)

---

## Organización por Dominio (Feature-First)

Cada feature (conversaciones, flujos, analíticas) contiene:

```
app/
  └── (dashboard)/
      └── conversations/
          ├── page.tsx                # Lista principal
          ├── layout.tsx              # Layout específico (filtros, header actions)
          ├── components/             # Componentes SOLO de conversaciones
          │   ├── conversation-card.tsx
          │   ├── message-list.tsx
          │   ├── conversation-filters.tsx
          │   └── typing-indicator.tsx
          ├── hooks/                  # Hooks específicos
          │   └── use-conversation-detail.ts
          └── types.ts                # Types específicos del dominio
```

**Ventaja:** Co-location: todo lo relacionado a conversaciones en un lugar. Cambios en feature no afecta otras carpetas.

---

## Performance & Bundle Considerations

### 1. **Code Splitting Automático**
- Next.js auto-code-split por página
- Lazy loading de components pesados:
  ```typescript
  const FlowBuilder = dynamic(() => import('@/components/flows/flow-canvas'), {
    loading: () => <SkeletonLoader />,
    ssr: false // Canvas no necesita SSR
  });
  ```

### 2. **Image Optimization**
- `next/image` para optimización automática (WebP, sizes)
- Imágenes en `/public/` para estáticas
- CDN externo para assets pesados (vídeos, large images)

### 3. **Dynamic Imports para Lujo/Premium**
- Charting libraries (recharts, victory) solo en analytics pages
- Flow editor canvas solo cuando se usa
- Reduce bundle size inicial

### 4. **Tree Shaking**
- Import named exports: `import { Button } from '@/components/ui'`
- No `import * as`
- ExportIndividual en `index.ts` de cada package

### 5. **Bundle Analysis**
- `next-bundle-analyzer` para monitorear tamaño
- Límite: <200KB initial JS (gziped)
- Critical: Marketing landing ligera (<100KB)

---

## SEO & Marketing Considerations

### Landing Page (Marketing)
- `app/(marketing)/layout.tsx`: Meta tags globales
- Cada sección usa `section` con IDs para anchor navigation
- OG images dinámicas para compartir en redes
- JSON-LD structured data para `Organization`, `Product`, `FAQ`

### Dashboard
- Metas no-index (no se indexa por SEO)
- `robots.txt`: `Disallow: /dashboard/`
- Sitemap excluye rutas privadas

---

## Accesibilidad (a11y)

### Componentes UI
- `components/ui/`: Cumplen WCAG 2.1 AA
- `button.tsx`: keyboard focus, aria-labels
- `modal.tsx`: trap focus, aria-modal
- `form-inputs`: labels, error announcements

### Dashboard
- Navegación por teclado en listas/tablas
- ARIA labels en icon buttons
- Contrast ratios 4.5:1 mínimo

---

## Testing Structure

```
__tests__/
├── unit/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── ChatWidget.test.tsx
│   ├── hooks/
│   │   └── use-conversations.test.ts
│   └── utils/
│       └── format-date.test.ts
├── integration/
│   ├── conversation-flow.test.ts
│   └── agent-assignment.test.ts
├── e2e/
│   ├── landing-page.e2e.ts
│   ├── login-flow.e2e.ts
│   └── conversation-creation.e2e.ts
└── fixtures/
    ├── mock-conversations.ts
    ├── mock-agents.ts
    └── mock-tenants.ts
```

---

## Internationalization (i18n) - Futuro

```
locales/
├── es/
│   ├── common.json
│   ├── landing.json
│   ├── dashboard.json
│   └── errors.json
├── en/
│   └── ...
└── pt/
    └── ...

# Usage: useTranslations('landing') hook
# Next.js 15+ app i18n routing o next-intl
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000

# Features
NEXT_PUBLIC_FEATURE_WHATSAPP=true
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_FLOW_BUILDER=true

# Analytics & Monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX

# Design Tokens
NEXT_PUBLIC_PRIMARY_COLOR=#0ea5e9
NEXT_PUBLIC_LOGO_URL=/images/logo/logo-dark.svg
```

---

## Scripts NPM

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "preview": "next build && next start",
    "analyze": "ANALYZE=true next build",
    "generate:component": "turbo gen component",
    "clean": "rm -rf .next node_modules/.cache"
  }
}
```

---

## CI/CD Integration

### Pre-commit Hooks (Husky + lint-staged)
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  }
}
```

### GitHub Actions Workflow
- On `push` to `main`: build, test, deploy to staging
- On `pull_request`: build + test + lint
- On `create tag`: deploy to production

---

**Conclusión:** Esta estructura promueve:
- ✅ Separación clara marketing vs dashboard
- ✅ Escalabilidad: agregar features sin reorganizar
- ✅ Mantenibilidad: domain-driven folders
- ✅ Colaboración: multiples devs pueden trabajar aisladamente
- ✅ Performance: code splitting, lazy loading
- ✅ SEO: marketing pages optimizadas
- ✅ Multi-tenant: middleware + context injection
- ✅ Testing: unit + integration + e2e organizados
