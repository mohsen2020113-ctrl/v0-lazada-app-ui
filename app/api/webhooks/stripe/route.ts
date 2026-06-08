import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { logger } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (error) {
    logger.error('Webhook signature verification failed', error as Error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(paymentIntent)
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleChargeRefunded(charge)
        break
      }
      default:
        logger.info(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook processing error', error as Error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    logger.logPayment('checkout_completed', session.amount_total || 0, 'usd', 'completed', {
      sessionId: session.id,
      customerId: session.customer,
    })

    // Create order in database
    if (session.metadata?.couponCode && session.metadata.couponCode !== 'none') {
      await supabaseAdmin
        .from('orders')
        .insert({
          session_id: session.id,
          status: 'completed',
          amount: (session.amount_total || 0) / 100,
          currency: session.currency,
          coupon_code: session.metadata.couponCode,
        })
    }
  } catch (error) {
    logger.error('Failed to handle checkout completion', error as Error)
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    logger.logPayment('payment_succeeded', paymentIntent.amount / 100, paymentIntent.currency, 'succeeded', {
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    logger.error('Failed to handle payment succeeded', error as Error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    logger.logPayment('payment_failed', paymentIntent.amount / 100, paymentIntent.currency, 'failed', {
      paymentIntentId: paymentIntent.id,
      lastPaymentError: paymentIntent.last_payment_error?.message,
    })
  } catch (error) {
    logger.error('Failed to handle payment failed', error as Error)
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    logger.logPayment('charge_refunded', (charge.amount_refunded || 0) / 100, charge.currency, 'refunded', {
      chargeId: charge.id,
    })

    // Update order status to refunded
    await supabaseAdmin
      .from('orders')
      .update({ status: 'refunded' })
      .eq('session_id', charge.payment_intent)
  } catch (error) {
    logger.error('Failed to handle charge refunded', error as Error)
  }
}
