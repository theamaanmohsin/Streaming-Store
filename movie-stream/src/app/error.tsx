'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error for diagnostics
    console.error('Next.js App Router caught error:', error)
  }, [error])

  return (
    <div className="container-main min-h-[70vh] flex flex-col items-center justify-center text-center animate-in py-16">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
      </div>

      <h1 className="text-display-md font-bold tracking-tight mb-3">
        Something Went Wrong
      </h1>

      <p className="text-body-lg text-text-secondary-dark max-w-md mb-8">
        We encountered an unexpected error while loading this page. This could be due to a temporary network issue with the movie database.
      </p>

      {error.message && process.env.NODE_ENV === 'development' && (
        <div className="mb-8 p-4 rounded-xl bg-surface-card-dark border border-red-500/30 text-red-400 text-caption font-mono text-left max-w-lg overflow-x-auto">
          {error.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/" className="btn-secondary gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
