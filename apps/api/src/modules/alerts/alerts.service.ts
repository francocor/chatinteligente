import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertRuleDto, UpdateAlertRuleDto, AlertFilterDto, CreateAlertDto, ProcessAlertDto } from './alerts.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

   async createAlert(tenantId: string, dto: CreateAlertDto): Promise<any> {
     return this.prisma.notification.create({
       data: {
         tenant: { connect: { id: tenantId } },
         type: dto.type as any,
         urgency: dto.urgency as any,
         title: dto.title,
         message: dto.message,
         relatedConversationId: dto.relatedConversationId,
       },
     });
   }

  async findAll(tenantId: string, filter: AlertFilterDto): Promise<{ alerts: any[]; total: number }> {
    const where: any = { tenantId };

    if (filter.type) where.type = filter.type;

    const [alerts, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filter.offset || 0,
        take: filter.limit || 20,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { alerts, total };
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const alert = await this.prisma.notification.findFirst({
      where: { id, tenantId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    return alert;
  }

  async process(tenantId: string, userId: string, id: string, dto: ProcessAlertDto): Promise<any> {
    const alert = await this.findOne(tenantId, id);

    const updateData: any = {};

    if (dto.action === 'acknowledge') {
      updateData.isRead = true;
      updateData.readAt = new Date();
    } else if (dto.action === 'resolve') {
      updateData.isRead = true;
    }

    return this.prisma.notification.update({
      where: { id },
      data: updateData,
    });
  }

  async getStats(tenantId: string): Promise<any> {
    const [total, pending, acknowledged, resolved] = await Promise.all([
      this.prisma.notification.count({ where: { tenantId, isRead: false } }),
      this.prisma.notification.count({ where: { tenantId, isRead: false } }),
      this.prisma.notification.count({ where: { tenantId, isRead: true, readAt: { not: null } } }),
      this.prisma.notification.count({ where: { tenantId, isRead: true } }),
    ]);

    return {
      total,
      pending,
      acknowledged,
      resolved,
      byType: {},
      byUrgency: {},
    };
  }

  async createRule(tenantId: string, userId: string, dto: CreateAlertRuleDto): Promise<any> {
    return this.prisma.alertRule.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        type: dto.type as any,
        condition: { type: dto.conditionType },
        threshold: dto.threshold,
        action: { type: dto.actionType },
        isActive: dto.isActive ?? true,
        createdById: userId,
      },
    });
  }

  async findAllRules(tenantId: string): Promise<any[]> {
    return this.prisma.alertRule.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRule(tenantId: string, id: string, dto: UpdateAlertRuleDto): Promise<any> {
    const updateData: any = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return this.prisma.alertRule.update({
      where: { id },
      data: updateData,
    });
  }

  async checkAndTriggerRules(tenantId: string, context: any): Promise<void> {
    const rules = await this.prisma.alertRule.findMany({
      where: { tenantId, isActive: true },
    });

    for (const rule of rules) {
      const shouldTrigger = this.evaluateRule(rule, context);
      
      if (shouldTrigger) {
        await this.triggerRule(rule, tenantId, context);
      }
    }
  }

  private evaluateRule(rule: any, context: any): boolean {
    const condition = rule.condition as any;
    
    if (condition.type === 'frustration' && context.frustrationScore >= rule.threshold) {
      return true;
    }
    if (condition.type === 'response_time' && context.responseTimeMs > (rule.threshold * 60000)) {
      return true;
    }
    if (condition.type === 'unassigned_critical' && context.isCritical && !context.assignedAgentId) {
      return true;
    }
    
    return false;
  }

  private async triggerRule(rule: any, tenantId: string, context: any): Promise<void> {
    const action = rule.action as any;
    
    if (action.type === 'notify_agents') {
      await this.createAlert(tenantId, {
        type: rule.type,
        urgency: 'HIGH',
        title: `Regla activada: ${rule.name}`,
        message: `La regla "${rule.name}" ha sido activada`,
        relatedConversationId: context.conversationId,
      });
    }

    await this.prisma.alertRule.update({
      where: { id: rule.id },
      data: {
        triggerCount: { increment: 1 },
        lastTriggerAt: new Date(),
      },
    });
  }
}