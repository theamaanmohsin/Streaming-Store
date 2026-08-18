'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  loading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variantClasses = {
      primary: 'bg-brand-600 text-brand-contrast hover:opacity-85 active:opacity-75 shadow-shadow-card-hover',
      secondary: 'bg-surface-card-dark text-text-primary-dark border border-surface-border-dark hover:bg-surface-border-dark dark:bg-surface-card-light dark:text-text-primary-light dark:border-surface-border-light dark:hover:bg-surface-border-light',
      ghost: 'bg-transparent text-text-secondary-dark hover:bg-surface-border-dark hover:text-text-primary-dark dark:text-text-secondary-light dark:hover:bg-surface-border-light dark:hover:text-text-primary-light',
      icon: 'bg-transparent text-text-secondary-dark hover:bg-surface-border-dark hover:text-text-primary-dark dark:text-text-secondary-light dark:hover:bg-surface-border-light dark:hover:text-text-primary-light',
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-body-sm',
      md: 'px-5 py-3 text-body',
      lg: 'px-6 py-4 text-body-lg',
      xl: 'px-8 py-5 text-body-xl',
      icon: 'p-2',
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle className="opacity-75" cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
