/* =====================================================
   UI ALERT COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* ---------- Types ---------- */
type AlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'secondary';
type AlertSize = 'sm' | 'md' | 'lg';
type AlertIconPosition = 'left' | 'right';

/* ---------- Icon Components ---------- */
const icons = {
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  danger: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  primary: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  secondary: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

/* ---------- Variant Config ---------- */
const variantConfig: Record<AlertVariant, { bg: string; border: string; icon: string; title: string; text: string; link?: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-500',
    title: 'text-blue-800 dark:text-blue-200',
    text: 'text-blue-700 dark:text-blue-300',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-500',
    title: 'text-green-800 dark:text-green-200',
    text: 'text-green-700 dark:text-green-300',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-500',
    title: 'text-yellow-800 dark:text-yellow-200',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-500',
    title: 'text-red-800 dark:text-red-200',
    text: 'text-red-700 dark:text-red-300',
    link: 'text-red-600 hover:text-red-800 dark:hover:text-red-100',
  },
  primary: {
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-200 dark:border-sky-800',
    icon: 'text-sky-500',
    title: 'text-sky-800 dark:text-sky-200',
    text: 'text-sky-700 dark:text-sky-300',
  },
  secondary: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
    icon: 'text-violet-500',
    title: 'text-violet-800 dark:text-violet-200',
    text: 'text-violet-700 dark:text-violet-300',
  },
};

/* ---------- Size Config ---------- */
const sizeConfig: Record<AlertSize, string> = {
  sm: 'p-3 text-sm',
  md: 'p-4',
  lg: 'p-5 text-base',
};

/* ---------- Interface ---------- */
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  size?: AlertSize;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
  link?: string;
}

/* ---------- Component ---------- */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({
  variant = 'info',
  size = 'md',
  title,
  message,
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  action,
  link,
  className,
  children,
  ...props
}, ref) => {
  const config = variantConfig[variant];
  const sizeStyles = sizeConfig[size];

  return (
    <div
      ref={ref}
      className={twMerge(
        clsx(
          // Base
          'relative flex gap-3 rounded-lg border',
          config.bg,
          config.border,
          sizeStyles,
          
          className
        )
      )}
      {...props}
    >
      {/* Icon */}
      {(showIcon || icon) && (
        <div className={clsx('flex-shrink-0 mt-0.5', config.icon)}>
          {icon || icons[variant]}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {title && (
          <h4 className={clsx('font-semibold', config.title)}>{title}</h4>
        )}
        
        {message && (
          <p className={clsx(config.text, title && 'mt-1')}>
            {children || message}
            {link && (
              <a href={link} className={clsx('font-medium underline ml-1', config.link)}>
                Más información
              </a>
            )}
          </p>
        )}
        
        {children}
      </div>

      {/* Action */}
      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}

      {/* Close Button */}
      {dismissible && (
        <button
          onClick={onDismiss}
          className={clsx(
            'absolute right-3 top-3 rounded p-1',
            'hover:bg-black/10 dark:hover:bg-white/10',
            config.icon
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

/* =====================================================
   ALERT BOX COMPONENT
   Simpler alert with colored background
   ===================================================== */
interface AlertBoxProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

const alertBoxVariants: Record<AlertVariant, string> = {
  info: 'bg-info-500 text-white',
  success: 'bg-success-500 text-white',
  warning: 'bg-warning-500 text-white',
  danger: 'bg-danger-500 text-white',
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-secondary-500 text-white',
};

export function AlertBox({ variant = 'info', children, className }: AlertBoxProps) {
  return (
    <div className={clsx(
      'rounded-lg px-4 py-3 text-sm font-medium',
      alertBoxVariants[variant],
      className
    )}>
      {children}
    </div>
  );
}

/* =====================================================
   CALLOUT COMPONENT
   Prominent callout for important messages
   ===================================================== */
interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  children: React.ReactNode;
}

const calloutConfig = {
  info: {
    icon: '💡',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-300 dark:border-blue-700',
  },
  success: {
    icon: '✅',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-300 dark:border-green-700',
  },
  warning: {
    icon: '⚠️',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  error: {
    icon: '❌',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-300 dark:border-red-700',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type];

  return (
    <div className={clsx(
      'flex gap-4 rounded-lg border p-4',
      config.bg,
      config.border
    )}>
      <span className="text-2xl">{config.icon}</span>
      <div>
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{children}</div>
      </div>
    </div>
  );
}

/* =====================================================
   INLINE ALERT
   Compact alert for forms
   ===================================================== */
interface InlineAlertProps {
  type?: 'error' | 'warning' | 'success' | 'info';
  message: string;
  className?: string;
}

export function InlineAlert({ type = 'error', message, className }: InlineAlertProps) {
  const styles = {
    error: 'bg-danger-50 text-danger-700 border-danger-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    info: 'bg-info-50 text-info-700 border-info-200',
  };

  return (
    <div className={clsx(
      'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
      styles[type],
      className
    )}>
      {type === 'error' && (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {type === 'warning' && (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {type === 'success' && (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {type === 'info' && (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}

export default Alert;