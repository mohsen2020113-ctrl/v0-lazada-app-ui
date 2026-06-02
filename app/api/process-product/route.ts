import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// In-memory job store (use Firestore/Redis in production)
const jobs: Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: unknown
  error?: string
  createdAt: Date
}> = new Map()

// ===================== ANALYZERS =====================

async function analyzeProductImage(base64Image: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const prompt = `You are a professional product analyst. Analyze this product image and extract ONLY what you can actually see:
  1. Product type
  2. Sub-category
  3. Colors present (don't invent)
  4. Sizes/dimensions visible
  5. Materials
  6. Key features
  7. Possible uses

  Respond in JSON only:
  {
    "productType": "string",
    "category": "string",
    "colors": ["color1"],
    "sizes": ["size1"],
    "materials": ["material1"],
    "keyFeatures": ["feature1"],
    "possibleUses": ["use1"]
  }`

  const result = await model.generateContent([
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    prompt
  ])
  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse analysis')
  return JSON.parse(match[0])
}

async function extractColors(base64Image: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const prompt = `Extract ONLY the actual colors present in this product image. Do not invent colors.
  Return JSON:
  {
    "colors": [
      { "name_ar": "أسود", "name_en": "Black", "hexCode": "#000000", "percentage": 45 }
    ]
  }`
  const result = await model.generateContent([
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    prompt
  ])
  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse colors')
  return JSON.parse(match[0])
}

async function generateDescription(analysis: {
  productType: string
  category: string
  keyFeatures: string[]
  possibleUses: string[]
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const prompt = `Write a professional product description in Arabic for:
  Type: ${analysis.productType}
  Category: ${analysis.category}
  Features: ${analysis.keyFeatures.join(', ')}
  Uses: ${analysis.possibleUses.join(', ')}

  Requirements:
  - Catchy title (under 100 chars)
  - Main description (200-300 chars)
  - Features list (5-7 points)
  - Benefits (3-4 points)
  - SEO keywords

  JSON format:
  {
    "title": "string",
    "mainDescription": "string",
    "features": ["feature1"],
    "benefits": ["benefit1"],
    "keywords": ["keyword1"]
  }`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse description')
  return JSON.parse(match[0])
}

async function translateToEnglish(arabicDesc: unknown) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const prompt = `Translate this Arabic product description to professional English. Keep the same JSON structure:
  ${JSON.stringify(arabicDesc)}

  Return same JSON format:
  {
    "title": "string",
    "mainDescription": "string",
    "features": ["feature1"],
    "benefits": ["benefit1"],
    "keywords": ["keyword1"]
  }`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not translate')
  return JSON.parse(match[0])
}

// ===================== JOB PROCESSOR =====================

async function processProductJob(jobId: string, base64Image: string, productName: string, category: string) {
  try {
    jobs.set(jobId, { ...jobs.get(jobId)!, status: 'processing', progress: 10 })

    // 1. Analyze image
    const analysis = await analyzeProductImage(base64Image)
    jobs.set(jobId, { ...jobs.get(jobId)!, progress: 30 })

    // 2. Extract colors
    const colors = await extractColors(base64Image)
    jobs.set(jobId, { ...jobs.get(jobId)!, progress: 55 })

    // 3. Generate description (Arabic)
    const descriptionAr = await generateDescription({ ...analysis, ...{ productType: productName || analysis.productType, category: category || analysis.category } })
    jobs.set(jobId, { ...jobs.get(jobId)!, progress: 75 })

    // 4. Translate to English
    const descriptionEn = await translateToEnglish(descriptionAr)
    jobs.set(jobId, { ...jobs.get(jobId)!, progress: 95 })

    // 5. Compile result
    const result = {
      id: jobId,
      name: productName,
      category: category || analysis.category,
      analysis,
      colors: colors.colors || [],
      sizes: analysis.sizes || [],
      descriptions: { ar: descriptionAr, en: descriptionEn },
      createdAt: new Date().toISOString(),
      status: 'ready'
    }

    jobs.set(jobId, { ...jobs.get(jobId)!, status: 'completed', progress: 100, result })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Processing failed'
    jobs.set(jobId, { ...jobs.get(jobId)!, status: 'failed', error })
  }
}

// ===================== API ROUTES =====================

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null
    const productName = formData.get('productName') as string || ''
    const category = formData.get('category') as string || ''

    if (!image) {
      return NextResponse.json({ error: 'يجب تحميل صورة' }, { status: 400 })
    }
    if (!productName) {
      return NextResponse.json({ error: 'يجب إدخال اسم المنتج' }, { status: 400 })
    }

    // Convert image to base64
    const buffer = await image.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    // Create job
    const jobId = crypto.randomUUID()
    jobs.set(jobId, {
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    })

    // Process asynchronously (don't await)
    processProductJob(jobId, base64Image, productName, category)

    return NextResponse.json({ jobId, status: 'processing', message: 'جاري معالجة المنتج...' })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // List all jobs (admin overview)
  const jobList = Array.from(jobs.entries()).map(([id, job]) => ({
    id,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt
  }))
  return NextResponse.json({ jobs: jobList })
}
