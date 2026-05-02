import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateUserDto): Promise<any> {
    // Check if user exists in this tenant
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: dto.email } },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // Get role
    const role = await this.prisma.role.findFirst({
      where: { tenantId, name: dto.role || 'AGENT' },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hash password (using a default or provided password)
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(dto.password || 'Welcome123!', 12);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email: dto.email,
        passwordHash,
        roleId: role.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      include: { role: true },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findAll(tenantId: string): Promise<any[]> {
    return this.prisma.user.findMany({
      where: { tenantId },
      include: { role: true, agent: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, agent: true },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(tenantId: string, id: string, dto: UpdateUserDto): Promise<any> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        isActive: dto.isActive,
      },
      include: { role: true },
    });

    return user;
  }

  async remove(tenantId: string, id: string): Promise<void> {
    // Soft delete - just deactivate
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}