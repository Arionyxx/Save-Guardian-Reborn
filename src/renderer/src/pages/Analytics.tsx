import { ChartBarIcon } from '@heroicons/react/24/outline'

export default function Analytics() {
  return (
    <div className="h-full overflow-auto bg-base-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Backup statistics and insights (coming soon)
          </p>
        </div>

        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-base-300 bg-base-200">
          <div className="text-center">
            <ChartBarIcon className="mx-auto size-16 text-base-content/30" />
            <h3 className="mt-4 text-lg font-semibold">Analytics Coming Soon</h3>
            <p className="mt-2 max-w-md text-sm text-base-content/60">
              This section will display detailed analytics about your backup activity, storage
              trends, and game save statistics.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-base-content/60">Backup Frequency</h3>
              <div className="text-2xl font-bold">Coming Soon</div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-base-content/60">Storage Trends</h3>
              <div className="text-2xl font-bold">Coming Soon</div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-base-content/60">Most Backed Up</h3>
              <div className="text-2xl font-bold">Coming Soon</div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-base-content/60">Success Rate</h3>
              <div className="text-2xl font-bold">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
