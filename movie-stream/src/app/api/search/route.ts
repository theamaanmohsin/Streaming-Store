import { NextRequest, NextResponse } from 'next/server'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'

  if (!query || !query.trim()) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0, page: 1 })
  }

  const apiKey = process.env.TMDB_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 500 }
    )
  }

  try {
    const tmdbParams = new URLSearchParams({
      api_key: apiKey,
      language: 'en-US',
      query: query.trim(),
      page,
      include_adult: 'false',
    })

    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?${tmdbParams.toString()}`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 300 }, // Cache for 5 min
      }
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [], total_pages: 0, total_results: 0, page: 1 },
      { status: 500 }
    )
  }
}
