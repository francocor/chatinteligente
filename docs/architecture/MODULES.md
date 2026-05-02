# Módulos Funcionales del Sistema

## Arquitectura Modular (Domain-Driven Design)

### Principios de Diseño Modular
- **Alta cohesión, bajo acoplamiento:** Cada módulo tiene responsabilidad única y边界 claras
- **Independencia de ciclo de vida:** Despliegue, escalado y actualización independientes por módulo
- **Event-driven communication:** Comunicación asincrónica vía eventos cuando sea posible
- **Database per module (opcional):** En MVP monolito con bounded contexts, futuro microservicios

---

## 1. Módulo Tenant Management (Multi-tenancy)

### Responsabilidades
- Gestión completa del ciclo de vida de empresas (tenants)
- Aislamiento de datos y configuración entre tenants
- Facturación, planes y límites de uso
- Personalización por tenant (branding, flujos, respuestas)

### Entidades Principales
- `Tenant`: Empresa cliente (clínica, sanatorio, etc.)
- `TenantPlan`: Plan contratado (Básico, Profesional, Empresarial)
- `TenantSettings`: Configuraciones globales deltenant
- `TenantLimits`: Cuotas de uso (mensajes, agentes, canales)

### Servicios Externos que Integra
- Stripe / PayPal / Mercado Pago (facturación)
- Email service (bienvenida, facturas, notificaciones)
- DNS/Custom domain management (white-label)

### API Endpoints Clave
```
POST   /api/v1/tenants           # Crear tenant
GET    /api/v1/tenants/:id       # Obtener tenant
PUT    /api/v1/tenants/:id       # Actualizar tenant
DELETE /api/v1/tenants/:id       # Eliminar tenant (soft delete)
GET    /api/v1/tenants/:id/usage # Uso actual vs límites
```

---

## 2. Módulo Authentication & Authorization (Auth)

### Responsabilidades
- Gestión de identidad y sesiones
- Control de acceso basado en roles (RBAC) y permisos granulares
- Single Sign-On (SSO) futuro (Google, Microsoft)
- MFA (Multi-Factor Authentication) opcional

### Entidades Principales
- `User`: Usuario del sistema (agente, admin, supervisor)
- `Role`: Papel dentro del tenant (Admin, Supervisor, Agent, Viewer)
- `Permission`: Acción específica (conversation:read, report:export)
- `Session`: Sesión activa con JWT tokens
- `AuditLog`: Registro inmutable de acciones críticas

### Modelo de Permisos
```
Recursos (Resources):
- tenants
- conversations
- agents
- flows
- reports
- settings
- billing

Acciones (Actions):
- create
- read
- update
- delete
- export
- assign

Estructura: resource:action (ej: "conversations:read")
```

### Políticas de Contraseña
- Mínimo 8 caracteres, mayúsculas, minúsculas, números
- Historial de últimas 5 contraseñas (no repetir)
- Bloqueo temporal tras 5 intentos fallidos
- Expiración cada 90 días (configurable)

### API Endpoints Clave
```
POST   /api/v1/auth/login        # Login
POST   /api/v1/auth/logout       # Logout
POST   /api/v1/auth/refresh      # Refresh token
POST   /api/v1/auth/forgot-password # Recuperación
PUT    /api/v1/auth/change-password # Cambio password
GET    /api/v1/auth/me           # Info usuario actual
```

---

## 3. Módulo Chat Channels (Canales de Comunicación)

### Responsabilidades
- Abstracción de canales de entrada (Web Widget, WhatsApp, Email, futuros)
- Normalización de mensajes a formato interno unificado
- Sesiones y context storage por canal
- Delivery receipts y read status

### Canales Soportados
#### 3.1. Web Chat Widget (JavaScript SDK)
- Embeddable en sitio web del cliente
- Customizable (colores, logo, mensaje de bienvenida)
- Detección de idioma automática
- File upload (imágenes, PDFs)
- Geo-location opcional

#### 3.2. WhatsApp Business Cloud API (Fase 1)
- Conexión directa via Meta API
- Mensajes de plantilla (template messages) para notificaciones
- Mensajes de sesión (session messages) para conversación 24h
- Media messages (imágenes, audio, documentos)
- Webhook receiver para eventos de WhatsApp

#### 3.3. Email to Ticket (Fase 2)
- Conversión de emails entrantes a tickets/conversaciones
- Respuestas automáticas con ticket ID
- Threading por subject/reference

### Modelo de Mensajería Unificado
```typescript
interface UnifiedMessage {
  id: string;
  channel: 'web' | 'whatsapp' | 'email' | 'telegram';
  direction: 'inbound' | 'outbound';
  content: {
    text?: string;
    media?: Array<{url: string, type: 'image' | 'audio' | 'document'}>;
    quickReplies?: QuickReply[];
    location?: {lat: number, lng: number};
  };
  metadata: {
    userId?: string; // Identificador del usuario final (anónimo si no hay)
    userInfo?: {name?: string, email?: string, phone?: string};
    deviceInfo?: {os: string, browser: string, appVersion: string};
    sessionId: string;
  };
  timestamp: DateTime;
}
```

### API Endpoints Clave
```
GET    /api/v1/channels/web/sessions/:sessionId/messages # Historial
POST   /api/v1/channels/web/sessions/:sessionId/messages # Enviar mensaje
GET    /api/v1/channels/whatsapp/webhook                 # Webhook Meta
POST   /api/v1/channels/whatsapp/send                     # Enviar WhatsApp
```

---

## 4. Módulo Conversational AI (IA Conversacional)

### Responsabilidades
- Interpretación de intenciones (Intent Classification)
- Extracción de entidades (NER - Named Entity Recognition)
- Generación de respuestas (NLG) via LLM
- Context management (historial, preferencias, estado)
- Fallback a flujos guiados o humano

### Componentes Internos

#### 4.1. Intent Classifier
- **Modelo:** Fine-tuned OpenAI GPT o Claude, o modelo local (BERT-based)
- **Entrenamiento:** Dataset de intenciones por vertical (médico, retail, etc.)
- **Confidence threshold:** 0.85 para auto-response, <0.85 deriva a humano
- **Fallback strategies:**
  1. Re-phrasing (pedir aclaración)
  2. Guided flow (mostrar opciones estructuradas)
  3. Transfer to human (derivación directa)

#### 4.2. Entity Extractor
- Detección de: fechas, horarios, nombres, ubicaciones, IDs
- Validación contextual (ej: fecha no en pasado)
- Normalización (formato ISO para fechas)

#### 4.3. Knowledge Base (RAG - Retrieval Augmented Generation)
- **Base de conocimientos:** Documentos Markdown, FAQs, PDFs cargados por admin
- **Vector database:** Pinecone, Weaviate, o pgvector en PostgreSQL
- **Embeddings:** OpenAI text-embedding-ada-002 o Sentence Transformers
- **Semantic search:** Top-k=5 chunks, similarity threshold 0.75
- **Citation:** Menciona fuente en respuesta generada

#### 4.4. LLM Orchestrator
- **Proveedores soportados:** OpenAI GPT-4/3.5, Anthropic Claude, Google PaLM
- **Prompt engineering:** Templates por intención y vertical
- **Context window management:** Ventana deslizante de últimas 10 interacciones
- **Rate limiting:** Límites por tenant según plan
- **Cost tracking:** Monitoreo de tokens consumidos por tenant

#### 4.5. Sentiment Analysis
- Detección de emociones (positivo, negativo, neutral, urgente)
- Trigger de alertas para sentimiento negativo persistente
- Escalation automático según severidad

### Flujo de Procesamiento IA
```
Mensaje usuario -> Preprocessing -> Intent Classifier -> (confidence >= threshold?)
  ├─ Sí -> Entity Extraction -> Knowledge Retrieval -> LLM Response Generator -> Post-processing -> Respuesta
  └─ No -> Fallback Strategy -> Guided Flow / Human Transfer
```

### Configuración por Tenant
- Intenciones personalizadas (stacking sobre base genérica)
- Tuning de thresholds (confianza, fallback)
- Personalización de tono (formal, amigable, técnico)
- Exclusiones (palabras, temas no tocar)

### API Endpoints Clave
```
POST   /api/v1/ai/classify          # Clasificar intención
POST   /api/v1/ai/entities          # Extraer entidades
POST   /api/v1/ai/response          # Generar respuesta (full pipeline)
GET    /api/v1/ai/knowledge/:kbId/search # Búsqueda semántica
POST   /api/v1/ai/knowledge/:kbId/documents # Añadir documento
```

---

## 5. Módulo Guided Flows (Flujos Guiados)

### Responsabilidades
- Diseño visual de árboles de decisión (decision trees)
- Respuestas predeterminadas estructuradas (menu-driven)
- Condiciones y validaciones por paso
- Integración con variables de sesión y contexto

### Builder Visual
- **Interface:** Drag-and-drop flowchart editor
- **Nodos:**
  - Message node (envío de texto/media)
  - Question node (espera respuesta con validación)
  - Condition node (branching por variable/entidad)
  - Action node (ejecutar acción: crear turno, notificar)
  - Human transfer node (derivar a agente)
- **Persistencia:** JSON/YAML de flujo guardado en DB

### Variables de Sesión
- `user_name`, `user_phone`, `user_email` (capturados automáticamente)
- `selected_service` (ej: "consulta_cardiológica")
- `appointment_date`, `appointment_time`
- Custom variables definidas por admin

### Ejemplo: Flujo Agenda de Turnos
```
Inicio -> "¿Para qué especialidad necesita turno?"
  ├─ Cardiodiología -> "¿Qué día prefiere?" (date picker)
  │   └─ [date valid] -> "¿En qué horario?" (time slots)
  │       └─ [time valid] -> "Confirmar: {date} {time} - Cardiodiología" -> [CONFIRM/CANCEL]
  │           └─ CONFIRM -> Crear turno en sistema externo (webhook) -> "Turno confirmado"
  └─ Pediatría -> ... (similar)
```

### Triggers de Flujo
- Por keyword específica ("turno", "horario", "consultar")
- Por intención detectada por IA (fallback o explicit)
- Por condición de negocio (ej: horario fuera de atención -> guided flow automático)

### API Endpoints Clave
```
POST   /api/v1/flows                # Crear flujo
PUT    /api/v1/flows/:id            # Actualizar flujo
DELETE /api/v1/flows/:id            # Eliminar flujo
POST   /api/v1/flows/:id/publish    # Publicar (activar)
GET    /api/v1/flows/:id/versions   # Historial de versiones
POST   /api/v1/sessions/:sessionId/execute-flow # Ejecutar flujo
```

---

## 6. Módulo Live Agent (Agentes Humanos)

### Responsabilidades
- Asignación inteligente de conversaciones a agentes
- Colas de atención (queues) por skill/área
- Supervisión en tiempo real (monitor dashboard)
- Herramientas de asistencia al agente (suggested replies, knowledge)
- Transferencias entre agentes/escalamiento

### Conceptos Clave

#### 6.1. Agent Skills (Habilidades)
- `spanish_support`, `billing`, `medical_queries`, `emergency`
- Cada agente puede tener múltiples skills con nivel (1-5)
- Conversaciones se enrutan por skill matching

#### 6.2. Queues (Colas)
- `default`: Cola general
- `medical_urgent`: Prioridad alta, notifica a todos
- `billing`: Solo agentes con skill billing
- `callback`: Callbacks solicitados por usuarios

#### 6.3. Assignment Strategies
- **Round-robin:** Distribución equitativa
- **Least-available:** Agente con menos conversaciones activas
- **Skill-based:** Mejor match de skill
- **Sticky-agent:** Mismo agente si ya tuvo contacto previo

### Agent Workspace (UI de Agente)
- Inbox con conversaciones pendientes (filtros por cola, prioridad)
- Conversation view con historial completo
- Quick replies (respuestas predefinidas)
- Knowledge search (búsqueda en base de conocimiento)
- Internal notes (privadas, no ven clientes)
- Transfer dialog (seleccionar agente/cola destino)
- Status presence (online, away, busy, offline)

### Asistencia IA a Agentes
- **Suggested replies:** Basadas en conversación actual + knowledge base
- **Auto-summary:** Genera resumen post-conversación
- **Sentiment alert:** Notifica si cliente está enojado
- **Next best action:** Recomienda siguiente paso (follow-up, survey)

### Métricas de Agente
- `conversations_handled`, `messages_sent`, `avg_response_time`
- `resolution_rate`, `transfer_rate`, `csat_score`
- `availability_time`, `break_time`, `after_work_time`

### API Endpoints Clave
```
GET    /api/v1/agents/me/conversations # Inbox agente
POST   /api/v1/agents/me/accept/:conversationId # Aceptar conversación
POST   /api/v1/agents/me/reply/:conversationId # Enviar respuesta
POST   /api/v1/agents/me/transfer/:conversationId # Transferir
GET    /api/v1/agents/queue/:queueId # Conversaciones en cola
POST   /api/v1/agents/status         # Actualizar presencia
```

---

## 7. Módulo Conversation Management

### Responsabilidades
- Ciclo de vida completo de conversaciones
- Historial y contexto persistente
- Metadata, tags, custom fields
- Estado (active, on-hold, resolved, escalated, closed)
- Búsqueda y filtrado avanzado

### Estados de Conversación
```
state: "active" | "waiting" | "in_progress" | "resolved" | "closed"
substate: "ai_handling" | "human_assigned" | "human_writing" | "transferring"
```

### Entity Resolution (Deduplicación)
- Identificación de usuario por: email, phone, cookie, deviceId
- Merge de conversaciones de mismo usuario
- Profile enriquecido (historial, preferencias, compras previas)

### Tags y Custom Fields
- Tags manuales: `soporte`, `venta`, `reclamo`, `urgente`
- Tags automáticos: `ai_resolved`, `high_sentiment`, `repeat_customer`
- Custom fields por tenant: `tipo_consulta`, `nro_afiliado`, `order_id`

### Búsqueda y Filtros
- Por fecha, agente, canal, estado, tags, custom fields
- Full-text search en transcripciones (PostgreSQL tsvector)
- Guardados searches (filtros frecuentes)

### API Endpoints Clave
```
GET    /api/v1/conversations      # Listar (con filtros)
GET    /api/v1/conversations/:id  # Detalle + historial
PUT    /api/v1/conversations/:id  # Actualizar (tags, status)
POST   /api/v1/conversations/search # Búsqueda full-text
DELETE /api/v1/conversations/:id  # Archivar (soft delete)
GET    /api/v1/conversations/:id/export # Exportar conversación individual
```

---

## 8. Módulo Analytics & Reporting

### Responsabilidades
- Métricas en tiempo real y históricas
- Dashboards personalizables por rol
- Reportes programados y exportación
- Análisis de tendencias y anomalías
- Tracking de funnels de conversión

### Métricas Core

#### 8.1. Métricas de Volumen
- `total_conversations`, `conversations_per_channel`
- `messages_in`, `messages_out`, `messages_per_conversation`
- `unique_users`, `returning_users`

#### 8.2. Métricas de Eficiencia
- `ai_resolution_rate` (% resueltas por IA)
- `avg_response_time_ai`, `avg_response_time_human`
- `first_contact_resolution_rate`
- `transfer_rate` (IA -> humano)

#### 8.3. Métricas de Calidad
- `customer_satisfaction_score` (CSAT post-conversación)
- `sentiment_distribution` (positivo/neutral/negativo)
- `intent_distribution` (top intenciones atendidas)
- `drop_off_points` (puntos de abandon en flujos)

#### 8.4. Métricas de Operación
- `agents_utilization` (ocupación de agentes)
- `queue_wait_time` (tiempo en cola)
- `after_work_time` (tiempo post-conversación)
- `cost_per_conversation` (costo IA vs humano)

### Dashboards por Rol

#### 8.5. Dashboard Admin (Executive View)
- Vista multi-tenant o tenant individual
- KPIs de negocio (MRR, churn, growth)
- Tendencias de uso y satisfacción
- Alertas de anomalías

#### 8.6. Dashboard Supervisor (Operational View)
- Agentes en tiempo real (status, carga)
- Conversaciones activas vs resueltas
- Queue lengths y wait times
- Alertas de SLA incumplidos

#### 8.7. Dashboard Agente (Personal View)
- Mi performance vs promedio de equipo
- CSAT personal y feedback
- Metas cumplidas
- Suggested improvements

### Reportes Exportables
- **Reporte de Conversaciones:** Filtros personalizados, columnas seleccionables
- **Reporte de Agentes:** Performance individual/comparativa
- **Reporte de IA:** Accuracy, intenciones, fallbacks
- **Reporte de Satisfacción:** CSAT por periodo, canal, agente
- **Reporte de Facturación:** Uso vs facturado (para admin tenant)

### Formatos de Exportación
- **CSV:** Serie temporal, tablas planas
- **Excel (XLSX):** Múltiples hojas, gráficos embebidos, formatos condicionales
- **PDF:** Informes formales, con logo tenant, generados vía Puppeteer/Playwright

### API Endpoints Clave
```
GET    /api/v1/analytics/metrics           # Métricas en tiempo real
GET    /api/v1/analytics/historical        # Histórico agrupado
GET    /api/v1/analytics/dashboard/:role   # Dashboard según rol
POST   /api/v1/reports                     # Generar reporte (async)
GET    /api/v1/reports/:reportId/status    # Status de reporte
GET    /api/v1/reports/:reportId/download  # Download CSV/Excel/PDF
POST   /api/v1/reports/schedule            # Programar reporte
```

---

## 9. Módulo Alertas & Notificaciones

### Responsabilidades
- Monitoreo proactivo de condiciones críticas
- Notificaciones multi-canal (email, in-app, WhatsApp)
- Umbrales configurables por tenant
- Reglas complejas (AND/OR, time windows)

### Fuentes de Eventos

#### 9.1. Alertas de Conversación
- Conversación inactiva >15min (sin respuesta IA ni agente)
- Sentimiento negativo persistente (>2 mensajes negativos)
- Escalation manual solicitado por usuario
- Transferencia fallida (no hay agentes disponibles)

#### 9.2. Alertas de Operación
- Cola supera umbral (>10 conversaciones esperando >5min)
- Agente offline durante horario programado
- Error rate API >1% en últimos 5min
- Consumo de mensajes próximo a límite del plan

#### 9.3. Alertas de Sistema
- Fallo de conector WhatsApp/Telegram
- DB latency >500ms
- Cache miss rate >20%
- Storage capacity >80%

### Reglas configurables por Tenant
```
IF  queue_wait_time > 5 minutes
AND queue_name = "medical_urgent"
THEN notify supervisor_email, sms_to_on_call_doctor
```

### Canales de Notificación
- **In-app:** Toast notifications en dashboard admin
- **Email:** Para reportes diarios y alertas importantes
- **SMS/WhatsApp:** Solo alertas críticas (emergencias médicas)
- **Webhooks:** Para integración con PagerDuty, Slack

### API Endpoints Clave
```
GET    /api/v1/alerts/rules         # Reglas configuradas
POST   /api/v1/alerts/rules         # Crear regla
PUT    /api/v1/alerts/rules/:id     # Actualizar regla
DELETE /api/v1/alerts/rules/:id     # Eliminar regla
GET    /api/v1/alerts/triggered    # Alertas activas
POST   /api/v1/alerts/:id/acknowledge # Reconocer alerta
```

---

## 10. Módulo Integraciones (Connectors)

### Responsabilidades
- Conexión con sistemas externos (CRM, ERP, HIS, agendas)
- Sincronización bidireccional de datos
- Webhooks personalizables
- API públicas para partners

### Conectores Iniciales

#### 10.1. WhatsApp Business Cloud API
- Envío/recepción de mensajes
- Template management (aprobación Meta)
- Media handling
- Webhook signature verification

#### 10.2. Calendly / Google Calendar (para agendamiento)
- Consulta de disponibilidad en tiempo real
- Creación de eventos desde conversación
- Cancelación/reprogramación

#### 10.3. HIS / Sistema de Turnos (por webhook genérico)
- POST a endpoint externo con datos de turno
- Recibir confirmación/código de turno
- Actualizar estado de conversación

#### 10.4. CRM Genérico (REST API)
- Crear/actualizar lead/contacto
- Enviar conversación transcript
- Recuperar datos de cliente para enriquecimiento

### Patrón de Integración: Outbox Pattern
- Mensajes a sistemas externos se guardan en tabla `outbox_messages`
- Worker async consume y envía
- Reintentos con exponential backoff
- Dead letter queue para fallos permanentes

### API Endpoints Clave (para integración entrante)
```
POST   /api/v1/integrations/webhooks/:connector # Webhook genérico
GET    /api/v1/integrations/health/:connector   # Health check
POST   /api/v1/integrations/sync/:connector     # Sincronización manual
```

### Configuración por Tenant
- Cada tenant configura sus propios endpoints
- Credenciales encriptadas (AES-256)
- Test connection button
- Logs de sincronización

---

## 11. Módulo Admin & Configuration

### Responsabilidades
- Panel de administración unificado
- Configuración de flujos, IA, agentes
- Personalización de branding (logo, colores, mensajes)
- Gestión de usuarios y roles internos del tenant

### Sub-módulos

#### 11.1. User Management
- CRUD de usuarios (agentes, supervisores)
- Invitaciones por email
- Bulk import (CSV)
- Desactivación/activación

#### 11.2. Channel Configuration
- Widget embed code generator
- Canal WhatsApp: token, phone number ID, verification
- Canal Email: SMTP settings, autoresponders

#### 11.3. AI Configuration
- Model selection (GPT-4 vs GPT-3.5-turbo vs Claude)
- Temperature, max_tokens, top_p
- Intents management (add, edit, delete, train)
- Knowledge base indexing status

#### 11.4. Flow Builder
- Editor visual drag-and-drop (React Flow o similar)
- Preview/emulador de flujo
- Versioning (rollback a versión anterior)
- A/B testing de flujos (futuro)

#### 11.5. Branding & Tone
- Colores primarios/secundarios
- Logo, favicon
- Welcome message por canal
- Tone of voice: formal/casual/ friendly
- Auto-response templates

#### 11.6. Billing & Usage
- Vista de facturas
- Métricas actuales vs plan contratado
- Upgrade/downgrade de plan
- Añadir agentes adicionales

### UI/UX Consideraciones
- Responsive (mobile-first para agentes en campo)
- Dark mode support
- Soporte multi-idioma (español, inglés)
- Accesibilidad (WCAG 2.1 AA)
- Tooltips y contextual help

### API Endpoints Clave (Admin)
```
GET    /api/v1/admin/settings          # Configuraciones tenant
PUT    /api/v1/admin/settings          # Actualizar configs
POST   /api/v1/admin/branding          # Actualizar branding
GET    /api/v1/admin/agents            # Listar agentes (con filtros)
POST   /api/v1/admin/agents            # Crear agente
PUT    /api/v1/admin/agents/:id        # Actualizar agente
DELETE /api/v1/admin/agents/:id        # Eliminar agente
GET    /api/v1/admin/intents           # Listar intenciones
POST   /api/v1/admin/intents           # Crear intención
POST   /api/v1/admin/intents/:id/train # Re-entrenar modelo
```

---

## 12. Módulo Billing & Subscription

### Responsabilidades
- Gestión de planes y suscripciones
- Facturación recurrente (mensual/anual)
- Métricas de uso para prorrateo
- Upgrade/downgrade automático
- Gestión de pagos (Stripe, Mercado Pago)

### Planes (Ejemplo)

#### Plan Básico ($99/mes)
- Hasta 500 conversaciones/mes
- 1 agente humano
- Web Widget + Email
- IA básica (GPT-3.5)
- Reportes básicos
- Soporte por email

#### Plan Profesional ($299/mes)
- Hasta 2,500 conversaciones/mes
- Hasta 5 agentes humanos
- Web Widget + WhatsApp
- IA avanzada (GPT-4 o Claude)
- Flujos guiados ilimitados
- Reportes avanzados + exportación
- Soporte prioritario

#### Plan Empresarial ($899/mes)
- Conversaciones ilimitadas
- Agentes ilimitados
- Todos los canales + personalización
- IA personalizada (fine-tuning)
- API access + webhooks ilimitados
- Onboarding dedicado + account manager
- SLA 99.9%

### Metodología de Medición de Uso
- **Conversación:** Cualquier sesión con >1 mensaje
- **Mensaje:** Cada inbound/outbound message
- **Agente activo:** Usuario con al menos 1 conversación en mes
- **Canal:** WhatsApp sessions count vs web sessions

### Facturación
- Facturas mensuales automáticas (PDF)
- Prórrata por upgrades a mitad de mes
- Notificación 7 días antes de límite excedido
- Overages facturados aparte (bloqueo opcional)

### API Endpoints Clave
```
GET    /api/v1/billing/current-plan   # Plan actual
POST   /api/v1/billing/upgrade        # Cambiar plan
GET    /api/v1/billing/invoices       # Historial facturas
GET    /api/v1/billing/usage          # Uso actual del mes
POST   /api/v1/billing/payment-methods # Añadir tarjeta
```

---

## 13. Módulo Monitoring & Observability (Interno)

### Responsabilidades
- Health checks de todos los servicios
- Logging estructurado
- Métricas de performance (application + business)
- Alertas internas del equipo de desarrollo
- Distributed tracing

### Componentes Técnicos

#### 13.1. Logging (Winston/Pino)
- Formato JSON con fields estándar:
  ```json
  {
    "timestamp": "2025-01-15T10:00:00Z",
    "level": "info",
    "service": "conversation-service",
    "tenantId": "tenant_123",
    "userId": "user_456",
    "conversationId": "conv_789",
    "message": "Message processed",
    "durationMs": 145,
    "metadata": {...}
  }
  ```
- Centralized logging (ELK stack o Datadog)
- Retention policy: 30 días en caliente, 1 año en frío

#### 13.2. Metrics (Prometheus + Grafana)
- Application metrics:
  - http_requests_total (by endpoint, status, tenant)
  - http_request_duration_seconds (percentiles p50, p95, p99)
  - active_connections (WebSocket)
  - queue_depth (RabbitMQ/Kafka)
- Business metrics:
  - conversations_total (by channel, tenant)
  - ai_resolution_rate (by tenant)
  - agent_utilization (by agent)
- Alerts en Grafana (PagerDuty/Opsgenie integration)

#### 13.3. Tracing (OpenTelemetry)
- Trace por conversación (trace_id = conversation_id)
- Span por acción (classify, retrieve, generate, send)
- Parent-child relationships claros
- Visualización en Jaeger/Tempo

#### 13.4. Health Checks
- `/healthz` liveness (K8s)
- `/ready` readiness (DB, Redis, OpenAI connectivity)
- Dependencies: DB, Redis, OpenAI API, WhatsApp API

### Dashboards de Operaciones
- System overview (uptime, errors, latency)
- Tenant usage breakdown
- Cost tracking (OpenAI tokens, WhatsApp sessions)
- Queue monitoring (backlog, processing rate)

---

## 14. Módulo API Gateway & Public API

### Responsabilidades
- Punto único de entrada para clients
- Autenticación y rate limiting por tenant
- Request/response validation (Zod)

### Estructura de API

#### API v1 (Core)
```
/api/v1/tenants         # Tenant management
/api/v1/auth            # Auth endpoints
/api/v1/conversations   # Conversations CRUD
/api/v1/channels        # Channel abstraction
/api/v1/agents          # Agent management
/api/v1/flows           # Guided flows
/api/v1/ai              # AI endpoints
/api/v1/analytics       # Metrics & reports
/api/v1/integrations    # External connectors
/api/v1/admin           # Admin functionality
/api/v1/billing         # Subscriptions
```

#### API v2 (Futuro)
- GraphQL endpoint para frontend flexible
- Event streams (SSE) para real-time updates
- Batch operations

### Rate Limiting
- Por tenant: `X-Requests-Per-Minute` según plan
- Por endpoint: difieren límites (auth más estricto, analytics menos)
- Burst allowance (token bucket algorithm)
- Headers de respuesta: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Versioning Strategy
- URL versioning (`/api/v1/`, `/api/v2/`)
- Backward compatible changes (add fields, no remove/change)
- Deprecation notices 6 meses antes de remover endpoint

### Public API (para clientes avanzados)
- Webhooks: events de conversaciones (`conversation.created`, `message.received`)
- REST API: acceso programático a conversations
- SDKs oficiales facilitan integración

### API Endpoints Clave (Gateway)
```
Middleware aplicado a todas:
- Auth verification (JWT)
- Tenant context extraction
- Rate limiting check
- Request ID injection (traceability)
- Response logging
```

---

## 15. Módulo Worker Services (Background Jobs)

### Responsabilidades
- Procesamiento asincrónico de tareas pesadas
- Retry automático y dead letter queues
- Scaling independiente

### Colas de Trabajo

#### 15.1. High Priority (Concurrent Workers)
- `send-message`: Envío de mensajes a canales externos
- `ai-classify`: Procesamiento IA
- `webhook-delivery`: Entrega a endpoints externos

#### 15.2. Medium Priority
- `conversation-summary`: Generación de resumen post-conversación
- `sentiment-analysis`: Análisis de sentimiento async
- `report-generation`: Generación de PDFs/Excel

#### 15.3. Low Priority / Batch
- `usage-aggregation`: Agregación de métricas por hora/día
- `data-retention`: Cleanup de datos antiguos (retention policy)
- `index-rebuild`: Re-indexación de búsqueda full-text

### Infraestructura
- **Queue system:** Redis Streams (simple) o RabbitMQ/Kafka (escalable)
- **Job library:** BullMQ (Node.js) o Celery (Python)
- **Worker processes:** Separados por cola, replicables
- **Concurrency control:** Máximo N workers por cola

### Reintentos
- Intentos: 3 (exponential backoff: 1s, 3s, 9s)
- Dead letter después de 3 fallos
- Notificación de dead letters a admin

---

## Tabla Resumen de Módulos

| Módulo | Responsabilidad Principal | Dependencias Críticas | Prioridad MVP |
|--------|--------------------------|----------------------|---------------|
| Tenant Management | Multi-tenancy, aislamiento | Auth, DB | P0 |
| Auth & Authorization | Identidad y permisos | DB, JWT | P0 |
| Chat Channels | Normalización de canales | Redis (sesiones), APIs externas | P0 |
| Conversational AI | Interpretación y respuestas | OpenAI API, Vector DB | P0 |
| Guided Flows | Flujos estructurados | DB, Redis | P0 |
| Live Agent | Gestión de agentes humanos | WebSockets, Redis | P0 |
| Conversation Mgmt | Ciclo de vida conversaciones | DB, Search | P0 |
| Analytics & Reporting | Métricas y reportes | DB, Queue workers | P1 |
| Alertas & Notificaciones | Monitoreo proactivo | Queue workers, Email | P1 |
| Integraciones | Conectores externos | Webhooks, OAuth | P1 |
| Admin & Config | Panel de control | Todos los módulos | P1 |
| Billing & Subscription | Facturación y planes | Stripe/Mercado Pago | P2 |
| Monitoring & Observability | Observabilidad interna | Prometheus, ELK | P0 (devops) |
| API Gateway | Enrutamiento y seguridad | Auth, Rate limiting | P0 |

---

**Estado:** Pendiente de refinamiento con equipo técnico
