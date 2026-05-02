import { Channel, MessageContentType, MessageDirection } from './conversations';

export type WhatsAppMessageStatus = 
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'
  | 'ERROR';

export type WhatsAppMessageType = 
  | 'TEXT'
  | 'IMAGE'
  | 'AUDIO'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'STICKER'
  | 'LOCATION'
  | 'CONTACTS'
  | 'INTERACTIVE';

export type WhatsAppInteractiveType = 
  | 'LIST'
  | 'BUTTONS'
  | 'PRODUCT'
  | 'PRODUCT_LIST';

export type WhatsAppConversationOrigin = 
  | 'NEW'
  | 'SESSION'
  | 'ZERO_SESSION'
  | 'NOVELTY';

export interface WhatsAppConfig {
  id: string;
  tenantId: string;
  
  phoneNumberId: string;
  businessAccountId: string;
  phoneNumber: string;
  businessName: string;
  
  accessToken: string;
  accessTokenExpiresAt?: Date;
  
  webhookVerifyToken: string;
  webhookSecret: string;
  
  isActive: boolean;
  isVerified: boolean;
  
  messagesReceived: number;
  messagesSent: number;
  lastSyncAt?: Date;
  
  config: WhatsAppConfigSettings;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppConfigSettings {
  autoCreateContact: boolean;
  autoAssignAgent: boolean;
  defaultDepartmentId?: string;
  defaultFlowId?: string;
  
  greetingMessage?: string;
  offlineMessage?: string;
  humanRequestMessage?: string;
  
  workingHours?: WorkingHours;
  timezone?: string;
  
  templates?: {
    greeting?: string;
    humanOffer?: string;
    offline?: string;
    resolution?: string;
    csat?: string;
  };
  
  limits?: WhatsAppLimits;
  security?: WhatsAppSecurity;
}

export interface WorkingHours {
  timezone: string;
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  holidays?: Holiday[];
}

export interface DayHours {
  start: string;
  end: string;
}

export interface Holiday {
  date: string;
  name: string;
}

export interface WhatsAppLimits {
  maxMessagesPerSecond: number;
  maxMessagesPerDay: number;
  maxRecipientsPerMessage: number;
  messageExpiryHours: number;
}

export interface WhatsAppSecurity {
  allowGroupMessages: boolean;
  allowBroadcasts: boolean;
  requireOptIn: boolean;
  blockUnknownNumbers: boolean;
  maxContactsPerDay: number;
}

export interface WhatsAppMessage {
  id: string;
  tenantId: string;
  
  wamid: string;
  conversationId?: string;
  
  from: string;
  to: string;
  
  direction: MessageDirection;
  type: WhatsAppMessageType;
  contentType: MessageContentType;
  
  text?: string;
  media?: WhatsAppMedia;
  interactive?: WhatsAppInteractive;
  
  context?: {
    wamid?: string;
    messageId?: string;
  };
  
  reaction?: {
    emoji: string;
    messageId: string;
  };
  
  status: WhatsAppMessageStatus;
  error?: string;
  
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  
  retryCount: number;
  lastRetryAt?: Date;
  
  metadata: Record<string, any>;
  
  createdAt: Date;
}

export interface WhatsAppMedia {
  id: string;
  type: WhatsAppMessageType;
  mimeType: string;
  fileName?: string;
  fileSize?: number;
  url?: string;
  caption?: string;
}

export interface WhatsAppInteractive {
  type: WhatsAppInteractiveType;
  action?: {
    button?: string;
    buttons?: InteractiveButton[];
    listId?: string;
    sectionId?: string;
    productId?: string;
    productSectionId?: string;
  };
  header?: {
    type: 'text' | 'video' | 'image' | 'document';
    text?: string;
    video?: WhatsAppMedia;
    image?: WhatsAppMedia;
    document?: WhatsAppMedia;
  };
  body?: {
    text: string;
  };
  footer?: {
    text: string;
  };
}

export interface InteractiveButton {
  id: string;
  title: string;
}

export interface WhatsAppTemplate {
  id: string;
  tenantId: string;
  
  wabaTemplateId?: string;
  name: string;
  language: string;
  category: WhatsAppTemplateCategory;
  
  components: WhatsAppTemplateComponent[];
  
  params?: {
    type: string;
    name: string;
    example?: string[];
  }[];
  
  status: WhatsAppTemplateStatus;
  
  usageCount: number;
  lastUsedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export type WhatsAppTemplateCategory = 
  | 'MARKETING'
  | 'UTILITY'
  | 'AUTHENTICATION'
  | 'TRANSACTIONAL';

export type WhatsAppTemplateStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISABLED';

export interface WhatsAppTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  parameters?: TemplateParameter[];
  buttons?: TemplateButton[];
}

export interface TemplateParameter {
  type: 'TEXT' | 'CURRENCY' | 'DATE_TIME' | 'IMAGE' | 'DOCUMENT';
  name: string;
  value?: string;
  currency?: {
    code: string;
    amount: number;
    name?: string;
  };
  dateTime?: {
    fallback_value: string;
  };
}

export interface TemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'OTP' | 'COPY_CODE';
  text?: string;
  url?: string;
  urlSuffix?: string;
  otpType?: 'ONE_TAP' | 'COPY_CODE';
  otpCodeLength?: number;
}

export interface WhatsAppWebhookEvent {
  object: string;
  entry: WhatsAppWebhookEntry[];
}

export interface WhatsAppWebhookEntry {
  id: string;
  changes: WhatsAppWebhookChange[];
}

export interface WhatsAppWebhookChange {
  value: {
    messagingProduct: string;
    metadata: {
      displayPhoneNumber: string;
      phoneNumberId: string;
    };
    messages?: WhatsAppWebhookMessage[];
    statuses?: WhatsAppWebhookStatus[];
    contacts?: WhatsAppWebhookContact[];
  };
  field: string;
}

export interface WhatsAppWebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: WhatsAppMessageType;
  
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  audio?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  video?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  document?: {
    id: string;
    mime_type: string;
    sha256: string;
    filename: string;
    caption?: string;
  };
  sticker?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  contacts?: {
    contacts: any[];
  };
  interactive?: {
    type: WhatsAppInteractiveType;
    button?: {
      payload: string;
      productRetailerId?: string;
    };
    listReply?: {
      id: string;
      title: string;
      description?: string;
      productRetailerId?: string;
    };
    product?: {
      productRetailerId: string;
      quantity?: number;
    };
  };
  button?: {
    text: string;
    payload?: string;
  };
  system?: {
    body: string;
    type: string;
    identity?: string;
  };
  reaction?: {
    messageId: string;
    emoji: string;
  };
}

export interface WhatsAppWebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'censored' | 'expired';
  timestamp: string;
  recipientId: string;
  conversation?: {
    id: string;
    origin: WhatsAppConversationOrigin;
  };
  pricing?: {
    pricingModel: string;
    billable: boolean;
    category: string;
    currency: string;
    unitPrice: number;
  };
  errors?: {
    code: number;
    title: string;
    message: string;
    errorData?: any;
  };
}

export interface WhatsAppWebhookContact {
  profile: {
    name: string;
  };
  waId: string;
}

export interface WhatsAppEventLog {
  id: string;
  tenantId: string;
  
  eventType: WhatsAppEventType;
  phoneNumberId?: string;
  
  wamid?: string;
  from?: string;
  to?: string;
  
  payload?: Record<string, any>;
  response?: Record<string, any>;
  
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  error?: string;
  errorCode?: number;
  
  duration: number;
  
  createdAt: Date;
}

export type WhatsAppEventType = 
  | 'MESSAGE_RECEIVED'
  | 'MESSAGE_SENT'
  | 'MESSAGE_DELIVERED'
  | 'MESSAGE_READ'
  | 'MESSAGE_FAILED'
  | 'STATUS_UPDATE'
  | 'CONTACT_UPDATE'
  | 'TEMPLATE_SEND'
  | 'MEDIA_UPLOAD'
  | 'MEDIA_DOWNLOAD'
  | 'WEBHOOK_VERIFY'
  | 'WEBHOOK_RECEIVED';

export interface WhatsAppError {
  code: number;
  title: string;
  message: string;
  href?: string;
  errorData?: any;
}

export const WHATSAPP_ERROR_CODES: Record<number, WhatsAppError> = {
  1: {
    code: 1,
    title: 'Generic error',
    message: 'Generic error. Please retry.',
  },
  2: {
    code: 2,
    title: 'Generic error',
    message: 'Generic error. Please retry.',
  },
  100: {
    code: 100,
    title: 'Invalid JSON',
    message: 'Invalid JSON in request. Please check the payload.',
    href: 'https://developers.facebook.com/docs/whatsapp/api/messages',
  },
  200: {
    code: 200,
    title: 'Invalid field',
    message: 'Invalid field in request. Please check the payload.',
    href: 'https://developers.facebook.com/docs/whatsapp/api/messages',
  },
  400: {
    code: 400,
    title: 'Invalid phone number',
    message: 'The phone number is invalid or not in WhatsApp.',
  },
  401: {
    code: 401,
    title: 'Invalid credentials',
    message: 'Your access token has expired. Please renew.',
    href: 'https://developers.facebook.com/docs/whatsapp/api/messages',
  },
  403: {
    code: 403,
    title: 'Phone number not verified',
    message: 'The phone number is not linked to your business account.',
  },
  500: {
    code: 500,
    title: 'Internal server error',
    message: 'An internal error occurred. Please retry later.',
  },
  501: {
    code: 501,
    title: 'Feature not supported',
    message: 'This feature is not supported.',
  },
  506: {
    code: 506,
    title: 'Pending internal review',
    message: 'Account pending internal review.',
  },
  1200: {
    code: 1200,
    title: 'Rate limit',
    message: 'Too many requests. Please retry after a short wait.',
  },
  1300: {
    code: 1300,
    title: 'Pending owner approval',
    message: 'The message template is pending approval.',
  },
  1301: {
    code: 1301,
    title: 'Template rejected',
    message: 'The message template was rejected.',
  },
  1302: {
    code: 1302,
    title: 'Feature孕期 not enabled',
    message: 'The feature孕期 is not enabled.',
  },
  1310: {
    code: 1310,
    title: 'Cannot send to live phone number',
    message: 'Cannot send updates to a live phone number during development.',
  },
  1311: {
    code: 1311,
    title: 'Phone number not in address book',
    message: 'Cannot send to phone number not in address book.',
  },
  1312: {
    code: 1312,
    title: 'Opt-in not found',
    message: 'The customer has not opted in.',
    href: 'https://developers.facebook.com/docs/whatsapp-api/migration-guide/opt-in',
  },
  1313: {
    code: 1313,
    title: 'Out of office hours',
    message: 'Cannot send message outside of office hours.',
  },
  1314: {
    code: 1314,
    title: 'Template body too long',
    message: 'Template body exceeds maximum length.',
  },
  1315: {
    code: 1315,
    title: 'Template header too long',
    message: 'Template header 孕期 too long.',
  },
  1316: {
    code: 1316,
    title: 'Template variable too long',
    message: 'Template variable exceeds maximum length.',
  },
};

export interface WhatsAppAnalytics {
  totalMessagesReceived: number;
  totalMessagesSent: number;
  totalConversations: number;
  
  byStatus: Record<WhatsAppMessageStatus, number>;
  byType: Record<WhatsAppMessageType, number>;
  
  avgResponseTime: number;
  deliveryRate: number;
  readRate: number;
  
  failedMessages: number;
  failedRate: number;
}