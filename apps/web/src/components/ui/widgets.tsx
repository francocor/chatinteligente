/* =====================================================
   UI WIDGETS - Dashboard Components
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* =====================================================
   STAT WIDGET
   Key metrics display
   ===================================================== */
interface StatWidgetProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  iconColor?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  trend?: 'up' | 'down' | 'flat';
  sparkline?: number[];
  subtitle?: string;
  loading?: boolean;
}

const iconColors = {
  primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400',
  warning: 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  danger: 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400',
  secondary: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400',
};

export function StatWidget({
  title,
  value,
  change,
  changeType = 'neutral',
  prefix,
  suffix,
  icon,
  iconColor = 'primary',
  trend,
  sparkline,
  subtitle,
  loading,
}: StatWidgetProps) {
  const changeColors = {
    positive: 'text-success-600',
    negative: 'text-danger-600',
    neutral: 'text-neutral-500',
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-card transition-all hover:shadow-card-hover">
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-neutral-200 rounded" />
          <div className="h-8 w-32 bg-neutral-200 rounded" />
          <div className="h-4 w-16 bg-neutral-200 rounded" />
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              {prefix && <span className="text-neutral-400">{prefix}</span>}
              <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{value}</span>
              {suffix && <span className="text-neutral-400">{suffix}</span>}
            </div>
            
            {/* Change indicator */}
            {change && (
              <div className={clsx('flex items-center gap-1 mt-2 text-sm font-medium', changeColors[changeType])}>
                {trend === 'up' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
                  </svg>
                )}
                {trend === 'down' && (
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
                  </svg>
                )}
                <span>{change}</span>
              </div>
            )}

            {subtitle && (
              <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', iconColors[iconColor])}>
              {icon}
            </div>
          )}
        </div>
      )}

      {/* Sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div className="mt-4 h-12">
          <Sparkline data={sparkline} color={iconColor} />
        </div>
      )}
    </div>
  );
}

/* =====================================================
   SPARKLINE CHART
   Mini line chart
   ===================================================== */
interface SparklineProps {
  data: number[];
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  height?: number;
}

function Sparkline({ data, color = 'primary', height = 48 }: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = 100 / (data.length - 1);

  const pathData = data
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const colors = {
    primary: '#0ea5e9',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    secondary: '#a855f7',
  };

  return (
    <svg width="100%" height={height} className="overflow-visible">
      <path
        d={pathData}
        fill="none"
        stroke={colors[color]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) * step}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="3"
        fill={colors[color]}
      />
    </svg>
  );
}

/* =====================================================
   CHART WIDGET
   Line/Bar/Area charts placeholder
   ===================================================== */
interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  type?: 'line' | 'bar' | 'area';
  data?: any;
  height?: number;
  className?: string;
}

export function ChartWidget({
  title,
  subtitle,
  type = 'line',
  height = 240,
  className,
}: ChartWidgetProps) {
  return (
    <div className={twMerge('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
        <div className="flex gap-1">
          <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chart placeholder */}
      <div style={{ height }} className="flex items-end justify-between gap-2">
        {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 65, 80].map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-primary-100 dark:bg-primary-900/30 rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-sm text-neutral-500">Este mes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neutral-300" />
          <span className="text-sm text-neutral-500">Mes anterior</span>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   ACTIVITY WIDGET
   Recent activity feed
   ===================================================== */
interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  time: string;
  icon?: React.ReactNode;
}

interface ActivityWidgetProps {
  title?: string;
  items: ActivityItem[];
  maxItems?: number;
  className?: string;
}

export function ActivityWidget({
  title = 'Actividad Reciente',
  items,
  maxItems = 5,
  className,
}: ActivityWidgetProps) {
  return (
    <div className={twMerge('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden', className)}>
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      </div>
      
      <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
        {items.slice(0, maxItems).map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
            {item.user.avatar ? (
              <img src={item.user.avatar} alt={item.user.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {item.user.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-900 dark:text-neutral-100">
                <span className="font-medium">{item.user.name}</span>{' '}
                {item.action}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   PROGRESS WIDGET
   Progress bars with labels
   ===================================================== */
interface ProgressItem {
  label: string;
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

interface ProgressWidgetProps {
  title?: string;
  items: ProgressItem[];
  className?: string;
}

export function ProgressWidget({
  title = 'Progreso',
  items,
  className,
}: ProgressWidgetProps) {
  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  return (
    <div className={twMerge('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6', className)}>
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = Math.min(100, (item.value / (item.max || 100)) * 100);
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.label}</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {item.value}{item.max && ` / ${item.max}`}
                </span>
              </div>
              <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all duration-500', colors[item.color || 'primary'])}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================
   DONUT CHART WIDGET
   Circular progress
   ===================================================== */
interface DonutWidgetProps {
  title?: string;
  value: number;
  max: number;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: number;
  className?: string;
}

export function DonutWidget({
  title = 'Progreso',
  value,
  max,
  label,
  color = 'primary',
  size = 120,
  className,
}: DonutWidgetProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: '#0ea5e9',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
  };

  return (
    <div className={twMerge('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 text-center', className)}>
      <div className="relative inline-block">
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-neutral-100 dark:text-neutral-700"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke={colors[color]}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</span>
          <span className="text-sm text-neutral-500">/ {max}</span>
        </div>
      </div>
      <p className="mt-4 font-medium text-neutral-900 dark:text-neutral-100">{title}</p>
      {label && <p className="text-sm text-neutral-500">{label}</p>}
    </div>
  );
}

/* =====================================================
   LIST WIDGET
   Simple list display
   ===================================================== */
interface ListWidgetItem {
  id: string;
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

interface ListWidgetProps {
  title?: string;
  items: ListWidgetItem[];
  className?: string;
}

export function ListWidget({
  title = 'Lista',
  items,
  className,
}: ListWidgetProps) {
  return (
    <div className={twMerge('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden', className)}>
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      </div>
      
      <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500">
                  {item.icon}
                </div>
              )}
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
                {item.subtitle && <p className="text-sm text-neutral-500">{item.subtitle}</p>}
              </div>
            </div>
            {item.value && (
              <span className="text-sm font-medium text-neutral-500">{item.value}</span>
            )}
            {item.action}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   QUICK ACTIONS WIDGET
   Action buttons grid
   ===================================================== */
interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface QuickActionsWidgetProps {
  title?: string;
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function QuickActionsWidget({
  title = 'Acciones Rápidas',
  actions,
  columns = 3,
  className,
}: QuickActionsWidgetProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={twMerge('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6', className)}>
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">{title}</h3>
      
      <div className={clsx('grid gap-3', gridCols[columns])}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={clsx(
              'flex flex-col items-center gap-2 p-4 rounded-xl',
              'bg-neutral-50 dark:bg-neutral-700',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center text-primary-500 shadow-sm">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StatWidget;