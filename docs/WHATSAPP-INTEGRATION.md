# Integración WhatsApp Cloud API

## Descripción General

Este módulo proporciona integración completa con WhatsApp Cloud API de Meta para permitir comunicación bidireccional con clientes a través de WhatsApp. La integración es omnicanal y se integra con el sistema de conversaciones existente.

## Flujo Técnico de Producción

### 1. Configuración Inicial

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SETUP PHASE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                             │
│  [Admin] ──[1]──> POST /whatsapp/config                    │
│                            │                              │
│                            ▼                              │
│  [API] ──[2]──> Validar credentials con Meta           │
│                            │                              │
│                            ▼                              │
│  [API] ──[3]──> Guardar config cifrada (Prisma)          │
│                            │                              │
│                            ▼                              │
│  [Admin] ──[4]──> Configurar webhook URL               │
│        https://api.dominio.com/whatsapp/webhook           │
│                            │                              │
│                            ▼                              │
│  [Meta] ──[5]──> Verificar webhook con token           │
│                             │                             │
│                             ▼                             │
│  [API] ──[6]──> Webhook activo y verificado          │
│                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Recepción de Mensajes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               INBOUND MESSAGE FLOW                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                             │
│  [Cliente] ──[1]──> Envía mensaje a número WhatsApp      │
│                            │                              │
│                            ▼                              │
│  [Meta] ──[2]──> POST a Webhook configurado            │
│  (webhook URL)     │                              │
│                            │                              │
│  [API] ──[3]──> Validar firma HMAC                    │
│                            │                              │
│                            ▼                              │
│  [API] ──[4]──> Procesar payload JSON                │
│                  Extract: from, id, type, content          │
│                            │                              │
│                            ▼                              │
│  [API] ──[5]──> Buscar o crear contato existente     │
│                            │                              │
│                            ▼                              │
│  [API] ──[6]──> Buscar conversación activa          │
│                  (status IN [ACTIVE,WAITING,IN_PROGRESS]) │
│                            │                              │
│  ┌──────────────────┴──────────────────┐            │
│  │                                     │            │
│  ▼                                     ▼            │
│  [Nueva Conv.] ──[7a]──> Crear conversación    │
│  (contactId?)      │                        │
│                   │                        │
│  [Conv. Existente]──[7b]──> Agregar mensaje  │
│                                         │            │
│  ┌──────────────────┴──────────────────┐            │
│  │                                     │            │
│  ▼                                     ▼            │
│  [API] ──[8]──> Actualizar métricas      │
│  - messagesReceived en WhatsAppConfig   │
│  - lastMessageAt en Contact           │
│                            │                              │
│  ┌──────────────────┴──────────────────┐            │
│  │                                     │            │
│  ▼                                     ▼            │
│  [Chat Engine] ──[9]──> Procesar mensaje  │
│  - Detectar intención               │
│  - Ejecutar flow                   │
│  - Generar respuesta               │
│                                         │            │
│  ┌──────────────────┴──────────────────┐            │
│  │                                     │            │
│  ▼                                     ▼            │
│  [WhatsApp Service]──[10]──> Enviar respuesta │
│                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3. Envío de Mensajes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               OUTBOUND MESSAGE FLOW                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                             │
│  [Agente/Sistema] ──[1]──> POST /whatsapp/messages     │
│                         params: conversationId, content  │
│                            │                              │
│                            ▼                              │
│  [API] ──[2]──> Validar config activa               │
│                            │                              │
��                            ▼                              │
│  [API] ──[3]──> Verificar rate limits              │
│                            │                              │
│                            ▼                              │
│  [API] ──[4]──> Validar hours de operación       │
│                            │                              │
│                            ▼                              │
│  [API] ──[5]──> Crear registro en WhatsAppMessage  │
│                  status: PENDING                      │
│                            │                              │
│                            ▼                              │
│  [WhatsApp API] ──[6]──> POST to Meta Graph API  │
│                  https://graph.facebook.com/v18.0/    │
│                  /{phoneNumberId}/messages           │
│                            │                              │
│  ┌──────────────────┴──────────────────┐            │
│  │                                     │            │
│  ▼                                     ▼            │
│  [SUCCESS] ──[7a]──> Actualizar wamid, status = SENT │
│                  │                        │
│  [FAILED] ──[7b]──> Registrar error             │
│                  status = FAILED                     │
│                  error message                      │
│                            │                              │
│  ┌──────────────────┴──────────────────┐            │
│  │                                     │            │
│  ▼                                     ▼            │
│  [Retry Service] ──[8]──> Programar reintento      │
│  (si fallido, max 3 intentos)        │
│                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4. Estados de Mensajes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  MESSAGE STATUS UPDATES                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                             │
│  [Meta] ──[1]──> Status update webhook                  │
│              statuses: [sent, delivered, read, failed] │
│                            │                              │
│                            ▼                              │
│  [API] ──[2]──> Buscar mensaje por wamid           │
│                            │                              │
│                            ▼                              │
│  [API] ──[3]──> Actualizar estado             │
│                                                             │
│  ┌─────────────────────────────────────┐                 │
│  │ mapping:                            │                 │
│  │ sent ────────> status: SENT        │                 │
│  │ sentAt ──sent timestamp             │                 │
│  │ ────────>                         │                 │
│  │ delivered ──> status: DELIVERED   │                 │
│  │ deliveredAt                      │                 │
│  │ ────────>                         │                 │
│  │ read ────────> status: READ        │                 │
│  │ readAt ──read timestamp           │                 │
│  │ ────────>                         │                 │
│  │ failed ────> status: FAILED     │                 │
│  │ error ────error message         │                 │
│  │ expired ──>status: EXPIRED      │                 │
│  └─────────────────────────────────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5. Plantillas de WhatsApp

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  TEMPLATE MANAGEMENT                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                             │
│  [Admin] ──[1]──> POST /whatsapp/templates/sync      │
│                            │                              │
│                            ▼                              │
│  [WhatsApp API] ──[2]──> GET /message_templates   │
│                            │                              │
��                            ▼                              │
│  [API] ──[3]──> Upsert templates en Prisma         │
│                            │                              │
│                            ▼                              │
│  [Templates] ──[4]──> Usar en respuestas           │
│                      - Saludos                         │
│                      - Off-hours                      │
│                      - Ticket created                 │
│                      - Resolución                     │
│                      - CSAT request                   │
│                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Arquitectura de Datos

### Entidades Principales

```prisma
// Configuración de WhatsApp por tenant
model WhatsAppConfig {
  id                    String    // PK
  tenantId              String    // FK -> Tenant
  phoneNumberId         String    // Meta phone number ID
  businessAccountId    String    // Meta business account ID
  phoneNumber          String    // Número de teléfono
  businessName         String    // Nombre del negocio
  accessToken          String    // Token de acceso (cifrado)
  isActive             Boolean   // Si está activo
  config               Json      // Configuración adicional
}

// Mensajes enviados/recibidos
model WhatsAppMessage {
  id              String    // PK
  tenantId        String
  wamid           String    // WhatsApp message ID
  conversationId String?  // FK -> Conversation
  from            String   // De número teléfono
  to              String    // A número teléfono
  direction       Enum     // INBOUND, OUTBOUND
  type            Enum     // TEXT, IMAGE, etc.
  status          Enum     // PENDING, SENT, DELIVERED, READ, FAILED
  retryCount      Int       // Intentos de reintento
}

// Plantillas de Meta
model WhatsAppTemplate {
  id              String
  tenantId        String
  wabaTemplateId  String?   // Meta template ID
  name           String
  category       Enum      // MARKETING, UTILITY, AUTHENTICATION
  bodyContent    String    // Cuerpo del template
  status         Enum      // APPROVED, REJECTED, DRAFT
}

// Contactos de WhatsApp (opt-in)
model WhatsAppContact {
  id              String
  tenantId        String
  phoneNumber     String
  waId           String    // WhatsApp ID
  optedInAt      DateTime?
  optedOutAt     DateTime?
  blockedByUs    Boolean
}

// Logs de eventos
model WhatsAppEventLog {
  id              String
  tenantId        String
  eventType       Enum      // MESSAGE_RECEIVED, MESSAGE_SENT, etc.
  wamid           String?
  status         Enum      // SUCCESS, FAILED
  error          String?
  duration       Int       // ms
}
```

## Seguridad

### 1. Autenticación de Webhooks
- **Verify Token**: Generado aleatoriamente al crear config
- **HMAC Signature**: Validada en cada request entrante
- **Secret Key**: Almacenada cifrada

### 2. Rate Limiting
- Límite por config: 1000 mensajes/segundo
- Límiteburst: 100 mensajes/minuto
- Tracking en `WhatsAppRateLimit`

### 3. Rate Limits por Código de Error

| Código | Significado | Acción |
|--------|-----------|--------|
| 401 | Token expirado | Renovar token |
| 403 | Número no verificado | Verificar en Meta |
| 1200 | Rate limit excedido | Reintentar en 1 min |
| 1312 | No-opt-in | Notificar al agente |
| 1313 | Outside hours | Guardar para later |

## Errores y Reintentos

### Estrategia de Reintento

```
intentos_max = 3
delays = [5s, 15s, 60s]

for intento in range(1, intentos_max + 1):
    try:
        send_message()
        break
    except RateLimitError:
        wait(delays[intento - 1])
    except TimeoutError:
        if intento == intentos_max:
            mark_as_failed()
        wait(delays[intento - 1])
```

### Códigos de Error Comunes

- **1-2**: Error genérico - reintentar
- **100**: JSON inválido - no reintentar, revisar payload
- **200**: Campo inválido - no reintentar
- **400**: Número inválido - verificar número
- **401**: Token expirado - renovar
- **403**: Número no verificado - configurar en Meta
- **500**: Error interno - reintentar
- **1200**: Rate limit - esperar y reintentar
- **1310-1316**: Errores de template - revisar en Meta

## Métricas

### KPIs de WhatsApp

- **Total messages received**: Mensajes entrantes
- **Total messages sent**: Mensajes salientes
- **Delivery rate**: DELIVERED / SENT × 100
- **Read rate**: READ / DELIVERED × 100
- **Failed rate**: FAILED / total × 100
- **Avg response time**: Tiempo promedio de primera respuesta

### Dashboard de Conversaciones

- Canal: WHATSAPP
- Estado de conversación linked a WhatsAppMessage.status
- Contacto linked a WhatsAppContact

## Configuración por Empresa

### Settings Disponibles

```json
{
  "autoCreateContact": true,
  "autoAssignAgent": true,
  "defaultDepartmentId": "uuid",
  "defaultFlowId": "uuid",
  "greetingMessage": "Hola, bienvenido a...",
  "offlineMessage": "Estamos fuera de horario...",
  "humanRequestMessage": "Un agente te atenderá...",
  "workingHours": {
    "timezone": "America/Santiago",
    "monday": { "start": "08:00", "end": "20:00" },
    "tuesday": { "start": "08:00", "end": "20:00" },
    ...
  },
  "templates": {
    "greeting": "bienvenida",
    "humanOffer": " humano disponible",
    "offline": "horario",
    ...
  }
}
```

## Webhook Endpoints

| Método | Endpoint | Descripción |
|--------|---------|-----------|
| GET | /whatsapp/webhook | Verificación |
| POST | /whatsapp/webhook | Receive events |
| GET | /whatsapp/config | Get config |
| POST | /whatsapp/config | Create config |
| PUT | /whatsapp/config | Update config |
| POST | /whatsapp/config/verify | Verify credenciales |
| POST | /whatsapp/messages | Send message |
| GET | /whatsapp/messages | List messages |
| GET | /whatsapp/templates | Get templates |
| POST | /whatsapp/templates/sync | Sync desde Meta |
| GET | /whatsapp/events | Get event logs |

## Fallback a Humano

### Flujo Automático

```
[Cliente] ──[mensaje]──> [AI Flow]
                            │
                            ▼
[Detectar frustración] ──[3 intentos sin resolución]
                            │
                            ▼
[Detectar "hablar con humano"]
                            │
                            ▼
[Si config.humanRequestMessage] ──[Enviar mensaje]
                            │
                            ▼
[Conversation.humanAssistanceRequested = true]
                            │
                            ▼
[Notificar agentes disponibles]
                            │
                            ▼
[Agente toma conversación]
```