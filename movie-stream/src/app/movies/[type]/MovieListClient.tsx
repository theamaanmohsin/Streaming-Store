'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MovieRow } from '@/components/movies/MovieRow'
import type { MovieListType, TMDBMovie } from '@/types/tmdb'

export function MovieListClient({ title, description, type, initialMovies, totalPages }: { title: string; description: string; type: MovieListType; initialMovies: TMDBMovie[]; totalPages: number }) {
  const [movies, setMovies] = useState(initialMovies)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const loadMore = async () => {
    setLoading(true)
    try {
      const next = page + 1
      const response = await fetch(`/api/movies/${type}?page=${next}`)
      if (!response.ok) throw new Error('Unable to load more movies')
      const data = await response.json()
      setMovies((current) => [...current, ...data.results])
      setPage(next)
    } finally { setLoading(false) }
  }
  return <div className="container-main section animate-in"><header className="mb-16"><h1 className="text-display-md font-bold tracking-tight mb-4">{title}</h1><p className="text-body-lg text-text-secondary-dark max-w-2xl">{description}</p></header><MovieRow title="Browse movies" movies={movies} type={type} showViewAll={false} />{page < totalPages && <div className="mt-16 flex justify-center"><Button variant="secondary" size="lg" onClick={loadMore} disabled={loading}>{loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Loading more...</> : 'Load more movies'}</Button></div>}</div>
}
