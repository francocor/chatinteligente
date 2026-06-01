export type TicketStatus = 
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type TicketCategory = 
  | 'technical'
  | 'billing'
  | 'support'
  | 'sales'
  | 'complaint'
  | 'other';

export type EscalationReason = 
  | 'human_request'
  | 'frustration_detected'
  | 'unresolved_after_retries'
  | 'requires_specialist'
  | 'urgency_detected'
  | 'policy_required'
  | 'manual_escalation';

export interface Ticket {
  id: string;
  tenantId: string;
  ticketNumber: number;
  channel: Channel;
  status: TicketStatus;
  priority: Priority;
  category: TicketCategory;
  subCategory?: string;
  
  contactId?: string;
  contact?: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  
  assignedAgentId?: string;
  assignedAgent?: Agent;
  
  departmentId?: string;
  department?: {
    id: string;
    name: string;
  };
  
  conversationId?: string;
  
  subject: string;
  description: string;
  attachments?: string[];
  
  resolution?: string;
  resolvedAt?: Date;
  closedAt?: Date;
  
  firstResponseAt?: Date;
  firstResponseSla?: Date;
  resolutionSla?: Date;
  slaBreached: boolean;
  
  csatScore?: number;
  csatFeedback?: string;
  
  notes: TicketNote[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  userId: string;
  user: {
    id: string;
    displayName: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  };
  status: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE' | 'ON_BREAK';
}

export interface TicketNote {
  id: string;
  ticketId: string;
  content: string;
  createdById: string;
  createdBy?: {
    displayName: string;
    avatar?: string;
  };
  isPrivate: boolean;
  createdAt: Date;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: Priority;
  category?: TicketCategory;
  departmentId?: string;
  assignedAgentId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  waiting: number;
  resolved: number;
  closed: number;
  slaBreached: number;
  avgResponseTime: number;
  avgResolutionTime: number;
}

// ===========================================================
// ALERTS
// ===========================================================

export type AlertType = 
  | 'CONVERSATION_SLA'
  | 'MESSAGE_SLA'
  | 'QUEUE_SIZE'
  | 'AGENT_AVAILABILITY'
  | 'CSAT_DROP'
  | 'VOLUME_SPIKE'
  | 'ERROR_RATE'
  | 'SYSTEM'
  | 'ESCALATION'
  | 'TICKET';

export type AlertUrgency = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type AlertStatus = 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export interface Alert {
  id: string;
  tenantId: string;
  type: AlertType;
  urgency: AlertUrgency;
  status: AlertStatus;
  
  title: string;
  message: string;
  
  relatedConversationId?: string;
  relatedTicketId?: string;
  relatedAgentId?: string;
  
  acknowledgedAt?: Date;
  acknowledgedById?: string;
  resolvedAt?: Date;
  
  createdAt: Date;
}

export interface AlertRule {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  
  type: AlertType;
  condition: AlertCondition;
  threshold?: number;
  
  action: AlertAction;
  
  isActive: boolean;
  triggerCount: number;
  lastTriggerAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertCondition {
  type: string;
  field?: string;
  operator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value?: any;
  threshold?: number;
}

export interface AlertAction {
  type: 'notify' | 'notify_agents' | 'create_ticket' | 'assign' | 'escalate';
  config?: Record<string, any>;
}

export interface AlertFilters {
  type?: AlertType;
  status?: AlertStatus;
  urgency?: AlertUrgency;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AlertStats {
  total: number;
  pending: number;
  acknowledged: number;
  resolved: number;
  byType: Record<AlertType, number>;
  byUrgency: Record<AlertUrgency, number>;
}

// ===========================================================
// ESCALATION RULES
// ===========================================================

export interface EscalationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  
  conditions: EscalationCondition[];
  actions: EscalationAction[];
}

export interface EscalationCondition {
  type: EscalationReason;
  checkFrustration?: boolean;
  checkRetries?: boolean;
  checkUrgency?: boolean;
  checkIntent?: string[];
  maxRetries?: number;
  frustrationThreshold?: number;
}

export interface EscalationAction {
  type: 'create_ticket' | 'notify_agents' | 'assign_queue' | 'auto_assign';
  config?: Record<string, any>;
}

export type Channel = 'WEB' | 'WHATSAPP' | 'FACEBOOK' | 'INSTAGRAM' | 'TELEGRAM' | 'EMAIL';