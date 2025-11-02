import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore, useToastStore } from './stores'
import { AppShell } from './components/layout'
import { ToastContainer } from './components/primitives'
import { Dashboard, Games, Storage, Analytics, Settings } from './pages'

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
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Router>
  )
}

export default App
