# Game Save Manager - Local Edition

A local-only game save manager built with Electron, React 18, and TypeScript. Scan, backup, and manage your PC game saves without any cloud dependencies.

## Tech Stack

- **Electron** - Cross-platform desktop application framework
- **React 18** - UI library with latest features
- **TypeScript** - Strict type safety across all processes
- **Vite** - Fast build tool and development server
- **electron-vite** - Electron-specific Vite integration
- **better-sqlite3** - Fast, lightweight local database (no cloud dependencies)
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind
- **Heroicons** - Beautiful hand-crafted SVG icons
- **ESLint & Prettier** - Code quality and formatting
- **Husky & lint-staged** - Git hooks for pre-commit validation

## Project Structure

```
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   ├── ipc.ts         # IPC handlers
│   │   └── utils/         # Main process utilities
│   ├── preload/           # Electron preload scripts
│   │   └── index.ts       # Preload entry point (IPC bridge)
│   ├── renderer/          # React application
│   │   └── src/
│   │       ├── components/  # React components
│   │       ├── hooks/       # Custom React hooks
│   │       ├── stores/      # Zustand stores
│   │       ├── services/    # API and service layers
│   │       ├── domain/      # Business logic and models
│   │       ├── styles/      # CSS and styling
│   │       ├── utils/       # Utility functions
│   │       ├── App.tsx      # Root component
│   │       └── main.tsx     # Renderer entry point
│   └── shared/            # Shared code between processes
│       └── types/         # TypeScript type definitions
└── electron.vite.config.ts  # Vite configuration
```

## Prerequisites

- **Node.js** 18+
- **pnpm** 8+ (recommended package manager)

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

## Features

- **Local-only operation** - No cloud services or API keys required
- **Game save scanning** - Automatically detect saves in common locations:
  - Documents folder
  - AppData/Local
  - AppData/Roaming
  - Saved Games
  - Custom user-defined paths
- **Support for all game types** - Including cracked games (Skidrow, Empress, Codex, non-Steam)
- **Local backups** - All backups stored locally in the app's data directory
- **Lightweight database** - Uses better-sqlite3 for fast, local metadata storage
- **No native compilation issues** - Installs cleanly without ODBC or complex native dependencies

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **(Optional) Configure development settings:**

   ```bash
   cp .env.example .env
   ```

   The `.env` file is optional and only needed for development-specific settings.

## Development

Start the development server with hot reload:

```bash
pnpm dev
```

This will:

- Start the Vite dev server for the renderer process
- Build and watch the main and preload processes
- Launch the Electron app with DevTools open
- Enable hot reload for all processes

## Available Scripts

- `pnpm dev` - Start development mode with hot reload
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview the production build
- `pnpm lint` - Run ESLint on all files
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests (placeholder)
- `pnpm package` - Build and package the app for distribution

## Architecture

### Process Separation

The app follows Electron's multi-process architecture:

- **Main Process** (`src/main/`) - Node.js environment, controls app lifecycle and native features
- **Preload Script** (`src/preload/`) - Secure bridge between main and renderer with `contextIsolation`
- **Renderer Process** (`src/renderer/`) - Browser environment running React app

### IPC Communication

All communication between processes uses typed IPC channels defined in `src/shared/types/ipc.ts`:

```typescript
// Renderer process
const version = await window.electronAPI.getAppVersion()

// Preload exposes safe API
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app:get-version')
})

// Main process handles requests
ipcMain.handle('app:get-version', () => app.getVersion())
```

### Security

- **Context Isolation** enabled - Renderer cannot access Node.js APIs directly
- **Node Integration** disabled - Prevents security vulnerabilities
- **Preload Script** - Only approved APIs are exposed to renderer
- **Local-only architecture** - No external network requests or cloud services

### State Management

Uses Zustand for simple, performant state management:

```typescript
import { useAppStore } from '@/stores'

function Component() {
  const { theme, setTheme } = useAppStore()
  // ...
}
```

### Styling

- **TailwindCSS** with JIT mode for optimal bundle size
- **DaisyUI** for pre-built components
- **Custom theme tokens** defined in `tailwind.config.js`
- **CSS utilities** for common patterns

## Building for Production

1. **Build the application:**

   ```bash
   pnpm build
   ```

2. **Package for distribution:**
   ```bash
   pnpm package
   ```

This will create distributable packages in the `dist` directory for your platform.

## Code Quality

### Linting

ESLint is configured with:

- TypeScript strict rules
- React and React Hooks rules
- TailwindCSS class validation
- Prettier integration

### Pre-commit Hooks

Husky and lint-staged automatically run on commit:

- ESLint fixes
- Prettier formatting
- Type checking (via CI)

## Local Storage

The application stores all data locally:

- **Game metadata** - Stored in a local SQLite database using better-sqlite3
- **Backups** - Saved in the app's data directory (platform-specific):
  - Windows: `%APPDATA%/game-save-manager/backups`
  - macOS: `~/Library/Application Support/game-save-manager/backups`
  - Linux: `~/.config/game-save-manager/backups`
- **Configuration** - User preferences saved in local JSON files
- **Cover art** - Uploaded images stored locally (no API calls)

## Troubleshooting

### App won't start

- Ensure all dependencies are installed: `pnpm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear build cache: `rm -rf dist node_modules && pnpm install`

### Hot reload not working

- Restart the dev server: `pnpm dev`
- Check if port 5173 is available

### TypeScript errors

- Run type checking: `pnpm typecheck`
- Ensure all tsconfig.json files are properly configured

### Styling not applying

- Verify Tailwind is processing files: check `tailwind.config.js` content paths
- Rebuild: `pnpm build`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm typecheck`
5. Submit a pull request
