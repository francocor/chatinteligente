# Módulo de Reportes y Exportación

## Descripción General

El módulo de reportes permite generar, visualizar y descargar informes detallados del sistema de atención al cliente. Soporta múltiples formatos de exportación, filtros avanzados y genera archivos optimizados para grandes volúmenes de datos.

## Tipos de Reportes

### 1. Reporte Ejecutivo
**Propósito**: Resumen ejecutivo con KPIs y métricas clave para directivos

**Métricas Incluidas**:
- Total de conversaciones del período
- Tasa de resolución por IA (%)
- Tiempo promedio de respuesta
- Puntuación CSAT promedio
- Cumplimiento SLA (%)
- Total de agentes activos
- Conversaciones activas

**Uso**: Presentaciones a directorio, informes mensuales de gestión

---

### 2. Reporte Operativo
**Propósito**: Métricas operativas detalladas para equipos de coordinación

**Métricas Incluidas**:
- Datos por fecha
- Distribución por canal
- Distribución por departamento
- Conversaciones atendidas vs resueltas
- Tiempos promedio de respuesta
- Tiempos promedio de resolución
- Número de escalaciones

**Uso**: Coordinación de equipos, planificación de turnos, seguimiento operativo

---

### 3. Reporte de Conversaciones
**Propósito**: Detalle completo de todas las conversaciones

**Columnas**:
- Número de conversación
- Nombre del contacto
- Email
- Teléfono
- Canal
- Estado
- Prioridad
- Agente asignado
- Intención detectada
- Fecha de creación
- Primera respuesta
- Fecha de resolución
- Fecha de cierre
- Tiempo de primera respuesta
- Tiempo de resolución
- Cantidad de mensajes
- CSAT
- Etiquetas

**Uso**: Auditoría, análisis de casos específicos, trazabilidad

---

### 4. Reporte de Tickets
**Propósito**: Listado de tickets con estados y asignaciones

**Columnas**:
- Número de ticket
- Asunto
- Descripción
- Categoría
- Prioridad
- Estado
- Agente asignado
- Departamento
- Contacto
- Fechas (creación, respuesta, resolución, cierre)
- SLA Incumplido
- CSAT

**Uso**: Seguimiento de Issues, SLAs, gestión de equipos de soporte

---

### 5. Reporte de Agentes
**Propósito**: Rendimiento detallado por agente

**Métricas**:
- Nombre del agente
- Email
- Departamento
- Estado actual
- Conversaciones atendidas
- Conversaciones resueltas
- Tiempo promedio de respuesta
- Tiempo promedio de resolución
- CSAT promedio
- Tasa de derivación (%)
- Horas activas

**Uso**: Evaluación de desempeño, incentivos, planificación de capacidad

---

### 6. Reporte por Canales
**Propósito**: Análisis de eficiencia por canal de comunicación

**Métricas**:
- Canal
- Total conversaciones
- Total mensajes
- Tiempo promedio de respuesta
- Tasa de resolución (%)
- CSAT promedio

**Uso**: Optimización de canales, inversión en canales prioritarios

---

### 7. Reporte de Satisfacción
**Propósito**: Encuestas de satisfacción y feedback

**Métricas**:
- Fecha
- Número de respuestas
- Puntuación promedio
- Tasa de respuesta (%)
- Porcentaje positivo
- Porcentaje neutral
- Porcentaje negativo
- Temas más mencionados (positivo/negativo)

**Uso**: NPS, mejora de servicio, identificación de problemas recurrentes

---

### 8. Reporte de Resolución
**Propósito**: Análisis de tasas de resolución y efectividad

**Métricas**:
- Total conversaciones
- Resueltas
- Tasa de resolución (%)
- Resueltas por IA
- Resueltas por humano
- Abandonadas
- Tasa de abandono (%)
- Tasa de reintento (%)

**Uso**: Métricas de efectividad del chatbot, identificación de gaps

---

### 9. Reporte de Intenciones
**Propósito**: Análisis de intents detectados

**Métricas**:
- Intención
- Cantidad
- Porcentaje (%)
- Confianza promedio
- Tasa de resolución (%)
- Tiempo promedio de respuesta

**Uso**: Mejora del chatbot, identificación de intents faltantes, optimización de flujos

---

### 10. Reporte de Base de Conocimiento
**Propósito**: Uso y efectividad de la KB

**Métricas**:
- Título del artículo
- Categoría
- Estado
- Vistas
- Búsquedas
- Marcado como útil
- Marcado como no útil
- Tasa de utilidad (%)
- Última actualización

**Uso**: Mejora del contenido, identificación de artículos populares

---

### 11. Reporte de Tiempos
**Propósito**: Análisis detallado de tiempos

**Métricas**:
- Fecha / Hora
- Tiempo promedio primera respuesta (ms)
- Mediana primera respuesta (ms)
- Tiempo promedio resolución (ms)
- Mediana resolución (ms)
- SLA cumplido (cantidad)
- SLA incumplido (cantidad)

**Uso**: Identificación de horarios pico, optimización de capacidad

---

### 12. Reporte SLA
**Propósito**: Cumplimiento de acuerdos de nivel de servicio

**Métricas**:
- Primera respuesta cumplida (%)
- Resolución cumplida (%)
- Incumplimientos (cantidad)
- Tasa de incumplimiento (%)
- SLA promedio primera respuesta
- SLA promedio resolución

**Uso**: Reportes contractuales, seguimiento de SLAs contractuales

---

### 13. Reporte de Volumen
**Propósito**: Análisis de volumen de conversaciones

**Métricas**:
- Fecha
- Hora
- Conversaciones
- Mensajes
- Hora pico (sí/no)
- Concurrentes promedio
- Tamaño de cola promedio

**Uso**: Planificación de capacidad, dimensionamiento de equipos

---

## Estrategias de Performance

### 1. Generación Asíncrona
- **Arquitectura**: Los reportes se generan en background mediante jobs
- **Beneficio**: El usuario no espera, puede hacer otras tareas
- **Implementación**: ExportJob con estados PENDING → PROCESSING → COMPLETED

### 2. Paginación y Streaming
- **Para datos grandes**: Generación en chunks de 1000 registros
- **Streaming**: Envío progresivo de datos al archivo durante generación
- **Beneficio**: Memoria limitada, no saturación del servidor

### 3. Índices y Consultas Optimizadas
- **Índices compuestos**: (tenantId, createdAt), (tenantId, status), etc.
- **Consultas agregadas**: GROUP BY en lugar de múltiples queries
- **Caché**: Resultados agregados cacheados por período

### 4. Límites de Registros
- **Límite por запрос**: Máximo 10,000 registros en una query
- **Chunking**: Procesamiento en lotes de 1,000
- **Preview limitado**: Máximo 100 registros para vista previa

### 5.列 Columnas Selectivas
- **Selección de columnas**: Solo las necesarias para el reporte
- **Filtrado temprano**: WHERE en la query, no en application code
- **Proyecciones**: Evitar SELECT * para reportes grandes

### 6. Caché de Metadatos
- **Metadatos cacheados**: Nombres de canales, departamentos, agentes
- ** lookup tables**: Cargadas una vez al iniciar el servidor
- ** invalidación**: Por tiempo (TTL) o por actualización

### 7. Compresión de Archivos
- ** Excel**: Formato .xlsx ya está comprimido
- **PDF**: Compresión estándar PDF/A
- **CSV**: gzip opcional para archivos muy grandes

---

## Seguridad de Acceso

### Roles y Permisos
| Rol | Generación | Ver Historial | Descargar |
|----|------------|--------------|------------|
| SUPER_ADMIN | ✓ | ✓ | ✓ |
| ADMIN | ✓ | ✓ | ✓ |
| SUPERVISOR | ✓ | Propios | Propios |
| AGENT | ✗ | ✗ | ✗ |

### Datos Sensibles
- **CSAT**: Solo visible para ADMIN y SUPERVISOR
- **Etiquetas internas**: Filtrables en reportes externos
- **Notas privadas**: Excluidas automáticamente

### Auditoría
- **Logs**: Se registra cada generación de reporte
- **Usuario**: Quién generó el reporte
- **Filtros**: Qué filtros se aplicaron
- ** download**: Cuándo se descargó

---

## Nombres de Archivos

### Convención
```
{reporte}-{tipo}-{fecha}.{formato}
```

### Ejemplos
```
reporte-ejecutivo-2026-04-19.xlsx
reporte-conversaciones-2026-marzo.csv
reporte-satisfaccion-2026-q1.pdf
```

### Componentes
- **reporte**: Prefijo fijo
- **tipo**: executive, conversations, tickets, etc.
- **fecha**: YYYY-MM-DD o YYYY-MM o YYYY-QX
- **formato**: xlsx, csv, pdf

---

## Límites del Sistema

| Recurso | Límite | Notes |
|---------|--------|-------|
| Registros por reporte | 100,000 | Warning a 50,000 |
| Tamaño máximo archivo | 50 MB | Comprimido |
| Tiempo de generación | 5 minutos | Timeout |
| Reportes simultáneos | 3 | Por tenant |
| Retención | 90 días | Auto cleanup |

---

## Métricas por Reporte

### Reporte Ejecutivo
- KPIs de negocio
- Tendencias mes a mes
- Comparación vs objetivo

### Reporte Operativo
- Volumen por canal/departamento
- Tiempos de respuesta
- Eficiencia del equipo

### Reporte de Satisfacción
- CSAT score
- Distribución de puntuaciones
- Análisis de comentarios

### Reporte de Resolución
- Tasa de resolución total
- Breakdown IA vs Humano
- Tiempos de resolución
- Abandonos y rechazos