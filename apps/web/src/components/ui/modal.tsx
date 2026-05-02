/* =====================================================
   UI MODAL COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';

/* ---------- Types ---------- */
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type ModalVariant = 'default' | 'centered' | 'bottom' | 'right' | 'confirm';
type ModalAnimation = 'fade' | 'slide' | 'scale' | 'none';

/* ---------- Size Config ---------- */
const sizeConfig: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[90vw] h-[90vh]',
};

/* ---------- Interface ---------- */
interface ModalProps {
  open: boolean;
  onClose?: () => void;
  size?: ModalSize;
  variant?: ModalVariant;
  animation?: ModalAnimation;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  padding?: boolean | 'none' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  closable?: boolean;
}

/* ---------- Component ---------- */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({
  open,
  onClose,
  size = 'md',
  variant = 'default',
  animation = 'fade',
  title,
  subtitle,
  children,
  footer,
  closeOnOverlay = true,
  closeOnEscape = true,
  showClose = true,
  className,
  titleClassName,
  bodyClassName,
  footerClassName,
  padding = true,
  rounded = true,
  closable = true,
}, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Handle open/close animation
  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && open) {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape, onClose]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };

  const paddingClass = {
    false: '',
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding as string];

  // Animation classes
  const animationClasses = {
    fade: {
      overlay: 'opacity-0 transition-opacity duration-200',
      body: 'opacity-0 scale-95 transition-all duration-200',
    },
    slide: {
      overlay: 'opacity-0',
      body: variant === 'right' 
        ? 'translate-x-full transition-transform duration-300'
        : 'translate-y-full transition-transform duration-300',
    },
    scale: {
      overlay: 'opacity-0',
      body: 'scale-90 opacity-0 transition-all duration-200',
    },
    none: {},
  };

  const visibleClasses = {
    fade: {
      overlay: 'opacity-100',
      body: 'opacity-100 scale-100',
    },
    slide: {
      overlay: 'opacity-100',
      body: 'translate-y-0',
    },
    scale: {
      overlay: 'opacity-100',
      body: 'scale-100 opacity-100',
    },
    none: {},
  };

  if (!isVisible) return null;

  return createPortal(
    <div
      className={clsx(
        'fixed inset-0 z-modal-backdrop flex items-center justify-center',
        'bg-black/50 backdrop-blur-sm',
        animation === 'none' ? '' : open ? visibleClasses[animation].overlay : animationClasses[animation].overlay
      )}
      onClick={handleOverlayClick}
    >
      <div
        ref={(e) => {
          if (e) {
            (modalRef as React.MutableRefObject<HTMLDivElement>).current = e;
          }
        }}
        className={twMerge(
          clsx(
            // Size
            sizeConfig[size],
            
              // Variant
              variant === 'right' && 'fixed right-0 top-0 h-full max-w-lg rounded-none',
              variant === 'bottom' && 'fixed bottom-0 left-0 right-0 max-w-full rounded-t-2xl',
              variant === 'centered' && 'mx-4',
              
              // Base
              'w-full bg-white dark:bg-neutral-900',
              rounded && 'rounded-2xl shadow-modal',
              variant === 'right' ? 'rounded-none' : 'rounded-2xl',
              
              // Animation
              animation === 'fade' && (open ? visibleClasses[animation].body : animationClasses[animation].body),
              animation === 'slide' && (open 
                ? (variant === 'right' ? 'translate-x-0' : 'translate-y-0')
                : (variant === 'right' ? 'translate-x-full' : 'translate-y-full')
              ),
              animation === 'scale' && (open ? visibleClasses[animation].body : animationClasses[animation].body),
              
              // Flex layout
              variant === 'right' || variant === 'full' ? 'h-full flex flex-col' : 'flex flex-col',
              
              className
            )
          )}
        >
          {/* Header */}
        {(title || showClose) && (
          <div className={clsx(
            'flex items-start justify-between border-b border-neutral-200',
            paddingClass
          )}>
            <div className={clsx(titleClassName)}>
              {title && (
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
              )}
            </div>
            
            {showClose && closable && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800
                           focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={clsx(
          'flex-1 overflow-y-auto',
          paddingClass,
          bodyClassName
        )}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={clsx(
            'flex items-center justify-end gap-3 border-t border-neutral-200 pt-4',
            paddingClass,
            footerClassName
          )}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

/* =====================================================
   CONFIRM DIALOG COMPONENT
   ===================================================== */
interface ConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

const confirmVariants = {
  danger: {
    icon: 'text-danger-500',
    bg: 'bg-danger-50',
    button: 'bg-danger-500 hover:bg-danger-600',
  },
  warning: {
    icon: 'text-warning-500',
    bg: 'bg-warning-50',
    button: 'bg-warning-500 hover:bg-warning-600',
  },
  info: {
    icon: 'text-info-500',
    bg: 'bg-info-50',
    button: 'bg-info-500 hover:bg-info-600',
  },
  success: {
    icon: 'text-success-500',
    bg: 'bg-success-50',
    button: 'bg-success-500 hover:bg-success-600',
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Está seguro de que desea continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const variantStyles = confirmVariants[variant];

  return (
    <Modal open={open} onClose={onClose} size="sm" variant="centered" showClose={false}>
      <div className="flex flex-col items-center text-center">
        <div className={clsx('mb-4 rounded-full p-3', variantStyles.bg)}>
          <svg className={clsx('w-6 h-6', variantStyles.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-neutral-500 mb-6">{message}</p>
        
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-200 py-2.5 text-sm font-medium
                       hover:bg-neutral-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={clsx(
              'flex-1 rounded-lg py-2.5 text-sm font-medium text-white',
              variantStyles.button,
              loading && 'opacity-50 cursor-wait'
            )}
          >
            {loading ? (
              <svg className="w-5 h-5 mx-auto animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* =====================================================
   DRAWER COMPONENT
   Slide-in panel
   ===================================================== */
interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

const drawerSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  size = 'md',
}: DrawerProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size={size}
      variant="right"
      animation="slide"
      rounded={false}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-neutral-100"
        >
          <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-neutral-200 px-6 py-4">
          {footer}
        </div>
      )}
    </Modal>
  );
}

/* =====================================================
   ALERT MODAL
   Full-width alert modal
   ===================================================== */
interface AlertModalProps {
  open: boolean;
  onClose?: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  children?: React.ReactNode;
}

const alertModalConfigs = {
  success: {
    icon: '✓',
    color: 'text-success-500',
    bg: 'bg-success-50',
  },
  error: {
    icon: '✕',
    color: 'text-danger-500',
    bg: 'bg-danger-50',
  },
  warning: {
    icon: '!',
    color: 'text-warning-500',
    bg: 'bg-warning-50',
  },
  info: {
    icon: 'i',
    color: 'text-info-500',
    bg: 'bg-info-50',
  },
};

export function AlertModal({
  open,
  onClose,
  type = 'info',
  title,
  message,
  children,
}: AlertModalProps) {
  const config = alertModalConfigs[type];

  return (
    <Modal open={open} onClose={onClose} size="sm" variant="centered">
      <div className="text-center">
        <div className={clsx('mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center', config.bg)}>
          <span className={clsx('text-xl font-bold', config.color)}>{config.icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
        {message && <p className="text-neutral-500 mb-4">{message}</p>}
        {children || (
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-primary-500 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
          >
            Aceptar
          </button>
        )}
      </div>
    </Modal>
  );
}

export default Modal;