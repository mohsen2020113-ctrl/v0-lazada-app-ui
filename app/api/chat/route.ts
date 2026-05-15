import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.message || body.msg || ''
    const language = body.language || 'ar'
    const langMap: Record<string, string> = { ar: 'Arabic', en: 'English', th: 'Thai', fr: 'French' }
    const lang = langMap[language] || 'Arabic'
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) return NextResponse.json({ response: 'مرحباً! أنا مساعد LEE. كيف يمكنني مساعدتك اليوم؟' })

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are LEE Assistant, a friendly shopping assistant for LEE online store. Respond ONLY in ${lang}. Keep response under 3 sentences.\n\nCustomer: ${message}`
          }]
        }]
      })
    })

    if (!res.ok) return NextResponse.json({ response: 'مرحباً! أنا مساعد LEE. كيف يمكنني مساعدتك اليوم؟' })

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'كيف يمكنني مساعدتك؟'
    return NextResponse.json({ response: text })
  } catch (e: any) {
    return NextResponse.json({ response: 'كيف يمكنني مساعدتك في التسوق اليوم؟' })
  }
}
