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
  GET_ENV_VAR = 'app:get-env',
  LOG_INFO = 'log:info',
  LOG_ERROR = 'log:error',
  LOG_WARN = 'log:warn',
  WINDOW_MINIMIZE = 'window:minimize',
  WINDOW_MAXIMIZE = 'window:maximize',
  WINDOW_CLOSE = 'window:close'
}

export interface ElectronAPI {
  getAppVersion: () => Promise<string>
  getEnvVar: (key: string) => Promise<string | undefined>
  logInfo: (message: string) => Promise<void>
  logError: (message: string, error?: Error) => Promise<void>
  logWarn: (message: string) => Promise<void>
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
