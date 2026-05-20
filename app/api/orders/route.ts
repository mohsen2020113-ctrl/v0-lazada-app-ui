import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const SHOPIFY_ADMIN_URL = `https://f61e20-88.myshopify.com/admin/api/2024-01`
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''

export async function POST(req: NextRequest) {
  const { cartId, shippingAddress, paymentId, userId } = await req.json()

  // Get cart items
  const { data: items } = await supabaseAdmin.from('cart_items').select('*').eq('cart_id', cartId)
  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Create order in our DB first
  const { data: order } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: userId,
      checkout_payment_id: paymentId,
      status: 'paid',
      total_amount: totalAmount,
      currency: items[0].currency,
      shipping_address: shippingAddress,
      line_items: items,
    })
    .select()
    .single()

  // Create order in Shopify Admin API
  const shopifyOrder = {
    order: {
      line_items: items.map(item => ({
        variant_id: item.shopify_variant_id.replace('gid://shopify/ProductVariant/', ''),
        quantity: item.quantity,
        price: item.price.toString(),
      })),
      shipping_address: shippingAddress,
      financial_status: 'paid',
      note: `LEE Order ${order.id} | Payment: ${paymentId}`,
      tags: 'LEE-headless',
    },
  }

  try {
    const shopifyRes = await fetch(`${SHOPIFY_ADMIN_URL}/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify(shopifyOrder),
    })

    const shopifyData = await shopifyRes.json()
    const shopifyOrderId = shopifyData.order?.id?.toString()
    const shopifyOrderNumber = shopifyData.order?.order_number?.toString()

    // Update our order with Shopify IDs
    await supabaseAdmin
      .from('orders')
      .update({ shopify_order_id: shopifyOrderId, shopify_order_number: shopifyOrderNumber })
      .eq('id', order.id)

    // Clear cart
    await supabaseAdmin.from('cart_items').delete().eq('cart_id', cartId)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      shopifyOrderNumber,
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Shopify order failed', detail: e.message }, { status: 500 })
  }
}
