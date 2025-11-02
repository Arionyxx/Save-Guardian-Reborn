import { useEffect } from 'react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

const colorClasses = {
  success: 'bg-status-success/20 border-status-success text-status-success',
  error: 'bg-status-error/20 border-status-error text-status-error',
  warning: 'bg-status-warning/20 border-status-warning text-status-warning',
  info: 'bg-status-info/20 border-status-info text-status-info'
}

export function ToastItem({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type]

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={cn(
        'flex animate-slide-down items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        colorClasses[toast.type]
      )}
    >
      <Icon className="size-5 shrink-0" />
      <p className="flex-1 text-sm font-medium text-base-content">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Close notification"
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
}

export function ToastContainer({ toasts, onClose, position = 'top-right' }: ToastContainerProps) {
  return (
    <div
      className={cn('fixed z-[300] flex w-full max-w-sm flex-col gap-2', positionClasses[position])}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
