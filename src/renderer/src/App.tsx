import { useEffect } from 'react'
import { useAppStore, useToastStore } from './stores'
import { AppShell } from './components/layout'
import { ToastContainer } from './components/primitives'
import Dashboard from './pages/Dashboard'

function App() {
  const { setLoading, setAppVersion } = useAppStore()
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true, 'Initializing application...')
        const version = await window.electronAPI.getAppVersion()
        setAppVersion(version)
        await window.electronAPI.logInfo('App initialized successfully')
      } catch (error) {
        console.error('Failed to initialize app:', error)
        await window.electronAPI.logError('App initialization failed', error as Error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [setLoading, setAppVersion])

  return (
    <>
      <AppShell>
        <Dashboard />
      </AppShell>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

export default App
