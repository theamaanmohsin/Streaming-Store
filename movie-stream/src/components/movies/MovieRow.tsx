'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MovieCard, MovieCardSkeleton } from './MovieCard'
import type { TMDBMovie, MovieRowProps } from '@/types/tmdb'

export function MovieRow({
  title,
  movies,
  type,
  endpoint,
  showViewAll = true,
  isLoading = false,
}: MovieRowProps) {
  if (isLoading) {
    return (
      <section className="animate-in" aria-label={`${title} (loading)`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} size="medium" />
          ))}
        </div>
      </section>
    )
  }

  if (!movies.length) return null

  return (
    <section className="animate-in" aria-label={title}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">{title}</h2>
        {showViewAll && (type || endpoint) && (
          <Link
            href={endpoint || `/movies/${type}`}
            className="btn-ghost text-body-sm gap-1 hover:gap-2 transition-all duration-fast"
            aria-label={`View all ${title}`}
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} size="medium" />
        ))}
      </div>
    </section>
  )
}

export function FeaturedMovieRow({ movies, isLoading = false }: { movies: TMDBMovie[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <section className="animate-in" aria-label="Featured movie (loading)">
        <MovieCardSkeleton variant="featured" />
      </section>
    )
  }

  if (!movies.length) return null

  const featured = movies[0]

  return (
    <section className="animate-in" aria-label="Featured movie">
      <MovieCard movie={featured} variant="featured" priority index={0} />
    </section>
  )
}