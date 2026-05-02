import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { IntentDetector } from './intent-detector';
import { FlowExecutor } from './flow-executor';
import { ContextManager } from './context-manager';
import { ResponseGenerator } from './response-generator';
import {
  ChatResponse,
  ChatContext,
  IntentMatch,
  IntentType,
  ProcessingResult,
  EngineConfig,
  FallbackOptions,
  ResponseSource,
  SentimentLabel,
  UrgencyLevel,
  ConversationMetrics,
} from './engine.types';

@Injectable()
export class ChatEngine {
  private readonly logger = new Logger(ChatEngine.name);

  private defaultConfig: EngineConfig = {
    confidenceThreshold: 0.7,
    fuzzyThreshold: 0.6,
    maxRetries: 3,
    frustrationThreshold: 0.7,
    enableSentimentAnalysis: true,
    enableUrgencyDetection: true,
    enableKnowledgeBase: true,
    enableAI: false,
  };

  constructor(
    private prisma: PrismaService,
    private intentDetector: IntentDetector,
    private flowExecutor: FlowExecutor,
    private contextManager: ContextManager,
    private responseGenerator: ResponseGenerator,
    private config: ConfigService,
  ) {}

  async processMessage(
    tenantId: string,
    conversationId: string,
    contactId: string,
    message: string,
  ): Promise<ProcessingResult> {
    const startTime = Date.now();

    const context = await this.contextManager.getOrCreateContext(
      conversationId,
      contactId,
      tenantId,
    );

    await this.contextManager.recordMessage(conversationId, message, 'user');

    const sentiment = await this.intentDetector.detectSentiment(message);
    await this.contextManager.updateSentiment(conversationId, sentiment);

    const urgency = await this.intentDetector.detectUrgency(message);
    if (urgency === UrgencyLevel.CRITICAL) {
      return this.handleUrgentSituation(
        context,
        message,
        startTime,
        sentiment,
        urgency,
      );
    }

    const flowNodeId = context.flowNodeId
      ? context.flowNodeId
      : undefined;

    const intent = await this.intentDetector.detectIntent(
      tenantId,
      message,
      {
        flowId: context.flowId,
        currentIntent: context.currentIntent,
        previousIntents: context.previousIntents,
      },
    );

    this.logger.log(
      `Intent detected: ${intent.type} (confidence: ${intent.confidence})`,
    );

    if (context.flowId && flowNodeId) {
      return this.executeFlow(
        context,
        intent,
        message,
        startTime,
      );
    }

    if (intent.type === IntentType.FLOW_TRIGGER && intent.flowId) {
      return this.startFlow(
        context,
        intent,
        message,
        startTime,
        sentiment,
      );
    }

    if (intent.type === IntentType.UNKNOWN) {
      return this.handleUnknownIntent(
        context,
        message,
        startTime,
        sentiment,
        urgency,
      );
    }

    const attemptedCount = await this.contextManager.incrementAttempt(conversationId);

    const fallbackOptions: FallbackOptions = {
      tryKnowledgeBase: this.defaultConfig.enableKnowledgeBase,
      tryAI: this.defaultConfig.enableAI,
      suggestHuman: attemptedCount >= this.defaultConfig.maxRetries,
      retryCount: attemptedCount,
      maxRetries: this.defaultConfig.maxRetries,
    };

    const response = await this.responseGenerator.generateResponse(
      tenantId,
      intent,
      context,
      fallbackOptions,
    );

    const escalation = await this.contextManager.evaluateEscalation(
      conversationId,
      {
        maxRetries: this.defaultConfig.maxRetries,
        frustrationThreshold: this.defaultConfig.frustrationThreshold,
      },
    );

    if (escalation.shouldOfferHuman || response.shouldOfferHuman) {
      response.shouldOfferHuman = true;
    }

    await this.contextManager.recordMessage(conversationId, response.message, 'bot');

    const metrics = await this.contextManager.getMetrics(conversationId);

    return {
      response,
      intent,
      context,
      metrics,
      processingTimeMs: Date.now() - startTime,
    };
  }

  private async executeFlow(
    context: ChatContext,
    intent: IntentMatch,
    message: string,
    startTime: number,
  ): Promise<ProcessingResult> {
    const result = await this.flowExecutor.execute(
      context.flowId!,
      context.flowNodeId!,
      message,
      intent,
      context,
    );

    if (result.shouldContinue && result.nextNodeId) {
      await this.contextManager.updateContext(context.conversationId, {
        flowNodeId: result.nextNodeId,
        currentIntent: intent.intent,
        collectedData: result.collectedData || context.collectedData,
      });
    }

    if (result.response.shouldEscalate) {
      await this.triggerEscalation(context);
    }

    await this.contextManager.recordMessage(
      context.conversationId,
      result.response.message,
      'bot',
    );

    const metrics = await this.contextManager.getMetrics(context.conversationId);

    return {
      response: result.response,
      intent,
      context,
      metrics,
      processingTimeMs: Date.now() - startTime,
    };
  }

  private async startFlow(
    context: ChatContext,
    intent: IntentMatch,
    message: string,
    startTime: number,
    sentiment: SentimentLabel,
  ): Promise<ProcessingResult> {
    await this.contextManager.updateContext(context.conversationId, {
      flowId: intent.flowId,
    });

    await this.prisma.botFlow.update({
      where: { id: intent.flowId },
      data: { totalStarts: { increment: 1 } },
    });

    const result = await this.flowExecutor.startFlow(intent.flowId!, context);

    if (result.shouldContinue && result.nextNodeId) {
      await this.contextManager.updateContext(context.conversationId, {
        flowNodeId: result.nextNodeId,
      });
    }

    await this.contextManager.recordMessage(
      context.conversationId,
      result.response.message,
      'bot',
    );

    const metrics = await this.contextManager.getMetrics(context.conversationId);

    return {
      response: result.response,
      intent,
      context,
      metrics,
      processingTimeMs: Date.now() - startTime,
    };
  }

  private async handleUnknownIntent(
    context: ChatContext,
    message: string,
    startTime: number,
    sentiment: SentimentLabel,
    urgency: UrgencyLevel,
  ): Promise<ProcessingResult> {
    const attemptedCount = await this.contextManager.incrementAttempt(
      context.conversationId,
    );

    const fallbackOptions: FallbackOptions = {
      tryKnowledgeBase: this.defaultConfig.enableKnowledgeBase,
      tryAI: this.defaultConfig.enableAI,
      suggestHuman: attemptedCount >= this.defaultConfig.maxRetries,
      retryCount: attemptedCount,
      maxRetries: this.defaultConfig.maxRetries,
    };

    const intent: IntentMatch = {
      type: IntentType.UNKNOWN,
      confidence: 0,
      strategy: 'exact' as any,
      entities: {},
      matchedPhrases: [],
    };

    const response = await this.responseGenerator.generateResponse(
      context.tenantId,
      intent,
      context,
      fallbackOptions,
    );

    response.sentiment = sentiment;
    response.urgency = urgency;

    const escalation = await this.contextManager.evaluateEscalation(
      context.conversationId,
      {
        maxRetries: this.defaultConfig.maxRetries,
        frustrationThreshold: this.defaultConfig.frustrationThreshold,
      },
    );

    if (escalation.shouldOfferHuman && fallbackOptions.suggestHuman) {
      response.shouldOfferHuman = true;
      response.message = this.responseGenerator.generateHandoffOffer(
        context.frustrationScore,
      ).message;
    }

    await this.contextManager.recordMessage(
      context.conversationId,
      response.message,
      'bot',
    );

    const metrics = await this.contextManager.getMetrics(context.conversationId);

    return {
      response,
      intent,
      context,
      metrics,
      processingTimeMs: Date.now() - startTime,
    };
  }

  private async handleUrgentSituation(
    context: ChatContext,
    message: string,
    startTime: number,
    sentiment: SentimentLabel,
    urgency: UrgencyLevel,
  ): Promise<ProcessingResult> {
    this.logger.warn(`URGENT SITUATION DETECTED: ${message}`);

    await this.triggerEscalation(context);

    const intent: IntentMatch = {
      type: IntentType.URGENCY,
      confidence: 1.0,
      strategy: 'exact' as any,
      entities: { urgency: urgency },
      matchedPhrases: [],
    };

    const response: ChatResponse = {
      message:
        'Entiendo que es urgente. Te estoy derivando inmediatamente a nuestro equipo de emergencias.',
      source: ResponseSource.HUMAN,
      shouldEscalate: true,
      urgency: urgency,
    };

    await this.contextManager.recordMessage(
      context.conversationId,
      response.message,
      'bot',
    );

    const metrics = await this.contextManager.getMetrics(context.conversationId);

    return {
      response,
      intent,
      context,
      metrics,
      processingTimeMs: Date.now() - startTime,
    };
  }

  private async triggerEscalation(context: ChatContext): Promise<void> {
    this.logger.log(`Triggering escalation for conversation ${context.conversationId}`);

    await this.prisma.conversation.update({
      where: { id: context.conversationId },
      data: {
        humanAssistanceRequested: true,
        humanAssistanceAt: new Date(),
        status: 'IN_PROGRESS',
      },
    });
  }

  async offerHuman(conversationId: string): Promise<ChatResponse> {
    const context = this.contextManager.getContext(conversationId);
    if (!context) {
      return {
        message: 'No puedo procesar la solicitud en este momento.',
        source: ResponseSource.FALLBACK,
      };
    }

    await this.triggerEscalation(context);

    const response = this.responseGenerator.generateEscalationResponse();

    await this.contextManager.recordMessage(conversationId, response.message, 'bot');

    return response;
  }

  async endConversation(conversationId: string): Promise<void> {
    await this.contextManager.saveContext(conversationId);

    const context = this.contextManager.getContext(conversationId);
    if (context?.flowId) {
      await this.prisma.botFlow.update({
        where: { id: context.flowId },
        data: {
          completions: { increment: 1 },
        },
      });
    }

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        resolutionType: 'AI_RESOLVED',
      },
    });

    await this.contextManager.clearContext(conversationId);
  }

  getConfig(): EngineConfig {
    return this.defaultConfig;
  }

  updateConfig(config: Partial<EngineConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }
}