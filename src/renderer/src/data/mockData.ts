import { Game, Backup, StorageStats } from '@shared/types/models'

export type { Game, Backup, StorageStats }

export const mockGames: Game[] = [
  {
    id: '1',
    name: 'Cyberpunk 2077',
    icon: '🎮',
    savePath: 'C:\\Users\\Player\\Saved Games\\CD Projekt Red\\Cyberpunk 2077',
    lastBackup: '2024-01-15T10:30:00Z',
    backupCount: 12,
    saveSize: '245 MB',
    status: 'active'
  },
  {
    id: '2',
    name: 'The Witcher 3',
    icon: '⚔️',
    savePath: 'C:\\Users\\Player\\Documents\\The Witcher 3',
    lastBackup: '2024-01-14T18:45:00Z',
    backupCount: 24,
    saveSize: '180 MB',
    status: 'active'
  },
  {
    id: '3',
    name: 'Elden Ring',
    icon: '🗡️',
    savePath: 'C:\\Users\\Player\\AppData\\Roaming\\EldenRing',
    lastBackup: '2024-01-10T09:15:00Z',
    backupCount: 8,
    saveSize: '120 MB',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Baldurs Gate 3',
    icon: '🐉',
    savePath: 'C:\\Users\\Player\\AppData\\Local\\Larian Studios\\Baldurs Gate 3',
    lastBackup: '2024-01-15T12:00:00Z',
    backupCount: 15,
    saveSize: '350 MB',
    status: 'active'
  },
  {
    id: '5',
    name: 'Starfield',
    icon: '🚀',
    savePath: 'C:\\Users\\Player\\Documents\\My Games\\Starfield',
    lastBackup: null,
    backupCount: 0,
    saveSize: '0 MB',
    status: 'error'
  }
]

export const mockBackups: Backup[] = [
  {
    id: 'b1',
    gameId: '1',
    gameName: 'Cyberpunk 2077',
    timestamp: '2024-01-15T10:30:00Z',
    size: '245 MB',
    type: 'auto',
    status: 'completed'
  },
  {
    id: 'b2',
    gameId: '2',
    gameName: 'The Witcher 3',
    timestamp: '2024-01-14T18:45:00Z',
    size: '180 MB',
    type: 'manual',
    status: 'completed'
  },
  {
    id: 'b3',
    gameId: '4',
    gameName: 'Baldurs Gate 3',
    timestamp: '2024-01-15T12:00:00Z',
    size: '350 MB',
    type: 'auto',
    status: 'completed'
  },
  {
    id: 'b4',
    gameId: '3',
    gameName: 'Elden Ring',
    timestamp: '2024-01-10T09:15:00Z',
    size: '120 MB',
    type: 'manual',
    status: 'completed'
  }
]

export const mockStorageStats: StorageStats = {
  used: 245,
  total: 500,
  backupCount: 59,
  gameCount: 5
}

export function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}
