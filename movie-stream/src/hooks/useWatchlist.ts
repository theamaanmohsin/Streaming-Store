'use client'

import { useState, useEffect, useCallback } from 'react'
import type { TMDBMovie } from '@/types/tmdb'

const WATCHLIST_KEY = 'stream-store-watchlist'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<TMDBMovie[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY)
      if (stored) {
        setWatchlist(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const saveToStorage = useCallback((movies: TMDBMovie[]) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(movies))
    } catch (error) {
      console.error('Failed to save watchlist:', error)
    }
  }, [])

  const addToWatchlist = useCallback((movie: TMDBMovie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev
      const updated = [movie, ...prev]
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const removeFromWatchlist = useCallback((movieId: number) => {
    setWatchlist((prev) => {
      const updated = prev.filter((m) => m.id !== movieId)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const toggleWatchlist = useCallback((movie: TMDBMovie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id)
      const updated = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [movie, ...prev]
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const isInWatchlist = useCallback((movieId: number) => {
    return watchlist.some((m) => m.id === movieId)
  }, [watchlist])

  const clearWatchlist = useCallback(() => {
    setWatchlist([])
    saveToStorage([])
  }, [saveToStorage])

  return {
    watchlist,
    isLoaded,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
    count: watchlist.length,
  }
}