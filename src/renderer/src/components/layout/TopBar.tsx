import {
  Bars3Icon,
  XMarkIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '../../stores/appStore'
import { cn } from '../../utils'

export default function TopBar() {
  const { appVersion, theme, setTheme, sidebarOpen, toggleSidebar } = useAppStore()

  const handleMinimize = async () => {
    await window.electronAPI.minimizeWindow()
  }

  const handleMaximize = async () => {
    await window.electronAPI.maximizeWindow()
  }

  const handleClose = async () => {
    await window.electronAPI.closeWindow()
  }

  const toggleTheme = () => {
    if (theme === 'gaming') {
      setTheme('light')
    } else {
      setTheme('gaming')
    }
  }

  return (
    <header className="fixed top-0 z-50 flex h-14 w-full items-center border-b border-base-300 bg-base-200/95 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className={cn(
              'btn btn-ghost btn-sm transition-transform',
              !sidebarOpen && 'rotate-180'
            )}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <XMarkIcon className="size-5" /> : <Bars3Icon className="size-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-gaming">
              <CloudArrowUpIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Backup Manager</h1>
              <span className="text-xs text-base-content/60">Gaming Edition</span>
            </div>
          </div>

          <span className="badge badge-primary badge-sm ml-2">v{appVersion}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search games, backups..."
              className="input input-sm w-64 bg-base-100 pl-9 focus:ring-2 focus:ring-primary"
            />
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          </div>

          <button onClick={toggleTheme} className="btn btn-ghost btn-sm" aria-label="Toggle theme">
            {theme === 'gaming' || theme === 'dark' ? (
              <SunIcon className="size-5" />
            ) : (
              <MoonIcon className="size-5" />
            )}
          </button>

          <div className="flex gap-1">
            <button onClick={handleMinimize} className="btn btn-ghost btn-sm" aria-label="Minimize">
              <MinusIcon className="size-4" />
            </button>
            <button onClick={handleMaximize} className="btn btn-ghost btn-sm" aria-label="Maximize">
              <ArrowsPointingOutIcon className="size-4" />
            </button>
            <button onClick={handleClose} className="btn btn-error btn-sm" aria-label="Close">
              <XMarkIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function CloudArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
      />
    </svg>
  )
}
