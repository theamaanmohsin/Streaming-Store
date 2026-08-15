'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Heart, Bookmark, BookmarkCheck, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MovieRow } from '@/components/movies/MovieRow'
import { MovieCardSkeleton } from '@/components/movies/MovieCard'
import { useWatchlist } from '@/hooks/useWatchlist'
import type { TMDBMovie } from '@/types/tmdb'

export default function WatchlistPage() {
  const { watchlist, isLoaded, removeFromWatchlist, isInWatchlist } = useWatchlist()

  useEffect(() => {
    document.title = `My Watchlist (${watchlist.length}) | MovieStream`
  }, [watchlist.length])

  if (!isLoaded) {
    return (
      <div className="container-main section animate-in">
        <header className="mb-12">
          <h1 className="text-display-md font-bold tracking-tight mb-4 flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-brand-500" />
            My Watchlist
          </h1>
        </header>
        <MovieRow title="Loading..." movies={[]} isLoading={true} showViewAll={false} />
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className="container-main section animate-in">
        <header className="mb-12">
          <h1 className="text-display-md font-bold tracking-tight mb-4 flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-brand-500" />
            My Watchlist
          </h1>
          <p className="text-body-lg text-text-secondary-dark dark:text-text-secondary-light">
            Your saved movies will appear here.
          </p>
        </header>
        <div className="text-center py-16">
          <Film className="h-16 w-16 mx-auto text-text-muted-dark/50 dark:text-text-muted-light/50 mb-4" />
          <h2 className="text-heading-md font-semibold mb-2">Watchlist is empty</h2>
          <p className="text-text-secondary-dark dark:text-text-secondary-light mb-6 max-w-md mx-auto">
            Start adding movies to your watchlist by clicking the bookmark icon on any movie card or detail page.
          </p>
          <Link href="/movies/popular" className="btn-primary inline-flex gap-2">
            <Film className="h-5 w-5" />
            Browse Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-main section animate-in">
      <header className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-display-md font-bold tracking-tight mb-2 flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-brand-500" />
            My Watchlist
          </h1>
          <p className="text-body-lg text-text-secondary-dark dark:text-text-secondary-light">
            {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Link href="/movies/popular" className="btn-secondary gap-2">
          <Film className="h-5 w-5" />
          Browse More
        </Link>
      </header>

      <MovieRow
        title="Your Saved Movies"
        movies={watchlist}
        showViewAll={false}
      />
    </div>
  )
}