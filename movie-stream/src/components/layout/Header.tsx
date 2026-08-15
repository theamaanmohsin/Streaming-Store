'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, Sun, Moon, Monitor, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useTheme } from '@/hooks/useTheme'
import { useWatchlist } from '@/hooks/useWatchlist'

export function Header() {
  const { theme, resolvedTheme, toggleTheme, setTheme, isLoaded: themeLoaded } = useTheme()
  const { count: watchlistCount, isLoaded: watchlistLoaded } = useWatchlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
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
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface-dark/80 backdrop-blur-lg border-b border-surface-border-dark dark:bg-surface-light/80 dark:border-surface-border-light">
        <div className="container-main h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="MovieStream Home">
              <span className="text-display-sm font-bold text-gradient">MovieStream</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="icon" size="icon" disabled aria-label="Theme toggle">
              <Sun className="h-5 w-5" />
            </Button>
            <Button variant="icon" size="icon" disabled aria-label="Watchlist">
              <Bookmark className="h-5 w-5" />
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
          ? 'bg-surface-dark/90 backdrop-blur-lg border-b border-surface-border-dark dark:bg-surface-light/90 dark:border-surface-border-light shadow-shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container-main h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="MovieStream Home">
          <span className="text-display-sm font-bold text-gradient">MovieStream</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <Link href="/" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors dark:text-text-secondary-light dark:hover:text-text-primary-light">
            Home
          </Link>
          <Link href="/movies/popular" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors dark:text-text-secondary-light dark:hover:text-text-primary-light">
            Movies
          </Link>
          <Link href="/movies/top_rated" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors dark:text-text-secondary-light dark:hover:text-text-primary-light">
            Top Rated
          </Link>
          <Link href="/search" className="text-body-sm font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors dark:text-text-secondary-light dark:hover:text-text-primary-light">
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
            <ThemeIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex gap-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>

          <Link href="/watchlist" className="relative">
            <Button variant="icon" size="icon" aria-label={`Watchlist (${watchlistCount} items)`}>
              <Bookmark className="h-5 w-5" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="icon"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          <span className="text-display-sm font-bold text-gradient">MovieStream</span>
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
                  className="block text-heading-sm font-medium text-text-primary-dark hover:text-brand-500 transition-colors dark:text-text-primary-light dark:hover:text-brand-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Modal>
  )
}

function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted-dark dark:text-text-muted-light" />
          <input
            ref={inputRef}
            id="search-modal-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, actors, directors..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-card-dark border border-surface-border-dark text-text-primary-dark placeholder-text-muted-dark focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:bg-surface-card-light dark:border-surface-border-light dark:text-text-primary-light dark:placeholder-text-muted-light"
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
        <p className="text-caption text-center text-text-muted-dark dark:text-text-muted-light">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface-border-dark dark:bg-surface-border-light">Esc</kbd> to close
        </p>
      </form>
    </Modal>
  )
}