/* =====================================================
   UI BUTTON COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* ---------- Types ---------- */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: ButtonWeight;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean | 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

/* ---------- Sizes Config ---------- */
const sizes: Record<ButtonSize, { px: string; py: string; text: string; icon: string; gap: string }> = {
  xs: { px: 'px-2.5 py-1 text-xs', py: '', text: 'text-xs', icon: 'w-3.5 h-3.5', gap: 'gap-1.5' },
  sm: { px: 'px-3 py-1.5 text-sm', py: '', text: 'text-sm', icon: 'w-4 h-4', gap: 'gap-1.5' },
  md: { px: 'px-4 py-2 text-sm', py: '', text: 'text-sm', icon: 'w-4 h-4', gap: 'gap-2' },
  lg: { px: 'px-5 py-2.5 text-base', py: '', text: 'text-base', icon: 'w-5 h-5', gap: 'gap-2' },
  xl: { px: 'px-6 py-3 text-base', py: '', text: 'text-base', icon: 'w-5 h-5', gap: 'gap-2.5' },
};

/* ---------- Variant Styles ---------- */
const variants: Record<ButtonVariant, { base: string; hover: string; active: string; disabled: string; loading: string }> = {
  primary: {
    base: 'bg-primary-500 text-white shadow-md',
    hover: 'hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5',
    active: 'active:bg-primary-700 active:shadow-inner',
    disabled: 'disabled:bg-primary-300 disabled:shadow-none disabled:cursor-not-allowed',
    loading: 'opacity-80 cursor-wait',
  },
  secondary: {
    base: 'bg-secondary-500 text-white shadow-md',
    hover: 'hover:bg-secondary-600 hover:shadow-lg',
    active: 'active:bg-secondary-700',
    disabled: 'disabled:bg-secondary-300 disabled:cursor-not-allowed',
    loading: 'opacity-80 cursor-wait',
  },
  outline: {
    base: 'bg-transparent border-2 border-primary-500 text-primary-600',
    hover: 'hover:bg-primary-50 hover:border-primary-600',
    active: 'active:bg-primary-100',
    disabled: 'disabled:border-primary-300 disabled:text-primary-300 disabled:cursor-not-allowed',
    loading: 'opacity-80',
  },
  ghost: {
    base: 'bg-transparent text-primary-600',
    hover: 'hover:bg-primary-50',
    active: 'active:bg-primary-100',
    disabled: 'disabled:text-primary-300 disabled:cursor-not-allowed',
    loading: 'opacity-80',
  },
  danger: {
    base: 'bg-danger-500 text-white shadow-md',
    hover: 'hover:bg-danger-600 hover:shadow-lg',
    active: 'active:bg-danger-700',
    disabled: 'disabled:bg-danger-300 disabled:cursor-not-allowed',
    loading: 'opacity-80 cursor-wait',
  },
  success: {
    base: 'bg-success-500 text-white shadow-md',
    hover: 'hover:bg-success-600 hover:shadow-lg',
    active: 'active:bg-success-700',
    disabled: 'disabled:bg-success-300 disabled:cursor-not-allowed',
    loading: 'opacity-80 cursor-wait',
  },
};

/* ---------- Weights ---------- */
const weights: Record<ButtonWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/* ---------- Radius Override ---------- */
const radiusMap: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

/* ---------- Component ---------- */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  weight = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'lg',
  className,
  children,
  disabled,
  ...props
}, ref) => {
  const sizeConfig = sizes[size];
  const variantConfig = variants[variant];
  const weightClass = weights[weight];
  
  const radiusClass = rounded === true 
    ? 'rounded-lg' 
    : radiusMap[rounded] || 'rounded-lg';
  
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={twMerge(
        clsx(
          // Base styles
          'inline-flex items-center justify-center transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'focus:ring-offset-white dark:focus:ring-offset-gray-900',
          
          // Variant styles
          variantConfig.base,
          variantConfig.hover,
          variantConfig.active,
          variantConfig.disabled,
          
          // Size
          sizeConfig.px,
          sizeConfig.py || sizeConfig.px.split(' ')[1] ? '' : 'py-2',
          sizeConfig.text,
          
          // Weight
          weightClass,
          
          // Radius
          radiusClass,
          
          // Icon gap
          (icon && children) && sizeConfig.gap,
          
          // Full width
          fullWidth && 'w-full',
          
          className
        )
      )}
      {...props}
    >
      {loading && (
        <svg 
          className={clsx('animate-spin', sizeConfig.icon)} 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          />
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={clsx(sizeConfig.icon)}>{icon}</span>
      )}
      
      {children && (
        <span>{children}</span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={clsx(sizeConfig.icon)}>{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

/* =====================================================
   BUTTON GROUP COMPONENT
   ===================================================== */
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export function ButtonGroup({ children, className, vertical = false }: ButtonGroupProps) {
  return (
    <div 
      className={clsx(
        'inline-flex',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {children}
    </div>
  );
}

export default Button;