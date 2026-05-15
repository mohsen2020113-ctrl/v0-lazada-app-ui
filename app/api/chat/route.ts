import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.message || body.msg || ''
    const language = body.language || 'ar'
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) return NextResponse.json({ response: 'DEBUG: No API key configured' })

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Customer: ${message}` }] }]
      })
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({
        response: `DEBUG Gemini ${res.status}: ${data?.error?.message || data?.error?.status || JSON.stringify(data).substring(0, 200)}`
      })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'كيف يمكنني مساعدتك؟'
    return NextResponse.json({ response: text })
  } catch (e: any) {
    return NextResponse.json({ response: `DEBUG Exception: ${e.message}` })
  }
}
