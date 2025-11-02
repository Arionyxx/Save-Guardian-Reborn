import {
  Bars3Icon,
  XMarkIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '../stores'

export default function Header() {
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
    <header className="border-b border-base-300 bg-base-100">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <XMarkIcon className="size-5" /> : <Bars3Icon className="size-5" />}
          </button>
          <h1 className="text-lg font-bold">Backup Manager</h1>
          <span className="badge badge-primary badge-sm">v{appVersion}</span>
        </div>

        <div className="flex items-center gap-2">
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
