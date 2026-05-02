import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto, AgentStatusDto } from './agents.dto';
import { AgentStatus } from '@prisma/client';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateAgentDto): Promise<any> {
    // Check if user exists and is in this tenant
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if agent already exists
    const existingAgent = await this.prisma.agent.findUnique({
      where: { userId: dto.userId },
    });

    if (existingAgent) {
      throw new ConflictException('Agent already exists for this user');
    }

    const agent = await this.prisma.agent.create({
      data: {
        tenantId,
        userId: dto.userId,
        skills: dto.skills || [],
        maxConcurrentConversations: dto.maxConcurrentConversations || 3,
      },
      include: { user: true },
    });

    return agent;
  }

  async findAll(tenantId: string): Promise<any[]> {
    return this.prisma.agent.findMany({
      where: { tenantId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const agent = await this.prisma.agent.findFirst({
      where: { id, tenantId },
      include: { user: true },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async updateStatus(tenantId: string, id: string, dto: AgentStatusDto): Promise<any> {
    const agent = await this.prisma.agent.update({
      where: { id },
      data: {
        status: dto.status as AgentStatus,
        lastActivityAt: new Date(),
      },
      include: { user: true },
    });

    return agent;
  }

  async findAvailable(tenantId: string): Promise<any[]> {
    return this.prisma.agent.findMany({
      where: {
        tenantId,
        status: { in: ['ONLINE', 'AWAY'] },
      },
      include: { user: true },
      orderBy: { queuePosition: 'asc' },
    });
  }

  async getQueue(tenantId: string, queueId?: string): Promise<any[]> {
    const where: any = {
      tenantId,
      status: { in: ['ACTIVE', 'WAITING'] },
    };

    if (queueId) {
      where.assignedAgentId = null;
    }

    return this.prisma.conversation.findMany({
      where,
      include: { assignedAgent: { include: { user: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}