# Arquitectura Técnica del Sistema

## 1. Filosofía de Arquitectura

### Principios Rectores
1. **Simple sobre complejo:** Evitar over-engineering en fases tempranas
2. **Clear boundaries:** Separación por bounded contexts (módulos definidos en MODULES.md)
3. **Database per bounded context (futuro):** Mono-DB inicial → por servicio luego
4. **API-first:** Todo expuesto via API REST + WebSocket
5. **Event-driven internally:** Event Bus para comunicación inter-modular
6. **Observable por defecto:** Logging, tracing, metrics integrados
7. **Security by design:** Validación en cada capa, zero-trust network

---

## 2. Decisión Monolito vs Microservicios

### Fase 0-1 (MVP hasta ~10k usuarios): Monolito Modular (Modular Monolith)
**Estructura:** Single repository, aplicación NestJS organizada por módulos (packages/features)

**Justificación:**
- Velocidad de desarrollo: 1 deploy, 1 pipeline, 1 DB transaction
- Costo operativo: 1 instancia EC2/VM, 1 DB connection pool
- Complejidad manejable: 2-3 devs
- Todas las features comparten mismo modelo de datos (transactions ACID)

**Desventajas:**
- Acoplamiento eventual entre módulos (mitigar con interfaces claras)
- Escalado conjunto (no granular por módulo)
- Single point of failure (mitigar con redundancy)

### Fase 2-3 (Escalado >50k usuarios): Microservicios Graduales
**Estrategia de分裂:**
1. Extraer servicios más críticos o independientes:
   - `conversation-service` (alta carga, stateful)
   - `ai-service` (aislar costos de LLM)
   - `notification-service` (async, external APIs)
2. Database per service para servicios críticos
3. API Gateway centralizado (Kong, Tyk, o implementación propia)

**Migración gradual:**
- Strangler Fig pattern: new endpoints van a microservicios, old a monolith
- Database shared → database per service (synchronization via events)
- Shared kernel: modelos comunes (User, Tenant, Conversation)

---

## 3. Arquitectura en Capas (Clean Architecture / Hexagonal)

### 3.1. Estructura de Directorios (Monolito)

```
src/
├── applications/           # Casos de uso (Use Cases) - DTOs, Validators
│   ├── conversations/
│   │   ├── dto/
│   │   ├── conversation.service.ts
│   │   └── conversation.controller.ts
│   └── ...
├── domains/               # Entidades y lógica de dominio pura
│   ├── conversation/
│   │   ├── conversation.entity.ts
│   │   ├── conversation.repository.ts (interface)
│   │   └── conversation.events.ts
│   ├── tenant/
│   ├── user/
│   └── ...
├── infrastructures/       # Implementaciones técnicas (DB, cache, external APIs)
│   ├── databases/
│   │   ├── postgres/
│   │   │   ├── prisma/
│   │   │   └── repositories/
│   │   └── redis/
│   ├── cache/
│   │   └── redis.cache.ts
│   ├── messaging/
│   │   ├── redis-streams/
│   │   └── events/
│   ├── storage/
│   │   └── s3.storage.ts
│   └── external/
│       ├── openai/
│       ├── whatsapp/
│       └── stripe/
├── interfaces/            # Presentación (Controllers, Views, Gates)
│   ├── http/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── guards/
│   │   └── decorators/
│   └── websocket/
│       ├── chat.gate.ts
│       └── presence.gate.ts
├── shared/               # Utilidades comunes
│   ├── constants/
│   ├── decorators/
│   ├── exceptions/
│   ├── interceptors/
│   ├── filters/
│   ├── pipes/
│   └── utils/
└── main.ts              # Bootstrap
```

### 3.2. Patrones de Diseño Aplicados

#### **Repository Pattern (Repositorios)**
- Abstracción sobre acceso a datos
- Interfaces definidas en `domains/*/repository.ts`
- Implementaciones en `infrastructures/databases/...`
- Permite swap de DB fácilmente (ej: PostgreSQL → CockroachDB en futuro)

```typescript
// domains/conversation/conversation.repository.ts
export interface ConversationRepository {
  findById(id: string, tenantId: string): Promise<Conversation | null>;
  save(conversation: Conversation): Promise<void>;
  findByTenant(tenantId: string, filters: ConversationFilter): Promise<Conversation[]>;
  countByTenant(tenantId: string): Promise<number>;
}

// infrastructures/postgres/repositories/conversation.repository.ts
@Injectable()
export class PostgresConversationRepository implements ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, tenantId: string): Promise<Conversation | null> {
    return await this.prisma.conversation.findFirst({
      where: { id, tenant_id: tenantId }
    });
  }
  // ...implementación
}
```

#### **Use Case Interactor (Service Layer)**
- Lógica de aplicación puras
- Inyectan dependencias via interfaces (DI)
- No conocen detalles de implementación (DB, HTTP)

```typescript
// applications/conversations/conversation.service.ts
@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageService: MessageService,
    private readonly eventBus: EventBus
  ) {}

  async createConversation(createDto: CreateConversationDto): Promise<Conversation> {
    // Domain logic
    const conversation = new Conversation(createDto);
    await this.conversationRepo.save(conversation);

    // Domain event
    this.eventBus.publish(new ConversationCreatedEvent(conversation));

    return conversation;
  }
}
```

#### **CQRS (Command Query Responsibility Segregation)**
- Commands (writes): `POST /conversations` → `CreateConversationCommand` → Handler
- Queries (reads): `GET /conversations` → `ConversationQuery` → QueryHandler
- Beneficio: separación clara de responsabilidades, escalabilidad de reads

**Implementación opcional en MVP:**
- Simple service layer (CRUD + business logic)
- CQRS se introduce en Fase 2 si necesidad de read replicas o event sourcing

#### **Event Sourcing (Futuro)**
- Solo para módulos específicos (conversation state changes)
- State reconstructed from event stream
- Útil para auditoría y debugging

#### **Saga Pattern (Orquestación de Eventos)**
- Para transacciones distribuidas cross-service
- Ejemplo: Crear conversación → asignar agente → enviar notificación → todo atómico o compensar

---

## 4. Modelo de Datos (Database Schema)

### Elección: PostgreSQL 15+ con Prisma ORM

#### **Ventajas PostgreSQL:**
- ACID compliance (crucial para finanzas y datos médicos)
- JSONB para metadata flexible
- Full-text search nativo (mejor que Elasticsearch para MVP)
- Row-level security (RLS) disponible
- Replication y failover maduros
- Cost-effective (open source)

#### **Esquema de Base de Datos (Multi-tenant)**

```sql
-- Tenant isolation strategy: tenant_id en cada tabla (shared DB, shared schema)
-- Alternativa: schema per tenant (más aislamiento, más overhead)

-- Tablas globales (multi-tenant)
tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- subdomain identifier
  plan_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, suspended, trial
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(50) NOT NULL, -- 'agent', 'supervisor', 'admin'
  permissions JSONB DEFAULT '[]', -- [{"resource":"conversations","actions":["read","write"]}]
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, name) -- roles únicos por tenant
);

-- Tablas de conversaciones
conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  channel VARCHAR(20) NOT NULL, -- 'web', 'whatsapp', 'email'
  status VARCHAR(20) DEFAULT 'active', -- active, waiting, resolved, closed
  assigned_agent_id UUID REFERENCES users(id),
  user_id VARCHAR(255), -- identificador externo (cookie, phone, email)
  user_name VARCHAR(255),
  user_phone VARCHAR(50),
  user_email VARCHAR(255),
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  last_message_at TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL, -- 'inbound', 'outbound'
  channel VARCHAR(20) NOT NULL,
  content_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'audio', 'document'
  text TEXT,
  media_urls JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  from_type VARCHAR(20) DEFAULT 'user', -- 'user', 'agent', 'ai', 'system'
  from_id VARCHAR(255), -- user_id o agent_id
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Flujos guiados
flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_keywords TEXT[], -- palabras clave que activan el flujo
  definition JSONB NOT NULL, -- árbol de nodos (Node-RED style)
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI y Knowledge Base
intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  training_phrases TEXT[], -- frases de ejemplo
  responses TEXT[], -- respuestas predefinidas
  confidence_threshold DECIMAL(3,2) DEFAULT 0.85,
  is_active BOOLEAN DEFAULT TRUE
);

knowledge_base_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  source_url VARCHAR(1000),
  embedding vector(1536), -- pgvector extension
  chunk_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agentes y colas
agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id), -- 1:1 con user
  skills TEXT[] DEFAULT '{}', -- ['billing', 'medical', 'spanish']
  max_concurrent_conversations INTEGER DEFAULT 3,
  status VARCHAR(20) DEFAULT 'offline', -- online, away, busy, offline
  queue_position INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 5, -- 1-10, 10=máxima prioridad
  max_wait_time_seconds INTEGER DEFAULT 300, -- 5min
  auto_assignment BOOLEAN DEFAULT TRUE
);

queue_members (
  queue_id UUID NOT NULL REFERENCES queues(id),
  agent_id UUID NOT NULL REFERENCES agents(id),
  PRIMARY KEY (queue_id, agent_id)
);

-- Alertas y notificaciones
alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  condition_json JSONB NOT NULL, -- {"metric":"queue_wait_time","operator":">","value":300}
  action_json JSONB NOT NULL, -- {"type":"email","recipients":["supervisor@example.com"]}
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics agregados (materialized views para performance)
daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  date DATE NOT NULL,
  conversations_total INTEGER DEFAULT 0,
  messages_in INTEGER DEFAULT 0,
  messages_out INTEGER DEFAULT 0,
  ai_resolution_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_response_time_ms INTEGER DEFAULT 0,
  csat_score DECIMAL(3,2),
  UNIQUE(tenant_id, date)
);

-- Audit
audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Billing
subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id),
  plan_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, canceled, past_due
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  trial_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE
);

usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  metric VARCHAR(50) NOT NULL, -- 'conversations', 'messages', 'agents'
  value INTEGER NOT NULL,
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

### Índices Críticos

```sql
-- Performance indexes
CREATE INDEX idx_conversations_tenant_status ON conversations(tenant_id, status);
CREATE INDEX idx_conversations_assigned ON conversations(assigned_agent_id) WHERE assigned_agent_id IS NOT NULL;
CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at);
CREATE INDEX idx_messages_inbound ON messages(conversation_id, direction) WHERE direction = 'inbound';
CREATE INDEX idx_agents_tenant_status ON agents(tenant_id, status);
CREATE INDEX idx_audit_logs_tenant_time ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_daily_metrics_tenant_date ON daily_metrics(tenant_id, date DESC);
CREATE INDEX idx_queues_tenant ON queues(tenant_id);
CREATE INDEX idx_flows_tenant_active ON flows(tenant_id, is_active) WHERE is_active = TRUE;
```

---

## 5. Modelo de Comunicación y Eventos

### 5.1. Event Bus (Event-Driven Architecture)

**Propósito:** Desacoplar módulos, permitir extensibilidad vía eventos

```typescript
// shared/events/base.event.ts
export abstract class DomainEvent {
  abstract readonly eventName: string;
  readonly occurredOn: Date = new Date();
  readonly metadata?: Record<string, any>;
}

// Ejemplo: ConversationCreatedEvent
export class ConversationCreatedEvent implements DomainEvent {
  readonly eventName = 'conversation.created';
  readonly conversationId: string;
  readonly tenantId: string;
  readonly channel: string;

  constructor(conversationId: string, tenantId: string, channel: string) {
    this.conversationId = conversationId;
    this.tenantId = tenantId;
    this.channel = channel;
  }
}
```

### 5.2. Pattern: Pub/Sub con Redis Streams

**Ventajas:** Simple, escalable, persistente (hasta 7 días)

```typescript
// infrastructures/messaging/redis-streams/event-bus.ts
@Injectable()
export class RedisEventBus implements EventBus {
  private readonly redis: Redis;
  private readonly streams: Map<string, string> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const streamKey = `events:${event.eventName}`;
    await this.redis.xAdd(streamKey, '*', {
      eventId: uuid(),
      payload: JSON.stringify(event),
      timestamp: event.occurredOn.toISOString()
    });
  }

  async subscribe(eventType: string, handler: EventHandler): Promise<void> {
    const streamKey = `events:${eventType}`;
    // Group consumer pattern para multiple workers
    await this.redis.xReadGroup('event-bus-group', handler.consumerName, [
      { key: streamKey, id: '>' }
    ]);
  }
}
```

### Eventos del Sistema (Catalog)

#### Eventos de Conversaciones
- `conversation.created`
- `conversation.updated`
- `conversation.resolved`
- `conversation.transferred`
- `conversation.closed`
- `conversation.timeout` (sin actividad)
- `message.sent`
- `message.received`
- `message.delivered`
- `message.read`

#### Eventos de IA
- `ai.intent_classified`
- `ai.entities_extracted`
- `ai.response_generated`
- `ai.fallback_triggered`
- `ai.knowledge.searched`
- `ai.training.completed`

#### Eventos de Agentes
- `agent.online`
- `agent.away`
- `agent.busy`
- `agent.offline`
- `agent.assigned_conversation`
- `agent.transferred_conversation`
- `agent.message.sent`

#### Eventos de Flujos
- `flow.execution.started`
- `flow.execution.completed`
- `flow.execution.failed`
- `flow.node.entered`
- `flow.node.exited`

#### Eventos de Sistema
- `tenant.created`
- `tenant.updated`
- `tenant.suspended`
- `integration.connected`
- `integration.failed`
- `payment.succeeded`
- `payment.failed`
- `alert.triggered`

### 5.3. WebSockets para Real-Time

#### Casos de Uso Real-Time
1. **Chat en vivo:** Agent <-> Cliente via WebSocket
2. **Supervisor dashboard:** Actualizaciones en vivo de agentes/colas
3. **Notifications:** Alertas in-app
4. **Presence:** Saber qué agentes están online

#### Implementación con Socket.io

```typescript
// interfaces/websocket/chat.gate.ts
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: process.env.CORS_ORIGIN, credentials: true }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private async handleConnection(client: Socket) {
    const { token, conversationId } = client.handshake.auth;

    // 1. Validar JWT
    const user = await this.authService.validateToken(token);
    if (!user) client.disconnect();

    // 2. Verificar que conversation belongs to user's tenant
    const conversation = await this.conversationRepo.findById(conversationId, user.tenantId);
    if (!conversation) client.disconnect();

    // 3. Join room
    client.join(`conversation:${conversationId}`);

    // 4. Broadcast typing indicators, etc.
  }

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket) {
    // Process message → save DB → emit to room
    const message = await this.messageService.send(data);
    this.server.to(`conversation:${data.conversationId}`).emit('new_message', message);
  }
}
```

---

## 6. Patrones de Código y Estructura de Proyecto

### 6.1. Estructura de Monorepo (Turborepo / Nx)

```
apps/
├── api/                    # Backend NestJS (API + WebSocket + Workers)
├── web/                    # Frontend Next.js (Admin dashboard + Agent workspace)
├── widget/                 # Frontend widget (embed script)
└── docs/                  # Documentación (Storybook, API docs)

packages/
├── ui/                    # Componentes shared React (button, modal, etc.)
├── types/                 # TypeScript interfaces shared
├── utils/                 # Funciones utilitarias
├── config/                # Configuraciones (ESLint, Prettier, TSConfig)
└── prisma/                # Schema DB y migraciones
```

### 6.2. NestJS Structure (Inside `apps/api`)

```
src/
├── app.module.ts            # Root module
├── main.ts                 # Bootstrap
├── config/                 # Config cargada de .env + validación
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── jwt.config.ts
├── modules/                # Feature modules
│   ├── auth/
│   ├── tenants/
│   ├── users/
│   ├── conversations/
│   ├── messages/
│   ├── agents/
│   ├── flows/
│   ├── ai/
│   ├── analytics/
│   ├── integrations/
│   ├── billing/
│   └── admin/
├── shared/
│   ├── decorators/         # @Tenant(), @CurrentUser()
│   ├── filters/            # HttpException filter global
│   ├── guards/             # JwtAuthGuard, RolesGuard
│   ├── interceptors/       # Logging, transform
│   ├── pipes/              # ValidationPipe (Zod)
│   └── strategies/         # JwtStrategy
├── infrastructures/
│   ├── databases/
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   └── repositories/
│   ├── redis/
│   └── external/
├── workers/                # Background job workers (BullMQ)
│   ├── message-worker.ts
│   ├── ai-worker.ts
│   └── notification-worker.ts
└── utils/
```

### 6.3. Clean Code Practices

- **Single Responsibility Principle** por clase/función
- **Dependency Inversion:** Inyección de dependencias (constructor injection)
- **Domain-driven design terminology:** Entities, Value Objects, Aggregates
- **Functional core, imperative shell:** Lógica pura en dominios
- **Error handling centralizado:** Custom exceptions + global filter
- **Input validation:** DTOs con class-validator + pipes
- **Async/await everywhere:** No callbacks

---

## 7. Integración con Servicios Externos

### 7.1. OpenAI / LLM Providers

#### Pattern: Provider-Agnostic AI Service

```typescript
// domains/ai/ports/llm.port.ts
export interface LLMProvider {
  generateCompletion(prompt: string, options: LLMOptions): Promise<LLMResponse>;
  generateEmbedding(text: string): Promise<number[]>;
  classifyIntent(text: string, intents: Intent[]): Promise<IntentClassificationResult>;
}

// infrastructures/external/openai/openai.provider.ts
@Injectable()
export class OpenAIProvider implements LLMProvider {
  constructor(private openai: OpenAI) {}

  async generateCompletion(prompt: string, options: LLMOptions): Promise<LLMResponse> {
    const response = await this.openai.chat.completions.create({
      model: options.model || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 500,
    });
    return { text: response.choices[0].message.content };
  }
}
```

**Circuit Breaker:** Protección contra fallos de OpenAI
```typescript
@CircuitBreaker({
  failureThreshold: 5,
  halfOpenTime: 30000,
  resetTimeout: 60000
})
async generateWithRetry(prompt: string): Promise<string> {
  return await this.llm.generateCompletion(prompt, {});
}
```

### 7.2. WhatsApp Business Cloud API

#### Webhook Validation (Meta signature)
```typescript
@Post('webhook')
async verifyWebhook(@Req() req: Request, @Res() res: Response) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

@Post('webhook')
async receiveMessage(@Body() body: any) {
  // Verify X-Hub-Signature header
  const signature = req.headers['x-hub-signature-256'];
  if (!this.verifySignature(signature, rawBody)) {
    throw new UnauthorizedException('Invalid signature');
  }

  // Process message (async)
  this.messageQueue.processWhatsappMessage(body);
}
```

#### Error Handling & Retry
- 429 Rate limit: exponential backoff (5s, 15s, 30s)
- 5xx Server error: retry up to 3 times
- 4xx Client error: log + skip (no retry)

### 7.3. Stripe / Payment Gateway

#### Webhook Idempotency
- Stripe idempotency key en cada request de cargo
- Webhook events processing at least once → deduplication needed
- Database unique constraint en `subscription_id` + `stripe_event_id`

#### Plan Management
```typescript
async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const tenantId = await this.getTenantIdByStripeCustomerId(invoice.customer);

  // Actualizar subscription period
  await this.subscriptionRepo.updatePeriod(tenantId, {
    start: new Date(invoice.period_start * 1000),
    end: new Date(invoice.period_end * 1000)
  });

  // Registrar usage para prorrateo
  await this.usageService.recordInvoice(invoice);
}
```

### 7.4. Email Service (Resend / SendGrid)

#### Email Templates
- Templates en DB (designer-friendly editor futuro)
- Liquid / Handlebars syntax: `{{user_name}}`, `{{conversation_summary}}`
- Variables contextuales por tipo de email

```typescript
enum EmailType {
  INVITATION = 'invitation',
  PASSWORD_RESET = 'password_reset',
  CONVERSATION_SUMMARY = 'conversation_summary',
  DAILY_REPORT = 'daily_report',
  INVOICE = 'invoice',
  ALERT = 'alert'
}
```

---

## 8. Cache Strategy (Redis)

### 8.1. Caches Identificadas

#### Cache 1: Session Cache
- **Key:** `session:{sessionId}`
- **Value:** `{userId, tenantId, role, expiresAt}`
- **TTL:** 1 hora (renovable con refresh token)
- **Backing store:** Redis (altamente disponible)

#### Cache 2: Agent Presence
- **Key:** `agent:presence:{agentId}`
- **Value:** `{status, lastSeen, queuePosition, activeConversations}`
- **TTL:** 60s (auto-expire si agente se cae)
- **Estrategia:** Write-through (update on every state change)

#### Cache 3: Conversation Metadata (hot data)
- **Key:** `conversation:meta:{conversationId}`
- **Value:** `{status, assignedAgentId, lastMessage, unreadCount}`
- **TTL:** 5 min (lazy expiration si conversation cerrada)
- **Invalidation:** On message sent, status change

#### Cache 4: Knowledge Base Vectors (hot)
- **Key:** `kb:vector:{documentId}`
- **Value:** embedding array (vector)
- **TTL:** 24h (o invalidate on document update)
- **Size:** 1536 floats × ~10k docs = ~60MB (fits in memory)

#### Cache 5: Rate Limiting
- **Key:** `ratelimit:{tenantId}:{endpoint}`
- **Strategy:** Token bucket (Redis Lua script)
- **TTL:** 1 minuto (sliding window)

### 8.2. Cache Invalidation Patterns

```typescript
// Estrategia: Write-through + Cache invalidation
async function updateConversationStatus(convId: string, status: string) {
  // 1. Update DB
  await this.prisma.conversation.update({
    where: { id: convId },
    data: { status, updated_at: new Date() }
  });

  // 2. Invalidate related cache keys
  await this.cache.del(`conversation:meta:${convId}`);

  // 3. Publish event (cache invalidation en otros servicios)
  this.eventBus.publish(new ConversationUpdatedEvent(convId));
}
```

### 8.3. Redis Configuration

- **Cluster mode:** Para alta disponibilidad (3 master + replicas)
- **Persistence:** RDB snapshots every 15min + AOF every 1s (durability)
- **Memory policy:** allkeys-lru (evict least recently used)
- **Eviction:** Evitar OOM killer → alerta en 80% memory usage

---

## 9. Escalabilidad (Ver también SCALABILITY.md)

### 9.1. Escalado Horizontal (Scale-out)

#### Stateless Application Tier
- API services: sin estado, pueden escalar infinitamente (horizontal pod autoscaler en K8s)
- Session state en Redis (no en memory local)
- File uploads → S3 (object storage)

#### Stateful Services
- **WebSocket connections:** Sticky sessions via nginx (ip_hash) o Redis pub/sub sesión sharing
- **Database:** Read replicas (1 primary + N read replicas)
- **Redis:** Cluster mode con hash slots

### 9.2. Database Scaling

#### Fase 1: Single Primary + Read Replicas
- Writes → primary (PostgreSQL)
- Reads → replicas (round-robin o least connections)
- Connection pooling (PgBouncer) para manejar miles conexiones

#### Fase 2: Partitioning por Tenant (Sharding)
**Sharding key:** `tenant_id` (cada tenant o grupo de tenants en shard diferente)
- Range-based: Tenants 1-1000 en shard A, 1001-2000 en shard B
- Hash-based: Hash(tenant_id) % N shards
- Cross-shard queries: Application-level join (antipattern, avoid)

#### Fase 3: Multi-tenant segregation (Schema per Tenant)
- Opción para enterprise: separación física/legal de datos
- Cada tenant = schema único (o DB separada)
- Connection pooler dinámico (eligir conexión según tenant)

### 9.3. Colas y Procesamiento Asincrónico

#### Queue System: Redis Streams (MVP) → RabbitMQ (Fase 2)
- **Redis Streams:** Simple, ya instalado, suficiente para <100k messages/día
- **RabbitMQ:** Más features (dead-letter, priority queues, plugins) cuando crezca

#### Worker Pools
- `message-worker`: 5 instancias (concurrent 20)
- `ai-worker`: 3 instancias (costoso, limitar concurrencia)
- `notification-worker`: 2 instancias (external APIs lentos)

**Auto-scaling workers:** Cola depth > 1000 → spin up 2 más workers

---

## 10. Disponibilidad y Resiliencia

### 10.1. Multi-Region Deployment (Futuro)

#### Fase 2: Active-Passive
- Primary region (ej: us-east-1)
- Standby region (ej: us-west-2) con read replica + backup
- Failover manual (DNS switch) en caso de disaster

#### Fase 3: Active-Active
- Multi-write (consenso eventual, complejo)
- Más viable con sharding por región (tenant location-based)
- CDN global (CloudFront) para assets estáticos

### 10.2. Health Checks

```typescript
// /healthz (liveness)
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00Z",
  "uptime": 86400,
  "memory": {
    "used": "256MB",
    "total": "512MB"
  }
}

// /ready (readiness)
{
  "status": "ready",
  "checks": {
    "database": {"status": "ok", "latency": "12ms"},
    "redis": {"status": "ok", "latency": "2ms"},
    "openai": {"status": "ok", "latency": "145ms"},
    "whatsapp": {"status": "degraded", "latency": "3000ms", "message": "API rate limited"}
  }
}
```

### 10.3. Circuit Breaker Pattern

```typescript
@CircuitBreaker({
  name: 'openai-breaker',
  failureThreshold: 5,
  halfOpenTime: 30000,
  resetTimeout: 60000,
  fallback: async () => {
    // Fallback: use predefined response o escalate to human
    return this.fallbackService.getFallbackResponse(query);
  }
})
async callOpenAI(prompt: string): Promise<LLMResponse> {
  return await this.openai.generate(prompt);
}
```

### 10.4. Graceful Degradation

**Degradación por componente caído:**
- OpenAI caído → fallback a flujos guiados + derivación inmediata a humano
- WhatsApp API caído → notificar admin + continuar por web/email
- DB caído → modo read-only (solo consultas) + cacheen memoria
- Redis caído → fallback a in-memory (volatile, reboot limpia)

---

## 11. APIs Públicas y Webhooks

### 11.1. REST API (v1)

#### Base URL
```
https://api.plataforma-inteligente.com/v1
```

#### Autenticación
- Bearer token: `Authorization: Bearer <jwt>`
- OAuth 2.0 Client Credentials flow para integraciones server-to-server

#### Endpoint examples

```http
# Conversaciones
GET    /conversations?status=active&assigned_to=me
POST   /conversations
GET    /conversations/:id
PATCH  /conversations/:id
POST   /conversations/:id/transfer
POST   /conversations/:id/resolve

# Mensajes
GET    /conversations/:id/messages
POST   /conversations/:id/messages

# Agentes
GET    /agents/me
PATCH  /agents/me/status
GET    /agents/queue/:queueId

# Flujos
GET    /flows
POST   /flows
PUT    /flows/:id
POST   /flows/:id/publish

# IA
POST   /ai/classify
POST   /ai/generate
POST   /ai/knowledge/documents

# Reportes
POST   /reports
GET    /reports/:id/status
GET    /reports/:id/download?format=csv
```

#### Respuestas estandarizadas

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150
  }
}
```

Error response:
```json
{
  "success": false,
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "Conversación no encontrada",
    "details": { "id": "xxx" }
  },
  "traceId": "req_12345"
}
```

### 11.2. Webhooks del Sistema

#### Eventos de Conversación
```json
POST https://mi-clinica.com/webhooks/conversation
{
  "event": "conversation.created",
  "timestamp": "2025-01-15T10:00:00Z",
  "tenant_id": "tenant_123",
  "data": {
    "conversation_id": "conv_456",
    "channel": "web",
    "user": { "name": "Juan Pérez", "email": "juan@example.com" },
    "initial_message": "Necesito un turno"
  }
}
```

#### Eventos de Mensaje
```json
{
  "event": "message.received",
  "data": {
    "message_id": "msg_789",
    "conversation_id": "conv_456",
    "direction": "inbound",
    "content": { "type": "text", "text": "Sí, el viernes a la tarde" },
    "ai_analysis": {
      "intent": "schedule_appointment",
      "entities": {"date": "2025-01-17", "time": "afternoon"},
      "sentiment": "positive"
    }
  }
}
```

#### Verificación de Webhooks
- Header `X-Plataforma-Signature`: HMAC-SHA256 de payload con secret
- Verificación en recipient endpoint
- Retry automático si 5xx (exponential backoff, 3 intentos)

### 11.3. GraphQL API (Futuro)

```graphql
type Query {
  conversation(id: ID!): Conversation
  conversations(filter: ConversationFilter, pagination: Pagination): [Conversation!]!
  agent(id: ID!): Agent
}

type Mutation {
  sendMessage(conversationId: ID!, text: String!): Message!
  transferConversation(conversationId: ID!, agentId: ID!): Conversation!
}

type Subscription {
  conversationUpdated(conversationId: ID!): Conversation!
  newMessage(conversationId: ID!): Message!
}
```

---

## 12. Tolerancia a Fallos y Resiliencia

### 12.1. Retry Policies

#### Retry con Exponential Backoff
```typescript
@Retryable({
  maxAttempts: 3,
  delayMs: (attempt) => Math.min(1000 * Math.pow(2, attempt), 30000), // 1s, 2s, 4s max 30s
  onRetry: (error, attempt) => logger.warn(`Retry ${attempt}: ${error.message}`)
})
async callExternalAPI() { ... }
```

### 12.2. Dead Letter Queues

**Escenario:** Webhook a sistema externo falla 3 veces
- Mensaje movido a `dlq:webhooks`
- Alert a admin: "3 webhooks fallidos para tenant X"
- Dashboard manual de re-procesamiento
- Botón "Retry all" en admin

### 12.3. Fallbacks por Servicio

| Servicio | Fallback strategy |
|----------|------------------|
| OpenAI API | Flujos guiados predefinidos + derivación inmediata |
| WhatsApp API | Notificar "WhatsApp temporalmente no disponible" + web widget |
| Database Primary | Read-only desde replica +不接受nuevos writes |
| Redis | Modo in-memory (volatile) + disable sessions |
| Storage (S3) | Local disk temporal + retry background |
| Email Service | Queue en DB + retry cada 5min |

### 12.4. Bulkhead Pattern

Segmentar resources por tenant:
```typescript
// Limitar concurrent requests per tenant
@Bulkhead({
  maxConcurrentCalls: 10, // max 10 concurrent por tenant
  queueSize: 20, // max 20 pending requests per tenant
  tenantKey: (req) => req.tenantId
)
async handleMessage(req) { ... }
```

---

## 13. CI/CD Pipeline

### 13.1. GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: docker build -t api:${{ github.sha }} .
      - run: docker push registry.example.com/api:${{ github.sha }}

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/api api=registry.example.com/api:${{ github.sha }} -n staging
      - run: ./scripts/healthcheck.sh https://staging-api.example.com/ready

  deploy-prod:
    needs: [test, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'schedule'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./scripts/deploy-prod.sh ${{ github.sha }}
```

### 13.2. Feature Flags

#### Implementación: Unleash / Flagsmith

```typescript
@Injectable()
export class FeatureFlagService {
  async isEnabled(flagName: string, tenantId?: string): Promise<boolean> {
    // Consultar feature flag service
    return this.unleashClient.isEnabled(flagName, {
      userId: 'tenant-' + tenantId,
      context: { tenantId }
    });
  }
}

// Usage
if (await this.featureFlags.isEnabled('new_ai_pipeline')) {
  return this.newAIService.generate(query);
} else {
  return this.legacyAIService.generate(query);
}
```

**Flags iniciales:**
- `advanced_analytics` (habilitar reportes PDF)
- `whatsapp_channel` (habilitar WhatsApp)
- `ai_fallback_to_human` (fallback automático)
- `agent_collaboration` (chat interno entre agentes)
- `bulk_import_agents` (import CSV agentes)

---

## 14. Observabilidad (Monitoring + Logging + Tracing)

### 14.1. Structured Logging (Winston)

```typescript
// logger.service.ts
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'plataforma-api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

// Usage con contexto
logger.info('Message sent', {
  tenantId: 'tenant_123',
  conversationId: 'conv_456',
  messageId: 'msg_789',
  agentId: 'agent_001',
  durationMs: 145
});
```

### 14.2. Metrics (Prometheus Client)

```typescript
// metrics.service.ts
const httpRequestDuration = new Histogram('http_request_duration_seconds',
  'HTTP request latency', ['method', 'route', 'tenant_id']);

const conversationsActive = new Gauge('conversations_active',
  'Currently active conversations', ['tenant_id', 'channel']);

const aiRequestsTotal = new Counter('ai_requests_total',
  'Total AI requests', ['tenant_id', 'model', 'status']);

// Instrumentación automática via middleware
app.use((req, res, next) => {
  const end = httpRequestDuration
    .labels(req.method, req.route?.path || req.url, req.tenantId)
    .startTimer();

  res.on('finish', () => {
    end({ statusCode: res.statusCode });
  });
  next();
});
```

### 14.3. Distributed Tracing (OpenTelemetry)

```typescript
// OpenTelemetry setup
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  // instrumentations: [...]
});
sdk.start();

// Automatic tracing in NestJS
@Controller('conversations')
export class ConversationsController {
  @Post()
  @ContinueSpan() // OpenTelemetry decorator
  async create(@Body() dto: CreateConversationDto) {
    // Current span available via getSpan(api.activeSpan)
    return await this.conversationService.create(dto);
  }
}
```

**Trace Context propagation:**
- HTTP header `traceparent` (W3C Trace Context)
- WebSocket handshake carry traceparent
- All logs include `trace_id` y `span_id`

---

## 15. Asset Storage (File Uploads)

### 15.1. Storage Strategy

#### S3 (AWS) o MinIO (on-premise)

```
Storage bucket: `plataforma-attachments`
Structure:
├── tenants/{tenantId}/
│   ├── conversations/{conversationId}/
│   │   ├── images/
│   │   ├── documents/
│   │   └── audio/
│   └── knowledge-base/
│       └── {documentId}.pdf
```

### 15.2. File Upload Flow

1. Cliente solicita upload URL (firmada, temporaria)
2. Backend valida tamaño, tipo, quotas
3. Genera pre-signed S3 URL (validez 5 min)
4. Cliente sube directo a S3
5. S3 notifica via Event Notification a cola
6. Worker procesa (virus scan, thumbnail generation)
7. DB guarda metadata + URL pública (CDN)

```typescript
// Generar upload URL firmada
@Get('conversations/:id/upload-url')
async getUploadUrl(
  @Param('id') conversationId: string,
  @Query('filename') filename: string,
  @Query('contentType') contentType: string
) {
  const key = `tenants/${tenantId}/conversations/${conversationId}/${uuid()}-${filename}`;

  const url = await this.s3.getSignedUrl('putObject', {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    Expires: 300 // 5 minutes
  });

  return { url, key };
}
```

---

## 16. Versionado de API y Gestión de Cambios

### 16.1. Versioning Strategy

**URL versioning** (recommended for breaking changes):
```
https://api.com/v1/conversations
https://api.com/v2/conversations
```

**Header versioning** (opcional, para minor changes):
```
Accept: application/vnd.plataforma.v1+json
```

### 16.2. Deprecation Policy

1. Announce deprecation 6 months ahead (email + dashboard notification)
2. Sunset endpoint: mark as deprecated in docs, return warning header: `Deprecation: true, Sunset: 2025-07-01`
3. Phase 1: deprecated but still functional
4. Phase 2: return `410 Gone` (6 months after deprecation notice)

### 16.3. Change Management

- Breaking changes → new major version
- Additive changes (new fields, new endpoints) → same version
- Semantic versioning: `v1.2.3` (major.minor.patch)

---

**Estado:** Arquitectura validadad con CTO/lead developer
