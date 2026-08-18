import type { Metadata, Viewport } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/lib/AuthContext'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://streamstore.app'),
  title: {
    default: 'Stream Store - Discover & Stream Movies',
    template: '%s | Stream Store',
  },
  description: 'Discover, track, and stream movies. Browse popular, top-rated, and upcoming movies. Build your watchlist and never miss a great film.',
  keywords: ['movies', 'streaming', 'watchlist', 'TMDB', 'film', 'cinema', 'discover', 'stream store'],
  authors: [{ name: 'Stream Store' }],
  creator: 'Stream Store',
  publisher: 'Stream Store',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://streamstore.app',
    siteName: 'Stream Store',
    title: 'Stream Store - Discover & Stream Movies',
    description: 'Discover, track, and stream movies. Browse popular, top-rated, and upcoming movies.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Stream Store - Discover Movies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stream Store - Discover & Stream Movies',
    description: 'Discover, track, and stream movies. Browse popular, top-rated, and upcoming movies.',
    images: ['/og-image.svg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#CFCFCF' },
    { media: '(prefers-color-scheme: dark)', color: '#252525' },
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
      </head>
      <body className="min-h-screen bg-surface-dark text-text-primary-dark antialiased">
        <AuthProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 btn-primary">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="pt-16 min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
