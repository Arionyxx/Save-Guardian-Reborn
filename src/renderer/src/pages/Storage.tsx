import { useEffect, useState } from 'react'
import { FolderIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface BackupInfo {
  id: string
  gameId: string
  gameName: string
  timestamp: string
  size: string
  type: 'auto' | 'manual'
  status: 'completed' | 'in-progress' | 'failed'
}

export default function Storage() {
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [storageStats, setStorageStats] = useState({
    used: 0,
    total: 0,
    backupCount: 0,
    gameCount: 0
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [backupData, stats] = await Promise.all([
          window.electronAPI.getAllBackups(),
          window.electronAPI.getStorageStats()
        ])
        setBackups(backupData)
        setStorageStats(stats)
      } catch (error) {
        console.error('Failed to load storage data:', error)
      }
    }

    loadData()
  }, [])

  const usagePercent = storageStats.total > 0 ? (storageStats.used / storageStats.total) * 100 : 0

  return (
    <div className="h-full overflow-auto bg-base-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Storage & Backups</h1>
          <p className="mt-1 text-sm text-base-content/60">View backup history and storage usage</p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-base-content/60">Storage Used</h3>
              <div className="mt-2">
                <div className="text-3xl font-bold">
                  {(storageStats.used / 1024 / 1024 / 1024).toFixed(2)} GB
                </div>
                <p className="text-xs text-base-content/60">
                  of {(storageStats.total / 1024 / 1024 / 1024).toFixed(2)} GB
                </p>
              </div>
              <progress
                className="progress progress-primary mt-3"
                value={usagePercent}
                max="100"
              ></progress>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-base-content/60">Total Backups</h3>
              <div className="text-3xl font-bold">{storageStats.backupCount}</div>
              <p className="text-xs text-base-content/60">Across {storageStats.gameCount} games</p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-base-content/60">Last Backup</h3>
              <div className="text-xl font-bold">
                {backups.length > 0 ? new Date(backups[0].timestamp).toLocaleDateString() : 'Never'}
              </div>
              <p className="text-xs text-base-content/60">Most recent backup created</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Backup History</h2>

            {backups.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center text-center">
                <div>
                  <FolderIcon className="mx-auto size-12 text-base-content/30" />
                  <p className="mt-2 text-sm text-base-content/60">No backups yet</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Date & Time</th>
                      <th>Size</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.map(backup => (
                      <tr key={backup.id} className="hover">
                        <td className="font-medium">{backup.gameName}</td>
                        <td>
                          <div className="flex items-center gap-2 text-sm">
                            <ClockIcon className="size-4 text-base-content/60" />
                            {new Date(backup.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="text-sm">{backup.size}</td>
                        <td>
                          <span
                            className={`badge badge-sm ${backup.type === 'auto' ? 'badge-info' : 'badge-primary'}`}
                          >
                            {backup.type}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {backup.status === 'completed' && (
                              <>
                                <CheckCircleIcon className="size-5 text-success" />
                                <span className="text-sm text-success">Completed</span>
                              </>
                            )}
                            {backup.status === 'in-progress' && (
                              <>
                                <span className="loading loading-spinner loading-sm"></span>
                                <span className="text-sm">In Progress</span>
                              </>
                            )}
                            {backup.status === 'failed' && (
                              <span className="text-sm text-error">Failed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
