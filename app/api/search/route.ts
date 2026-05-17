import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = (searchParams.get('q') || '').toLowerCase().trim()

  try {
    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Try to fetch from Shopify first
    try {
      const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'f61e20-88.myshopify.com'
      const token = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || '54710e221c946a7f98e4ec4ca2df3029'
      
      const response = await fetch(`https://${storeUrl}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: `{ products(first: 20, query: "${query}") { edges { node { id handle title description priceRange { minVariantPrice { amount } } images(first: 1) { edges { node { url } } } } } } }`,
        }),
      })

      const data = await response.json()
      const shopifyProducts = data?.data?.products?.edges?.map((e: any) => e.node)?.filter((p: any) => p?.title) ?? []

      if (shopifyProducts.length > 0) {
        const results = shopifyProducts.map((p: any) => ({
          id: p.handle,
          title: p.title,
          description: p.description,
          price: parseFloat(p.priceRange?.minVariantPrice?.amount) || 0,
          image: p.images?.edges?.[0]?.node?.url,
        }))
        return NextResponse.json({ results }, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        })
      }
    } catch (shopifyError) {
      console.error('[v0] Shopify API error:', shopifyError)
    }

    // Fallback to local products
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
      const aTitle = (a.title||"").toLowerCase().includes(query) ? 3 : 0
      const bTitle = (b.title||"").toLowerCase().includes(query) ? 3 : 0
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
