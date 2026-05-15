import { NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  score?: number;
  reason?: string;
}

interface SearchInput {
  query?: string;
  imageUrl?: string;
  voiceTranscript?: string;
  userId?: string;
}

async function searchShopify(query: string): Promise<Product[]> {
  try {
    const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!storeUrl || !token) return [];

    const response = await fetch(`${storeUrl}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: `{
          products(first: 30, query: "${query.replace(/"/g, '\\"')}") {
            edges {
              node {
                id
                title
                handle
                priceRange { minVariantPrice { amount } }
                images(first: 1) { edges { node { url } } }
              }
            }
          }
        }`,
      }),
    });

    const data = await response.json();
    return (data?.data?.products?.edges || []).map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      price: parseFloat(e.node.priceRange?.minVariantPrice?.amount || '0'),
      image: e.node.images?.edges?.[0]?.node?.url,
    }));
  } catch {
    return [];
  }
}

async function rankWithGemini(
  products: Product[],
  query: string,
  userId?: string
): Promise<Product[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || products.length === 0) return products;

    const productList = products
      .slice(0, 30)
      .map((p, i) => `${i + 1}. ID:${p.id} Title:"${p.title}" Price:${p.price}`)
      .join('\n');

    const prompt = `You are a search ranking AI for LEE, a UAE e-commerce platform.
User query: "${query}"
${userId ? `User ID: ${userId}` : ''}
Products:
${productList}
Return JSON array: [{"id":"...","score":0.95,"reason":"..."}]
ONLY return the JSON array.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        }),
      }
    );

    const geminiData = await res.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) return products;

    const ranked = JSON.parse(jsonMatch[0]);
    const rankedMap = new Map(ranked.map((r: any) => [r.id, r]));

    return products
      .map((p) => ({
        ...p,
        score: rankedMap.get(p.id)?.score ?? 0.5,
        reason: rankedMap.get(p.id)?.reason ?? '',
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch {
    return products;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchInput = await request.json();
    const { query, imageUrl, voiceTranscript, userId } = body;
    const effectiveQuery = query || voiceTranscript || '';

    if (!effectiveQuery && !imageUrl) {
      return NextResponse.json(
        { error: 'Query, voiceTranscript, or imageUrl required' },
        { status: 400 }
      );
    }

    let products: Product[] = [];
    const sources = { text: !!effectiveQuery, image: !!imageUrl, voice: !!voiceTranscript };

    if (effectiveQuery) {
      products = [...products, ...(await searchShopify(effectiveQuery))];
    }

    if (imageUrl) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const visionRes = await fetch(`${baseUrl}/api/image/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });
        if (visionRes.ok) {
          const visionData = await visionRes.json();
          if (visionData.matchedProducts?.length) {
            products = [...products, ...visionData.matchedProducts];
          }
        }
      } catch {}
    }

    const seen = new Set<string>();
    products = products.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    const rankedProducts = await rankWithGemini(products, effectiveQuery, userId);

    return NextResponse.json({
      success: true,
      query: effectiveQuery,
      products: rankedProducts.slice(0, 24),
      total: rankedProducts.length,
      sources,
    });
  } catch (error) {
    console.error('Universal search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    const products = await searchShopify(q);
    return NextResponse.json({
      success: true,
      query: q,
      products,
      total: products.length,
    });
  } catch (error) {
    console.error('Simple search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
