import { NextRequest, NextResponse } from 'next/server'

// In-memory log store (resets on cold start — use a database for persistence)
const securityLogs: Array<Record<string, unknown>> = [];
const MAX_LOGS = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      'unknown'

    const entry = {
      ...body,
      clientIp,
      serverTimestamp: new Date().toISOString(),
    }

    securityLogs.push(entry)
    if (securityLogs.length > MAX_LOGS) {
      securityLogs.shift()
    }

    console.log('[SECURITY]', JSON.stringify(entry))

    return NextResponse.json({
      success: true,
      id: Math.random().toString(36).substring(2, 11),
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Basic auth check — only allow admin access
  const authHeader = request.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    total: securityLogs.length,
    logs: securityLogs.slice(-50),
  })
}
