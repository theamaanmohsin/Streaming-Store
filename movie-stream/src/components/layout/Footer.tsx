import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Film, Star, Search, Heart, Github, Twitter, MessageCircle } from 'lucide-react'

const FOOTER_LINKS = {
  discover: [
    { href: '/movies/popular', label: 'Popular Movies' },
    { href: '/movies/top_rated', label: 'Top Rated' },
    { href: '/movies/now_playing', label: 'Now Playing' },
    { href: '/movies/upcoming', label: 'Upcoming' },
    { href: '/search', label: 'Search' },
  ],
  account: [
    { href: '/watchlist', label: 'My Watchlist' },
    { href: '/settings', label: 'Settings' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
  social: [
    { href: 'https://github.com', label: 'GitHub', icon: Github, external: true },
    { href: 'https://twitter.com', label: 'Twitter', icon: Twitter, external: true },
    { href: 'https://discord.com', label: 'Discord', icon: MessageCircle, external: true },
  ],
}

export function Footer() {
  return (
    <footer className="bg-surface-card-dark border-t border-surface-border-dark dark:bg-surface-card-light dark:border-surface-border-light" role="contentinfo">
      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6" aria-label="MovieStream Home">
              <Film className="h-8 w-8 text-brand-500" />
              <span className="text-display-sm font-bold text-gradient">MovieStream</span>
            </Link>
            <p className="text-body text-text-secondary-dark dark:text-text-secondary-light max-w-xs mb-6">
              Discover, track, and enjoy movies. Built with TMDB API for movie lovers everywhere.
            </p>
            <div className="flex items-center gap-4">
              {FOOTER_LINKS.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="text-text-muted-dark hover:text-brand-500 transition-colors dark:text-text-muted-light dark:hover:text-brand-400"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Discover">
            <h3 className="text-heading-sm font-semibold mb-4">Discover</h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.discover.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary-dark hover:text-brand-500 transition-colors dark:text-text-secondary-light dark:hover:text-brand-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account">
            <h3 className="text-heading-sm font-semibold mb-4">Account</h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.account.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary-dark hover:text-brand-500 transition-colors dark:text-text-secondary-light dark:hover:text-brand-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-heading-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-text-secondary-dark hover:text-brand-500 transition-colors dark:text-text-secondary-light dark:hover:text-brand-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-surface-border-dark dark:border-surface-border-light">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-body-sm text-text-muted-dark dark:text-text-muted-light">
              © {new Date().getFullYear()} MovieStream. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-body-sm text-text-muted-dark dark:text-text-muted-light">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-brand-500" aria-hidden="true" />
                Powered by TMDB API
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-red-500" aria-hidden="true" />
                Made for movie lovers
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}