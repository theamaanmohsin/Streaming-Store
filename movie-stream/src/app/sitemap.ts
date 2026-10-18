import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://streamstore.app'

  const routes = [
    '',
    '/movies/popular',
    '/movies/top_rated',
    '/movies/now_playing',
    '/movies/upcoming',
    '/search',
    '/watchlist',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route.startsWith('/movies') ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/movies') ? 0.8 : 0.6,
  }))
}
