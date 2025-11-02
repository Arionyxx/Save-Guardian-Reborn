import {
  HomeIcon,
  FolderIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'
import { cn } from '../../utils'

interface NavItem {
  id: string
  label: string
  path: string
  icon: typeof HomeIcon
  badge?: string | number
}

interface SidebarNavProps {
  collapsed: boolean
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { id: 'games', label: 'Games', path: '/games', icon: PuzzlePieceIcon },
  { id: 'storage', label: 'Storage', path: '/storage', icon: FolderIcon },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: ChartBarIcon },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Cog6ToothIcon }
]

export default function SidebarNav({ collapsed }: SidebarNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { setSidebarCollapsed } = useAppStore()

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] flex-col border-r border-base-300 bg-base-200 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    'hover:bg-gaming-dark-hover focus:outline-none focus:ring-2 focus:ring-primary',
                    isActive
                      ? 'bg-gradient-gaming text-white shadow-lg'
                      : 'text-base-content/70 hover:text-base-content'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      'size-5 shrink-0 transition-transform group-hover:scale-110',
                      isActive && 'text-white'
                    )}
                  />

                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      {item.badge && (
                        <span className="badge badge-primary badge-sm">{item.badge}</span>
                      )}
                    </>
                  )}

                  {collapsed && item.badge && (
                    <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-base-300 p-2">
        <button
          onClick={handleToggleCollapse}
          className="btn btn-ghost btn-sm w-full justify-center gap-2"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRightIcon className="size-5" />
          ) : (
            <>
              <ChevronLeftIcon className="size-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
