import { useEffect, useState } from 'react'
import { Cog6ToothIcon, FolderIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useToastStore } from '../stores'

interface SettingsData {
  theme: 'light' | 'dark' | 'system'
  autoBackup: boolean
  backupInterval: number
  maxBackups: number
  backupLocation: string
  scanPaths: string[]
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'system',
    autoBackup: true,
    backupInterval: 60,
    maxBackups: 10,
    backupLocation: '',
    scanPaths: []
  })
  const [newScanPath, setNewScanPath] = useState('')
  const { addToast } = useToastStore()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await window.electronAPI.getSettings()
        setSettings(prev => ({
          ...prev,
          ...data,
          scanPaths: (data as { scanPaths?: string[] }).scanPaths || []
        }))
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }

    loadSettings()
  }, [])

  const handleSaveSettings = async () => {
    try {
      await window.electronAPI.updateSettings(settings)
      addToast('success', 'Settings saved successfully')
    } catch (error) {
      console.error('Failed to save settings:', error)
      addToast('error', 'Failed to save settings')
    }
  }

  const addScanPath = () => {
    if (newScanPath && !settings.scanPaths.includes(newScanPath)) {
      setSettings(prev => ({
        ...prev,
        scanPaths: [...prev.scanPaths, newScanPath]
      }))
      setNewScanPath('')
    }
  }

  const removeScanPath = (path: string) => {
    setSettings(prev => ({
      ...prev,
      scanPaths: prev.scanPaths.filter(p => p !== path)
    }))
  }

  return (
    <div className="h-full overflow-auto bg-base-100">
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Configure app preferences and scan paths
          </p>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <Cog6ToothIcon className="size-6" />
                General Settings
              </h2>

              <div className="mt-4 space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={settings.autoBackup}
                      onChange={e =>
                        setSettings(prev => ({ ...prev, autoBackup: e.target.checked }))
                      }
                    />
                    <div>
                      <span className="label-text font-semibold">Enable Auto Backup</span>
                      <p className="text-xs text-base-content/60">
                        Automatically backup game saves at regular intervals
                      </p>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Backup Interval (minutes)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={settings.backupInterval}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, backupInterval: parseInt(e.target.value) }))
                    }
                    min="5"
                    max="1440"
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      How often to create automatic backups
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Maximum Backups per Game</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={settings.maxBackups}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, maxBackups: parseInt(e.target.value) }))
                    }
                    min="1"
                    max="100"
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Older backups will be deleted automatically
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <FolderIcon className="size-6" />
                Custom Scan Paths
              </h2>
              <p className="text-sm text-base-content/60">
                Add additional directories to scan for game saves
              </p>

              <div className="mt-4">
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-semibold uppercase text-base-content/60">
                    Default Scan Locations:
                  </p>
                  <ul className="space-y-1 text-xs text-base-content/70">
                    <li>• C:\Users\[Username]\Documents\My Games</li>
                    <li>• C:\Users\[Username]\AppData\Roaming</li>
                    <li>• C:\Users\[Username]\AppData\Local</li>
                    <li>• C:\Users\[Username]\Saved Games</li>
                    <li>• C:\Program Files (x86)\Steam\userdata</li>
                  </ul>
                </div>

                <div className="divider">Custom Paths</div>

                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder="C:\Games\CustomPath"
                    value={newScanPath}
                    onChange={e => setNewScanPath(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addScanPath()}
                  />
                  <button onClick={addScanPath} className="btn btn-primary gap-2">
                    <PlusIcon className="size-5" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {settings.scanPaths.length === 0 ? (
                    <div className="rounded-lg bg-base-100 p-4 text-center text-sm text-base-content/60">
                      No custom scan paths added
                    </div>
                  ) : (
                    settings.scanPaths.map((path, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-base-100 p-3"
                      >
                        <span className="break-all text-sm">{path}</span>
                        <button
                          onClick={() => removeScanPath(path)}
                          className="btn btn-ghost btn-sm ml-2"
                        >
                          <XMarkIcon className="size-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost">Reset to Defaults</button>
            <button onClick={handleSaveSettings} className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
