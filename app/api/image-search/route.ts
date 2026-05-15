import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { products } from '@/lib/data/products'

interface ImageAnalysis {
  category: string
  colors: string[]
  attributes: string[]
  confidence: number
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = imageFile.type || 'image/jpeg'

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      )
    }

    const client = new GoogleGenerativeAI({ apiKey })
    const model = client.getGenerativeModel({ model: 'gemini-2.5-pro-vision' })

    // Analyze image with Gemini Vision
    const analysisPrompt = `Analyze this product image and extract the following information in JSON format:
{
  "category": "clothing|electronics|home|beauty|other",
  "colors": ["color1", "color2"],
  "attributes": ["attribute1", "attribute2"],
  "confidence": 0-100,
  "description": "brief description of what you see"
}

Be specific about the product type and characteristics. Return only valid JSON.`

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
      {
        text: analysisPrompt,
      },
    ])

    const analysisText = response.response.text()
    
    // Parse JSON response (extract JSON from potential markdown blocks)
    let analysis: ImageAnalysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (e) {
      console.error('[v0] Image analysis JSON parse error:', e)
      // Fallback analysis
      analysis = {
        category: 'other',
        colors: [],
        attributes: [],
        confidence: 0,
        description: 'Unable to analyze image',
      }
    }

    // Search products based on analysis
    const matchedProducts = products
      .filter(product => {
        // Match by category
        if (analysis.category !== 'other' && product.category.toLowerCase() !== analysis.category.toLowerCase()) {
          return false
        }

        // Match by attributes or colors
        const productText = `${product.title} ${product.description} ${product.tags?.join(' ') || ''}`.toLowerCase()
        const searchTerms = [...analysis.attributes, ...analysis.colors]

        return searchTerms.some(term => productText.includes(term.toLowerCase()))
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 12)

    // If no products found, return top rated in category
    if (matchedProducts.length === 0) {
      const categoryProducts = products
        .filter(p => p.category.toLowerCase() === analysis.category.toLowerCase() || analysis.category === 'other')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 12)

      return NextResponse.json({
        products: categoryProducts,
        imageAnalysis: analysis,
        query: analysis.description,
        totalCount: categoryProducts.length,
      })
    }

    return NextResponse.json({
      products: matchedProducts,
      imageAnalysis: analysis,
      query: analysis.description,
      totalCount: matchedProducts.length,
    })
  } catch (error) {
    console.error('[v0] Image search error:', error)
    return NextResponse.json(
      { error: 'Image search failed' },
      { status: 500 }
    )
  }
}
