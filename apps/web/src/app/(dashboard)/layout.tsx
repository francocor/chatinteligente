'use client';

/* =====================================================
   DASHBOARD LAYOUT
   Plataforma de Atención Inteligente
   ===================================================== */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MessageSquare,
  Home,
  MessageCircle,
  Users,
  Headphones,
  GitBranch,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  CreditCard,
  FileBarChart,
  Building2,
  HelpCircle,
  ChevronDown,
  User,
  LogOutIcon,
  BarChartIcon,
  MessageSquareIcon,
  UsersIcon,
  SettingsIcon,
  FileText,
  Globe,
  Shield,
  Download,
} from 'lucide-react';

/* =====================================================
   NAVIGATION ITEMS
   ===================================================== */

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Vista general' },
  { name: 'Conversaciones', href: '/dashboard/conversations', icon: MessageCircle, description: 'Chat con clientes' },
  { name: 'Tickets', href: '/dashboard/tickets', icon: FileText, description: 'Sistema de tickets', badge: 3, badgeVariant: 'warning' },
  { name: 'Alertas', href: '/dashboard/alertas', icon: Bell, description: 'Alerts del sistema', badge: 2, badgeVariant: 'danger' },
  { name: 'Contactos', href: '/dashboard/contacts', icon: Users, description: 'Base de datos' },
  { name: 'Agentes', href: '/dashboard/agents', icon: Headphones, description: 'Equipo de atención' },
  { name: 'Flujos', href: '/dashboard/flows', icon: GitBranch, description: 'Bot conversacional' },
  { name: 'Conocimiento', href: '/dashboard/knowledge', icon: BookOpen, description: 'Base de conocimiento' },
  { name: 'Reportes', href: '/dashboard/reports', icon: BarChart3, description: 'Analíticas' },
  { name: 'Exportar', href: '/dashboard/exports', icon: Download, description: 'Generar reportes' },
  { name: 'Empresa', href: '/dashboard/settings', icon: Building2, description: 'Configuración' },
];

const menuItems = [
  { name: 'Perfil', href: '/dashboard/profile', icon: User },
  { name: 'Empresa', href: '/dashboard/settings/company', icon: Building2 },
  { name: 'Facturación', href: '/dashboard/settings/billing', icon: CreditCard },
  { name: 'Ayuda', href: '/dashboard/help', icon: HelpCircle },
];

/* =====================================================
   COMPONENT
   ===================================================== */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Mock user data
    setUser({
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos@clinicasanjuan.cl',
      role: 'Administrador',
      tenantName: 'Clínica San Juan',
      avatar: null,
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tenantId');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300 hidden lg:flex ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-700">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block text-sm leading-tight">
                    Atención IA
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user.tenantName}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full flex items-center justify-center shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 z-50"
          >
            {sidebarOpen ? (
              <ChevronDown className="w-3 h-3 text-neutral-500 rotate-90" />
            ) : (
              <ChevronDown className="w-3 h-3 text-neutral-500 -rotate-90" />
            )}
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                  title={item.description}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-500' : ''}`} />
                  {sidebarOpen && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 p-3">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                  !sidebarOpen && 'justify-center'
                }`}
              >
                <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
                {sidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {user.role}
                    </p>
                  </div>
                )}
              </button>

              {/* User Menu Dropdown */}
              {userMenuOpen && sidebarOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-neutral-200 dark:border-neutral-700">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-700">
            <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block text-sm leading-tight">
                  Atención IA
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-neutral-200 dark:border-neutral-700 p-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg"
            >
              <LogOutIcon className="w-5 h-5" />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Mobile logo spacer */}
            <div className="lg:hidden w-12" />

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar conversaciones, contactos, tickets..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Help */}
              <button className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}