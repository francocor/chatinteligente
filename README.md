# 🏥 Plataforma de Atención Inteligente

<div align="center">

[![Plataforma de Atención Inteligente](https://img.shields.io/badge/Plataforma-Atención%20Inteligente-0ea5e9?style=for-the-badge&logo=medical)](https://clinica-demo.netlify.app)
[![NestJS](https://img.shields.io/badge/Stack-NestJS-E0234D?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Stack-Next.js-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Stack-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)

*Asistente virtual con IA para centros de salud, clínicas y hospitals*

[📺 Demo](https://clinica-demo.netlify.app) • [📱 Dashboard](https://clinica-demo.netlify.app/login) • [📖 Docs](docs/)

</div>

---

## 🙋‍♀️ Para Gente No Técnica (Resumen Ejecutivo)

### ¿Qué es esta plataforma?

Es un **asistente virtual inteligente** que funciona como un recepcionista digital disponible **24/7** para clínicas médicas, centros de salud y hospitales. Habla con los pacientes a través de WhatsApp, Web, Instagram o cualquier canal, y puede:

- 📅 **Agendar turnos** automáticamente
- 🏥 **Dar información** sobre especialidades y médicos
- 🕐 **Decir horarios** de atención
- 💳 **Consultar coberturas** de isapres
- 🧪 **Explicar preparaciones** para exámenes
- 🤖 **Resolver dudas** con inteligencia artificial
- 👤 **Derivar a un humano** cuando sea necesario

### ¿Por qué lo necesito?

1. **Menor espera**: Los pacientes resuelven sus dudas al instante, a cualquier hora
2. **Más eficiencia**: El recepcionista humano se enfoca en casos complejos
3. **Mejor atención**: Respuestas consistentes, sin errores
4. **Multi-canal**: Funciona en WhatsApp, web, Instagram y más
5. **Historial completo**: Toda conversación queda registrada
6. **Analíticas**: Sabés exactamente qué preguntan los pacientes

### ¿Cuánto cuesta?

El precio depende del tamaño de tu centro y funcionalidades necesarias. Contáctanos para una cotización personalizada.

---

## 👨‍💻 Para Personas Técnicas (Documentación Técnica)

### 📋 Descripción General

**Plataforma de Atención Inteligente** es un SaaS multi-tenant построенный sobre **NestJS + Next.js** que proporciona un sistema completo de atención al cliente con chatbot híbrido para el sector salud.

El sistema integra:
- 🤖 **Chatbot con IA** (GPT-4 compatible)
- 👥 **Atención humana** fluida
- 📊 **Analíticas avanzadas**
- 📥 **Reportes exportables** (CSV, Excel, PDF)
- 📱 **Omnicanalidad** (Web, WhatsApp, Instagram, Facebook, Email, Telegram)

### Problema que Resuelve

Los centros de salud enfrentan altos volúmenes de consultas repetitivas que saturan al personal:
- "¿Qué horarios atienden?"
- "¿Cómo solicito un turno?"
- "¿Aceptan mi isapre?"

Estas consultas son predecibles y pueden automatizarse, liberando al equipo humano para casos complejos que requieren empatía y criterio profesional.

### Propuesta de Valor

| Para el Centro | Para el Paciente |
|--------------|------------------|
| Reducción de hasta 70% en consultas básicas | Respuesta inmediata 24/7 |
| Equipos más productivos | Información consistente |
| Analíticas integradas | Experiencia personalizada |
| Multi-canal unificado | Comunicación en su canal preferido |

### Stack Tecnológico

```
┌──────────���──────────────────────────────────────────────────────────┐
│                         FRONTEND                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js 14        │  React 18        │  TypeScript       │  Tailwind │
│  Framer Motion     │  Zustand        │  React Hook Form  │  Lucide   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND                                    │
├─────────────────────────────────────────────────────────────────────┤
│  NestJS 10        │  TypeScript       │  Prisma ORM       │  Swagger │
│  class-validator │  class-transformer│  Passport JWT    │  Schedule │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE                                   │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL 15    │  Redis (cache)   │  Amazon S3 (files)         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         INFRASTRUCTURE                              │
├─────────────────────────────────────────────────────────────────────┤
│  Docker           │  Docker Compose  │  GitHub Actions  │  AWS/GCP   │
└─────────────────────────────────────────────────────────────────────┘
```

### Arquitectura General

```
                    ┌─────────────────────────────────────┐
                    │         CLIENTS                      │
                    │  (Web, WhatsApp, Instagram, etc.)   │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │         API GATEWAY                 │
                    │    (NestJS + JWT + Rate Limit)      │
                    └──────────────────┬──────────────────┘
                                       │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
    ┌────▼────────────┐       ┌──────▼──────────┐      ┌──────▼────────┐
    │   CHAT ENGINE  │       │   ANALYTICS       │      │   TICKETS     │
    │  - Intent     │       │   - KPIs         │      │   - CRUD      │
    │  - Flow Exec │       │   - Reports      │      │   - SLA       │
    │  - Context   │       │   - Export      │      │   - Alerts    │
    └──────────────┘       └─────────────────┘      └───────────────┘
         │
         ▼
    ┌────▼────────────┐       ┌─────────────────┐      ┌───────────────┐
    │  KNOWLEDGE BASE │       │   DATABASE      │      │   WHATSAPP   │
    │  - FAQ          │       │   PostgreSQL    │      │   Cloud API  │
    │  - Articles     │       │   - Tenants    │      │   (Future)  │
    │  - RAG          │       │   - Users      │      └───────────────┘
    └─────────────────┘       │   - Conv...
                             └─────────────────┘
```

### Estructura del Proyecto

```
plataforma-atencion-inteligente/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/             # Páginas (dashboard, settings, etc.)
│   │   │   ├── components/       # Componentes React
│   │   │   ├── types/          # Tipos TypeScript
│   │   │   ├── data/            # Datos mock
│   │   │   └── lib/            # Utilidades
│   │   └── package.json
│   │
│   └── api/                    # Backend NestJS
│       ├── src/
│       │   ├── core/           # Módulos core (auth, security)
│       │   ├── modules/        # Funcionalidades
│       │   │   ├── auth/       # Autenticación
│       │   │   ├── conversations/
│       │   │   ├── analytics/
│       │   │   ├── tickets/
│       │   │   ├── knowledge/
│       │   │   ├── flows/
│       │   │   ├── whatsapp/  # (Future integration)
│       │   │   └── export/
│       │   ├── prisma/
│       │   └── main.ts
│       └── package.json
│
├── docs/                        # Documentación
│   ├── WHATSAPP-INTEGRATION.md
│   ├── REPORTS-MODULE.md
│   └── PRODUCTION-CHECKLIST.md
│
├── .env.example                # Variables de entorno
├── docker-compose.yml          # Docker Compose
├── .github/workflows/          # CI/CD
└── README.md
```

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/francocor/ChatInteligente.git
cd ChatInteligente

# 2. Instalar dependencias
npm install
cd apps/api && npm install
cd ../web && npm install
cd ../..

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Iniciar base de datos
docker-compose up -d postgres

# 5. Generar cliente Prisma
cd apps/api
npx prisma generate
npx prisma migrate dev

# 6. Iniciar backend
npm run start:dev

# 7. En otra terminal, iniciar frontend
cd apps/web
npm run dev
```

### Variables de Entorno (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/clinica"

# Auth
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"

# API
PORT=3000
API_URL="http://localhost:3000"

# OpenAI (Optional)
OPENAI_API_KEY="sk-..."
```

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Build completo |
| `npm run lint` | Linting |
| `npm run typecheck` | Verificación de tipos |
| `npm run test` | Tests |

### Roadmap del Proyecto

```
✅ Funcionalidades Core
├── ✅ Autenticación y RBAC
├── ✅ Sistema de conversaciones
├── ✅ Chatbot híbrido con IA
├── ✅ Módulo de Flujos (Flow Builder)
├── ✅ Centro de Conversaciones
├── ✅ Tickets y alertas
├── ✅ Base de Conocimiento
├── ✅ Analíticas dashboard
├── ✅ Reportes descargables
└── ✅ Configuración multi-tenant

🚧 En Desarrollo
├── Integración WhatsApp Cloud API
└── Exportación PDF avanzada

📋 Próximas Funcionalidades
├── WhatsApp Cloud API
├── Webhooks avanzados
├── Machine Learning para predicciones
├── Integración con CRM (HubSpot)
├── Chat en tiempo real (WebSocket)
└── Voice AI ( Voz)
```

### Casos de Uso Implementados

| Caso | Descripción | Flujo |
|------|-------------|-------|
| **Sacar turno** | Paciente agenda hora | Bot → collects datos → verifica → confirma |
| **Consultar especialidad** | Lista de especialidades | Bot → quick replies → deriva |
| **Ver horarios** | Horarios de atención | Bot → KB lookup → responde |
| **Consultar obra social** | Isapres aceptadas | Bot → KB lookup → lista |
| **Preparaciones** | Para estudios | Bot → KB lookup → instrucciones |
| **Hablar con recepción** | Derivar a humano | Bot → detecta keywords → handoff |
| **Urgencia** | Caso urgente | Bot → detecta urgencia → escala |

### Motor Híbrido del Chatbot

```
          MENSAJE DEL USUARIO
                 │
                 ▼
    ┌────────────────────────────┐
    │    INTENT DETECTOR         │
    │  - Matching exacto        │
    │  - Matching parcial       │
    │  - Fuzzy matching          │
    │  - Sentiment analysis     │
    └────────────┬─────────────┘
                 │
      ┌─────────┴─────────┐
      ▼                 ▼
 ┌────────┐      ┌──────────────┐
 │ FLOW   │      │ KNOWLEDGE   │
 │EXEC   │      │ BASE       │
 │RUNNER │      │ SEARCH    │
 └────┬─┘      └─────┬────┘
      │               │
      ▼               ▼
    ┌───────────────────────┐
    │  RESPONSE GENERATOR  │
    │ - Primary response  │
    │ - Fallback          │
    │ - Human handoff    │
    └────────┬────────────┘
             │
             ▼
         RESPUESTA
```

### Integración WhatsApp (Futuro)

Arquitectura lista para integración:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   WhatsApp   │────▶│   WEBHOOK   │────▶│   API       │
│  Cloud API  │     │  Handler   │     │  Processing │
└──────────────┘     └──────────────┘     └──────┬─────┘
                                                 │
                           ┌──────────────┬──────┘
                           ▼
                    ┌──────────────┐
                    │ CONVERSATION │
                    │ CREATION     │
                    └──────────────┘
```

### Seguridad

| Funcionalidad | Estado |
|---------------|--------|
| JWT Authentication | ✅ |
| Role-Based Access Control (RBAC) | ✅ |
| Multi-tenant Data Isolation | ✅ |
| Input Validation & Sanitization | ✅ |
| Rate Limiting | ✅ |
| Audit Logging | ✅ |
| Security Headers (Helmet) | ✅ |
| Password Hashing (bcrypt) | ✅ |
| SQL Injection Protection (Prisma) | ✅ |
| XSS Protection | ✅ |

### Despliegue

#### Desarrollo Local
```bash
docker-compose up -d
```

#### Producción
```bash
# Build de producción
docker-compose build

# Deploy
docker-compose up -d --scale api=2
```

#### Requisitos Mínimos
- 2 vCPU / 4GB RAM
- PostgreSQL 15+
- Redis (opcional)

### Uso Privado / Licencia

Este proyecto es de **uso privado**. Para usarlo en producción:

1. **Fork del repositorio** para desarrollo interno
2. **Configurar seguridad** según checklist de producción
3. **Implementar integraciones** necesarias
4. **Desplegar** en infraestructura propia

Para una solución enterprise gestionada, contáctanos para una cotización personalizada.

---

## 📞Contacto

- 📧 Email: Francocornejoc15@gmail.com
- 🌐 Web: https://nuevo-porfolio-eger.vercel.app/
- 📱 WhatsApp: +543816348569

---

<div align="center">

** Construido por Franco Cornejo **

*© 2026 Plataforma de Atención Inteligente. Todos los derechos reservados.*

</div>
