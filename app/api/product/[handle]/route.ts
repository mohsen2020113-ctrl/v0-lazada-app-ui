import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
  }

  try {
    const raw = await getProduct(handle);

    if (!raw) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform Shopify nested format -> flat format expected by product page
    const product = {
      id: raw.id,
      title: raw.title,
      handle: raw.handle,
      description: raw.description,
      price: raw.priceRange?.minVariantPrice?.amount || '0',
      images: (raw.images?.edges || []).map((e: any) => e.node.url),
      variants: (raw.variants?.edges || []).map((e: any) => ({
        id: e.node.id,
        title: e.node.title,
        price: e.node.price?.amount || '0',
        available: e.node.availableForSale,
      })),
    };

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
