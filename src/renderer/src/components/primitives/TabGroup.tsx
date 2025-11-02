import { ReactNode, useState } from 'react'
import { cn } from '../../utils'

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
  disabled?: boolean
}

interface TabGroupProps {
  tabs: Tab[]
  activeTab?: string
  onChange?: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

export default function TabGroup({
  tabs,
  activeTab: controlledActiveTab,
  onChange,
  className,
  variant = 'default'
}: TabGroupProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '')
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId)
    }
    onChange?.(tabId)
  }

  const variantClasses = {
    default: {
      container: 'rounded-lg bg-base-200 p-1',
      tab: 'rounded-md px-4 py-2',
      active: 'bg-base-100 shadow-sm'
    },
    pills: {
      container: 'gap-2',
      tab: 'rounded-full px-4 py-2',
      active: 'bg-gradient-gaming text-white shadow-lg'
    },
    underline: {
      container: 'border-b border-base-300 gap-1',
      tab: 'border-b-2 border-transparent px-4 py-2',
      active: 'border-primary text-primary'
    }
  }

  const classes = variantClasses[variant]

  return (
    <div className={cn('flex items-center', classes.container, className)}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-all',
              classes.tab,
              isActive
                ? classes.active
                : 'text-base-content/70 hover:bg-base-300/50 hover:text-base-content',
              tab.disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={cn(
                  'badge badge-sm',
                  isActive && variant === 'pills' ? 'badge-accent' : 'badge-primary'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

interface TabPanelProps {
  activeTab: string
  tabId: string
  children: ReactNode
  className?: string
}

export function TabPanel({ activeTab, tabId, children, className }: TabPanelProps) {
  if (activeTab !== tabId) return null

  return <div className={cn('animate-fade-in', className)}>{children}</div>
}
