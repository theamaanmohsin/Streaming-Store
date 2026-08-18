import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMovieList } from '@/lib/tmdb'
import { MovieListClient } from './MovieListClient'
import type { MovieListType } from '@/types/tmdb'

const TYPE_LABELS: Record<MovieListType, string> = {
  popular: 'Popular Movies',
  top_rated: 'Top Rated Movies',
  now_playing: 'Now Playing',
  upcoming: 'Upcoming Movies',
}

const TYPE_DESCRIPTIONS: Record<MovieListType, string> = {
  popular: 'The most popular movies right now on Stream Store, based on TMDB user activity.',
  top_rated: 'The highest rated movies on TMDB, with at least 100 votes.',
  now_playing: 'Movies currently playing in theaters.',
  upcoming: 'Upcoming movies scheduled for release.',
}

interface PageProps { params: { type: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const type = resolvedParams?.type
  const label = TYPE_LABELS[type as MovieListType] || 'Movies'
  return {
    title: `${label} | Stream Store`,
    description: TYPE_DESCRIPTIONS[type as MovieListType] || `Browse ${label.toLowerCase()} on Stream Store.`,
  }
}

export default async function MoviesPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params)
  const type = resolvedParams?.type

  if (!['popular', 'top_rated', 'now_playing', 'upcoming'].includes(type)) {
    notFound()
  }

  const listType = type as MovieListType
  const data = await getMovieList(listType, 1)

  return (
    <MovieListClient title={TYPE_LABELS[listType]} description={TYPE_DESCRIPTIONS[listType]} type={listType} initialMovies={data.results} totalPages={data.total_pages} />
  )
}
