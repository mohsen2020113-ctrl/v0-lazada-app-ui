import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { products } from '@/lib/data/products'

interface RecommendationRequest {
  userId?: string
  viewedProducts?: string[]
  cartItems?: string[]
  category?: string
}

interface RecommendationResponse {
  recommended: typeof products
  reason: string
  personalized: boolean
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json()
    const { userId, viewedProducts = [], cartItems = [], category } = body

    // If no personalization data, return top-rated products
    const isPersonalized = !!(userId || viewedProducts.length > 0 || cartItems.length > 0)

    let recommended: typeof products = []
    let reason = ''

    if (!isPersonalized) {
      // Return best products by rating and sales
      recommended = [...products]
        .sort((a, b) => {
          const aScore = (a.rating || 0) * (a.sales || 0)
          const bScore = (b.rating || 0) * (b.sales || 0)
          return bScore - aScore
        })
        .slice(0, 10)

      reason = 'Selected best products based on ratings and sales'

      return NextResponse.json({
        recommended,
        reason,
        personalized: false,
      })
    }

    // Get viewed and cart product details
    const viewedProductDetails = viewedProducts
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)

    const cartProductDetails = cartItems
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)

    // Build context for Gemini
    const productContext = products.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      price: p.price,
      rating: p.rating,
      tags: p.tags,
      description: p.description,
    }))

    // Use Gemini to generate personalized recommendations
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

    const prompt = `أنت متخصص في التجارة الإلكترونية والتوصيات الشخصية. اختر 10 Productات من القائمة التالية بناءً على المعايير المعطاة.

الProductات المتاحة:
${JSON.stringify(productContext, null, 2)}

بيانات المستخدم:
- الProductات المشاهدة: ${viewedProducts.length > 0 ? viewedProductDetails.map((p) => p?.title).join(', ') : 'لا توجد'}
- عناصر الCart: ${cartItems.length > 0 ? cartProductDetails.map((p) => p?.title).join(', ') : 'لا توجد'}
- الفئة المفضلة: ${category || 'جميع الفئات'}

أرجع النتيجة في صيغة JSON بدون markdown:
{
  "productIds": ["id1", "id2", ...],
  "reason": "السبب باللغة العربية"
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse the JSON response
    let parsedResponse
    try {
      // Remove markdown code blocks if present
      const jsonString = responseText.replace(/```json\n?|\n?```/g, '').trim()
      parsedResponse = JSON.parse(jsonString)
    } catch {
      console.error('[v0] Failed to parse Gemini response:', responseText)
      // Fallback to best products
      recommended = [...products]
        .sort((a, b) => {
          const aScore = (a.rating || 0) * (a.sales || 0)
          const bScore = (b.rating || 0) * (b.sales || 0)
          return bScore - aScore
        })
        .slice(0, 10)
      reason = 'تم اختيار أفضل الProductات'
      return NextResponse.json({
        recommended,
        reason,
        personalized: true,
      })
    }

    // Get recommended products
    const recommendedIds = parsedResponse.productIds || []
    recommended = recommendedIds
      .map((id: string) => products.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 10)

    // If not enough products, fill with top-rated ones
    if (recommended.length < 10) {
      const remaining = [...products]
        .filter((p) => !recommendedIds.includes(p.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10 - recommended.length)
      recommended = [...recommended, ...remaining]
    }

    reason = parsedResponse.reason || 'تم اختيار Productات موصى بها شخصية'

    return NextResponse.json({
      recommended,
      reason,
      personalized: true,
    } as RecommendationResponse)
  } catch (error) {
    console.error('[v0] Recommendations API error:', error)

    // Fallback to best products
    const recommended = [...products]
      .sort((a, b) => {
        const aScore = (a.rating || 0) * (a.sales || 0)
        const bScore = (b.rating || 0) * (b.sales || 0)
        return bScore - aScore
      })
      .slice(0, 10)

    return NextResponse.json(
      {
        recommended,
        reason: 'تم اختيار أفضل الProductات',
        personalized: false,
      } as RecommendationResponse,
      { status: 200 }
    )
  }
}
