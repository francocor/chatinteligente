import { Channel, ConversationStatus } from './conversations';

export interface AnalyticsOverview {
  total: number;
  new: number;
  active: number;
  resolved: number;
  closed: number;
  abandoned: number;
  escalated: number;
}

export interface MessageMetrics {
  total: number;
  inbound: number;
  outbound: number;
  avgPerConversation: number;
}

export interface AIMetrics {
  handledByAI: number;
  aiResolutionRate: number;
  avgConfidence: number;
  fallbackCount: number;
}

export interface TimingMetrics {
  avgFirstResponseTimeMs: number;
  medianFirstResponseTimeMs: number;
  avgResolutionTimeMs: number;
  medianResolutionTimeMs: number;
}

export interface SLAMetrics {
  firstResponseMet: number;
  resolutionMet: number;
  breaches: number;
  breachRate: number;
}

export interface TransferMetrics {
  toHuman: number;
  fromAI: number;
  transferRate: number;
}

export interface AgentMetrics {
  total: number;
  online: number;
  available: number;
  avgUtilization: number;
  avgConcurrentChats: number;
}

export interface CSATMetrics {
  responses: number;
  score: number;
  responseRate: number;
  positiveRate: number;
  neutralRate: number;
  negativeRate: number;
}

export interface ChannelMetrics {
  channel: Channel;
  count: number;
  percentage: number;
}

export interface DepartmentMetrics {
  department: string;
  conversations: number;
  resolved: number;
  avgResolutionTime: number;
}

export interface HourlyData {
  hour: number;
  conversations: number;
  messages: number;
}

export interface DailyData {
  date: string;
  conversations: number;
  resolved: number;
  messages: number;
  avgResponseTime: number;
}

export interface IntentMetrics {
  intent: string;
  count: number;
  percentage: number;
  avgConfidence: number;
  resolutionRate: number;
}

export interface TopicMetrics {
  topic: string;
  count: number;
  percentage: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  conversations: number;
  resolved: number;
  avgResponseTime: number;
  csatScore: number;
}

export interface TrendData {
  period: string;
  value: number;
  previousValue?: number;
}

export interface ComparisonData {
  currentPeriod: string;
  previousPeriod: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
}

export interface AnalyticsFilters {
  dateFrom?: Date;
  dateTo?: Date;
  channel?: Channel;
  departmentId?: string;
  agentId?: string;
  status?: ConversationStatus;
}

export interface DateRangeOption {
  label: string;
  value: string;
  days: number;
}

export interface DashboardKPI {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
  format?: 'number' | 'percentage' | 'time' | 'currency';
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
  description?: string;
}

export interface StrategicKPIs {
  clientValue: string;
  metric: string;
  target: number;
  current: number;
  status: 'good' | 'warning' | 'critical';
}