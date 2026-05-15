import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

const GET_COLLECTION_PRODUCTS = `
  query GetCollectionProducts($handle: String!, $first: Int!, $cursor: String) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  
  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
  }

  try {
    const data = await shopifyFetch({
      query: GET_COLLECTION_PRODUCTS,
      variables: {
        handle,
        first: 20,
        cursor: cursor || null,
      },
    });

    if (!data.collectionByHandle) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const collection = data.collectionByHandle;
    const products = collection.products.edges.map((edge: any) => edge.node);
    const pageInfo = collection.products.pageInfo;

    return NextResponse.json(
      {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
        image: collection.image,
        products,
        pageInfo,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[v0] Collection fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}
