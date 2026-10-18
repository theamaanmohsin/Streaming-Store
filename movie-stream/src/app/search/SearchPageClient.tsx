'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { MovieCard, MovieCardSkeleton } from '@/components/movies/MovieCard'
import type { TMDBMovie } from '@/types/tmdb'

async function searchMoviesAPI(query: string, page: number = 1) {
  const params = new URLSearchParams({ q: query, page: page.toString() })
  const response = await fetch(`/api/search?${params.toString()}`)
  if (!response.ok) throw new Error('Search failed')
  return response.json()
}

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

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const performSearch = useCallback((q: string, page: number, append: boolean = false) => {
    if (!q.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    searchMoviesAPI(q, page)
      .then((data) => {
        if (append) {
          setResults((prev) => [...prev, ...data.results])
        } else {
          setResults(data.results)
        }
        setTotalPages(data.total_pages)
        setTotalResults(data.total_results)
        setHasSearched(true)
      })
      .catch((error) => {
        console.error('Search failed:', error)
        if (!append) setResults([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const debouncedSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      performSearch(q, 1, false)
      setCurrentPage(1)
    }, 300)
  }, [performSearch])

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query)
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
      performSearch(query, nextPage, true) // append = true
    }
  }

  return (
    <div className="container-main section animate-in">
      <header className="mb-12">
        <h1 className="text-display-md font-bold tracking-tight mb-4">Search Movies</h1>
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted-dark" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, actors, directors..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-card-dark border border-surface-border-dark text-text-primary-dark placeholder-text-muted-dark focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none text-body-lg"
            autoFocus
          />
          {query && (
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-dark hover:text-text-primary-dark"
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
            <p className="text-body text-text-secondary-dark">
              {totalResults > 0
                ? `Found ${totalResults.toLocaleString()} result${totalResults !== 1 ? 's' : ''} for \u201c${query}\u201d`
                : `No results found for \u201c${query}\u201d`}
            </p>
          </div>

          {isLoading && results.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={i} size="auto" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((movie, index) => (
                  <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index} size="auto" />
                ))}
              </div>
              {currentPage < totalPages && (
                <div className="text-center pt-4">
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
              <Search className="h-16 w-16 mx-auto text-text-muted-dark/50 mb-4" />
              <h2 className="text-heading-md font-semibold mb-2">No movies found</h2>
              <p className="text-text-secondary-dark">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && !query && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-text-muted-dark/50 mb-4" />
          <h2 className="text-heading-md font-semibold mb-2">Start your search</h2>
          <p className="text-text-secondary-dark max-w-md mx-auto">
            Search for movies by title, actor, director, or keyword. Our database includes over 1 million movies and TV shows.
          </p>
        </div>
      )}
    </div>
  )
}