import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto } from './tenants.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTenantDto): Promise<any> {
    // Check if slug is available
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Tenant slug already exists');
    }

    // Create tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        domain: dto.domain,
        planId: dto.planId || 'basic',
        settings: dto.settings || {},
      },
    });

    // Create default role for the tenant
    await this.prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'ADMIN',
        description: 'Administrator role',
        permissions: [
          'conversations:read', 'conversations:write',
          'agents:read', 'agents:create', 'agents:update', 'agents:delete',
          'flows:read', 'flows:create', 'flows:update', 'flows:publish', 'flows:delete',
          'analytics:read', 'analytics:export',
          'settings:branding', 'settings:channels',
        ],
      },
    });

    await this.prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'SUPERVISOR',
        description: 'Supervisor role',
        permissions: [
          'conversations:read', 'conversations:write', 'conversations:assign',
          'agents:read',
          'flows:read', 'flows:update',
          'analytics:read', 'analytics:export',
        ],
      },
    });

    await this.prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'AGENT',
        description: 'Agent role',
        permissions: [
          'conversations:read', 'conversations:write',
          'agents:read',
          'analytics:read',
        ],
      },
    });

    return tenant;
  }

  async findAll(): Promise<any[]> {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto): Promise<any> {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        name: dto.name,
        domain: dto.domain,
        settings: dto.settings,
        logo: dto.logo,
        primaryColor: dto.primaryColor,
      },
    });

    return tenant;
  }

  async remove(id: string): Promise<void> {
    // Soft delete - just suspend
    await this.prisma.tenant.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });
  }

  async getBySlug(slug: string): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }
}