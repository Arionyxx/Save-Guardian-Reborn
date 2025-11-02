import { useEffect } from 'react'
import { useAppStore } from './stores/appStore'
import Header from './components/Header'
import WelcomeCard from './components/WelcomeCard'

function App() {
  const { isLoading, setLoading, setAppVersion } = useAppStore()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="text-primary loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container bg-base-200">
      <Header />
      <main className="flex flex-1 items-center justify-center p-8">
        <WelcomeCard />
      </main>
    </div>
  )
}

export default App
