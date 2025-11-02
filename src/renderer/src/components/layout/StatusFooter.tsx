import { useState, useEffect } from 'react'
import { SignalIcon, ServerIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import StatusIndicator from '../primitives/StatusIndicator'

export default function StatusFooter() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <footer className="flex h-8 items-center justify-between border-t border-base-300 bg-base-200 px-4 text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <StatusIndicator status="success" size="sm" />
          <span className="flex items-center gap-1.5">
            <CheckCircleIcon className="size-3.5" />
            All systems operational
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-base-content/60">
          <ServerIcon className="size-3.5" />
          <span>Storage: 245 GB / 500 GB</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-base-content/60">
        <div className="flex items-center gap-1.5">
          <SignalIcon className="size-3.5" />
          <span>Connected</span>
        </div>

        <div className="flex items-center gap-1.5">
          <ClockIcon className="size-3.5" />
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </footer>
  )
}
