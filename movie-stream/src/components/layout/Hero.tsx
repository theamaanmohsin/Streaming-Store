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
      className="relative min-h-[80vh] flex items-end overflow-hidden"
      aria-labelledby="hero-title"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.5)_42%,rgba(0,0,0,0)_78%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

      <div className="container-main relative z-10 pb-20 md:pb-32 lg:pb-40 animate-in">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="badge-secondary border-brand-contrast/30 bg-black/35 text-xs text-brand-contrast font-medium">{formatYear(movie.release_date)}</span>
            {movie.runtime && <span className="badge-secondary border-brand-contrast/30 bg-black/35 text-xs text-brand-contrast">{formatRuntime(movie.runtime)}</span>}
            {movie.genres?.[0] && <span className="badge-secondary border-brand-contrast/30 bg-black/35 text-xs text-brand-contrast">{movie.genres[0].name}</span>}
            <span className="rating bg-brand-contrast text-surface-dark">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {formatRating(movie.vote_average)}
            </span>
          </div>

          <h1 id="hero-title" className="text-display-2xl font-bold tracking-tight mb-8">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="text-display-sm text-brand-contrast/80 mb-8 font-medium">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}

          <p className="text-body-lg text-brand-contrast/80 line-clamp-4 mb-10 max-w-3xl">
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
            <p className="mt-8 text-body-sm text-brand-contrast/70">
              <span className="font-medium text-brand-contrast">Genres:</span> {genres}
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
    <section className="relative min-h-[80vh] flex items-end overflow-hidden animate-pulse-soft">
      <div className="absolute inset-0 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light" style={{ backgroundSize: '200% 100%' }} />
      <div className="container-main relative z-10 pb-20 md:pb-32 lg:pb-40">
        <div className="max-w-5xl space-y-6">
          <div className="h-10 w-4/5 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="h-16 w-3/4 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="h-10 w-1/2 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="h-24 w-full bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded" style={{ backgroundSize: '200% 100%' }} />
          <div className="flex gap-4">
            <div className="h-14 w-56 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded-lg" style={{ backgroundSize: '200% 100%' }} />
            <div className="h-14 w-40 bg-gradient-to-r from-surface-border-dark via-surface-card-dark to-surface-border-dark dark:from-surface-border-light dark:via-surface-card-light dark:to-surface-border-light rounded-lg" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
