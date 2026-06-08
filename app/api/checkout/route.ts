import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkoutSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const limitResult = rateLimit(req, { limit: 10, windowMs: 60000 })
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'عدد الطلبات تم تجاوزه' },
        { status: 429 }
      )
    }

    // Check authentication
    const session = req.cookies.get('lee_session')?.value
    if (!session) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validated = checkoutSchema.parse(body)

    // Calculate total
    const total = validated.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validated.items.map(item => ({
        price_data: {
          currency: (process.env.NEXT_PUBLIC_STRIPE_CURRENCY || 'usd').toLowerCase(),
          product_data: {
            name: `Product ${item.productId}`,
            metadata: { productId: item.productId },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/orders?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/checkout?status=cancelled`,
      billing_address_collection: 'required',
      metadata: {
        couponCode: validated.couponCode || 'none',
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة' },
        { status: 400 }
      )
    }
    console.error('[v0] Checkout error:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء جلسة الدفع' },
      { status: 500 }
    )
  }
}
