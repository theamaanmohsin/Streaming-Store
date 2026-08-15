export interface TMDBImageConfig {
  base_url: string
  secure_base_url: string
  backdrop_sizes: string[]
  logo_sizes: string[]
  poster_sizes: string[]
  profile_sizes: string[]
  still_sizes: string[]
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  video: boolean
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: TMDBGenre[]
  runtime: number | null
  budget: number
  revenue: number
  homepage: string | null
  imdb_id: string | null
  production_companies: Array<{
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  spoken_languages: Array<{
    english_name: string
    iso_639_1: string
    name: string
  }>
  status: string
  tagline: string | null
  videos: TMDBVideosResponse
  images: TMDBImagesResponse
  credits: TMDBCreditsResponse
  recommendations: TMDBPaginatedResponse<TMDBMovie>
  similar: TMDBPaginatedResponse<TMDBMovie>
  'watch/providers': TMDBWatchProvidersResponse
}

export interface TMDBPaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TMDBVideosResponse {
  results: TMDBVideo[]
}

export interface TMDBVideo {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export interface TMDBImagesResponse {
  backdrops: TMDBImage[]
  logos: TMDBImage[]
  posters: TMDBImage[]
}

export interface TMDBImage {
  aspect_ratio: number
  height: number
  iso_639_1: string | null
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

export interface TMDBCreditsResponse {
  cast: TMDBCastMember[]
  crew: TMDBCrewMember[]
}

export interface TMDBCastMember {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export interface TMDBCrewMember {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  credit_id: string
  department: string
  job: string
}

export interface TMDBWatchProvidersResponse {
  results: Record<string, TMDBWatchProvider>
}

export interface TMDBWatchProvider {
  link: string
  flatrate: TMDBProvider[]
  rent: TMDBProvider[]
  buy: TMDBProvider[]
  free: TMDBProvider[]
}

export interface TMDBProvider {
  display_priority: number
  logo_path: string
  provider_name: string
  provider_id: number
}

export interface TMDBSearchResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBPerson {
  id: number
  name: string
  original_name: string
  profile_path: string | null
  known_for_department: string
  popularity: number
  known_for: TMDBMovie[]
}

export type MovieListType = 'popular' | 'top_rated' | 'now_playing' | 'upcoming'

export interface MovieCardProps {
  movie: TMDBMovie
  index?: number
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'featured'
}

export interface MovieRowProps {
  title: string
  movies: TMDBMovie[]
  type?: MovieListType
  endpoint?: string
  showViewAll?: boolean
  isLoading?: boolean
}