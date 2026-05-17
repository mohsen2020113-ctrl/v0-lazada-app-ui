const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'f61e20-88.myshopify.com';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '54710e221c946a7f98e4ec4ca2df3029';
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01';

const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

export interface ShopifyProduct {
  id: string; title: string; handle: string; description: string; vendor: string;
  productType: string; tags: string[]; availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice: { amount: string; currencyCode: string }; };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string }; };
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: ShopifyVariant }[] };
}

export interface ShopifyVariant {
  id: string; title: string; availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string };
  selectedOptions: { name: string; value: string }[];
  image?: { url: string; altText: string | null };
}

export interface ShopifyCart {
  id: string; checkoutUrl: string; totalQuantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string }; subtotalAmount: { amount: string; currencyCode: string }; };
  lines: { edges: { node: ShopifyCartLine }[] };
}

export interface ShopifyCartLine {
  id: string; quantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  merchandise: { id: string; title: string; product: { title: string; handle: string }; image?: { url: string; altText: string | null }; price: { amount: string; currencyCode: string }; };
}

export interface ShopifyCollection {
  id: string; title: string; handle: string; description: string;
  image?: { url: string; altText: string | null };
  products: { edges: { node: ShopifyProduct }[] };
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  const json = await response.json();
  if (json.errors) throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '));
  return json.data as T;
}

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id title handle description vendor productType tags availableForSale
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    images(first: 10) { edges { node { url altText } } }
    variants(first: 20) { edges { node {
      id title availableForSale
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
      image { url altText }
    }}}
  }
`;

export async function getProducts(first = 20, after?: string, query?: string): Promise<{ products: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null }; }> {
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }; }>(`
    query GetProducts($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query, sortKey: BEST_SELLING) {
        pageInfo { hasNextPage endCursor }
        edges { node { ...ProductFields } }
      }
    }
    ${PRODUCT_FRAGMENT}
  `, { first, after, query });
  return { products: data.products.edges.map(e => e.node), pageInfo: data.products.pageInfo };
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(`
    query GetProduct($handle: String!) { product(handle: $handle) { ...ProductFields } }
    ${PRODUCT_FRAGMENT}
  `, { handle });
  return data.product;
}

export async function getProductsByCollection(collectionHandle: string, first = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ collection: { products: { edges: { node: ShopifyProduct }[] } } | null; }>(`
    query GetCollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) { products(first: $first) { edges { node { ...ProductFields } } } }
    }
    ${PRODUCT_FRAGMENT}
  `, { handle: collectionHandle, first });
  return data.collection?.products.edges.map(e => e.node) ?? [];
}

export async function searchProducts(searchQuery: string, first = 20): Promise<ShopifyProduct[]> {
  const { products } = await getProducts(first, undefined, searchQuery);
  return products;
}

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{ collections: { edges: { node: ShopifyCollection }[] }; }>(`
    query GetCollections($first: Int!) {
      collections(first: $first) { edges { node { id title handle description image { url altText } products(first: 1) { edges { node { id } } } } } }
    }
  `, { first });
  return data.collections.edges.map(e => e.node);
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
    lines(first: 100) { edges { node {
      id quantity
      cost { totalAmount { amount currencyCode } }
      merchandise { ... on ProductVariant { id title price { amount currencyCode } image { url altText } product { title handle } } }
    }}}
  }
`;

export async function createCart(lines?: { merchandiseId: string; quantity: number }[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(`
    mutation CartCreate($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ...CartFields } } }
    ${CART_FRAGMENT}
  `, { lines: lines ?? [] });
  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(`
    query GetCart($id: ID!) { cart(id: $id) { ...CartFields } }
    ${CART_FRAGMENT}
  `, { id: cartId });
  return data.cart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(`
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } } }
    ${CART_FRAGMENT}
  `, { cartId, lines });
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(`
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } } }
    ${CART_FRAGMENT}
  `, { cartId, lines: [{ id: lineId, quantity }] });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(`
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } } }
    ${CART_FRAGMENT}
  `, { cartId, lineIds });
  return data.cartLinesRemove.cart;
}

export async function customerLogin(email: string, password: string): Promise<{ customerAccessToken?: { accessToken: string; expiresAt: string }; customerUserErrors: { field: string[]; message: string }[]; }> {
  const data = await shopifyFetch<{ customerAccessTokenCreate: { customerAccessToken?: { accessToken: string; expiresAt: string }; customerUserErrors: { field: string[]; message: string }[]; }; }>(`
    mutation CustomerLogin($email: String!, $password: String!) {
      customerAccessTokenCreate(input: { email: $email, password: $password }) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { field message }
      }
    }
  `, { email, password });
  return data.customerAccessTokenCreate;
}

export async function customerRegister(email: string, password: string, firstName: string, lastName: string): Promise<{ customer?: { id: string; email: string }; customerUserErrors: { field: string[]; message: string }[]; }> {
  const data = await shopifyFetch<{ customerCreate: { customer?: { id: string; email: string }; customerUserErrors: { field: string[]; message: string }[]; }; }>(`
    mutation CustomerCreate($input: CustomerCreateInput!) { customerCreate(input: $input) { customer { id email } customerUserErrors { field message } } }
  `, { input: { email, password, firstName, lastName } });
  return data.customerCreate;
}

export async function getCustomer(accessToken: string) {
  const data = await shopifyFetch<{ customer: { id: string; email: string; firstName: string; lastName: string; phone?: string; orders: { edges: { node: any }[] }; defaultAddress?: any; } | null; }>(`
    query GetCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id email firstName lastName phone
        defaultAddress { address1 city country zip }
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges { node { id name processedAt financialStatus fulfillmentStatus currentTotalPrice { amount currencyCode } lineItems(first: 5) { edges { node { title quantity } } } } }
        }
      }
    }
  `, { customerAccessToken: accessToken });
  return data.customer;
}

export function formatMoney(amount: string, currencyCode = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(parseFloat(amount));
}

export function getProductImageUrl(product: ShopifyProduct, index = 0): string {
  return product.images.edges[index]?.node.url ?? 'https://via.placeholder.com/400x400?text=No+Image';
}

export function getProductPrice(product: ShopifyProduct): string {
  return formatMoney(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode);
}

export function getCompareAtPrice(product: ShopifyProduct): string | null {
  const price = product.compareAtPriceRange?.minVariantPrice;
  if (!price || parseFloat(price.amount) <= parseFloat(product.priceRange.minVariantPrice.amount)) return null;
  return formatMoney(price.amount, price.currencyCode);
}

export function getDiscountPercent(product: ShopifyProduct): number | null {
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  if (!compareAt) return null;
  const original = parseFloat(compareAt.amount);
  const current = parseFloat(product.priceRange.minVariantPrice.amount);
  if (original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}
