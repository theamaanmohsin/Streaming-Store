import Link from 'next/link'
import { Film, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-main min-h-[70vh] flex flex-col items-center justify-center text-center animate-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
          <Film className="h-12 w-12 text-brand-500" />
        </div>
        <span className="absolute -top-2 -right-2 text-display-sm font-bold text-brand-500">?</span>
      </div>

      <h1 className="text-display-lg font-bold tracking-tight mb-4">Page Not Found</h1>
      <p className="text-body-lg text-text-secondary-dark dark:text-text-secondary-light max-w-md mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn-primary gap-2">
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
        <Link href="/search" className="btn-secondary gap-2">
          <Search className="h-5 w-5" />
          Search Movies
        </Link>
      </div>
    </div>
  )
}
