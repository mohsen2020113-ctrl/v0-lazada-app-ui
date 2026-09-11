import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

async function analyzeProductImage(base64Image: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent([
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    `Analyze this product image. Extract ONLY what you see. Return JSON:
    {
      "productType": "string",
      "category": "string",
      "colors": ["color1"],
      "sizes": ["size1"],
      "materials": ["material1"],
      "keyFeatures": ["feature1"],
      "possibleUses": ["use1"]
    }`
  ])
  const match = result.response.text().match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Cannot parse image analysis')
  return JSON.parse(match[0])
}

async function extractColors(base64Image: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent([
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    `Extract ONLY real colors from this product image. Return JSON:
    { "colors": [{ "name_ar": "أسود", "name_en": "Black", "hexCode": "#000000", "percentage": 45 }] }`
  ])
  const match = result.response.text().match(/\{[\s\S]*\}/)
  if (!match) return { colors: [] }
  return JSON.parse(match[0])
}

async function generateDescriptionAr(analysis: Record<string, unknown>, productName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(
    `Write a professional product description in Arabic for product: ${productName}
    Type: ${analysis.productType}
    Features: ${(analysis.keyFeatures as string[])?.join(', ')}
    Uses: ${(analysis.possibleUses as string[])?.join(', ')}

    Return as JSON:
    {
      "title": "string",
      "mainDescription": "string",
      "features": ["feature1"],
      "benefits": ["benefit1"],
      "keywords": ["keyword1"]
    }`
  )
  const match = result.response.text().match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Cannot parse Arabic description')
  return JSON.parse(match[0])
}

async function translateToEnglish(arabicDesc: unknown) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(
    `Translate this Arabic product description to professional English. Keep same JSON format:
    ${JSON.stringify(arabicDesc)}

    Return: { "title": "string", "mainDescription": "string", "features": ["f1"], "benefits": ["b1"], "keywords": ["k1"] }`
  )
  const match = result.response.text().match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Cannot translate')
  return JSON.parse(match[0])
}

export const maxDuration = 60 // Allow up to 60s for Vercel

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null
    const productName = (formData.get('productName') as string) || ''
    const category = (formData.get('category') as string) || ''

    if (!image) return NextResponse.json({ error: 'Image upload is required' }, { status: 400 })
    if (!productName) return NextResponse.json({ error: 'Product name must be provided' }, { status: 400 })
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })

    const buffer = await image.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    // Step 1: Analyze image
    const analysis = await analyzeProductImage(base64Image)

    // Step 2: Extract colors
    const colorsData = await extractColors(base64Image)

    // Step 3: Generate Arabic description
    const descriptionAr = await generateDescriptionAr(analysis, productName)

    // Step 4: Translate to English
    const descriptionEn = await translateToEnglish(descriptionAr)

    const result = {
      id: crypto.randomUUID(),
      name: productName,
      category: category || analysis.category,
      analysis,
      colors: colorsData.colors || [],
      sizes: analysis.sizes || [],
      descriptions: { ar: descriptionAr, en: descriptionEn },
      createdAt: new Date().toISOString(),
      status: 'ready'
    }

    return NextResponse.json({ success: true, result })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Processing failed'
    console.error('[process-product]', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
