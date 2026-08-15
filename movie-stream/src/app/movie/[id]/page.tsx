import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMovieDetail, getImageUrl, getBackdropUrl, getTrailerKey, getYouTubeEmbedUrl, formatYear, formatRuntime, formatRating, formatReleaseDate, formatNumber } from '@/lib/tmdb'
import { MovieDetailClient } from './MovieDetailClient'
import type { TMDBMovieDetail } from '@/types/tmdb'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieDetail(parseInt(id)).catch(() => null)
  
  if (!movie) {
    return { title: 'Movie Not Found' }
  }

  return {
    title: movie.title,
    description: movie.overview || `Watch ${movie.title} - ${movie.tagline || 'A great movie'}`,
    openGraph: {
      title: movie.title,
      description: movie.overview || movie.tagline || '',
      type: 'video.movie',
      images: movie.backdrop_path ? [getBackdropUrl(movie.backdrop_path, 'w1280')] : [],
      url: `/movie/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: movie.title,
      description: movie.overview || movie.tagline || '',
      images: movie.backdrop_path ? [getBackdropUrl(movie.backdrop_path, 'w1280')] : [],
    },
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params
  const movieId = parseInt(id)

  if (isNaN(movieId)) {
    notFound()
  }

  const movie = await getMovieDetail(movieId).catch(() => null)

  if (!movie) {
    notFound()
  }

  return <MovieDetailClient movie={movie} />
}