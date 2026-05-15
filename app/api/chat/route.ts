import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body.message || body.msg || ''
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) return NextResponse.json({ response: 'DEBUG: No API key' })

    // Test gemini-2.0-flash
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Customer: ${message}` }] }] })
    })
    const data = await res.json()
    
    if (!res.ok) {
      // Try listing models to see what's available
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      const listData = await listRes.json()
      const modelNames = (listData?.models || []).map((m: any) => m.name).slice(0, 10).join(' | ')
      return NextResponse.json({ 
        response: `DEBUG 2.0-flash ${res.status}: ${data?.error?.message?.substring(0, 100)} | Models: ${modelNames}`
      })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'ok'
    return NextResponse.json({ response: text })
  } catch (e: any) {
    return NextResponse.json({ response: `DEBUG Exception: ${e.message}` })
  }
}
