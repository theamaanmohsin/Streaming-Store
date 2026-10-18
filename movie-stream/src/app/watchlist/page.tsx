'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Bookmark,
  BookmarkCheck,
  Film,
  Trash2,
  ArrowUpDown,
  Star,
  Flame,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { MovieCard, MovieCardSkeleton } from '@/components/movies/MovieCard'
import { useWatchlist } from '@/hooks/useWatchlist'
import { formatRating } from '@/lib/tmdb'
import type { TMDBMovie } from '@/types/tmdb'

type SortOption = 'recent' | 'rating-desc' | 'release-desc' | 'title-asc'

export default function WatchlistPage() {
  const { watchlist, isLoaded, clearWatchlist } = useWatchlist()
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)

  useEffect(() => {
    document.title = `My Watchlist (${watchlist.length}) | Stream Store`
  }, [watchlist.length])

  // Computed average rating across saved movies
  const averageRating = useMemo(() => {
    if (!watchlist.length) return 0
    const total = watchlist.reduce((acc, m) => acc + (m.vote_average || 0), 0)
    return total / watchlist.length
  }, [watchlist])

  // Sorted list
  const sortedMovies = useMemo(() => {
    const list = [...watchlist]
    switch (sortBy) {
      case 'rating-desc':
        return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      case 'release-desc':
        return list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
      case 'title-asc':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      case 'recent':
      default:
        return list // default is already sorted newest added first in useWatchlist
    }
  }, [watchlist, sortBy])

  if (!isLoaded) {
    return (
      <div className="container-main section animate-in">
        <header className="mb-10">
          <div className="h-10 w-64 bg-surface-card-dark rounded-xl animate-pulse-soft mb-3" />
          <div className="h-5 w-48 bg-surface-card-dark rounded animate-pulse-soft" />
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} size="auto" />
          ))}
        </div>
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className="container-main section animate-in">
        <header className="mb-8">
          <h1 className="text-display-md font-bold tracking-tight mb-2 flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-brand-500" />
            My Watchlist
          </h1>
          <p className="text-body-lg text-text-secondary-dark">
            Keep track of movies you want to watch next.
          </p>
        </header>

        <div className="relative rounded-3xl border border-dashed border-surface-border-dark p-12 md:p-16 text-center bg-surface-card-dark/40 backdrop-blur-sm max-w-3xl mx-auto my-8">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
            <Film className="h-10 w-10 text-brand-500" />
          </div>
          <h2 className="text-heading-lg font-bold mb-3">Your Watchlist is Empty</h2>
          <p className="text-body text-text-secondary-dark max-w-md mx-auto mb-8">
            Click the bookmark icon on any movie card or detail page to save films you want to enjoy later.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/movies/popular" className="btn-primary gap-2">
              <Flame className="h-4 w-4" />
              Explore Popular Movies
            </Link>
            <Link href="/movies/top_rated" className="btn-secondary gap-2">
              <Star className="h-4 w-4" />
              Top Rated Classics
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-main section animate-in">
      {/* Header and Controls */}
      <header className="mb-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-display-md font-bold tracking-tight mb-2 flex items-center gap-3">
              <BookmarkCheck className="h-8 w-8 text-brand-500" />
              My Watchlist
            </h1>
            <p className="text-body-lg text-text-secondary-dark">
              Your personalized collection of saved films.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmClearOpen(true)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 border border-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Clear Watchlist
            </Button>
            <Link href="/movies/popular" className="btn-secondary text-body-sm gap-2">
              <Film className="h-4 w-4" />
              Browse More
            </Link>
          </div>
        </div>

        {/* Stats & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-surface-border-dark">
          {/* Stats Badges */}
          <div className="flex items-center gap-4 text-body-sm text-text-secondary-dark">
            <span className="badge-secondary px-3 py-1">
              <strong className="text-text-primary-dark mr-1">{watchlist.length}</strong>
              {watchlist.length === 1 ? 'movie' : 'movies'} saved
            </span>
            {averageRating > 0 && (
              <span className="flex items-center gap-1.5 text-text-muted-dark">
                <Star className="h-4 w-4 text-brand-500 fill-brand-500" />
                Avg Rating:{' '}
                <strong className="text-text-primary-dark">{formatRating(averageRating)}</strong>
              </span>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-text-muted-dark" />
            <span className="text-caption text-text-muted-dark">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg bg-surface-card-dark border border-surface-border-dark px-3 py-1.5 text-body-sm text-text-primary-dark focus:border-brand-500 focus:outline-none"
              aria-label="Sort watchlist by"
            >
              <option value="recent">Recently Added</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="release-desc">Release Date (Newest)</option>
              <option value="title-asc">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Watchlist Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {sortedMovies.map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${index}`}
            movie={movie}
            index={index}
            size="auto"
          />
        ))}
      </div>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        size="sm"
        title="Clear Watchlist?"
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-body-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>This will remove all {watchlist.length} movies from your watchlist. This cannot be undone.</span>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmClearOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                clearWatchlist()
                setConfirmClearOpen(false)
              }}
            >
              Yes, Clear All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
