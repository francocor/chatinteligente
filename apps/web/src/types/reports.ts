import { Channel, ConversationStatus, Priority, ConversationSubStatus } from './conversations';
import { TicketStatus, TicketCategory } from './tickets';
import { KnowledgeStatus, KnowledgeSource } from './knowledge';

export type ReportType = 
  | 'executive'
  | 'operational'
  | 'conversations'
  | 'tickets'
  | 'agents'
  | 'channels'
  | 'satisfaction'
  | 'resolution'
  | 'intents'
  | 'knowledge'
  | 'timing'
  | 'sla'
  | 'volume';

export type ReportFormat = 'csv' | 'xlsx' | 'pdf';

export type ReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

export interface ReportConfig {
  id: string;
  tenantId: string;
  
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  
  filters: ReportFilters;
  columns?: string[];
  
  createdById: string;
  createdBy?: {
    displayName: string;
    avatar?: string;
  };
  
  status: ReportStatus;
  progress?: number;
  
  fileUrl?: string;
  fileSize?: number;
  recordCount?: number;
  
  expiresAt?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface ReportFilters {
  dateFrom?: Date;
  dateTo?: Date;
  dateRange?: DateRangePreset;
  
  companyId?: string;
  departmentId?: string;
  channel?: Channel;
  agentId?: string;
  status?: ConversationStatus | TicketStatus;
  priority?: Priority;
  subStatus?: ConversationSubStatus;
  category?: TicketCategory;
  
  intentId?: string;
  flowId?: string;
  
  search?: string;
  tags?: string[];
}

export type DateRangePreset = 
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom';

export interface ReportColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'duration' | 'percentage' | 'currency' | 'status';
  width?: number;
  sortable?: boolean;
  formatter?: (value: any) => string;
}

export interface ReportPreview {
  columns: ReportColumn[];
  rows: Record<string, any>[];
  totalRows: number;
  hasMore: boolean;
}

export interface ExportJob {
  id: string;
  tenantId: string;
  
  reportConfigId: string;
  reportConfig?: ReportConfig;
  
  type: ReportType;
  format: ReportFormat;
  
  filters: ReportFilters;
  
  status: ReportStatus;
  progress: number;
  
  error?: string;
  
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  recordCount?: number;
  checksum?: string;
  
  createdById: string;
  processedById?: string;
  
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  
  createdAt: Date;
}

export interface ExportHistoryItem {
  id: string;
  reportName: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  recordCount?: number;
  fileSize?: number;
  createdBy: {
    displayName: string;
    avatar?: string;
  };
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
}

export interface GeneratedReport {
  data: Record<string, any>[];
  metadata: {
    reportName: string;
    generatedAt: Date;
    filters: ReportFilters;
    recordCount: number;
    generatedBy: string;
  };
}

export const REPORT_TYPES: Record<ReportType, {
  label: string;
  description: string;
  icon: string;
  defaultColumns: string[];
}> = {
  executive: {
    label: 'Reporte Ejecutivo',
    description: 'Resumen ejecutivo con KPIs y métricas clave para directivos',
    icon: 'BarChart3',
    defaultColumns: ['period', 'totalConversations', 'aiResolutionRate', 'avgResponseTime', 'csatScore', 'slaCompliance', 'totalAgents', 'activeConversations'],
  },
  operational: {
    label: 'Reporte Operativo',
    description: 'Métricas operativas detalladas para equipos de coordinación',
    icon: 'ClipboardList',
    defaultColumns: ['date', 'channel', 'department', 'conversations', 'resolved', 'avgResponseTime', 'avgResolutionTime', 'escalations'],
  },
  conversations: {
    label: 'Conversaciones',
    description: 'Detalle completo de todas las conversaciones',
    icon: 'MessageCircle',
    defaultColumns: ['conversationNumber', 'contactName', 'channel', 'status', 'priority', 'assignedAgent', 'createdAt', 'resolvedAt', 'responseTime', 'resolutionTime'],
  },
  tickets: {
    label: 'Tickets',
    description: 'Listado de tickets con estados y asignaciones',
    icon: 'Ticket',
    defaultColumns: ['ticketNumber', 'subject', 'category', 'priority', 'status', 'assignedAgent', 'createdAt', 'resolvedAt', 'slaBreached'],
  },
  agents: {
    label: 'Agentes',
    description: 'Rendimiento por agente',
    icon: 'Users',
    defaultColumns: ['agentName', 'conversations', 'resolved', 'avgResponseTime', 'csatScore', 'transferRate', 'activeHours'],
  },
  channels: {
    label: 'Canales',
    description: 'Métricas por canal de comunicación',
    icon: 'Navigation',
    defaultColumns: ['channel', 'conversations', 'messages', 'avgResponseTime', 'resolutionRate', 'csatScore'],
  },
  satisfaction: {
    label: 'Satisfacción',
    description: 'Encuestas de satisfacción y feedback',
    icon: 'ThumbsUp',
    defaultColumns: ['date', 'responses', 'score', 'positiveRate', 'neutralRate', 'negativeRate', 'topPositiveTopics', 'topNegativeTopics'],
  },
  resolution: {
    label: 'Resolución',
    description: 'Tasas de resolución y efectividad',
    icon: 'CheckCircle',
    defaultColumns: ['date', 'totalConversations', 'resolved', 'resolutionRate', 'aiResolved', 'humanResolved', 'abandonedRate', 'retryRate'],
  },
  intents: {
    label: 'Intenciones',
    description: 'Análisis de intents detectados',
    icon: 'Brain',
    defaultColumns: ['intent', 'count', 'percentage', 'avgConfidence', 'resolutionRate', 'avgResponseTime'],
  },
  knowledge: {
    label: 'Base de Conocimiento',
    description: 'Uso y efectividad de la KB',
    icon: 'BookOpen',
    defaultColumns: ['title', 'category', 'views', 'helpful', 'notHelpful', 'helpfulRate', 'lastUpdated'],
  },
  timing: {
    label: 'Tiempos',
    description: 'Análisis de tiempos de respuesta y resolución',
    icon: 'Clock',
    defaultColumns: ['date', 'avgFirstResponse', 'medianFirstResponse', 'avgResolution', 'medianResolution', 'slaMet', 'slaBreached'],
  },
  sla: {
    label: 'SLA',
    description: 'Cumplimiento de acuerdos de nivel de servicio',
    icon: 'Target',
    defaultColumns: ['date', 'firstResponseMet', 'resolutionMet', 'breaches', 'breachRate', 'avgResponseSla', 'avgResolutionSla'],
  },
  volume: {
    label: 'Volumen',
    description: 'Análisis de volumen de conversaciones',
    icon: 'TrendingUp',
    defaultColumns: ['date', 'hour', 'conversations', 'messages', 'peakHour', 'avgConcurrent', 'queueSize'],
  },
};

export const EXPORT_COLUMNS: Record<ReportType, ReportColumn[]> = {
  executive: [
    { key: 'period', label: 'Período', type: 'text' },
    { key: 'totalConversations', label: 'Total Conversaciones', type: 'number' },
    { key: 'aiResolutionRate', label: 'Tasa Resolución IA (%)', type: 'percentage' },
    { key: 'avgResponseTime', label: 'Tiempo Promedio Respuesta', type: 'duration' },
    { key: 'csatScore', label: 'Puntuación CSAT', type: 'number' },
    { key: 'slaCompliance', label: 'Cumplimiento SLA (%)', type: 'percentage' },
    { key: 'totalAgents', label: 'Total Agentes', type: 'number' },
    { key: 'activeConversations', label: 'Conversaciones Activas', type: 'number' },
  ],
  operational: [
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'channel', label: 'Canal', type: 'text' },
    { key: 'department', label: 'Departamento', type: 'text' },
    { key: 'conversations', label: 'Conversaciones', type: 'number' },
    { key: 'resolved', label: 'Resueltas', type: 'number' },
    { key: 'avgResponseTime', label: 'Tiempo Respuesta Prom.', type: 'duration' },
    { key: 'avgResolutionTime', label: 'Tiempo Resolución Prom.', type: 'duration' },
    { key: 'escalations', label: 'Escalaciones', type: 'number' },
  ],
  conversations: [
    { key: 'conversationNumber', label: 'Nro. Conversación', type: 'text' },
    { key: 'contactName', label: 'Contacto', type: 'text' },
    { key: 'contactEmail', label: 'Email', type: 'text' },
    { key: 'contactPhone', label: 'Teléfono', type: 'text' },
    { key: 'channel', label: 'Canal', type: 'text' },
    { key: 'status', label: 'Estado', type: 'status' },
    { key: 'priority', label: 'Prioridad', type: 'text' },
    { key: 'assignedAgent', label: 'Agente Asignado', type: 'text' },
    { key: 'intent', label: 'Intención', type: 'text' },
    { key: 'createdAt', label: 'Fecha Creación', type: 'datetime' },
    { key: 'firstResponseAt', label: 'Primera Respuesta', type: 'datetime' },
    { key: 'resolvedAt', label: 'Fecha Resolución', type: 'datetime' },
    { key: 'closedAt', label: 'Fecha Cierre', type: 'datetime' },
    { key: 'responseTime', label: 'Tiempo Primera Respuesta', type: 'duration' },
    { key: 'resolutionTime', label: 'Tiempo Resolución', type: 'duration' },
    { key: 'messagesCount', label: 'Nro. Mensajes', type: 'number' },
    { key: 'csatScore', label: 'CSAT', type: 'number' },
    { key: 'tags', label: 'Etiquetas', type: 'text' },
  ],
  tickets: [
    { key: 'ticketNumber', label: 'Nro. Ticket', type: 'text' },
    { key: 'subject', label: 'Asunto', type: 'text' },
    { key: 'description', label: 'Descripción', type: 'text' },
    { key: 'category', label: 'Categoría', type: 'text' },
    { key: 'priority', label: 'Prioridad', type: 'text' },
    { key: 'status', label: 'Estado', type: 'status' },
    { key: 'assignedAgent', label: 'Agente Asignado', type: 'text' },
    { key: 'department', label: 'Departamento', type: 'text' },
    { key: 'contactName', label: 'Contacto', type: 'text' },
    { key: 'createdAt', label: 'Fecha Creación', type: 'datetime' },
    { key: 'firstResponseAt', label: 'Primera Respuesta', type: 'datetime' },
    { key: 'resolvedAt', label: 'Fecha Resolución', type: 'datetime' },
    { key: 'closedAt', label: 'Fecha Cierre', type: 'datetime' },
    { key: 'slaBreached', label: 'SLA Incumplido', type: 'text' },
    { key: 'csatScore', label: 'CSAT', type: 'number' },
  ],
  agents: [
    { key: 'agentName', label: 'Agente', type: 'text' },
    { key: 'agentEmail', label: 'Email', type: 'text' },
    { key: 'department', label: 'Departamento', type: 'text' },
    { key: 'status', label: 'Estado', type: 'text' },
    { key: 'conversations', label: 'Conversaciones Atendidas', type: 'number' },
    { key: 'resolved', label: 'Resueltas', type: 'number' },
    { key: 'avgResponseTime', label: 'Tiempo Respuesta Prom.', type: 'duration' },
    { key: 'avgResolutionTime', label: 'Tiempo Resolución Prom.', type: 'duration' },
    { key: 'csatScore', label: 'CSAT Promedio', type: 'number' },
    { key: 'transferRate', label: 'Tasa Derivación (%)', type: 'percentage' },
    { key: 'activeHours', label: 'Horas Activas', type: 'number' },
  ],
  channels: [
    { key: 'channel', label: 'Canal', type: 'text' },
    { key: 'conversations', label: 'Conversaciones', type: 'number' },
    { key: 'messages', label: 'Mensajes', type: 'number' },
    { key: 'avgResponseTime', label: 'Tiempo Respuesta Prom.', type: 'duration' },
    { key: 'resolutionRate', label: 'Tasa Resolución (%)', type: 'percentage' },
    { key: 'csatScore', label: 'CSAT', type: 'number' },
  ],
  satisfaction: [
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'responses', label: 'Respuestas', type: 'number' },
    { key: 'score', label: 'Puntuación Promedio', type: 'number' },
    { key: 'responseRate', label: 'Tasa de Respuesta (%)', type: 'percentage' },
    { key: 'positiveRate', label: 'Positivo (%)', type: 'percentage' },
    { key: 'neutralRate', label: 'Neutral (%)', type: 'percentage' },
    { key: 'negativeRate', label: 'Negativo (%)', type: 'percentage' },
    { key: 'topPositiveTopics', label: 'Temas Positivos', type: 'text' },
    { key: 'topNegativeTopics', label: 'Temas Negativos', type: 'text' },
  ],
  resolution: [
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'totalConversations', label: 'Total Conversaciones', type: 'number' },
    { key: 'resolved', label: 'Resueltas', type: 'number' },
    { key: 'resolutionRate', label: 'Tasa Resolución (%)', type: 'percentage' },
    { key: 'aiResolved', label: 'Resueltas por IA', type: 'number' },
    { key: 'humanResolved', label: 'Resueltas por Humano', type: 'number' },
    { key: 'abandoned', label: 'Abandonadas', type: 'number' },
    { key: 'abandonedRate', label: 'Tasa Abandono (%)', type: 'percentage' },
    { key: 'retryRate', label: 'Tasa Reintento (%)', type: 'percentage' },
  ],
  intents: [
    { key: 'intent', label: 'Intención', type: 'text' },
    { key: 'count', label: 'Cantidad', type: 'number' },
    { key: 'percentage', label: 'Porcentaje (%)', type: 'percentage' },
    { key: 'avgConfidence', label: 'Confianza Promedio', type: 'number' },
    { key: 'resolutionRate', label: 'Tasa Resolución (%)', type: 'percentage' },
    { key: 'avgResponseTime', label: 'Tiempo Respuesta Prom.', type: 'duration' },
  ],
  knowledge: [
    { key: 'title', label: 'Título', type: 'text' },
    { key: 'category', label: 'Categoría', type: 'text' },
    { key: 'status', label: 'Estado', type: 'text' },
    { key: 'views', label: 'Vistas', type: 'number' },
    { key: 'searches', label: 'Búsquedas', type: 'number' },
    { key: 'helpful', label: 'Útil', type: 'number' },
    { key: 'notHelpful', label: 'No Útil', type: 'number' },
    { key: 'helpfulRate', label: 'Tasa de Utilidad (%)', type: 'percentage' },
    { key: 'lastUpdated', label: 'Última Actualización', type: 'datetime' },
  ],
  timing: [
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'hour', label: 'Hora', type: 'text' },
    { key: 'avgFirstResponse', label: 'Prom. Primera Respuesta', type: 'duration' },
    { key: 'medianFirstResponse', label: 'Mediana Primeira Respuesta', type: 'duration' },
    { key: 'avgResolution', label: 'Prom. Resolución', type: 'duration' },
    { key: 'medianResolution', label: 'Mediana Resolución', type: 'duration' },
    { key: 'slaMet', label: 'SLA Cumplido', type: 'number' },
    { key: 'slaBreached', label: 'SLA Incumplido', type: 'number' },
  ],
  sla: [
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'firstResponseMet', label: 'Primera Respuesta Cumplida (%)', type: 'percentage' },
    { key: 'resolutionMet', label: 'Resolución Cumplida (%)', type: 'percentage' },
    { key: 'breaches', label: 'Incumplimientos', type: 'number' },
    { key: 'breachRate', label: 'Tasa Incumplimiento (%)', type: 'percentage' },
    { key: 'avgResponseSla', label: 'SLA Prom. Primera Resp.', type: 'duration' },
    { key: 'avgResolutionSla', label: 'SLA Prom. Resolución', type: 'duration' },
  ],
  volume: [
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'hour', label: 'Hora', type: 'text' },
    { key: 'conversations', label: 'Conversaciones', type: 'number' },
    { key: 'messages', label: 'Mensajes', type: 'number' },
    { key: 'peakHour', label: 'Hora Pico', type: 'text' },
    { key: 'avgConcurrent', label: 'Concurrentes Promedio', type: 'number' },
    { key: 'queueSize', label: 'Cola Promedio', type: 'number' },
  ],
};

export interface ScheduledReport {
  id: string;
  tenantId: string;
  
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  frequency: 'daily' | 'weekly' | 'monthly';
  
  filters: ReportFilters;
  recipients: string[];
  
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}