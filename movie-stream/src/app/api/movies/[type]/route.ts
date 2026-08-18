import { NextRequest, NextResponse } from 'next/server'
import { getMovieList } from '@/lib/tmdb'
import type { MovieListType } from '@/types/tmdb'

const allowed = new Set<MovieListType>(['popular', 'top_rated', 'now_playing', 'upcoming'])

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  if (!allowed.has(params.type as MovieListType)) return NextResponse.json({ error: 'Unknown movie list' }, { status: 404 })
  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page')) || 1)
  return NextResponse.json(await getMovieList(params.type as MovieListType, page))
}
