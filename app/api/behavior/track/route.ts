import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type EventType = 'view' | 'search' | 'add_to_cart' | 'purchase' | 'wishlist';

interface TrackingInput {
  userId: string;
  event: EventType;
  productId?: string;
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackingInput = await request.json();
    const { userId, event, productId, metadata } = body;

    if (!userId || !event) {
      return NextResponse.json(
        { error: 'userId and event required' },
        { status: 400 }
      );
    }

    const validEvents: EventType[] = ['view', 'search', 'add_to_cart', 'purchase', 'wishlist'];
    if (!validEvents.includes(event)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    const eventData = {
      userId,
      event,
      productId: productId || null,
      metadata: metadata || {},
      timestamp: serverTimestamp(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    };

    const docRef = await addDoc(collection(db, 'user_events'), eventData);

    return NextResponse.json({
      success: true,
      eventId: docRef.id,
    });
  } catch (error) {
    console.error('Behavior tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
