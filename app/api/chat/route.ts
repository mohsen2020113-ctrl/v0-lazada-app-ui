import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
          const body = await request.json().catch(() => ({}))
          const message = body.message || body.msg || body.content || ''
          const language = body.language || 'ar'
          const langMap: Record<string, string> = { ar: 'Arabic', en: 'English', ur: 'Urdu', fr: 'French' }
          const lang = langMap[language] || 'Arabic'
          const apiKey = process.env.GEMINI_API_KEY

      if (!apiKey || !message) {
              return NextResponse.json({ response: 'Hello! How can I help you with shopping today? 🛍️' })
      }

      const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                              contents: [{ parts: [{ text: `You are LEE Assistant for LEE online shopping. Respond in ${lang} only. Max 2 sentences.\n\nCustomer: ${message}` }] }]
                  })
        }
            )
          const data = await res.json()
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          return NextResponse.json({ response: text || 'How can I help you with shopping?' })
    } catch {
          return NextResponse.json({ response: 'How can I help you with shopping?' })
    }
}
