'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/AuthContext'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#252525"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#545454"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#7D7D7D"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#CFCFCF"/>
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithApple } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsSigningIn('google')
    setError(null)
    try {
      await signInWithGoogle()
      onClose()
    } catch (err) {
      setError('Sign in failed. Please try again.')
    } finally {
      setIsSigningIn(null)
    }
  }

  const handleAppleSignIn = async () => {
    setIsSigningIn('apple')
    setError(null)
    try {
      await signInWithApple()
      onClose()
    } catch (err) {
      setError('Sign in failed. Please try again.')
    } finally {
      setIsSigningIn(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!isSigningIn}
    >
      <div className="flex flex-col items-center text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={!!isSigningIn}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted-dark hover:text-text-primary-dark hover:bg-surface-border-dark transition-colors dark:text-text-muted-light dark:hover:text-text-primary-light dark:hover:bg-surface-border-light disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 mx-auto shadow-shadow-glow">
            <svg className="w-8 h-8 text-brand-contrast" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <h2 className="text-heading-lg font-bold tracking-tight">Welcome to Stream Store</h2>
          <p className="text-body-sm text-text-secondary-dark dark:text-text-secondary-light mt-2">
            Sign in to save your watchlist, get recommendations, and stream movies.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full mb-4 px-4 py-3 rounded-lg bg-surface-border-dark/20 border border-surface-border-dark text-text-primary-dark text-body-sm">
            {error}
          </div>
        )}

        {/* Sign in buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={!!isSigningIn}
            className={cn(
              'w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl',
              'bg-white text-gray-800 font-medium text-body',
              'border border-gray-200 shadow-sm',
              'hover:bg-gray-50 hover:shadow-md',
              'active:scale-[0.98]',
              'transition-all duration-fast',
              'disabled:opacity-60 disabled:pointer-events-none'
            )}
          >
            {isSigningIn === 'google' ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            ) : (
              <GoogleIcon className="h-5 w-5" />
            )}
            <span>{isSigningIn === 'google' ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <button
            onClick={handleAppleSignIn}
            disabled={!!isSigningIn}
            className={cn(
              'w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl',
              'bg-surface-dark text-brand-contrast font-medium text-body',
              'border border-gray-800',
              'hover:bg-gray-900 hover:shadow-md',
              'active:scale-[0.98]',
              'transition-all duration-fast',
              'disabled:opacity-60 disabled:pointer-events-none'
            )}
          >
            {isSigningIn === 'apple' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <AppleIcon className="h-5 w-5" />
            )}
            <span>{isSigningIn === 'apple' ? 'Signing in...' : 'Continue with Apple'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-surface-border-dark dark:bg-surface-border-light" />
          <span className="text-caption text-text-muted-dark dark:text-text-muted-light uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-surface-border-dark dark:bg-surface-border-light" />
        </div>

        {/* Browse without account */}
        <button
          onClick={onClose}
          disabled={!!isSigningIn}
          className="text-body-sm text-text-secondary-dark hover:text-brand-500 transition-colors dark:text-text-secondary-light dark:hover:text-brand-400"
        >
          Continue browsing without an account
        </button>

        {/* Terms */}
        <p className="mt-6 text-caption text-text-muted-dark dark:text-text-muted-light leading-relaxed">
          By signing in, you agree to our{' '}
          <span className="text-text-secondary-dark dark:text-text-secondary-light underline cursor-pointer">Terms of Service</span>{' '}
          and{' '}
          <span className="text-text-secondary-dark dark:text-text-secondary-light underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </Modal>
  )
}
