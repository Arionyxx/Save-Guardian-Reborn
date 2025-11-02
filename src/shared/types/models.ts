export interface Game {
  id: string
  name: string
  icon: string
  savePath: string
  lastBackup: string | null
  backupCount: number
  saveSize: string
  status: 'active' | 'inactive' | 'error'
}

export interface Backup {
  id: string
  gameId: string
  gameName: string
  timestamp: string
  size: string
  type: 'auto' | 'manual'
  status: 'completed' | 'in-progress' | 'failed'
}

export interface StorageStats {
  used: number
  total: number
  backupCount: number
  gameCount: number
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  autoBackup: boolean
  backupInterval: number
  maxBackups: number
  backupLocation: string
}
