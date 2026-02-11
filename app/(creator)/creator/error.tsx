"use client"

export default function CreatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-destructive">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
}
