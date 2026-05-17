const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'f61e20-88.myshopify.com';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || '54710e221c946a7f98e4ec4ca2df3029';

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

type ShopifyResponse<T> = {
  data: T;
  errors?: Array<{ message: string }>;
};

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice: {
          amount: string;
          currencyCode: string;
        } | null;
      };
    }>;
  };
};

export type ShopifyProductsResponse = {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
};

// Fetch all collections
export async function getCollections() {
  try {
    const { GET_COLLECTIONS } = await import('./shopify-queries');
    
    type CollectionsResponse = {
      collections: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            description: string;
            image: {
              url: string;
              altText: string | null;
            } | null;
          };
        }>;
      };
    };
    
    const data = await shopifyFetch<CollectionsResponse>({
      query: GET_COLLECTIONS,
      variables: {},
    });
    
    return data?.collections?.edges || [];
  } catch (error) {
    console.error('[Shopify] getCollections error:', error);
    return [];
  }
}

// Fetch products from a collection by handle
export async function getCollectionProducts(handle: string, first = 50, cursor?: string) {
  try {
    const { GET_COLLECTION_PRODUCTS } = await import('./shopify-queries');
    
    type CollectionResponse = {
      collectionByHandle: {
        id: string;
        title: string;
        handle: string;
        description: string;
        image: {
          url: string;
          altText: string | null;
        } | null;
        products: {
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
          };
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
              priceRange: {
                minVariantPrice: {
                  amount: string;
                  currencyCode: string;
                };
              };
              compareAtPriceRange: {
                minVariantPrice: {
                  amount: string;
                  currencyCode: string;
                };
              };
              images: {
                edges: Array<{
                  node: {
                    url: string;
                    altText: string | null;
                  };
                }>;
              };
              variants: {
                edges: Array<{
                  node: {
                    id: string;
                    availableForSale: boolean;
                    price: {
                      amount: string;
                      currencyCode: string;
                    };
                  };
                }>;
              };
            };
          }>;
        };
      } | null;
    };
    
    const data = await shopifyFetch<CollectionResponse>({
      query: GET_COLLECTION_PRODUCTS,
      variables: { handle, first, cursor },
    });
    
    return data?.collectionByHandle || null;
  } catch (error) {
    console.error('[Shopify] getCollectionProducts error:', error);
    return null;
  }
}

// Get a single product by handle
export async function getProduct(handle: string) {
  try {
    const { GET_PRODUCT } = await import('./shopify-queries');
    
    type ProductResponse = {
      productByHandle: {
        id: string;
        title: string;
        handle: string;
        description: string;
        descriptionHtml: string;
        images: {
          edges: Array<{
            node: {
              url: string;
              altText: string | null;
            };
          }>;
        };
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        compareAtPriceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              availableForSale: boolean;
              selectedOptions: Array<{
                name: string;
                value: string;
              }>;
              price: {
                amount: string;
                currencyCode: string;
              };
              compareAtPrice: {
                amount: string;
                currencyCode: string;
              } | null;
            };
          }>;
        };
        tags: string[];
        vendor: string;
      } | null;
    };
    
    const data = await shopifyFetch<ProductResponse>({
      query: GET_PRODUCT,
      variables: { handle },
    });
    
    return data?.productByHandle || null;
  } catch (error) {
    console.error('[Shopify] getProduct error:', error);
    return null;
  }
}

// Search products using Shopify's search API
export async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const { SEARCH_PRODUCTS } = await import('./shopify-queries');
    
    type SearchResponse = {
      search: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            priceRange: {
              minVariantPrice: {
                amount: string;
                currencyCode: string;
              };
            };
            compareAtPriceRange?: {
              minVariantPrice: {
                amount: string;
                currencyCode: string;
              };
            };
            images: {
              edges: Array<{
                node: {
                  url: string;
                  altText: string | null;
                };
              }>;
            };
          };
        }>;
      };
    };
    
    const data = await shopifyFetch<SearchResponse>({
      query: SEARCH_PRODUCTS,
      variables: { query, first: 50 },
    });
    
    return data?.search?.edges || [];
  } catch (error) {
    console.error('[Shopify] searchProducts error:', error);
    return [];
  }
}

// Create a new Shopify cart
export async function createShopifyCart(lines: { merchandiseId: string; quantity: number }[]) {
  try {
    const { CREATE_CART } = await import('./shopify-queries');
    
    type CartResponse = {
      cartCreate: {
        cart: {
          id: string;
          checkoutUrl: string;
          lines: {
            edges: Array<{
              node: {
                id: string;
                quantity: number;
                merchandise: {
                  id: string;
                  title: string;
                  price: { amount: string; currencyCode: string };
                  product: {
                    title: string;
                    handle: string;
                    images: { edges: Array<{ node: { url: string } }> };
                  };
                };
              };
            }>;
          };
          cost: {
            totalAmount: { amount: string; currencyCode: string };
          };
        };
      };
    };
    
    const data = await shopifyFetch<CartResponse>({
      query: CREATE_CART,
      variables: { lines },
    });
    
    return data?.cartCreate?.cart || null;
  } catch (error) {
    console.error('[Shopify] createShopifyCart error:', error);
    return null;
  }
}

// Add lines to existing cart
export async function addToShopifyCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  try {
    const { ADD_TO_CART } = await import('./shopify-queries');
    
    type CartResponse = {
      cartLinesAdd: {
        cart: {
          id: string;
          checkoutUrl: string;
          cost: {
            totalAmount: { amount: string; currencyCode: string };
          };
        };
      };
    };
    
    const data = await shopifyFetch<CartResponse>({
      query: ADD_TO_CART,
      variables: { cartId, lines },
    });
    
    return data?.cartLinesAdd?.cart || null;
  } catch (error) {
    console.error('[Shopify] addToShopifyCart error:', error);
    return null;
  }
}

// Get existing cart by ID
export async function getShopifyCart(cartId: string) {
  try {
    const { GET_CART } = await import('./shopify-queries');
    
    type CartResponse = {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: {
          edges: Array<{
            node: {
              id: string;
              quantity: number;
              merchandise: {
                id: string;
                title: string;
                price: { amount: string; currencyCode: string };
                product: {
                  title: string;
                  handle: string;
                  images: { edges: Array<{ node: { url: string } }> };
                };
              };
            };
          }>;
        };
        cost: {
          totalAmount: { amount: string; currencyCode: string };
        };
      } | null;
    };
    
    const data = await shopifyFetch<CartResponse>({
      query: GET_CART,
      variables: { cartId },
    });
    
    return data?.cart || null;
  } catch (error) {
    console.error('[Shopify] getShopifyCart error:', error);
    return null;
  }
}

// Fetch products with pagination - returns products and pagination info
export async function fetchProducts(first: number = 50, cursor?: string | null): Promise<{
  products: ShopifyProduct[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  try {
    const { GET_PRODUCTS } = await import('./shopify-queries');
    
    const data = await shopifyFetch<ShopifyProductsResponse>({
      query: GET_PRODUCTS,
      variables: { first, cursor },
    });

    return {
      products: data.products.edges.map(edge => edge.node),
      pageInfo: data.products.pageInfo,
    };
  } catch (error) {
    console.error('[Shopify] fetchProducts error:', error);
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

// Fetch initial products for homepage (limited for performance)
export async function fetchAllProducts(): Promise<{ products: ShopifyProduct[], pageInfo: { hasNextPage: boolean, endCursor: string | null } }> {
  try {
    const { products, pageInfo } = await fetchProducts(20);
    return { products, pageInfo };
  } catch (error) {
    console.error('[Shopify] fetchAllProducts error:', error);
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}
