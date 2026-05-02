import { Channel, AgentStatus } from './conversations';
import { TicketCategory, AlertType } from './tickets';

export interface CompanySettings {
  id: string;
  tenantId: string;
  
  company: CompanyInfo;
  branding: BrandingSettings;
  locations: Location[];
  departments: DepartmentSettings[];
  workingHours: WorkingHoursSettings;
  channels: ChannelSettings;
  agents: AgentSettings;
  routing: RoutingRules;
  bot: BotSettings;
  surveys: SurveySettings;
  integrations: IntegrationSettings;
  notifications: NotificationSettings;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyInfo {
  name: string;
  legalName?: string;
 rut?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  locale?: string;
  logo?: string;
  favicon?: string;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headerImage?: string;
  footerImage?: string;
  customCss?: string;
  customHeadHtml?: string;
  customBodyHtml?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  region?: string;
  country?: string;
  phone?: string;
  email?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  isMain: boolean;
}

export interface DepartmentSettings {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  
  supervisorIds: string[];
  agentIds: string[];
  
  workingHours?: {
    timezone: string;
    schedule: DaySchedule[];
  };
  
  autoAssignment: boolean;
  maxQueueSize: number;
  maxWaitTimeSeconds: number;
  
  isActive: boolean;
  priority: number;
}

export interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  enabled: boolean;
  start?: string;
  end?: string;
}

export interface WorkingHoursSettings {
  timezone: string;
  defaultSchedule: DaySchedule[];
  holidays: Holiday[];
  afterHoursMessage?: string;
  holidayMessage?: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  message?: string;
}

export interface ChannelSettings {
  web: {
    enabled: boolean;
    name?: string;
    welcomeMessage?: string;
    offlineMessage?: string;
    widgetPosition?: 'bottom-right' | 'bottom-left';
    primaryColor?: string;
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber?: string;
    businessName?: string;
    greetingMessage?: string;
    offlineMessage?: string;
    humanRequestMessage?: string;
  };
  instagram: {
    enabled: boolean;
    username?: string;
    greetingMessage?: string;
  };
  facebook: {
    enabled: boolean;
    pageName?: string;
    greetingMessage?: string;
  };
  email: {
    enabled: boolean;
    noreplyEmail?: string;
    supportEmail?: string;
    signature?: string;
    autoRespond?: boolean;
  };
  telegram: {
    enabled: boolean;
    botUsername?: string;
    greetingMessage?: string;
  };
}

export interface AgentSettings {
  defaultStatus: AgentStatus;
  maxConcurrentChats: number;
  maxChatsPerAgent: number;
  autoStatusChange: boolean;
  autoAcceptChats: boolean;
  allowTransfer: boolean;
  allowGroupTransfer: boolean;
  wrapUpTime: number;
  idleTime: number;
}

export interface RoutingRules {
  type: 'manual' | 'round_robin' | 'skills_based' | 'load_balanced' | 'priority';
  
  assignment: {
    autoAssign: boolean;
    assignToDepartment: boolean;
    notifyOnNewConversation: boolean;
    notifyOnNewTicket: boolean;
  };
  
  escalation: {
    autoEscalate: boolean;
    escalationThresholdMinutes: number;
    escalateOnSlaBreach: boolean;
    escalateOnNoResponse: boolean;
    noResponseThresholdMinutes: number;
    escalateOnKeywords: boolean;
    escalationKeywords: string[];
  };
  
  handoff: {
    enableHumanHandoff: boolean;
    allowCustomerRequest: boolean;
    keywordsForHandoff: string[];
    showAgentTyping: boolean;
    showAgentOnline: boolean;
  };
  
  priority: {
    enablePriority: boolean;
    defaultPriority: 'low' | 'normal' | 'high' | 'critical';
    priorityMapping: Record<string, 'low' | 'normal' | 'high' | 'critical'>;
  };
}

export interface BotSettings {
  name: string;
  avatar?: string;
  tone: 'formal' | 'informal' | 'friendly' | 'professional';
  greetingEnabled: boolean;
  greetingMessage?: string;
  farewellEnabled: boolean;
  farewellMessage?: string;
  
  fallbackEnabled: boolean;
  fallbackMessage?: string;
  fallbackToHuman: boolean;
  fallbackAfterRetries: number;
  
  aiEnabled: boolean;
  aiProvider?: 'openai' | 'anthropic' | 'custom';
  aiModel?: string;
  aiTemperature?: number;
  aiMaxTokens?: number;
  
  sentimentEnabled: boolean;
  sentimentThreshold: number;
  
  typingIndicators: boolean;
  readReceipts: boolean;
}

export interface SurveySettings {
  enabled: boolean;
  type: 'csat' | 'nps' | 'ces' | 'custom';
  
  csat: {
    enabled: boolean;
    scale: 1 | 5 | 10;
    questions: string[];
    askAfterResolution: boolean;
    askAfterHours: number;
    thankYouMessage?: string;
  };
  
  nps: {
    enabled: boolean;
    question: string;
    askAfterResolution: boolean;
    promotersThreshold: number;
    detractorsThreshold: number;
  };
  
  ces: {
    enabled: boolean;
    scale: 1 | 5 | 7 | 10;
    question: string;
    positiveStatements: string[];
    negativeStatements: string[];
  };
  
  triggerOn: ('resolved' | 'closed' | 'manual' | 'hours')[];
  hoursAfterResolution?: number;
}

export interface IntegrationSettings {
  crm: {
    enabled: boolean;
    provider?: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom';
    config?: Record<string, any>;
  };
  analytics: {
    enabled: boolean;
    provider?: 'ga4' | 'mixpanel' | 'amplitude' | 'custom';
    config?: Record<string, any>;
  };
  email: {
    enabled: boolean;
    provider?: 'sendgrid' | 'mailgun' | 'ses' | 'smtp' | 'custom';
    config?: Record<string, any>;
  };
  sms: {
    enabled: boolean;
    provider?: 'twilio' | 'custom';
    config?: Record<string, any>;
  };
  webhook: {
    enabled: boolean;
    url?: string;
    events: string[];
  };
}

export interface NotificationSettings {
  email: {
    newConversation: boolean;
    conversationAssigned: boolean;
    conversationEscalated: boolean;
    ticketCreated: boolean;
    ticketAssigned: boolean;
    slaBreach: boolean;
    alert: boolean;
  };
  
  push: {
    newConversation: boolean;
    ticketAssigned: boolean;
    alert: boolean;
  };
  
  slack: {
    enabled: boolean;
    webhookUrl?: string;
    channels: {
      conversation: string;
      ticket: string;
      alert: string;
    };
  };
}

export interface SettingsSection {
  id: string;
  label: string;
  description: string;
  icon: string;
  badge?: string | number;
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'company',
    label: 'Empresa',
    description: 'Información general de la empresa',
    icon: 'Building2',
  },
  {
    id: 'locations',
    label: 'Sedes',
    description: 'Locations y direcciones',
    icon: 'MapPin',
  },
  {
    id: 'departments',
    label: 'Departamentos',
    description: 'Equipos y departamentos',
    icon: 'Users',
  },
  {
    id: 'schedule',
    label: 'Horario',
    description: 'Horarios de atención',
    icon: 'Clock',
  },
  {
    id: 'channels',
    label: 'Canales',
    description: 'Canales activos',
    icon: 'MessageCircle',
  },
  {
    id: 'agents',
    label: 'Agentes',
    description: 'Configuración de agentes',
    icon: 'Headphones',
  },
  {
    id: 'routing',
    label: 'Derivación',
    description: 'Reglas de enrutamiento',
    icon: 'GitBranch',
  },
  {
    id: 'bot',
    label: 'Bot',
    description: 'Configuración del asistente',
    icon: 'Bot',
  },
  {
    id: 'surveys',
    label: 'Encuestas',
    description: 'Encuestas de satisfacción',
    icon: 'ClipboardList',
  },
  {
    id: 'integrations',
    label: 'Integraciones',
    description: 'Conexiones externas',
    icon: 'Plug',
  },
  {
    id: 'notifications',
    label: 'Notificaciones',
    description: 'Alertas y notificaciones',
    icon: 'Bell',
  },
  {
    id: 'branding',
    label: 'Branding',
    description: 'Personalización visual',
    icon: 'Palette',
  },
];

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export const INDUSTRIES = [
  { value: 'healthcare', label: 'Salud' },
  { value: 'retail', label: 'Comercio' },
  { value: 'banking', label: 'Banca y Finanzas' },
  { value: 'telecom', label: 'Telecomunicaciones' },
  { value: 'education', label: 'Educación' },
  { value: 'real_estate', label: 'Inmobiliario' },
  { value: 'travel', label: 'Viajes y Turismo' },
  { value: 'food', label: 'Alimentación' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'services', label: 'Servicios' },
  { value: 'manufacturing', label: 'Manufactura' },
  { value: 'other', label: 'Otro' },
];

export const BOT_TONES = [
  { value: 'formal', label: 'Formal', description: 'Profesional y serio' },
  { value: 'informal', label: 'Informal', description: 'Descomplicado y relaxed' },
  { value: 'friendly', label: 'Amigable', description: 'Cálido y cercano' },
  { value: 'professional', label: 'Profesional', description: 'Expert y directo' },
];