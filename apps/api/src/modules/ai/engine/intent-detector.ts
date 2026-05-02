import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IntentMatch,
  IntentType,
  MatchStrategy,
  SentimentLabel,
  UrgencyLevel,
} from './engine.types';

@Injectable()
export class IntentDetector {
  private readonly logger = new Logger(IntentDetector.name);

  constructor(private prisma: PrismaService) {}

  async detectIntent(
    tenantId: string,
    text: string,
    context: { flowId?: string; currentIntent?: string; previousIntents: string[] },
  ): Promise<IntentMatch> {
    const normalizedText = this.normalizeText(text);

    const greetingMatch = this.matchGreeting(normalizedText);
    if (greetingMatch) return greetingMatch;

    const goodbyeMatch = this.matchGoodbye(normalizedText);
    if (goodbyeMatch) return goodbyeMatch;

    const thankYouMatch = this.matchThankYou(normalizedText);
    if (thankYouMatch) return thankYouMatch;

    const affirmationMatch = this.matchAffirmation(normalizedText);
    if (affirmationMatch) return affirmationMatch;

    const negationMatch = this.matchNegation(normalizedText);
    if (negationMatch) return negationMatch;

    const flowTrigger = await this.findFlowTrigger(tenantId, normalizedText);
    if (flowTrigger) return flowTrigger;

    const intentMatch = await this.findIntentMatch(tenantId, normalizedText, context);
    if (intentMatch) return intentMatch;

    const keywordMatch = await this.findKeywordMatch(tenantId, normalizedText);
    if (keywordMatch) return keywordMatch;

    return {
      type: IntentType.UNKNOWN,
      confidence: 0,
      strategy: MatchStrategy.EXACT,
      entities: {},
      matchedPhrases: [],
    };
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[¿?¡!.,;:\(\)\[\]{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private matchGreeting(text: string): IntentMatch | null {
    const greetings = [
      'hola', 'buenos', 'buenas', 'buen dia', 'buenas dias',
      'buenas tardes', 'buenas noches', 'hello', 'hi', 'hey',
      'como estas', 'como está', 'que tal', 'saludos',
      ' START ', ' INICIO ', ' MENU ', ' OPCIONES ',
    ];

    for (const greeting of greetings) {
      if (text.includes(greeting)) {
        return {
          type: IntentType.GREETING,
          confidence: 1.0,
          strategy: MatchStrategy.EXACT,
          entities: {},
          matchedPhrases: [greeting],
        };
      }
    }
    return null;
  }

  private matchGoodbye(text: string): IntentMatch | null {
    const goodbyes = [
      'adios', 'adiós', 'hasta luego', 'hasta pronto', 'chau',
      'nos vemos', 'bye', 'goodbye', 'me voy', 'me tengo que ir',
      ' TERMINAR ', ' SALIR ', ' FIN ',
    ];

    for (const goodbye of goodbyes) {
      if (text.includes(goodbye)) {
        return {
          type: IntentType.GOODBYE,
          confidence: 1.0,
          strategy: MatchStrategy.EXACT,
          entities: {},
          matchedPhrases: [goodbye],
        };
      }
    }
    return null;
  }

  private matchThankYou(text: string): IntentMatch | null {
    const thanks = [
      'gracias', 'muchas gracias', 'te agradezco', 'thank you',
      'muy amable', 'perfecto', 'excelente', 'genial',
    ];

    for (const thank of thanks) {
      if (text.includes(thank)) {
        return {
          type: IntentType.THANK_YOU,
          confidence: 1.0,
          strategy: MatchStrategy.EXACT,
          entities: {},
          matchedPhrases: [thank],
        };
      }
    }
    return null;
  }

  private matchAffirmation(text: string): IntentMatch | null {
    const affirmations = [
      'si', 'sí', 'si claro', 'si por favor', 'correcto', 'exactamente',
      'afirmativo', 'de acuerdo', 'ok', 'okay', 'perfecto', 'entendido',
      ' SI ', ' YES ', ' CONFIRMAR ',
    ];

    for (const affirmation of affirmations) {
      if (text.includes(affirmation)) {
        return {
          type: IntentType.AFFIRMATION,
          confidence: 0.95,
          strategy: MatchStrategy.EXACT,
          entities: {},
          matchedPhrases: [affirmation],
        };
      }
    }
    return null;
  }

  private matchNegation(text: string): IntentMatch | null {
    const negations = [
      'no', 'no gracias', 'no quiero', 'no me interesa',
      'negativo', 'nunca', 'jamás', 'tampoco',
      ' CANCELAR ', ' NO ',
    ];

    for (const negation of negations) {
      if (text.includes(negation)) {
        return {
          type: IntentType.NEGATION,
          confidence: 0.95,
          strategy: MatchStrategy.EXACT,
          entities: {},
          matchedPhrases: [negation],
        };
      }
    }
    return null;
  }

  private async findFlowTrigger(
    tenantId: string,
    text: string,
  ): Promise<IntentMatch | null> {
    const flows = await this.prisma.botFlow.findMany({
      where: {
        tenantId,
        isActive: true,
        OR: [
          { triggerKeywords: { hasSome: text.split(' ') } },
        ],
      },
    });

    for (const flow of flows) {
      const matchedKeywords = flow.triggerKeywords.filter((kw) =>
        text.includes(this.normalizeText(kw)),
      );

      if (matchedKeywords.length > 0) {
        return {
          type: IntentType.FLOW_TRIGGER,
          flowId: flow.id,
          confidence: 0.95,
          strategy: MatchStrategy.EXACT,
          entities: { flowName: flow.name },
          matchedPhrases: matchedKeywords,
        };
      }
    }

    const partialFlows = await this.prisma.botFlow.findMany({
      where: { tenantId, isActive: true },
    });

    for (const flow of partialFlows) {
      for (const kw of flow.triggerKeywords) {
        const normalizedKw = this.normalizeText(kw);
        if (this.calculateSimilarity(text, normalizedKw) > 0.7) {
          return {
            type: IntentType.FLOW_TRIGGER,
            flowId: flow.id,
            confidence: 0.75,
            strategy: MatchStrategy.FUZZY,
            entities: { flowName: flow.name },
            matchedPhrases: [kw],
          };
        }
      }
    }

    return null;
  }

  private async findIntentMatch(
    tenantId: string,
    text: string,
    context: { flowId?: string; currentIntent?: string },
  ): Promise<IntentMatch | null> {
    const intents = await this.prisma.intent.findMany({
      where: { tenantId, isActive: true },
    });

    let bestMatch: IntentMatch | null = null;

    for (const intent of intents) {
      for (const phrase of intent.trainingPhrases) {
        const normalizedPhrase = this.normalizeText(phrase);

        if (text === normalizedPhrase) {
          return {
            type: IntentType.INTENT_MATCH,
            intent: intent.name,
            confidence: intent.confidenceThreshold || 0.85,
            strategy: MatchStrategy.EXACT,
            entities: {},
            matchedPhrases: [phrase],
          };
        }

        if (text.includes(normalizedPhrase)) {
          const confidence = 0.8 * (normalizedPhrase.length / text.length);
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = {
              type: IntentType.INTENT_MATCH,
              intent: intent.name,
              confidence,
              strategy: MatchStrategy.PARTIAL,
              entities: {},
              matchedPhrases: [phrase],
            };
          }
        }

        const similarity = this.calculateSimilarity(text, normalizedPhrase);
        if (similarity > 0.6) {
          const confidence = similarity * 0.7;
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = {
              type: IntentType.INTENT_MATCH,
              intent: intent.name,
              confidence,
              strategy: MatchStrategy.FUZZY,
              entities: {},
              matchedPhrases: [phrase],
            };
          }
        }
      }
    }

    return bestMatch;
  }

  private async findKeywordMatch(
    tenantId: string,
    text: string,
  ): Promise<IntentMatch | null> {
    const quickReplies = await this.prisma.quickReply.findMany({
      where: { tenantId, isActive: true },
    });

    for (const qr of quickReplies) {
      const keyword = this.normalizeText(qr.keyword);
      if (text.includes(keyword) || this.calculateSimilarity(text, keyword) > 0.8) {
        return {
          type: IntentType.QUICK_REPLY,
          quickReplyId: qr.id,
          confidence: 0.9,
          strategy: MatchStrategy.FUZZY,
          entities: { label: qr.label, message: qr.message },
          matchedPhrases: [qr.keyword],
        };
      }
    }

    return null;
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  async detectSentiment(text: string): Promise<SentimentLabel> {
    const negativeIndicators = [
      'no funciona', 'error', 'problema', 'fallo', 'fatal', 'terrible',
      'pesimo', 'pésimo', 'nunca', 'jamás', 'no puedo', 'no sirve',
      'enojado', 'frustrado', 'molesto', 'inaceptable', 'vergüenza',
      'horrible', 'descontento', 'no me gusta', 'peor', 'abuso',
    ];

    const positiveIndicators = [
      'gracias', 'perfecto', 'excelente', 'genial', 'maravilloso',
      'fantástico', 'bueno', 'mejor', 'amor', 'feliz', 'contento',
      'satisfecho', 'encantado', 'éxito', 'funciona', 'milagro',
    ];

    const normalizedText = this.normalizeText(text);
    let negativeScore = 0;
    let positiveScore = 0;

    for (const indicator of negativeIndicators) {
      if (normalizedText.includes(indicator)) negativeScore++;
    }

    for (const indicator of positiveIndicators) {
      if (normalizedText.includes(indicator)) positiveScore++;
    }

    if (positiveScore > negativeScore + 1) return SentimentLabel.POSITIVE;
    if (negativeScore > positiveScore + 1) return SentimentLabel.NEGATIVE;
    return SentimentLabel.NEUTRAL;
  }

  async detectUrgency(text: string): Promise<UrgencyLevel> {
    const criticalIndicators = [
      'urgencia', 'emergencia', 'grave', 'critico', 'crítico',
      'sangrando', 'no respira', 'accidente', 'muerte', 'matar',
      'suicidio', 'peligro', 'ataque', 'infarto', 'ahogo',
    ];

    const highIndicators = [
      'ahora', 'inmediato', 'urgente', 'rapido', 'rápido',
      'importante', 'no puede esperar', 'ayer', 'pronto',
      'necesito', 'urgencia', 'emergencia medica',
    ];

    const normalizedText = this.normalizeText(text);

    for (const indicator of criticalIndicators) {
      if (normalizedText.includes(indicator)) {
        return UrgencyLevel.CRITICAL;
      }
    }

    for (const indicator of highIndicators) {
      if (normalizedText.includes(indicator)) {
        return UrgencyLevel.HIGH;
      }
    }

    return UrgencyLevel.NORMAL;
  }

  async extractEntities(text: string, intentName?: string): Promise<Record<string, any>> {
    const entities: Record<string, any> = {};

    const rutPattern = /\b\d{1,2}\.\d{3}\.\d{3}-[0-9Kk]\b/;
    const rutMatch = text.match(rutPattern);
    if (rutMatch) entities.rut = rutMatch[0];

    const phonePattern = /\b(\+?56|0)\s?[9]\s?\d{4}\s?\d{4}\b/;
    const phoneMatch = text.match(phonePattern);
    if (phoneMatch) entities.phone = phoneMatch[0];

    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = text.match(emailPattern);
    if (emailMatch) entities.email = emailMatch[0];

    const datePattern = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const dateMatch = text.match(datePattern);
    if (dateMatch) entities.date = dateMatch[0];

    return entities;
  }
}
