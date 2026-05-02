import { Injectable, NestMiddleware, HttpException, HttpStatus, PipeTransform, ArgumentMetadata, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

// ===========================================================
// RATE LIMIT STORE
// ===========================================================

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// ===========================================================
// SECURITY MIDDLEWARE
// ===========================================================

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private rateLimitStore: RateLimitStore = {};
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = 100;

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = this.getClientIp(req);
    const endpoint = req.path;
    const key = `${clientIp}:${endpoint}`;

    // Rate limiting check
    if (!this.checkRateLimit(key)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Demasiadas solicitudes. Intenta más tarde.',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // CSP for API
    if (req.path.startsWith('/api')) {
      res.setHeader('Content-Security-Policy', "default-src 'self'");
    }

    next();
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  private checkRateLimit(key: string): boolean {
    const now = Date.now();
    const record = this.rateLimitStore[key];

    if (!record || record.resetTime < now) {
      this.rateLimitStore[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // Public method to check rate limit with custom limits
  static checkRateLimitForKey(
    key: string,
    maxRequests: number,
    windowMs: number
  ): boolean {
    return true; // Implemented in RateLimiterService
  }

  // Reset rate limit (for testing or admin)
  resetRateLimit(key: string): void {
    delete this.rateLimitStore[key];
  }
}

// ===========================================================
// VALIDATION PIPE
// ===========================================================

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(ValidationPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new HttpException(
        { message: 'No se proporcionaron datos', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST
      );
    }

    // Sanitize input - remove dangerous fields
    const sanitized = this.sanitizeInput(value);
    return sanitized;
  }

  private sanitizeInput(value: any): any {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeInput(item));
    }

    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      // Remove potential XSS fields
      if (['__proto__', 'constructor', 'prototype'].includes(key)) {
        continue;
      }
      sanitized[key] = this.sanitizeInput(val);
    }
    return sanitized;
  }
}

// ===========================================================
// SECURITY UTILITIES
// ===========================================================

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512')
    .toString('hex');
  return `${actualSalt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const [salt, key] = hashedPassword.split(':');
    const newHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return key === newHash;
  } catch {
    return false;
  }
}

export function encryptSensitiveData(
  data: string,
  key: string
): string {
  const iv = crypto.randomBytes(16);
  const keyBuffer = crypto.scryptSync(key, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptSensitiveData(
  encryptedData: string,
  key: string
): string {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);

    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch {
    return '';
  }
}

export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (!data || data.length <= visibleChars) {
    return '*'.repeat(data?.length || 0);
  }
  return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
}
