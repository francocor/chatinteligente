import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ChatContext,
  SentimentLabel,
  MessagePreview,
  ConversationMetrics,
} from './engine.types';

@Injectable()
export class ContextManager {
  private readonly logger = new Logger(ContextManager.name);
  private contextCache: Map<string, ChatContext> = new Map();

  constructor(private prisma: PrismaService) {}

  async getOrCreateContext(
    conversationId: string,
    contactId: string,
    tenantId: string,
  ): Promise<ChatContext> {
    const cached = this.contextCache.get(conversationId);
    if (cached) {
      cached.lastInteractionTime = new Date();
      return cached;
    }

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (conversation) {
      const customFields = conversation.customFields as Record<string, any> || {};

      const context: ChatContext = {
        conversationId,
        contactId,
        tenantId,
        flowId: conversation.flowId || undefined,
        flowNodeId: undefined,
        currentIntent: undefined,
        previousIntents: [],
        collectedData: customFields,
        attemptCount: 0,
        frustrationScore: 0,
        sentimentHistory: [],
        lastMessages: [],
        startTime: conversation.createdAt,
        lastInteractionTime: new Date(),
        isEscalating: false,
        shouldOfferHuman: false,
      };

      this.contextCache.set(conversationId, context);
      return context;
    }

    const context: ChatContext = {
      conversationId,
      contactId,
      tenantId,
      previousIntents: [],
      collectedData: {},
      attemptCount: 0,
      frustrationScore: 0,
      sentimentHistory: [],
      lastMessages: [],
      startTime: new Date(),
      lastInteractionTime: new Date(),
      isEscalating: false,
      shouldOfferHuman: false,
    };

    this.contextCache.set(conversationId, context);
    return context;
  }

  async updateContext(
    conversationId: string,
    updates: Partial<ChatContext>,
  ): Promise<ChatContext | null> {
    const context = this.contextCache.get(conversationId);
    if (!context) return null;

    Object.assign(context, updates);
    this.contextCache.set(conversationId, context);
    return context;
  }

  async recordMessage(
    conversationId: string,
    message: string,
    from: 'user' | 'bot',
  ): Promise<void> {
    const context = this.contextCache.get(conversationId);
    if (!context) return;

    context.lastMessages.push({
      text: message,
      from,
      timestamp: new Date(),
    });

    if (context.lastMessages.length > 10) {
      context.lastMessages = context.lastMessages.slice(-10);
    }

    context.lastInteractionTime = new Date();
    this.contextCache.set(conversationId, context);
  }

  async updateSentiment(
    conversationId: string,
    sentiment: SentimentLabel,
  ): Promise<void> {
    const context = this.contextCache.get(conversationId);
    if (!context) return;

    context.sentimentHistory.push(sentiment);

    if (context.sentimentHistory.length > 10) {
      context.sentimentHistory = context.sentimentHistory.slice(-10);
    }

    if (sentiment === SentimentLabel.NEGATIVE) {
      context.frustrationScore = Math.min(
        context.frustrationScore + 0.3,
        1.0,
      );
    } else if (sentiment === SentimentLabel.POSITIVE) {
      context.frustrationScore = Math.max(
        context.frustrationScore - 0.2,
        0,
      );
    }

    this.contextCache.set(conversationId, context);
  }

  async incrementAttempt(conversationId: string): Promise<number> {
    const context = this.contextCache.get(conversationId);
    if (!context) return 0;

    context.attemptCount++;
    this.contextCache.set(conversationId, context);
    return context.attemptCount;
  }

  async evaluateEscalation(
    conversationId: string,
    config?: { maxRetries?: number; frustrationThreshold?: number },
  ): Promise<{ shouldEscalate: boolean; shouldOfferHuman: boolean }> {
    const context = this.contextCache.get(conversationId);
    if (!context) return { shouldEscalate: false, shouldOfferHuman: false };

    const maxRetries = config?.maxRetries || 3;
    const frustrationThreshold = config?.frustrationThreshold || 0.7;

    if (context.attemptCount >= maxRetries) {
      context.isEscalating = true;
      this.contextCache.set(conversationId, context);
      return { shouldEscalate: true, shouldOfferHuman: true };
    }

    if (context.frustrationScore >= frustrationThreshold) {
      context.shouldOfferHuman = true;
      this.contextCache.set(conversationId, context);
      return { shouldEscalate: false, shouldOfferHuman: true };
    }

    return { shouldEscalate: false, shouldOfferHuman: false };
  }

  async getMetrics(conversationId: string): Promise<ConversationMetrics> {
    const context = this.contextCache.get(conversationId);
    
    const sentimentBreakdown: Record<SentimentLabel, number> = {
      [SentimentLabel.POSITIVE]: 0,
      [SentimentLabel.NEUTRAL]: 0,
      [SentimentLabel.NEGATIVE]: 0,
      [SentimentLabel.MIXED]: 0,
    };

    if (context?.sentimentHistory) {
      for (const sentiment of context.sentimentHistory) {
        sentimentBreakdown[sentiment]++;
      }
    }

    return {
      totalMessages: context?.lastMessages.length || 0,
      botMessages: context?.lastMessages.filter(m => m.from === 'bot').length || 0,
      humanMessages: context?.lastMessages.filter(m => m.from === 'user').length || 0,
      intentsMatched: context?.previousIntents.length || 0,
      flowsUsed: context?.flowId ? 1 : 0,
      fallbackCount: context?.attemptCount || 0,
      avgConfidence: 0.75,
      sentimentBreakdown,
      escalationCount: context?.isEscalating ? 1 : 0,
      resolutionTimeMs: context?.startTime
        ? new Date().getTime() - context.startTime.getTime()
        : undefined,
    };
  }

  async saveContext(conversationId: string): Promise<void> {
    const context = this.contextCache.get(conversationId);
    if (!context) return;

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        customFields: context.collectedData,
        flowId: context.flowId,
      },
    });

    this.contextCache.delete(conversationId);
  }

  async clearContext(conversationId: string): Promise<void> {
    this.contextCache.delete(conversationId);
  }

  getContext(conversationId: string): ChatContext | undefined {
    return this.contextCache.get(conversationId);
  }
}