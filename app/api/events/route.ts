import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/client'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface EventPayload {
  userId?: string
  event: string
  data?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const body: EventPayload = await request.json()
    const { userId, event, data } = body

    if (!event) {
      return NextResponse.json({ error: 'Event type required' }, { status: 400 })
    }

    const eventDoc = {
      userId: userId || 'anonymous',
      event,
      data: data || {},
      timestamp: serverTimestamp(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    }

    const docRef = await addDoc(collection(db, 'user_events'), eventDoc)

    return NextResponse.json(
      { success: true, eventId: docRef.id },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('[v0] Events API error:', error)
    return NextResponse.json(
      { error: 'Failed to record event' },
      { status: 500 }
    )
  }
}
