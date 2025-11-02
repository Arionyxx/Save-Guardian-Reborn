import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannel, ElectronAPI } from '../shared/types'

const electronAPI: ElectronAPI = {
  getAppVersion: () => ipcRenderer.invoke(IpcChannel.GET_APP_VERSION),

  logInfo: (message: string) => ipcRenderer.invoke(IpcChannel.LOG_INFO, message),

  logError: (message: string, error?: Error) =>
    ipcRenderer.invoke(IpcChannel.LOG_ERROR, message, error),

  logWarn: (message: string) => ipcRenderer.invoke(IpcChannel.LOG_WARN, message),

  minimizeWindow: () => ipcRenderer.invoke(IpcChannel.WINDOW_MINIMIZE),

  maximizeWindow: () => ipcRenderer.invoke(IpcChannel.WINDOW_MAXIMIZE),

  closeWindow: () => ipcRenderer.invoke(IpcChannel.WINDOW_CLOSE),

  // Games
  getAllGames: () => ipcRenderer.invoke(IpcChannel.GET_ALL_GAMES),
  getGame: (id: string) => ipcRenderer.invoke(IpcChannel.GET_GAME, id),
  createGame: game => ipcRenderer.invoke(IpcChannel.CREATE_GAME, game),
  updateGame: (id: string, updates) => ipcRenderer.invoke(IpcChannel.UPDATE_GAME, id, updates),
  deleteGame: (id: string) => ipcRenderer.invoke(IpcChannel.DELETE_GAME, id),

  // Backups
  getAllBackups: () => ipcRenderer.invoke(IpcChannel.GET_ALL_BACKUPS),
  getBackupsByGame: (gameId: string) => ipcRenderer.invoke(IpcChannel.GET_BACKUPS_BY_GAME, gameId),
  getBackup: (id: string) => ipcRenderer.invoke(IpcChannel.GET_BACKUP, id),
  createBackup: backup => ipcRenderer.invoke(IpcChannel.CREATE_BACKUP, backup),
  updateBackup: (id: string, updates) => ipcRenderer.invoke(IpcChannel.UPDATE_BACKUP, id, updates),
  deleteBackup: (id: string) => ipcRenderer.invoke(IpcChannel.DELETE_BACKUP, id),

  // Settings
  getSettings: () => ipcRenderer.invoke(IpcChannel.GET_SETTINGS),
  updateSettings: updates => ipcRenderer.invoke(IpcChannel.UPDATE_SETTINGS, updates),

  // Stats
  getStorageStats: () => ipcRenderer.invoke(IpcChannel.GET_STORAGE_STATS)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

console.log('Preload script loaded - Context isolation enabled')
