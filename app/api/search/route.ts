import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = (searchParams.get('q') || '').toLowerCase().trim()

  try {
    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Search through products by title, description, category, and tags
    const results = products.filter(product => {
      const title = product.title.toLowerCase()
      const description = product.description.toLowerCase()
      const category = product.category.toLowerCase()
      const tags = product.tags?.map(t => t.toLowerCase()).join(' ') || ''

      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query) ||
        tags.includes(query)
      )
    })

    // Sort by relevance (title match > description match > tag match)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query) ? 3 : 0
      const bTitle = b.title.toLowerCase().includes(query) ? 3 : 0
      const aDesc = a.description.toLowerCase().includes(query) ? 2 : 0
      const bDesc = b.description.toLowerCase().includes(query) ? 2 : 0
      const aTag = a.tags?.some(t => t.toLowerCase().includes(query)) ? 1 : 0
      const bTag = b.tags?.some(t => t.toLowerCase().includes(query)) ? 1 : 0

      return bTitle + bDesc + bTag - (aTitle + aDesc + aTag)
    })

    return NextResponse.json({ results }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[v0] Search API error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}
