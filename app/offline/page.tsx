"use client"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">You&apos;re offline</h1>
        <p className="text-muted-foreground max-w-sm">
          No internet connection. Check your network and try again — your data will sync
          automatically when you&apos;re back online.
        </p>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
