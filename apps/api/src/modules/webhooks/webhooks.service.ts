import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebhookDto } from './webhooks.dto';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateWebhookDto): Promise<any> {
    return this.prisma.webhook.create({
      data: {
        tenantId,
        name: dto.name,
        url: dto.url,
        events: dto.events,
        secret: dto.secret,
      },
    });
  }

  async findAll(tenantId: string): Promise<any[]> {
    return this.prisma.webhook.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const webhook = await this.prisma.webhook.findFirst({
      where: { id, tenantId },
    });
    if (!webhook) throw new NotFoundException('Webhook not found');
    return webhook;
  }

  async remove(tenantId: string, id: string): Promise<void> {
    await this.prisma.webhook.delete({ where: { id } });
  }
}