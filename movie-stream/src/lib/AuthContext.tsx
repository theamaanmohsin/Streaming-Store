'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  provider: 'google' | 'apple' | 'email'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'stream-store-auth'

// Demo user profiles for mock auth
const GOOGLE_DEMO_USER: User = {
  id: 'google-user-001',
  name: 'Stream User',
  email: 'user@gmail.com',
  avatar: '',
  provider: 'google',
}

const APPLE_DEMO_USER: User = {
  id: 'apple-user-001',
  name: 'Stream User',
  email: 'user@icloud.com',
  avatar: '',
  provider: 'apple',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load persisted auth state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.id) {
          setUser(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load auth state:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const persistUser = useCallback((u: User | null) => {
    try {
      if (u) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to persist auth state:', error)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    // Simulate OAuth delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const user = { ...GOOGLE_DEMO_USER }
    setUser(user)
    persistUser(user)
  }, [persistUser])

  const signInWithApple = useCallback(async () => {
    // Simulate OAuth delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const user = { ...APPLE_DEMO_USER }
    setUser(user)
    persistUser(user)
  }, [persistUser])

  const signOut = useCallback(() => {
    setUser(null)
    persistUser(null)
  }, [persistUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
