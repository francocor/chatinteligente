import { 
  Controller, Post, Get, Body, HttpCode, HttpStatus, 
  UseGuards, Req, Headers, BadRequestException, UnauthorizedException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { 
  CreateUserDto, 
  LoginDto, 
  RefreshTokenDto, 
  AuthResponseDto,
  RegisterEnterpriseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UserResponseDto,
  UserPayload,
} from './auth.dto';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /* =====================================================
     PUBLIC ENDPOINTS
     ===================================================== */

  @Post('register-enterprise')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nueva empresa con administrador' })
  @ApiResponse({ status: 201, description: 'Empresa registrada exitosamente' })
  @ApiResponse({ status: 409, description: 'El correo o dominio ya existe' })
  async registerEnterprise(@Body() dto: RegisterEnterpriseDto): Promise<AuthResponseDto> {
    return this.authService.registerEnterprise(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body() dto: LoginDto,
    @Headers('x-forwarded-for') ip?: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<AuthResponseDto> {
    return this.authService.login(dto, ip, userAgent);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({ status: 200, description: 'Email de recuperación enviado' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(dto);
  }

  /* =====================================================
     PROTECTED ENDPOINTS
     ===================================================== */

  @Post('register-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin_empresa', 'supervisor')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear usuario (admin requiere rol de supervisor+)' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  async registerUser(
    @Body() dto: CreateUserDto,
    @Req() req: any,
  ): Promise<AuthResponseDto> {
    const payload = req.user as UserPayload;
    return this.authService.registerUser(dto, payload.tenantId, payload.role);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  async logout(
    @Req() req: any,
    @Body() body: { allDevices?: boolean },
  ): Promise<{ message: string }> {
    const payload = req.user as UserPayload;
    return this.authService.logout(payload.sub, body?.allDevices);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada' })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const payload = req.user as UserPayload;
    return this.authService.changePassword(payload.sub, dto);
  }

   @Get('me')
   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.OK)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
   @ApiResponse({ status: 200, description: 'Perfil del usuario', type: [UserResponseDto] })
   async getProfile(@Req() req: any): Promise<UserResponseDto> {
     const user = req.user as any;
     const userId = user?.id || user?.userId || user?.sub;
     if (!userId) {
       throw new UnauthorizedException('Usuario no autenticado');
     }
     return this.authService.getProfile(userId);
   }

   @Get('permissions')
   @UseGuards(JwtAuthGuard)
   @HttpCode(HttpStatus.OK)
   @ApiBearerAuth()
   @ApiOperation({ summary: 'Obtener permisos del usuario actual' })
   @ApiResponse({ status: 200, description: 'Lista de permisos' })
   async getPermissions(@Req() req: any): Promise<{ permissions: string[] }> {
     const user = req.user as any;
     return { permissions: user.permissions || [] };
   }
}