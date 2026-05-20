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

// Example query using __CONTEXT__ placeholder:
// const PRODUCTS_QUERY = `
//   query Products __CONTEXT__ {
//     products(first: 20) { edges { node { id title priceRange { minVariantPrice { amount currencyCode } } } } }
//   }
// `

export async function fetchAllProducts(locale = 'ae'): Promise<{
  products: any[]
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
}> {
  const QUERY = `
    query AllProducts __CONTEXT__ {
      products(first: 20) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id handle title
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{
    products: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
      edges: Array<{ node: any }>
    }
  }>(QUERY, {}, locale)
  return {
    products: data.products.edges.map((e) => e.node),
    pageInfo: data.products.pageInfo,
  }
}
