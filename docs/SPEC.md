# Plataforma SaaS de Atención al Cliente Inteligente - SPEC

## 1. Visión Integral del Producto

### 1.1 Propósito y Propuesta de Valor

La Plataforma de Atención Inteligente es un sistema SaaS multiempresa que transforma la atención al cliente tradicional mediante la combinación de automatización conversacional con intervención humana estratégica. Diseñada inicialmente para el sector médico-sanitario (clínicas, sanatorios, centros médicos), la plataforma es altamente adaptable a otros verticales como telecomunicaciones, comercio minorista, servicios profesionales y banca.

El valor diferencial de esta plataforma radica en que no es simplemente un chatbot, sino una solución completa de gestión de relaciones con clientes que integra:

- **Autogestión inteligente**: Los clientes pueden resolver consultas comunes sin intervención humana mediante flujos guiados y respuestas generadas por inteligencia artificial.
- **Escalabilidad sin fricción**: La plataforma permite aumentar el volumen de consultas hasta 10 veces sin requerir incremento proporcional de personal de atención.
- **Medibilidad total**: Cada conversación, decisión y resultado es rastreable, permitiendo optimización continua basada en datos.
- **Experiencia unificada**: Un solo panel de control para gestionar todos los canales de comunicación, agentes y métricas.

### 1.2 Objetivos Estratégicos del Negocio

**Reducción de costos operativos**: La meta es disminuir hasta 40% el tiempo de atención humana mediante la automatización inteligente de consultas repetitivas y procesos estructurados.

**Mejora de satisfacción del cliente**: El objetivo es aumentar el CSAT (Customer Satisfaction Score) del promedio actual del 75% a más del 90% mediante respuestas inmediatas, precisas y personalizadas disponibles las 24 horas del día, los 7 días de la semana.

**Escalabilidad empresarial**: La arquitectura multi-tenant permite que cientos de empresas operen en un solo despliegue con aislamiento total de datos, facilitando el crecimiento del negocio sin degradación del rendimiento.

**Monetización sostenible**: El modelo SaaS por empresa con planes escalonados basados en volumen de mensajes, cantidad de agentes y funcionalidades premium asegura ingresos recurrentes predecibles.

### 1.3纵向 Inicial: Sector Médico-Sanitario

El enfoque inicial en clínicas, sanatorios y centros médicos responde a características específicas de este vertical:

- **Alta demanda de atención**: Los pacientes requieren atención programada (turnos) y urgente (emergencias), generando un volumen constante de consultas.
- **Procesos estructurados**: La solicitud de turnos, consultas sobre especialidades, preparación para estudios y follow-up post-tratamiento siguen flujos predecibles.
- **Regulaciones claras**: La Ley de Protección de Datos Personales (Ley 25.326 en Argentina) y normativas de historia clínica establecen requisitos claros de cumplimiento.
- **Necesidad de disponibilidad 24/7**: Los centros médicos requieren atención fuera de horario administrativo sin incrementar costos de personal.

### 1.4 Escalabilidad Horizontal Futura

La arquitectura está diseñada para adaptarse a múltiples verticales:

**Telecomunicaciones**: Consultas sobre facturación, estado de servicios, planes disponibles, soporte técnico básico, gestión de reclamos.

**Comercio Retail**: Seguimiento de pedidos, políticas de devolución, disponibilidad de stock, consultas sobre promociones y programas de fidelización.

**Servicios Profesionales**: Consultas iniciales, agendamiento de citas, clasificación de necesidades, derivación a especialistas.

**Banca y Fintech**: Consultas de saldos, estado de transacciones, trámites bancarios básicos, soporte transaccional.

### 1.5 Alcance y Limitaciones

**Incluido en el alcance inicial**:

- Chatbot con respuestas predeterminadas y flujos guiados.
- Interpretación de lenguaje natural mediante IA.
- Derivación automática y manual a asesores humanos.
- Alertas internas configurables.
- Panel administrativo multiempresa.
- Analíticas y gráficos operativos.
- Generación de reportes en múltiples formatos.
- Trazabilidad completa de conversaciones.

**Excluido del alcance inicial** (pero preparado para futuro):

- Integración completa con sistemas de historia clínica electrónica (solo consultas simples de información).
- Procesamiento de pagos y cobros (solo informativo).
- Prescripciones médicas digitales.
- Gestión administrativa hospitalaria completa.

---

## 2. Arquitectura del Sistema

### 2.1 Principios de Diseño Arquitectónico

La arquitectura se fundamenta en principios que aseguran escalabilidad, mantenibilidad y robustez:

**Simplicidad sobre complejidad**: Evitar sobreingeniería en las fases tempranas, privilegiando soluciones probadas y comprensibles.

**Límites claros**: Separación por contextos delimitados (bounded contexts) que definen módulos con responsabilidades específicas y bien definidas.

**API-first**: Toda funcionalidad expuesta mediante API REST y WebSockets para permitir integración flexible.

**Event-driven internamente**: Bus de eventos para comunicación entre módulos, permitiendo desacoplamiento y extensibilidad.

**Observable por defecto**: Logging estructurado, tracing distribuido y métricas integradas desde el diseño inicial.

**Security by design**: Validación en cada capa, arquitectura zero-trust, y cumplimiento normativo desde el núcleo.

### 2.2 Patrón Arquitetónico: Monolito Modular

**Fase MVP hasta aproximadamente 10.000 usuarios**: Se implementa un monolito modular utilizando NestJS organizado por paquetes y características.

**Justificación**:

- Velocidad de desarrollo superior al tener un único despliegue, pipeline de CI/CD y pool de conexiones a base de datos.
- Costos operativos reducidos con una sola instancia y una sola conexión a base de datos.
- Complejidad manejable para un equipo pequeño de desarrollo.
- Todas las funcionalidades comparten el mismo modelo de datos con transacciones ACID garantizadas.

**Desventajas mitigadas**:

- Acoplamiento eventual entre módulos: Mitigado mediante interfaces claras y bien definidas.
- Escalado conjunto: Aceptable en fases tempranas; la separación por módulos permite identificar cuellos de botella.
- Single point of failure: Mitigado con redundancia a nivel de infraestructura y graceful degradation.

**Fase de escalado (más de 50.000 usuarios)**: Transición gradual a microservicios utilizando el patrón Strangler Fig, extrayendo primero los servicios más críticos o independientes.

### 2.3 Arquitectura en Capas (Clean Architecture)

La estructura del proyecto sigue los principios de Clean Architecture con separación clara de responsabilidades:

**Capa de Aplicación (Applications)**: Contiene los casos de uso, DTOs (Data Transfer Objects), validadores y servicios de aplicación que orquestan la lógica de negocio.

**Capa de Dominio (Domains)**: Alberga las entidades, objetos de valor, eventos de dominio y repositorios (interfaces). Esta capa contiene la lógica de negocio pura sin dependencias técnicas.

**Capa de Infraestructura (Infrastructures)**: Implementa las dependencias técnicas como acceso a base de datos (Prisma), caché (Redis), servicios externos (OpenAI, WhatsApp) y almacenamiento de archivos.

**Capa de Interfaz (Interfaces)**: Expone la aplicación mediante controladores HTTP, WebSockets, guards, interceptores y Pipes de validación.

### 2.4 Tecnologías del Stack

**Frontend**:

- **Next.js 14+**: Framework React con App Router para renderizado híbrido (SSR/SSG) y optimización de rendimiento.
- **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad del código.
- **Tailwind CSS**: Framework de utilidades para estilizado rápido y consistente.
- **Framer Motion**: Biblioteca de animaciones para experiencias fluidas y profesionales.
- **Zustand**: Estado global ligero y tipo-seguro para el frontend.
- **React Query**: Gestión de estado servidor y caching de solicitudes API.
- **Recharts**: Biblioteca de gráficos para analíticas.
- **React Flow**: Editor visual de flujos arrastrar y soltar.

**Backend**:

- **NestJS**: Framework Node.js progresivo con arquitectura modular, inyección de dependencias y soporte nativo para TypeScript.
- **Prisma ORM**: ORM tipo-seguro con migraciones automáticas y verificación de tipos en tiempo de compilación.
- **PostgreSQL 15+**: Base de datos relacional con soporte para JSONB, full-text search y extensiones vectoriales.
- **Redis**: Almacenamiento en caché, gestión de sesiones y cola de mensajes.
- **Socket.io**: Comunicación en tiempo real para el chat en vivo.
- **Class Validator + Zod**: Validación de datos de entrada.

**Inteligencia Artificial**:

- **OpenAI API**: GPT-4 para generación de respuestas y clasificación de intenciones.
- **pgvector**: Embeddings y búsqueda semántica en la base de datos.
- **Arquitectura preparada para múltiples proveedores**: La abstracción permite cambiar entre OpenAI, Anthropic, Google u otros proveedores sin impactar la lógica de negocio.

**Integraciones**:

- **WhatsApp Cloud API**: Preparado para integración con Meta.
- **Stripe/Mercado Pago**: Pasarelas de pago para suscripciones.
- **SendGrid/Resend**: Servicio de email transaccional.

**Infraestructura y DevOps**:

- **Docker + Docker Compose**: Contenedores para desarrollo y producción.
- **GitHub Actions**: CI/CD automatizado.
- **Vercel/Netlify** (Frontend): Despliegue del panel administrativo.
- **Railway/Render/DigitalOcean** (Backend): Hosting del API.
- **S3/MinIO**: Almacenamiento de archivos y adjuntos.

---

## 3. Módulos Funcionales

### 3.1 Módulo de Gestión de Tenants (Multi-tenancy)

Este módulo es el fundamento de la arquitectura multi-tenant y gestiona el ciclo de vida completo de las empresas clientes.

**Responsabilidades principales**:

- Creación, activación, suspensión y eliminación de tenants.
- Aislamiento de datos y configuración entre empresas.
- Gestión de planes y límites de uso.
- Personalización por tenant incluyendo branding, flujos y respuestas.
- Facturación y tracking de uso.

**Entidades principales**: Tenant, TenantPlan, TenantSettings, TenantLimits.

**Integraciones externas**: Stripe/PayPal para facturación, servicios de email para comunicaciones, DNS para dominios personalizados.

### 3.2 Módulo de Autenticación y Autorización

Gestiona la identidad de usuarios, sesiones y control de acceso basado en roles.

**Responsabilidades principales**:

- Autenticación mediante JWT con refresh tokens.
- Autorización granular basada en roles (RBAC) y atributos (ABAC).
- Gestión de sesiones y logout centralizado.
- Registro de auditoría de acciones sensibles.
- Opcional: SSO (Google, Microsoft) y MFA.

**Modelo de permisos**: Sistema granular donde cada permiso se define como recurso:acción (por ejemplo, conversations:read, conversations:write).

### 3.3 Módulo de Canales de Comunicación

Abstrae los diferentes canales de entrada y los normaliza a un formato interno unificado.

**Canales soportados**:

- **Web Widget**: Componente embebible personalizable (colores, logo, mensaje de bienvenida), detección de idioma, upload de archivos, geo-localización opcional.
- **WhatsApp Business Cloud API**: Mensajes de plantilla, mensajes de sesión, medios, webhooks.
- **Email**: Conversión de emails a tickets, threading por subject, respuestas automáticas.

**Normalización de mensajes**: Todos los canales se transforman a un formato unificado que incluye tipo de contenido, metadata del dispositivo, información del usuario y timestamp.

### 3.4 Módulo de IA Conversacional

El núcleo inteligente de la plataforma que procesa y responde a las consultas de los usuarios.

**Componentes**:

- **Clasificador de intenciones**: Utiliza modelos LLM para identificar la intención del usuario con umbrales de confianza configurables.
- **Extractor de entidades**: Identifica y valida entidades como fechas, horarios, nombres, ubicaciones.
- **Base de conocimientos (RAG)**: Búsqueda semántica en documentos cargados por el administrador, con citations de fuentes.
- **Orquestador LLM**: Gestiona múltiples proveedores, límites por tenant, control de costos y ventanas de contexto.
- **Análisis de sentimiento**: Detecta emociones y escala automáticamente según severidad.

**Flujo de procesamiento**: Mensaje → Preprocesamiento → Clasificación de intención → (si confianza >= umbral) → Extracción de entidades → Retrieval → Generación de respuesta → Postprocesamiento → Respuesta. Si la confianza es menor, se aplica estrategia de fallback.

### 3.5 Módulo de Flujos Guiados

Permite crear árboles de decisión visuales para guiar al usuario a través de procesos estructurados.

**Características**:

- **Editor visual drag-and-drop**: Nodos de mensaje, pregunta, condición, acción y transferencia humana.
- **Variables de sesión**: Captura y almacenamiento de datos del usuario durante el flujo.
- **Triggers flexibles**: Activación por keyword, por intención detectada o por condición de negocio.
- **Versionado**: Historial de versiones y rollback.
- **Integración con acciones**:webhooks hacia sistemas externos (agendamiento, CRM).

### 3.6 Módulo de Agentes Humanos

Gestiona la atención humana cuando la IA deriva o el usuario solicita un asesor.

**Componentes**:

- **Sistema de colas**: Colas por habilidad, prioridad configurable, tiempo máximo de espera.
- **Asignación inteligente**: Round-robin, menor carga, basado en habilidades, agente sticky.
- **Workspace del agente**: Vista de conversación, respuestas rápidas, búsqueda en base de conocimientos, notas internas, transferencia.
- **Asistencia IA al agente**: Respuestas sugeridas, resumen automático, alertas de sentimiento.
- **Métricas de rendimiento**: Conversaciones atendidas, tiempo de respuesta, CSAT,-utilización.

### 3.7 Módulo de Gestión de Conversaciones

Administra el ciclo de vida completo de cada conversación.

**Características**:

- **Estados y subestados**: active, waiting, in_progress, resolved, closed con subestados para mayor granularidad.
- **Deduplicación de usuarios**: Identificación por email, teléfono, cookie para consolidar historial.
- **Tags y campos personalizados**: Clasificación manual y automática.
- **Búsqueda avanzada**: Full-text search, filtros múltiples, búsquedas guardadas.

### 3.8 Módulo de Analíticas y Reportes

Proporciona métricas en tiempo real e históricas con dashboards personalizables y generación de reportes.

**Métricas principales**:

- Volumen: conversaciones totales, por canal, mensajes, usuarios únicos.
- Eficiencia: tasa de resolución por IA, tiempo de respuesta, tasa de transferencia.
- Calidad: CSAT, distribución de sentimiento, intención más frecuente.
- Operación: utilización de agentes, tiempo en cola, tiempo post-conversación.

**Dashboards por rol**: Ejecutivo ( KPIs de negocio), Supervisor (operaciones en tiempo real), Agente (métricas personales).

**Reportes exportables**: CSV, Excel (múltiples hojas, gráficos), PDF (formal con branding).

### 3.9 Módulo de Alertas y Notificaciones

Sistema de monitoreo proactivo con reglas configurables.

**Fuentes de alertas**:

- Conversación: inactividad, sentimiento negativo, escalamiento.
- Operación: cola saturada, agente offline, error de API.
- Sistema: fallo de integraciones, latencia, capacidad de almacenamiento.

**Canales de notificación**: In-app, email, SMS/WhatsApp (solo críticas), webhooks.

### 3.10 Módulo de Integraciones

Conectores para sistemas externos.

**Integraciones iniciales**:

- WhatsApp Cloud API.
- Calendly/Google Calendar (agendamiento).
- Webhook genérico para HIS/sistemas de turnos.
- CRM genérico (REST API).

**Patrón outbox**: Garantiza entrega confiable de mensajes a sistemas externos mediante tabla de outbox y workers asincrónicos.

### 3.11 Módulo de Administración y Configuración

Panel unificado para gestión de todos los aspectos del sistema.

**Sub-módulos**:

- Gestión de usuarios y agentes.
- Configuración de canales.
- Configuración de IA (modelo, umbrales, intenciones).
- Flow Builder visual.
- Branding y tono de comunicación.
- Facturación y uso.

### 3.12 Módulo de Facturación y Suscripciones

Gestión comercial del SaaS.

**Planes**:

- Básico ($99/mes): 500 conversaciones, 1 agente, web+email, IA básica.
- Profesional ($299/mes): 2.500 conversaciones, 5 agentes, web+WhatsApp, IA avanzada, flujos ilimitados.
- Empresarial ($899/mes): Ilimitado, agentes ilimitados, todo incluido, SLA 99.9%.

---

## 4. Roles del Sistema

### 4.1 Tipos de Usuarios

**Cliente Final (Usuario Anónimo)**: Paciente o cliente que interactúa vía widget web, WhatsApp o email. No requiere registro, se identifica por cookie, teléfono o email.

**Agente (nivel operativo)**: Personal de atención que atiende conversaciones derivadas. Puede responder, transferir y cerrar conversaciones asignadas. Acceso limitado a datos de sus propias conversaciones.

**Supervisor (nivel táctico)**: Coordinador del equipo que monitorea rendimiento en tiempo real, puede reasignar conversaciones y gestionar flujos activos. Acceso a métricas operativas.

**Administrador (nivel estratégico)**: Dueño o gerente con control total sobre su tenant. Configura flujos, IA, branding, agentes y accede a todos los datos y reportes. No puede acceder a otros tenants.

**Super Admin (nivel plataforma)**: Equipo interno con acceso cross-tenant para gestión de la plataforma, soporte técnico y configuración global.

### 4.2 Matriz de Permisos

El sistema implementa permisos granulares con la estructura recurso:acción. Por ejemplo, conversations:read permite leer conversaciones, mientras que conversations:write permite responder y cerrar. Los permisos se evalúan a nivel de aplicación y se complementan con Row-Level Security en la base de datos para máxima protección.

---

## 5. Flujo Operativo General

### 5.1 Flujo de Atención Completo

**Etapa 1: Inicio de conversación**

El cliente final inicia contacto a través de cualquier canal (web widget, WhatsApp, email). El sistema crea una nueva conversación y la clasifica según el canal de origen. Si existe un flujo guiado activo que coincida con keywords o intención, se ejecuta dicho flujo.

**Etapa 2: Procesamiento por IA**

El mensaje del cliente es procesado por el clasificador de intenciones. Si la confianza supera el umbral configurado (por defecto 85%), el sistema extrae entidades, consulta la base de conocimientos, genera una respuesta mediante LLM y la envía al cliente. El mensaje se marca como resuelto por IA.

**Etapa 3: Fallback y derivación**

Si la confianza es baja o el usuario explícitamente solicita un agente, el sistema deriva la conversación a la cola correspondiente. El agente recibe la notificación, acepta la conversación y continúa el atendimento.

**Etapa 4: Atención por agente**

El agente visualiza el historial completo de la conversación, incluyendo el análisis de IA previo. Puede utilizar respuestas sugeridas, buscar en la base de conocimientos, agregar notas internas y, al finalizar, cerrar la conversación con un resumen.

**Etapa 5: Post-conversación**

El cliente recibe una encuesta de satisfacción (CSAT). Se genera automáticamente un resumen de la conversación. Las métricas se actualizan en tiempo real. Si está configurado, se ejecuta un webhook hacia sistemas externos (CRM, HIS).

### 5.2 Flujo de Configuración (Onboarding)

**Para el administrador del tenant**:

1. Registro con email y contraseña más datos de la empresa.
2. Verificación de email.
3. Wizard de configuración rápida: datos de empresa, canal web (código embed), canal WhatsApp (conexión Meta), flujo inicial.
4. Invitación a agentes por email.
5. Acceso al dashboard principal.

**Para el agente**:

1. Recibe invitación por email con link de registro.
2. Define contraseña.
3. Acceso a dashboard con tutorial rápido.
4. Asignación automática a cola por defecto.
5. Cambio a estado online para comenzar a recibir conversaciones.

---

## 6. Roadmap por Etapas

### 6.1 Fase 0: Fundación (Meses 1-2)

**Objetivo**: Establecer la base técnica y funcional del sistema.

**Entregables**:

- Infraestructura base: Repositorio configurado, Docker Compose para desarrollo, CI/CD básico.
- Base de datos: Schema de Prisma con todas las entidades core, migraciones iniciales.
- Autenticación: Login, logout, registro de tenant, gestión de usuarios.
- API core: Endpoints RESTful para conversaciones, agentes, usuarios.
- Frontend base: Landing page, páginas de auth, layout del dashboard.

**Criterios de éxito**: El sistema permite crear un tenant, registrar usuarios, iniciar sesión y navegar por un dashboard funcional sin datos reales.

### 6.2 Fase 1: MVP - Chatbot Guiiado (Meses 3-4)

**Objetivo**: Sistema mínimo viable con flujos guiados básicos y canal web.

**Entregables**:

- Web Widget: Componente embeddable con personalización básica.
- Flujos guiados: Editor visual simple, publicación de flujos, ejecución de flujos con nodos básicos (mensaje, pregunta, condición).
- Canal web: Normalización de mensajes web, sesiones persistentes.
- Chat en agente: Interfaz del agente para ver y responder conversaciones.
- Métricas básicas: Dashboard con conversaciones totales, tasa de resolución.

**Criterios de éxito**: Un cliente final puede iniciar una conversación via web widget, seguir un flujo guiado para obtener información o agendar un turno, y un agente puede ver y responder la conversación.

### 6.3 Fase 2: Inteligencia Artificial (Meses 5-6)

**Objetivo**: Añadir capacidades de IA para interpretación de lenguaje natural.

**Entregables**:

- Clasificación de intenciones: Integración con OpenAI para detectar intención del usuario.
- Extracción de entidades: Identificación de fechas, horarios, nombres.
- Base de conocimientos: Carga de documentos, búsqueda semántica, generación de respuestas con citations.
- Fallback inteligente: Derivación automática cuando la confianza es baja.
- Mejora de flows: Integración de nodos de IA en el editor visual.

**Criterios de éxito**: El sistema puede mantener una conversación natural, responder preguntas basadas en documentos cargados y derivar apropiadamente cuando no puede resolver.

### 6.4 Fase 3: Canales y Analíticas (Meses 7-8)

**Objetivo**: Ampliar canales de comunicación y capacidades analíticas.

**Entregables**:

- WhatsApp Cloud API: Integración completa bidireccional.
- Analíticas avanzadas: Dashboards por rol, métricas de eficiencia y calidad.
- Generación de reportes: Exportación CSV, Excel, PDF programada.
- Alertas configurables: Reglas con condiciones y acciones.

**Criterios de éxito**: Los clientes pueden contactar via WhatsApp, los administradores tienen visibilidad completa del rendimiento y pueden generar reportes periódicos.

### 6.5 Fase 4: Escalabilidad y Premium (Meses 9-10)

**Objetivo**: Optimizar rendimiento y añadir funcionalidades premium.

**Entregables**:

- Caché y optimización: Redis para sesiones, presencia y caché de métricas.
- WebSockets optimizados: Comunicación en tiempo real mejorada.
- Facturación: Integración con Stripe, planes, límites, upgrade/downgrade.
- Funcionalidades premium: Flujos ilimitados, múltiples agentes, analytics avanzados.

**Criterios de éxito**: El sistema maneja mayor volumen sin degradación, los clientes pueden gestionar su suscripción y los planes premium están disponibles para venta.

### 6.6 Fase 5: Enterprise y Escalado (Meses 11-12)

**Objetivo**: Preparar para clientes enterprise y escalado masivo.

**Entregables**:

- Multi-región básica: Preparación para despliegues en múltiples regiones.
- SSO/SAML: Integración con proveedores de identidad empresarial.
- API pública: Documentación, SDKs, rate limiting.
- Mejoras de rendimiento: Análisis y optimización de queries, caching avanzado.

**Criterios de éxito**: La plataforma está lista para manejar cientos de tenants con diferentes necesidades y volúmenes.

---

## 7. Funcionalidades por Categoría

### 7.1 Funcionalidades Obligatorias (Core)

Estas funcionalidades son esenciales y deben estar presentes desde el MVP:

- Creación y gestión de tenants con aislamiento de datos.
- Autenticación segura con JWT y control de roles.
- Web Widget embebible con personalización de marca.
- Flujos guiados básicos con editor visual.
- Chat en vivo para agentes con interfaz funcional.
- Historial completo de conversaciones.
- Métricas básicas (conversaciones, mensajes, estado).
- Exportación básica de datos (CSV).
- Logging y auditoría de acciones.
- Documentación técnica y de API.

### 7.2 Funcionalidades Premium

Estas funcionalidades diferencian los planes superiores y añaden valor significativo:

- **IA avanzada**: Clasificación de intenciones, extracción de entidades, base de conocimientos con RAG.
- **Múltiples canales**: WhatsApp Business, Email.
- **Analíticas avanzadas**: Dashboards por rol, métricas de calidad, tendencias.
- **Reportes programados**: Generación automática en Excel y PDF.
- **Múltiples agentes**: Gestión de equipo, asignación inteligente.
- **Alertas configurables**: Reglas personalizadas con múltiples condiciones y acciones.
- **Integraciones**: webhooks, APIs externas.
- **Personalización avanzada**: Branding completo, dominios personalizados.
- **Soporte prioritario**: Canal de soporte dedicado.

### 7.3 Funcionalidades Futuras

Estas funcionalidades están en el roadmap pero no son prioridad inicial:

- **Voice**: Integración con IVR y transcription de llamadas.
- **Video**: Videollamada integrada para consultas visuales.
- **CRM integrado**: Gestión básica de clientes y leads.
- **Multi-idioma**: Soporte para inglés, portugués y otros idiomas.
- **IA multimodal**: Análisis de imágenes y documentos subidos por usuarios.
- **Social listening**: Monitoreo de redes sociales.
- **Chatbot voz**: Interacción por voz (Alexa, Google Assistant).
- **Portal de clientes**: Auto-servicio para clientes registrados.
- **Programa de referidos**: Sistema de referidos para adquisición.
- **Marketplace**: Tienda de plugins y extensiones.

---

## 8. Medidas de Seguridad

### 8.1 Autenticación

**JWT con refresh tokens**: Tokens de acceso de corta duración (15 minutos) con refresh tokens HttpOnly secure. Rotación de refresh tokens en cada uso para prevenir reuse attacks.

**Contraseñas**: Hasheo con Argon2id o bcrypt con cost factor 12+. Política de contraseñas: mínimo 8 caracteres con mayúsculas, minúsculas, números y caracteres especiales. Historial de últimas 5 contraseñas.

**Opcional MFA**: Autenticación multifactor con TOTP (Google Authenticator) disponible para planes superiores.

### 8.2 Autorización

**RBAC + ABAC**: Roles base con permisos granulares y overrides por usuario. Controles a nivel de aplicación y base de datos.

**Aislamiento de tenants**: Todo query incluye filtro por tenant_id. Row-Level Security (RLS) como capa adicional de protección.

**Session management**: Sesiones concurrentes limitadas por usuario. Auto-logout por inactividad (configurable). Revocación inmediata al logout.

### 8.3 Protección de Datos

**Encriptación en tránsito**: TLS 1.3 para todas las comunicaciones. HSTS enabled.

**Encriptación en reposo**: Base de datos encriptada (TDE o a nivel de aplicación). Backups encriptados con AES-256.

**PII y cumplimiento**: Minimización de datos: no almacenar información sensible innecesaria. Derecho al olvido: eliminación completa de datos de usuario bajo solicitud. Data residency: opción de elegir región de almacenamiento (futuro).

### 8.4 Protección de Aplicación

**Rate limiting**: Límites por IP, usuario y endpoint. Token bucket algorithm con burst allowance.

**Validación de entrada**: Zod y class-validator en todas las entradas API. SQL injection prevention mediante Prisma parametrized queries.

**CORS configurable**: Orígenes permitidos configurables por tenant.

**Sanitización**: XSS protection en contenido generado por usuarios.

### 8.5 Auditoría

**Logs de auditoría**: Tabla dedicada con registro de todas las acciones sensibles. Contenido: usuario, acción, recurso, valores antiguos/nuevos, IP, user agent, timestamp UTC.

**Eventos auditados**: Login/logout, acceso a datos sensibles, modificaciones de configuración, cambios de permisos, exportaciones de datos.

**Retención**: 90 días en almacenamiento caliente (consultable), 7 años en almacenamiento frío (compliance).

---

## 9. Escalabilidad

### 9.1 Escalado de Aplicación

**Aplicación sin estado**: Los servicios API son stateless y pueden escalar horizontalmente infinitamente. El estado de sesión se almacena en Redis.

**Archivos estáticos**: Uploads a S3/MinIO, CDN para distribución global.

**WebSockets con sticky sessions**: Utilizando nginx con ip_hash o Redis para compartir sesiones de WebSocket entre instancias.

### 9.2 Escalado de Base de Datos

**Fase 1: Primary + Replicas**: Un primary para escrituras, replicas de lectura para queries intensos. PgBouncer para manejo de conexiones.

**Fase 2: Partitioning por tenant**: Sharding horizontal usando tenant_id como clave. Range-based o hash-based.

**Fase 3: Schema per tenant**: Para clientes enterprise que requieren aislamiento físico.

### 9.3 Caché y Cola

**Redis cluster**: Modo cluster para alta disponibilidad y partitioned cache.

**Colas de procesamiento**: Redis Streams para MVP, migrando a RabbitMQ/Kafka según volumen. Workers separados por tipo de tarea con auto-scaling basado en profundidad de cola.

### 9.4 Región y Disaster Recovery

**Fase 2: Active-Passive**: Réplica en región secundaria con failover manual mediante DNS.

**Fase 3: Active-Active**: Despliegue multi-región con sharding por ubicación de tenant.

---

## 10. Mantenibilidad

### 10.1 Calidad de Código

**Estándares de código**: ESLint con configuración estricta, Prettier para formato consistente. TypeScript strict mode habilitado.

**Code reviews obligatorios**: Todo PR requiere revisión de al menos un desarrollador senior.

**Testing**: Tests unitarios con Jest (>80% coverage objetivo), tests de integración, tests E2E con Playwright para flujos críticos.

### 10.2 Documentación

**Documentación de código**: JSDoc/TSDoc para funciones públicas, decisiones arquitectónicas documentadas en ADRs.

**Documentación de API**: OpenAPI/Swagger autogenerado desde código. Postman collection actualizada.

**Runbooks**: Documentación de operaciones para despliegue, escalado, recuperación de incidentes.

### 10.3 Observabilidad

**Logging estructurado**: Formato JSON con campos estándar (timestamp, level, service, tenantId, userId, conversationId, message, durationMs).

**Métricas**: Prometheus para collection, Grafana para visualización. Métricas técnicas (latencia, errores, throughput) y de negocio (conversaciones, resolución IA).

**Tracing distribuido**: OpenTelemetry con Jaeger/Tempo. Trace por conversación completa.

**Health checks**: /healthz (liveness), /ready (readiness) con chequeo de dependencias.

### 10.4 CI/CD

**Pipeline automatizado**: GitHub Actions con stages de lint, test, build, deploy.

**Feature flags**: Unleash o Flagsmith para release progresivo de funcionalidades.

**Despliegues**: Blue-green o canary para producción. Rollback automático en caso de fallo de health checks.

### 10.5 Gestión de Configuración

**Environment-based**: Variables de entorno para configuración sensible. Feature flags para features incompletas.

**Configuración centralizada**: Servicio de configuración para parámetros dinámicos sin redepliegue.

---

## 11. Anexos

### Glosario de Términos

| Término | Definición |
|---------|------------|
| Tenant | Empresa cliente de la plataforma |
| Agente | Usuario humano que atiende conversaciones |
| Intención | Propósito identificado del mensaje del usuario |
| Entidad | Información estructurada extraída del mensaje (fecha, hora) |
| Flujo | Árbol de decisión guiado para interacción estructurada |
| Resolución automática | Conversación finalizada sin intervención humana |
| CSAT | Customer Satisfaction Score (encuesta post-conversación) |
| RAG | Retrieval Augmented Generation (IA generativa con base de conocimientos) |

### Referencias a Documentos Relacionados

- **VISION.md**: Visión, objetivos y alcance detallados del producto.
- **ARCHITECTURE.md**: Arquitectura técnica completa con patrones, schema de base de datos y decisiones de diseño.
- **MODULES.md**: Desglose detallado de cada módulo funcional.
- **ROLES.md**: Matriz completa de roles y permisos del sistema.
- **FRONTEND_STRUCTURE.md**: Estructura del proyecto frontend y convenciones.

---

**Estado del documento**: Versión 1.0 - Completo

**Última actualización**: 2026-04-19

**Próximos pasos**: Revisión con stakeholders técnicos y de producto para validación y priorización del roadmap.
