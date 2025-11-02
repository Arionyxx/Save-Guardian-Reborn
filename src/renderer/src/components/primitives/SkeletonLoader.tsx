import { cn } from '../../utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rect' | 'circle' | 'card'
  width?: string
  height?: string
  lines?: number
}

export default function SkeletonLoader({
  className,
  variant = 'rect',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-base-300 overflow-hidden relative'
  const shimmerClasses =
    'after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-base-content/10 after:to-transparent'

  if (variant === 'text') {
    if (lines > 1) {
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClasses,
                shimmerClasses,
                'h-4 rounded',
                i === lines - 1 ? 'w-3/4' : 'w-full',
                className
              )}
              style={{ width, height }}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        className={cn(baseClasses, shimmerClasses, 'h-4 rounded', className)}
        style={{ width: width || '100%', height }}
      />
    )
  }

  if (variant === 'circle') {
    return (
      <div
        className={cn(baseClasses, shimmerClasses, 'rounded-full', className)}
        style={{
          width: width || '3rem',
          height: height || width || '3rem'
        }}
      />
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-xl border border-base-300 bg-gaming-dark-card p-6', className)}>
        <div className="flex items-center gap-4">
          <div className={cn(baseClasses, shimmerClasses, 'size-12 rounded-full')} />
          <div className="flex-1 space-y-2">
            <div className={cn(baseClasses, shimmerClasses, 'h-5 w-1/2 rounded')} />
            <div className={cn(baseClasses, shimmerClasses, 'h-4 w-3/4 rounded')} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className={cn(baseClasses, shimmerClasses, 'h-4 w-full rounded')} />
          <div className={cn(baseClasses, shimmerClasses, 'h-4 w-5/6 rounded')} />
          <div className={cn(baseClasses, shimmerClasses, 'h-4 w-4/6 rounded')} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, shimmerClasses, 'rounded', className)}
      style={{ width: width || '100%', height: height || '2rem' }}
    />
  )
}

export function SkeletonCard() {
  return <SkeletonLoader variant="card" />
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return <SkeletonLoader variant="text" lines={lines} />
}

export function SkeletonAvatar() {
  return <SkeletonLoader variant="circle" width="3rem" />
}
