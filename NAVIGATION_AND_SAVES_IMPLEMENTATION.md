# Navigation and Save Detection Implementation

## Overview
This document describes the implementation of UI navigation fixes and game save detection features.

## Changes Made

### 1. Navigation System

#### Added Dependencies
- `react-router-dom` - For client-side routing
- `@types/react-router-dom` - TypeScript types
- `fast-glob` - For recursive file scanning

#### Routing Implementation
- **App.tsx**: Integrated React Router with BrowserRouter
  - Routes: `/dashboard`, `/games`, `/storage`, `/analytics`, `/settings`
  - Default route redirects to `/dashboard`

- **SidebarNav.tsx**: Updated to use React Router navigation
  - Uses `useLocation()` to track active page
  - Uses `useNavigate()` for navigation
  - Active state now reflects actual route
  - Removed local state management in favor of router state

#### Z-Index and Layout Fixes
- **AppShell.tsx**: Added `pt-14` padding to account for fixed TopBar
  - TopBar: `z-50` (highest)
  - Sidebar: `z-40` 
  - Content area: default z-index
  - Ensures no overlap between header and content

### 2. Page Components

Created 4 new page components:

#### Games Page (`pages/Games.tsx`)
- Displays detected game saves in card layout
- Shows save file details (name, size, last modified, extension)
- Manual refresh button with loading state
- Scan progress indicator
- Empty state when no games detected
- Responsive grid layout (1-3 columns based on screen size)

#### Storage Page (`pages/Storage.tsx`)
- Storage usage statistics and visualization
- Backup history table
- Total backups and games count
- Last backup timestamp
- Progress bar for storage usage

#### Analytics Page (`pages/Analytics.tsx`)
- Placeholder page for future analytics features
- Coming soon message with icon
- Placeholder stat cards

#### Settings Page (`pages/Settings.tsx`)
- General settings (auto backup, interval, max backups)
- Custom scan paths management
- Add/remove custom directories
- Default scan locations listed
- Save settings functionality

### 3. Game Save Detection

#### Backend Service (`services/saveScanner.ts`)
Implements comprehensive save file detection:

**Scan Locations (Windows)**:
- `C:\Users\<Username>\Documents\My Games`
- `C:\Users\<Username>\AppData\Roaming`
- `C:\Users\<Username>\AppData\Local`
- `C:\Users\<Username>\Saved Games`
- `C:\Program Files (x86)\Steam\userdata`

**Supported Extensions**:
- `.sav`, `.save`, `.savegame` - Generic save files
- `.dat` - Data files
- `.profile` - Player profiles
- `.json`, `.xml`, `.ini` - Text-based configs/saves
- `.slot`, `.slot1`, `.slot2`, `.slot3`, `.slot4`, `.slot5` - Save slots

**Features**:
- Recursive scanning with 5-level depth limit
- Ignores cache, temp, node_modules, backup folders
- Groups files by game (intelligent game name detection)
- Calculates total size per game
- Sorts files by modification date
- Platform-aware (Windows/macOS/Linux)
- Error handling and logging

#### IPC Integration
- Added `SCAN_GAME_SAVES` channel
- Handler in `ipc.ts` integrates with dataService for custom paths
- Preload exposes `scanGameSaves()` API to renderer

#### Type Definitions
Added new types to `shared/types/models.ts`:
- `DetectedSaveFile` - Individual save file info
- `DetectedSave` - Grouped game save information
- Extended `AppSettings` with `scanPaths?: string[]`

### 4. Features Implemented

#### Navigation
✅ Proper routing between all pages
✅ Active page highlighting in sidebar
✅ Fixed z-index/layering issues
✅ No UI overlap
✅ Responsive layout support

#### Save Detection
✅ Scans common Windows save locations
✅ Detects saves by file extension
✅ Groups saves by game
✅ Shows file count, total size, last modified
✅ Displays individual file details
✅ Manual refresh/rescan button
✅ Scan progress indicator
✅ Custom scan path configuration

#### UI/UX
✅ Loading states during scans
✅ Toast notifications for user feedback
✅ Empty states with helpful messages
✅ Responsive card layouts
✅ Proper spacing and padding
✅ Consistent styling with existing design system

## Testing

All checks pass:
- ✅ TypeScript compilation
- ✅ ESLint validation
- ✅ Prettier formatting
- ✅ Build successful

## Usage

### Navigation
Click any sidebar item to navigate between pages:
- Dashboard - Overview and stats
- Games - Detected game saves
- Storage - Backup history and usage
- Analytics - Future analytics features
- Settings - App configuration and scan paths

### Game Save Detection
1. Navigate to Games page
2. App automatically scans on load
3. Click "Rescan" to manually trigger scan
4. View detected games with save details
5. Add custom scan paths in Settings

## Future Enhancements
- Implement actual backup functionality for detected saves
- Add "View All Files" modal for games with many saves
- Steam game name resolution (currently shows Steam ID)
- File type icons for different extensions
- Search/filter functionality for games list
- Sort options (by name, size, date)
- Cloud storage integration options
