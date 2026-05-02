import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateConversationDto, 
  UpdateConversationDto, 
  ConversationFilterDto,
  AssignConversationDto,
  EscalateConversationDto,
  AddNoteDto,
  SendMessageDto,
  CloseConversationDto
} from './conversations.dto';
import { ConversationStatus, Priority } from '@prisma/client';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

   async create(tenantId: string, dto: CreateConversationDto): Promise<any> {
      const conversation = await this.prisma.conversation.create({
        data: {
          tenantId,
          channel: (dto.channel || 'WEB') as any,
          userId: dto.userId,
          userName: dto.userName,
          userPhone: dto.userPhone,
          userEmail: dto.userEmail,
          userDevice: dto.userDevice ? JSON.stringify(dto.userDevice) : null,
          firstMessage: dto.firstMessage,
          customFields: dto.customFields || {},
          flowId: dto.flowId,
          priority: (dto.priority || 'NORMAL') as any,
          status: 'ACTIVE' as any,
        } as any,
      include: {
        messages: { orderBy: { sentAt: 'asc' } },
        assignedAgent: { include: { user: true } },
      },
    });

     if (dto.firstMessage) {
       await this.prisma.message.create({
         data: {
           conversationId: conversation.id,
           direction: 'INBOUND',
           channel: dto.channel || 'WEB',
           contentType: 'TEXT' as any,
           fromType: 'CONTACT',
           text: dto.firstMessage,
           sentAt: new Date(),
         },
      });
    }

    return conversation;
  }

  async findAll(tenantId: string, filter: ConversationFilterDto): Promise<{ conversations: any[]; total: number }> {
    const where: any = { tenantId };

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.priority) {
      where.priority = filter.priority;
    }

    if (filter.assignedAgentId) {
      where.assignedAgentId = filter.assignedAgentId;
    }

    if (filter.channel) {
      where.channel = filter.channel;
    }

    if (filter.search) {
      where.OR = [
        { userName: { contains: filter.search, mode: 'insensitive' } },
        { userEmail: { contains: filter.search, mode: 'insensitive' } },
        { firstMessage: { contains: filter.search, mode: 'insensitive' } },
        { conversationNumber: { equals: parseInt(filter.search) || undefined } },
      ];
    }

    if (filter.dateFrom || filter.dateTo) {
      where.createdAt = {};
      if (filter.dateFrom) {
        where.createdAt.gte = new Date(filter.dateFrom);
      }
      if (filter.dateTo) {
        where.createdAt.lte = new Date(filter.dateTo);
      }
    }

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          assignedAgent: { include: { user: true } },
          contact: true,
          _count: { select: { messages: true } },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: filter.offset || 0,
        take: filter.limit || 20,
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return { conversations, total };
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, tenantId },
      include: {
        messages: { orderBy: { sentAt: 'asc' } },
        assignedAgent: { include: { user: true } },
        contact: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async update(tenantId: string, id: string, dto: UpdateConversationDto): Promise<any> {
    const updateData: any = {};
    
    if (dto.status) updateData.status = dto.status;
    if (dto.subStatus) updateData.subStatus = dto.subStatus;
    if (dto.priority) updateData.priority = dto.priority;
    if (dto.tags) updateData.tags = dto.tags;
    if (dto.customFields) updateData.customFields = dto.customFields;
    if (dto.summary) updateData.summary = dto.summary;
    if (dto.csatScore) updateData.csatScore = dto.csatScore;
    if (dto.csatFeedback) updateData.csatFeedback = dto.csatFeedback;
    if (dto.assignedAgentId !== undefined) updateData.assignedAgentId = dto.assignedAgentId;
    
    if (dto.status === 'RESOLVED' || dto.status === 'CLOSED') {
      updateData.resolvedAt = new Date();
    }
    if (dto.status === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: updateData,
      include: { assignedAgent: { include: { user: true } } },
    });

    return conversation;
  }

  async assign(tenantId: string, id: string, dto: AssignConversationDto): Promise<any> {
    const agent = await this.prisma.agent.findUnique({
      where: { id: dto.agentId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: {
        assignedAgentId: dto.agentId,
        status: 'IN_PROGRESS',
        subStatus: 'assigned',
        humanAssignedAt: new Date(),
      },
      include: { assignedAgent: { include: { user: true } } },
    });

    await this.prisma.message.create({
      data: {
        conversationId: id,
        direction: 'INTERNAL',
        channel: 'WEB',
        contentType: 'TEXT',
        fromType: 'SYSTEM',
        text: `Conversación asignada a ${agent.userId}`,
        sentAt: new Date(),
      },
    });

    return conversation;
  }

  async transfer(tenantId: string, id: string, dto: AssignConversationDto): Promise<any> {
    return this.assign(tenantId, id, dto);
  }

  async escalate(tenantId: string, id: string, userId: string, dto: EscalateConversationDto): Promise<any> {
    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: {
        status: 'WAITING',
        subStatus: 'escalated',
        humanAssistanceRequested: true,
        humanAssistanceReason: dto.reason,
        humanAssistanceAt: new Date(),
      },
      include: { assignedAgent: { include: { user: true } } },
    });

    await this.prisma.message.create({
      data: {
        conversationId: id,
        direction: 'INTERNAL',
        channel: 'WEB',
        contentType: 'TEXT',
        fromType: 'SYSTEM',
        text: dto.reason ? `Conversación escalada: ${dto.reason}` : 'Conversación escalada a supervisor',
        sentAt: new Date(),
      },
    });

    return conversation;
  }

  async addNote(tenantId: string, id: string, userId: string, dto: AddNoteDto): Promise<any> {
    return {
      id: `note-${Date.now()}`,
      conversationId: id,
      content: dto.content,
      createdById: userId,
      isPrivate: dto.isPrivate || false,
      createdAt: new Date(),
    };
  }

  async sendMessage(tenantId: string, userId: string, id: string, dto: SendMessageDto): Promise<any> {
    const conversation = await this.findOne(tenantId, id);

    const message = await this.prisma.message.create({
      data: {
        conversationId: id,
        direction: 'OUTBOUND',
        channel: conversation.channel,
         contentType: (dto.contentType as any) || 'TEXT',
        fromType: 'AGENT',
        fromId: userId,
        text: dto.text,
        metadata: dto.metadata || {},
        sentAt: new Date(),
      },
    });

    await this.prisma.conversation.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        subStatus: 'in_progress',
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return message;
  }

  async resolve(tenantId: string, id: string): Promise<any> {
    return this.update(tenantId, id, { status: 'RESOLVED', summary: '', subStatus: 'resolved' });
  }

  async close(tenantId: string, id: string, dto?: CloseConversationDto): Promise<any> {
    const updateData: any = {
      status: 'CLOSED',
      subStatus: 'closed',
      closedAt: new Date(),
      resolvedAt: new Date(),
    };

    if (dto?.resolutionType) {
      updateData.resolutionType = dto.resolutionType;
    }
    if (dto?.summary) {
      updateData.summary = dto.summary;
    }
    if (dto?.csatScore) {
      updateData.csatScore = dto.csatScore;
    }
    if (dto?.csatFeedback) {
      updateData.csatFeedback = dto.csatFeedback;
    }

    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: updateData,
      include: { assignedAgent: { include: { user: true } } },
    });

    await this.prisma.message.create({
      data: {
        conversationId: id,
        direction: 'INTERNAL',
        channel: 'WEB',
        contentType: 'TEXT',
        fromType: 'SYSTEM',
        text: 'Conversación cerrada',
        sentAt: new Date(),
      },
    });

    return conversation;
  }

  async getStats(tenantId: string): Promise<any> {
    const [total, active, waiting, inProgress, resolved, closed, escalated] = await Promise.all([
      this.prisma.conversation.count({ where: { tenantId } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'WAITING' } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'RESOLVED' } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'CLOSED' } }),
      this.prisma.conversation.count({ where: { tenantId, subStatus: 'escalated' } }),
    ]);

    return {
      total,
      active,
      waiting,
      inProgress,
      resolved,
      closed,
      escalated,
      avgResponseTime: 45000,
      avgResolutionTime: 180000,
    };
  }
}