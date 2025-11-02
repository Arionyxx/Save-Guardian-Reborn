export interface IpcRequest<T = unknown> {
  id: string
  channel: string
  data?: T
}

export interface IpcResponse<T = unknown> {
  id: string
  success: boolean
  data?: T
  error?: string
}

export enum IpcChannel {
  GET_APP_VERSION = 'app:get-version',
  LOG_INFO = 'log:info',
  LOG_ERROR = 'log:error',
  LOG_WARN = 'log:warn',
  WINDOW_MINIMIZE = 'window:minimize',
  WINDOW_MAXIMIZE = 'window:maximize',
  WINDOW_CLOSE = 'window:close',
  // Games
  GET_ALL_GAMES = 'games:get-all',
  GET_GAME = 'games:get',
  CREATE_GAME = 'games:create',
  UPDATE_GAME = 'games:update',
  DELETE_GAME = 'games:delete',
  // Backups
  GET_ALL_BACKUPS = 'backups:get-all',
  GET_BACKUPS_BY_GAME = 'backups:get-by-game',
  GET_BACKUP = 'backups:get',
  CREATE_BACKUP = 'backups:create',
  UPDATE_BACKUP = 'backups:update',
  DELETE_BACKUP = 'backups:delete',
  // Settings
  GET_SETTINGS = 'settings:get',
  UPDATE_SETTINGS = 'settings:update',
  // Stats
  GET_STORAGE_STATS = 'stats:get-storage'
}

export interface ElectronAPI {
  getAppVersion: () => Promise<string>
  logInfo: (message: string) => Promise<void>
  logError: (message: string, error?: Error) => Promise<void>
  logWarn: (message: string) => Promise<void>
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  // Games
  getAllGames: () => Promise<import('./models').Game[]>
  getGame: (id: string) => Promise<import('./models').Game | null>
  createGame: (game: Omit<import('./models').Game, 'id'>) => Promise<import('./models').Game>
  updateGame: (
    id: string,
    updates: Partial<Omit<import('./models').Game, 'id'>>
  ) => Promise<import('./models').Game | null>
  deleteGame: (id: string) => Promise<boolean>
  // Backups
  getAllBackups: () => Promise<import('./models').Backup[]>
  getBackupsByGame: (gameId: string) => Promise<import('./models').Backup[]>
  getBackup: (id: string) => Promise<import('./models').Backup | null>
  createBackup: (
    backup: Omit<import('./models').Backup, 'id'>
  ) => Promise<import('./models').Backup>
  updateBackup: (
    id: string,
    updates: Partial<Omit<import('./models').Backup, 'id'>>
  ) => Promise<import('./models').Backup | null>
  deleteBackup: (id: string) => Promise<boolean>
  // Settings
  getSettings: () => Promise<import('./models').AppSettings>
  updateSettings: (
    updates: Partial<import('./models').AppSettings>
  ) => Promise<import('./models').AppSettings>
  // Stats
  getStorageStats: () => Promise<import('./models').StorageStats>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
