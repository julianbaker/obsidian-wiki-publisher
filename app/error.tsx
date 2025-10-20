'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Something went wrong
      </h1>
      <p className="mb-4">An error occurred while loading this page.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </section>
  )
}

