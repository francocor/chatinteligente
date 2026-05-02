/* =====================================================
   UI TABS COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* =====================================================
   TABS COMPONENT
   ===================================================== */
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
  badgeVariant?: 'primary' | 'danger' | 'warning' | 'success';
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'enclosed' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
}

/* ---------- Variant Styles ---------- */
const variantStyles = {
  default: {
    tab: 'border-b-2 border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300',
    active: 'border-primary-500 text-primary-600 bg-transparent',
    tabList: 'border-b border-neutral-200',
  },
  pills: {
    tab: 'rounded-lg text-neutral-600 hover:bg-neutral-100',
    active: 'bg-primary-500 text-white shadow-md',
    tabList: '',
  },
  underline: {
    tab: 'border-b-2 border-transparent text-neutral-500 hover:text-neutral-700',
    active: 'border-primary-500 text-primary-600',
    tabList: 'border-b border-neutral-200',
  },
  enclosed: {
    tab: 'rounded-t-lg border border-b-0 text-neutral-600',
    active: 'bg-white border-neutral-200 text-neutral-900 -mb-px',
    tabList: 'border-b border-neutral-200',
  },
  ghost: {
    tab: 'rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
    active: 'bg-primary-50 text-primary-600',
    tabList: '',
  },
};

/* ---------- Size Styles ---------- */
const sizeStyles = {
  sm: {
    tab: 'px-3 py-1.5 text-sm',
    badge: 'text-xs min-w-[1.25rem] h-5',
  },
  md: {
    tab: 'px-4 py-2 text-sm',
    badge: 'text-xs min-w-[1.25rem] h-5',
  },
  lg: {
    tab: 'px-5 py-2.5 text-base',
    badge: 'text-sm min-w-[1.5rem] h-6',
  },
};

/* ---------- Component ---------- */
export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  align = 'left',
  fullWidth = false,
  className,
  tabClassName,
  contentClassName,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActiveTab || internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const variants = variantStyles[variant];
  const sizes = sizeStyles[size];
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const Badge = ({ count, variantType = 'primary' }: { count?: number | string; variantType?: 'primary' | 'danger' | 'warning' | 'success' }) => {
    if (!count) return null;
    const badgeColors = {
      primary: 'bg-primary-500 text-white',
      danger: 'bg-danger-500 text-white',
      warning: 'bg-warning-500 text-white',
      success: 'bg-success-500 text-white',
    };
    return (
      <span className={clsx(
        'ml-2 inline-flex items-center justify-center rounded-full font-medium',
        sizes.badge,
        badgeColors[variantType]
      )}>
        {count}
      </span>
    );
  };

  return (
    <div className={twMerge(clsx('w-full', className))}>
      {/* Tab List */}
      <div
        className={clsx(
          'flex',
          alignClasses[align],
          variants.tabList,
          fullWidth && 'w-full'
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            className={twMerge(
              clsx(
                // Base
                'relative inline-flex items-center font-medium transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                
                // Size
                sizes.tab,
                
                // Variant
                activeTab === tab.id
                  ? variants.active
                  : variants.tab,
                  
                // Full width
                fullWidth && 'flex-1',
                
                tabClassName
              )
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            <Badge count={tab.badge} variantType={tab.badgeVariant} />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={clsx(contentClassName)}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            aria-hidden={activeTab !== tab.id}
            className={clsx(
              'py-4',
              activeTab !== tab.id && 'hidden'
            )}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   TABS VERTICAL
   ===================================================== */
interface TabsVerticalProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  side?: 'left' | 'right';
  className?: string;
}

export function TabsVertical({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  side = 'left',
  className,
}: TabsVerticalProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActiveTab || internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div className={clsx('flex gap-6', className)}>
      {side === 'left' && (
        <div className="flex flex-col w-48 border-r border-neutral-200 pr-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={clsx(
                'relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-left rounded-lg',
                'transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-neutral-600 hover:bg-neutral-50',
                  
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className="ml-auto text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            hidden={activeTab !== tab.id}
            className={activeTab !== tab.id ? 'hidden' : ''}
          >
            {tab.content}
          </div>
        ))}
      </div>

      {side === 'right' && (
        <div className="flex flex-col w-48 border-l border-neutral-200 pl-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={clsx(
                'relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-left rounded-lg',
                'transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-neutral-600 hover:bg-neutral-50',
                  
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className="ml-auto text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   ACCORDION TABS
   Expandable accordion style
   ===================================================== */
interface AccordionTab {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  tabs: AccordionTab[];
  defaultExpanded?: string | string[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  tabs,
  defaultExpanded,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [expanded, setExpanded] = React.useState<string[]>(
    Array.isArray(defaultExpanded) ? defaultExpanded : defaultExpanded ? [defaultExpanded] : []
  );

  const toggleTab = (tabId: string) => {
    if (allowMultiple) {
      setExpanded((prev) =>
        prev.includes(tabId)
          ? prev.filter((id) => id !== tabId)
          : [...prev, tabId]
      );
    } else {
      setExpanded((prev) => (prev.includes(tabId) ? [] : [tabId]));
    }
  };

  return (
    <div className={clsx('divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden', className)}>
      {tabs.map((tab) => (
        <div key={tab.id}>
          <button
            onClick={() => toggleTab(tab.id)}
            className={clsx(
              'flex w-full items-center justify-between gap-3 px-4 py-3 text-left',
              'hover:bg-neutral-50 transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
          >
            <div className="flex items-center gap-3">
              {tab.icon && <span className="text-neutral-500">{tab.icon}</span>}
              <span className="font-medium text-neutral-900">{tab.title}</span>
            </div>
            <svg
              className={clsx(
                'w-5 h-5 text-neutral-400 transition-transform duration-200',
                expanded.includes(tab.id) && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={clsx(
              'overflow-hidden transition-all duration-200',
              expanded.includes(tab.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="px-4 py-3 text-neutral-600 bg-neutral-50/50">
              {tab.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   STEPS INDICATOR
   ===================================================== */
interface Step {
  id: string;
  title: string;
  description?: string;
  status?: 'pending' | 'current' | 'completed' | 'error';
}

interface StepsProps {
  steps: Step[];
  currentStep?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Steps({ steps, currentStep, orientation = 'horizontal', className }: StepsProps) {
  const statusStyles = {
    pending: {
      dot: 'bg-neutral-200',
      text: 'text-neutral-400',
      line: 'bg-neutral-200',
    },
    current: {
      dot: 'bg-primary-500 ring-4 ring-primary-100',
      text: 'text-primary-600 font-semibold',
      line: 'bg-neutral-200',
    },
    completed: {
      dot: 'bg-success-500',
      text: 'text-neutral-900',
      line: 'bg-success-500',
    },
    error: {
      dot: 'bg-danger-500',
      text: 'text-danger-600 font-semibold',
      line: 'bg-danger-500',
    },
  };

  const isVertical = orientation === 'vertical';

  return (
    <div className={clsx(isVertical ? 'flex flex-col gap-2' : 'flex items-center gap-4', className)}>
      {steps.map((step, index) => {
        const status = currentStep === step.id ? 'current' : 
          steps.findIndex(s => s.id === currentStep) > index ? 'completed' : 'pending';
        const styles = statusStyles[status];

        return (
          <div key={step.id} className={clsx('flex items-center gap-3', isVertical ? 'flex-row' : '')}>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center', styles.dot)}>
                {status === 'completed' && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status !== 'completed' && (
                  <span className="text-xs font-medium text-white">{index + 1}</span>
                )}
              </div>
              
              <div className={clsx(styles.text, isVertical ? 'flex-1' : '')}>
                <p className="text-sm">{step.title}</p>
                {step.description && (
                  <p className="text-xs text-neutral-400">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={clsx(
                isVertical ? 'w-0.5 h-8 ml-3' : 'flex-1 h-0.5',
                index < steps.findIndex(s => s.id === currentStep) ? styles.line : 'bg-neutral-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Tabs;