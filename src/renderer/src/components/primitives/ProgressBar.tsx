import { cn } from '../../utils'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  label?: string
  showValue?: boolean
  animated?: boolean
  striped?: boolean
  className?: string
}

const sizeClasses = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
}

const colorClasses = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error'
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  label,
  showValue = false,
  animated = false,
  striped = false,
  className
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showValue && <span className="text-base-content/60">{Math.round(percentage)}%</span>}
        </div>
      )}

      <div className={cn('w-full overflow-hidden rounded-full bg-base-300', sizeClasses[size])}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            colorClasses[color],
            animated && 'animate-pulse-subtle',
            striped &&
              'animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:2rem_100%]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  color = 'primary',
  showValue = true,
  className
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  className?: string
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const strokeColor = {
    primary: '#1890ff',
    secondary: '#13c2c2',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  }[color]

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-base-300"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}
