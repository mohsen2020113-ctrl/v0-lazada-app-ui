import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface IntentRequest {
  query: string;
  userId?: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface IntentResponse {
  intent: 'search' | 'browse' | 'compare' | 'buy' | 'gift' | 'deal';
  category?: string;
  priceRange?: PriceRange;
  attributes?: string[];
  arabicQuery?: string;
  confidence: number;
}

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are an e-commerce intent analyzer. Analyze user queries and determine their shopping intent.

Return a JSON object with:
- intent: 'search' (looking for specific product), 'browse' (exploring options), 'compare' (comparing products), 'buy' (ready to purchase), 'gift' (buying for someone), 'deal' (hunting for discounts)
- category: product category if identifiable (clothing, electronics, home, beauty, etc.)
- priceRange: {min, max} in AED if price mentioned
- attributes: array of product attributes mentioned (color, size, brand, etc.)
- arabicQuery: Arabic version of the query if input is English, or original if Arabic
- confidence: 0-1 confidence score

Respond ONLY with valid JSON, no markdown, no extra text.`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IntentRequest;
    const { query, userId } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('[v0] GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const model = client.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser Query: ${query}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });

    const responseText = response.content.parts
      .map((part) => (typeof part === 'string' ? part : part.text || ''))
      .join('');

    // Parse JSON response
    let intentData: IntentResponse;
    try {
      intentData = JSON.parse(responseText);
    } catch {
      // If parsing fails, return a default intent
      console.error('[v0] Failed to parse Gemini response:', responseText);
      intentData = {
        intent: 'search',
        arabicQuery: query,
        confidence: 0.5,
      };
    }

    // Validate intent enum
    const validIntents = ['search', 'browse', 'compare', 'buy', 'gift', 'deal'];
    if (!validIntents.includes(intentData.intent)) {
      intentData.intent = 'search';
    }

    // Log for analytics if userId provided
    if (userId) {
      console.log('[v0] Intent analysis:', {
        userId,
        query,
        intent: intentData.intent,
        confidence: intentData.confidence,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(intentData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('[v0] Intent API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze intent' },
      { status: 500 }
    );
  }
}
