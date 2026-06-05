# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Monorepo Structure

pnpm workspaces + Turborepo. Two apps, one shared namespace:

```
apps/
  web/   — Next.js 14 frontend       (@plataforma/web)
  api/   — NestJS 10 backend         (@plataforma/api)
docs/    — Technical and commercial documentation
```

---

## Commands

### Root (run from repo root)
```bash
pnpm dev              # Start both apps in parallel via Turborepo
pnpm build            # Build both apps
pnpm lint             # Lint both apps
pnpm db:generate      # prisma generate (delegates to api)
pnpm db:migrate       # prisma migrate dev (requires running Postgres)
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Run apps/api/prisma/seed.ts
```

### Frontend only
```bash
pnpm --filter @plataforma/web dev
pnpm --filter @plataforma/web build
pnpm --filter @plataforma/web type-check   # tsc --noEmit
pnpm --filter @plataforma/web test
```

### Backend only
```bash
pnpm --filter @plataforma/api dev          # nest start --watch on port 4000
pnpm --filter @plataforma/api build        # nest build
pnpm --filter @plataforma/api test
```

### Database (Docker)
```bash
docker-compose up -d postgres              # Start only PostgreSQL (port 5432)
docker-compose up -d postgres redis        # Start DB + Redis
docker-compose up -d                       # Full stack (postgres, redis, api, nginx)
```

---

## Architecture

### Frontend — Current State (Demo Mode)

The frontend is a **fully functional commercial demo** running entirely on mock data. There are **no real API calls** to the backend in the current state.

- **Auth**: `apps/web/src/contexts/auth-context.tsx` — context provider that manages JWT tokens in localStorage and handles login/logout/refresh. After `logout()`, state is cleared immediately before the router redirect to prevent auth-state loops.
- **Mock data**: All UI data comes from `apps/web/src/data/mocks/` (analytics, conversations, tickets, flows, knowledge). These drive every dashboard page.
- **localStorage**: Used for demo-mode state persistence (e.g., conversation status changes between list and detail pages via `demo_conv_status_<id>` keys).
- **Route groups**: `(dashboard)` wraps all authenticated pages; `(auth)` wraps login/register. The dashboard `layout.tsx` delegates logout entirely to `useAuth().logout()` — never do manual token clearing in layout.
- **`typedRoutes: false`** in `next.config.js` — permanently disabled, do not re-enable.

### Backend — Current State

NestJS API running on port **4000**. Frontend expects `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`.

**Modules currently ENABLED in `app.module.ts`:**
- `AuthModule`, `TenantsModule`, `UsersModule`
- `ConversationsModule`, `MessagesModule`, `AgentsModule`
- `FlowsModule`, `WebhooksModule`, `ChatModule` (WebSocket)

**Modules currently DISABLED** (commented out, TypeScript errors):
- `AIModule` — `// import { AIModule } from './modules/ai/ai.module'`
- `AnalyticsModule`
- `AlertsModule`

The AI module source exists at `apps/api/src/modules/ai/` with a full engine:
```
ai/
  engine/
    ai-integration.ts
    chat-engine.ts
    context-manager.ts
    flow-executor.ts
    intent-detector.ts
    response-generator.ts
    engine.module.ts
    engine.types.ts
  ai.controller.ts
  ai.service.ts
  ai.module.ts
  ai.dto.ts
  ai-chat.dto.ts
```

This module needs TypeScript fixes before it can be re-enabled.

### Database — Prisma Schema

`apps/api/prisma/schema.prisma` — Multi-tenant PostgreSQL schema. The `Tenant` model is the root of all data: every business entity (User, Conversation, Contact, Ticket, KnowledgeEntry, BotFlow, etc.) has a `tenantId` foreign key.

Key models: `Tenant`, `Subscription`, `User`, `Role`, `Agent`, `Conversation`, `Message`, `Contact`, `Ticket`, `KnowledgeEntry`, `BotFlow`, `Intent`, `ChannelIntegration`, `AnalyticsSnapshot`, `ExportJob`, `Webhook`.

---

## Pending Stash

There is one stash entry that must **not** be popped blindly:

```
stash@{0}: temp backend ai changes
```

**Safe to apply selectively:**
- `apps/api/.env.example` — Adds `AI_PROVIDER="mock"`, rate limits, empty OPENAI vars.
- `apps/api/src/modules/knowledge/knowledge.service.ts` — Adds `searchKnowledge(tenantId, query)` method using Prisma full-text OR search.

**Do NOT apply:**
- `apps/api/src/app.module.ts` from the stash — imports `AiSafeController` and `AiSafeService` from `ai-safe.*` files that do **not exist on disk**.
- `apps/api/tsconfig.tsbuildinfo` — build artifact, discard.

To apply selectively:
```bash
git checkout stash@{0} -- apps/api/.env.example apps/api/src/modules/knowledge/knowledge.service.ts
git stash drop
```

---

## Environment Variables

Copy `apps/api/.env.example` to `apps/api/.env` for local development.

Key variables:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plataforma_atencion"
JWT_SECRET="..."          # min 32 chars in production
JWT_EXPIRES_IN="15m"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
AI_PROVIDER="mock"        # keeps AI in mock mode — no real API calls
OPENAI_API_KEY=""         # leave empty for demo/development
```

Frontend: `apps/web/.env.local` (not committed):
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## Work Rules

### Git
- Never use `git add .` without first reviewing `git status`. Use selective staging: `git add <specific-files>`.
- Never commit `.env`, `.env.local`, `.env.production`, or any file containing real secrets.
- `*.tsbuildinfo`, `build_output.txt`, `.claude/` are in `.gitignore` — do not force-add them.
- Before committing, always run a build to confirm 0 TypeScript errors.

### Schema & Database
- Never modify `apps/api/prisma/schema.prisma` without an approved plan.
- Never run `prisma migrate dev` or `prisma migrate deploy` without explicit user confirmation.
- Never run `prisma db push` on a production database.

### Stash
- Never run `git stash pop` for `stash@{0}` — apply files selectively as documented above.

### Frontend stability
- The demo frontend is complete and stable. Do not break existing routes, mock data, or responsive design while working on backend phases.
- Do not reconnect frontend pages to real API endpoints until the corresponding backend phase is approved and tested.

### Methodology
- Before any significant change: enter **Plan mode** (`/plan`) to design the approach.
- Backend and frontend changes for the same feature belong in the same phase but should be implemented and tested separately before combining.
- Each phase: Plan → Build → `pnpm build` (0 errors) → Review → Commit.
- Work in small, independently testable phases. Never mix unrelated modules in one commit.
