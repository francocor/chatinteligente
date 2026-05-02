import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS = [5000, 15000, 60000];

@Injectable()
export class WhatsAppRetryService {
  private readonly logger = new Logger(WhatsAppRetryService.name);
  
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleRetryMessages(): Promise<void> {
    const pendingMessages = await this.prisma.whatsAppMessage.findMany({
      where: {
        status: { in: ['PENDING', 'FAILED'] },
        retryCount: { lt: MAX_RETRY_ATTEMPTS },
        sentAt: null,
      },
      take: 100,
    });

    for (const message of pendingMessages) {
      const now = new Date();
      const delay = RETRY_DELAYS[message.retryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
      
      if (message.retryCount > 0 && message.lastRetryAt) {
        const timeSinceLastRetry = now.getTime() - new Date(message.lastRetryAt).getTime();
        if (timeSinceLastRetry < delay) {
          continue;
        }
      }

      await this.retryMessage(message.id, message.tenantId);
    }
  }

  async retryMessage(messageId: string, tenantId: string): Promise<boolean> {
    const message = await this.prisma.whatsAppMessage.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      return false;
    }

    try {
      const config = await this.prisma.whatsAppConfig.findUnique({
        where: { tenantId },
      });

      if (!config || !config.isActive) {
        return false;
      }

      const payload: any = {
        messaging_product: 'whatsapp',
        to: message.to,
      };

      if (message.type === 'TEXT') {
        payload.type = 'text';
        payload.text = { body: message.text };
      } else if (message.interactivePayload) {
        payload.type = 'interactive';
        payload.interactive = JSON.parse(message.interactivePayload);
      } else if (message.mediaId || message.mediaUrl) {
        const type = message.type?.toLowerCase() || 'image';
        payload.type = type;
        if (message.mediaId) {
          payload[type] = { id: message.mediaId, caption: message.mediaCaption };
        } else if (message.mediaUrl) {
          payload[type] = { link: message.mediaUrl, caption: message.mediaCaption };
        }
      }

      const response = await this.retrySendMessage(
        config.phoneNumberId,
        config.accessToken,
        payload
      );

      if (response.messages?.[0]?.id) {
        await this.prisma.whatsAppMessage.update({
          where: { id: messageId },
          data: {
            wamid: response.messages[0].id,
            status: 'PENDING',
            retryCount: message.retryCount + 1,
            lastRetryAt: new Date(),
            sentAt: new Date(),
            error: null,
            errorCode: null,
          },
        });

        this.logger.log(`Successfully retried message ${messageId}`);
        return true;
      }

      throw new Error('No message ID in response');
    } catch (error) {
      const shouldRetry = error.message?.includes('timeout') || 
                       error.message?.includes('rate limit') ||
                       error.message?.includes('Too many requests');

      await this.prisma.whatsAppMessage.update({
        where: { id: messageId },
        data: {
          status: shouldRetry ? 'PENDING' : 'FAILED',
          retryCount: message.retryCount + 1,
          lastRetryAt: new Date(),
          error: error.message,
          errorCode: (error as any).code,
        },
      });

      await this.logFailedAttempt(tenantId, message, error.message);

      this.logger.warn(`Failed to retry message ${messageId}: ${error.message}`);
      return false;
    }
  }

  async retrySendMessage(phoneNumberId: string, accessToken: string, payload: any): Promise<any> {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.json();
  }

  private async logFailedAttempt(tenantId: string, message: any, error: string): Promise<void> {
    try {
      await this.prisma.whatsAppEventLog.create({
        data: {
          tenantId,
          eventType: 'MESSAGE_FAILED',
          wamid: message.wamid,
          from: message.from,
          to: message.to,
          requestPayload: { retryAttempt: message.retryCount + 1 },
          responsePayload: { error },
          status: 'FAILED',
          error,
          duration: 0,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to log retry attempt: ${err}`);
    }
  }

  async getFailedMessagesStats(tenantId: string): Promise<any> {
    const failed = await this.prisma.whatsAppMessage.groupBy({
      by: ['status'],
      where: {
        tenantId,
        status: { in: ['FAILED', 'ERROR'] },
        retryCount: { lt: MAX_RETRY_ATTEMPTS },
      },
      _count: true,
    });

    const pendingRetries = await this.prisma.whatsAppMessage.count({
      where: {
        tenantId,
        status: 'PENDING',
        retryCount: { gt: 0, lt: MAX_RETRY_ATTEMPTS },
      },
    });

    return {
      failedCount: failed.reduce((sum, g) => sum + g._count, 0),
      pendingRetries,
      maxRetries: MAX_RETRY_ATTEMPTS,
    };
  }

  async markMessageAsExhausted(tenantId: string): Promise<void> {
    await this.prisma.whatsAppMessage.updateMany({
      where: {
        tenantId,
        status: 'PENDING',
        retryCount: { gte: MAX_RETRY_ATTEMPTS },
        sentAt: null,
      },
      data: {
        status: 'FAILED',
        error: 'Max retry attempts exhausted',
      },
    });
  }
}