'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { MovieCard, MovieCardSkeleton } from './MovieCard'
import type { TMDBMovie, MovieRowProps } from '@/types/tmdb'

export function MovieRow({ title, movies, type, endpoint, showViewAll = true, isLoading = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const scroll = (direction: 'left' | 'right') => rowRef.current?.scrollBy({ left: direction === 'right' ? 520 : -520, behavior: 'smooth' })
  if (isLoading) return <section className="animate-in" aria-label={`${title} (loading)`}><div className="flex items-center justify-between mb-8"><h2 className="section-title">{title}</h2></div><div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 -mx-6 px-6">{Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} size="medium" />)}</div></section>
  if (!movies.length) return null
  return <section className="animate-in" aria-label={title}><div className="flex items-center justify-between mb-8"><h2 className="section-title">{title}</h2>{showViewAll && (type || endpoint) && <Link href={endpoint || `/movies/${type}`} className="btn-ghost text-body-sm gap-2 hover:gap-3 transition-all duration-fast ease-out" aria-label={`View all ${title}`}>View all <ChevronRight className="h-5 w-5" /></Link>}</div><div className="group/row relative -mx-6"><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-surface-dark to-transparent opacity-0 transition-opacity duration-fast group-hover/row:opacity-100" /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-surface-dark to-transparent" /><button type="button" aria-label={`Scroll ${title} left`} onClick={() => scroll('left')} className="absolute left-2 top-[42%] z-20 hidden -translate-y-1/2 rounded-full bg-surface-card-dark/95 p-2 text-text-primary-dark shadow-shadow-lg transition-all duration-fast ease-out hover:scale-110 hover:bg-brand-500 hover:text-brand-contrast group-hover/row:flex"><ChevronLeft className="h-5 w-5" /></button><button type="button" aria-label={`Scroll ${title} right`} onClick={() => scroll('right')} className="absolute right-2 top-[42%] z-20 hidden -translate-y-1/2 rounded-full bg-surface-card-dark/95 p-2 text-text-primary-dark shadow-shadow-lg transition-all duration-fast ease-out hover:scale-110 hover:bg-brand-500 hover:text-brand-contrast group-hover/row:flex"><ChevronRight className="h-5 w-5" /></button><div ref={rowRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-6 scroll-smooth">{movies.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} size="medium" />)}</div></div></section>
}

export function FeaturedMovieRow({ movies, isLoading = false }: { movies: TMDBMovie[]; isLoading?: boolean }) {
  if (isLoading) return <section className="animate-in" aria-label="Featured movie (loading)"><MovieCardSkeleton variant="featured" /></section>
  if (!movies.length) return null
  return <section className="animate-in" aria-label="Featured movie"><MovieCard movie={movies[0]} variant="featured" priority index={0} /></section>
}
