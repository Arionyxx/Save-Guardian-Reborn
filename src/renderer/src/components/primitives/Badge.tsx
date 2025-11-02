import { ReactNode } from 'react'
import { cn } from '../../utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  dot?: boolean
}

const variantClasses = {
  default: 'bg-base-300 text-base-content',
  success: 'bg-status-success/20 text-status-success border-status-success',
  warning: 'bg-status-warning/20 text-status-warning border-status-warning',
  error: 'bg-status-error/20 text-status-error border-status-error',
  info: 'bg-status-info/20 text-status-info border-status-info'
}

const sizeClasses = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot = false
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'size-1.5 rounded-full',
            variant === 'success' && 'bg-status-success',
            variant === 'warning' && 'bg-status-warning',
            variant === 'error' && 'bg-status-error',
            variant === 'info' && 'bg-status-info',
            variant === 'default' && 'bg-base-content'
          )}
        />
      )}
      {children}
    </span>
  )
}
