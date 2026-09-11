const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2025-10/graphql.json`

<<<<<<< HEAD
const COUNTRY_LANGUAGE: Record<string, { country: string; language: string }> = {
    ae: { country: 'AE', language: 'AR' },
    sa: { country: 'SA', language: 'AR' },
    eg: { country: 'EG', language: 'AR' },
    kw: { country: 'KW', language: 'AR' },
    qa: { country: 'QA', language: 'AR' },
    ur: { country: 'AE', language: 'AR' },
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
      let pageCount = 0

  while (hasNextPage) {
        pageCount++
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
        console.log(`[v0] Fetched page ${pageCount}: ${products.length} products (total: ${allProducts.length})`)

        hasNextPage = json.data.products.pageInfo.hasNextPage
        cursor = json.data.products.pageInfo.endCursor
=======
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
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
  }
`

<<<<<<< HEAD
  console.log(`[v0] Completed fetching all products: ${allProducts.length} products across ${pageCount} pages`)

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
                      id title handle description vendor
                              availableForSale
                                      priceRange {
                                                minVariantPrice { amount currencyCode }
                                                          maxVariantPrice { amount currencyCode }
                                                                  }
                                                                          compareAtPriceRange {
                                                                                    minVariantPrice { amount currencyCode }
                                                                                            }
                                                                                                    images(first: 10) { edges { node { url altText } } }
                                                                                                            variants(first: 100) {
                                                                                                                      edges { node { id title price { amount currencyCode } availableForSale } }
                                                                                                                              }
                                                                                                                                    }
                                                                                                                                        }
                                                                                                                                          `
    try {
          const data = await shopifyFetch<{ productByHandle: any }>(QUERY, { handle })
          if (data?.productByHandle) {
                  console.log(`[v0] Found product: ${data.productByHandle.title}`)
                  return data.productByHandle
          }
          console.log(`[v0] Product not found for handle: ${handle}`)
          return null
    } catch (error) {
          console.error(`[v0] Error fetching product ${handle}:`, error)
          return null
    }
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

// Create a Shopify customer access token (authenticate a customer)
export async function createShopifyCustomerToken(email: string, password: string): Promise<string | null> {
    const MUTATION = `
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
              customerAccessTokenCreate(input: $input) {
                      customerAccessToken { accessToken expiresAt }
                              userErrors { field message }
                                    }
                                        }
                                          `
    try {
          const data = await shopifyFetch<{
                  customerAccessTokenCreate: {
                            customerAccessToken: { accessToken: string; expiresAt: string } | null
                            userErrors: { field: string; message: string }[]
                  }
          }>(MUTATION, { input: { email, password } })
          const errors = data?.customerAccessTokenCreate?.userErrors
          if (errors && errors.length > 0) {
                  console.warn('[Shopify] Customer token errors:', errors)
                  return null
          }
          return data?.customerAccessTokenCreate?.customerAccessToken?.accessToken ?? null
    } catch (err) {
          console.error('[Shopify] createShopifyCustomerToken failed:', err)
          return null
    }
}

// Associate a Shopify cart with a logged-in customer
export async function updateCartBuyerIdentity(cartId: string, customerAccessToken: string): Promise<void> {
    const MUTATION = `
        mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
              cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
                      cart { id }
                              userErrors { field message }
                                    }
                                        }
                                          `
    try {
          await shopifyFetch<unknown>(MUTATION, { cartId, buyerIdentity: { customerAccessToken } })
    } catch (err) {
          console.error('[Shopify] cartBuyerIdentityUpdate failed:', err)
    }
=======
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
>>>>>>> 82ed7310fe1b2f44e8966ae94903d137cc481af2
}
