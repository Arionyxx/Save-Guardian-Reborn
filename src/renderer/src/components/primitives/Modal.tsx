import { ReactNode, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '../../utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

export default function Modal({
  open,
  onClose,
  children,
  title,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex animate-fade-in items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={cn(
          'relative w-full animate-scale-in rounded-xl border border-base-300 bg-gaming-dark-card shadow-2xl',
          sizeClasses[size],
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm ml-auto"
                aria-label="Close modal"
              >
                <XMarkIcon className="size-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-base-300 px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  )
}
