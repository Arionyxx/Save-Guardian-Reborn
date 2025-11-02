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

  closeWindow: () => ipcRenderer.invoke(IpcChannel.WINDOW_CLOSE)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

console.log('Preload script loaded - Context isolation enabled')
