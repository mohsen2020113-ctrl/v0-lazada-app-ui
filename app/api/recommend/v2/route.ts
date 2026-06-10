import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

interface RecommendationInput {
  userId?: string;
  limit?: number;
  geo?: string;
}

interface RecommendedProduct {
  id: string;
  title: string;
  price: number;
  image?: string;
  score: number;
  reason: string;
  reasonAr: string;
}

async function getGeoBestsellers(geo: string = 'ae'): Promise<any[]> {
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
          collections(first: 1, query: "bestsellers") {
            edges {
              node {
                products(first: 20) {
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
              }
            }
          }
        }`,
      }),
    });

    const data = await response.json();
    return (data?.data?.collections?.edges?.[0]?.node?.products?.edges || []).map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      price: parseFloat(e.node.priceRange?.minVariantPrice?.amount || '0'),
      image: e.node.images?.edges?.[0]?.node?.url,
      handle: e.node.handle,
    }));
  } catch {
    return [];
  }
}

async function getUserContext(userId: string): Promise<any> {
  try {
    const eventQuery = query(
      collection(db, 'user_events'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const eventDocs = await getDocs(eventQuery);
    const events = eventDocs.docs.map((doc) => doc.data());

    const viewedProducts = events
      .filter((e) => e.event === 'view' && e.productId)
      .map((e) => e.productId);

    const searchQueries = events
      .filter((e) => e.event === 'search')
      .map((e) => e.metadata?.query)
      .filter(Boolean);

    const cartProducts = events
      .filter((e) => e.event === 'add_to_cart' && e.productId)
      .map((e) => e.productId);

    const wishlistProducts = events
      .filter((e) => e.event === 'wishlist' && e.productId)
      .map((e) => e.productId);

    return {
      viewedProducts: Array.from(new Set(viewedProducts)),
      searchQueries: Array.from(new Set(searchQueries)),
      cartProducts: Array.from(new Set(cartProducts)),
      wishlistProducts: Array.from(new Set(wishlistProducts)),
    };
  } catch {
    return {
      viewedProducts: [],
      searchQueries: [],
      cartProducts: [],
      wishlistProducts: [],
    };
  }
}

async function generateRecommendations(
  userContext: any,
  limit: number,
  userId?: string
): Promise<RecommendedProduct[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return [];

    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    const contextStr = `
User Context:
- Recently viewed: ${userContext.viewedProducts.slice(0, 5).join(', ') || 'None'}
- Search queries: ${userContext.searchQueries.slice(0, 5).join(', ') || 'None'}
- In cart: ${userContext.cartProducts.slice(0, 3).join(', ') || 'None'}
- Wishlist: ${userContext.wishlistProducts.slice(0, 3).join(', ') || 'None'}
- Time of day: ${timeOfDay}
`;

    const bestsellers = await getGeoBestsellers();
    const productList = bestsellers
      .slice(0, 30)
      .map((p, i) => `${i + 1}. ID:${p.id} Title:"${p.title}" Price:${p.price} Handle:${p.handle}`)
      .join('\n');

    const prompt = `You are a personalized recommendation engine for LEE, a UAE e-commerce platform.
${contextStr}
Available Products:
${productList}

Generate ${Math.min(limit, 12)} product recommendations. Return JSON:
[{"id":"...","score":0.95,"reason":"Best price on popular electronics","reasonAr":"أفضل سعر على الإلكترونيات الشهيرة"}]
ONLY return the JSON array in English and Arabic reasons.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );

    const geminiData = await res.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) return [];

    const recommendations = JSON.parse(jsonMatch[0]);
    const recMap = new Map(recommendations.map((r: any) => [r.id, r]));

    return bestsellers
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        score: recMap.get(p.id)?.score ?? 0.7,
        reason: recMap.get(p.id)?.reason ?? 'Trending product',
        reasonAr: recMap.get(p.id)?.reasonAr ?? 'Product شهير',
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationInput = await request.json();
    const { userId, limit = 12, geo = 'ae' } = body;

    if (userId) {
      const userContext = await getUserContext(userId);
      const recommendations = await generateRecommendations(userContext, limit, userId);

      return NextResponse.json({
        products: recommendations,
        strategy: 'personalized',
        total: recommendations.length,
      });
    } else {
      const bestsellers = await getGeoBestsellers(geo);
      const products = bestsellers.slice(0, limit).map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        score: 0.8,
        reason: 'Top seller in UAE',
        reasonAr: 'الأكثر مبيعاً في الإمارات',
      }));

      return NextResponse.json({
        products,
        strategy: 'cold_start_geo',
        total: products.length,
      });
    }
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Recommendation failed' }, { status: 500 });
  }
}
