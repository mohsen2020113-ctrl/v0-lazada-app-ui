const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`

// ── Core fetch helper (handles locale context) ────────────────────────────
export async function shopifyFetch(
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

  return { products }
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
