'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBackdropUrl, getImageUrl, getTrailerKey, getYouTubeEmbedUrl, formatYear, formatRuntime, formatRating } from '@/lib/tmdb'
import type { TMDBMovieDetail, TMDBGenre } from '@/types/tmdb'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface HeroProps {
  movie: TMDBMovieDetail
}

export function Hero({ movie }: HeroProps) {
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'w1920')
  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const genres = movie.genres?.slice(0, 3).map((g: TMDBGenre) => g.name).join(', ') || ''

  const handlePlayTrailer = () => {
    const key = getTrailerKey(movie.videos)
    if (key) {
      setTrailerKey(key)
      setTrailerOpen(true)
    }
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-end overflow-hidden"
      aria-labelledby="hero-title"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent dark:from-surface-light dark:via-surface-light/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />

      <div className="container-main relative z-10 pb-16 md:pb-24 lg:pb-32 animate-in">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="badge-primary">{formatYear(movie.release_date)}</span>
            {movie.runtime && <span className="badge-secondary">{formatRuntime(movie.runtime)}</span>}
            {movie.genres?.[0] && <span className="badge-secondary">{movie.genres[0].name}</span>}
            <span className="rating">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {formatRating(movie.vote_average)}
            </span>
          </div>

          <h1 id="hero-title" className="text-display-xl font-bold tracking-tight mb-6">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="text-display-sm text-text-secondary-dark dark:text-text-secondary-light mb-6 font-medium">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}

          <p className="text-body-lg text-text-secondary-dark dark:text-text-secondary-light line-clamp-3 mb-8 max-w-2xl">
            {movie.overview || 'No overview available.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={handlePlayTrailer} className="gap-3" aria-label={`Play trailer for ${movie.title}`}>
              <Play className="h-5 w-5" />
              <span>Play Trailer</span>
            </Button>
            <Link href={`/movie/${movie.id}`} className="btn-secondary gap-2">
              More Info
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          {genres && (
            <p className="mt-6 text-body-sm text-text-muted-dark dark:text-text-muted-light">
              <span className="font-medium text-text-secondary-dark dark:text-text-secondary-light">Genres:</span> {genres}
            </p>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        movieTitle={movie.title}
        trailerKey={trailerKey}
      />
    </section>
  )
}

function TrailerModal({ isOpen, onClose, movieTitle, trailerKey }: { isOpen: boolean; onClose: () => void; movieTitle: string; trailerKey: string | null }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={true}
      closeOnOverlayClick={true}
      className="p-0"
    >
      {trailerKey && (
        <div className="relative aspect-video w-full rounded-none">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
            title={`${movieTitle} - Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-none border-0"
          />
        </div>
      )}
    </Modal>
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden animate-pulse-soft">
      <div className="absolute inset-0 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light" style={{ backgroundSize: '200% 100%' }} />
      <div className="container-main relative z-10 pb-16 md:pb-24 lg:pb-32">
        <div className="max-w-4xl space-y-4">
          <div className="h-6 w-32 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="h-14 w-3/4 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="h-6 w-1/2 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="h-20 w-full bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded-lg" style={{ backgroundSize: '200% 100%' }} />
            <div className="h-12 w-32 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded-lg" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
      </div>
    </section>
  )
}