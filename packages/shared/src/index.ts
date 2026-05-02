// Shared types, utilities, constants
// This package is used across frontend and backend

export const PLATAFORMA_VERSION = '1.0.0';

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LOCALE = 'es-CL';
export const DEFAULT_TIMEZONE = 'America/Santiago';

// Role constants
export const ROLE_SUPER_ADMIN = 'SUPER_ADMIN';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_AGENT = 'AGENT';
export const ROLE_MANAGER = 'MANAGER';
export const ROLE_VIEWER = 'VIEWER';

// Permission actions
export const PermissionActions = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  UPDATE: 'update',
  SHARE: 'share',
} as const;

// Channel types (sync with Prisma Channel enum)
export const CHANNELS = {
  WEB: 'WEB',
  WHATSAPP: 'WHATSAPP',
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  TELEGRAM: 'TELEGRAM',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  API: 'API',
  VOICE: 'VOICE',
} as const;

// Conversation statuses (sync with Prisma)
export const CONVERSATION_STATUS = {
  ACTIVE: 'ACTIVE',
  WAITING: 'WAITING',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  ESCALATED: 'ESCALATED',
} as const;

// Message direction
export const MESSAGE_DIRECTION = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND',
} as const;

// Agent status
export const AGENT_STATUS = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  AWAY: 'AWAY',
  BUSY: 'BUSY',
} as const;

// Priority levels
export const PRIORITY = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

// Tenant status
export const TENANT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TRIAL: 'TRIAL',
  TRIAL_EXPIRED: 'TRIAL_EXPIRED',
  CANCELLED: 'CANCELLED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
} as const;
