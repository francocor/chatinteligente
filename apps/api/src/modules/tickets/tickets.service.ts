import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, TicketFilterDto, AddTicketNoteDto, CloseTicketDto } from './tickets.dto';
import { Priority, TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateTicketDto): Promise<any> {
    const lastTicket = await this.prisma.ticket.findFirst({
      where: { tenantId },
      orderBy: { ticketNumber: 'desc' },
    });

    const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1001;

     const ticket = await this.prisma.ticket.create({
       data: {
         tenantId,
         ticketNumber,
         channel: (dto.channel || 'WEB') as any,
         status: 'OPEN',
         priority: (dto.priority || 'NORMAL') as any,
         category: dto.category || 'other',
         subCategory: dto.subCategory,
         subject: dto.subject,
         description: dto.description,
         contactId: dto.contactId,
         assignedAgentId: dto.assignedAgentId,
         departmentId: dto.departmentId,
          // conversationId: dto.conversationId, // DISABLED: field not in Prisma schema
         firstResponseSla: this.calculateSla(15),
         resolutionSla: this.calculateSla(120),
       },
      include: {
        assignedAgent: { include: { user: true } },
        department: true,
      },
    });

    return ticket;
  }

  async findAll(tenantId: string, filter: TicketFilterDto): Promise<{ tickets: any[]; total: number }> {
    const where: any = { tenantId };

    if (filter.status) where.status = filter.status;
    if (filter.priority) where.priority = filter.priority;
    if (filter.category) where.category = filter.category;
    if (filter.assignedAgentId) where.assignedAgentId = filter.assignedAgentId;
    if (filter.departmentId) where.departmentId = filter.departmentId;

    if (filter.search) {
      where.OR = [
        { subject: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { ticketNumber: { equals: parseInt(filter.search) || undefined } },
      ];
    }

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        include: {
          assignedAgent: { include: { user: true } },
          department: true,
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: filter.offset || 0,
        take: filter.limit || 20,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return { tickets, total };
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, tenantId },
      include: {
        assignedAgent: { include: { user: true } },
        department: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(tenantId: string, id: string, dto: UpdateTicketDto): Promise<any> {
    const updateData: any = {};

    if (dto.status) updateData.status = dto.status;
    if (dto.priority) updateData.priority = dto.priority;
    if (dto.category) updateData.category = dto.category;
    if (dto.subject) updateData.subject = dto.subject;
    if (dto.description) updateData.description = dto.description;
    if (dto.assignedAgentId !== undefined) updateData.assignedAgentId = dto.assignedAgentId;
    if (dto.resolution) updateData.resolution = dto.resolution;
    if (dto.csatScore) updateData.csatScore = dto.csatScore;
    if (dto.csatFeedback) updateData.csatFeedback = dto.csatFeedback;

    if (dto.status === 'IN_PROGRESS') {
      updateData.firstResponseAt = new Date();
    }
    if (dto.status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    }
    if (dto.status === 'CLOSED') {
      updateData.closedAt = new Date();
      updateData.resolvedAt = new Date();
    }

    return this.prisma.ticket.update({
      where: { id },
      data: updateData,
      include: { assignedAgent: { include: { user: true } } },
    });
  }

  async assign(tenantId: string, id: string, agentId: string): Promise<any> {
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: {
        assignedAgentId: agentId,
        status: 'IN_PROGRESS',
        firstResponseAt: new Date(),
      },
      include: { assignedAgent: { include: { user: true } } },
    });

    return ticket;
  }

  async addNote(tenantId: string, userId: string, id: string, dto: AddTicketNoteDto): Promise<any> {
    return {
      id: `note-${Date.now()}`,
      ticketId: id,
      content: dto.content,
      createdById: userId,
      isPrivate: dto.isPrivate || false,
      createdAt: new Date(),
    };
  }

  async resolve(tenantId: string, id: string): Promise<any> {
    return this.update(tenantId, id, { status: 'RESOLVED' });
  }

  async close(tenantId: string, id: string, dto?: CloseTicketDto): Promise<any> {
    const updateData: any = {
      status: 'CLOSED',
      closedAt: new Date(),
      resolvedAt: new Date(),
    };

    if (dto?.resolution) updateData.resolution = dto.resolution;
    if (dto?.csatScore) updateData.csatScore = dto.csatScore;
    if (dto?.csatFeedback) updateData.csatFeedback = dto.csatFeedback;

    return this.prisma.ticket.update({
      where: { id },
      data: updateData,
      include: { assignedAgent: { include: { user: true } } },
    });
  }

  async getStats(tenantId: string): Promise<any> {
    const [total, open, inProgress, waiting, resolved, closed, slaBreached] = await Promise.all([
      this.prisma.ticket.count({ where: { tenantId } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'OPEN' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'WAITING' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'RESOLVED' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'CLOSED' } }),
      this.prisma.ticket.count({ where: { tenantId, slaBreached: true } }),
    ]);

    return {
      total,
      open,
      inProgress,
      waiting,
      resolved,
      closed,
      slaBreached,
      avgResponseTime: 45000,
      avgResolutionTime: 360000,
    };
  }

  private calculateSla(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}