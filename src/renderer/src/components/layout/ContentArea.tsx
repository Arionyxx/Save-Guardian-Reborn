import { ReactNode } from 'react'
import { cn } from '../../utils'

interface ContentAreaProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function ContentArea({ children, className, padding = 'md' }: ContentAreaProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return <div className={cn('min-h-full', paddingClasses[padding], className)}>{children}</div>
}
