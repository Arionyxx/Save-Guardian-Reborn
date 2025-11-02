import { useAppStore } from '../../stores/appStore'
import { cn } from '../../utils'

interface GlobalLoadingOverlayProps {
  message?: string
}

export default function GlobalLoadingOverlay({ message }: GlobalLoadingOverlayProps) {
  const { isLoading, globalLoadingMessage } = useAppStore()
  const displayMessage = message || globalLoadingMessage || 'Loading...'

  if (!isLoading && !message) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-base-100/80 backdrop-blur-sm',
        'animate-fade-in'
      )}
    >
      <div className="flex flex-col items-center gap-4 rounded-xl bg-gaming-dark-card p-8 shadow-2xl">
        <div className="relative">
          <div className="size-16 animate-spin rounded-full border-4 border-base-300 border-t-primary" />
          <div className="absolute inset-0 size-16 animate-pulse rounded-full border-4 border-primary/20" />
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">{displayMessage}</p>
          <p className="mt-1 text-sm text-base-content/60">Please wait...</p>
        </div>
      </div>
    </div>
  )
}
