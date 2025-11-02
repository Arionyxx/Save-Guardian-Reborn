# Game Save Manager - Local Edition

A local-only game save manager built with Electron, React 18, and TypeScript. Scan, backup, and manage your PC game saves without any cloud dependencies.

## Tech Stack

- **Electron** - Cross-platform desktop application framework
- **React 18** - UI library with latest features
- **TypeScript** - Strict type safety across all processes
- **Vite** - Fast build tool and development server
- **electron-vite** - Electron-specific Vite integration
- **JSON Storage** - Simple, lightweight local file storage (no native dependencies)
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
- **npm** (comes with Node.js)

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
- **Simple JSON storage** - Uses JSON files for fast, local metadata storage
- **No native compilation issues** - Installs cleanly without node-gyp or native dependencies

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **(Optional) Configure development settings:**

   ```bash
   cp .env.example .env
   ```

   The `.env` file is optional and only needed for development-specific settings.

## Development

Start the development server with hot reload:

```bash
npm run dev
```

This will:

- Start the Vite dev server for the renderer process
- Build and watch the main and preload processes
- Launch the Electron app with DevTools open
- Enable hot reload for all processes

## Available Scripts

- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint on all files
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests (placeholder)
- `npm run package` - Build and package the app for distribution

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
   npm run build
   ```

2. **Package for distribution:**
   ```bash
   npm run package
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

The application stores all data locally using simple JSON files:

- **Game metadata** - Stored in `userData/games.json`
- **Backup metadata** - Stored in `userData/backups.json`
- **App settings** - Stored in `userData/settings.json`
- **Backups** - Saved in the app's data directory (platform-specific):
  - Windows: `%APPDATA%/electron-app/userData/`
  - macOS: `~/Library/Application Support/electron-app/userData/`
  - Linux: `~/.config/electron-app/userData/`
- **No native dependencies** - Pure Node.js fs operations, no compilation required

## Troubleshooting

### App won't start

- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear build cache: `rm -rf out node_modules package-lock.json && npm install`

### Hot reload not working

- Restart the dev server: `npm run dev`
- Check if port 5173 is available

### TypeScript errors

- Run type checking: `npm run typecheck`
- Ensure all tsconfig.json files are properly configured

### Styling not applying

- Verify Tailwind is processing files: check `tailwind.config.js` content paths
- Rebuild: `npm run build`

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run typecheck`
5. Submit a pull request
