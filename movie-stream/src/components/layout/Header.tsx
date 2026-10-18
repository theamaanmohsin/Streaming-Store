'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, Sun, Moon, Monitor, Bookmark, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useTheme } from '@/hooks/useTheme'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useAuth } from '@/lib/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { UserMenu } from '@/components/auth/UserMenu'

export function Header() {
  const { theme, resolvedTheme, toggleTheme, setTheme, isLoaded: themeLoaded } = useTheme()
  const { count: watchlistCount, isLoaded: watchlistLoaded } = useWatchlist()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }

  const ThemeIcon = themeIcons[theme]

  if (!themeLoaded || !watchlistLoaded) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface-dark/80 backdrop-blur-lg border-b border-surface-border-dark">
        <div className="container-main h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="Stream Store Home">
              <span className="text-display-sm font-bold text-gradient">Stream Store</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="icon" size="icon" disabled aria-label="Theme toggle">
              <Sun className="h-6 w-6" />
            </Button>
            <Button variant="icon" size="icon" disabled aria-label="Watchlist" title="Watchlist">
              <Bookmark className="h-6 w-6" />
              <span className="sr-only">Watchlist</span>
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-normal',
        scrolled
          ? 'bg-surface-dark/90 backdrop-blur-lg border-b border-surface-border-dark shadow-shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container-main h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Stream Store Home">
          <span className="text-display-sm font-bold text-gradient">Stream Store</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <Link href="/" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors">
            Home
          </Link>
          <Link href="/movies/popular" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors">
            Movies
          </Link>
          <Link href="/movies/top_rated" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors">
            Top Rated
          </Link>
          <Link href="/search" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors">
            Search
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="icon"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Current theme: ${theme}. Click to cycle.`}
            title={`Theme: ${theme}`}
          >
            <ThemeIcon className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex gap-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </Button>

          <Link href="/watchlist" className="relative" title="Watchlist">
            <Button variant="icon" size="icon" aria-label={`Watchlist (${watchlistCount} items)`} title="Watchlist">
              <Bookmark className="h-6 w-6" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-[12px] font-bold text-brand-contrast">
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth: Sign In or User Menu */}
          {!authLoading && (
            isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )
          )}

          <Button
            variant="icon"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-7 w-7" />
          </Button>
        </div>

      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSignIn={() => {
          setMobileMenuOpen(false)
          setAuthModalOpen(true)
        }}
      />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  )
}

function MobileMenu({ isOpen, onClose, onSignIn }: { isOpen: boolean; onClose: () => void; onSignIn: () => void }) {
  const { isAuthenticated, user, signOut } = useAuth()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/movies/popular', label: 'Popular Movies' },
    { href: '/movies/top_rated', label: 'Top Rated' },
    { href: '/movies/now_playing', label: 'Now Playing' },
    { href: '/movies/upcoming', label: 'Upcoming' },
    { href: '/search', label: 'Search' },
    { href: '/watchlist', label: 'My Watchlist' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" showCloseButton={false}>
      <div className="flex flex-col h-full p-8">
        <div className="flex items-center justify-between mb-12">
          <span className="text-display-sm font-bold text-gradient">Stream Store</span>
          <Button variant="icon" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1" aria-label="Mobile navigation">
          <ul className="space-y-4" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block text-heading-sm font-medium text-text-primary-dark hover:text-brand-500 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile auth */}
        <div className="pt-8 border-t border-surface-border-dark">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-brand-contrast text-body-sm font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-body-sm font-semibold">{user?.name}</p>
                  <p className="text-caption text-text-muted-dark">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut()
                  onClose()
                }}
                className="w-full text-left text-body-sm text-text-secondary-dark hover:text-text-primary-dark transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="w-full btn-primary gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.querySelector('#search-modal-input') as HTMLInputElement
        input?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onClose()
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      closeOnOverlayClick={true}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted-dark" />
          <input
            ref={inputRef}
            id="search-modal-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, actors, directors..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-card-dark border border-surface-border-dark text-text-primary-dark placeholder-text-muted-dark focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            autoComplete="off"
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={!query.trim()}>
            Search
          </Button>
        </div>
        <p className="text-caption text-center text-text-muted-dark">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface-border-dark">Esc</kbd> to close
        </p>
      </form>
    </Modal>
  )
}
