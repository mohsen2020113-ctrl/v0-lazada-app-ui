import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { products } from '@/lib/data/products'

interface IntentResult {
  intent: string
  category?: string
  priceRange?: { min: number; max: number }
  attributes?: string[]
  confidence: number
}

interface UniversalSearchResponse {
  results: typeof products
  intent: IntentResult
  relatedProducts: typeof products
  didYouMean?: string
  totalCount: number
}

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Helper to analyze intent
async function analyzeIntent(query: string): Promise<IntentResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        intent: 'search',
        confidence: 0.5,
      }
    }

    const model = client.getGenerativeModel({ model: 'gemini-2.5-pro' })
    const prompt = `Analyze shopping intent for: "${query}"
Return JSON: { intent: 'search'|'browse'|'compare'|'buy'|'gift'|'deal', category?: string, priceRange?: {min, max}, attributes?: string[], confidence: 0-1 }
Be concise, JSON only.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      return JSON.parse(match[0])
    }
  } catch (error) {
    console.error('[v0] Intent analysis error:', error)
  }

  return { intent: 'search', confidence: 0.5 }
}

// Search products intelligently
function searchProducts(query: string, intent: IntentResult): typeof products {
  const queryLower = query.toLowerCase()

  let filtered = products.filter((p) => {
    const title = p.title.toLowerCase()
    const description = p.description.toLowerCase()
    const category = p.category.toLowerCase()

    return title.includes(queryLower) || description.includes(queryLower) || category.includes(queryLower)
  })

  // Filter by intent category
  if (intent.category) {
    filtered = filtered.filter((p) => p.category.toLowerCase().includes(intent.category!.toLowerCase()))
  }

  // Filter by price range if specified
  if (intent.priceRange) {
    filtered = filtered.filter((p) => p.price >= intent.priceRange!.min && p.price <= intent.priceRange!.max)
  }

  // Sort by relevance (title match > description match)
  filtered.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(queryLower) ? 2 : 0
    const aDesc = a.description.toLowerCase().includes(queryLower) ? 1 : 0
    const bTitle = b.title.toLowerCase().includes(queryLower) ? 2 : 0
    const bDesc = b.description.toLowerCase().includes(queryLower) ? 1 : 0

    return bTitle + bDesc - (aTitle + aDesc)
  })

  return filtered
}

// Get related products using Gemini
async function getRelatedProducts(query: string, intent: IntentResult, searchResults: typeof products): Promise<typeof products> {
  try {
    if (!process.env.GEMINI_API_KEY || searchResults.length === 0) {
      // Fallback: return top-rated products
      return products.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5)
    }

    const model = client.getGenerativeModel({ model: 'gemini-2.5-pro' })
    const productIds = searchResults.slice(0, 5).map((p) => p.id)

    const prompt = `For search "${query}" with intent "${intent.intent}", suggest 5 related product IDs from this list that complement the search results: ${productIds.join(', ')}
Return JSON: { ids: string[] } - only these IDs.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const match = text.match(/\{[\s\S]*\}/)

    if (match) {
      const parsed = JSON.parse(match[0])
      const ids = parsed.ids || []
      return products.filter((p) => ids.includes(p.id))
    }
  } catch (error) {
    console.error('[v0] Related products error:', error)
  }

  return []
}

// Generate "did you mean" suggestion
async function generateDidYouMean(query: string, searchResults: typeof products): Promise<string | undefined> {
  if (searchResults.length > 0 || !process.env.GEMINI_API_KEY) {
    return undefined
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.5-pro' })
    const prompt = `User searched for: "${query}"
Available categories: ${[...new Set(products.map((p) => p.category))].join(', ')}
Suggest a better search term or category in Arabic if the search returned nothing. Return JSON: { suggestion: string | null }`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const match = text.match(/\{[\s\S]*\}/)

    if (match) {
      const parsed = JSON.parse(match[0])
      return parsed.suggestion
    }
  } catch (error) {
    console.error('[v0] Did you mean error:', error)
  }

  return undefined
}

export async function POST(request: NextRequest) {
  try {
    const { query, userId } = await request.json()

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 })
    }

    // Analyze intent
    const intent = await analyzeIntent(query)

    // Search products
    const searchResults = searchProducts(query, intent)

    // Get related products
    const relatedProducts = await getRelatedProducts(query, intent, searchResults)

    // Generate did you mean if no results
    const didYouMean = await generateDidYouMean(query, searchResults)

    const response: UniversalSearchResponse = {
      results: searchResults.slice(0, 20), // Limit to 20 main results
      intent,
      relatedProducts,
      didYouMean,
      totalCount: searchResults.length,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[v0] Universal search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
