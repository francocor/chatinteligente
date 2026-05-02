import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AIService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async classifyIntent(tenantId: string, text: string): Promise<{ intent: string; confidence: number; entities: any }> {
    // Check for matching keywords in flows first
    const flows = await this.prisma.botFlow.findMany({
      where: { tenantId, isActive: true, triggerKeywords: { hasSome: [text.toLowerCase()] } },
    });

    if (flows.length > 0) {
      return { intent: 'flow_trigger', confidence: 1.0, entities: { flowId: flows[0].id } };
    }

    // Check intents
    const intents = await this.prisma.intent.findMany({
      where: { tenantId, isActive: true },
    });

    for (const intent of intents) {
      const matches = intent.trainingPhrases.some((phrase) => 
        text.toLowerCase().includes(phrase.toLowerCase())
      );
      if (matches) {
        return { intent: intent.name, confidence: 0.9, entities: {} };
      }
    }

    // Fallback
    return { intent: 'unknown', confidence: 0.0, entities: {} };
  }

  async generateResponse(tenantId: string, intent: string, context: any): Promise<string> {
    const intents = await this.prisma.intent.findFirst({
      where: { tenantId, name: intent, isActive: true },
    });

    if (intents && intents.responses.length > 0) {
      return intents.responses[Math.floor(Math.random() * intents.responses.length)];
    }

    return 'Lo siento, no pude entender tu consulta. ¿Podrías reformularla?';
  }

   async searchKnowledge(tenantId: string, query: string): Promise<any[]> {
     // Simple search for now - full vector search to be implemented
     return this.prisma.knowledgeEntry.findMany({
       where: { tenantId },
       take: 5,
     });
   }
}