import { 
  IsEmail, IsString, MinLength, IsOptional, IsUUID, IsEnum, 
  IsNotEmpty, Matches, MaxLength, IsBoolean, IsNumber, IsArray 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

/* =====================================================
   LOGIN DTO
   ===================================================== */
export class LoginDto {
  @ApiProperty({ example: 'admin@clinic.com', description: 'Correo electrónico institucional' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'Contraseña segura' })
  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID de la empresa/tenant' })
  @IsUUID('4', { message: 'ID de empresa inválido' })
  @IsNotEmpty({ message: 'El ID de empresa es requerido' })
  tenantId: string;

  @ApiPropertyOptional({ description: 'Recordar sesión por 30 días' })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

/* =====================================================
   REGISTER DTO (Enterprise Admin)
   ===================================================== */
export class RegisterEnterpriseDto {
  @ApiProperty({ example: 'Clínica San Juan' })
  @IsString({ message: 'El nombre de la empresa es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  companyName: string;

  @ApiProperty({ example: 'clinica-san-juan' })
  @IsString()
  @MinLength(3, { message: 'El slug debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El slug no puede exceder 50 caracteres' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Solo letras minúsculas, números y guiones' })
  slug: string;

  @ApiProperty({ example: 'admin@clinic.com' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Formato de correo inválido' })
  email: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72, { message: 'La contraseña no puede exceder 72 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { 
    message: 'Debe tener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial' 
  })
  password: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ example: 'clinica.com' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;
}

/* =====================================================
   REGISTER USER DTO (Within Tenant - Admin only)
   ===================================================== */
export class CreateUserDto {
  @ApiProperty({ example: 'asesor@clinic.com' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'María' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'García' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'ASESOR' })
  @IsOptional()
  @IsString()
  roleName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;
}

/* =====================================================
   PASSWORD RESET REQUEST DTO
   ===================================================== */
export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@clinic.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID('4')
  @IsNotEmpty()
  tenantId: string;
}

/* =====================================================
   PASSWORD RESET CONFIRM DTO
   ===================================================== */
export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de recuperación' })
  @IsString()
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;

  @ApiProperty({ example: 'NewP@ss123' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { 
    message: 'Debe tener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial' 
  })
  newPassword: string;
}

/* =====================================================
   CHANGE PASSWORD DTO
   ===================================================== */
export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  currentPassword: string;

  @ApiProperty({ example: 'NewSecureP@ss123' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { 
    message: 'La nueva contraseña debe tener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial' 
  })
  newPassword: string;
}

/* =====================================================
   REFRESH TOKEN DTO
   ===================================================== */
export class RefreshTokenDto {
  @ApiProperty({ description: 'Token de refresh' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

/* =====================================================
   LOGOUT DTO
   ===================================================== */
export class LogoutDto {
  @ApiPropertyOptional({ description: 'Invalidar todas las sesiones' })
  @IsOptional()
  @IsBoolean()
  allDevices?: boolean;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;
  
  @ApiProperty()
  refreshToken: string;
  
  @ApiProperty()
  expiresIn: number;
  
  @ApiProperty()
  user: any; // UserResponseDto - avoid circular ref
}

/* =====================================================
   USER RESPONSE DTO
   ===================================================== */
export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty({ enum: ['superadmin', 'admin_empresa', 'supervisor', 'asesor', 'analista'] })
  roleLevel: number;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  tenantName: string;

  @ApiPropertyOptional()
  tenantSlug?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiProperty()
  permissions: string[];
}

export class AuthErrorDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiPropertyOptional()
  validationErrors?: any[]; // ValidationErrorDto - avoid ref issue
}

/* =====================================================
   ROLE DTO
   ===================================================== */
export class RoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: [String] })
  permissions: string[];

  @ApiProperty()
  level: number;

  @ApiProperty()
  isSystem: boolean;
}

/* =====================================================
   ENUMS
   ===================================================== */
export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN_EMPRESA = 'admin_empresa',
  SUPERVISOR = 'supervisor',
  ASESOR = 'asesor',
  ANALISTA = 'analista',
}

/* =====================================================
   PERMISSIONS CONSTANTS
   ===================================================== */
export const ROLE_PERMISSIONS = {
  superadmin: [
    '*', // All permissions
  ],
  admin_empresa: [
    'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage',
    'roles:read', 'roles:create', 'roles:update', 'roles:assign',
    'conversations:read', 'conversations:write', 'conversations:assign', 'conversations:close',
    'messages:read', 'messages:write', 'messages:send',
    'agents:read', 'agents:create', 'agents:update', 'agents:delete', 'agents:manage',
    'flows:read', 'flows:create', 'flows:update', 'flows:publish', 'flows:delete',
    'analytics:read', 'analytics:export',
    'settings:read', 'settings:write', 'settings:branding', 'settings:channels',
    'alerts:read', 'alerts:create', 'alerts:manage',
    'billing:read', 'billing:manage',
    'reports:read', 'reports:export',
  ],
  supervisor: [
    'users:read',
    'conversations:read', 'conversations:write', 'conversations:assign', 'conversations:close',
    'messages:read', 'messages:write',
    'agents:read', 'agents:update',
    'flows:read',
    'analytics:read', 'analytics:export',
    'alerts:read', 'alerts:manage',
  ],
  asesor: [
    'conversations:read', 'conversations:write',
    'messages:read', 'messages:write',
    'agents:read',
  ],
  analista: [
    'analytics:read', 'analytics:export',
    'reports:read', 'reports:export',
  ],
};

/* =====================================================
   ROLE LEVELS (Higher = more privileges)
   ===================================================== */
export const ROLE_LEVELS = {
  superadmin: 100,
  admin_empresa: 50,
  supervisor: 30,
  asesor: 20,
  analista: 10,
};

/* =====================================================
   USER PAYLOAD
   ===================================================== */
export class UserPayload {
  @ApiProperty()
  sub: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty({ enum: ['superadmin', 'admin_empresa', 'supervisor', 'asesor', 'analista'] })
  role: string;
}