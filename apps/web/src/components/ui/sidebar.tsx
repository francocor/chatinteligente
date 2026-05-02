/* =====================================================
   UI SIDEBAR COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

/* =====================================================
   SIDEBAR ITEM TYPES
   ===================================================== */
interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: number | string;
  badgeVariant?: 'primary' | 'danger' | 'warning' | 'success';
  children?: NavItem[];
}

interface NavGroup {
  id: string;
  title?: string;
  items: NavItem[];
}

interface UserMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

/* =====================================================
   SIDEBAR COMPONENT
   ===================================================== */
interface SidebarProps {
  items: NavItem[];
  groups?: NavGroup[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  logo?: React.ReactNode;
  logoCollapsed?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  userMenu?: UserMenuItem[];
  onUserMenuClick?: (itemId: string) => void;
  notificationCount?: number;
  className?: string;
}

/* ---------- Component ---------- */
export function Sidebar({
  items,
  groups,
  activeItem,
  onItemClick,
  collapsed = false,
  onCollapsedChange,
  logo,
  logoCollapsed,
  user,
  userMenu,
  onUserMenuClick,
  notificationCount,
  className,
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());
  const [expandedMobile, setExpandedMobile] = React.useState(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItem === item.id || item.children?.some(c => activeItem === c.id);
    const isExpanded = hasChildren && expandedGroups.has(item.id);

    const badgeColors = {
      primary: 'bg-primary-500 text-white',
      danger: 'bg-danger-500 text-white',
      warning: 'bg-warning-500 text-white',
      success: 'bg-success-500 text-white',
    };

    return (
      <div>
        {item.href ? (
          <Link
            href={item.href}
            onClick={() => onItemClick?.(item.id)}
            className={clsx(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
              'transition-all duration-200',
              'hover:bg-neutral-100 dark:hover:bg-neutral-800',
              isActive
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400',
              collapsed && 'justify-center'
            )}
          >
            {item.icon && (
              <span className={clsx('flex-shrink-0', isActive ? 'text-primary-500' : '')}>
                {item.icon}
              </span>
            )}
            {!collapsed && (
              <>
                <span className={clsx('flex-1', collapsed && 'hidden')}>{item.label}</span>
                {item.badge && (
                  <span className={clsx(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    badgeColors[item.badgeVariant || 'primary']
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ) : hasChildren ? (
          <div>
            <button
              onClick={() => toggleGroup(item.id)}
              className={clsx(
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                'transition-all duration-200',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400',
                collapsed && 'justify-center'
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <svg
                    className={clsx(
                      'w-4 h-4 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
            
            {/* Nested items */}
            {!collapsed && isExpanded && (
              <div className="ml-4 mt-1 space-y-1 pl-2 border-l border-neutral-200">
                {item.children?.map((child) => (
                  <NavItemComponent key={child.id} item={child} level={level + 1} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onItemClick?.(item.id)}
            className={clsx(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
              'transition-all duration-200',
              'hover:bg-neutral-100 dark:hover:bg-neutral-800',
              isActive
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400',
              collapsed && 'justify-center'
            )}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            {!collapsed && <span className="flex-1">{item.label}</span>}
          </button>
        )}
      </div>
    );
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen flex flex-col',
        'bg-white dark:bg-neutral-900',
        'border-r border-neutral-200 dark:border-neutral-800',
        'shadow-sidebar',
        collapsed ? 'w-16' : 'w-64',
        'transition-all duration-300',
        className
      )}
    >
      {/* Logo */}
      <div className={clsx(
        'flex items-center h-16 px-4',
        'border-b border-neutral-200 dark:border-neutral-800'
      )}>
        {collapsed ? (
          logoCollapsed || logo || (
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold">P</span>
            </div>
          )
        ) : (
          logo || (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="font-semibold text-neutral-900 dark:text-neutral-100">Plataforma</h1>
                <p className="text-xs text-neutral-500">Atención Inteligente</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange?.(!collapsed)}
        className={clsx(
          'absolute -right-3 top-20',
          'w-6 h-6 rounded-full',
          'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
          'flex items-center justify-center',
          'hover:bg-neutral-50 dark:hover:bg-neutral-700',
          'shadow-sm z-50'
        )}
      >
        <svg
          className={clsx('w-4 h-4 text-neutral-500 transition-transform', collapsed && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation - Main */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => (
          <NavItemComponent key={item.id} item={item} />
        ))}
      </nav>

      {/* User Section */}
      {user && (
        <div className={clsx(
          'border-t border-neutral-200 dark:border-neutral-800 p-3'
        )}>
          <div className={clsx(
            'flex items-center gap-3 p-2 rounded-lg',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer',
            collapsed && 'justify-center'
          )}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {user.name}
                </p>
                {user.role && (
                  <p className="text-xs text-neutral-500 truncate">{user.role}</p>
                )}
              </div>
            )}
          </div>

          {/* User menu dropdown */}
          {!collapsed && userMenu && (
            <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              {userMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUserMenuClick?.(item.id)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    item.danger
                      ? 'text-danger-600'
                      : 'text-neutral-600 dark:text-neutral-400'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

/* =====================================================
   MOBILE SIDEBAR
   ===================================================== */
interface MobileSidebarProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  logo?: React.ReactNode;
}

export function MobileSidebar({
  items,
  activeItem,
  onItemClick,
  isOpen,
  onClose,
  logo,
}: MobileSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        className={clsx(
          'fixed left-0 top-0 z-50 h-full w-72',
          'bg-white dark:bg-neutral-900',
          'shadow-2xl transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
          {logo || (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="font-semibold text-neutral-900 dark:text-neutral-100">Plataforma</h1>
                <p className="text-xs text-neutral-500">Atención Inteligente</p>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href || '#'}
              onClick={() => {
                onItemClick?.(item.id);
                onClose();
              }}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                'transition-colors duration-200',
                activeItem === item.id
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

/* =====================================================
   HEADER COMPONENT
   Top navigation bar
   ===================================================== */
interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  search?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  actions?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  onUserClick?: () => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export function Header({
  title,
  subtitle,
  onMenuClick,
  search,
  searchPlaceholder = 'Buscar...',
  onSearch,
  actions,
  user,
  onUserClick,
  notificationCount,
  onNotificationClick,
}: HeaderProps) {
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white px-4 shadow-sm dark:bg-neutral-900">
      {/* Menu button (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <div className="flex-1">
        {title && (
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      {search && (
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                         dark:bg-neutral-800 dark:border-neutral-700"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions}
        
        {/* Notifications */}
        {notificationCount !== undefined && (
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        )}

        {/* User */}
        {user && (
          <button
            onClick={onUserClick}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

export default Sidebar;