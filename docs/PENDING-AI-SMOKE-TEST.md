# Pendiente: Prueba de humo del motor de IA (cadena de fallback)

> Estado: el código compila (`nest build` → 0 errores) y la base de datos está lista,
> pero **el motor de IA NO se probó en runtime todavía**. Esta nota explica qué falta
> y cómo ejecutar la prueba de punta a punta.

---

## Qué se hizo (contexto)

Se reactivó el módulo de IA del backend y se convirtió el cliente de IA en una
**cadena de proveedores con failover**:

- `apps/api/src/modules/ai/engine/ai-integration.ts` ahora recorre una lista de
  proveedores (Groq → Gemini → Mock). Todos usan el formato OpenAI-compatible
  (`/chat/completions`), así que un solo cliente cubre a todos.
- Ante **timeout, 429 (límite), 5xx, error de red o respuesta vacía**, salta
  automáticamente al siguiente proveedor. Si todos fallan, responde un mock que
  nunca tira error (el bot nunca queda mudo).
- `AIModule` quedó habilitado en `apps/api/src/app.module.ts`.
- Se limpió `tsconfig.build.json`: ahora el build type-chequea TODO el código fuente
  (antes ocultaba errores de ai/analytics/alerts/whatsapp en el `exclude`).
- Se arreglaron 9 errores de TypeScript (analytics + whatsapp) y un bug latente:
  `conversations.service.create` no generaba `conversationNumber` (campo obligatorio).

El orden de la cadena es configurable con `AI_PROVIDER_CHAIN`.

---

## Lo que falta probar (la tarea)

Verificar en runtime, con la base levantada, que:

1. La API bootea con `AIModule` activo (la inyección de dependencias resuelve).
2. El login real funciona contra el backend.
3. El endpoint de IA devuelve una respuesta REAL de un proveedor (no el mock).
4. El failover funciona: si el primer proveedor da 429, salta al segundo.

---

## Requisitos previos

### 1. API keys (gratis) en `apps/api/.env`

Las keys NO están en el repo (van solo en `.env`, que está en `.gitignore`).
Conseguir dos:

- **Groq** (primario, rápido): https://console.groq.com/keys → empieza con `gsk_...`
- **Gemini** (respaldo): https://aistudio.google.com/apikey → empieza con `AIzaSy...`

> ⚠️ IMPORTANTE sobre Gemini: usar una key generada en **Google AI Studio**
> (`AIzaSy...`), que trae free tier real. Una key de proyecto de Google Cloud
> (formato `AQ....`) autentica OK pero devuelve `429 / limit: 0` porque no tiene
> cuota gratis. Si Gemini responde 429 con "limit: 0", es esto.

Agregar a `apps/api/.env`:

```env
# --- AI fallback chain ---
AI_PROVIDER_CHAIN="groq,gemini"
AI_TIMEOUT_MS=15000
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=500

GROQ_API_KEY="gsk_..."          # pegar la key real
GROQ_MODEL="llama-3.3-70b-versatile"

GEMINI_API_KEY="AIzaSy..."      # pegar la key real (de AI Studio)
GEMINI_MODEL="gemini-2.0-flash"
```

### 2. Base de datos (ya lista)

Postgres corre en Docker (`clinica-postgres`), tiene las 40 tablas y el seed cargado.
Si hay que levantarla de cero:

```bash
docker-compose up -d postgres
cd apps/api
npx prisma migrate deploy   # ver nota de baseline más abajo
npx prisma db seed
```

### Credenciales de login (datos del seed — son de demo, no secretos)

- **Email:** `admin@clinicasanjuan.cl`
- **Password:** `admin123`
- **Tenant (campo "Empresa / Organización"):** `5425d30b-41bc-4eee-a7d8-7dfaa1115509`

> El login espera el **UUID** del tenant, no el slug. (Esto es deuda de UX a resolver
> después: el formulario pide un dato que un humano no puede saber de memoria.)

---

## Cómo correr la prueba

### Paso 1 — Levantar el backend

```bash
docker-compose up -d postgres
pnpm --filter @plataforma/api dev      # arranca en http://localhost:4000
```

Verificar en el log de arranque que NO haya errores de inyección de dependencias
y que el módulo `ai` cargue.

### Paso 2 — Verificar el estado de la cadena de IA

```bash
# 1. Login para obtener el token
curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinicasanjuan.cl","password":"admin123","tenantId":"5425d30b-41bc-4eee-a7d8-7dfaa1115509"}'
# → copiar el accessToken de la respuesta

# 2. Ver qué proveedores tomó la cadena
curl -s http://localhost:4000/api/v1/ai/status \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
# → debe listar groq y gemini, y chain: "Groq -> Google Gemini -> mock"
```

### Paso 3 — Probar una respuesta real de IA

```bash
curl -s -X POST http://localhost:4000/api/v1/ai/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"message":"Hola, ¿qué horarios de atención tienen?"}'
# → la respuesta debe traer "provider":"groq" (o "gemini" si Groq falló).
#   Si trae "provider":"mock", AMBOS proveedores fallaron: revisar las keys.
```

### Paso 4 (opcional) — Probar el failover

Poné una `GROQ_API_KEY` inválida a propósito y reiniciá. La respuesta debería
seguir funcionando pero con `"provider":"gemini"`. Eso confirma el salto al siguiente.

---

## Resultado esperado

- ✅ `/ai/status` lista los proveedores configurados.
- ✅ `/ai/ai/generate` devuelve texto real con `provider` distinto de `mock`.
- ✅ Con un proveedor caído, el otro responde (failover).

Si algo falla, anotar: status HTTP, el campo `provider` de la respuesta, y el log
del backend. El 90% de los problemas van a ser: key inválida, sin cuota (429), o
el nombre del modelo cambió.

---

## Notas / deuda técnica conocida

- **Baseline de migración (para producción):** la base local tiene las 40 tablas pero
  la migración `20260423233259_init` figura como NO aplicada (las tablas se crearon
  con `db push`). En una base de producción fresca, `prisma migrate deploy` funciona
  bien. Sobre la base local actual, primero hay que hacer baseline:
  `npx prisma migrate resolve --applied 20260423233259_init`.
- **Archivo huérfano:** `apps/api/prisma/whatsapp.prisma` es un fragmento duplicado
  (sus modelos ya están en `schema.prisma` y migrados). Se puede borrar.
- **WhatsApp:** el módulo compila limpio pero sigue deshabilitado en `app.module.ts`
  (necesita credenciales de Meta Cloud API y prueba propia).
- **`getNextConversationNumber`** usa `max+1`: tiene race condition bajo alta
  concurrencia (el índice único protege con error). Mejora futura: secuencia atómica.
