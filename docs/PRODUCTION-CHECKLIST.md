# ===========================================================
# PRODUCTION READINESS CHECKLIST
# Plataforma de Atención Inteligente
# ===========================================================

## 1. SECURITY CHECKLIST

### 🔐 Authentication & Authorization
- [ ] JWT_SECRET configurado (mínimo 32 caracteres, aleatorio)
- [ ] JWT_EXPIRES_IN configurado (24h o menos)
- [ ] Session timeout configurado (1 hora o menos)
- [ ] Password hashing con salt (bcrypt/pbkdf2)
- [ ] Fuerza mínima de password requerida
- [ ] Rate limiting en endpoints de login
- [ ] Bloqueo de cuenta tras intentos fallidos (5 intentos)

### 🛡️ API Security
- [ ] CORS configurado para dominios específicos
- [ ] Helmet middleware habilitado
- [ ] Headers de seguridad configurados
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
- [ ] Limitación de tamaño de request (10MB max)
- [ ] Sanitización de inputs

### 🔒 Multi-Tenancy Security
- [ ] Aislamiento de datos por tenantVerificado
- [ ] Queries con tenantId en todos los WHERE
- [ ] Validación de acceso a recursos cross-tenant
- [ ] Sanitización de parámetros de consulta

---

## 2. DATABASE CONFIGURATION

### 📦 Database Setup
- [ ] PostgreSQL 15+ en producción
- [ ] Conexión SSL habilitada
- [ ] Pool de conexiones configurado (20-50)
- [ ] Timeouts apropiados (30 segundos)
- [ ] Índices en campos frecuentes
  - tenantId
  - createdAt
  - status
  - assignedAgentId

### 💾 Backup & Recovery
- [ ] Backup automático configurado
- [ ] Frecuencia: diaria (incremental), semanal (completo)
- [ ] Retención: 30 días mínimo
- [ ] Backup encriptado y almacenado off-site
- [ ] Procedimiento de restauración documentado
- [ ] Prueba de restauración realizada

---

## 3. ENVIRONMENT CONFIGURATION

### ⚙️ Environment Variables
- [ ] .env.example creado
- [ ] DATABASE_URLproduction
- [ ] JWT_SECRET único y seguro
- [ ] ENCRYPTION_KEY para datos sensibles
- [ ] Variables de API externas configuradas
- [ ] Modo producción habilitado (NODE_ENV=production)

### 📝 Logging
- [ ] Nivel de log: warn (producción)
- [ ] Formato estructurado (JSON)
- [ ] Rotación de logs configurada
- [ ] Retention: 30 días
- [ ] Ubicación: /var/log/clinica

---

## 4. RATE LIMITING & THROTTLING

### ⏱️ Rate Limits
- [ ] GLOBAL: 100 requests/15 min por IP
- [ ] AUTH: 5 requests/min por IP
- [ ] API: 1000 requests/hour por tenant
- [ ] FILE_UPLOAD: 10/hour por usuario
- [ ] WEBHOOK: configurable por integración

### 📊 Monitoring & Alerts
- [ ] Alerta: rate limit > 80%
- [ ] Alerta: errors > 1%
- [ ] Alerta: latency > 2s

---

## 5. BACKEND VALIDATION

### ✅ Input Validation
- [ ] DTOs con class-validator
- [ ] Validación de tipos
- [ ] Validación de rangos
- [ ] Validación de formatos (email, teléfono, RUT)
- [ ] Sanitización de strings

### 🚨 Error Handling
- [ ] Errores capturados globalmente
- [ ] Mensajes de error genéricos (no expose detalles)
- [ ] Stack traces solo en desarrollo
- [ ] Errores registrados en logs

---

## 6. AUDIT & COMPLIANCE

### 📋 Audit Logging
- [ ] Login/logout registrados
- [ ] Operaciones CRUD protegidas
- [ ] Accesos a datos sensibles
- [ ] Exportaciones de datos
- [ ] Cambios de configuración

### 🔍 Audit Reports
- [ ] Registro de auditoríadisable
- [ ] Retención: 90 días mínimo
- [ ] Exportable para compliance

---

## 7. CONTAINERIZATION

### 🐳 Docker
- [ ] Dockerfile multi-stage
- [ ] Usuario no-root
- [ ] Salud checks configurados
- [ ] Multi-arquitectura (opcional)

### 📦 Docker Compose
- [ ] Servicios definidos
- [ ] healthchecks configurados
- [ ] Redes aisladas
- [ ] Volúmenes persistentes

---

## 8. DEPLOYMENT

### 🚀 Deployment Checklist
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Build sin errores
- [ ] Tests pasando
- [ ] Health check funcionando
- [ ] DNS configurado
- [ ] SSL certificates instalados
- [ ] CDN configurado (opcional)

### 🔄 CI/CD
- [ ] Pipeline configurado
- [ ] Tests automatizados
- [ ] Linting/checkstyle
- [ ] Security scanning
- [ ] Deploy automático a staging
- [ ] Deploy manual a producción

---

## 9. MONITORING & OBSERVABILITY

### 📊 Metrics
- [ ] Uptime monitoring
- [ ] Response time p50/p95/p99
- [ ] Error rate
- [ ] Active users
- [ ] Queue size (si aplica)

### 🔔 Alerts
- [ ] CPU > 80%
- [ ] Memory > 80%
- [ ] Disk > 85%
- [ ] Database connections > 80%
- [ ] Error rate > 1%
- [ ]Latency p95 > 2s

### 🖥️ Dashboards
- [ ] API Performance
- [ ] Business Metrics
- [ ] System Health
- [ ] Security Events

---

## 10. SCALABILITY

### 📈 Horizontal Scaling
- [ ] Stateless API design
- [ ] Sesiones en Redis (opcional)
- [ ] Balanceador de carga configurado
- [ ] Auto-scaling configurado

### 🔄 Vertical Scaling
- [ ] Recursos apropiados designados
- [ ] monitoreo de uso
- [ ] Alertas de capacidad

---

## 11. BACKUP RECOMMENDATIONS

### 💾 Backup Strategy
- **Frecuencia**: Diaria incremental, semanal completo
- **Retención**: 30 días locales, 1 año off-site
- **Tipo**: Encriptado, comprimida
- **Pruebas**: Mensual

### 📍 Locations
- [ ] Local: volumen Docker
- [ ] Off-site: S3/Google Cloud Storage
- [ ] Cross-region: para DR

---

## 12. DISASTER RECOVERY

### 🎯 DR Plan
- [ ] RTO (Recovery Time Objective): 4 horas
- [ ] RPO (Recovery Point Objective): 1 hora
- [ ] Procedimiento documentado
- [ ] Contactos de emergencia
- [ ] Prueba trimestral

### 🔃 Failover
- [ ] DNS failover configurado
- [ ] Base de datos replica (opcional)
- [ ] CDN failover (opcional)

---

## 13. PRODUCTION COMMANDS

### Deploy
```bash
# Build
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api

# Update
docker-compose pull
docker-compose up -d
```

### Rollback
```bash
# List images
docker-compose ps

# Rollback to previous
docker-compose down
docker-compose up -d --scale api=1
```

### Maintenance
```bash
# Enable maintenance mode
touch maintenance && docker-compose restart

# Disable maintenance mode
rm maintenance && docker-compose restart
```

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|------------|
| Tech Lead | | | |
| Security | | | |
| Product | | | |
| Ops | | | |

---

## Notes
- Actualizar esta lista antes de cada release
- Revisar mensualmentepor compliance
- Documentar cualquier desviación