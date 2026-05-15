import { NextRequest, NextResponse } from 'next/server';

interface AnalysisResult {
  tags: string[];
  matchedProducts: Array<{ id: string; title: string; price: number; image?: string }>;
  confidence: number;
  colors: string[];
}

interface VisionAnnotation {
  description?: string;
  score?: number;
  name?: string;
}

async function analyzeImageWithVision(
  imageUrl?: string,
  base64?: string
): Promise<AnalysisResult> {
  try {
    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    if (!apiKey) return { tags: [], matchedProducts: [], confidence: 0, colors: [] };

    const imageSource = imageUrl
      ? { imageUri: imageUrl }
      : base64
      ? { imageContent: { data: base64 } }
      : null;

    if (!imageSource) throw new Error('No image provided');

    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: imageSource,
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
              { type: 'LOGO_DETECTION', maxResults: 3 },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const labels = data?.responses?.[0]?.labelAnnotations || [];
    const objects = data?.responses?.[0]?.localizedObjectAnnotations || [];
    const logos = data?.responses?.[0]?.logoAnnotations || [];

    const tags = [
      ...labels.map((l: VisionAnnotation) => l.description || '').filter(Boolean),
      ...objects.map((o: VisionAnnotation) => o.name || '').filter(Boolean),
      ...logos.map((l: VisionAnnotation) => l.description || '').filter(Boolean),
    ].slice(0, 15);

    const avgConfidence =
      labels.length > 0
        ? labels.reduce((sum: number, l: VisionAnnotation) => sum + (l.score || 0), 0) / labels.length
        : 0;

    return {
      tags,
      matchedProducts: [],
      confidence: avgConfidence,
      colors: ['#1a1a1a', '#f0f0f0', '#1e3a8a'],
    };
  } catch {
    return { tags: [], matchedProducts: [], confidence: 0, colors: [] };
  }
}

async function matchProductsByTags(tags: string[]): Promise<any[]> {
  try {
    const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!storeUrl || !token || tags.length === 0) return [];

    const query = tags.slice(0, 3).join(' OR ');
    const response = await fetch(`${storeUrl}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: `{
          products(first: 20, query: "${query.replace(/"/g, '\\"')}") {
            edges {
              node {
                id
                title
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, base64 } = body;

    if (!imageUrl && !base64) {
      return NextResponse.json({ error: 'imageUrl or base64 required' }, { status: 400 });
    }

    const analysis = await analyzeImageWithVision(imageUrl, base64);
    const matchedProducts = await matchProductsByTags(analysis.tags);

    return NextResponse.json({
      tags: analysis.tags,
      matchedProducts,
      confidence: analysis.confidence,
      colors: analysis.colors,
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
