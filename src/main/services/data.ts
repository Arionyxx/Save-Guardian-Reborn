import { Game, Backup, AppSettings, StorageStats } from '../../shared/types'
import { storage } from './storage'
import log from 'electron-log'

const GAMES_FILE = 'games.json'
const BACKUPS_FILE = 'backups.json'
const SETTINGS_FILE = 'settings.json'

export class DataService {
  // Games
  async getAllGames(): Promise<Game[]> {
    const games = await storage.read<Game[]>(GAMES_FILE)
    return games || []
  }

  async getGame(id: string): Promise<Game | null> {
    const games = await this.getAllGames()
    return games.find(game => game.id === id) || null
  }

  async createGame(game: Omit<Game, 'id'>): Promise<Game> {
    const newGame: Game = {
      ...game,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }

    await storage.update<Game[]>(GAMES_FILE, games => {
      const currentGames = games || []
      return [...currentGames, newGame]
    })

    log.info(`Game created: ${newGame.name}`)
    return newGame
  }

  async updateGame(id: string, updates: Partial<Omit<Game, 'id'>>): Promise<Game | null> {
    const updatedGames = await storage.update<Game[]>(GAMES_FILE, games => {
      const currentGames = games || []
      const index = currentGames.findIndex(game => game.id === id)

      if (index === -1) {
        return currentGames
      }

      const updatedGame = { ...currentGames[index], ...updates }
      currentGames[index] = updatedGame
      return currentGames
    })

    const updatedGame = updatedGames.find(game => game.id === id) || null
    if (updatedGame) {
      log.info(`Game updated: ${updatedGame.name}`)
    }

    return updatedGame
  }

  async deleteGame(id: string): Promise<boolean> {
    let deleted = false

    await storage.update<Game[]>(GAMES_FILE, games => {
      const currentGames = games || []
      const filteredGames = currentGames.filter(game => game.id !== id)
      deleted = filteredGames.length < currentGames.length
      return filteredGames
    })

    if (deleted) {
      log.info(`Game deleted: ${id}`)
    }

    return deleted
  }

  // Backups
  async getAllBackups(): Promise<Backup[]> {
    const backups = await storage.read<Backup[]>(BACKUPS_FILE)
    return backups || []
  }

  async getBackupsByGameId(gameId: string): Promise<Backup[]> {
    const backups = await this.getAllBackups()
    return backups.filter(backup => backup.gameId === gameId)
  }

  async getBackup(id: string): Promise<Backup | null> {
    const backups = await this.getAllBackups()
    return backups.find(backup => backup.id === id) || null
  }

  async createBackup(backup: Omit<Backup, 'id'>): Promise<Backup> {
    const newBackup: Backup = {
      ...backup,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }

    await storage.update<Backup[]>(BACKUPS_FILE, backups => {
      const currentBackups = backups || []
      return [...currentBackups, newBackup]
    })

    log.info(`Backup created for game: ${newBackup.gameName}`)
    return newBackup
  }

  async updateBackup(id: string, updates: Partial<Omit<Backup, 'id'>>): Promise<Backup | null> {
    const updatedBackups = await storage.update<Backup[]>(BACKUPS_FILE, backups => {
      const currentBackups = backups || []
      const index = currentBackups.findIndex(backup => backup.id === id)

      if (index === -1) {
        return currentBackups
      }

      const updatedBackup = { ...currentBackups[index], ...updates }
      currentBackups[index] = updatedBackup
      return currentBackups
    })

    const updatedBackup = updatedBackups.find(backup => backup.id === id) || null
    if (updatedBackup) {
      log.info(`Backup updated: ${updatedBackup.id}`)
    }

    return updatedBackup
  }

  async deleteBackup(id: string): Promise<boolean> {
    let deleted = false

    await storage.update<Backup[]>(BACKUPS_FILE, backups => {
      const currentBackups = backups || []
      const filteredBackups = currentBackups.filter(backup => backup.id !== id)
      deleted = filteredBackups.length < currentBackups.length
      return filteredBackups
    })

    if (deleted) {
      log.info(`Backup deleted: ${id}`)
    }

    return deleted
  }

  // Settings
  async getSettings(): Promise<AppSettings> {
    const settings = await storage.read<AppSettings>(SETTINGS_FILE)
    return (
      settings || {
        theme: 'system',
        autoBackup: false,
        backupInterval: 60,
        maxBackups: 10,
        backupLocation: ''
      }
    )
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const updatedSettings = await storage.update<AppSettings>(SETTINGS_FILE, settings => {
      const currentSettings = settings || {
        theme: 'system' as const,
        autoBackup: false,
        backupInterval: 60,
        maxBackups: 10,
        backupLocation: ''
      }
      return { ...currentSettings, ...updates }
    })

    log.info('Settings updated')
    return updatedSettings
  }

  // Storage Stats
  async getStorageStats(): Promise<StorageStats> {
    const games = await this.getAllGames()
    const backups = await this.getAllBackups()

    // Calculate storage stats
    let totalUsed = 0
    backups.forEach(backup => {
      const size = backup.size.toLowerCase()
      if (size.includes('mb')) {
        totalUsed += parseFloat(size)
      } else if (size.includes('gb')) {
        totalUsed += parseFloat(size) * 1024
      }
    })

    return {
      used: Math.round(totalUsed),
      total: 500, // 500 GB default, could be made configurable
      backupCount: backups.length,
      gameCount: games.length
    }
  }
}

export const dataService = new DataService()
