'use client'

import { Suspense } from 'react'
import { MovieCardSkeleton } from '@/components/movies/MovieCard'
import SearchPageClient from './SearchPageClient'

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={
      <div className="container-main section animate-in">
        <header className="mb-12">
          <h1 className="text-display-md font-bold tracking-tight mb-4">Search Movies</h1>
          <div className="relative max-w-2xl">
            <div className="h-14 w-full rounded-xl bg-surface-card-dark border border-surface-border-dark animate-pulse-soft" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </header>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} size="medium" />
          ))}
        </div>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  )
}