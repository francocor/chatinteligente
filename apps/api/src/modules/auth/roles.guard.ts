import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/* =====================================================
   ROLES GUARD
   ===================================================== */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
      throw new ForbiddenException('No tiene acceso a este recurso.');
    }

     const userRole = (user.role?.name || user.role || '').toLowerCase();

     // Super admin (platform level) has all access - accept any case variant
     if (userRole === 'superadmin' || userRole === 'super_admin' || user.role?.isSystem) {
       return true;
     }

     // Check if user has any required role - accept both formats
     const hasRole = requiredRoles.some(role => {
       const r = role.toLowerCase();
       const ur = userRole.toLowerCase();
       if (r === 'superadmin') return ['superadmin', 'super_admin'].includes(ur);
       if (r === 'admin_empresa' || r === 'admin') return ['admin_empresa', 'superadmin', 'super_admin', 'admin'].includes(ur);
       if (r === 'supervisor') return ['supervisor', 'admin_empresa', 'superadmin', 'super_admin', 'admin'].includes(ur);
       if (r === 'asesor' || r === 'agent' || r === 'agente') return ['asesor', 'agent', 'agente', 'supervisor', 'admin_empresa', 'superadmin', 'super_admin', 'admin'].includes(ur);
       if (r === 'analista') return ['analista', 'asesor', 'agent', 'agente', 'supervisor', 'admin_empresa', 'superadmin', 'super_admin', 'admin'].includes(ur);
       return false;
     });

    if (!hasRole) {
      throw new ForbiddenException('No tiene el rol requerido para acceder a este recurso.');
    }

    return true;
  }
}

/* =====================================================
   PERMISSIONS GUARD
   ===================================================== */
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.permissions) {
      throw new ForbiddenException('No tiene permisos para acceder a este recurso.');
    }

    const userPermissions = user.permissions || [];

    // Super admin has all permissions
    if (userPermissions.includes('*')) {
      return true;
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission => {
      if (permission === '*') return userPermissions.includes('*');
      return userPermissions.includes(permission);
    });

    if (!hasAllPermissions) {
      throw new ForbiddenException('No tiene los permisos necesarios para esta acción.');
    }

    return true;
  }
}
