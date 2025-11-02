import { ReactNode, Suspense } from 'react'
import { useAppStore } from '../../stores/appStore'
import SidebarNav from './SidebarNav'
import TopBar from './TopBar'
import StatusFooter from './StatusFooter'
import GlobalLoadingOverlay from '../primitives/GlobalLoadingOverlay'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const { sidebarOpen, sidebarCollapsed } = useAppStore()

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-base-100">
      <TopBar />

      <div className="flex flex-1 overflow-hidden pt-14">
        {sidebarOpen && <SidebarNav collapsed={sidebarCollapsed} />}

        <main
          className="flex flex-1 flex-col overflow-hidden transition-all duration-300"
          style={{
            marginLeft: !sidebarOpen ? '0' : sidebarCollapsed ? '4rem' : '16rem'
          }}
        >
          <Suspense fallback={<GlobalLoadingOverlay message="Loading content..." />}>
            <div className="flex-1 overflow-auto">{children}</div>
          </Suspense>

          <StatusFooter />
        </main>
      </div>

      <GlobalLoadingOverlay />
    </div>
  )
}
