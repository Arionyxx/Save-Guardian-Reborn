# Local-Only Architecture

This document describes the local-only architecture of the Game Save Manager application.

## Overview

The application is designed to operate entirely offline without any cloud dependencies or external API calls. All data is stored and processed locally on the user's machine.

## Key Principles

1. **No External APIs** - No IGDB, cloud storage, or other third-party API integrations
2. **No Native Compilation Issues** - Uses better-sqlite3 instead of ODBC or other problematic native modules
3. **Local Storage Only** - All game metadata, backups, and configuration stored locally
4. **Privacy First** - No data leaves the user's machine

## Storage Architecture

### Database

- **better-sqlite3** - Lightweight, fast SQLite database with no external dependencies
- Stores game metadata, backup history, and application settings
- Database file location:
  - Windows: `%APPDATA%/game-save-manager/data.db`
  - macOS: `~/Library/Application Support/game-save-manager/data.db`
  - Linux: `~/.config/game-save-manager/data.db`

### File System Structure

```
AppData/game-save-manager/
├── data.db              # SQLite database
├── backups/             # Game save backups
│   ├── game-1/
│   │   ├── 2024-01-01/
│   │   └── 2024-01-02/
│   └── game-2/
├── covers/              # Local cover art images
└── config/              # Application configuration
    └── settings.json
```

## Game Save Detection

The application scans common save game locations on the user's PC:

### Windows

- `%USERPROFILE%\Documents\`
- `%APPDATA%\Local\` (AppData/Local)
- `%APPDATA%\Roaming\` (AppData/Roaming)
- `%USERPROFILE%\Saved Games\`
- Custom user-defined paths

### macOS

- `~/Documents/`
- `~/Library/Application Support/`
- `~/Library/Preferences/`
- Custom user-defined paths

### Linux

- `~/.local/share/`
- `~/Documents/`
- `~/.config/`
- Custom user-defined paths

## Support for All Game Types

The scanning engine detects saves from:

- Steam games
- Epic Games Store
- GOG
- EA/Origin
- Ubisoft Connect
- **Cracked games** (Skidrow, Empress, Codex, etc.)
- Standalone games
- Emulators

No special configuration or API keys needed - just point the app at the folder.

## Backup Engine

### Backup Process

1. User selects game save to backup
2. Application creates a timestamped copy in local backup directory
3. Metadata (game name, date, size) stored in SQLite database
4. Verification hash generated for integrity checking

### Restore Process

1. User selects backup to restore
2. Application verifies backup integrity
3. Original save backed up before restore (safety backup)
4. Selected backup copied to game save location

### No Cloud Upload

- All backups remain on user's local storage
- No automatic cloud sync
- No network requests during backup/restore
- User can manually copy backup folder to external drives if desired

## Game Metadata

### Cover Art

- User can upload custom cover art images (PNG, JPG)
- Images stored locally in `covers/` directory
- Placeholder images used if no cover provided
- No API calls to game databases

### Game Information

- Game name (user-editable)
- Save file location
- Last played date (from file system)
- Total backup count
- Total backup size

## Configuration

### Application Settings

Stored in local JSON files:

- Theme preferences
- Scan locations
- Backup retention policies
- UI preferences

### No Environment Variables Required

- No `.env` file needed for production use
- Optional `NODE_ENV` for development only
- No API credentials or keys

## Performance Benefits

- **Fast startup** - No network requests or API authentication
- **Instant scanning** - Local filesystem operations only
- **Quick backups** - Direct file system copies
- **Offline operation** - Works without internet connection
- **Low memory** - No cloud sync processes or upload queues

## Privacy & Security

- **No telemetry** - No usage data collected or sent
- **No user accounts** - No registration or login required
- **No network access** - Application can run completely offline
- **Local encryption** - Optional encryption for sensitive save files (future feature)

## Installation

The application installs cleanly without:

- ODBC drivers
- Database servers
- Native compilation dependencies (beyond better-sqlite3)
- Complex system requirements

Simply run `pnpm install` and everything works.

## Future Enhancements

Potential local-only features:

- Save file compression
- Incremental backups (only changed files)
- Save file comparison/diff viewer
- Scheduled automatic backups
- Import/export backup archives
- Local save file encryption
