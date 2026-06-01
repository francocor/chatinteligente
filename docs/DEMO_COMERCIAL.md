# Plataforma de Atención Inteligente — Guía Comercial de Demo

## ¿Qué es la plataforma?

Plataforma SaaS de atención al cliente impulsada por Inteligencia Artificial. Centraliza conversaciones de múltiples canales (WhatsApp, Web, Email, Instagram, Telegram, Facebook), automatiza respuestas con IA, escala a agentes humanos cuando es necesario, y entrega métricas accionables en tiempo real.

---

## ¿A qué rubros aplica?

La plataforma es **multi-industria**. Casos de uso actuales configurados en demo:

| Rubro | Casos de uso principales |
|---|---|
| **E-commerce** | Seguimiento de pedidos, devoluciones, estado de envío, medios de pago |
| **Salud** | Turnos médicos, cobertura de obra social, resultados de estudios |
| **Inmobiliaria** | Consultas de propiedades, coordinación de visitas, precios, alquiler |
| **Legal** | Turnos con abogados, honorarios, documentación, consultas legales |
| **Soporte técnico** | Incidencias, tickets, actualizaciones, gestión de SLA |
| **Cualquier rubro** | Atención general, derivación a agente humano, base de conocimiento |

---

## Problema que resuelve

| Problema actual | Solución de la plataforma |
|---|---|
| Consultas repetidas que saturan al equipo humano | Bot IA responde el 70–80% de las consultas automáticamente |
| Múltiples canales sin unificar | Una sola bandeja para WhatsApp, Web, Email, Instagram, etc. |
| Sin visibilidad de métricas | Dashboard con KPIs, reportes exportables, alertas automáticas |
| Escalado manual y lento | Escalado automático a agente según reglas configurables |
| Sin historial de contacto | CRM integrado con historial completo de cada cliente |

---

## Módulos incluidos en la demo

| Módulo | Descripción | Estado demo |
|---|---|---|
| **Demo pública** | Chat interactivo por industria, derivación humana | ✅ Funcional |
| **Conversaciones** | Bandeja unificada, filtros, detalle con chat | ✅ Funcional |
| **Tickets** | Sistema de tickets con prioridades y SLA | ✅ Funcional |
| **Alertas** | Alertas en tiempo real con reglas configurables | ✅ Funcional |
| **Contactos** | CRM básico con historial y canales preferidos | ✅ Funcional |
| **Agentes** | Panel de agentes con métricas individuales | ✅ Funcional |
| **Flujos** | Constructor de flujos conversacionales | ✅ Mock funcional |
| **Conocimiento** | Base de conocimiento para entrenamiento del bot | ✅ Mock funcional |
| **Reportes** | Analíticas avanzadas con KPIs estratégicos | ✅ Mock funcional |
| **Exportaciones** | Exportar datos en CSV/XLSX/PDF | ✅ Descarga real demo |
| **Facturación** | Gestión de planes y facturas | ✅ Mock funcional |
| **Ayuda** | Centro de ayuda con formulario de contacto | ✅ Funcional |

---

## Flujo de demo recomendado

### Duración sugerida: 20–30 minutos

1. **Landing page** (`/`)
   - Mostrar propuesta de valor, pricing, FAQ
   - Hacer clic en "Probar Demo" o "Ver Demo"

2. **Demo pública** (`/demo`)
   - Seleccionar industria del cliente (e-commerce, salud, legal, etc.)
   - Chatear con el bot → el bot responde específicamente para ese rubro
   - Escribir "urgente" o "hablar con humano" → ver la derivación automática

3. **Login** (`/login`)
   - Ingresar con las credenciales demo (ver abajo)

4. **Dashboard de conversaciones** (`/dashboard/conversations`)
   - Mostrar bandeja unificada con filtros por estado, prioridad y canal
   - Seleccionar múltiples conversaciones → bulk actions (asignar, cerrar)

5. **Conversación detalle** (`/dashboard/conversations/conv-1`)
   - Mostrar historial de mensajes con el cliente
   - Responder un mensaje → feedback visual en tiempo real
   - Cambiar estado y agente asignado con los dropdowns

6. **Tickets** (`/dashboard/tickets`)
   - Mostrar tabla de tickets con SLA
   - Hacer clic en un ticket → vista de detalle completo

7. **Alertas** (`/dashboard/alerts`)
   - Mostrar alertas por tipo y urgencia
   - Reconocer, resolver y descartar alertas en vivo
   - Abrir "Reglas" → crear una nueva regla demo

8. **Contactos** (`/dashboard/contacts`)
   - Mostrar CRM con búsqueda funcional
   - Hacer clic en "Ver detalle" → modal con datos completos

9. **Reportes** (`/dashboard/reports`)
   - Mostrar KPIs, distribución por canal, rendimiento de agentes
   - Hacer clic en "Exportar" → navega a exportaciones

10. **Exportaciones** (`/dashboard/exports`)
    - Seleccionar tipo de reporte y formato
    - Hacer clic en "Generar y Descargar" → descarga CSV real

---

## Credenciales de acceso demo

```
Email:     admin@clinicasanjuan.cl
Password:  admin123
Tenant ID: 5425d30b-41bc-4eee-a7d8-7dfaa1115509
```

> El dashboard valida token en localStorage. Si el login da error de API, usá el workaround:
> Abrí la consola del browser → `localStorage.setItem('accessToken', 'demo-token')` → recargá `/dashboard/conversations`

---

## ¿Qué funciona en modo demo/mock?

| Feature | Modo demo | Nota |
|---|---|---|
| Chat bot multi-industria | ✅ Funcional | Respuestas keyword-based, sin LLM real |
| Derivación a agente humano | ✅ Funcional | Detecta keywords como "urgente", "humano", "queja" |
| Conversaciones (bandeja, detalle) | ✅ Funcional | Datos mock, mensajes locales |
| Bulk actions (asignar, cerrar, eliminar) | ✅ Funcional | Solo en estado local |
| Alertas (reconocer, resolver, descartar) | ✅ Funcional | Solo en estado local |
| Reglas de alertas (crear, toggle, eliminar) | ✅ Funcional | Solo en estado local |
| Tickets (lista + detalle) | ✅ Funcional | Datos mock |
| Contactos (CRM básico) | ✅ Funcional | Datos mock, modales reales |
| Exportaciones (generar + descargar) | ✅ Funcional | Descarga CSV real con datos de ejemplo |
| Reportes (analíticas) | ✅ Funcional | Datos mock, gráficos funcionales |
| Billing (cambiar plan) | ✅ Funcional | Modal demo, sin procesamiento real |
| Notificaciones (campanita) | ✅ Funcional | 5 notificaciones mock, marcar como leídas |
| Búsqueda global (header) | ✅ Funcional | 10 resultados mock, navega a rutas reales |
| Auth (login/logout) | ⚠️ Parcial | Requiere backend activo para JWT real |
| AI responses | ❌ Mock | MockAiProvider, sin LLM real conectado |
| Integraciones WhatsApp/Instagram | ❌ No activo | Requiere configuración de webhooks |

---

## ¿Qué falta para producción real?

### Prioridad Alta
- [ ] Conectar proveedor de IA real (OpenAI o Claude) — `AIModule` ya existe, solo falta API key
- [ ] Configurar webhooks de WhatsApp (Meta Business API)
- [ ] Auth completo con JWT real funcionando end-to-end
- [ ] Base de datos PostgreSQL en producción (Prisma schema ya definido)

### Prioridad Media
- [ ] Habilitar módulos del backend actualmente deshabilitados (Knowledge, Flows, Analytics)
- [ ] Configurar WebSockets para mensajes en tiempo real
- [ ] Integrar pasarela de pago para billing real
- [ ] Configurar emails transaccionales (SMTP)

### Prioridad Baja
- [ ] Panel de administración multi-tenant
- [ ] Editor visual de flujos conversacionales
- [ ] Reportes con datos reales persistidos
- [ ] SSO / autenticación con Google/Microsoft

---

## Cómo levantar el frontend

```bash
# Requisitos: Node.js 18+, pnpm

cd apps/web
pnpm install
pnpm run dev

# Acceder en: http://localhost:3000
```

---

## Cómo levantar el backend (para auth real)

```bash
# Requisitos: Node.js 18+, pnpm, Docker, PostgreSQL

# 1. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
# Editar apps/api/.env con credenciales reales

# 2. Levantar la base de datos
docker-compose up -d postgres

# 3. Aplicar el schema
cd apps/api
pnpm run prisma:migrate

# 4. Levantar el servidor
pnpm run start:dev

# API en: http://localhost:3001
```

> **Nota:** El frontend funciona sin backend para todos los módulos mock. El backend solo es necesario para auth real y conversaciones en tiempo real.

---

## Contacto comercial

| Canal | Contacto |
|---|---|
| **Email** | soporte@chatinteligente.demo |
| **Web** | https://nuevo-porfolio-eger.vercel.app/ |
| **WhatsApp** | +54 381 6348569 |

---

*Última actualización: Mayo 2026 — Fase 4 completa*
