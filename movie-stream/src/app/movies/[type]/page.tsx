import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMovieList } from '@/lib/tmdb'
import { MovieRow } from '@/components/movies/MovieRow'
import { MovieCardSkeleton } from '@/components/movies/MovieCard'
import type { MovieListType } from '@/types/tmdb'

const TYPE_LABELS: Record<MovieListType, string> = {
  popular: 'Popular Movies',
  top_rated: 'Top Rated Movies',
  now_playing: 'Now Playing',
  upcoming: 'Upcoming Movies',
}

const TYPE_DESCRIPTIONS: Record<MovieListType, string> = {
  popular: 'The most popular movies right now, based on TMDB user activity.',
  top_rated: 'The highest rated movies on TMDB, with at least 100 votes.',
  now_playing: 'Movies currently playing in theaters.',
  upcoming: 'Upcoming movies scheduled for release.',
}

interface PageProps {
  params: Promise<{ type: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const label = TYPE_LABELS[type as MovieListType] || 'Movies'
  return {
    title: label,
    description: TYPE_DESCRIPTIONS[type as MovieListType] || `Browse ${label.toLowerCase()}.`,
  }
}

export default async function MoviesPage({ params, searchParams }: PageProps) {
  const { type } = await params
  const { page = '1' } = await searchParams
  const pageNum = parseInt(page) || 1

  if (!['popular', 'top_rated', 'now_playing', 'upcoming'].includes(type)) {
    notFound()
  }

  const listType = type as MovieListType
  const data = await getMovieList(listType, pageNum)

  return (
    <div className="container-main section animate-in">
      <header className="mb-12">
        <h1 className="text-display-md font-bold tracking-tight mb-4">{TYPE_LABELS[listType]}</h1>
        <p className="text-body-lg text-text-secondary-dark dark:text-text-secondary-light max-w-2xl">
          {TYPE_DESCRIPTIONS[listType]}
        </p>
      </header>

      <MovieRow
        title={TYPE_LABELS[listType]}
        movies={data.results}
        type={listType}
        showViewAll={false}
      />

      {data.total_pages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
          {pageNum > 1 && (
            <a
              href={`/movies/${type}?page=${pageNum - 1}`}
              className="btn-secondary gap-1"
              aria-label={`Page ${pageNum - 1}`}
            >
              Previous
            </a>
          )}
          <span className="text-body text-text-secondary-dark dark:text-text-secondary-light px-4">
            Page {pageNum} of {data.total_pages}
          </span>
          {pageNum < data.total_pages && (
            <a
              href={`/movies/${type}?page=${pageNum + 1}`}
              className="btn-secondary gap-1"
              aria-label={`Page ${pageNum + 1}`}
            >
              Next
            </a>
          )}
        </nav>
      )}
    </div>
  )
}