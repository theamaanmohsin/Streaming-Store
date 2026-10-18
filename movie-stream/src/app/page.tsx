import { Metadata } from 'next'
import { getMovieList, getMovieDetail } from '@/lib/tmdb'
import { Hero, HeroSkeleton } from '@/components/layout/Hero'
import { MovieRow, FeaturedMovieRow } from '@/components/movies/MovieRow'
import type { TMDBMovieDetail, TMDBPaginatedResponse, TMDBMovie } from '@/types/tmdb'

export const metadata: Metadata = {
  title: 'Discover & Stream Movies',
  description: 'Browse popular, top-rated, and upcoming movies on Stream Store. Build your watchlist and never miss a great film.',
}

async function getHomeData() {
  const emptyList: TMDBPaginatedResponse<TMDBMovie> = {
    results: [],
    total_pages: 0,
    total_results: 0,
    page: 1,
  }

  const [popularRes, topRatedRes, nowPlayingRes, upcomingRes] = await Promise.all([
    getMovieList('popular', 1).catch(() => emptyList),
    getMovieList('top_rated', 1).catch(() => emptyList),
    getMovieList('now_playing', 1).catch(() => emptyList),
    getMovieList('upcoming', 1).catch(() => emptyList),
  ])

  const popular = popularRes.results.slice(0, 20)
  const topRated = topRatedRes.results.slice(0, 20)
  const nowPlaying = nowPlayingRes.results.slice(0, 20)
  const upcoming = upcomingRes.results.slice(0, 20)

  let featured: TMDBMovieDetail | null = null
  if (popular.length > 0) {
    try {
      featured = await getMovieDetail(popular[0].id)
    } catch (err) {
      console.warn('Could not fetch featured movie details:', err)
    }
  }

  return {
    featured,
    popular,
    topRated,
    nowPlaying,
    upcoming,
  }
}

export default async function HomePage() {
  const { featured, popular, topRated, nowPlaying, upcoming } = await getHomeData()

  return (
    <div className="animate-in">
      {featured ? (
        <Hero movie={featured} />
      ) : (
        <HeroSkeleton />
      )}

      <div className="container-main section space-y-16">
        {popular.length > 0 && (
          <FeaturedMovieRow movies={popular.slice(0, 1)} isLoading={!popular.length} />
        )}

        <MovieRow title="Popular Movies" movies={popular} type="popular" endpoint="/movies/popular" />
        <MovieRow title="Top Rated" movies={topRated} type="top_rated" endpoint="/movies/top_rated" />
        <MovieRow title="Now Playing" movies={nowPlaying} type="now_playing" endpoint="/movies/now_playing" />
        <MovieRow title="Upcoming" movies={upcoming} type="upcoming" endpoint="/movies/upcoming" />
      </div>
    </div>
  )
}
