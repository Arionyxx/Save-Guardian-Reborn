import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  isLoading: boolean
  appVersion: string
  theme: 'light' | 'dark' | 'cupcake'
  sidebarOpen: boolean
  setLoading: (loading: boolean) => void
  setAppVersion: (version: string) => void
  setTheme: (theme: 'light' | 'dark' | 'cupcake') => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    set => ({
      isLoading: true,
      appVersion: '0.0.0',
      theme: 'light',
      sidebarOpen: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setAppVersion: (version: string) => set({ appVersion: version }),
      setTheme: (theme: 'light' | 'dark' | 'cupcake') => {
        set({ theme })
        document.documentElement.setAttribute('data-theme', theme)
      },
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen }))
    }),
    { name: 'AppStore' }
  )
)
