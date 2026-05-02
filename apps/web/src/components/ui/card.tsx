/* =====================================================
   UI CARD COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* ---------- Types ---------- */
type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  clickable?: boolean;
}

/* ---------- Padding Config ---------- */
const paddingConfig: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

/* ---------- Variant Styles ---------- */
const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
  elevated: 'bg-white dark:bg-neutral-800 shadow-lg dark:shadow-xl',
  outlined: 'bg-transparent border-2 border-neutral-200 dark:border-neutral-700',
  ghost: 'bg-transparent',
};

/* ---------- Component ---------- */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        clsx(
          // Base
          'rounded-2xl transition-all duration-200',
          
          // Variant
          variantStyles[variant],
          
          // Padding
          paddingConfig[padding],
          
          // Hover effects
          hover && 'hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700',
          
          // Clickable
          clickable && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
          
          // Focus
          clickable && 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/* ---------- Card Header ---------- */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={twMerge(clsx('flex items-start justify-between mb-4', className))} {...props}>
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        {subtitle && (
          <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ---------- Card Body ---------- */
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={twMerge(clsx('text-neutral-600 dark:text-neutral-300', className))} {...props}>
      {children}
    </div>
  );
}

/* ---------- Card Footer ---------- */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'spread';
}

export function CardFooter({ align = 'left', className, children, ...props }: CardFooterProps) {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    spread: 'justify-between',
  };
  
  return (
    <div className={twMerge(clsx('flex items-center mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700', alignStyles[align], className))} {...props}>
      {children}
    </div>
  );
}

/* ---------- Stat Card ---------- */
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export function StatCard({ title, value, change, positive, icon, subtitle }: StatCardProps) {
  return (
    <Card hover padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{value}</p>
          {change && (
            <p className={clsx(
              'text-sm font-medium mt-1',
              positive ? 'text-success-600' : 'text-danger-600'
            )}>
              {change}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export default Card;