import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://moviestream.app'),
  title: {
    default: 'MovieStream - Discover & Track Movies',
    template: '%s | MovieStream',
  },
  description: 'Discover, track, and enjoy movies. Browse popular, top-rated, and upcoming movies. Build your watchlist and never miss a great film.',
  keywords: ['movies', 'streaming', 'watchlist', 'TMDB', 'film', 'cinema', 'discover'],
  authors: [{ name: 'MovieStream' }],
  creator: 'MovieStream',
  publisher: 'MovieStream',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://moviestream.app',
    siteName: 'MovieStream',
    title: 'MovieStream - Discover & Track Movies',
    description: 'Discover, track, and enjoy movies. Browse popular, top-rated, and upcoming movies.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'MovieStream - Discover Movies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MovieStream - Discover & Track Movies',
    description: 'Discover, track, and enjoy movies. Browse popular, top-rated, and upcoming movies.',
    images: ['/og-image.svg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
      </head>
      <body className="min-h-screen bg-surface-dark text-text-primary-dark dark:bg-surface-light dark:text-text-primary-light antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 btn-primary">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}