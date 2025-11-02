import log from 'electron-log'

export function loadEnvironment(): void {
  // Simple environment check - no external API credentials required
  log.info('Application running in local-only mode')

  // Log current environment mode
  const nodeEnv = process.env.NODE_ENV || 'production'
  log.info(`Environment: ${nodeEnv}`)
}
