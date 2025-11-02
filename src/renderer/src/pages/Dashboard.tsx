import { useState } from 'react'
import {
  CloudArrowUpIcon,
  ClockIcon,
  FolderIcon,
  PuzzlePieceIcon,
  PlayIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { ContentArea } from '../components/layout'
import {
  AnimatedCard,
  AnimatedCardHeader,
  AnimatedCardTitle,
  AnimatedCardContent,
  Badge,
  ProgressBar,
  CircularProgress,
  SearchInput,
  SectionHeader,
  StatusIndicator,
  TabGroup,
  TabPanel
} from '../components/primitives'
import { mockGames, mockBackups, mockStorageStats, formatTimeAgo } from '../data/mockData'
import { useToastStore } from '../stores'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const { addToast } = useToastStore()

  const filteredGames = mockGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBackupGame = (gameName: string) => {
    addToast('info', `Starting backup for ${gameName}...`)
    setTimeout(() => {
      addToast('success', `Backup completed for ${gameName}!`)
    }, 2000)
  }

  return (
    <ContentArea>
      <div className="space-y-6">
        <SectionHeader
          title="Dashboard"
          subtitle="Manage your game saves and backups"
          icon={<PuzzlePieceIcon className="size-6 text-white" />}
          actions={
            <button className="btn btn-primary gap-2">
              <PlusIcon className="size-5" />
              Add Game
            </button>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <AnimatedCard>
            <AnimatedCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Total Backups</p>
                  <p className="mt-1 text-3xl font-bold">{mockStorageStats.backupCount}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20">
                  <CloudArrowUpIcon className="size-6 text-primary" />
                </div>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>

          <AnimatedCard>
            <AnimatedCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Tracked Games</p>
                  <p className="mt-1 text-3xl font-bold">{mockStorageStats.gameCount}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/20">
                  <PuzzlePieceIcon className="size-6 text-secondary" />
                </div>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>

          <AnimatedCard className="lg:col-span-2">
            <AnimatedCardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-base-content/60">Storage Usage</p>
                  <p className="mt-1 text-3xl font-bold">
                    {mockStorageStats.used} GB
                    <span className="text-base font-normal text-base-content/60">
                      {' '}
                      / {mockStorageStats.total} GB
                    </span>
                  </p>
                  <ProgressBar
                    value={mockStorageStats.used}
                    max={mockStorageStats.total}
                    color="primary"
                    className="mt-3"
                  />
                </div>
                <div className="ml-4">
                  <CircularProgress
                    value={mockStorageStats.used}
                    max={mockStorageStats.total}
                    size={80}
                    strokeWidth={8}
                    color="primary"
                  />
                </div>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>
        </div>

        <AnimatedCard>
          <AnimatedCardHeader>
            <AnimatedCardTitle>Recent Backups</AnimatedCardTitle>
            <button className="btn btn-ghost btn-sm">View All</button>
          </AnimatedCardHeader>
          <AnimatedCardContent>
            <div className="space-y-3">
              {mockBackups.slice(0, 4).map(backup => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between rounded-lg border border-base-300 bg-base-200/50 p-4 transition-colors hover:bg-base-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-gaming text-lg">
                      {mockGames.find(g => g.id === backup.gameId)?.icon || '🎮'}
                    </div>
                    <div>
                      <p className="font-medium">{backup.gameName}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-base-content/60">
                        <ClockIcon className="size-3.5" />
                        <span>{formatTimeAgo(backup.timestamp)}</span>
                        <span>•</span>
                        <FolderIcon className="size-3.5" />
                        <span>{backup.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={backup.type === 'auto' ? 'info' : 'success'} size="sm" dot>
                      {backup.type}
                    </Badge>
                    <StatusIndicator
                      status={
                        backup.status === 'completed'
                          ? 'success'
                          : backup.status === 'failed'
                            ? 'error'
                            : 'warning'
                      }
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCardContent>
        </AnimatedCard>

        <AnimatedCard>
          <AnimatedCardHeader>
            <div className="flex flex-1 items-center gap-4">
              <AnimatedCardTitle>Detected Games</AnimatedCardTitle>
              <TabGroup
                tabs={[
                  { id: 'all', label: 'All', badge: mockGames.length },
                  {
                    id: 'active',
                    label: 'Active',
                    badge: mockGames.filter(g => g.status === 'active').length
                  },
                  {
                    id: 'inactive',
                    label: 'Inactive',
                    badge: mockGames.filter(g => g.status === 'inactive').length
                  }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="pills"
              />
            </div>
            <SearchInput
              placeholder="Search games..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-64"
            />
          </AnimatedCardHeader>

          <AnimatedCardContent>
            <TabPanel activeTab={activeTab} tabId="all">
              <GamesList games={filteredGames} onBackup={handleBackupGame} />
            </TabPanel>
            <TabPanel activeTab={activeTab} tabId="active">
              <GamesList
                games={filteredGames.filter(g => g.status === 'active')}
                onBackup={handleBackupGame}
              />
            </TabPanel>
            <TabPanel activeTab={activeTab} tabId="inactive">
              <GamesList
                games={filteredGames.filter(g => g.status === 'inactive')}
                onBackup={handleBackupGame}
              />
            </TabPanel>
          </AnimatedCardContent>
        </AnimatedCard>
      </div>
    </ContentArea>
  )
}

function GamesList({
  games,
  onBackup
}: {
  games: typeof mockGames
  onBackup: (gameName: string) => void
}) {
  if (games.length === 0) {
    return (
      <div className="py-12 text-center">
        <PuzzlePieceIcon className="mx-auto size-12 text-base-content/20" />
        <p className="mt-4 text-base-content/60">No games found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {games.map(game => (
        <div
          key={game.id}
          className="group rounded-lg border border-base-300 bg-base-200/50 p-4 transition-all hover:border-primary/50 hover:bg-base-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-gaming text-2xl">
                {game.icon}
              </div>
              <div>
                <h4 className="font-semibold">{game.name}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <StatusIndicator
                    status={
                      game.status === 'active'
                        ? 'success'
                        : game.status === 'error'
                          ? 'error'
                          : 'idle'
                    }
                    size="xs"
                  />
                  <span className="text-xs text-base-content/60">{game.backupCount} backups</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onBackup(game.name)}
              className="btn btn-ghost btn-sm opacity-0 transition-opacity group-hover:opacity-100"
              disabled={game.status === 'error'}
            >
              <PlayIcon className="size-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-base-content/60">
            <div className="flex items-center gap-1">
              <FolderIcon className="size-3.5" />
              <span>{game.saveSize}</span>
            </div>
            {game.lastBackup && (
              <div className="flex items-center gap-1">
                <ClockIcon className="size-3.5" />
                <span>{formatTimeAgo(game.lastBackup)}</span>
              </div>
            )}
            {!game.lastBackup && <span className="text-status-warning">No backups</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
