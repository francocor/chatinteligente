import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateWhatsAppConfigDto, 
  UpdateWhatsAppConfigDto, 
  SendWhatsAppMessageDto,
  WhatsAppMessageFilterDto,
  WhatsAppEventLogFilterDto,
  WhatsAppConfigResponseDto,
  WhatsAppMessageResponseDto,
  WhatsAppEventLogResponseDto 
} from './whatsapp.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  
  constructor(private prisma: PrismaService) {}

  // ===========================================================
  // CONFIGURATION
  // ===========================================================

  async getConfig(tenantId: string): Promise<WhatsAppConfigResponseDto | null> {
    const config = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (!config) return null;

    return {
      id: config.id,
      phoneNumberId: config.phoneNumberId,
      phoneNumber: config.phoneNumber,
      businessName: config.businessName,
      isActive: config.isActive,
      isVerified: config.isVerified,
      messagesReceived: config.messagesReceived,
      messagesSent: config.messagesSent,
      createdAt: config.createdAt,
      config: config.config,
    };
  }

  async createConfig(tenantId: string, dto: CreateWhatsAppConfigDto): Promise<WhatsAppConfigResponseDto> {
    const existing = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (existing) {
      throw new HttpException('WhatsApp config already exists for this tenant', HttpStatus.CONFLICT);
    }

    const webhookVerifyToken = this.generateVerifyToken();
    const webhookSecret = this.generateWebhookSecret();

    const config = await this.prisma.whatsAppConfig.create({
      data: {
        tenantId,
        phoneNumberId: dto.phoneNumberId,
        businessAccountId: dto.businessAccountId,
        phoneNumber: dto.phoneNumber,
        businessName: dto.businessName,
        accessToken: dto.accessToken,
        webhookVerifyToken,
        webhookSecret,
        isActive: false,
        isVerified: false,
        config: (dto.config ?? {}) as Prisma.InputJsonValue,
      },
    });

    return {
      id: config.id,
      phoneNumberId: config.phoneNumberId,
      phoneNumber: config.phoneNumber,
      businessName: config.businessName,
      isActive: config.isActive,
      isVerified: config.isVerified,
      messagesReceived: config.messagesReceived,
      messagesSent: config.messagesSent,
      createdAt: config.createdAt,
      config: config.config,
    };
  }

  async updateConfig(tenantId: string, dto: UpdateWhatsAppConfigDto): Promise<WhatsAppConfigResponseDto> {
    const config = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      throw new HttpException('WhatsApp config not found', HttpStatus.NOT_FOUND);
    }

    const updateData: any = {};
    if (dto.accessToken) updateData.accessToken = dto.accessToken;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.config) {
      updateData.config = {
        ...(config.config as Prisma.JsonObject),
        ...dto.config,
      } as Prisma.InputJsonValue;
    }

    const updated = await this.prisma.whatsAppConfig.update({
      where: { tenantId },
      data: updateData,
    });

    return {
      id: updated.id,
      phoneNumberId: updated.phoneNumberId,
      phoneNumber: updated.phoneNumber,
      businessName: updated.businessName,
      isActive: updated.isActive,
      isVerified: updated.isVerified,
      messagesReceived: updated.messagesReceived,
      messagesSent: updated.messagesSent,
      createdAt: updated.createdAt,
      config: updated.config,
    };
  }

  async verifyConfig(tenantId: string): Promise<{ success: boolean; message: string }> {
    const config = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      throw new HttpException('WhatsApp config not found', HttpStatus.NOT_FOUND);
    }

    try {
      const response = await this.makeGraphAPIRequest(
        config.phoneNumberId,
        config.accessToken,
        'GET',
        '/messages'
      );

      await this.prisma.whatsAppConfig.update({
        where: { tenantId },
        data: { isVerified: true, lastSyncAt: new Date() },
      });

      return { success: true, message: 'Configuration verified successfully' };
    } catch (error) {
      this.logger.error(`Failed to verify WhatsApp config: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  // ===========================================================
  // SEND MESSAGES
  // ===========================================================

  async sendMessage(
    tenantId: string,
    conversationId: string,
    dto: SendWhatsAppMessageDto
  ): Promise<WhatsAppMessageResponseDto> {
    const config = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (!config || !config.isActive) {
      throw new HttpException('WhatsApp integration not active', HttpStatus.BAD_REQUEST);
    }

    const startTime = Date.now();

    try {
      let wamid: string;

      if (dto.templateName) {
        wamid = await this.sendTemplateMessage(
          config.phoneNumberId,
          config.accessToken,
          dto.to,
          dto.templateName,
          dto.templateParams || {}
        );
      } else {
        wamid = await this.sendMediaMessage(
          config.phoneNumberId,
          config.accessToken,
          dto.to,
          dto.type,
          dto.text,
          dto.mediaId,
          dto.mediaUrl,
          dto.mediaCaption,
          dto.interactive,
          dto.contextWamid
        );
      }

      const message = await this.prisma.whatsAppMessage.create({
        data: {
          tenantId,
          conversationId,
          wamid,
          from: config.phoneNumber,
          to: dto.to,
          direction: 'OUTBOUND',
          type: dto.type as any,
          contentType: dto.type === 'TEXT' ? 'TEXT' : 'MEDIA',
          text: dto.text,
          mediaId: dto.mediaId,
          mediaUrl: dto.mediaUrl,
          mediaMimeType: dto.mediaUrl ? 'image/jpeg' : undefined,
          interactivePayload: dto.interactive ? JSON.stringify(dto.interactive) : undefined,
          contextWamid: dto.contextWamid,
          status: 'PENDING',
          sentAt: new Date(),
        },
      });

      await this.logEvent(tenantId, 'MESSAGE_SEND', message.id, {
        to: dto.to,
        type: dto.type,
        wamid,
      }, { wamid }, 'SUCCESS', undefined, Date.now() - startTime);

      await this.prisma.whatsAppConfig.update({
        where: { tenantId },
        data: { messagesSent: { increment: 1 } },
      });

      return {
        id: message.id,
        wamid: message.wamid,
        conversationId: message.conversationId || undefined,
        from: message.from,
        to: message.to,
        type: message.type,
        text: message.text || undefined,
        status: message.status,
        sentAt: message.sentAt || undefined,
        createdAt: message.createdAt,
      };
    } catch (error) {
      await this.logEvent(tenantId, 'MESSAGE_SEND', undefined, {
        to: dto.to,
        type: dto.type,
      }, { error: error.message }, 'FAILED', error.message, Date.now() - startTime);

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ===========================================================
  // WEBHOOK HANDLING
  // ===========================================================

  async handleWebhook(tenantId: string, payload: any): Promise<{ success: boolean }> {
    const config = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      throw new HttpException('WhatsApp config not found', HttpStatus.NOT_FOUND);
    }

    await this.logEvent(tenantId, 'WEBHOOK_RECEIVED', undefined, undefined, payload, 'SUCCESS', undefined, 0);

    try {
      if (!payload.entry || !payload.entry[0]) {
        return { success: true };
      }

      const entry = payload.entry[0];
      
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.value?.messages) {
            await this.handleIncomingMessages(tenantId, config, change.value);
          }
          
          if (change.value?.statuses) {
            await this.handleStatusUpdates(tenantId, config, change.value);
          }
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Webhook processing error: ${error.message}`);
      await this.logEvent(tenantId, 'WEBHOOK_RECEIVED', undefined, undefined, payload, 'FAILED', error.message, 0);
      return { success: false };
    }
  }

  async verifyWebhook(tenantId: string, mode: string, token: string, challenge: string): Promise<{ success: boolean; challenge?: string }> {
    const config = await this.prisma.whatsAppConfig.findUnique({ where: { tenantId } });

    if (!config) {
      return { success: false };
    }

    if (mode !== 'subscribe' || token !== config.webhookVerifyToken) {
      return { success: false };
    }

    return { success: true, challenge };
  }

  // ===========================================================
  // MESSAGE RETRIEVAL
  // ===========================================================

  async getMessages(tenantId: string, filter: WhatsAppMessageFilterDto): Promise<WhatsAppMessageResponseDto[]> {
    const where: any = { tenantId };

    if (filter.conversationId) where.conversationId = filter.conversationId;
    if (filter.from) where.from = filter.from;
    if (filter.to) where.to = filter.to;
    if (filter.status) where.status = filter.status;

    const messages = await this.prisma.whatsAppMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filter.limit || 50,
      skip: filter.offset || 0,
    });

    return messages.map(m => ({
      id: m.id,
      wamid: m.wamid,
      conversationId: m.conversationId || undefined,
      from: m.from,
      to: m.to,
      type: m.type,
      text: m.text || undefined,
      status: m.status,
      sentAt: m.sentAt || undefined,
      deliveredAt: m.deliveredAt || undefined,
      readAt: m.readAt || undefined,
      createdAt: m.createdAt,
    }));
  }

  // ===========================================================
  // EVENT LOGS
  // ===========================================================

  async getEventLogs(tenantId: string, filter: WhatsAppEventLogFilterDto): Promise<WhatsAppEventLogResponseDto[]> {
    const where: any = { tenantId };

    if (filter.eventType) where.eventType = filter.eventType;
    if (filter.wamid) where.wamid = filter.wamid;
    if (filter.dateFrom || filter.dateTo) {
      where.createdAt = {};
      if (filter.dateFrom) where.createdAt.gte = new Date(filter.dateFrom);
      if (filter.dateTo) where.createdAt.lte = new Date(filter.dateTo);
    }

    const logs = await this.prisma.whatsAppEventLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filter.limit || 100,
    });

    return logs.map(log => ({
      id: log.id,
      eventType: log.eventType,
      wamid: log.wamid || undefined,
      from: log.from || undefined,
      to: log.to || undefined,
      status: log.status,
      error: log.error || undefined,
      duration: log.duration,
      createdAt: log.createdAt,
    }));
  }

  // ===========================================================
  // TEMPLATES
  // ===========================================================

  async getTemplates(tenantId: string): Promise<any[]> {
    const config = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      throw new HttpException('WhatsApp config not found', HttpStatus.NOT_FOUND);
    }

    const templates = await this.prisma.whatsAppTemplate.findMany({
      where: { tenantId },
      orderBy: { usageCount: 'desc' },
    });

    return templates;
  }

  async syncTemplates(tenantId: string): Promise<{ synced: number }> {
    const config = await this.prisma.whatsAppConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      throw new HttpException('WhatsApp config not found', HttpStatus.NOT_FOUND);
    }

    try {
      const response = await this.makeGraphAPIRequest(
        config.businessAccountId,
        config.accessToken,
        'GET',
        '/message_templates'
      );

      const templates = response.data?.data || [];
      let synced = 0;

      for (const t of templates) {
        await this.prisma.whatsAppTemplate.upsert({
          where: { tenantId_name: { tenantId, name: t.name } },
          create: {
            tenantId,
            wabaTemplateId: t.id,
            name: t.name,
            language: t.language,
            category: t.category,
            bodyContent: t.components?.find((c: any) => c.type === 'BODY')?.text || '',
            headerText: t.components?.find((c: any) => c.type === 'HEADER')?.text,
            footerText: t.components?.find((c: any) => c.type === 'FOOTER')?.text,
            buttons: JSON.stringify(t.components?.find((c: any) => c.type === 'BUTTONS')?.buttons || []),
            status: t.status,
            syncedAt: new Date(),
          },
          update: {
            language: t.language,
            category: t.category,
            bodyContent: t.components?.find((c: any) => c.type === 'BODY')?.text || '',
            headerText: t.components?.find((c: any) => c.type === 'HEADER')?.text,
            footerText: t.components?.find((c: any) => c.type === 'FOOTER')?.text,
            status: t.status,
            syncedAt: new Date(),
          },
        });
        synced++;
      }

      await this.prisma.whatsAppConfig.update({
        where: { tenantId },
        data: { lastSyncAt: new Date() },
      });

      return { synced };
    } catch (error) {
      throw new HttpException(`Failed to sync templates: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  // ===========================================================
  // PRIVATE METHODS
  // ===========================================================

  private async handleIncomingMessages(tenantId: string, config: any, value: any): Promise<void> {
    const messages = value.messages || [];
    const contacts = value.contacts || [];
    const contactMap = new Map<string, string>(
      contacts.map((c: any) => [c.wa_id, c.profile?.name]),
    );

    for (const msg of messages) {
      const startTime = Date.now();

      try {
        let conversationId: string | undefined;
        let contactId: string | undefined;

        const existingContact = await this.prisma.whatsAppContact.findFirst({
          where: { tenantId, phoneNumber: msg.from },
        });

        if (existingContact) {
          contactId = existingContact.id;
          
          const activeConversation = await this.prisma.conversation.findFirst({
            where: {
              tenantId,
              contactId,
              status: { in: ['ACTIVE', 'WAITING', 'IN_PROGRESS'] },
            },
            orderBy: { createdAt: 'desc' },
          });

          if (activeConversation) {
            conversationId = activeConversation.id;
          }
        }

        const message = await this.prisma.whatsAppMessage.create({
          data: {
            tenantId,
            conversationId,
            wamid: msg.id,
            from: msg.from,
            to: value.metadata?.displayPhoneNumber,
            direction: 'INBOUND',
            type: msg.type as any,
            contentType: msg.type === 'TEXT' ? 'TEXT' : 'MEDIA',
            text: msg.text?.body,
            mediaId: msg.image?.id || msg.video?.id || msg.audio?.id || msg.document?.id,
            mediaMimeType: msg.image?.mime_type || msg.video?.mime_type || msg.audio?.mime_type || msg.document?.mime_type,
            mediaCaption: msg.image?.caption || msg.video?.caption || msg.document?.caption,
            interactivePayload: msg.interactive ? JSON.stringify(msg.interactive) : undefined,
            status: 'DELIVERED',
            deliveredAt: new Date(),
            metadata: {
              rawMessage: msg,
              contactName: contactMap.get(msg.from) ?? null,
            } as Prisma.InputJsonValue,
          },
        });

        if (!conversationId && contactId) {
          const settings = config.config as any;

          const newConversation = await this.prisma.conversation.create({
            data: {
              tenantId,
              conversationNumber: await this.getNextConversationNumber(tenantId),
              channel: 'WHATSAPP',
              contactId,
              status: 'ACTIVE',
              priority: 'NORMAL',
              firstMessage: msg.text?.body,
              flowId: settings?.defaultFlowId,
              lastMessageAt: new Date(),
            },
          });

          conversationId = newConversation.id;

          await this.prisma.whatsAppMessage.update({
            where: { id: message.id },
            data: { conversationId },
          });
        }

        await this.prisma.whatsAppConfig.update({
          where: { tenantId },
          data: { messagesReceived: { increment: 1 } },
        });

        if (contactId) {
          await this.prisma.whatsAppContact.update({
            where: { id: contactId },
            data: { 
              messagesReceived: { increment: 1 },
              lastMessageAt: new Date(),
            },
          });
        }

        await this.logEvent(tenantId, 'MESSAGE_RECEIVED', message.id, {
          from: msg.from,
          type: msg.type,
          wamid: msg.id,
        }, { wamid: msg.id }, 'SUCCESS', undefined, Date.now() - startTime);

      } catch (error) {
        this.logger.error(`Error processing incoming message: ${error.message}`);
        await this.logEvent(tenantId, 'MESSAGE_RECEIVED', undefined, {
          from: msg.from,
          type: msg.type,
        }, { error: error.message }, 'FAILED', error.message, Date.now() - startTime);
      }
    }
  }

  private async handleStatusUpdates(tenantId: string, config: any, value: any): Promise<void> {
    const statuses = value.statuses || [];

    for (const status of statuses) {
      const startTime = Date.now();

      try {
        const message = await this.prisma.whatsAppMessage.findFirst({
          where: { tenantId, wamid: status.id },
        });

        if (!message) continue;

        const updateData: any = {};
        
        switch (status.status) {
          case 'sent':
            updateData.status = 'SENT';
            updateData.sentAt = new Date(status.timestamp * 1000);
            break;
          case 'delivered':
            updateData.status = 'DELIVERED';
            updateData.deliveredAt = new Date(status.timestamp * 1000);
            break;
          case 'read':
            updateData.status = 'READ';
            updateData.readAt = new Date(status.timestamp * 1000);
            break;
          case 'failed':
          case 'expired':
            updateData.status = 'FAILED';
            if (status.errors?.[0]) {
              updateData.error = status.errors[0].message;
              updateData.errorCode = status.errors[0].code;
            }
            break;
        }

        await this.prisma.whatsAppMessage.update({
          where: { id: message.id },
          data: updateData,
        });

        const eventType = status.status === 'failed' ? 'MESSAGE_FAILED' : 'STATUS_UPDATE';
        
        await this.logEvent(tenantId, eventType, message.id, {
          wamid: status.id,
          status: status.status,
        }, { wamid: status.id }, status.status === 'failed' ? 'FAILED' : 'SUCCESS', status.errors?.[0]?.message, Date.now() - startTime);

      } catch (error) {
        this.logger.error(`Error processing status update: ${error.message}`);
      }
    }
  }

  private async sendMediaMessage(
    phoneNumberId: string,
    accessToken: string,
    to: string,
    type: string,
    text?: string,
    mediaId?: string,
    mediaUrl?: string,
    mediaCaption?: string,
    interactive?: any,
    contextWamid?: string
  ): Promise<string> {
    const payload: any = {
      messaging_product: 'whatsapp',
      to,
    };

    if (contextWamid) {
      payload.context = { message_id: contextWamid };
    }

    if (type === 'TEXT') {
      payload.type = 'text';
      payload.text = { body: text };
    } else if (type === 'INTERACTIVE' && interactive) {
      payload.type = 'interactive';
      payload.interactive = interactive;
    } else if (['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO'].includes(type)) {
      payload.type = type.toLowerCase();
      if (mediaId) {
        payload[type.toLowerCase()] = { id: mediaId, caption: mediaCaption };
      } else if (mediaUrl) {
        payload[type.toLowerCase()] = { link: mediaUrl, caption: mediaCaption };
      }
    }

    const response = await this.makeGraphAPIRequest(
      phoneNumberId,
      accessToken,
      'POST',
      '/messages',
      payload
    );

    return response.messages?.[0]?.id;
  }

  private async sendTemplateMessage(
    phoneNumberId: string,
    accessToken: string,
    to: string,
    templateName: string,
    templateParams: Record<string, string>
  ): Promise<string> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'es_ES' },
        components: [],
      },
    };

    const template = await this.prisma.whatsAppTemplate.findFirst({
      where: { tenantId: phoneNumberId, name: templateName },
    });

    if (template?.parameters) {
      const params = JSON.parse(template.parameters as string) as any[];
      if (params.length > 0) {
        payload.template.components.push({
          type: 'body',
          parameters: params.map(p => ({
            type: p.type,
            name: p.name,
            text: templateParams[p.name] || p.example?.[0] || '',
          })),
        });
      }
    }

    const response = await this.makeGraphAPIRequest(
      phoneNumberId,
      accessToken,
      'POST',
      '/messages',
      payload
    );

    return response.messages?.[0]?.id;
  }

  private async makeGraphAPIRequest(
    phoneNumberId: string,
    accessToken: string,
    method: string,
    endpoint: string,
    body?: any
  ): Promise<any> {
    const url = `${WHATSAPP_API_URL}/${phoneNumberId}${endpoint}`;
    
    const options: any = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const error = data.error || { message: 'Unknown error' };
      throw new Error(`WhatsApp API error: ${error.message} (code: ${error.code})`);
    }

    return data;
  }

  private async logEvent(
    tenantId: string,
    eventType: string,
    messageId?: string,
    request?: any,
    response?: any,
    status?: string,
    error?: string,
    duration?: number
  ): Promise<void> {
    try {
      await this.prisma.whatsAppEventLog.create({
        data: {
          tenantId,
          eventType: eventType as any,
          wamid: request?.wamid,
          from: request?.from,
          to: request?.to,
          requestPayload: request,
          responsePayload: response,
          status: status as any,
          error,
          duration: duration || 0,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log WhatsApp event: ${error.message}`);
    }
  }

  private async getNextConversationNumber(tenantId: string): Promise<number> {
    const last = await this.prisma.conversation.findFirst({
      where: { tenantId },
      orderBy: { conversationNumber: 'desc' },
      select: { conversationNumber: true },
    });
    return (last?.conversationNumber ?? 0) + 1;
  }

  private generateVerifyToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateWebhookSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
