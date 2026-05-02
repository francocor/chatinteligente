import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateUserDto, 
  LoginDto, 
  RegisterEnterpriseDto, 
  AuthResponseDto, 
  UserResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  ROLE_PERMISSIONS,
  ROLE_LEVELS
} from './auth.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly REMEMBER_ME_EXPIRY = '30d';
  private readonly PASSWORD_RESET_EXPIRY_HOURS = 24;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /* =====================================================
     REGISTER ENTERPRISE (Public - Creates tenant + admin)
     ===================================================== */
  async registerEnterprise(dto: RegisterEnterpriseDto): Promise<AuthResponseDto> {
    // Check if tenant slug already exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existingTenant) {
      throw new ConflictException('El dominio/URL ya está en uso. Por favor elija otro.');
    }

    // Check if email already exists globally
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este correo electrónico.');
    }

    // Create tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.companyName,
        slug: dto.slug,
        domain: dto.domain,
        planId: 'starter', // Default plan
        status: 'ACTIVE',
      },
    });

    // Create admin role for this tenant
    const adminRole = await this.prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'admin_empresa',
        description: 'Administrador de la empresa',
        permissions: ROLE_PERMISSIONS.admin_empresa,
        isSystem: false,
      },
    });

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create admin user
    const user = await this.prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: dto.email,
        passwordHash,
        roleId: adminRole.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        isActive: true,
      },
      include: { 
        role: true, 
        tenant: true,
      },
    });

    // Create agent profile if needed
    await this.prisma.agent.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        roleId: adminRole.id,
        status: 'OFFLINE',
      },
    });

    // Generate tokens
    return this.generateAuthResponse(user);
  }

  /* =====================================================
     REGISTER USER (Admin only within tenant)
     ===================================================== */
  async registerUser(dto: CreateUserDto, tenantId: string, adminRole: string): Promise<AuthResponseDto> {
    // Check permissions
    if (!this.hasPermission(adminRole, 'users:create')) {
      throw new ForbiddenException('No tiene permisos para crear usuarios.');
    }

    // Check if user exists in tenant
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: dto.email } },
    });

    if (existing) {
      throw new ConflictException('Ya existe un usuario con este correo en esta empresa.');
    }

    // Get role
    let roleId: string;
    if (dto.roleName) {
      const role = await this.prisma.role.findFirst({
        where: { tenantId, name: dto.roleName },
      });
      
      if (!role) {
        throw new NotFoundException(`El rol '${dto.roleName}' no existe.`);
      }
      roleId = role.id;
    } else {
      // Default to asesor
      const defaultRole = await this.prisma.role.findFirst({
        where: { tenantId, name: 'asesor' },
      });
      
      if (!defaultRole) {
        const newRole = await this.prisma.role.create({
          data: {
            tenantId,
            name: 'asesor',
            description: 'Asesor de atención',
            permissions: ROLE_PERMISSIONS.asesor,
          },
        });
        roleId = newRole.id;
      } else {
        roleId = defaultRole.id;
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email: dto.email,
        passwordHash,
        roleId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        isActive: true,
      },
      include: { role: true, tenant: true },
    });

    return this.generateAuthResponse(user);
  }

  /* =====================================================
     LOGIN
     ===================================================== */
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId: dto.tenantId, email: dto.email } },
      include: { role: { include: { tenant: true } }, tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Su cuenta está deshabilitada. Contacte al administrador.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      // Log failed attempt
      await this.logAuthAttempt(user.id, 'login_failed', ipAddress, userAgent);
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Log successful login
    await this.logAuthAttempt(user.id, 'login_success', ipAddress, userAgent);

    return this.generateAuthResponse(user, dto.rememberMe);
  }

  /* =====================================================
     REFRESH TOKEN
     ===================================================== */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true, tenant: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Sesión expirada. Por favor inicie sesión nuevamente.');
      }

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new UnauthorizedException('Token de refresh inválido o expirado.');
    }
  }

  /* =====================================================
     FORGOT PASSWORD
     ===================================================== */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId: dto.tenantId, email: dto.email } },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { 
        message: 'Si el correo existe, recibirá un enlace de recuperación.' 
      };
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.PASSWORD_RESET_EXPIRY_HOURS);

    // Store reset token
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    // For now, we'll log it (in production, use actual email service)
    console.log(`Password reset token for ${user.email}: ${resetToken}`);
    
    return { 
      message: 'Si el correo existe, recibirá un enlace de recuperación.' 
    };
  }

  /* =====================================================
     RESET PASSWORD
     ===================================================== */
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!reset) {
      throw new BadRequestException('Token de recuperación inválido.');
    }

    if (reset.usedAt) {
      throw new BadRequestException('Este token ya ha sido utilizado.');
    }

    if (new Date() > reset.expiresAt) {
      throw new BadRequestException('El token ha expirado. Por favor solicite uno nuevo.');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);

    // Update password
    await this.prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash },
    });

    // Mark token as used
    await this.prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    });

    // Invalidate all sessions for security
    await this.prisma.session.deleteMany({
      where: { userId: reset.userId },
    });

    // Log password change
    await this.logAuthAttempt(reset.userId, 'password_reset', reset.ipAddress || undefined, reset.userAgent || undefined);

    return { message: 'Contraseña actualizada exitosamente.' };
  }

  /* =====================================================
     CHANGE PASSWORD (Authenticated)
     ===================================================== */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta.');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate all other sessions for security
    // (current session stays valid)
    
    return { message: 'Contraseña actualizada exitosamente.' };
  }

  /* =====================================================
     LOGOUT
     ===================================================== */
  async logout(userId: string, allDevices: boolean = false): Promise<{ message: string }> {
    if (allDevices) {
      await this.prisma.session.deleteMany({
        where: { userId },
      });
      return { message: 'Sesiones cerradas en todos los dispositivos.' };
    }

    // For JWT, we rely on client-side token removal
    // Optionally could blacklist the token here
    return { message: 'Sesión cerrada exitosamente.' };
  }

  /* =====================================================
     VALIDATE USER
     ===================================================== */
  async validateUser(userId: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        role: true, 
        tenant: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return this.mapToUserResponse(user);
  }

   /* =====================================================
      GET USER PROFILE
      ===================================================== */
   async getProfile(userId: string): Promise<UserResponseDto> {
     if (!userId || typeof userId !== 'string') {
       throw new UnauthorizedException('Usuario no autenticado');
     }

     const user = await this.prisma.user.findUnique({
       where: { id: userId },
       include: { role: true, tenant: true },
     });

     if (!user) {
       throw new NotFoundException('Usuario no encontrado.');
     }

     return this.mapToUserResponse(user);
    }

   /* =====================================================
      HELPER METHODS
      ===================================================== */
  private async generateAuthResponse(user: any, rememberMe: boolean = false): Promise<AuthResponseDto> {
    const roleName = user.role.name || 'asesor';
    const roleLevel = ROLE_LEVELS[roleName] || 0;
    const permissions = user.role.permissions || ROLE_PERMISSIONS[roleName] || [];

    const payload = { 
      sub: user.id, 
      email: user.email, 
      tenantId: user.tenantId, 
      role: roleName,
      permissions,
    };

    const expiry = rememberMe ? this.REMEMBER_ME_EXPIRY : this.ACCESS_TOKEN_EXPIRY;
    const accessToken = this.jwtService.sign(payload, { expiresIn: expiry });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.REFRESH_TOKEN_EXPIRY });

    // Calculate expiry in seconds
    const expiresIn = expiry === this.REMEMBER_ME_EXPIRY 
      ? 30 * 24 * 60 * 60 
      : 15 * 60;

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: this.mapToUserResponse(user),
    };
  }

  private mapToUserResponse(user: any): UserResponseDto {
    const roleName = user.role?.name || 'asesor';
    const roleLevel = ROLE_LEVELS[roleName] || 0;
    const permissions = user.role?.permissions || ROLE_PERMISSIONS[roleName] || [];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      role: roleName,
      roleId: user.roleId,
      roleLevel,
      tenantId: user.tenantId,
      tenantName: user.tenant?.name || '',
      tenantSlug: user.tenant?.slug,
      lastLoginAt: user.lastLoginAt,
      permissions,
    };
  }

  private hasPermission(role: string, permission: string): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    
    // Superadmin has all permissions
    if (permissions.includes('*')) {
      return true;
    }

    return permissions.includes(permission);
  }

  private async logAuthAttempt(userId: string, action: string, ipAddress?: string, userAgent?: string): Promise<void> {
    // Could be extended to store in audit log
    console.log(`[AUTH] ${action} - User: ${userId} - IP: ${ipAddress || 'unknown'}`);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
}