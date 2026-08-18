import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMovieDetail, getBackdropUrl } from '@/lib/tmdb'
import { MovieDetailClient } from './MovieDetailClient'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams?.id
  const movieId = parseInt(id)
  if (isNaN(movieId)) {
    return { title: 'Movie Not Found' }
  }

  const movie = await getMovieDetail(movieId).catch(() => null)
  
  if (!movie) {
    return { title: 'Movie Not Found' }
  }

  return {
    title: movie.title,
    description: movie.overview || `Watch ${movie.title} - ${movie.tagline || 'A great movie'} on Stream Store`,
    openGraph: {
      title: `${movie.title} | Stream Store`,
      description: movie.overview || movie.tagline || '',
      type: 'video.movie',
      images: movie.backdrop_path ? [getBackdropUrl(movie.backdrop_path, 'w1280')] : [],
      url: `/movie/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title} | Stream Store`,
      description: movie.overview || movie.tagline || '',
      images: movie.backdrop_path ? [getBackdropUrl(movie.backdrop_path, 'w1280')] : [],
    },
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams?.id
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