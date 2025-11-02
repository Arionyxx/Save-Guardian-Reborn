import { useEffect, useState, useCallback } from 'react'
import {
  FolderIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useToastStore } from '../stores'

interface DetectedSave {
  id: string
  gameName: string
  savePath: string
  files: {
    name: string
    path: string
    size: string
    lastModified: string
    extension: string
  }[]
  totalSize: string
  fileCount: number
}

export default function Games() {
  const [detectedGames, setDetectedGames] = useState<DetectedSave[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState('')
  const { addToast } = useToastStore()

  const scanForSaves = useCallback(async () => {
    try {
      setIsScanning(true)
      setScanProgress('Scanning game save directories...')
      addToast('info', 'Starting save scan...')

      const saves = await window.electronAPI.scanGameSaves()
      setDetectedGames(saves)

      setScanProgress('')
      addToast('success', `Found ${saves.length} games with saves`)
    } catch (error) {
      console.error('Failed to scan for saves:', error)
      addToast('error', 'Failed to scan for game saves')
      setScanProgress('')
    } finally {
      setIsScanning(false)
    }
  }, [addToast])

  useEffect(() => {
    scanForSaves()
  }, [scanForSaves])

  return (
    <div className="h-full overflow-auto bg-base-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Detected Games</h1>
            <p className="mt-1 text-sm text-base-content/60">
              Game saves found in common Windows directories
            </p>
          </div>
          <button onClick={scanForSaves} disabled={isScanning} className="btn btn-primary gap-2">
            <ArrowPathIcon className={`size-5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Rescan'}
          </button>
        </div>

        {isScanning && (
          <div className="mb-6 rounded-lg bg-base-200 p-4">
            <div className="flex items-center gap-3">
              <ArrowPathIcon className="size-5 animate-spin text-primary" />
              <span className="text-sm font-medium">{scanProgress}</span>
            </div>
            <progress className="progress progress-primary mt-2 w-full"></progress>
          </div>
        )}

        {!isScanning && detectedGames.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-base-300 bg-base-200">
            <div className="text-center">
              <FolderIcon className="mx-auto size-16 text-base-content/30" />
              <h3 className="mt-4 text-lg font-semibold">No game saves detected</h3>
              <p className="mt-2 text-sm text-base-content/60">
                Try adding custom scan paths in Settings or ensure your games are installed
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {detectedGames.map(game => (
            <div
              key={game.id}
              className="card bg-base-200 shadow-xl transition-all hover:shadow-2xl"
            >
              <div className="card-body">
                <h2 className="card-title text-xl">{game.gameName}</h2>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <FolderIcon className="mt-0.5 size-4 shrink-0 text-base-content/60" />
                    <span className="break-all text-base-content/80">{game.savePath}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="size-4 text-base-content/60" />
                    <span className="text-base-content/80">
                      {game.fileCount} file{game.fileCount !== 1 ? 's' : ''} ({game.totalSize})
                    </span>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="max-h-40 space-y-1 overflow-y-auto">
                  <p className="text-xs font-semibold uppercase text-base-content/60">Save Files</p>
                  {game.files.slice(0, 5).map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 rounded bg-base-100 p-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium" title={file.name}>
                          {file.name}
                        </p>
                        <div className="mt-1 flex gap-3 text-[10px] text-base-content/60">
                          <span>{file.size}</span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="size-3" />
                            {file.lastModified}
                          </span>
                        </div>
                      </div>
                      <span className="badge badge-sm shrink-0">{file.extension}</span>
                    </div>
                  ))}
                  {game.files.length > 5 && (
                    <p className="pt-1 text-xs text-base-content/60">
                      + {game.files.length - 5} more file{game.files.length - 5 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="card-actions mt-4 justify-end">
                  <button className="btn btn-primary btn-sm">Backup Now</button>
                  <button className="btn btn-ghost btn-sm">View All Files</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
