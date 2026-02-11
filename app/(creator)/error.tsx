"use client"

export default function CreatorLayoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="space-y-4 text-center max-w-md">
        <h2 className="text-xl font-bold text-destructive">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/login"
            className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  )
}
