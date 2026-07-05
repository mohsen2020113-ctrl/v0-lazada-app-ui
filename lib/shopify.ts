const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const SHOPIFY_API_URL = `https://${SHhOPIFY_DOMAIN}/api/2025-10/graphql.json`

// ── Core fetch helper (handles locale context) ────────────────────────────
export async function shopifyFetch<T = any>(
  query: string,
  variables: Record<string, unknown> = {},
  locale = 'ae'
) {
  const country = locale.toUpperCase()
  const buyer = `@inContext(country: ${country}, language: AR)`
  const localizedQuery = query.replace('__CONTEXT__', buyer)

  const res = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query: localizedQuery, variables }),
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0]?.message ?? 'Shopify GraphQL error')
  return json.data
}

// ── Product queries ───────────────────────────────────────────────────────
const PRODUCTS_QUERY = /* graphql */ `
  query Products($first: Int!, $cursor: String) __CONTEXT__ {
    products(first: $first, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id handle title descriptionHtml
          featuredImage { url altText }
          images(first: 5) {
            edges { node { url altText } }
          }
          variants(first: 10) {
            edges {
              node {
                id title availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
          options { id name values }
        }
      }
    }
  }
`

export async function fetchAllProducts(locale = 'ae') {
  let products: any[] = []
  let cursor: string | null = null
  let hasNextPage = true

  while (hasNextPage) {
    const data = await shopifyFetch(
      PRODUCTS_QUERY,
      { first: 50, cursor: cursor ?? undefined },
      locale
    )
    const page = data?.products
    if (!page) break

    products = [...products, ...page.edges.map((e: any) => e.node)]
    hasNextPage = page.pageInfo.hasNextPage
    cursor = page.pageInfo.endCursor
  }

  return { products, pageInfo: { hasNextPage: false, endCursor: cursor } }
}

const PRODUCT_BY_HANDLE_QUERY = /* graphql */ `
  query ProductByHandle($handle: String!) __CONTEXT__ {
    productByHandle(handle: $handle) {
      id handle title descriptionHtml
      featuredImage { url altText }
      images(first: 10) {
        edges { node { url altText } }
      }
      variants(first: 20) {
        edges {
          node {
            id title availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
      options { id name values }
    }
  }
`

export async function fetchProductByHandle(handle: string, locale = 'ae') {
  const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle }, locale)
  return data?.productByHandle ?? null
}

const COLLECTIONS_QUERY = /* graphql */ `
  query Collections($first: Int!) __CONTEXT__ {
    collections(first: $first) {
      edges {
        node {
          id handle title
          image { url altText }
        }
      }
    }
  }
`

export async function fetchCollections(locale = 'ae') {
  const data = await shopifyFetch(COLLECTIONS_QUERY, { first: 20 }, locale)
  return data?.collections?.edges?.map((e: any) => e.node) ?? []
}

// ── Cart ────────────────────────────────────────────────────────────────
const CART_CREATE_MUTATION = /* graphql */ `
  mutation CartCreate($lines: [CartLineInput!]!) __CONTEXT__ {
      cartCreate(input: { lines: $lines }) {
            cart { id checkoutUrl }
                  userErrors { field message }
                      }
                        }
                        `

export async function createShopifyCart(
    lines: { merchandiseId: string; quantity: number }[],
    locale = 'ae'
  ) {
    const data = await shopifyFetch(CART_CREATE_MUTATION, { lines }, locale)
    return data?.cartCreate?.cart ?? null
}

// ── Backward-compatible aliases (used by existing routes/components) ────
export const getProduct = fetchProductByHandle
export const getCollections = fetchCollections

// ── Collection products ───────────────────────────────────────────────────
const COLLECTION_PRODUCTS_QUERY = /* graphql */ `
  query CollectionProducts($handle: String!, $first: Int!) __CONTEXT__ {
      collectionByHandle(handle: $handle) {
            id title description
                  image { url altText }
                        products(first: $first) {
                                edges {
                                          node {
                                                      id handle title
                                                                  availableForSale
                                                                              priceRange { minVariantPrice { amount currencyCode } }
                                                                                          images(first: 1) { edges { node { url altText } } }
                                                                                                    }
                                                                                                            }
                                                                                                                  }
                                                                                                                      }
                                                                                                                        }
                                                                                                                        `

export async function getCollectionProducts(handle: string, first = 20, locale = 'ae') {
    const data = await shopifyFetch(COLLECTION_PRODUCTS_QUERY, { handle, first }, locale)
    return data?.collectionByHandle ?? null
} 

// Shopify product type for components
export type ShopifyProduct = {
  id: string
  title: string
  handle: string
  description: string
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  images: { edges: Array<{ node: { url: string; altText: string | null } }> }
  variants: { edges: Array<{ node: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string } } }> }
  [key: string]: any
}
