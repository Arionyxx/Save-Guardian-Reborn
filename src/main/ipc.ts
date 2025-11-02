import { ipcMain, app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { IpcChannel } from '../shared/types'

export function setupIpcHandlers(): void {
  ipcMain.handle(IpcChannel.GET_APP_VERSION, () => {
    return app.getVersion()
  })

  ipcMain.handle(IpcChannel.GET_ENV_VAR, (_event, key: string) => {
    return process.env[key]
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

  log.info('IPC handlers registered')
}
