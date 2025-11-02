import { RocketLaunchIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function WelcomeCard() {
  const features = [
    'React 18 with TypeScript',
    'Electron with Context Isolation',
    'Zustand State Management',
    'TailwindCSS + DaisyUI',
    'ESLint + Prettier',
    'Hot Reload (Main & Renderer)',
    'Typed IPC Communication',
    'Secure Environment Variables'
  ]

  return (
    <div className="card max-w-2xl bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-3">
          <RocketLaunchIcon className="size-12 text-primary" />
          <h2 className="card-title text-3xl">Welcome to Your Electron App!</h2>
        </div>

        <p className="py-4 text-base-content/70">
          Your production-ready Electron + React + TypeScript application is up and running. This
          setup includes all the modern tools and best practices you need to build amazing desktop
          applications.
        </p>

        <div className="divider">Features Included</div>

        <div className="grid grid-cols-2 gap-3">
          {features.map(feature => (
            <div key={feature} className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-success" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="card-actions mt-6 justify-end">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-outline">Learn More</button>
        </div>
      </div>
    </div>
  )
}
