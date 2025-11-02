import { config } from 'dotenv'
import { join } from 'path'
import log from 'electron-log'

export function loadEnvironment(): void {
  const envPath = join(process.cwd(), '.env')
  const result = config({ path: envPath })

  if (result.error) {
    log.warn('No .env file found or error loading it:', result.error.message)
  } else {
    log.info('Environment variables loaded successfully')
  }

  const requiredVars = ['IGDB_CLIENT_ID', 'IGDB_CLIENT_SECRET', 'BOLT_API_KEY']
  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    log.warn(
      `Missing environment variables: ${missingVars.join(', ')}. Some features may not work properly.`
    )
  }
}
