'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

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
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function toUser(firebaseUser: FirebaseUser): User {
  const provider = firebaseUser.providerData.some((item) => item.providerId === 'google.com')
    ? 'google'
    : firebaseUser.providerData.some((item) => item.providerId === 'apple.com')
    ? 'apple'
    : 'email'

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Stream User',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || '',
    provider,
  }
}

async function syncUserToFirestore(firebaseUser: FirebaseUser) {
  try {
    const userRef = doc(db, 'users', firebaseUser.uid)
    await setDoc(
      userRef,
      {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
  } catch (error) {
    // Non-blocking catch so Firestore sync errors do not crash authentication
    console.warn('Could not sync user profile to Firestore:', error)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(toUser(firebaseUser))
        syncUserToFirestore(firebaseUser)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signInWithProvider = async (provider: GoogleAuthProvider | OAuthProvider) => {
    const result = await signInWithPopup(auth, provider)
    if (result.user) {
      setUser(toUser(result.user))
      await syncUserToFirestore(result.user)
    }
  }

  const signInWithGoogle = () => signInWithProvider(new GoogleAuthProvider())
  const signInWithApple = () => signInWithProvider(new OAuthProvider('apple.com'))

  const signInWithEmail = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    if (credential.user) {
      setUser(toUser(credential.user))
      await syncUserToFirestore(credential.user)
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (credential.user) {
      if (displayName) {
        await updateProfile(credential.user, { displayName })
      }
      setUser(toUser(credential.user))
      await syncUserToFirestore(credential.user)
    }
  }

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
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
