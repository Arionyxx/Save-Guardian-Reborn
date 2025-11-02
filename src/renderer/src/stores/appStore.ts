import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type Theme = 'gaming' | 'light' | 'dark'

interface AppState {
  isLoading: boolean
  appVersion: string
  theme: Theme
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  globalLoadingMessage: string | null
  setLoading: (loading: boolean, message?: string) => void
  setAppVersion: (version: string) => void
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const detectPreferredTheme = (): Theme => {
  const stored = localStorage.getItem('app-theme')
  if (stored && ['gaming', 'light', 'dark'].includes(stored)) {
    return stored as Theme
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'gaming' : 'light'
}

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  if (theme === 'gaming' || theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('app-theme', theme)
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      set => ({
        isLoading: true,
        appVersion: '0.0.0',
        theme: detectPreferredTheme(),
        sidebarOpen: true,
        sidebarCollapsed: false,
        globalLoadingMessage: null,
        setLoading: (loading: boolean, message?: string) =>
          set({ isLoading: loading, globalLoadingMessage: message || null }),
        setAppVersion: (version: string) => set({ appVersion: version }),
        setTheme: (theme: Theme) => {
          applyTheme(theme)
          set({ theme })
        },
        toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed })
      }),
      {
        name: 'app-storage',
        partialize: state => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed
        })
      }
    ),
    { name: 'AppStore' }
  )
)

applyTheme(detectPreferredTheme())
