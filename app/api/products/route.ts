import { NextRequest, NextResponse } from 'next/server'

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'smcicw-19.myshopify.com'
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '54710e221c946a7f98e4ec4ca2df3029'
const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id title handle availableForSale
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          featuredImage { url altText }
          images(first: 1) { edges { node { url altText } } }
          variants(first: 1) { edges { node { id title price { amount currencyCode } availableForSale } } }
        }
      }
    }
  }
`

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const after = searchParams.get('cursor') || undefined

  try {
    let allProducts: any[] = []
    let hasNextPage = true
    let cursor: string | null = after || null

    // Loop through all pages until we get all products
    while (hasNextPage) {
      const res = await fetch(SHOPIFY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { first: 250, after: cursor } }),
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`Shopify: ${res.status}`)
      const json = await res.json()
      if (json.errors) throw new Error(json.errors[0].message)

      const products = json.data.products.edges.map((e: any) => e.node)
      allProducts = allProducts.concat(products)

      hasNextPage = json.data.products.pageInfo.hasNextPage
      cursor = json.data.products.pageInfo.endCursor
    }

    const pageInfo = {
      hasNextPage: false,
      endCursor: null
    }

    return NextResponse.json({ products: allProducts, pageInfo })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
