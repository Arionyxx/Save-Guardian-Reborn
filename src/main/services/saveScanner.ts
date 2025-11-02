import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import fg from 'fast-glob'
import log from 'electron-log'
import type { DetectedSave, DetectedSaveFile } from '../../shared/types/models'

// Expanded save file extensions and patterns
const SAVE_EXTENSIONS = [
  '.sav',
  '.save',
  '.savegame',
  '.dat',
  '.profile',
  '.slot',
  '.ess',
  '.fos',
  '.gamesave',
  '.sg',
  '.bak',
  '.backup',
  '.tmp',
  '.autosave',
  '.svd',
  '.savdata',
  '.usr'
]

// Wildcard patterns to catch variations and numbered saves
const SAVE_PATTERNS = [
  '*.sav',
  '*.sav[0-9]',
  '*.sav[0-9][0-9]',
  '*.save',
  '*.save[0-9]',
  '*.save[0-9][0-9]',
  '*.savegame',
  '*.profile',
  '*.slot',
  '*.slot[0-9]',
  '*.slot[0-9][0-9]',
  '*.ess',
  '*.fos',
  '*.gamesave',
  '*.sg',
  '*.bak',
  '*.backup',
  '*.tmp',
  '*.autosave',
  'save*.dat',
  'save*.sav',
  'save_*.sav',
  'save[0-9]*.dat',
  'save[0-9]*.sav'
]

// Folders that commonly contain saves
const SAVE_FOLDER_NAMES = ['save', 'saves', 'SaveData', 'SaveGames', 'Saved', 'savedgames']

// Minimum file size (1KB) to avoid system files
const MIN_FILE_SIZE = 1024

// Maximum scan depth for recursive directory search
const MAX_SCAN_DEPTH = 10

function getCommonSavePaths(): string[] {
  const username = os.userInfo().username
  const homedir = os.homedir()

  if (process.platform === 'win32') {
    return [
      // Standard save locations
      path.join('C:', 'Users', username, 'Documents', 'My Games'),
      path.join('C:', 'Users', username, 'Documents'), // Games may save directly here
      path.join('C:', 'Users', username, 'AppData', 'Roaming'),
      path.join('C:', 'Users', username, 'AppData', 'Local'),
      path.join('C:', 'Users', username, 'AppData', 'LocalLow'), // Unity games
      path.join('C:', 'Users', username, 'Saved Games'),
      // OneDrive folders (if synced)
      path.join('C:', 'Users', username, 'OneDrive', 'Documents'),
      path.join('C:', 'Users', username, 'OneDrive', 'Documents', 'My Games'),
      // Steam
      path.join('C:', 'Program Files (x86)', 'Steam', 'userdata'),
      // ProgramData (some games store here)
      path.join('C:', 'ProgramData')
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

    // Skip very small files (likely not actual save files)
    if (stats.size < MIN_FILE_SIZE) {
      log.debug(`Skipping small file (${stats.size} bytes): ${filePath}`)
      return null
    }

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
    log.info(`  → Scanning directory: ${dirPath}`)

    // Combine extension patterns and wildcard patterns
    const extensionPatterns = SAVE_EXTENSIONS.map(ext => `**/*${ext}`)
    const wildcardPatterns = SAVE_PATTERNS.map(pattern => `**/${pattern}`)
    const allPatterns = [...extensionPatterns, ...wildcardPatterns]

    log.debug(`  → Using ${allPatterns.length} patterns at depth ${MAX_SCAN_DEPTH}`)

    const files = await fg(allPatterns, {
      cwd: dirPath,
      absolute: true,
      deep: MAX_SCAN_DEPTH,
      ignore: [
        '**/node_modules/**',
        '**/cache/**',
        '**/Cache/**',
        '**/temp/**',
        '**/tmp/**',
        '**/Temp/**',
        '**/.git/**',
        '**/backup/**',
        '**/Backup/**',
        '**/recycler/**',
        '**/Recycler/**',
        '**/$RECYCLE.BIN/**',
        '**/System Volume Information/**',
        '**/Windows/**',
        '**/Microsoft/**',
        '**/Adobe/**'
      ],
      onlyFiles: true,
      suppressErrors: true,
      caseSensitiveMatch: false
    })

    log.info(`  → Found ${files.length} potential save files`)

    const fileStats = await Promise.all(files.map(file => getFileStats(file)))
    const validFiles = fileStats.filter((stat): stat is DetectedSaveFile => stat !== null)

    log.info(`  → ${validFiles.length} files passed filtering (>${MIN_FILE_SIZE} bytes)`)

    return validFiles
  } catch (error) {
    log.warn(`  → Failed to scan directory: ${dirPath}`, error)
    return []
  }
}

function groupFilesByGame(files: DetectedSaveFile[]): Map<string, DetectedSaveFile[]> {
  const gameGroups = new Map<string, DetectedSaveFile[]>()

  for (const file of files) {
    const parts = file.path.split(path.sep)
    let gameName = 'Unknown Game'

    if (process.platform === 'win32') {
      // Strategy 1: Look for known folder patterns
      if (file.path.includes('My Games')) {
        const myGamesIndex = parts.findIndex(p => p === 'My Games')
        if (myGamesIndex !== -1 && myGamesIndex + 1 < parts.length) {
          gameName = parts[myGamesIndex + 1]
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
      } else if (file.path.includes('AppData')) {
        // For AppData paths, look for the folder after Local/Roaming/LocalLow
        const appDataIndex = parts.findIndex(p => p === 'AppData')
        if (appDataIndex !== -1 && appDataIndex + 2 < parts.length) {
          const folderAfterAppData = parts[appDataIndex + 2]

          // Check if the next folder is a save folder - if so, go one level up
          const nextFolder = parts[appDataIndex + 3]
          if (
            nextFolder &&
            SAVE_FOLDER_NAMES.some(
              saveFolderName =>
                nextFolder.toLowerCase() === saveFolderName.toLowerCase() ||
                nextFolder.toLowerCase().includes('save')
            )
          ) {
            gameName = folderAfterAppData
          } else {
            // Otherwise use the folder after Local/Roaming/LocalLow
            gameName = folderAfterAppData
          }
        }
      } else if (file.path.includes('ProgramData')) {
        const programDataIndex = parts.findIndex(p => p === 'ProgramData')
        if (programDataIndex !== -1 && programDataIndex + 1 < parts.length) {
          gameName = parts[programDataIndex + 1]
        }
      } else if (file.path.includes('Documents')) {
        // Games saving directly to Documents
        const documentsIndex = parts.findIndex(p => p === 'Documents')
        if (documentsIndex !== -1 && documentsIndex + 1 < parts.length) {
          const folderAfterDocuments = parts[documentsIndex + 1]
          // Skip if it's directly inside Documents with no game folder
          if (folderAfterDocuments !== path.basename(file.path)) {
            gameName = folderAfterDocuments
          }
        }
      }

      // Strategy 2: If still unknown, look for save folder patterns and use parent
      if (gameName === 'Unknown Game') {
        const fileDir = path.dirname(file.path)
        const dirParts = fileDir.split(path.sep)
        for (let i = dirParts.length - 1; i >= 0; i--) {
          const currentFolder = dirParts[i]
          const isSaveFolder = SAVE_FOLDER_NAMES.some(
            saveFolderName =>
              currentFolder.toLowerCase() === saveFolderName.toLowerCase() ||
              currentFolder.toLowerCase().includes('save')
          )

          if (isSaveFolder && i > 0) {
            // Use the folder before the save folder as game name
            gameName = dirParts[i - 1]
            break
          }
        }
      }

      // Strategy 3: Use the parent folder of the file as last resort
      if (gameName === 'Unknown Game') {
        const parentFolder = path.basename(path.dirname(file.path))
        if (parentFolder && parentFolder !== 'Documents' && parentFolder !== 'ProgramData') {
          gameName = parentFolder
        }
      }
    } else {
      // For non-Windows platforms, use parent directory
      gameName = path.basename(path.dirname(file.path))
    }

    // Clean up game name
    gameName = gameName.trim()
    if (!gameName || gameName === '.' || gameName === '..') {
      gameName = 'Unknown Game'
    }

    if (!gameGroups.has(gameName)) {
      gameGroups.set(gameName, [])
    }
    const gameFiles = gameGroups.get(gameName)
    if (gameFiles) {
      gameFiles.push(file)
    }
  }

  log.info(`Grouped ${files.length} files into ${gameGroups.size} games`)
  for (const [gameName, gameFiles] of gameGroups.entries()) {
    log.debug(`  • ${gameName}: ${gameFiles.length} files`)
  }

  return gameGroups
}

export async function scanGameSaves(customPaths: string[] = []): Promise<DetectedSave[]> {
  log.info('═══════════════════════════════════════════════════')
  log.info('Starting game save scan...')
  log.info('═══════════════════════════════════════════════════')

  const commonPaths = getCommonSavePaths()
  const scanPaths = [...commonPaths, ...customPaths]

  log.info(`Scan configuration:`)
  log.info(`  • Scan depth: ${MAX_SCAN_DEPTH} levels`)
  log.info(`  • Min file size: ${MIN_FILE_SIZE} bytes (${(MIN_FILE_SIZE / 1024).toFixed(1)} KB)`)
  log.info(`  • File extensions: ${SAVE_EXTENSIONS.length}`)
  log.info(`  • Wildcard patterns: ${SAVE_PATTERNS.length}`)
  log.info(``)
  log.info(`Scanning ${scanPaths.length} locations:`)
  scanPaths.forEach((p, i) => {
    const isCustom = i >= commonPaths.length
    log.info(`  ${i + 1}. ${p}${isCustom ? ' (custom)' : ''}`)
  })
  log.info(``)

  const allFiles: DetectedSaveFile[] = []
  let scannedCount = 0
  let accessibleCount = 0

  for (const scanPath of scanPaths) {
    scannedCount++
    try {
      await fs.access(scanPath)
      accessibleCount++
      const files = await scanDirectory(scanPath)
      allFiles.push(...files)
    } catch {
      log.warn(`  ✗ Path not accessible: ${scanPath}`)
    }
  }

  log.info(``)
  log.info(`Scan summary:`)
  log.info(`  • Locations scanned: ${scannedCount}`)
  log.info(`  • Locations accessible: ${accessibleCount}`)
  log.info(`  • Total save files found: ${allFiles.length}`)
  log.info(``)

  if (allFiles.length === 0) {
    log.warn('No save files detected in any scanned location')
    log.info('═══════════════════════════════════════════════════')
    return []
  }

  log.info('Grouping files by game...')
  const gameGroups = groupFilesByGame(allFiles)
  const detectedGames: DetectedSave[] = []

  for (const [gameName, files] of gameGroups.entries()) {
    if (files.length === 0) continue

    // Find the common base path for all files
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

  log.info(``)
  log.info(`✓ Scan complete!`)
  log.info(`  • Detected games: ${detectedGames.length}`)
  log.info(`  • Total save files: ${allFiles.length}`)
  log.info(``)
  log.info('Detected games:')
  detectedGames.forEach((game, i) => {
    log.info(`  ${i + 1}. ${game.gameName} (${game.fileCount} files, ${game.totalSize})`)
  })
  log.info('═══════════════════════════════════════════════════')

  return detectedGames.sort((a, b) => a.gameName.localeCompare(b.gameName))
}
