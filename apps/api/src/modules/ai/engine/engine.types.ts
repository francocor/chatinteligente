export enum IntentType {
  FLOW_TRIGGER = 'flow_trigger',
  INTENT_MATCH = 'intent_match',
  KEYWORD_MATCH = 'keyword_match',
  QUICK_REPLY = 'quick_reply',
  GREETING = 'greeting',
  GOODBYE = 'goodbye',
  THANK_YOU = 'thank_you',
  AFFIRMATION = 'affirmation',
  NEGATION = 'negation',
  UNKNOWN = 'unknown',
  FRUSTRATION = 'frustration',
  URGENCY = 'urgency',
}

export enum MatchStrategy {
  EXACT = 'exact',
  PARTIAL = 'partial',
  FUZZY = 'fuzzy',
  SEMANTIC = 'semantic',
}

export enum ResponseSource {
  FLOW = 'flow',
  INTENT = 'intent',
  KNOWLEDGE = 'knowledge',
  QUICK_REPLY = 'quick_reply',
  FALLBACK = 'fallback',
  AI = 'ai',
  HUMAN = 'human',
}

export enum SentimentLabel {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  MIXED = 'mixed',
}

export enum UrgencyLevel {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface IntentMatch {
  type: IntentType;
  intent?: string;
  flowId?: string;
  quickReplyId?: string;
  confidence: number;
  strategy: MatchStrategy;
  entities: Record<string, any>;
  matchedPhrases: string[];
}

export interface ChatContext {
  conversationId: string;
  contactId: string;
  tenantId: string;
  flowId?: string;
  flowNodeId?: string;
  currentIntent?: string;
  previousIntents: string[];
  collectedData: Record<string, any>;
  attemptCount: number;
  frustrationScore: number;
  sentimentHistory: SentimentLabel[];
  lastMessages: MessagePreview[];
  startTime: Date;
  lastInteractionTime: Date;
  isEscalating: boolean;
  shouldOfferHuman: boolean;
}

export interface MessagePreview {
  text: string;
  from: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  source: ResponseSource;
  quickReplies?: QuickReplyOption[];
  buttons?: ButtonOption[];
  flowId?: string;
  flowNodeId?: string;
  metadata?: Record<string, any>;
  shouldEscalate?: boolean;
  shouldOfferHuman?: boolean;
  sentiment?: SentimentLabel;
  urgency?: UrgencyLevel;
}

export interface QuickReplyOption {
  label: string;
  value: string;
  action?: 'reply' | 'url' | 'flow' | 'close';
}

export interface ButtonOption {
   label: string;
   value: string;
   action: 'url' | 'flow' | 'close' | 'transfer' | 'reply';
   url?: string;
   flowId?: string;
}

export interface FlowExecutionResult {
  shouldContinue: boolean;
  nextNodeId?: string;
  response: ChatResponse;
  collectedData?: Record<string, any>;
}

export interface IntentDefinition {
  name: string;
  displayName: string;
  description?: string;
  trainingPhrases: string[];
  responses: string[];
  followUpQuestions?: string[];
  requiredEntities?: string[];
  confidenceThreshold: number;
  fallbackResponse?: string;
  escalateToAgent: boolean;
}

export interface FallbackOptions {
  tryKnowledgeBase: boolean;
  tryAI: boolean;
  suggestHuman: boolean;
  retryCount: number;
  maxRetries: number;
}

export interface EngineConfig {
  confidenceThreshold: number;
  fuzzyThreshold: number;
  maxRetries: number;
  frustrationThreshold: number;
  enableSentimentAnalysis: boolean;
  enableUrgencyDetection: boolean;
  enableKnowledgeBase: boolean;
  enableAI: boolean;
  aiProvider?: 'openai' | 'anthropic' | 'custom';
}

export interface ConversationMetrics {
  totalMessages: number;
  botMessages: number;
  humanMessages: number;
  intentsMatched: number;
  flowsUsed: number;
  fallbackCount: number;
  avgConfidence: number;
  sentimentBreakdown: Record<SentimentLabel, number>;
  escalationCount: number;
  resolutionTimeMs?: number;
}

export interface ProcessingResult {
  response: ChatResponse;
  intent: IntentMatch;
  context: ChatContext;
  metrics: ConversationMetrics;
  processingTimeMs: number;
}
