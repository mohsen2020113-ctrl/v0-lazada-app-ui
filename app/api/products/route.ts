import { NextRequest, NextResponse } from 'next/server'

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'smcicw-19.myshopify.com'
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '54710e221c946a7f98e4ec4ca2df3029'
const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`

const PRODUCT_FIELDS = `
  id title handle availableForSale vendor productType tags
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  featuredImage { url altText }
  images(first: 1) { edges { node { url altText } } }
  variants(first: 1) { edges { node { id title price { amount currencyCode } availableForSale } } }
`

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`

const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      id
      title
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  }
`

async function shopifyRequest(query: string, variables: Record<string, unknown>) {
  const res = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Shopify: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const after = searchParams.get('cursor') || undefined
  const collection = searchParams.get('collection') || undefined

  try {
    let allProducts: any[] = []
    let hasNextPage = true
    let cursor: string | null = after || null
    let collectionTitle: string | null = null
    let collectionFound = true

    while (hasNextPage) {
      if (collection) {
        const data = await shopifyRequest(COLLECTION_PRODUCTS_QUERY, {
          handle: collection,
          first: 250,
          after: cursor,
        })
        const col = data.collectionByHandle
        if (!col) {
          collectionFound = false
          hasNextPage = false
          break
        }
        collectionTitle = col.title
        const products = col.products.edges.map((e: any) => e.node)
        allProducts = allProducts.concat(products)
        hasNextPage = col.products.pageInfo.hasNextPage
        cursor = col.products.pageInfo.endCursor
      } else {
        const data = await shopifyRequest(PRODUCTS_QUERY, { first: 250, after: cursor })
        const products = data.products.edges.map((e: any) => e.node)
        allProducts = allProducts.concat(products)
        hasNextPage = data.products.pageInfo.hasNextPage
        cursor = data.products.pageInfo.endCursor
      }
    }

    // If a collection handle was given but doesn't exist, fall back to the
    // full catalog rather than silently returning an empty list.
    if (collection && !collectionFound) {
      let cursor2: string | null = null
      let hasNextPage2 = true
      while (hasNextPage2) {
        const data = await shopifyRequest(PRODUCTS_QUERY, { first: 250, after: cursor2 })
        const products = data.products.edges.map((e: any) => e.node)
        allProducts = allProducts.concat(products)
        hasNextPage2 = data.products.pageInfo.hasNextPage
        cursor2 = data.products.pageInfo.endCursor
      }
    }

    const pageInfo = {
      hasNextPage: false,
      endCursor: null,
    }

    return NextResponse.json({ products: allProducts, pageInfo, title: collectionTitle })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
