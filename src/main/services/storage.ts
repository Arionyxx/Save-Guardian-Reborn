import { promises as fs } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import log from 'electron-log'

export class JsonStorage {
  private dataDir: string

  constructor() {
    this.dataDir = join(app.getPath('userData'), 'userData')
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir)
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true })
      log.info(`Created data directory: ${this.dataDir}`)
    }
  }

  private getFilePath(filename: string): string {
    return join(this.dataDir, filename)
  }

  async read<T>(filename: string): Promise<T | null> {
    await this.ensureDataDir()
    const filePath = this.getFilePath(filename)

    try {
      const data = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(data) as T
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        log.info(`File not found: ${filename}, returning null`)
        return null
      }
      log.error(`Error reading file ${filename}:`, error)
      throw error
    }
  }

  async write<T>(filename: string, data: T): Promise<void> {
    await this.ensureDataDir()
    const filePath = this.getFilePath(filename)
    const tempPath = `${filePath}.tmp`

    try {
      const jsonData = JSON.stringify(data, null, 2)
      await fs.writeFile(tempPath, jsonData, 'utf-8')
      await fs.rename(tempPath, filePath)
      log.info(`Successfully wrote file: ${filename}`)
    } catch (error) {
      log.error(`Error writing file ${filename}:`, error)
      try {
        await fs.unlink(tempPath)
      } catch {
        // Ignore cleanup errors
      }
      throw error
    }
  }

  async update<T>(filename: string, updater: (data: T | null) => T): Promise<T> {
    await this.ensureDataDir()
    const filePath = this.getFilePath(filename)
    const lockPath = `${filePath}.lock`

    try {
      // Simple file-based locking
      await fs.writeFile(lockPath, '', { flag: 'wx' })

      try {
        const currentData = await this.read<T>(filename)
        const updatedData = updater(currentData)
        await this.write(filename, updatedData)
        return updatedData
      } finally {
        await fs.unlink(lockPath).catch(() => {
          // Ignore cleanup errors
        })
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        // Lock file exists, wait and retry
        await new Promise(resolve => setTimeout(resolve, 100))
        return this.update(filename, updater)
      }
      throw error
    }
  }

  async delete(filename: string): Promise<void> {
    await this.ensureDataDir()
    const filePath = this.getFilePath(filename)

    try {
      await fs.unlink(filePath)
      log.info(`Successfully deleted file: ${filename}`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        log.info(`File not found: ${filename}, nothing to delete`)
        return
      }
      log.error(`Error deleting file ${filename}:`, error)
      throw error
    }
  }

  getDataDir(): string {
    return this.dataDir
  }
}

export const storage = new JsonStorage()
