import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import fg from 'fast-glob'
import log from 'electron-log'
import type { DetectedSave, DetectedSaveFile } from '../../shared/types/models'

const SAVE_EXTENSIONS = [
  '.sav',
  '.save',
  '.savegame',
  '.dat',
  '.profile',
  '.json',
  '.xml',
  '.ini',
  '.slot',
  '.slot1',
  '.slot2',
  '.slot3',
  '.slot4',
  '.slot5'
]

function getCommonSavePaths(): string[] {
  const username = os.userInfo().username
  const homedir = os.homedir()

  if (process.platform === 'win32') {
    return [
      path.join('C:', 'Users', username, 'Documents', 'My Games'),
      path.join('C:', 'Users', username, 'AppData', 'Roaming'),
      path.join('C:', 'Users', username, 'AppData', 'Local'),
      path.join('C:', 'Users', username, 'Saved Games'),
      path.join('C:', 'Program Files (x86)', 'Steam', 'userdata')
    ]
  } else if (process.platform === 'darwin') {
    return [
      path.join(homedir, 'Library', 'Application Support'),
      path.join(homedir, 'Documents'),
      path.join(homedir, '.local', 'share')
    ]
  } else {
    return [
      path.join(homedir, '.local', 'share'),
      path.join(homedir, '.config'),
      path.join(homedir, 'Documents')
    ]
  }
}

async function formatFileSize(bytes: number): Promise<string> {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

async function getFileStats(filePath: string): Promise<DetectedSaveFile | null> {
  try {
    const stats = await fs.stat(filePath)
    const size = await formatFileSize(stats.size)
    const lastModified = stats.mtime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    return {
      name: path.basename(filePath),
      path: filePath,
      size,
      lastModified,
      extension: path.extname(filePath)
    }
  } catch (error) {
    log.warn(`Failed to get stats for file: ${filePath}`, error)
    return null
  }
}

async function scanDirectory(dirPath: string): Promise<DetectedSaveFile[]> {
  try {
    await fs.access(dirPath)

    const patterns = SAVE_EXTENSIONS.map(ext => `**/*${ext}`)
    const files = await fg(patterns, {
      cwd: dirPath,
      absolute: true,
      deep: 5,
      ignore: [
        '**/node_modules/**',
        '**/cache/**',
        '**/temp/**',
        '**/tmp/**',
        '**/.git/**',
        '**/backup/**'
      ],
      onlyFiles: true,
      suppressErrors: true
    })

    const fileStats = await Promise.all(files.map(file => getFileStats(file)))
    return fileStats.filter((stat): stat is DetectedSaveFile => stat !== null)
  } catch (error) {
    log.warn(`Failed to scan directory: ${dirPath}`, error)
    return []
  }
}

function groupFilesByGame(files: DetectedSaveFile[]): Map<string, DetectedSaveFile[]> {
  const gameGroups = new Map<string, DetectedSaveFile[]>()

  for (const file of files) {
    const parts = file.path.split(path.sep)
    let gameName = 'Unknown Game'

    if (process.platform === 'win32') {
      if (file.path.includes('My Games')) {
        const myGamesIndex = parts.findIndex(p => p === 'My Games')
        if (myGamesIndex !== -1 && myGamesIndex + 1 < parts.length) {
          gameName = parts[myGamesIndex + 1]
        }
      } else if (file.path.includes('AppData')) {
        const appDataIndex = parts.findIndex(p => p === 'AppData')
        if (appDataIndex !== -1 && appDataIndex + 2 < parts.length) {
          gameName = parts[appDataIndex + 2]
        }
      } else if (file.path.includes('Saved Games')) {
        const savedGamesIndex = parts.findIndex(p => p === 'Saved Games')
        if (savedGamesIndex !== -1 && savedGamesIndex + 1 < parts.length) {
          gameName = parts[savedGamesIndex + 1]
        }
      } else if (file.path.includes('userdata')) {
        const userdataIndex = parts.findIndex(p => p === 'userdata')
        if (userdataIndex !== -1 && userdataIndex + 2 < parts.length) {
          gameName = `Steam Game ${parts[userdataIndex + 2]}`
        }
      }
    }

    if (!gameGroups.has(gameName)) {
      gameGroups.set(gameName, [])
    }
    const gameFiles = gameGroups.get(gameName)
    if (gameFiles) {
      gameFiles.push(file)
    }
  }

  return gameGroups
}

export async function scanGameSaves(customPaths: string[] = []): Promise<DetectedSave[]> {
  log.info('Starting game save scan...')

  const scanPaths = [...getCommonSavePaths(), ...customPaths]
  const allFiles: DetectedSaveFile[] = []

  for (const scanPath of scanPaths) {
    log.info(`Scanning: ${scanPath}`)
    const files = await scanDirectory(scanPath)
    allFiles.push(...files)
  }

  log.info(`Found ${allFiles.length} save files`)

  const gameGroups = groupFilesByGame(allFiles)
  const detectedGames: DetectedSave[] = []

  for (const [gameName, files] of gameGroups.entries()) {
    if (files.length === 0) continue

    const savePath = path.dirname(files[0].path)

    const totalSizeBytes = files.reduce((sum, file) => {
      const match = file.size.match(/(\d+\.?\d*)\s*(\w+)/)
      if (!match) return sum
      const [, value, unit] = match
      const val = parseFloat(value)
      const multipliers: Record<string, number> = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024
      }
      return sum + val * (multipliers[unit] || 1)
    }, 0)

    const totalSize = await formatFileSize(totalSizeBytes)

    detectedGames.push({
      id: Buffer.from(gameName).toString('base64').replace(/=/g, ''),
      gameName,
      savePath,
      files: files.sort((a, b) => b.lastModified.localeCompare(a.lastModified)),
      totalSize,
      fileCount: files.length
    })
  }

  log.info(`Detected ${detectedGames.length} games`)
  return detectedGames.sort((a, b) => a.gameName.localeCompare(b.gameName))
}
