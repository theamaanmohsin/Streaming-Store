'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, ChevronRight, Star, Calendar, Clock, Ticket, Heart, Bookmark, Share2, ExternalLink, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getImageUrl, getBackdropUrl, getTrailerKey, getYouTubeEmbedUrl, formatYear, formatRuntime, formatRating, formatReleaseDate, formatNumber } from '@/lib/tmdb'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { MovieRow } from '@/components/movies/MovieRow'
import { useWatchlist } from '@/hooks/useWatchlist'
import type { TMDBMovieDetail, TMDBMovie } from '@/types/tmdb'

interface MovieDetailClientProps {
  movie: TMDBMovieDetail
}

export function MovieDetailClient({ movie }: MovieDetailClientProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const availableTrailerKey = getTrailerKey(movie.videos)

  const handlePlayTrailer = () => {
    if (availableTrailerKey) {
      setTrailerKey(availableTrailerKey)
      setTrailerOpen(true)
    }
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shareData = {
      title: `${movie.title} | Stream Store`,
      text: movie.overview || `Watch ${movie.title} on Stream Store`,
      url,
    }

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // User closed the share dialog or share failed
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch (err) {
        console.error('Clipboard copy failed:', err)
      }
    }
  }

  const genres = movie.genres?.map((g) => g.name).join(', ') || ''
  const productionCompanies = movie.production_companies?.slice(0, 4).map((c) => c.name).join(', ') || ''
  const cast = movie.credits?.cast?.slice(0, 10) || []
  const crew = movie.credits?.crew?.filter((c) => c.job === 'Director').slice(0, 3) || []
  const recommendations = movie.recommendations?.results?.slice(0, 12) || []
  const similar = movie.similar?.results?.slice(0, 12) || []
  const watchProviders = movie['watch/providers']?.results?.US?.flatrate || []

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'w1920')
  const posterUrl = getImageUrl(movie.poster_path, 'w500')

  return (
    <article className="animate-in">
      <header
        className="relative min-h-[60vh] flex items-end overflow-hidden"
        style={{ backgroundImage: `url(${backdropUrl})` }}
        aria-labelledby="movie-title"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent" />
        <div className="container-main relative z-10 pb-12 md:pb-16">
          <div className="grid md:grid-cols-4 gap-8 items-end">
            <div className="md:col-span-1">
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
                width={300}
                height={450}
                className="rounded-2xl shadow-shadow-xl w-full max-w-xs mx-auto md:mx-0"
                priority
              />
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge-primary">{formatYear(movie.release_date)}</span>
                {movie.runtime && <span className="badge-secondary">{formatRuntime(movie.runtime)}</span>}
                {movie.genres?.[0] && <span className="badge-secondary">{movie.genres[0].name}</span>}
                <span className="rating">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {formatRating(movie.vote_average)} ({formatNumber(movie.vote_count)})
                </span>
              </div>

              <h1 id="movie-title" className="text-display-lg font-bold tracking-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-body-lg text-text-secondary-dark font-medium italic">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={handlePlayTrailer}
                  disabled={!availableTrailerKey}
                  className="gap-2"
                  aria-label={`Play trailer for ${movie.title}`}
                >
                  <Play className="h-5 w-5" />
                  {availableTrailerKey ? 'Play Trailer' : 'Trailer Unavailable'}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => toggleWatchlist(movie)} className="gap-2">
                  {inWatchlist ? <Bookmark className="h-5 w-5 fill-current" /> : <Bookmark className="h-5 w-5" />}
                  {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleShare}
                  className={cn("gap-2 transition-colors", copied && "text-emerald-400 bg-emerald-500/10")}
                  aria-label="Share movie link"
                >
                  {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Share2 className="h-5 w-5" />}
                  {copied ? 'Link Copied!' : 'Share'}
                </Button>
              </div>

              {genres && (
                <div className="flex flex-wrap items-center gap-2 text-body-sm text-text-muted-dark">
                  <span className="font-medium text-text-secondary-dark">Genres:</span>
                  {movie.genres?.map((genre) => (
                    <span key={genre.id} className="badge-secondary">{genre.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container-main section">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section aria-labelledby="overview-heading">
              <h2 id="overview-heading" className="section-title mb-4">Overview</h2>
              <p className="text-body text-text-secondary-dark leading-relaxed whitespace-pre-line">
                {movie.overview || 'No overview available.'}
              </p>
            </section>

            <section aria-labelledby="details-heading">
              <h2 id="details-heading" className="section-title mb-4">Details</h2>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm">
                <div>
                  <dt className="text-text-muted-dark mb-1">Status</dt>
                  <dd className="font-medium capitalize">{movie.status}</dd>
                </div>
                <div>
                  <dt className="text-text-muted-dark mb-1">Release Date</dt>
                  <dd className="font-medium">{formatReleaseDate(movie.release_date)}</dd>
                </div>
                <div>
                  <dt className="text-text-muted-dark mb-1">Runtime</dt>
                  <dd className="font-medium">{formatRuntime(movie.runtime)}</dd>
                </div>
                <div>
                  <dt className="text-text-muted-dark mb-1">Budget</dt>
                  <dd className="font-medium">${formatNumber(movie.budget)}</dd>
                </div>
                <div>
                  <dt className="text-text-muted-dark mb-1">Revenue</dt>
                  <dd className="font-medium">${formatNumber(movie.revenue)}</dd>
                </div>
                <div>
                  <dt className="text-text-muted-dark mb-1">Original Language</dt>
                  <dd className="font-medium uppercase">{movie.original_language}</dd>
                </div>
                {productionCompanies && (
                  <div className="col-span-2 md:col-span-4">
                    <dt className="text-text-muted-dark mb-1">Production Companies</dt>
                    <dd className="font-medium">{productionCompanies}</dd>
                  </div>
                )}
                {movie.homepage && (
                  <div className="col-span-2 md:col-span-4">
                    <dt className="text-text-muted-dark mb-1">Official Website</dt>
                    <dd>
                      <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-500 hover:underline flex items-center gap-1">
                        Visit Website
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {cast.length > 0 && (
              <section aria-labelledby="cast-heading">
                <h2 id="cast-heading" className="section-title mb-4">Cast</h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="flex flex-col items-center shrink-0 group">
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                        <Image
                          src={getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-body-sm font-medium text-center max-w-[120px] line-clamp-1">{actor.name}</p>
                      <p className="text-caption text-text-muted-dark text-center max-w-[120px] line-clamp-1">as {actor.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {crew.length > 0 && (
              <section aria-labelledby="crew-heading">
                <h2 id="crew-heading" className="section-title mb-4">Crew</h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                  {crew.map((member) => (
                    <div key={member.credit_id} className="flex flex-col items-center shrink-0 group">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <Image
                          src={getImageUrl(member.profile_path, 'w185')}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-body-sm font-medium text-center max-w-[100px] line-clamp-1">{member.name}</p>
                      <p className="text-caption text-text-muted-dark text-center max-w-[100px] line-clamp-1">{member.job}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {watchProviders.length > 0 && (
              <section aria-labelledby="where-to-watch-heading">
                <h2 id="where-to-watch-heading" className="section-title mb-4">Where to Watch</h2>
                <div className="flex flex-wrap gap-3">
                  {watchProviders.map((provider) => (
                    <a
                      key={provider.provider_id}
                      href={movie['watch/providers']?.results?.US?.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-card-dark border border-surface-border-dark hover:border-brand-500 transition-colors"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                      <span className="text-body-sm font-medium">{provider.provider_name}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {recommendations.length > 0 && (
              <MovieRow title="Recommendations" movies={recommendations} showViewAll={false} />
            )}

            {similar.length > 0 && (
              <MovieRow title="Similar Movies" movies={similar} showViewAll={false} />
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6 space-y-4">
                <h3 className="text-heading-sm font-semibold">Quick Info</h3>
                <dl className="space-y-3 text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-muted-dark">Rating</dt>
                    <dd className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
                      {formatRating(movie.vote_average)}/10
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-muted-dark">Votes</dt>
                    <dd className="font-medium">{formatNumber(movie.vote_count)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-muted-dark">Popularity</dt>
                    <dd className="font-medium">{movie.popularity.toFixed(1)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-muted-dark">Release</dt>
                    <dd className="font-medium">{formatReleaseDate(movie.release_date)}</dd>
                  </div>
                  {movie.runtime && (
                    <div className="flex justify-between">
                      <dt className="text-text-muted-dark">Runtime</dt>
                      <dd className="font-medium">{formatRuntime(movie.runtime)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-heading-sm font-semibold mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="badge-secondary">{genre.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {movie.production_countries && movie.production_countries.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-heading-sm font-semibold mb-3">Production Countries</h3>
                  <ul className="space-y-2">
                    {movie.production_countries.map((country) => (
                      <li key={country.iso_3166_1} className="flex justify-between text-body-sm">
                        <span className="text-text-secondary-dark">{country.name}</span>
                        <span className="font-medium uppercase">{country.iso_3166_1}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        movieTitle={movie.title}
        trailerKey={trailerKey}
      />
    </article>
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