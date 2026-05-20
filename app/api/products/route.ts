import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

const PRODUCTS_QUERY = `
  query Products __CONTEXT__ {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) { edges { node { url altText } } }
        }
      }
    }
  }
`

export async function GET(req: NextRequest) {
  const locale = req.cookies.get('lee_country')?.value?.toLowerCase() || 'ae'
  try {
    const data = await shopifyFetch<any>(PRODUCTS_QUERY, {}, locale)
    const products = data.products.edges.map((e: any) => e.node)
    return NextResponse.json({ products, locale })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
