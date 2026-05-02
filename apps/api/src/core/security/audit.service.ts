import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'CONVERSATION_CREATE'
  | 'CONVERSATION_UPDATE'
  | 'CONVERSATION_ASSIGN'
  | 'MESSAGE_SEND'
  | 'TICKET_CREATE'
  | 'TICKET_UPDATE'
  | 'SETTINGS_UPDATE'
  | 'INTEGRATION_UPDATE'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE';

export interface AuditLogEntry {
  tenantId?: string;
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  status?: 'SUCCESS' | 'FAILED';
  error?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private buffer: AuditLogEntry[] = [];
  private flushInterval: number = 5000;
  private isProcessing: boolean = false;

  constructor(private prisma: PrismaService) {
    // Auto-flush every 5 seconds
    setInterval(() => this.flush(), this.flushInterval);
  }

  async log(entry: AuditLogEntry): Promise<void> {
    // Add to buffer for batch processing
    this.buffer.push(entry);

    // Also log to console for immediate visibility
    this.logger.log(
      `[AUDIT] ${entry.action} on ${entry.resource}${
        entry.resourceId ? ` (${entry.resourceId})` : ''
      } by ${entry.userEmail || entry.userId || 'system'} - ${
        entry.status || 'SUCCESS'
      }`
    );
  }

  async logImmediate(entry: AuditLogEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          tenantId: entry.tenantId,
          userId: entry.userId,
          action: entry.action,
          resource: entry.resource,
          resourceId: entry.resourceId,
          description: entry.description,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          metadata: entry.metadata || {},
          changes: {
            status: entry.status,
            error: entry.error,
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to write audit log: ${error.message}`);
    }
  }

  private async flush(): Promise<void> {
    if (this.isProcessing || this.buffer.length === 0) {
      return;
    }

    this.isProcessing = true;
    const entries = [...this.buffer];
    this.buffer = [];

    try {
      // Batch insert using raw SQL for performance
      for (const entry of entries) {
        await this.prisma.auditLog.create({
          data: {
            tenantId: entry.tenantId,
            userId: entry.userId,
            action: entry.action,
            resource: entry.resource,
            resourceId: entry.resourceId,
            description: entry.description,
            ipAddress: entry.ipAddress,
            userAgent: entry.userAgent,
            metadata: entry.metadata || {},
          },
        });
      }
    } catch (error) {
      this.logger.error(`Failed to flush audit logs: ${error.message}`);
      // Re-add failed entries to buffer
      this.buffer = [...entries, ...this.buffer];
    } finally {
      this.isProcessing = false;
    }
  }

  async getAuditLogs(
    tenantId: string,
    options: {
      userId?: string;
      action?: AuditAction;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<any[]> {
    const where: any = { tenantId };

    if (options.userId) where.userId = options.userId;
    if (options.action) where.action = options.action;
    if (options.resource) where.resource = options.resource;

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = options.startDate;
      if (options.endDate) where.createdAt.lte = options.endDate;
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0,
    });
  }

  async getAuditSummary(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalActions: number;
    byAction: Record<string, number>;
    byUser: Record<string, number>;
    failedActions: number;
  }> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        tenantId,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const byAction: Record<string, number> = {};
    const byUser: Record<string, number> = {};
    let failedActions = 0;

    for (const log of logs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byUser[log.userId || 'system'] = (byUser[log.userId || 'system'] || 0) + 1;
      if ((log.metadata as any)?.status === 'FAILED') {
        failedActions++;
      }
    }

    return {
      totalActions: logs.length,
      byAction,
      byUser,
      failedActions,
    };
  }
}

// ===========================================================
// AUDIT DECORATOR
// ===========================================================

import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export interface AuditOptions {
  action: AuditAction;
  resource: string;
  getResourceId?: (result: any) => string;
}

export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options);

// ===========================================================
// SECURITY EVENT LOGGING
// ===========================================================

@Injectable()
export class SecurityEventService {
  private readonly logger = new Logger(SecurityEventService.name);

  constructor(private prisma: PrismaService) {}

  async logFailedLogin(
    tenantId: string,
    email: string,
    ipAddress: string,
    reason: string
  ): Promise<void> {
    this.logger.warn(
      `[SECURITY] Failed login attempt for ${email} from ${ipAddress}: ${reason}`
    );

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: email,
        action: 'LOGIN_FAILED',
        resource: 'auth',
        description: reason,
        ipAddress,
        metadata: { email },
      },
    });
  }

  async logSuspiciousActivity(
    tenantId: string,
    userId: string,
    activity: string,
    details: Record<string, any>
  ): Promise<void> {
    this.logger.warn(
      `[SECURITY] Suspicious activity by ${userId}: ${activity}`
    );

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action: 'LOGIN_FAILED',
        resource: 'security',
        description: activity,
        metadata: details,
      },
    });
  }

  async logRateLimitExceeded(
    identifier: string,
    endpoint: string,
    ipAddress: string
  ): Promise<void> {
    this.logger.warn(
      `[SECURITY] Rate limit exceeded for ${identifier} on ${endpoint}`
    );

    await this.prisma.auditLog.create({
      data: {
        tenantId: undefined,
        userId: identifier,
        action: 'LOGIN_FAILED',
        resource: 'rate_limit',
        description: `Rate limit exceeded on ${endpoint}`,
        ipAddress,
        metadata: { endpoint },
      },
    });
  }
}