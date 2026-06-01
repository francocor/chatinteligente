import { 
  AnalyticsOverview, MessageMetrics, AIMetrics, TimingMetrics, 
  SLAMetrics, TransferMetrics, AgentMetrics, CSATMetrics,
  ChannelMetrics, DepartmentMetrics, HourlyData, DailyData,
  IntentMetrics, TopicMetrics, AgentPerformance, DashboardKPI
} from '@/types/analytics';

export const mockAnalyticsOverview: AnalyticsOverview = {
  total: 4523,
  new: 1245,
  active: 89,
  resolved: 3245,
  closed: 892,
  abandoned: 142,
  escalated: 156,
};

export const mockMessageMetrics: MessageMetrics = {
  total: 28543,
  inbound: 15678,
  outbound: 12865,
  avgPerConversation: 6.3,
};

export const mockAIMetrics: AIMetrics = {
  handledByAI: 3845,
  aiResolutionRate: 71.8,
  avgConfidence: 0.84,
  fallbackCount: 678,
};

export const mockTimingMetrics: TimingMetrics = {
  avgFirstResponseTimeMs: 45000,
  medianFirstResponseTimeMs: 32000,
  avgResolutionTimeMs: 180000,
  medianResolutionTimeMs: 145000,
};

export const mockSLAMetrics: SLAMetrics = {
  firstResponseMet: 89.2,
  resolutionMet: 82.5,
  breaches: 234,
  breachRate: 5.2,
};

export const mockTransferMetrics: TransferMetrics = {
  toHuman: 856,
  fromAI: 678,
  transferRate: 18.9,
};

export const mockAgentMetrics: AgentMetrics = {
  total: 12,
  online: 8,
  available: 6,
  avgUtilization: 72.5,
  avgConcurrentChats: 3.2,
};

export const mockCSATMetrics: CSATMetrics = {
  responses: 1856,
  score: 4.3,
  responseRate: 58.4,
  positiveRate: 68.5,
  neutralRate: 22.3,
  negativeRate: 9.2,
};

export const mockChannelMetrics: ChannelMetrics[] = [
  { channel: 'WHATSAPP', count: 2156, percentage: 47.7 },
  { channel: 'WEB', count: 1523, percentage: 33.7 },
  { channel: 'INSTAGRAM', count: 423, percentage: 9.4 },
  { channel: 'FACEBOOK', count: 287, percentage: 6.3 },
  { channel: 'TELEGRAM', count: 98, percentage: 2.2 },
  { channel: 'EMAIL', count: 36, percentage: 0.8 },
];

export const mockDepartmentMetrics: DepartmentMetrics[] = [
  { department: 'Atención al Cliente', conversations: 1823, resolved: 1654, avgResolutionTime: 145000 },
  { department: 'Ventas', conversations: 1234, resolved: 1123, avgResolutionTime: 98000 },
  { department: 'Soporte Técnico', conversations: 876, resolved: 823, avgResolutionTime: 76000 },
  { department: 'Operaciones', conversations: 342, resolved: 312, avgResolutionTime: 23000 },
  { department: 'Cobranzas', conversations: 248, resolved: 189, avgResolutionTime: 210000 },
];

export const mockHourlyData: HourlyData[] = [
  { hour: 8, conversations: 23, messages: 89 },
  { hour: 9, conversations: 45, messages: 178 },
  { hour: 10, conversations: 67, messages: 289 },
  { hour: 11, conversations: 89, messages: 412 },
  { hour: 12, conversations: 56, messages: 234 },
  { hour: 13, conversations: 34, messages: 156 },
  { hour: 14, conversations: 78, messages: 356 },
  { hour: 15, conversations: 95, messages: 445 },
  { hour: 16, conversations: 102, messages: 489 },
  { hour: 17, conversations: 87, messages: 398 },
  { hour: 18, conversations: 54, messages: 234 },
  { hour: 19, conversations: 28, messages: 112 },
  { hour: 20, conversations: 12, messages: 45 },
];

export const mockDailyData: DailyData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseConversations = 120 + Math.floor(Math.random() * 60);
  return {
    date: date.toISOString().split('T')[0],
    conversations: baseConversations,
    resolved: Math.floor(baseConversations * (0.75 + Math.random() * 0.2)),
    messages: Math.floor(baseConversations * (5 + Math.random() * 3)),
    avgResponseTime: 30000 + Math.floor(Math.random() * 30000),
  };
});

export const mockIntentMetrics: IntentMetrics[] = [
  { intent: 'consulta_precio', count: 1245, percentage: 27.5, avgConfidence: 0.89, resolutionRate: 82.3 },
  { intent: 'consultar_horario', count: 876, percentage: 19.4, avgConfidence: 0.92, resolutionRate: 94.1 },
  { intent: 'estado_pedido', count: 543, percentage: 12.0, avgConfidence: 0.85, resolutionRate: 78.5 },
  { intent: 'medios_pago', count: 423, percentage: 9.4, avgConfidence: 0.88, resolutionRate: 86.2 },
  { intent: 'info_planes', count: 312, percentage: 6.9, avgConfidence: 0.91, resolutionRate: 92.8 },
  { intent: 'soporte_urgente', count: 234, percentage: 5.2, avgConfidence: 0.95, resolutionRate: 98.2 },
  { intent: 'hablar_humano', count: 198, percentage: 4.4, avgConfidence: 0.78, resolutionRate: 100 },
  { intent: 'otro', count: 692, percentage: 15.3, avgConfidence: 0.65, resolutionRate: 45.2 },
];

export const mockTopicMetrics: TopicMetrics[] = [
  { topic: 'Consultas de precio', count: 1567, percentage: 34.7 },
  { topic: 'Horarios de atención', count: 876, percentage: 19.4 },
  { topic: 'Estado de pedido', count: 654, percentage: 14.5 },
  { topic: 'Medios de pago', count: 543, percentage: 12.0 },
  { topic: 'Soporte técnico', count: 432, percentage: 9.6 },
  { topic: 'Reclamos', count: 234, percentage: 5.2 },
  { topic: 'Otros', count: 217, percentage: 4.8 },
];

export const mockAgentPerformance: AgentPerformance[] = [
  { agentId: '1', agentName: 'María González', conversations: 456, resolved: 423, avgResponseTime: 28000, csatScore: 4.6 },
  { agentId: '2', agentName: 'Carlos Mendoza', conversations: 389, resolved: 356, avgResponseTime: 35000, csatScore: 4.4 },
  { agentId: '3', agentName: 'Ana Silva', conversations: 312, resolved: 298, avgResponseTime: 32000, csatScore: 4.7 },
  { agentId: '4', agentName: 'Roberto Díaz', conversations: 287, resolved: 267, avgResponseTime: 41000, csatScore: 4.2 },
  { agentId: '5', agentName: 'Patricia López', conversations: 234, resolved: 212, avgResponseTime: 38000, csatScore: 4.5 },
  { agentId: '6', agentName: 'Javier Torres', conversations: 198, resolved: 178, avgResponseTime: 45000, csatScore: 4.1 },
  { agentId: '7', agentName: 'Sofia Ramírez', conversations: 176, resolved: 165, avgResponseTime: 29000, csatScore: 4.8 },
  { agentId: '8', agentName: 'Miguel Herrera', conversations: 154, resolved: 142, avgResponseTime: 52000, csatScore: 3.9 },
];

export const mockDashboardKPIs: DashboardKPI[] = [
  { 
    id: 'total-conversations', 
    label: 'Conversaciones Totales', 
    value: 4523, 
    previousValue: 4234,
    change: 289,
    changePercentage: 6.8,
    format: 'number',
    trend: 'up',
    icon: 'MessageSquare',
    description: 'Total de conversaciones en el período'
  },
  { 
    id: 'ai-resolution-rate', 
    label: 'Tasa Resolución IA', 
    value: '71.8%', 
    previousValue: 68.5,
    change: 3.3,
    changePercentage: 4.8,
    format: 'percentage',
    trend: 'up',
    icon: 'Bot',
    description: 'Porcentaje de conversaciones resueltas por el bot'
  },
  { 
    id: 'avg-response-time', 
    label: 'Tiempo de Respuesta', 
    value: '45s', 
    previousValue: 52,
    change: -7,
    changePercentage: -13.5,
    format: 'time',
    trend: 'up',
    icon: 'Clock',
    description: 'Tiempo promedio de primera respuesta'
  },
  { 
    id: 'csat-score', 
    label: 'Satisfacción (CSAT)', 
    value: '4.3', 
    previousValue: 4.1,
    change: 0.2,
    changePercentage: 4.9,
    format: 'number',
    trend: 'up',
    icon: 'Star',
    description: 'Puntuación promedio de satisfacción'
  },
  { 
    id: 'transfer-rate', 
    label: 'Tasa de Derivación', 
    value: '18.9%', 
    previousValue: 21.3,
    change: -2.4,
    changePercentage: -11.3,
    format: 'percentage',
    trend: 'up',
    icon: 'UserPlus',
    description: 'Porcentaje de conversaciones derivadas a humano'
  },
  { 
    id: 'sla-compliance', 
    label: 'Cumplimiento SLA', 
    value: '89.2%', 
    previousValue: 85.7,
    change: 3.5,
    changePercentage: 4.1,
    format: 'percentage',
    trend: 'up',
    icon: 'CheckCircle',
    description: 'Porcentaje de cumplimiento de SLA'
  },
];

export const strategicKPIs = {
  eficiencia: [
    { metric: 'Tiempo promedio de resolución', target: 120, current: 180, unit: 'segundos', status: 'warning' },
    { metric: 'Tasa de resolución en primer contacto', target: 75, current: 71.8, unit: '%', status: 'warning' },
    { metric: 'Productividad por agente', target: 50, current: 42, unit: 'conversaciones', status: 'warning' },
  ],
  satisfaccion: [
    { metric: 'CSAT promedio', target: 4.5, current: 4.3, unit: '/5', status: 'good' },
    { metric: 'NPS (Net Promoter Score)', target: 50, current: 42, unit: 'puntos', status: 'good' },
    { metric: 'Tasa de quejas', target: 2, current: 3.2, unit: '%', status: 'critical' },
  ],
  automatizacion: [
    { metric: 'Automatización de consultas', target: 80, current: 71.8, unit: '%', status: 'good' },
    { metric: 'Tasa de derivación a humano', target: 10, current: 18.9, unit: '%', status: 'critical' },
    { metric: 'Accuracy del NLP', target: 90, current: 84, unit: '%', status: 'warning' },
  ],
  operasional: [
    { metric: 'Cumplimiento de SLA', target: 95, current: 89.2, unit: '%', status: 'warning' },
    { metric: 'Tiempo de espera promedio', target: 30, current: 45, unit: 'segundos', status: 'warning' },
    { metric: 'Tasa de abandonos', target: 3, current: 3.1, unit: '%', status: 'good' },
  ],
};

export const comparisonPeriods = [
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Últimos 7 días', value: 'last7days' },
  { label: 'Últimos 30 días', value: 'last30days' },
  { label: 'Este mes', value: 'thisMonth' },
  { label: 'Mes anterior', value: 'lastMonth' },
  { label: 'Este año', value: 'thisYear' },
  { label: 'Personalizado', value: 'custom' },
];

export function generateTrendData(days: number, baseValue: number, variance: number): DailyData[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    const value = Math.floor(baseValue * randomFactor);
    return {
      date: date.toISOString().split('T')[0],
      conversations: value,
      resolved: Math.floor(value * (0.7 + Math.random() * 0.25)),
      messages: Math.floor(value * (4 + Math.random() * 3)),
      avgResponseTime: Math.floor(30000 + Math.random() * 40000),
    };
  });
}