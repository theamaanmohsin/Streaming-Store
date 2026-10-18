'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthContext'
import type { TMDBMovie } from '@/types/tmdb'

const WATCHLIST_KEY = 'stream-store-watchlist'

function sanitizeMovie(movie: TMDBMovie) {
  return {
    id: movie.id,
    title: movie.title || '',
    original_title: movie.original_title || '',
    overview: movie.overview || '',
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    release_date: movie.release_date || '',
    vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
    vote_count: typeof movie.vote_count === 'number' ? movie.vote_count : 0,
    genre_ids: Array.isArray(movie.genre_ids) ? movie.genre_ids : [],
    popularity: typeof movie.popularity === 'number' ? movie.popularity : 0,
    adult: Boolean(movie.adult),
    original_language: movie.original_language || 'en',
    video: Boolean(movie.video),
    addedAt: new Date().toISOString(),
  }
}

export function useWatchlist() {
  const { user, isAuthenticated } = useAuth()
  const [watchlist, setWatchlist] = useState<TMDBMovie[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const isInitialSyncDone = useRef(false)

  // 1. Unauthenticated / Local storage sync
  useEffect(() => {
    if (isAuthenticated && user) return

    try {
      const stored = localStorage.getItem(WATCHLIST_KEY)
      if (stored) {
        setWatchlist(JSON.parse(stored))
      } else {
        setWatchlist([])
      }
    } catch (error) {
      console.error('Failed to load watchlist from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [isAuthenticated, user])

  // 2. Authenticated / Firestore real-time listener & guest data migration
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    setIsLoaded(false)
    const watchlistColRef = collection(db, 'users', user.id, 'watchlist')

    // Migrate local storage watchlist items to Firestore on first login
    if (!isInitialSyncDone.current) {
      try {
        const stored = localStorage.getItem(WATCHLIST_KEY)
        if (stored) {
          const localItems: TMDBMovie[] = JSON.parse(stored)
          if (localItems.length > 0) {
            const batch = writeBatch(db)
            localItems.forEach((movie) => {
              const movieDoc = doc(watchlistColRef, String(movie.id))
              batch.set(movieDoc, sanitizeMovie(movie), { merge: true })
            })
            batch.commit().catch((err) => console.warn('Watchlist migration error:', err))
            localStorage.removeItem(WATCHLIST_KEY)
          }
        }
      } catch (err) {
        console.warn('Error reading local watchlist for migration:', err)
      }
      isInitialSyncDone.current = true
    }

    const unsubscribe = onSnapshot(
      watchlistColRef,
      (snapshot) => {
        const movies: TMDBMovie[] = []
        snapshot.forEach((docSnap) => {
          movies.push(docSnap.data() as TMDBMovie)
        })
        // Sort newest added first if addedAt exists
        movies.sort((a, b) => {
          const timeA = (a as unknown as { addedAt?: string }).addedAt || ''
          const timeB = (b as unknown as { addedAt?: string }).addedAt || ''
          return timeB.localeCompare(timeA)
        })
        setWatchlist(movies)
        setIsLoaded(true)
      },
      (error) => {
        console.error('Firestore watchlist listener error:', error)
        // Fallback to local state if Firestore permissions or connection fail
        setIsLoaded(true)
      }
    )

    return () => unsubscribe()
  }, [isAuthenticated, user?.id])

  const saveToStorage = useCallback((movies: TMDBMovie[]) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(movies))
    } catch (error) {
      console.error('Failed to save watchlist to localStorage:', error)
    }
  }, [])

  const addToWatchlist = useCallback(
    async (movie: TMDBMovie) => {
      // Optimistic update
      setWatchlist((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev
        return [movie, ...prev]
      })

      if (isAuthenticated && user?.id) {
        try {
          const movieDoc = doc(db, 'users', user.id, 'watchlist', String(movie.id))
          await setDoc(movieDoc, sanitizeMovie(movie))
        } catch (error) {
          console.error('Failed to add movie to Firestore watchlist:', error)
        }
      } else {
        setWatchlist((prev) => {
          saveToStorage(prev)
          return prev
        })
      }
    },
    [isAuthenticated, user?.id, saveToStorage]
  )

  const removeFromWatchlist = useCallback(
    async (movieId: number) => {
      // Optimistic update
      setWatchlist((prev) => {
        const updated = prev.filter((m) => m.id !== movieId)
        if (!isAuthenticated) {
          saveToStorage(updated)
        }
        return updated
      })

      if (isAuthenticated && user?.id) {
        try {
          const movieDoc = doc(db, 'users', user.id, 'watchlist', String(movieId))
          await deleteDoc(movieDoc)
        } catch (error) {
          console.error('Failed to remove movie from Firestore watchlist:', error)
        }
      }
    },
    [isAuthenticated, user?.id, saveToStorage]
  )

  const toggleWatchlist = useCallback(
    async (movie: TMDBMovie) => {
      const exists = watchlist.some((m) => m.id === movie.id)
      if (exists) {
        await removeFromWatchlist(movie.id)
      } else {
        await addToWatchlist(movie)
      }
    },
    [watchlist, addToWatchlist, removeFromWatchlist]
  )

  const isInWatchlist = useCallback(
    (movieId: number) => {
      return watchlist.some((m) => m.id === movieId)
    },
    [watchlist]
  )

  const clearWatchlist = useCallback(async () => {
    setWatchlist([])
    if (isAuthenticated && user?.id) {
      try {
        const batch = writeBatch(db)
        watchlist.forEach((movie) => {
          const movieDoc = doc(db, 'users', user.id, 'watchlist', String(movie.id))
          batch.delete(movieDoc)
        })
        await batch.commit()
      } catch (error) {
        console.error('Failed to clear Firestore watchlist:', error)
      }
    } else {
      saveToStorage([])
    }
  }, [isAuthenticated, user?.id, watchlist, saveToStorage])

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