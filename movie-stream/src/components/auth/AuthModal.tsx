'use client'

import { useState } from 'react'
import { X, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/AuthContext'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup' | 'forgot'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function formatAuthError(code?: string, defaultMsg = 'An error occurred. Please try again.'): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Try signing in instead.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to many failed attempts. Please try again later.'
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled.'
    default:
      return defaultMsg
  }
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
  } = useAuth()

  const [mode, setMode] = useState<AuthMode>('signin')
  const [isSigningIn, setIsSigningIn] = useState<'google' | 'apple' | 'email' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const resetForm = () => {
    setError(null)
    setSuccessMessage(null)
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleClose = () => {
    resetForm()
    setMode('signin')
    onClose()
  }

  const handleGoogleSignIn = async () => {
    setIsSigningIn('google')
    setError(null)
    try {
      await signInWithGoogle()
      handleClose()
    } catch (err) {
      const code = (err as { code?: string }).code
      setError(formatAuthError(code, 'Google sign in failed. Please try again.'))
    } finally {
      setIsSigningIn(null)
    }
  }

  const handleAppleSignIn = async () => {
    setIsSigningIn('apple')
    setError(null)
    try {
      await signInWithApple()
      handleClose()
    } catch (err) {
      const code = (err as { code?: string }).code
      setError(formatAuthError(code, 'Apple sign in failed. Please try again.'))
    } finally {
      setIsSigningIn(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSigningIn('email')
    setError(null)
    setSuccessMessage(null)

    try {
      const cleanEmail = email.trim()

      if (mode === 'signin') {
        await signInWithEmail(cleanEmail, password)
        handleClose()
      } else if (mode === 'signup') {
        await signUpWithEmail(cleanEmail, password, name.trim())
        handleClose()
      } else if (mode === 'forgot') {
        await sendPasswordReset(cleanEmail)
        setSuccessMessage(`Password reset link sent to ${cleanEmail}. Check your inbox.`)
      }
    } catch (err) {
      const code = (err as { code?: string }).code
      setError(formatAuthError(code))
    } finally {
      setIsSigningIn(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!isSigningIn}
    >
      <div className="flex flex-col items-center text-center">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={!!isSigningIn}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted-dark hover:text-text-primary-dark hover:bg-surface-border-dark transition-colors dark:text-text-muted-light dark:hover:text-text-primary-light dark:hover:bg-surface-border-light disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 mx-auto shadow-shadow-glow">
            <svg
              className="w-8 h-8 text-brand-contrast"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h2 className="text-heading-lg font-bold tracking-tight">
            {mode === 'signin'
              ? 'Welcome back'
              : mode === 'signup'
              ? 'Create an account'
              : 'Reset Password'}
          </h2>
          <p className="text-body-sm text-text-secondary-dark dark:text-text-secondary-light mt-2">
            {mode === 'signin'
              ? 'Sign in to access your synchronized watchlist and recommendations.'
              : mode === 'signup'
              ? 'Join to sync your movies across all your devices.'
              : 'Enter your email to receive a password recovery link.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="w-full mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-body-sm text-left">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="w-full mb-4 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-body-sm text-left">
            {successMessage}
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left mb-4">
          {mode === 'signup' && (
            <div>
              <label
                className="block text-caption font-medium text-text-secondary-dark dark:text-text-secondary-light mb-1"
                htmlFor="auth-name"
              >
                Your Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted-dark" />
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  placeholder="John Doe"
                  disabled={!!isSigningIn}
                />
              </div>
            </div>
          )}

          <div>
            <label
              className="block text-caption font-medium text-text-secondary-dark dark:text-text-secondary-light mb-1"
              htmlFor="auth-email"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted-dark" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="you@example.com"
                disabled={!!isSigningIn}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  className="block text-caption font-medium text-text-secondary-dark dark:text-text-secondary-light"
                  htmlFor="auth-password"
                >
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot')
                      setError(null)
                      setSuccessMessage(null)
                    }}
                    className="text-caption text-brand-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted-dark" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="At least 6 characters"
                  disabled={!!isSigningIn}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full mt-2" disabled={!!isSigningIn}>
            {isSigningIn === 'email' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : mode === 'signin' ? (
              'Sign In with Email'
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Send Reset Link'
            )}
          </Button>

          {/* Mode Switchers */}
          <div className="text-center pt-1">
            {mode === 'signin' ? (
              <p className="text-body-sm text-text-secondary-dark dark:text-text-secondary-light">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup')
                    setError(null)
                    setSuccessMessage(null)
                  }}
                  className="text-brand-400 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p className="text-body-sm text-text-secondary-dark dark:text-text-secondary-light">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin')
                    setError(null)
                    setSuccessMessage(null)
                  }}
                  className="text-brand-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                  setSuccessMessage(null)
                }}
                className="text-body-sm text-brand-400 font-semibold hover:underline"
              >
                Back to Sign in
              </button>
            )}
          </div>
        </form>

        {/* Social Logins */}
        {mode !== 'forgot' && (
          <>
            {/* Divider */}
            <div className="w-full flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-surface-border-dark dark:bg-surface-border-light" />
              <span className="text-caption text-text-muted-dark dark:text-text-muted-light uppercase tracking-wider">
                or continue with
              </span>
              <div className="flex-1 h-px bg-surface-border-dark dark:bg-surface-border-light" />
            </div>

            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!!isSigningIn}
                className={cn(
                  'w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl',
                  'bg-white text-gray-800 font-medium text-body-sm',
                  'border border-gray-200 shadow-sm',
                  'hover:bg-gray-50 hover:shadow',
                  'active:scale-[0.99]',
                  'transition-all duration-fast',
                  'disabled:opacity-60 disabled:pointer-events-none'
                )}
              >
                {isSigningIn === 'google' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                ) : (
                  <GoogleIcon className="h-5 w-5" />
                )}
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={!!isSigningIn}
                className={cn(
                  'w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl',
                  'bg-surface-dark text-white font-medium text-body-sm',
                  'border border-surface-border-dark',
                  'hover:bg-surface-border-dark/50 hover:shadow',
                  'active:scale-[0.99]',
                  'transition-all duration-fast',
                  'disabled:opacity-60 disabled:pointer-events-none'
                )}
              >
                {isSigningIn === 'apple' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <AppleIcon className="h-5 w-5" />
                )}
                <span>Apple</span>
              </button>
            </div>
          </>
        )}

        {/* Browse without account */}
        <button
          onClick={handleClose}
          disabled={!!isSigningIn}
          className="mt-5 text-body-sm text-text-muted-dark hover:text-text-primary-dark transition-colors dark:text-text-muted-light dark:hover:text-text-primary-light"
        >
          Continue browsing without an account
        </button>

        {/* Terms */}
        <p className="mt-4 text-caption text-text-muted-dark dark:text-text-muted-light leading-relaxed">
          By signing in, you agree to our{' '}
          <span className="underline cursor-pointer">Terms of Service</span> and{' '}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </Modal>
  )
}
