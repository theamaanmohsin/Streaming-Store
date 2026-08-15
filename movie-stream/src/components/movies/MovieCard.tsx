'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getImageUrl, getBackdropUrl, formatRating, formatYear } from '@/lib/tmdb'
import type { TMDBMovie } from '@/types/tmdb'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Play, Bookmark, BookmarkCheck } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'

interface MovieCardProps {
  movie: TMDBMovie
  index?: number
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'featured'
  priority?: boolean
}

const SIZE_CLASSES = {
  small: 'w-28',
  medium: 'w-40',
  large: 'w-56',
}

const SIZE_HEIGHTS = {
  small: 'h-42',
  medium: 'h-60',
  large: 'h-84',
}

export function MovieCard({
  movie,
  index = 0,
  size = 'medium',
  variant = 'default',
  priority = false,
}: MovieCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)
  const posterUrl = getImageUrl(movie.poster_path, 'w342')
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'w780')

  const staggerDelay = Math.min(index * 50, 400)

  if (variant === 'featured') {
    return (
      <article
        className={cn(
          'relative overflow-hidden rounded-2xl card-interactive animate-in',
          'stagger-1',
          'md:aspect-[16/9]',
          'transition-all duration-slow'
        )}
        style={{ animationDelay: `${staggerDelay}ms` }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
            placeholder="blur"
            blurDataURL={getImageUrl(movie.backdrop_path, 'w30') || undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/30 to-transparent dark:from-surface-light/90 dark:via-surface-light/30" />
        </div>

        <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-primary">{formatYear(movie.release_date)}</span>
              <span className="badge-secondary">{movie.original_language.toUpperCase()}</span>
              <span className="rating">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {formatRating(movie.vote_average)}
              </span>
            </div>
            <h3 className="text-display-sm font-bold tracking-tight mb-3">{movie.title}</h3>
            <p className="text-body-lg text-text-secondary-dark dark:text-text-secondary-light line-clamp-3 mb-6 max-w-xl">
              {movie.overview || 'No overview available.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Play Trailer
              </Button>
              <Button variant="ghost" size="lg" onClick={() => toggleWatchlist(movie)}>
                {inWatchlist ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                {inWatchlist ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group relative animate-in',
        `stagger-${Math.min(Math.floor(index / 4) + 1, 8)}`
      )}
      style={{ animationDelay: `${staggerDelay}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          priority={priority && index < 4}
          sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
          className={cn(
            'object-cover transition-all duration-500 group-hover:scale-105',
            SIZE_CLASSES[size],
            SIZE_HEIGHTS[size]
          )}
          placeholder="blur"
          blurDataURL={getImageUrl(movie.poster_path, 'w30') || undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <Button variant="icon" size="icon" onClick={() => toggleWatchlist(movie)} className="bg-surface-card-dark/90 backdrop-blur">
              {inWatchlist ? <BookmarkCheck className="h-5 w-5 text-brand-500" /> : <Bookmark className="h-5 w-5" />}
            </Button>
            <span className={cn('rating text-xs px-2 py-1', 'bg-surface-card-dark/90 backdrop-blur')}>
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {formatRating(movie.vote_average)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <h4 className="font-medium text-body-sm line-clamp-1">{movie.title}</h4>
        <p className="text-caption text-text-muted-dark dark:text-text-muted-light">{formatYear(movie.release_date)}</p>
      </div>
    </article>
  )
}

export function MovieCardSkeleton({ size = 'medium', variant = 'default' }: { size?: 'small' | 'medium' | 'large'; variant?: 'default' | 'featured' }) {
  if (variant === 'featured') {
    return (
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden animate-pulse-soft">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light" style={{ backgroundSize: '200% 100%' }} />
      </div>
    )
  }

  return (
    <div className="animate-in stagger-1">
      <div className={cn('aspect-[2/3] rounded-xl overflow-hidden', SIZE_CLASSES[size], SIZE_HEIGHTS[size])}>
        <div className="absolute inset-0 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light" style={{ backgroundSize: '200% 100%' }} />
      </div>
      <div className="mt-2 text-center space-y-1">
        <div className="h-4 w-full bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
        <div className="h-3 w-1/2 mx-auto bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
      </div>
    </div>
  )
}