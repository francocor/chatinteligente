import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './messages.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

   async create(conversationId: string, dto: CreateMessageDto): Promise<any> {
     const message = await this.prisma.message.create({
       data: {
         conversationId,
         direction: dto.direction,
         channel: dto.channel,
         contentType: dto.contentType as any,
         text: dto.text,
         mediaUrls: dto.mediaUrls || [],
         metadata: dto.metadata || {},
         fromType: dto.fromType,
         fromId: dto.fromId,
         sentiment: dto.sentiment as any,
         intentName: dto.intentName,
         intentConfidence: dto.intentConfidence,
         entities: dto.entities || {},
       },
     });

    // Update conversation lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async findByConversation(conversationId: string): Promise<any[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' },
    });
  }
}