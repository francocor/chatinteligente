'use client';

/* =====================================================
   AUTH CONTEXT
   Plataforma de Atención Inteligente
   ===================================================== */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  role: string;
  roleLevel: number;
  tenantId: string;
  tenantName: string;
  tenantSlug?: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, tenantId: string, rememberMe?: boolean) => Promise<void>;
  registerEnterprise: (data: RegisterData) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  forgotPassword: (email: string, tenantId: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasPermission: (permission: string | string[]) => boolean;
  hasRole: (role: string | string[]) => boolean;
}

interface RegisterData {
  companyName: string;
  slug: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  domain?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// URL base del backend API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect if not authenticated and trying to access protected route
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      const isAuthRoute = pathname?.startsWith('/(auth)/');
      const isPublicRoute =
        pathname === '/' ||
        pathname === '/login' ||
        pathname?.startsWith('/register') ||
        pathname?.startsWith('/forgot-password');

      if (!isAuthRoute && !isPublicRoute) {
        router.push('/login');
      }
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router]);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!token || !refreshToken) {
      clearAuth();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

       if (response.ok) {
         const user = await response.json();
         setState({
           user,
           isLoading: false,
           isAuthenticated: true,
         });
       } else if (response.status === 401 && refreshToken) {
         // Try to refresh
         const refreshed = await refreshSessionToken(refreshToken);
         if (!refreshed) {
           clearAuth();
         }
       } else {
         clearAuth();
       }
    } catch {
      clearAuth();
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tenantId');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshSessionToken = async (refreshToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
      });
      return true;
    } catch {
      return false;
    }
  };

  const login = async (
    email: string, 
    password: string, 
    tenantId: string, 
    rememberMe: boolean = false
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tenantId, rememberMe }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tenantId', tenantId);
      
       setState({
         user: data.user,
         isLoading: false,
         isAuthenticated: true,
       });

       router.replace('/dashboard/conversations');
     } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const registerEnterprise = async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_URL}/auth/register-enterprise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar empresa');
      }

      const result = await response.json();
      
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('tenantId', result.user.tenantId);
      
      setState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      });

      router.replace('/dashboard/conversations');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async (allDevices: boolean = false) => {
    const token = localStorage.getItem('accessToken');
    // Clear immediately — no waiting for backend
    clearAuth();
    router.replace('/login');
    // Notify backend in background (failures are safe to ignore)
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ allDevices }),
      });
    } catch {
      // Already logged out locally
    }
  };

  const forgotPassword = async (email: string, tenantId: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tenantId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al solicitar recuperación');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al restablecer contraseña');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  };

  const refreshSession = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      clearAuth();
      return;
    }

    await refreshSessionToken(refreshToken);
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!state.user) return false;
    if (state.user.permissions.includes('*')) return true;
    const perms = Array.isArray(permission) ? permission : [permission];
    return perms.every(p => state.user!.permissions.includes(p));
  };

   const hasRole = (role: string | string[]): boolean => {
     if (!state.user) return false;
     const userRole = state.user.role.toUpperCase();
     const roles = Array.isArray(role) ? role : [role];
     return roles.some(r => r.toUpperCase() === userRole);
   };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        registerEnterprise,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        refreshSession,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

/* =====================================================
   PROTECTED ROUTE COMPONENT
   ===================================================== */
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string | string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback = null,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check role
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  // Check permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/* =====================================================
   PERMISSION CHECK HOOK
   ===================================================== */
export function usePermission(permission: string | string[]) {
  const { hasPermission } = useAuth();
  
  if (typeof permission === 'string') {
    return hasPermission(permission);
  }
  
  return permission.some(p => hasPermission(p));
}

/* =====================================================
   ROLE CHECK HOOK
   ===================================================== */
export function useRoleCheck(role: string | string[]) {
  const { hasRole } = useAuth();
  return hasRole(role);
}
