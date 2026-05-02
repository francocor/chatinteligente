import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ChatResponse,
  IntentMatch,
  IntentType,
  ResponseSource,
  SentimentLabel,
  UrgencyLevel,
  FallbackOptions,
} from './engine.types';

@Injectable()
export class ResponseGenerator {
  private readonly logger = new Logger(ResponseGenerator.name);

  constructor(private prisma: PrismaService) {}

  async generateResponse(
    tenantId: string,
    intent: IntentMatch,
    context: { flowId?: string; flowNodeId?: string; collectedData?: Record<string, any> },
    options: FallbackOptions = {
      tryKnowledgeBase: true,
      tryAI: false,
      suggestHuman: true,
      retryCount: 0,
      maxRetries: 3,
    },
  ): Promise<ChatResponse> {
    if (intent.type === IntentType.GREETING) {
      return this.handleGreeting(tenantId);
    }

    if (intent.type === IntentType.GOODBYE) {
      return this.handleGoodbye();
    }

    if (intent.type === IntentType.THANK_YOU) {
      return this.handleThankYou();
    }

    if (intent.type === IntentType.AFFIRMATION) {
      return this.handleAffirmation(context);
    }

    if (intent.type === IntentType.NEGATION) {
      return this.handleNegation(context);
    }

    if (intent.type === IntentType.FLOW_TRIGGER && intent.flowId) {
      return this.handleFlowTrigger(intent);
    }

    if (intent.type === IntentType.QUICK_REPLY && intent.quickReplyId) {
      return this.handleQuickReply(intent);
    }

    if (intent.type === IntentType.INTENT_MATCH && intent.intent) {
      return this.handleIntentMatch(tenantId, intent, context);
    }

    if (intent.confidence >= 0.6) {
        // For now, treat medium confidence as fallback until we implement handleLowConfidence
        return this.handleFallback(tenantId, intent, options);
    }

    return this.handleFallback(tenantId, intent, options);
  }

  private async handleGreeting(tenantId: string): Promise<ChatResponse> {
    const greetings = await this.prisma.quickReply.findMany({
      where: {
        tenantId,
        keyword: 'hola',
        isActive: true,
      },
      take: 1,
    });

    if (greetings.length > 0 && greetings[0].message) {
      return {
        message: greetings[0].message,
        source: ResponseSource.QUICK_REPLY,
        quickReplies: [
          { label: 'Solicitar turno', value: 'turno', action: 'reply' },
          { label: 'Horarios', value: 'horario', action: 'reply' },
          { label: 'Especialidades', value: 'especialidad', action: 'reply' },
          { label: 'Hablar con persona', value: 'humano', action: 'reply' },
        ],
      };
    }

    return {
      message: '¡Hola! 👋 Bienvenido a nuestra clínica. ¿En qué puedo ayudarte hoy?',
      source: ResponseSource.FALLBACK,
      quickReplies: [
        { label: 'Solicitar turno', value: 'turno', action: 'reply' },
        { label: 'Horarios', value: 'horario', action: 'reply' },
        { label: 'Especialidades', value: 'especialidad', action: 'reply' },
        { label: 'Hablar con persona', value: 'humano', action: 'reply' },
      ],
    };
  }

  private handleGoodbye(): ChatResponse {
    const responses = [
      '¡Gracias por contactarnos! Que tengas un excelente día. 👋',
      'Fue un placer ayudarte. ¡Hasta pronto!',
      '¡Nos vemos! Cualquier cosa, escríbenos cuando necesites.',
    ];
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      source: ResponseSource.FALLBACK,
    };
  }

  private handleThankYou(): ChatResponse {
    const responses = [
      '¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?',
      '¡Con gusto! ¿Necesitas algo más?',
      '¡Para eso estoy! ¿Tienes otra consulta?',
    ];
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      source: ResponseSource.FALLBACK,
    };
  }

  private handleAffirmation(context: { flowNodeId?: string }): ChatResponse {
    if (context.flowNodeId) {
      return {
        message: 'Perfecto, continuemos...',
        source: ResponseSource.FALLBACK,
      };
    }

    return {
      message: '¡Genial! ¿En qué puedo ayudarte específicamente?',
      source: ResponseSource.FALLBACK,
      quickReplies: [
        { label: 'Solicitar turno', value: 'turno', action: 'reply' },
        { label: 'Mis resultados', value: 'resultado', action: 'reply' },
        { label: 'Horarios', value: 'horario', action: 'reply' },
      ],
    };
  }

  private handleNegation(context: { flowNodeId?: string }): ChatResponse {
    if (context.flowNodeId) {
      return {
        message: 'Entiendo. ¿Hay algo más en lo que pueda ayudarte?',
        source: ResponseSource.FALLBACK,
        quickReplies: [
          { label: 'Sí, otra cosa', value: 'ayuda', action: 'reply' },
          { label: 'No, gracias', value: 'adios', action: 'reply' },
        ],
      };
    }

    return {
      message: 'No hay problema. ¿Hay algo específico en lo que pueda ayudarte?',
      source: ResponseSource.FALLBACK,
      quickReplies: [
        { label: 'Solicitar turno', value: 'turno', action: 'reply' },
        { label: 'Información', value: 'info', action: 'reply' },
        { label: 'Hablar con persona', value: 'humano', action: 'reply' },
      ],
    };
  }

  private handleFlowTrigger(intent: IntentMatch): ChatResponse {
    return {
      message: 'Perfecto, te ayudo con eso.',
      source: ResponseSource.FLOW,
      flowId: intent.flowId,
      flowNodeId: 'start',
    };
  }

  private handleQuickReply(intent: IntentMatch): ChatResponse {
    const message = intent.entities?.message as string || 'Entendido.';
    
    return {
      message,
      source: ResponseSource.QUICK_REPLY,
      quickReplies: [
        { label: 'Más información', value: 'info', action: 'reply' },
        { label: 'Hablar con persona', value: 'humano', action: 'reply' },
      ],
    };
  }

  private async handleIntentMatch(
    tenantId: string,
    intent: IntentMatch,
    context: { flowId?: string },
  ): Promise<ChatResponse> {
    const intentDef = await this.prisma.intent.findFirst({
      where: {
        tenantId,
        name: intent.intent,
        isActive: true,
      },
    });

    if (intentDef && intentDef.responses && intentDef.responses.length > 0) {
      const response = intentDef.responses[
        Math.floor(Math.random() * intentDef.responses.length)
      ];

      return {
        message: response,
        source: ResponseSource.INTENT,
        metadata: {
          intentName: intent.intent,
          confidence: intent.confidence,
        },
      };
    }

    return {
      message: 'Entendido. ¿Podrías darme más detalles?',
      source: ResponseSource.INTENT,
    };
  }

  private async handleFallback(
    tenantId: string,
    intent: IntentMatch,
    options: FallbackOptions,
  ): Promise<ChatResponse> {
    const userMessage = intent.entities?.originalText as string || '';
    
    if (options.tryKnowledgeBase && userMessage.length > 2) {
      const knowledgeResults = await this.searchKnowledgeBase(tenantId, userMessage);
      if (knowledgeResults.length > 0) {
        return this.formatKnowledgeResponse(knowledgeResults);
      }
    }

    if (options.retryCount < options.maxRetries) {
      return this.getRetryResponse(options.retryCount);
    }

    if (options.suggestHuman) {
      return this.getHumanOfferResponse();
    }

    return this.getDefaultFallback();
  }

  async searchKnowledgeBase(
    tenantId: string,
    query: string,
  ): Promise<any[]> {
    const where: any = {
      tenantId,
      isActive: true,
      status: { in: ['ACTIVE', 'REVIEW'] },
    };

    if (query && query.trim().length > 0) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { keywords: { hasSome: query.toLowerCase().split(' ') } },
        { variants: { has: { in: [query.toLowerCase()] } } },
      ];
    }

    const entries = await this.prisma.knowledgeEntry.findMany({
      where,
      take: 3,
       orderBy: [
         { views: 'desc' },
       ],
    });

    return entries;
  }

  private formatKnowledgeResponse(entries: any[]): ChatResponse {
    const firstEntry = entries[0];
    
    return {
      message: firstEntry.summary || firstEntry.content?.substring(0, 200) + '...',
      source: ResponseSource.KNOWLEDGE,
      metadata: {
        relatedEntries: entries.length,
        titles: entries.map(e => e.title),
      },
      quickReplies: [
        { label: 'Más detalles', value: 'mas_info', action: 'reply' },
        { label: 'Otra consulta', value: 'otra', action: 'reply' },
        { label: 'Hablar con persona', value: 'humano', action: 'reply' },
      ],
    };
  }

  private getRetryResponse(retryCount: number): ChatResponse {
    const responses = [
      {
        message: 'No estoy seguro de haber entendido. ¿Podrías reformular tu pregunta? 🤔',
        quickReplies: [
          { label: 'Sí, un momento', value: 'si', action: 'reply' },
          { label: 'Prefiero hablar con alguien', value: 'humano', action: 'reply' },
        ] as QuickReplyOption[],
      },
      {
        message: 'Tengo dificultades para entender. ¿Podrías darme más contexto?',
        quickReplies: [
          { label: 'Claro', value: 'si', action: 'reply' },
          { label: 'Quiero hablar con una persona', value: 'humano', action: 'reply' },
        ] as QuickReplyOption[],
      },
      {
        message: 'Parece que no puedo ayudarte con eso. ¿Te gustaría que te derive a un agente?',
        quickReplies: [
          { label: 'Sí, por favor', value: 'humano', action: 'reply' },
          { label: 'Intentaré de otra forma', value: 'si', action: 'reply' },
        ] as QuickReplyOption[],
      },
    ];

    const index = Math.min(retryCount, responses.length - 1);
    return {
      ...responses[index],
      source: ResponseSource.FALLBACK,
      shouldOfferHuman: retryCount >= 2,
    };
  }

  private getHumanOfferResponse(): ChatResponse {
    return {
      message: 'Parece que no puedo resolver tu consulta. ¿Te gustaría hablar con uno de nuestros agentes?',
      source: ResponseSource.FALLBACK,
      shouldOfferHuman: true,
      buttons: [
        { label: 'Sí, por favor', value: 'transfer', action: 'transfer' },
        { label: 'Intentaré de otra forma', value: 'retry', action: 'reply' },
      ],
    };
  }

   private getDefaultFallback(): ChatResponse {
     return {
       message: 'Disculpa, no pude entender tu consulta. ¿Podrías reformularla o hablar con un agente?',
       source: ResponseSource.FALLBACK,
       shouldOfferHuman: true,
     };
   }

   private handleLowConfidence(intent: IntentMatch, options: FallbackOptions): ChatResponse {
     // For now, just fallback to the standard fallback response
     return this.getDefaultFallback();
   }

  async generateAIResponse(
    tenantId: string,
    userMessage: string,
    context: any,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<ChatResponse> {
    return {
      message: 'Estoy analizando tu consulta...',
      source: ResponseSource.AI,
    };
  }

  generateEscalationResponse(): ChatResponse {
    return {
      message: 'Te estoy derivando a un agente. Por favor, espera un momento...',
      source: ResponseSource.HUMAN,
      shouldEscalate: true,
    };
  }

  generateHandoffOffer(frustration: number): ChatResponse {
    if (frustration > 0.5) {
      return {
        message: 'Veo que estás frustrado. ¿Te derivó a un agente para que te ayude mejor?',
        source: ResponseSource.FALLBACK,
        shouldOfferHuman: true,
        buttons: [
          { label: 'Sí, por favor', value: 'transfer', action: 'transfer' },
          { label: 'No, gracias', value: 'no', action: 'reply' },
        ],
      };
    }

    return {
      message: '¿Te gustaría hablar con una persona para resolver esto más rápido?',
      source: ResponseSource.FALLBACK,
      shouldOfferHuman: true,
      buttons: [
        { label: 'Sí', value: 'transfer', action: 'transfer' },
        { label: 'No', value: 'no', action: 'reply' },
      ],
    };
  }
}
