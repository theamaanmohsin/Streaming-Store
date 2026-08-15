'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { MovieRow } from '@/components/movies/MovieRow'
import { MovieCardSkeleton } from '@/components/movies/MovieCard'
import { searchMovies } from '@/lib/tmdb'
import type { TMDBMovie } from '@/types/tmdb'

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const debouncedSearch = useCallback(
    debounce((...args: unknown[]) => {
      const q = args[0] as string
      const page = args[1] as number
      if (!q.trim()) {
        setResults([])
        setHasSearched(false)
        return
      }

      setIsLoading(true)
      searchMovies(q, page)
        .then((data) => {
          setResults(data.results)
          setTotalPages(data.total_pages)
          setTotalResults(data.total_results)
          setHasSearched(true)
        })
        .catch((error) => {
          console.error('Search failed:', error)
          setResults([])
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, 300),
    []
  )

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query, 1)
      setCurrentPage(1)
    } else {
      setResults([])
      setHasSearched(false)
    }
  }, [query, debouncedSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      debouncedSearch(query, nextPage)
    }
  }

  return (
    <div className="container-main section animate-in">
      <header className="mb-12">
        <h1 className="text-display-md font-bold tracking-tight mb-4">Search Movies</h1>
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted-dark dark:text-text-muted-light" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, actors, directors..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-card-dark border border-surface-border-dark text-text-primary-dark placeholder-text-muted-dark focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:bg-surface-card-light dark:border-surface-border-light dark:text-text-primary-light dark:placeholder-text-muted-light text-body-lg"
            autoFocus
          />
          {query && (
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-dark hover:text-text-primary-dark dark:text-text-muted-light hover:dark:text-text-primary-light"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </form>
      </header>

      {hasSearched && (
        <div className="space-y-8" role="status" aria-live="polite">
          <div className="flex items-center justify-between">
            <p className="text-body text-text-secondary-dark dark:text-text-secondary-light">
              {totalResults > 0
                ? `Found ${totalResults.toLocaleString()} result${totalResults !== 1 ? 's' : ''} for &ldquo;${query}&rdquo;`
                : `No results found for &ldquo;${query}&rdquo;`}
            </p>
          </div>

          {isLoading && results.length === 0 ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <MovieCardSkeleton key={i} size="medium" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <MovieRow title={`Results for "${query}"`} movies={results} showViewAll={false} />
              {currentPage < totalPages && (
                <div className="text-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      `Load More (Page ${currentPage + 1} of ${totalPages})`
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-text-muted-dark/50 dark:text-text-muted-light/50 mb-4" />
              <h2 className="text-heading-md font-semibold mb-2">No movies found</h2>
              <p className="text-text-secondary-dark dark:text-text-secondary-light">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && !query && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-text-muted-dark/50 dark:text-text-muted-light/50 mb-4" />
          <h2 className="text-heading-md font-semibold mb-2">Start your search</h2>
          <p className="text-text-secondary-dark dark:text-text-secondary-light max-w-md mx-auto">
            Search for movies by title, actor, director, or keyword. Our database includes over 1 million movies and TV shows.
          </p>
        </div>
      )}
    </div>
  )
}

function debounce(func: (...args: unknown[]) => void, wait: number): (...args: unknown[]) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: unknown[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}