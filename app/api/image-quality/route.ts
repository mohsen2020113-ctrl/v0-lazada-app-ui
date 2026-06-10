import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ImageQualityResult {
  score: number;
  issues: string[];
  suggestions: string[];
  approved: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid imageUrl parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[v0] GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Image quality service not available' },
        { status: 500 }
      );
    }

    const client = new GoogleGenerativeAI({ apiKey });
    const model = client.getGenerativeModel({ model: 'gemini-2.5-pro-vision' });

    // Fetch image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 400 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Analyze image quality with Gemini Vision
    const analysisPrompt = `You are an image quality analyzer for the online store. Evaluate the quality of this product image on the following points:
1. Lighting (suitable, even, without harsh shadows)
2. Resolution (high clarity, no blur)
3. Background (simple and distraction-free)
4. Product clarity (product is clear and complete in the image)
5. Colors (accurate and natural)

Return the result as JSON:
{
  "score": (0-100),
  "issues": ["Issues detected"],
  "suggestions": ["Recommended improvements"],
  "approved": true/false (true if quality is acceptable for sale)
}

Be precise and objective in your evaluation.`;

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        },
      },
      analysisPrompt,
    ]);

    const responseText = response.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[v0] Failed to parse image quality response:', responseText);
      return NextResponse.json(
        {
          score: 50,
          issues: ['Failed to analyze image'],
          suggestions: ['Please try again'],
          approved: false,
        } as ImageQualityResult
      );
    }

    const analysisResult = JSON.parse(jsonMatch[0]) as ImageQualityResult;

    return NextResponse.json(analysisResult, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('[v0] Image quality analysis error:', error);
    return NextResponse.json(
      { error: 'Image quality analysis failed' },
      { status: 500 }
    );
  }
}
