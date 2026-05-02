import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlowDto, UpdateFlowDto, DuplicateFlowDto, FlowDefinitionDto } from './flows.dto';

@Injectable()
export class FlowsService {
  constructor(private prisma: PrismaService) {}

   async create(tenantId: string, dto: CreateFlowDto, userId: string): Promise<any> {
     const flow = await this.prisma.botFlow.create({
       data: {
         tenantId,
         name: dto.name,
         description: dto.description,
         triggerKeywords: dto.triggerKeywords || [],
         triggerIntent: dto.triggerIntent,
         triggerChannel: (dto.triggerChannel || ['WEB']) as any,
         definition: this.buildDefinition(dto.definition),
         entryPoint: dto.entryPoint,
         createdById: userId,
       },
      include: {
        department: true,
      },
    });

    if (dto.departmentId) {
      return this.prisma.botFlow.update({
        where: { id: flow.id },
        data: { departmentId: dto.departmentId },
        include: { department: true },
      });
    }

    return flow;
  }

  async findAll(tenantId: string): Promise<any[]> {
    return this.prisma.botFlow.findMany({
      where: { tenantId },
      include: {
        department: true,
        _count: {
          select: {
            conversations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const flow = await this.prisma.botFlow.findFirst({
      where: { id, tenantId },
      include: {
        department: true,
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });
    if (!flow) throw new NotFoundException('Flow not found');
    return flow;
  }

  async update(tenantId: string, id: string, dto: UpdateFlowDto): Promise<any> {
    await this.findOne(tenantId, id);

    const updateData: any = {};
    
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.triggerKeywords !== undefined) updateData.triggerKeywords = dto.triggerKeywords;
    if (dto.triggerIntent !== undefined) updateData.triggerIntent = dto.triggerIntent;
     if (dto.triggerChannel !== undefined) updateData.triggerChannel = dto.triggerChannel as any;
    if (dto.definition !== undefined) updateData.definition = this.buildDefinition(dto.definition);
    if (dto.entryPoint !== undefined) updateData.entryPoint = dto.entryPoint;
    if (dto.exitPoint !== undefined) updateData.exitPoint = dto.exitPoint;
    if (dto.departmentId !== undefined) updateData.departmentId = dto.departmentId;

    return this.prisma.botFlow.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        department: true,
      },
    });
  }

  async publish(tenantId: string, id: string): Promise<any> {
    await this.findOne(tenantId, id);

    return this.prisma.botFlow.update({
      where: { id },
      data: {
        isActive: true,
        isPublished: true,
        publishedAt: new Date(),
      },
      include: {
        department: true,
      },
    });
  }

  async unpublish(tenantId: string, id: string): Promise<any> {
    await this.findOne(tenantId, id);

    return this.prisma.botFlow.update({
      where: { id },
      data: {
        isActive: false,
        isPublished: false,
      },
      include: {
        department: true,
      },
    });
  }

  async toggleActive(tenantId: string, id: string): Promise<any> {
    const flow = await this.findOne(tenantId, id);

    return this.prisma.botFlow.update({
      where: { id },
      data: {
        isActive: !flow.isActive,
      },
      include: {
        department: true,
      },
    });
  }

  async duplicate(tenantId: string, id: string, dto: DuplicateFlowDto, userId: string): Promise<any> {
    const original = await this.findOne(tenantId, id);

    return this.prisma.botFlow.create({
      data: {
        tenantId,
        name: dto.name,
        description: original.description,
        triggerKeywords: original.triggerKeywords,
        triggerIntent: original.triggerIntent,
        triggerChannel: original.triggerChannel,
        definition: original.definition,
        entryPoint: original.entryPoint,
        isActive: false,
        isPublished: false,
        version: 1,
        createdById: userId,
      },
      include: {
        department: true,
      },
    });
  }

  async remove(tenantId: string, id: string): Promise<void> {
    await this.findOne(tenantId, id);
    await this.prisma.botFlow.delete({ where: { id } });
  }

  async getStats(tenantId: string, id: string): Promise<any> {
    const flow = await this.findOne(tenantId, id);

    const stats = await this.prisma.conversation.groupBy({
      by: ['status'],
      where: { flowId: id },
      _count: true,
    });

    const totalStarts = await this.prisma.conversation.count({
      where: { flowId: id },
    });

    const completed = stats.find(s => s.status === 'CLOSED')?._count || 0;

     return {
       totalStarts,
       completions: completed,
       abandonRate: totalStarts > 0 ? (totalStarts - completed) / totalStarts : 0,
     };
  }

  async updateNodes(tenantId: string, id: string, nodes: any[], edges: any[]): Promise<any> {
    await this.findOne(tenantId, id);

    const definition = {
      nodes,
      edges,
      entryPoint: edges.find(e => e.source === 'start')?.target,
    };

    return this.prisma.botFlow.update({
      where: { id },
      data: {
        definition,
        updatedAt: new Date(),
      },
      include: {
        department: true,
      },
    });
  }

  private buildDefinition(definition?: FlowDefinitionDto): any {
    if (!definition) return {};
    
    return {
      nodes: definition.nodes || [],
      edges: definition.edges || [],
      entryPoint: definition.entryPoint,
    };
  }
}