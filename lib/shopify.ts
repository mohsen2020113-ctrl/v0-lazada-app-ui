const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'f61e20-88.myshopify.com'
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '54710e221c946a7f98e4ec4ca2df3029'
const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`

const COUNTRY_LANGUAGE: Record<string, { country: string; language: string }> = {
  ae: { country: 'AE', language: 'AR' },
  sa: { country: 'SA', language: 'AR' },
  eg: { country: 'EG', language: 'AR' },
  kw: { country: 'KW', language: 'AR' },
  qa: { country: 'QA', language: 'AR' },
  th: { country: 'TH', language: 'TH' },
  my: { country: 'MY', language: 'MS' },
  sg: { country: 'SG', language: 'EN' },
  id: { country: 'ID', language: 'ID' },
  in: { country: 'IN', language: 'EN' },
  tr: { country: 'TR', language: 'TR' },
  gb: { country: 'GB', language: 'EN' },
  us: { country: 'US', language: 'EN' },
  cn: { country: 'CN', language: 'ZH' },
  jp: { country: 'JP', language: 'JA' },
  kr: { country: 'KR', language: 'KO' },
  de: { country: 'DE', language: 'DE' },
  fr: { country: 'FR', language: 'FR' },
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  vendor?: string
  priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice?: { amount: string; currencyCode: string } }
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } }
  featuredImage?: { url: string; altText?: string | null }
  images: { edges: { node: { url: string; altText?: string | null } }[] }
  variants: { edges: { node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean } }[] }
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  locale = 'ae'
): Promise<T> {
  const ctx = COUNTRY_LANGUAGE[locale] || COUNTRY_LANGUAGE['ae']
  const buyer = `@inContext(country: ${ctx.country}, language: ${ctx.language})`
  const contextualQuery = query.replace('__CONTEXT__', buyer)

  const res = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query: contextualQuery, variables }),
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data as T
}

export async function fetchAllProducts(_locale = 'ae'): Promise<{
  products: any[]
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
}> {
  const QUERY = `
    query Products($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id handle title
            availableForSale
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
            }
            featuredImage { url altText }
            images(first: 1) { edges { node { url altText } } }
            variants(first: 1) { edges { node { id title price { amount currencyCode } availableForSale } } }
          }
        }
      }
    }
  `

  let allProducts: any[] = []
  let hasNextPage = true
  let cursor: string | null = null

  while (hasNextPage) {
    const res = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query: QUERY, variables: { first: 250, after: cursor } }),
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`Shopify products fetch failed: ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0].message)

    const products = json.data.products.edges.map((e: any) => e.node)
    allProducts = allProducts.concat(products)

    hasNextPage = json.data.products.pageInfo.hasNextPage
    cursor = json.data.products.pageInfo.endCursor
  }

  return {
    products: allProducts,
    pageInfo: { hasNextPage: false, endCursor: null },
  }
}

// Alias used by wishlist page
export const fetchProducts = fetchAllProducts

// Create a Shopify cart and return checkout URL
export async function createShopifyCart(
  lines: { merchandiseId: string; quantity: number }[]
) {
  const MUTATION = `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl id }
        userErrors { field message }
      }
    }
  `
  const data = await shopifyFetch<{
    cartCreate: { cart: { checkoutUrl: string; id: string } }
  }>(MUTATION, { lines })
  return data?.cartCreate?.cart ?? null
}

// Get a single product by handle
export async function getProduct(handle: string) {
  const QUERY = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id title handle description
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 10) { edges { node { url altText } } }
        variants(first: 100) {
          edges { node { id title price { amount currencyCode } availableForSale } }
        }
      }
    }
  `
  const data = await shopifyFetch<{ productByHandle: any }>(QUERY, { handle })
  return data?.productByHandle ?? null
}

// Get all collections
export async function getCollections() {
  const QUERY = `
    query {
      collections(first: 50) {
        edges { node { id title handle description image { url } } }
      }
    }
  `
  const data = await shopifyFetch<{ collections: { edges: { node: any }[] } }>(QUERY, {})
  return data?.collections?.edges?.map((e: any) => e.node) ?? []
}

// Get products in a collection by handle
export async function getCollectionProducts(handle: string, first: number = 20) {
  const QUERY = `
    query getCollectionProducts($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        id title description
        products(first: $first) {
          edges {
            node {
              id title handle
              availableForSale
              priceRange { minVariantPrice { amount currencyCode } }
              images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ collectionByHandle: any }>(QUERY, { handle, first })
  return data?.collectionByHandle ?? null
}
