import { cn } from '../../utils'

type Status = 'success' | 'warning' | 'error' | 'info' | 'idle'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface StatusIndicatorProps {
  status: Status
  size?: Size
  label?: string
  animated?: boolean
  className?: string
}

const statusColors: Record<Status, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
  info: 'bg-status-info',
  idle: 'bg-base-content/40'
}

const sizeClasses: Record<Size, { dot: string; text: string }> = {
  xs: { dot: 'size-1.5', text: 'text-xs' },
  sm: { dot: 'size-2', text: 'text-xs' },
  md: { dot: 'size-2.5', text: 'text-sm' },
  lg: { dot: 'size-3', text: 'text-base' }
}

export default function StatusIndicator({
  status,
  size = 'md',
  label,
  animated = true,
  className
}: StatusIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex items-center justify-center">
        <span
          className={cn(
            'rounded-full',
            statusColors[status],
            sizeClasses[size].dot,
            animated && status !== 'idle' && 'animate-pulse-subtle'
          )}
        />
        {animated && status !== 'idle' && (
          <span
            className={cn(
              'absolute rounded-full opacity-50',
              statusColors[status],
              sizeClasses[size].dot,
              'animate-ping'
            )}
          />
        )}
      </div>
      {label && <span className={cn('font-medium', sizeClasses[size].text)}>{label}</span>}
    </div>
  )
}
