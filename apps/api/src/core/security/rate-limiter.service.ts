import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';

interface RateLimitRecord {
  key: string;
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

@Injectable()
export class RateLimiterService implements OnModuleInit {
  private readonly logger = new Logger(RateLimiterService.name);
  private memoryStore: Map<string, RateLimitRecord> = new Map();
  private readonly defaultWindowMs = 60 * 1000; // 1 minute
  private readonly defaultMaxRequests = 60;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    // Clean up old records every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async checkRateLimit(
    identifier: string,
    endpoint: string,
    maxRequests?: number,
    windowMs?: number
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: number;
  }> {
    const key = this.buildKey(identifier, endpoint);
    const max = maxRequests || this.defaultMaxRequests;
    const window = windowMs || this.defaultWindowMs;
    const now = Date.now();

    let record = this.memoryStore.get(key);

    // Create new record if doesn't exist
    if (!record || record.windowStart + window < now) {
      record = {
        key,
        count: 0,
        windowStart: now,
      };
    }

    // Check if blocked
    if (record.blockedUntil && record.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.blockedUntil,
      };
    }

    // Check if over limit
    if (record.count >= max) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.windowStart + window,
      };
    }

    // Increment count
    record.count++;
    this.memoryStore.set(key, record);

    return {
      allowed: true,
      remaining: max - record.count,
      resetAt: record.windowStart + window,
    };
  }

  async blockIdentifier(
    identifier: string,
    endpoint: string,
    durationMs: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<void> {
    const key = this.buildKey(identifier, endpoint);
    const record = this.memoryStore.get(key) || {
      key,
      count: 0,
      windowStart: Date.now(),
    };

    record.blockedUntil = Date.now() + durationMs;
    this.memoryStore.set(key, record);

    this.logger.warn(
      `Blocked ${identifier} for ${durationMs}ms on ${endpoint}`
    );
  }

  async getRateLimitStatus(
    identifier: string,
    endpoint: string
  ): Promise<{
    count: number;
    remaining: number;
    resetAt: number;
    blocked: boolean;
  }> {
    const key = this.buildKey(identifier, endpoint);
    const record = this.memoryStore.get(key);
    const now = Date.now();

    if (!record) {
      return {
        count: 0,
        remaining: this.defaultMaxRequests,
        resetAt: now + this.defaultWindowMs,
        blocked: false,
      };
    }

    return {
      count: record.count,
      remaining: Math.max(0, this.defaultMaxRequests - record.count),
      resetAt: record.windowStart + this.defaultWindowMs,
      blocked: !!record.blockedUntil && record.blockedUntil > now,
    };
  }

  private buildKey(identifier: string, endpoint: string): string {
    return `${identifier}:${endpoint}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.memoryStore.entries()) {
      if (
        record.windowStart + this.defaultWindowMs * 2 < now &&
        (!record.blockedUntil || record.blockedUntil < now)
      ) {
        this.memoryStore.delete(key);
      }
    }
  }
}

// ===========================================================
// DECORATORS FOR RATE LIMITING
// ===========================================================

import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rate_limit';

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);
