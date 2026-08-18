import { Metadata } from 'next'
import { getMovieList } from '@/lib/tmdb'
import { Hero } from '@/components/layout/Hero'
import { MovieRow, FeaturedMovieRow } from '@/components/movies/MovieRow'
import { HeroSkeleton } from '@/components/layout/Hero'
import type { TMDBMovieDetail, TMDBMovie } from '@/types/tmdb'

export const metadata: Metadata = {
  title: 'Discover & Stream Movies',
  description: 'Browse popular, top-rated, and upcoming movies on Stream Store. Build your watchlist and never miss a great film.',
}

async function getHomeData() {
  const [featured, popular, topRated, nowPlaying, upcoming] = await Promise.all([
    getMovieList('popular', 1).then((res) => res.results[0]).then(async (movie) => {
      if (movie) {
        const detail = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos,genres`
        ).then((r) => r.json())
        return detail as TMDBMovieDetail
      }
      return null
    }),
    getMovieList('popular', 1),
    getMovieList('top_rated', 1),
    getMovieList('now_playing', 1),
    getMovieList('upcoming', 1),
  ])

  return {
    featured,
    popular: popular.results.slice(0, 20),
    topRated: topRated.results.slice(0, 20),
    nowPlaying: nowPlaying.results.slice(0, 20),
    upcoming: upcoming.results.slice(0, 20),
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
        <FeaturedMovieRow movies={popular.slice(0, 1)} isLoading={!popular.length} />

        <MovieRow title="Popular Movies" movies={popular} type="popular" endpoint="/movies/popular" />
        <MovieRow title="Top Rated" movies={topRated} type="top_rated" endpoint="/movies/top_rated" />
        <MovieRow title="Now Playing" movies={nowPlaying} type="now_playing" endpoint="/movies/now_playing" />
        <MovieRow title="Upcoming" movies={upcoming} type="upcoming" endpoint="/movies/upcoming" />
      </div>
    </div>
  )
}
