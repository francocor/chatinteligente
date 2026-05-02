import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(
    tenantId: string,
    conversationId: string,
    text: string,
    userId: string,
  ): Promise<any> {
    // Verify conversation belongs to tenant
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        direction: 'OUTBOUND',
        contentType: 'TEXT',
        text,
        fromType: 'AGENT',
        fromId: userId,
      },
    });

    // Update conversation
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async updateAgentStatus(tenantId: string, userId: string, status: string): Promise<void> {
    await this.prisma.agent.updateMany({
      where: { tenantId, userId },
      data: { status: status as any, lastActivityAt: new Date() },
    });
  }
}