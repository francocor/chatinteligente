/* =====================================================
   UI BADGE COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* ---------- Types ---------- */
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type BadgeDot = 'none' | 'left' | 'right';

/* ---------- Interface ---------- */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: BadgeDot;
  dotColor?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

/* ---------- Size Config ---------- */
const sizes: Record<BadgeSize, { px: string; py: string; text: string; gap: string; dot: string }> = {
  xs: { px: 'px-2 py-0.5', text: 'text-[10px]', gap: 'gap-1', dot: 'w-1 h-1' },
  sm: { px: 'px-2.5 py-0.5', text: 'text-xs', gap: 'gap-1.5', dot: 'w-1.5 h-1.5' },
  md: { px: 'px-2.5 py-1', text: 'text-xs', gap: 'gap-1.5', dot: 'w-1.5 h-1.5' },
  lg: { px: 'px-3 py-1.5', text: 'text-sm', gap: 'gap-2', dot: 'w-2 h-2' },
};

/* ---------- Variant Styles ---------- */
const variants: Record<BadgeVariant, { bg: string; text: string; dot: string; border?: string }> = {
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900/30',
    text: 'text-primary-700 dark:text-primary-300',
    dot: 'bg-primary-500',
  },
  secondary: {
    bg: 'bg-secondary-100 dark:bg-secondary-900/30',
    text: 'text-secondary-700 dark:text-secondary-300',
    dot: 'bg-secondary-500',
  },
  success: {
    bg: 'bg-success-100 dark:bg-success-900/30',
    text: 'text-success-700 dark:text-success-300',
    dot: 'bg-success-500',
  },
  warning: {
    bg: 'bg-warning-100 dark:bg-warning-900/30',
    text: 'text-warning-700 dark:text-warning-300',
    dot: 'bg-warning-500',
  },
  danger: {
    bg: 'bg-danger-100 dark:bg-danger-900/30',
    text: 'text-danger-700 dark:text-danger-300',
    dot: 'bg-danger-500',
  },
  info: {
    bg: 'bg-info-100 dark:bg-info-900/30',
    text: 'text-info-700 dark:text-info-300',
    dot: 'bg-info-500',
  },
  neutral: {
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    text: 'text-neutral-700 dark:text-neutral-300',
    dot: 'bg-neutral-500',
  },
  outline: {
    bg: 'bg-transparent border',
    text: 'text-neutral-600 dark:text-neutral-400',
    dot: 'bg-neutral-400',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
};

/* ---------- Dot Colors ---------- */
const dotColors: Record<string, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  neutral: 'bg-neutral-400',
};

/* ---------- Component ---------- */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  variant = 'neutral',
  size = 'md',
  dot = 'none',
  dotColor,
  icon,
  removable = false,
  onRemove,
  className,
  children,
  ...props
}, ref) => {
  const sizeConfig = sizes[size];
  const variantConfig = variants[variant];
  const finalDotColor = dotColor ? dotColors[dotColor] : variantConfig.dot;

  return (
    <span
      ref={ref}
      className={twMerge(
        clsx(
          // Base
          'inline-flex items-center rounded-full font-medium transition-all duration-200',
          
          // Size
          sizeConfig.px,
          sizeConfig.text,
          
          // Variant
          variantConfig.bg,
          variantConfig.text,
          variantConfig.border,
          
          className
        )
      )}
      {...props}
    >
      {/* Left Dot */}
      {dot === 'left' && (
        <span className={clsx(sizeConfig.dot, 'rounded-full', finalDotColor)} />
      )}
      
      {/* Icon */}
      {icon && (
        <span className={clsx(sizeConfig.gap, 'flex-shrink-0')}>{icon}</span>
      )}
      
      {/* Content */}
      {children && (
        <span className={clsx(icon && sizeConfig.gap)}>{children}</span>
      )}
      
      {/* Right Dot */}
      {dot === 'right' && (
        <span className={clsx(sizeConfig.dot, 'rounded-full', finalDotColor)} />
      )}
      
      {/* Removable Button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={clsx(
            sizeConfig.gap,
            'ml-1 flex-shrink-0 rounded-full p-0.5',
            'hover:bg-black/10 dark:hover:bg-white/10',
            'focus:outline-none focus:ring-1 focus:ring-current'
          )}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

/* =====================================================
   STATUS BADGE COMPONENT
   Online/Offline/Away/Busy indicators
   ===================================================== */
type StatusType = 'online' | 'offline' | 'away' | 'busy' | 'last-seen';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  pulse?: boolean;
}

const statusConfig: Record<StatusType, { bg: string; label: string; pulseColor?: string }> = {
  online: {
    bg: 'bg-success-500',
    label: 'En línea',
  },
  offline: {
    bg: 'bg-neutral-400',
    label: 'Desconectado',
  },
  away: {
    bg: 'bg-warning-500',
    label: 'Ausente',
  },
  busy: {
    bg: 'bg-danger-500',
    label: 'Ocupado',
  },
  'last-seen': {
    bg: 'bg-neutral-300',
    label: 'Últ vez',
  },
};

const statusSizes = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

export function StatusBadge({ status, size = 'md', showLabel = false, label, pulse = false }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = statusSizes[size];

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex">
        <span className={clsx(sizeClass, 'rounded-full', config.bg)} />
        {pulse && (
          <span className={clsx(
            sizeClass,
            'absolute rounded-full animate-ping',
            config.pulseColor || config.bg.replace('bg-', 'bg-opacity-')
          )} />
        )}
      </span>
      {showLabel && (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {label || config.label}
        </span>
      )}
    </div>
  );
}

/* =====================================================
   COUNT BADGE COMPONENT
   For notifications, unread counts
   ===================================================== */
interface CountBadgeProps {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'danger' | 'warning' | 'success';
}

const countSizes = {
  sm: 'min-w-[1.25rem] h-5 px-1.5 text-[10px]',
  md: 'min-w-[1.5rem] h-5.5 px-2 text-xs',
  lg: 'min-w-[1.75rem] h-6 px-2.5 text-sm',
};

const countColors = {
  primary: 'bg-primary-500 text-white',
  danger: 'bg-danger-500 text-white',
  warning: 'bg-warning-500 text-white',
  success: 'bg-success-500 text-white',
};

export function CountBadge({ count, max = 99, size = 'md', color = 'danger' }: CountBadgeProps) {
  if (count <= 0) return null;
  
  const displayCount = count > max ? `${max}+` : count;
  const colorClass = countColors[color];
  const sizeClass = countSizes[size];

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-semibold',
        colorClass,
        sizeClass
      )}
    >
      {displayCount}
    </span>
  );
}

/* =====================================================
   TAG COMPONENT
   For showing text tags
   ===================================================== */
interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  onRemove?: () => void;
}

export function Tag({ children, variant = 'default', onRemove }: TagProps) {
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
        'border border-transparent transition-colors',
        'hover:border-neutral-300 dark:hover:border-neutral-600',
        variantStyles[variant]
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Badge;