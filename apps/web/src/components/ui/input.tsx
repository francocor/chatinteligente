/* =====================================================
   UI INPUT COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* ---------- Types ---------- */
type InputSize = 'sm' | 'md' | 'lg';
type InputState = 'default' | 'error' | 'success' | 'warning' | 'disabled';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  state?: InputState;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/* ---------- Sizes Config ---------- */
const sizes: Record<InputSize, { py: string; text: string; icon: string }> = {
  sm: { py: 'py-1.5', text: 'text-sm', icon: 'w-4 h-4' },
  md: { py: 'py-2', text: 'text-sm', icon: 'w-5 h-5' },
  lg: { py: 'py-2.5', text: 'text-base', icon: 'w-5 h-5' },
};

/* ---------- State Styles ---------- */
const stateStyles: Record<InputState, { border: string; ring: string; text: string; icon: string }> = {
  default: {
    border: 'border-neutral-200 dark:border-neutral-700',
    ring: 'focus:ring-primary-500',
    text: 'text-neutral-900 dark:text-neutral-100',
    icon: 'text-neutral-400',
  },
  error: {
    border: 'border-danger-500',
    ring: 'focus:ring-danger-500',
    text: 'text-danger-600',
    icon: 'text-danger-500',
  },
  success: {
    border: 'border-success-500',
    ring: 'focus:ring-success-500',
    text: 'text-success-600',
    icon: 'text-success-500',
  },
  warning: {
    border: 'border-warning-500',
    ring: 'focus:ring-warning-500',
    text: 'text-warning-600',
    icon: 'text-warning-500',
  },
  disabled: {
    border: 'border-neutral-200 dark:border-neutral-700',
    ring: '',
    text: 'text-neutral-400 dark:text-neutral-500',
    icon: 'text-neutral-300 dark:text-neutral-600',
  },
};

/* ---------- Component ---------- */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  state = 'default',
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}, ref) => {
  const sizeConfig = sizes[size];
  const stateConfig = stateStyles[state];
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className={clsx(
          'block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5',
          state === 'error' && 'text-danger-600'
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={clsx(
            'absolute left-3 top-1/2 -translate-y-1/2',
            stateConfig.icon,
            sizeConfig.icon
          )}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          disabled={disabled || state === 'disabled'}
          className={twMerge(
            clsx(
              // Base styles
              'block w-full rounded-lg bg-white dark:bg-neutral-800',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              'transition-all duration-200',
              
              // Size
              sizeConfig.py,
              sizeConfig.text,
              
              // State
              stateConfig.border,
              stateConfig.ring,
              stateConfig.text,
              
              // Left/Right icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              
              // Disabled
              disabled && 'opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-neutral-900',
              
              className
            )
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className={clsx(
            'absolute right-3 top-1/2 -translate-y-1/2',
            stateConfig.icon,
            sizeConfig.icon
          )}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/* =====================================================
   TEXTAREA COMPONENT
   ===================================================== */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={twMerge(
          clsx(
            'block w-full rounded-lg bg-white dark:bg-neutral-800',
            'border border-neutral-200 dark:border-neutral-700',
            'px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'resize-none',
            
            error && 'border-danger-500 focus:ring-danger-500',
            
            className
          )
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/* =====================================================
   SELECT COMPONENT
   ===================================================== */
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  placeholder,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={twMerge(
          clsx(
            'block w-full rounded-lg bg-white dark:bg-neutral-800',
            'border border-neutral-200 dark:border-neutral-700',
            'px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'cursor-pointer',
            
            error && 'border-danger-500 focus:ring-danger-500',
            
            className
          )
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;