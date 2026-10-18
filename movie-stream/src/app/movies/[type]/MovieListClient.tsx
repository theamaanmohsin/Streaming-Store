'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Film, Sparkles, TrendingUp, Star, Flame, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MovieCard, MovieCardSkeleton } from '@/components/movies/MovieCard'
import { cn } from '@/lib/utils'
import type { MovieListType, TMDBMovie } from '@/types/tmdb'

const CATEGORY_TABS: { type: MovieListType; label: string; icon: typeof Flame }[] = [
  { type: 'popular', label: 'Popular', icon: Flame },
  { type: 'top_rated', label: 'Top Rated', icon: Star },
  { type: 'now_playing', label: 'Now Playing', icon: TrendingUp },
  { type: 'upcoming', label: 'Upcoming', icon: Calendar },
]

export function MovieListClient({
  title,
  description,
  type,
  initialMovies,
  totalPages,
}: {
  title: string
  description: string
  type: MovieListType
  initialMovies: TMDBMovie[]
  totalPages: number
}) {
  const [movies, setMovies] = useState<TMDBMovie[]>(initialMovies)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMore = async () => {
    if (loading || page >= totalPages) return
    setLoading(true)
    setError(null)
    try {
      const next = page + 1
      const response = await fetch(`/api/movies/${type}?page=${next}`)
      if (!response.ok) throw new Error('Unable to load more movies')
      const data = await response.json()
      setMovies((current) => [...current, ...data.results])
      setPage(next)
    } catch (err) {
      setError('Could not load more movies. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-main section animate-in">
      {/* Header with Title and Category Tabs */}
      <header className="mb-10 space-y-6">
        <div>
          <h1 className="text-display-md font-bold tracking-tight mb-2 flex items-center gap-3">
            <Film className="h-8 w-8 text-brand-500" />
            {title}
          </h1>
          <p className="text-body-lg text-text-secondary-dark max-w-2xl">{description}</p>
        </div>

        {/* Category Navigation Pills */}
        <nav className="flex flex-wrap items-center gap-2 pt-2" aria-label="Movie category tabs">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.type === type
            return (
              <Link
                key={tab.type}
                href={`/movies/${tab.type}`}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-body-sm font-medium transition-all duration-fast',
                  isActive
                    ? 'bg-brand-500 text-brand-contrast shadow-sm'
                    : 'bg-surface-card-dark text-text-secondary-dark border border-surface-border-dark hover:border-brand-500 hover:text-text-primary-dark'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {/* Status count */}
        <div className="flex items-center justify-between text-caption text-text-muted-dark pt-2 border-t border-surface-border-dark/60">
          <span>
            Showing <strong className="text-text-primary-dark">{movies.length}</strong> movies
          </span>
          <span>
            Page {page} of {totalPages}
          </span>
        </div>
      </header>

      {/* Responsive Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${index}`}
            movie={movie}
            index={index}
            size="auto"
            priority={index < 6}
          />
        ))}

        {/* Skeletons when loading next page */}
        {loading &&
          Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={`loading-${i}`} size="auto" />
          ))}
      </div>

      {/* Error notification if fetch failed */}
      {error && (
        <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-body-sm text-center">
          {error}
        </div>
      )}

      {/* Load More Button */}
      {page < totalPages && (
        <div className="mt-14 flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={loadMore}
            disabled={loading}
            className="w-full sm:w-auto min-w-[220px] gap-2 shadow-shadow-md hover:border-brand-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more movies...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-brand-500" />
                <span>Load More ({movies.length} shown)</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
