import { ReactNode } from 'react'
import { cn } from '../../utils'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  glowing?: boolean
  onClick?: () => void
}

export default function AnimatedCard({
  children,
  className,
  hoverable = true,
  glowing = false,
  onClick
}: AnimatedCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group rounded-xl border border-base-300 bg-gaming-dark-card p-6 shadow-lg transition-all duration-300',
        hoverable && [
          'cursor-pointer hover:border-primary/50 hover:bg-gaming-dark-hover hover:shadow-xl',
          'hover:-translate-y-1'
        ],
        glowing && 'animate-glow ring-2 ring-primary/20',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function AnimatedCardHeader({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>
}

export function AnimatedCardTitle({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return <h3 className={cn('text-lg font-bold text-base-content', className)}>{children}</h3>
}

export function AnimatedCardContent({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('space-y-3', className)}>{children}</div>
}

export function AnimatedCardFooter({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center justify-between border-t border-base-300 pt-4',
        className
      )}
    >
      {children}
    </div>
  )
}
