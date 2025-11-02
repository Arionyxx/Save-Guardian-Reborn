import { ipcMain, app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { IpcChannel } from '../shared/types'
import { dataService } from './services/data'
import { scanGameSaves } from './services/saveScanner'

export function setupIpcHandlers(): void {
  ipcMain.handle(IpcChannel.GET_APP_VERSION, () => {
    return app.getVersion()
  })

  ipcMain.handle(IpcChannel.LOG_INFO, (_event, message: string) => {
    log.info(message)
  })

  ipcMain.handle(IpcChannel.LOG_ERROR, (_event, message: string, error?: Error) => {
    if (error) {
      log.error(message, error)
    } else {
      log.error(message)
    }
  })

  ipcMain.handle(IpcChannel.LOG_WARN, (_event, message: string) => {
    log.warn(message)
  })

  ipcMain.handle(IpcChannel.WINDOW_MINIMIZE, () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      window.minimize()
    }
  })

  ipcMain.handle(IpcChannel.WINDOW_MAXIMIZE, () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
    }
  })

  ipcMain.handle(IpcChannel.WINDOW_CLOSE, () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      window.close()
    }
  })

  // Games
  ipcMain.handle(IpcChannel.GET_ALL_GAMES, async () => {
    return await dataService.getAllGames()
  })

  ipcMain.handle(IpcChannel.GET_GAME, async (_event, id: string) => {
    return await dataService.getGame(id)
  })

  ipcMain.handle(IpcChannel.CREATE_GAME, async (_event, game) => {
    return await dataService.createGame(game)
  })

  ipcMain.handle(IpcChannel.UPDATE_GAME, async (_event, id: string, updates) => {
    return await dataService.updateGame(id, updates)
  })

  ipcMain.handle(IpcChannel.DELETE_GAME, async (_event, id: string) => {
    return await dataService.deleteGame(id)
  })

  // Backups
  ipcMain.handle(IpcChannel.GET_ALL_BACKUPS, async () => {
    return await dataService.getAllBackups()
  })

  ipcMain.handle(IpcChannel.GET_BACKUPS_BY_GAME, async (_event, gameId: string) => {
    return await dataService.getBackupsByGameId(gameId)
  })

  ipcMain.handle(IpcChannel.GET_BACKUP, async (_event, id: string) => {
    return await dataService.getBackup(id)
  })

  ipcMain.handle(IpcChannel.CREATE_BACKUP, async (_event, backup) => {
    return await dataService.createBackup(backup)
  })

  ipcMain.handle(IpcChannel.UPDATE_BACKUP, async (_event, id: string, updates) => {
    return await dataService.updateBackup(id, updates)
  })

  ipcMain.handle(IpcChannel.DELETE_BACKUP, async (_event, id: string) => {
    return await dataService.deleteBackup(id)
  })

  // Settings
  ipcMain.handle(IpcChannel.GET_SETTINGS, async () => {
    return await dataService.getSettings()
  })

  ipcMain.handle(IpcChannel.UPDATE_SETTINGS, async (_event, updates) => {
    return await dataService.updateSettings(updates)
  })

  // Stats
  ipcMain.handle(IpcChannel.GET_STORAGE_STATS, async () => {
    return await dataService.getStorageStats()
  })

  // Save Scanning
  ipcMain.handle(IpcChannel.SCAN_GAME_SAVES, async () => {
    const settings = await dataService.getSettings()
    const customPaths = (settings as { scanPaths?: string[] }).scanPaths || []
    return await scanGameSaves(customPaths)
  })

  log.info('IPC handlers registered')
}
