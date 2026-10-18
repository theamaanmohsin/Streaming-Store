'use client'

import Image from 'next/image'
import Link from 'next/link'
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
  size?: 'small' | 'medium' | 'large' | 'auto'
  variant?: 'default' | 'featured'
  priority?: boolean
  className?: string
}

const SIZE_CLASSES: Record<'small' | 'medium' | 'large' | 'auto', string> = {
  small: 'w-32',
  medium: 'w-48',
  large: 'w-56',
  auto: 'w-full',
}

const SIZE_HEIGHTS: Record<'small' | 'medium' | 'large' | 'auto', string> = {
  small: 'h-48',
  medium: 'h-64',
  large: 'h-72',
  auto: 'h-auto',
}

export function MovieCard({
  movie,
  index = 0,
  size = 'medium',
  variant = 'default',
  priority = false,
  className,
}: MovieCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)
  const posterUrl = getImageUrl(movie.poster_path, 'w342')
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'w780')

  const staggerDelay = Math.min(index * 50, 400)

  if (variant === 'featured') {
    return (
      <Link href={`/movie/${movie.id}`}>
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
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/30 to-transparent" />
          </div>

          <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge-primary">{formatYear(movie.release_date)}</span>
                <span className="badge-secondary">{movie.original_language.toUpperCase()}</span>
                <span className="rating">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {formatRating(movie.vote_average)}
                </span>
              </div>
              <h3 className="text-display-sm font-bold tracking-tight mb-3">{movie.title}</h3>
              <p className="text-body-lg text-text-secondary-dark line-clamp-3 mb-6 max-w-xl">
                {movie.overview || 'No overview available.'}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="btn-primary gap-2 pointer-events-none">
                  <Play className="h-5 w-5" />
                  View Details
                </span>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleWatchlist(movie)
                  }}
                >
                  {inWatchlist ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                  {inWatchlist ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/movie/${movie.id}`} className={size === 'auto' ? 'block w-full' : 'inline-block'}>
      <article
        className={cn(
          'group relative animate-in transition-transform duration-normal ease-out hover:scale-[1.035]',
          size !== 'auto' && 'shrink-0',
          size === 'auto' && 'w-full',
          `stagger-${Math.min(Math.floor(index / 4) + 1, 8)}`,
          className
        )}
        style={{ animationDelay: `${staggerDelay}ms` }}
      >
        <div className={cn('relative overflow-hidden rounded-2xl aspect-[2/3]', SIZE_CLASSES[size])}>
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            priority={priority && index < 4}
            sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 200px"
            className="object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <Button
                variant="icon"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleWatchlist(movie)
                }}
                className="bg-surface-card-dark/90 backdrop-blur"
              >
                {inWatchlist ? <BookmarkCheck className="h-5 w-5 text-brand-500" /> : <Bookmark className="h-5 w-5" />}
              </Button>
              <span className={cn('rating text-sm px-2 py-1', 'bg-surface-card-dark/90 backdrop-blur')}>
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {formatRating(movie.vote_average)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <h4
            title={movie.title}
            className={cn(
              'min-h-[2.6em] font-medium text-body-sm leading-[1.3] line-clamp-2',
              size !== 'auto' ? SIZE_CLASSES[size] : 'w-full'
            )}
          >
            {movie.title}
          </h4>
          <p className="text-caption text-text-muted-dark">{formatYear(movie.release_date)}</p>
        </div>
      </article>
    </Link>
  )
}

export function MovieCardSkeleton({
  size = 'medium',
  variant = 'default',
  className,
}: {
  size?: 'small' | 'medium' | 'large' | 'auto'
  variant?: 'default' | 'featured'
  className?: string
}) {
  if (variant === 'featured') {
    return (
      <div className={cn("relative aspect-[16/9] rounded-2xl overflow-hidden animate-pulse-soft", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark" style={{ backgroundSize: '200% 100%' }} />
      </div>
    )
  }

  return (
    <div className={cn('animate-in stagger-1', size !== 'auto' && 'shrink-0', size === 'auto' && 'w-full', className)}>
      <div className={cn('aspect-[2/3] rounded-xl overflow-hidden relative', SIZE_CLASSES[size])}>
        <div className="absolute inset-0 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark animate-pulse-soft" style={{ backgroundSize: '200% 100%' }} />
      </div>
      <div className="mt-2 text-center space-y-1">
        <div className={cn('h-4 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark rounded mx-auto', size !== 'auto' ? SIZE_CLASSES[size] : 'w-3/4')} style={{ backgroundSize: '200% 100%' }} />
        <div className="h-3 w-1/2 mx-auto bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark rounded" style={{ backgroundSize: '200% 100%' }} />
      </div>
    </div>
  )
}
