import type {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBPaginatedResponse,
  TMDBVideosResponse,
  TMDBImagesResponse,
  TMDBCreditsResponse,
  TMDBWatchProvidersResponse,
  TMDBSearchResponse,
  TMDBGenre,
  MovieListType,
} from '@/types/tmdb'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY

if (!API_KEY) {
  console.warn('TMDB_API_KEY not found. Please set it in your environment variables.')
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY || '',
    language: 'en-US',
    ...params,
  })

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`TMDB API error: ${response.status} - ${error.status_message || 'Unknown error'}`)
  }

  return response.json()
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder-movie.svg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getBackdropUrl(path: string | null, size: string = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.svg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getProfileUrl(path: string | null, size: string = 'w185'): string {
  if (!path) return '/placeholder-person.svg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export async function getMovieList(type: MovieListType, page: number = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>(`/movie/${type}`, { page: page.toString() })
}

export async function getMovieDetail(movieId: number): Promise<TMDBMovieDetail> {
  return fetchTMDB<TMDBMovieDetail>(`/movie/${movieId}`, {
    append_to_response: 'videos,images,credits,recommendations,similar,watch/providers',
  })
}

export async function getMovieVideos(movieId: number): Promise<TMDBVideosResponse> {
  return fetchTMDB<TMDBVideosResponse>(`/movie/${movieId}/videos`)
}

export async function getMovieImages(movieId: number): Promise<TMDBImagesResponse> {
  return fetchTMDB<TMDBImagesResponse>(`/movie/${movieId}/images`)
}

export async function getMovieCredits(movieId: number): Promise<TMDBCreditsResponse> {
  return fetchTMDB<TMDBCreditsResponse>(`/movie/${movieId}/credits`)
}

export async function getMovieRecommendations(movieId: number, page: number = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>(`/movie/${movieId}/recommendations`, { page: page.toString() })
}

export async function getMovieSimilar(movieId: number, page: number = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>(`/movie/${movieId}/similar`, { page: page.toString() })
}

export async function getMovieWatchProviders(movieId: number): Promise<TMDBWatchProvidersResponse> {
  return fetchTMDB<TMDBWatchProvidersResponse>(`/movie/${movieId}/watch/providers`)
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
  return fetchTMDB<TMDBSearchResponse>('/search/movie', {
    query,
    page: page.toString(),
    include_adult: 'false',
  })
}

export async function getGenres(): Promise<{ genres: TMDBGenre[] }> {
  return fetchTMDB<{ genres: TMDBGenre[] }>('/genre/movie/list')
}

export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>('/discover/movie', {
    with_genres: genreId.toString(),
    sort_by: 'popularity.desc',
    page: page.toString(),
  })
}

export function getYouTubeEmbedUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`
}

export function getTrailerKey(videos: TMDBVideosResponse): string | null {
  const trailer = videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official
  ) || videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || videos.results.find(
    (v) => v.site === 'YouTube'
  )
  return trailer?.key || null
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export function formatReleaseDate(dateString: string): string {
  if (!dateString) return 'TBA'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatYear(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).getFullYear().toString()
}

export function formatRating(vote: number): string {
  return vote.toFixed(1)
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toString()
}