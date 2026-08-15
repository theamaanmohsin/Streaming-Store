'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines,
  ...props
}: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('animate-pulse-soft', className)} {...props}>
        <div className="aspect-[2/3] w-full rounded-xl bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light" style={{ backgroundSize: '200% 100%' }} />
        <div className="mt-3 h-5 w-3/4 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
        <div className="mt-2 h-4 w-1/2 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
      </div>
    )
  }

  if (variant === 'circular') {
    const size = width || height || '40px'
    return (
      <div
        className={cn('rounded-full bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light', className)}
        style={{ width: size, height: size, backgroundSize: '200% 100%', ...props.style }}
        {...props}
      />
    )
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={cn('rounded-lg bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light', className)}
        style={{ width, height: height || '1rem', backgroundSize: '200% 100%', ...props.style }}
        {...props}
      />
    )
  }

  if (lines && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded"
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              backgroundSize: '200% 100%',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('h-4 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded', className)}
      style={{ width: width || '100%', backgroundSize: '200% 100%', ...props.style }}
      {...props}
    />
  )
}