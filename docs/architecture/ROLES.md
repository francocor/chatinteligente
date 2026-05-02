# Roles del Sistema y Modelo de Permisos

## 1. Jerarquía de Roles y Usuarios

### Tipos de Usuarios por Tenant

#### 1.1. Cliente Final (Final User)
**No es un usuario registrado del sistema**
- Paciente de clínica, cliente de empresa
- Interactúa vía Web Widget, WhatsApp, Email
- No requiere login
- Identificado por: cookie (web), phone number (WhatsApp), email (email)
- **Acceso:** Únicamente a la conversación actual (frontend de chat)

#### 1.2. Agente (Agent) - Nivel Operativo
**Personal de atención al cliente**
- Atiende conversaciones derivadas por IA o asignadas manualmente
- Puede responder, transferir, cerrar conversaciones
- Acceso limitado a datos de clientes (solo de sus conversaciones)
- No puede modificar configuraciones del sistema

#### 1.3. Supervisor (Supervisor) - Nivel Táctico
**Coordinador de equipo de agentes**
- Monitoriza performance de agentes en tiempo real
- Puede asignar/reasignar conversaciones
- Accede a métricas operativas (sin dato financieros)
- Puede modificar flujos guiados (no configuraciones de IA)
- Escala conversaciones críticas a administradores

#### 1.4. Administrador (Admin) - Nivel Estratégico
**Dueño/gerente de la empresa**
- Control total sobre su tenant
- Configura flujos, IA, branding, agentes
- Accede a todas las conversaciones y reportes
- Gestiona facturación y planes
- NO tiene acceso a otros tenants (multi-tenancy strict)

#### 1.5. Super Admin (Platform Admin) - Nivel Plataforma
**Equipo interno de la plataforma SaaS**
- Acceso跨-tenant (puede ver cualquier empresa)
- Gestiona tenants (crear, suspender, delete)
- Configuración global de la plataforma
- Soporte técnico avanzado
- No puede ver datos sensibles de clientes finales sin justificación

---

## 2. Matriz de Permisos Detallada

### Sistema de Permisos Granular (RBAC + ABAC)

#### Permisos por Recurso y Acción

| Recurso | Agente | Supervisor | Admin Tenant | Super Admin |
|---------|--------|------------|--------------|-------------|
| **conversations** | | | | |
| conversations:read | Solo propias asignadas | Propias + equipo (filtrado) | Todas del tenant | Todas (cross-tenant) |
| conversations:write | Responder, cerrar propias | Responder, cerrar, transferir cualquier | Cualquier operación | Cualquier operación |
| conversations:delete | ❌ | ❌ | Archivar propias tenant | Archivar cualquier |
| conversations:assign | ❌ | Reasignar entre agentes | Reasignar + asignar a cualquier | Cualquier asignación |
| conversations:export | ❌ | Exportar equipo (1k max) | Exportar todas (10k max) | Exportar sin límite |
| **agents** | | | | |
| agents:read | Ver propio perfil | Ver agentes del equipo | Ver todos agentes tenant | Ver todos agents |
| agents:create | ❌ | ❌ | ✅ Crear/eliminar agentes | ✅ Crear/eliminar任何 |
| agents:update | Actualizar propio perfil | Actualizar agentes equipo | Actualizar cualquier agente | Actualizar cualquier |
| agents:delete | ❌ | ❌ | ✅ Eliminar agentes | ✅ Eliminar任何 |
| **flows** | | | | |
| flows:read | ❌ | Ver flujos activos | Ver, editar, publicar | Ver, editar, publicar任何 |
| flows:create | ❌ | ❌ | ✅ Crear flujos | ✅ Crear任何 |
| flows:update | ❌ | ✅ Editar flujos | ✅ Editar cualquier | ✅ Editar任何 |
| flows:publish | ❌ | ❌ | ✅ Publicar/despublicar | ✅ Publicar/despublicar任何 |
| flows:delete | ❌ | ❌ | ✅ Eliminar flujos | ✅ Eliminar任何 |
| **ai** | | | | |
| ai:intents:read | ❌ | Ver intents activos | Gestionar intents | Gestionar任何 |
| ai:intents:create | ❌ | ❌ | ✅ Crear/eliminar | ✅ Crear/eliminar任何 |
| ai:intents:train | ❌ | ❌ | ✅ Re-entrenar modelo | ✅ Re-entrenar任何 |
| ai:knowledge:read | ❌ | Ver knowledge base | Gestionar documentos | Gestionar任何 |
| ai:knowledge:write | ❌ | ❌ | ✅ Añadir/eliminar docs | ✅ Gestionar任何 |
| **analytics** | | | | |
| analytics:read | Ver propias métricas | Ver métricas equipo/todo tenant | Ver todas métricas tenant | Ver todas任何 |
| analytics:export | ❌ | Exportar limitado (CSV) | Exportar completo (CSV+Excel+PDF) | Exportar sin límite |
| **reports** | | | | |
| reports:create | ❌ | ✅ Reportes programados | ✅ Cualquier reporte | ✅任何 |
| reports:schedule | ❌ | ✅ Programar reportes | ✅ Programar + modificar | ✅任何 |
| reports:delete | ❌ | ❌ | ✅ Eliminar reportes | ✅任何 |
| **integrations** | | | | |
| integrations:read | ❌ | Ver estado integraciones | Configurar integraciones | Configurar任何 |
| integrations:write | ❌ | ❌ | ✅ Configurar webhooks, APIs | ✅任何 |
| **settings** | | | | |
| settings:branding | ❌ | ❌ | ✅ Personalizar branding | ✅任何 |
| settings:channels | ❌ | ❌ | ✅ Configurar canales | ✅任何 |
| settings:agents | ❌ | ❌ | ✅ Gestionar agentes | ✅任何 |
| **billing** | | | | |
| billing:read | ❌ | ❌ | ✅ Ver facturas, uso | ✅任何 |
| billing:write | ❌ | ❌ | ✅ Cambiar plan, payment methods | ❌ (read-only) |
| billing:invoices | ❌ | ❌ | ✅ Descargar facturas | ✅任何 |

---

## 3. Modelo de Permisos Técnico

### Estructura de Base de Datos

```sql
-- Roles predefinidos por tenant
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(50) NOT NULL, -- 'agent', 'supervisor', 'admin'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permisos disponibles en el sistema (enum hardcoded)
CREATE TABLE permissions (
  code VARCHAR(100) PRIMARY KEY, -- 'conversations:read', 'agents:create', etc.
  description TEXT,
  module VARCHAR(50) -- 'conversations', 'agents', 'flows', 'ai', etc.
);

-- Relación Role-Permission (muchos-a-muchos)
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id),
  permission_code VARCHAR(100) REFERENCES permissions(code),
  PRIMARY KEY (role_id, permission_code)
);

-- Usuarios y sus roles
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES roles(id),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permisos adicionales por usuario (override granular)
CREATE TABLE user_permissions (
  user_id UUID REFERENCES users(id),
  permission_code VARCHAR(100) REFERENCES permissions(code),
  granted BOOLEAN NOT NULL DEFAULT TRUE, -- true=grant, false=deny (override)
  PRIMARY KEY (user_id, permission_code)
);
```

### Evaluación de Permisos (Policy Enforcement Point)

```typescript
// Pseudocódigo de policy check
async function canUserPerform(
  user: User,
  action: string,
  resource: string,
  tenantContext: TenantContext
): Promise<boolean> {
  // 1. Super admin siempre puede TODO
  if (user.isSuperAdmin) return true;

  // 2. Validar que el recurso pertenece al tenant del usuario (excepto super admin)
  if (!await resourceBelongsToTenant(resource, user.tenant_id)) {
    return false;
  }

  // 3. Obtener todos los permisos del usuario (role + user overrides)
  const permissions = await getUserEffectivePermissions(user.id);

  // 4. Verificar permiso específico: resource:action
  const requiredPermission = `${resource}:${action}`;
  return permissions.includes(requiredPermission);
}
```

### Permisos por Módulo (Lista Exhaustiva)

#### Permisos de Conversations
```
conversations:read                 # Leer conversaciones
conversations:read:all             # Leer todas (no solo asignadas)
conversations:write               # Enviar mensajes
conversations:write:internal      # Enviar notas internas
conversations:transfer            # Transferir conversación
conversations:close               # Cerrar/resolver conversación
conversations:delete              # Archivar/eliminar
conversations:export              # Exportar conversación
conversations:tag                 # Añadir/eliminar tags
conversations:search              # Búsqueda full-text
```

#### Permisos de Agents
```
agents:read                      # Ver agentes
agents:create                    # Crear agente
agents:update                    # Editar agente
agents:delete                    # Eliminar agente
agents:assign                    # Asignar conversaciones
agents:view:performance          # Ver métricas de performance
agents:view:sensitive            # Ver datos sensibles (historial completo)
```

#### Permisos de Flows
```
flows:read                       # Ver flujos
flows:create                     # Crear flujo
flows:update                     # Editar flujo
flows:delete                     # Eliminar flujo
flows:publish                    # Publicar/activar flujo
flows:version:rollback           # Rollback a versión anterior
flows:ab-test                    # Configurar A/B testing
```

#### Permisos de IA
```
ai:intents:read                  # Ver intenciones
ai:intents:create                # Crear intención
ai:intents:update                # Editar intención
ai:intents:delete                # Eliminar intención
ai:intents:train                 # (Re-)entrenar modelo
ai:knowledge:read                # Ver base de conocimiento
ai:knowledge:write               # Añadir/editar documentos
ai:knowledge:delete              # Eliminar documentos
ai:config:read                   # Ver configuración IA
ai:config:write                  # Modificar configuración (modelo, thresholds)
```

#### Permisos de Analytics
```
analytics:read                   # Ver dashboards
analytics:read:detailed          # Ver detalles ampliados
analytics:export                 # Exportar reportes
analytics:schedule               # Programar reportes automáticos
analytics:view:financial         # Ver métricas financieras (costo, MRR)
analytics:view:sensitive         # Ver datos sensibles (CSAT individual)
```

#### Permisos de Integraciones
```
integrations:read                # Ver estado integraciones
integrations:write               # Configurar integraciones
integrations:webhooks:create     # Crear webhook
integrations:webhooks:update     # Editar webhook
integrations:webhooks:delete     # Eliminar webhook
integrations:api-keys:manage     # Gestionar API keys
```

#### Permisos de Admin Tenant
```
admin:users:manage               # Gestionar usuarios del tenant
admin:settings:branding          # Personalizar branding
admin:settings:channels          # Configurar canales
admin:billing:view               # Ver facturación
admin:billing:modify             # Cambiar plan, payment method
admin:security:audit             # Ver logs de auditoría
admin:security:api-keys          # Gestionar API keys
```

#### Permisos de Super Admin (Platform)
```
platform:tenants:manage          # Gestionar tenants (crear/suspender)
platform:tenants:view:all        # Ver todos tenants
platform:settings:global         # Configuración global plataforma
platform:monitoring              # Acceso completo a métricas
platform:audit:all               # Logs de auditoría跨-tenant
platform:support:impersonate     # Impersonate usuario (soporte)
```

---

## 4. Roles por Default por Plan

### Plan Básico
- 1 Admin (dueño)
- Hasta 2 Agentes
- Sin Supervisor (puede ser Admin o Agente senior)
- Permisos: limitados a agentes + admin

### Plan Profesional
- 1 Admin
- Hasta 3 Supervisores
- Hasta 10 Agentes
- Permisos: supervisor + agent + admin

### Plan Empresarial
- Multiples Admins
- Múltiples Supervisores por área
- Agentes ilimitados
- Permisos completos + API access

---

## 5. Contexto de Tenant y Aislamiento

### Middleware de Tenant Context

Cada request HTTP lleva:
1. **JWT token** decodificado → user_id
2. **User table lookup** → tenant_id + role_id
3. **Tenant context** inyectado en request object

```typescript
// Ejemplo middleware NestJS
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.authService.validateToken(req);
    const tenant = await this.tenantService.getTenant(user.tenantId);

    // Añadir a request
    (req as any).tenant = tenant;
    (req as any).user = user;

    next();
  }
}
```

### Row-Level Security (RLS) en PostgreSQL

Para asegurar aislamiento en queries complejas:

```sql
-- Enable RLS on tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see conversations from their tenant
CREATE POLICY tenant_isolation_conversations ON conversations
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

**NOTA:** En MVP, application-level filtering es suficiente. RLS para fase posterior.

---

## 6. Flujos de Onboarding de Usuarios

### 6.1. Onboarding Admin (Dueño de Clínica)
1. Registro: email + password + empresa (tenant creation)
2. Verification email (one-time link)
3. Login primera vez → onboarding wizard
4. Configuración rápida:
   - Datos de la empresa (nombre, rubro, horario)
   - Canal Web Widget (copiar embed code)
   - Canal WhatsApp (conectar Meta Business)
   - Flujo inicial rápido (3-5 pasos)
5. Invitar agentes (bulk o individual email invite)
6. Dashboard principal activo

### 6.2. Onboarding Agente
1. Recibe email de invitación (link con token)
2. Set password
3. Accede a dashboard (solo sus conversaciones)
4. Tutorial rápido (5 min) de agent workspace
5. Asignación automática a cola por defecto

### 6.3. Onboarding Supervisor
1. Creación por Admin (o auto-registro con approval)
2. Permisos pre-configurados según plan
3. Capacitación: dashboards, monitor, asignación
4. Configuración de reglas de alerta iniciales

---

## 7. Cambios de Rol y Permisos Dinámicos

### Escenario 1: Agente promovido a Supervisor
```typescript
async function promoteAgent(userId: string) {
  // 1. Obtener user actual
  const user = await userRepo.findById(userId);

  // 2. Asignar nuevo rol (supervisor)
  const supervisorRole = await roleRepo.findByName('supervisor', user.tenantId);
  user.roleId = supervisorRole.id;
  await userRepo.save(user);

  // 3. Invalidar todas las sesiones activas (forzar re-login)
  await sessionService.revokeAllForUser(userId);

  // 4. Enviar email notificación
  await emailService.sendRoleChanged(user.email, 'supervisor');

  // 5. Audit log
  await auditLogService.log({
    action: 'user.role_changed',
    userId: user.id,
    fromRole: 'agent',
    toRole: 'supervisor',
    performedBy: adminId
  });
}
```

### Escenario 2: Permisos personalizados por tenant
Algunos tenants pueden necesitar permisos especiales (ej: clínica permite a supervisor ver todas conversaciones):
```typescript
// Grant custom permission
await userPermissionService.grant(
  supervisorUserId,
  'conversations:read:all' // permiso especial no en rol por defecto
);
```

### Escenario 3: Temporary elevated permissions (just-in-time)
```typescript
// Elevar permisos por 2 horas para tarea específica
await permissionService.grantTemporary(
  agentId,
  ['conversations:export'],
  duration: '2h',
  reason: 'Export monthly report'
);
```

---

## 8. Auditoría de Acciones (Audit Trail)

### Tabla `audit_logs`

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID, -- NULL para actions del sistema
  action VARCHAR(100) NOT NULL, -- 'user.login', 'conversation.transferred', 'flow.published'
  resource_type VARCHAR(50), -- 'conversation', 'agent', 'flow'
  resource_id UUID,
  old_values JSONB, -- estado anterior (para updates)
  new_values JSONB, -- estado nuevo
  ip_address INET,
  user_agent TEXT,
  metadata JSONB, -- datos adicionales
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Eventos Críticos a Auditar
- **Autenticación:** login, logout, failed login, password change
- **Conversaciones:** create, read (logeado), transfer, close, delete
- **Agentes:** create, update role, delete, permissions change
- **Flujos:** publish, delete, version rollback
- **Configuraciones:** cualquier cambio de settings, integraciones
- **Billing:** plan change, payment method added
- **Admin cross-tenant:** cualquier acceso super admin a tenant

### Retención de Audit Logs
- **Hot storage (DB):** 90 días (queryable)
- **Cold storage (S3/archivo):** 7 años (compliance legal)
- Exportación para auditoría externa bajo solicitud

### Query de Auditoría (ejemplos)

```sql
-- Ver todos los cambios de un usuario específico
SELECT * FROM audit_logs
WHERE user_id = 'user-abc'
ORDER BY created_at DESC
LIMIT 100;

-- Ver quién eliminó un agente
SELECT user_id, old_values, new_values, created_at
FROM audit_logs
WHERE action = 'agent.deleted'
  AND resource_id = 'agent-123';

-- Detectar accesos no autorizados
SELECT DISTINCT user_id, COUNT(*) as attempts
FROM audit_logs
WHERE action = 'conversation:unauthorized_access'
  AND created_at >= NOW() - INTERVAL '1 day'
GROUP BY user_id
HAVING COUNT(*) > 10;
```

---

## 9. Nociones de Seguridad

### 9.1. Authentication
- **JWT** para stateless auth
- Refresh tokens rotativos
- Acceso token almacenado en HttpOnly secure cookie + CSRF token
-opcional: MFA con TOTP (Google Authenticator)

### 9.2. Authorization
- Attribute-Based Access Control (ABAC) además de RBAC
- Checks a nivel de API + servicios
- Context propagation: tenant_id + user_id en todos los servicios

### 9.3. Session Management
- Sessions limitadas por tenant (max concurrent sessions per user)
- Device fingerprinting opcional (detectar acceso desde dispositivo nuevo)
- Auto-logout tras inactividad (configurable: 15min, 30min, 1h)
- Revocation inmediata de todos los tokens al logout

### 9.4. Password Security
- Hasheo: Argon2id (o bcrypt con cost factor 12+)
- Salt único por usuario
- Password policy: min 8 chars, uppercase, number, special char
- Breach monitoring (HaveIBeenPwned API integration)

### 9.5. API Security
- Rate limiting por IP + user + endpoint
- Input validation (Zod en API layer)
- SQL injection prevention (Prisma parametrized queries)
- XSS protection (sanitización de mensajes)
- CORS configurado por tenant (allowed origins)

### 9.6. Data Privacy
- Encriptación en tránsito: TLS 1.3 (HTTPS everywhere)
- Encriptación en reposo:
  - DB: Transparent Data Encryption (TDE) o aplicativo
  - Backups: AES-256
- PII minimization: No almacenar data sensible innecesaria
- Right to be forgotten: Eliminación completa de datos usuario bajo solicitud
- Data residency: Permitir tenant elegir región de datos (futuro)

### 9.7. Audit Compliance
- Logs inmutables (append-only, WORM storage)
- Timestamps en UTC (no local time)
- User attribution always present
- Retention policies documentadas y automatizadas

---

## 10. Escenarios de Seguridad (Security Stories)

### Story 1: Agent malintencionado lee conversaciones de otro agente
**Debe fallar:**
1. Agent A intenta GET `/api/v1/conversations` sin filtro
2. Backend agrega `WHERE tenant_id = X AND assigned_agent_id = current_user`
3. Solo conversaciones propias o de su equipo (si supervisor) son retornadas
4. Audit log: `conversation:unauthorized_access` → alerta

### Story 2: Super admin accede a datos de tenant competidor
**Debe fallar:**
1. Super admin puede ver tenant B, pero no es dueño
2. Acceso debe estar justificado (soporte ticket) y auditado
3. Posible implementación: two-man rule para accesos críticos cross-tenant
4. Alert automática a security team

### Story 3: Exfiltración masiva de datos del cliente
**Debe fallar:**
1. Límites de exportación por plan (1k, 10k, 100k filas)
2. Rate limiting en descargas (max 3 reportes simultáneos)
3. Watermarking en PDFs exportados ("CONFIDENTIAL - Tenant X")
4. User reporting de actividad sospechosa

---

## 11. Roles Técnicos (Solo para Personal de Plataforma)

### 11.1. DevOps Engineer
- Acceso a infraestructura (K8s, cloud consoles)
- NO acceso a datos de producción (excepto logs aggregated)
- Permisos separados: deploy-only, monitoring-only

### 11.2. Data Analyst
- Acceso a DB readonly (replica)
- Sin acceso a PII (campos sensibles enmascarados)
- Acceso únicamente a tablas agregadas/metrics

### 11.3. Customer Success Manager (CSM)
- Puede impersonate usuarios para debugging (con approval workflow)
- Acceso limitado a conversaciones de sus tenants asignados
- No puede modificar configuración ni eliminar datos

---

**Estado:** Pendiente de validación con legal (cumplimiento normativo) y equipo de producto
