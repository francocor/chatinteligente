export type ConversationStatus = 
  | 'ACTIVE'
  | 'WAITING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ARCHIVED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type Channel = 'WEB' | 'WHATSAPP' | 'FACEBOOK' | 'INSTAGRAM' | 'TELEGRAM' | 'EMAIL';

export type ConversationSubStatus = 
  | 'bot_active'
  | 'waiting_human'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'escalated'
  | 'closed';

export interface Contact {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  channel: Channel;
  channelAccount?: string;
  documentType?: string;
  documentNumber?: string;
  company?: string;
  city?: string;
  region?: string;
  country?: string;
  totalConversations: number;
  avgSatisfaction?: number;
  firstContactAt?: Date;
  lastContactAt?: Date;
  createdAt: Date;
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
  maxConcurrentConversations: number;
  currentConversations: number;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  direction: 'INBOUND' | 'OUTBOUND' | 'INTERNAL';
  channel: Channel;
  contentType: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' | 'QUICK_REPLY' | 'BUTTONS';
  fromType: 'CONTACT' | 'AGENT' | 'AI' | 'SYSTEM' | 'BOT' | 'FLOW';
  text?: string;
  mediaUrls?: string[];
  quickReplyId?: string;
  quickReply?: QuickReplyOption;
  fromId?: string;
  fromName?: string;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'MIXED';
  intentName?: string;
  intentConfidence?: number;
  sentAt: Date;
  readAt?: Date;
}

export interface QuickReplyOption {
  id: string;
  label: string;
  value: string;
}

export interface Conversation {
  id: string;
  tenantId: string;
  conversationNumber: number;
  channel: Channel;
  status: ConversationStatus;
  subStatus: ConversationSubStatus;
  priority: Priority;
  
  contactId?: string;
  contact?: Contact;
  
  assignedAgentId?: string;
  assignedAgent?: Agent;
  
  flowId?: string;
  intentId?: string;
  
  firstMessage?: string;
  summary?: string;
  customFields?: Record<string, any>;
  tags: string[];
  
  humanAssistanceRequested: boolean;
  humanAssistanceReason?: string;
  humanAssistanceAt?: Date;
  humanAssignedAt?: Date;
  
  responseTimeMs?: number;
  resolutionTimeMs?: number;
  
  csatScore?: number;
  csatFeedback?: string;
  
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  
  messages?: ConversationMessage[];
  _count?: {
    messages: number;
  };
}

export interface ConversationFilters {
  status?: ConversationStatus;
  priority?: Priority;
  channel?: Channel;
  assignedAgentId?: string;
  departmentId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ConversationStats {
  total: number;
  active: number;
  waiting: number;
  inProgress: number;
  resolved: number;
  closed: number;
  escalated: number;
  avgResponseTime: number;
  avgResolutionTime: number;
}

export interface InternalNote {
  id: string;
  conversationId: string;
  content: string;
  createdById: string;
  createdBy?: {
    displayName: string;
    avatar?: string;
  };
  createdAt: Date;
  isPrivate: boolean;
}

export interface ConversationAssignment {
  agentId: string;
  assignedAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  declinedReason?: string;
}
