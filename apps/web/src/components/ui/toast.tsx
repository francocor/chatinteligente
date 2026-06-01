/* =====================================================
   UI TOAST COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';

/* =====================================================
   TOAST TYPES
   ===================================================== */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/* =====================================================
   TOAST CONTEXT
   ===================================================== */
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/* =====================================================
   TOAST PROVIDER
   ===================================================== */
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastProvider({ children, position = 'top-right', maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      dismissible: toast.dismissible !== false,
    };

    setToasts((prev) => {
      const updated = [...prev, newToast].slice(-maxToasts);
      return updated;
    });

    // Auto dismiss
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }

    return id;
  }, [maxToasts]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <ToastContainer toasts={toasts} position={position} onRemove={removeToast} />,
        document.body
      )}
    </ToastContext.Provider>
  );
}

/* =====================================================
   TOAST CONTAINER
   ===================================================== */
interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, position, onRemove }: ToastContainerProps) {
  const vertical = position.includes('top') ? false : true;
  const isTop = position.includes('top');

  return (
    <div
      className={clsx(
        'fixed z-toast pointer-events-none',
        positionClasses[position]
      )}
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'column',
      }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={clsx(
            'pointer-events-auto mb-2 last:mb-0 animate-slide-up'
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ToastItem toast={toast} onDismiss={() => onRemove(toast.id)} />
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   TOAST ITEM
   ===================================================== */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const variantStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: {
      bg: 'bg-white dark:bg-neutral-800',
      border: 'border-l-success-500',
      icon: 'text-success-500',
    },
    error: {
      bg: 'bg-white dark:bg-neutral-800',
      border: 'border-l-danger-500',
      icon: 'text-danger-500',
    },
    warning: {
      bg: 'bg-white dark:bg-neutral-800',
      border: 'border-l-warning-500',
      icon: 'text-warning-500',
    },
    info: {
      bg: 'bg-white dark:bg-neutral-800',
      border: 'border-l-info-500',
      icon: 'text-info-500',
    },
    default: {
      bg: 'bg-white dark:bg-neutral-800',
      border: 'border-l-neutral-300',
      icon: 'text-neutral-500',
    },
  };

  const styles = variantStyles[toast.type];
  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    default: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={clsx(
        'w-80 rounded-lg shadow-lg border border-l-4 bg-white dark:bg-neutral-800',
        styles.border,
        'overflow-hidden'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={clsx('flex-shrink-0', styles.icon)}>
          {icons[toast.type]}
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              {toast.title}
            </p>
          )}
          <p className={clsx(
            'text-sm text-neutral-600 dark:text-neutral-400',
            toast.title && 'mt-1'
          )}>
            {toast.message}
          </p>
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        {toast.dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   USE TOAST HOOK
   ===================================================== */
export function useToastHook() {
  const { addToast, removeToast, clearToasts } = useToast();

  const toast = React.useCallback((type: ToastType, message: string, options?: Partial<Omit<Toast, 'type' | 'message'>>) => {
    return addToast({ type, message, ...options });
  }, [addToast]);

  const success = React.useCallback((message: string, options?: Partial<Omit<Toast, 'type' | 'message'>>) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = React.useCallback((message: string, options?: Partial<Omit<Toast, 'type' | 'message'>>) => {
    return addToast({ type: 'error', message, duration: 0, ...options });
  }, [addToast]);

  const warning = React.useCallback((message: string, options?: Partial<Omit<Toast, 'type' | 'message'>>) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = React.useCallback((message: string, options?: Partial<Omit<Toast, 'type' | 'message'>>) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  return { toast, success, error, warning, info, dismiss: removeToast, clear: clearToasts };
}

/* =====================================================
   TOAST STANDALONE COMPONENT
   ===================================================== */
interface ToastStandaloneProps {
  type?: ToastType;
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: number;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-info-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function ToastStandalone({ type = 'info', title, message, onClose, autoClose = 5000 }: ToastStandaloneProps) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const borderColors: Record<ToastType, string> = {
    success: 'border-l-success-500',
    error: 'border-l-danger-500',
    warning: 'border-l-warning-500',
    info: 'border-l-info-500',
    default: 'border-l-neutral-300',
  };

  return (
    <div className={clsx(
      'flex items-start gap-3 w-80 rounded-lg shadow-lg border border-l-4 bg-white dark:bg-neutral-800 p-4',
      borderColors[type]
    )}>
      <div className="flex-shrink-0">{toastIcons[type]}</div>
      <div className="flex-1">
        {title && (
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{title}</p>
        )}
        <p className={clsx('text-sm text-neutral-600 dark:text-neutral-400', title && 'mt-1')}>
          {message}
        </p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 rounded p-1 hover:bg-neutral-100">
          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Toast;